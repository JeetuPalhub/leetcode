import { Request, Response } from 'express';
import { db } from '../libs/db.js';
import { executeBatchWithJudge0, getJudge0LanguageId, getLanguageName } from '../libs/judge0.libs.js';
import { ExecuteCodeBody } from '../types/index.js';
import { getDriverCode } from '../libs/driverCode.js';

// Main controller function to handle code execution and submission using Judge0 API
export const executeCode = async (req: Request, res: Response): Promise<void> => {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
        req.body as ExecuteCodeBody;

    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const userId = req.user.id;

    try {
        // 1. Validate incoming test cases
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            res.status(400).json({ error: 'Invalid or missing test cases' });
            return;
        }

        console.log('🚀 Executing code with Judge0 API...');
        console.log(`Language ID: ${language_id}, Test cases: ${stdin.length}`);

        // Fetch problem to identify if driver injection is needed
        const problem = await db.problem.findUnique({
            where: { id: problemId },
            select: { title: true }
        });

        const languageName = getLanguageName(language_id).toLowerCase();
        const codeToExecute = problem
            ? getDriverCode(problem.title, languageName, source_code)
            : source_code;

        // 2. Execute all test cases using Judge0 API (batch)
        const results = await executeBatchWithJudge0(codeToExecute, language_id, stdin, expected_outputs);

        // 3. Analyze test results
        let allPassed = true;
        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout?.trim() || '';
            const stderr = result.stderr?.trim() || '';
            const compile_output = result.compile_output?.trim() || '';

            // Judge0 status 3 is "Accepted"
            const passed = result.status.id === 3;

            if (!passed) allPassed = false;

            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_outputs[i]?.trim(),
                stderr: stderr || null,
                compile_output: compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined,
            };
        });

        console.log(`📊 Results: ${allPassed ? 'All Passed ✅' : 'Some Failed ❌'}`);

        // 4. Store submission summary
        const submission = await db.submission.create({
            data: {
                userId,
                problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join('\n'),
                stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
                stderr: detailedResults.some((r) => r.stderr)
                    ? JSON.stringify(detailedResults.map((r) => r.stderr))
                    : null,
                compileOutput: detailedResults.some((r) => r.compile_output)
                    ? JSON.stringify(detailedResults.map((r) => r.compile_output))
                    : null,
                status: allPassed ? 'Accepted' : 'Wrong Answer',
                memory: detailedResults.some((r) => r.memory)
                    ? JSON.stringify(detailedResults.map((r) => r.memory))
                    : null,
                time: detailedResults.some((r) => r.time)
                    ? JSON.stringify(detailedResults.map((r) => r.time))
                    : null,
            },
        });

        // 5. Mark problem as solved if all test cases passed
        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: { userId, problemId },
                },
                update: {},
                create: { userId, problemId },
            });
        }

        // 6. Save individual test case results
        const testCaseResults = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time,
        }));

        await db.testCaseResult.createMany({ data: testCaseResults });

        // 7. Fetch full submission with test cases
        const submissionWithTestCases = await db.submission.findUnique({
            where: { id: submission.id },
            include: { testCases: true },
        });

        // 8. Respond to client
        res.status(200).json({
            success: true,
            message: 'Code executed successfully',
            submission: submissionWithTestCases,
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error executing code:', err.message);
        res.status(500).json({ error: 'Failed to execute code', details: err.message });
    }
};
