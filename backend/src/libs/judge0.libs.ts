import axios from 'axios';
import { env } from '../config/env.js';
import { Judge0Submission, Judge0Result } from '../types/index.js';
import logger from '../config/logger.js';

const JUDGE0_LOCAL_URL = env.JUDGE0_API_URL.replace(/\/$/, '');
const RAPIDAPI_URL = 'https://judge0-ce.p.rapidapi.com';

const getClient = (useRapidAPI: boolean = false) => {
    const baseURL = useRapidAPI ? RAPIDAPI_URL : JUDGE0_LOCAL_URL;
    const headers: Record<string, string> = {};

    if (useRapidAPI && env.RAPIDAPI_KEY) {
        headers['X-RapidAPI-Key'] = env.RAPIDAPI_KEY;
        headers['X-RapidAPI-Host'] = env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
    }

    return axios.create({
        baseURL,
        headers,
        timeout: 10000,
    });
};

/**
 * Encodes a string to Base64 (Standard Judge0 requirement for code/stdin)
 */
const toBase64 = (str: string) => Buffer.from(str || '').toString('base64');

import { spawnSync } from 'child_process';

/**
 * Decodes a Base64 string from Judge0 response
 */
const fromBase64 = (str: string | null | undefined) =>
    str ? Buffer.from(str, 'base64').toString('utf8') : '';

/**
 * Local Fallback: Executes JavaScript code using the local Node.js process.
 * Used when Judge0 (Local & RapidAPI) is unreachable.
 */
async function executeLocallyJS(sourceCode: string, stdin: string): Promise<Judge0Result> {
    logger.info('Using local Node.js fallback for execution');
    const startTime = Date.now();

    try {
        // Simple but effective: Run code in a separate node process
        // We wrap it in a try-catch to capture errors
        const wrappedCode = `
            try {
                const stdin = ${JSON.stringify(stdin)};
                ${sourceCode}
            } catch (err) {
                process.stderr.write(err.stack || err.message);
                process.exit(1);
            }
        `;

        const result = spawnSync('node', ['-e', wrappedCode], {
            input: stdin,
            timeout: 5000, // 5 second timeout
            maxBuffer: 1024 * 1024, // 1MB buffer
        });

        const time = ((Date.now() - startTime) / 1000).toFixed(3);

        return {
            token: 'local-fallback',
            status: {
                id: result.status === 0 ? 3 : 11, // 3: Accepted, 11: Runtime Error
                description: result.status === 0 ? 'Accepted' : 'Runtime Error',
            },
            stdout: result.stdout?.toString() || '',
            stderr: result.stderr?.toString() || '',
            compile_output: '',
            time: time.toString(),
            memory: 0, // Memory tracking not available for local spawn
        };
    } catch (err: any) {
        return {
            token: 'local-fallback-error',
            status: { id: 13, description: 'Internal Error' },
            stdout: '',
            stderr: err.message,
            time: '0',
            memory: 0,
        };
    }
}

/**
 * Local Fallback: Executes Python code using the local Python process.
 * Used when Judge0 is unreachable.
 */
async function executeLocallyPython(sourceCode: string, stdin: string): Promise<Judge0Result> {
    logger.info('Using local Python fallback for execution');
    const startTime = Date.now();

    try {
        const result = spawnSync('python', ['-c', sourceCode], {
            input: stdin,
            timeout: 5000,
            maxBuffer: 1024 * 1024,
        });

        const time = ((Date.now() - startTime) / 1000).toFixed(3);

        return {
            token: 'local-python-fallback',
            status: {
                id: result.status === 0 ? 3 : 11,
                description: result.status === 0 ? 'Accepted' : 'Runtime Error',
            },
            stdout: result.stdout?.toString() || '',
            stderr: result.stderr?.toString() || '',
            compile_output: '',
            time: time.toString(),
            memory: 0,
        };
    } catch (err: any) {
        return {
            token: 'local-fallback-error',
            status: { id: 13, description: 'Internal Error' },
            stdout: '',
            stderr: err.message,
            time: '0',
            memory: 0,
        };
    }
}

/**
 * Executes a single piece of code using Judge0 (Local or RapidAPI)
 */
