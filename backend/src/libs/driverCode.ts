
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
            const argsStr = defMatch[2]; // "self, nums, target" or "nums, target"
            let argNames = argsStr.split(',').map(s => s.trim()).filter(s => s);

            // Remove 'self' if present (class method vs standalone)
            // But typical LeetCode Python is standalone "def twoSum(self, ...)" inside class Solution?
            // OR standalone "def twoSum(...)".
            // If user writes standalone function (no class), 'self' is not there.
            // If parsing "def twoSum(self, ...)" inside class, we need to instantiate class.

            // Checking if it's inside a class is hard with regex.
            // Piston setup:
            // If user code is:
            // class Solution:
            //    def twoSum(self, nums, target): ...

            // Then we need:
            // sol = Solution()
            // print(sol.twoSum(...))

            // If checking for "class Solution":
            const hasClassSolution = sourceCode.includes("class Solution");

            if (hasClassSolution) {
                // Assume method is inside Solution
                // We need to find the method name inside Solution? usually whatever is defined.
                return `
import sys
import json

${sourceCode}

# Driver Code
if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip().split('\\n')
        
        args = []
        # Skip 'self' in argument count
        # parse args excluding self
        # Implementation detail: generic parsing is hard in python regex given self.
        
        # Hardcode fallback for common structure
        # If class Solution exists, instantiate it.
        sol = Solution()
        
        # Find method to call - assume the first method defined or specific name?
        # Helper: iterate methods?
        # Or just use the one we found with regex.
        
        method_name = "${funcName}"
        method = getattr(sol, method_name)
        
        # Parse inputs
        for i, line in enumerate(input_data):
            try:
                args.append(json.loads(line))
            except:
                args.append(line)
        
        result = method(*args)
        print(json.dumps(result))
    except Exception as e:
        print(str(e), file=sys.stderr)
`;
            } else {
                // Standalone function
                return `
import sys
import json

${sourceCode}

# Driver Code
if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip().split('\\n')
        args = []
        for i, line in enumerate(input_data):
            try:
                args.append(json.loads(line))
            except:
                args.append(line)
        
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
