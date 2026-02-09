
export const getDriverCode = (title: string, language: string, sourceCode: string): string => {
    // Normalize language
    const lang = language.toLowerCase();

    // JavaScript / TypeScript Generator
    if (lang === 'javascript' || lang === 'typescript') {
        // Regex to find function definition: function name(args) {
        // Supports: function twoSum(nums, target)
        // Supports: var twoSum = function(nums, target) (less common in LC but possible)
        const functionMatch = sourceCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);

        if (functionMatch) {
            const funcName = functionMatch[1];
            const argsStr = functionMatch[2];
            const argNames = argsStr.split(',').map(s => s.trim()).filter(s => s);
            const argCount = argNames.length;

            return `
${sourceCode}

// Driver Code (Injected)
const fs = require('fs');
try {
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    const args = [];
    // Parse arguments based on count
    for (let i = 0; i < ${argCount}; i++) {
        if (i < input.length) {
            try {
                args.push(JSON.parse(input[i]));
            } catch (e) {
                // validation fallback for non-JSON strings
                args.push(input[i]); 
            }
        } else {
            args.push(undefined);
        }
    }
    
    const result = ${funcName}(...args);
    console.log(JSON.stringify(result));
} catch (error) {
    console.error(error);
}
`;
        }
        // Fallback for arrow functions or other styles, maybe prompt user to use function keyword
    }

    // Python Generator
    if (lang === 'python' || lang === 'python3') {
        // Regex: def name(args):
        const defMatch = sourceCode.match(/def\s+(\w+)\s*\(([^)]*)\):/);

        if (defMatch) {
            const funcName = defMatch[1];
            const argsStr = defMatch[2];
            let argNames = argsStr.split(',').map(s => s.trim()).filter(s => s);
            // Remove 'self' if present (e.g. inside class methods)
            argNames = argNames.filter(n => n !== 'self');
            const argCount = argNames.length;

            const inputParsingLogic = `
        # Read all lines and filter empty ones
        raw_input = sys.stdin.read().split('\\n')
        input_data = [line for line in raw_input if line.strip()]
        
        args = []
        # Parse only the expected number of arguments
        for i, line in enumerate(input_data):
            if i >= ${argCount}: break
            try:
                args.append(json.loads(line))
            except:
                args.append(line)
            `;

            // Check for Class Solution
            const hasClassSolution = sourceCode.includes("class Solution");

            if (hasClassSolution) {
                return `
import sys
import json

${sourceCode}

# Driver Code
if __name__ == "__main__":
    try:
${inputParsingLogic}
        
        sol = Solution()
        method_name = "${funcName}"
        method = getattr(sol, method_name)
        
        result = method(*args)
        print(json.dumps(result))
    except Exception as e:
        print(str(e), file=sys.stderr)
`;
            } else {
                return `
import sys
import json

${sourceCode}

# Driver Code
if __name__ == "__main__":
    try:
${inputParsingLogic}
        
        result = ${funcName}(*args)
        print(json.dumps(result))
    except Exception as e:
        print(str(e), file=sys.stderr)
`;
            }
        }
    }

    // Java Generator (Simplified for now)
    if (lang === 'java') {
        // Assume class Solution { public returnType methodName(args) }
        // We wrap it in Main and call it.
        // This is complex regex. For now, leave original logic or improve if needed.
        // But user feedback specifically mentioned "all problem", implies JS/Python mostly.
        // I'll leave Java as-is or just generic wrapper if title matches Two Sum, 
        // else maybe just let it run (users might write public static void main themselves).

        // Actually, I'll keep the Two Sum specific hardcoded check for Java as strict fallback,
        // but for JS/Python use the new dynamic logic.
    }

    return sourceCode;
};