export async function executeWithJudge0(
    sourceCode: string,
    languageId: number,
    stdin: string,
    expectedOutput?: string
): Promise<Judge0Result> {
    const tryExecution = async (useRapidAPI: boolean): Promise<Judge0Result> => {
        const client = getClient(useRapidAPI);
        const response = await client.post(`/submissions?base64_encoded=true&wait=true`, {
            source_code: toBase64(sourceCode),
            language_id: languageId,
            stdin: toBase64(stdin),
            expected_output: expectedOutput ? toBase64(expectedOutput) : undefined,
        });

        const result = response.data;
        return {
            ...result,
            stdout: fromBase64(result.stdout),
            stderr: fromBase64(result.stderr),
            compile_output: fromBase64(result.compile_output),
        };
    };

    try {
        // 1. Try Local Judge0
        return await tryExecution(false);
    } catch (error) {
        // 2. Try RapidAPI if local fails and key is present
        if (env.RAPIDAPI_KEY) {
            try {
                logger.info('Local Judge0 failed, trying RapidAPI...');
                return await tryExecution(true);
            } catch (rapidError) {
                logger.error({ rapidError }, 'RapidAPI execution failed');
            }
        }

        // 3. Last resort: Local Fallbacks
        if (languageId === 63) { // JAVASCRIPT
            return executeLocallyJS(sourceCode, stdin);
        }
        if (languageId === 71) { // PYTHON
            return executeLocallyPython(sourceCode, stdin);
        }

        throw error;
    }
}

/**
 * Executes multiple test cases using Judge0 batching (Local or RapidAPI)
 */
export async function executeBatchWithJudge0(
    sourceCode: string,
    languageId: number,
    stdins: string[],
    expectedOutputs?: string[]
): Promise<Judge0Result[]> {
    const tryBatchExecution = async (useRapidAPI: boolean): Promise<Judge0Result[]> => {
        const client = getClient(useRapidAPI);
        const submissions = stdins.map((stdin, i) => ({
            source_code: toBase64(sourceCode),
            language_id: languageId,
            stdin: toBase64(stdin),
            expected_output: expectedOutputs?.[i] ? toBase64(expectedOutputs[i]) : undefined,
        }));

        const createRes = await client.post(`/submissions/batch?base64_encoded=true`, {
            submissions,
        });

        const tokens = createRes.data.map((s: { token: string }) => s.token).join(',');

        let results: any[] = [];
        let completed = false;
        let attempts = 0;
        const maxAttempts = 12;

        while (!completed && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            attempts++;

            const statusRes = await client.get(
                `/submissions/batch?tokens=${tokens}&base64_encoded=true&fields=token,status,stdout,stderr,compile_output,time,memory`
            );
            results = statusRes.data.submissions;

            completed = results.every(
                (r: any) => r.status.id !== 1 && r.status.id !== 2
            );
        }

        return results.map((result: any) => ({
            ...result,
            stdout: fromBase64(result.stdout),
            stderr: fromBase64(result.stderr),
            compile_output: fromBase64(result.compile_output),
        }));
    };

    try {
        // 1. Try Local batch
        return await tryBatchExecution(false);
    } catch (error) {
        // 2. Try RapidAPI batch
        if (env.RAPIDAPI_KEY) {
            try {
                logger.info('Local Judge0 batch failed, trying RapidAPI...');
                return await tryBatchExecution(true);
            } catch (rapidError) {
                logger.error({ rapidError }, 'RapidAPI batch execution failed');
            }
        }

        // 3. Last resort: Local Fallbacks
        if (languageId === 63) { // JAVASCRIPT
            logger.info('All external options failed, using local JS fallback for batch');
            const localResults = [];
            for (const stdin of stdins) {
                localResults.push(await executeLocallyJS(sourceCode, stdin));
            }
            return localResults;
        }
        if (languageId === 71) { // PYTHON
            logger.info('All external options failed, using local Python fallback for batch');
            const localResults = [];
            for (const stdin of stdins) {
                localResults.push(await executeLocallyPython(sourceCode, stdin));
            }
            return localResults;
        }

        throw error;
    }
}

export const judge0LanguageMap: Record<string, number> = {
    C: 50,
    'C++': 54,
    CPP: 54,
    GO: 60,
    JAVA: 62,
    JAVASCRIPT: 63,
    JS: 63,
    PYTHON: 71,
    RUST: 73,
    TYPESCRIPT: 74,
    TS: 74,
};

export function getJudge0LanguageId(language: string): number | undefined {
    const normalized = String(language || '').trim().toUpperCase();
    return judge0LanguageMap[normalized];
}

const LANGUAGE_NAMES: Record<number, string> = {
    50: 'C',
    54: 'C++',
    60: 'Go',
    62: 'Java',
    63: 'JavaScript',
    71: 'Python',
    73: 'Rust',
    74: 'TypeScript',
};

export function getLanguageName(languageId: number): string {
    return LANGUAGE_NAMES[languageId] || 'Unknown';
}
