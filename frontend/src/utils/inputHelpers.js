// Input Helper Utilities for Code Execution
// These templates ensure proper stdin reading for each language

/**
 * JavaScript readline template for reading stdin
 * Handles multi-line input and single line cases
 */
export const jsReadlineTemplate = `// Input handling
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  // Your code here - access input via lines array
  // lines[0] = first line of input
  // lines[1] = second line, etc.
  
  // Example: const n = parseInt(lines[0]);
  
  // TODO: Implement solution
});
`;

/**
 * Python input template for reading stdin
 */
export const pythonReadlineTemplate = `import sys

def solve():
    # Read input - use one of these methods:
    # Single value: n = int(input())
    # String: s = input().strip()
    # Array: arr = list(map(int, input().split()))
    # Multiple lines: lines = sys.stdin.read().strip().split('\\n')
    
    # TODO: Implement solution
    pass

if __name__ == "__main__":
    solve()
`;

/**
 * Java Scanner template for reading stdin
 */
export const javaReadlineTemplate = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input - use one of these methods:
        // int n = sc.nextInt();
        // String s = sc.nextLine();
        // double d = sc.nextDouble();
        
        // TODO: Implement solution
        
        sc.close();
    }
}
`;

/**
 * Get the readline wrapper for a given language
 * @param {string} language - JAVASCRIPT, PYTHON, or JAVA
 * @param {string} userCode - The user's solution code
 * @returns {string} - Complete code with input handling
 */
export const wrapWithReadline = (language, userCode) => {
    // If code already has input handling, return as-is
    if (hasInputHandling(language, userCode)) {
        return userCode;
    }

    // Otherwise, code should already include boilerplate from template
    return userCode;
};

/**
 * Check if code already has input handling
 */
export const hasInputHandling = (language, code) => {
    const patterns = {
        JAVASCRIPT: /readline|process\.stdin/i,
        PYTHON: /input\s*\(|sys\.stdin/i,
        JAVA: /Scanner|BufferedReader/i,
    };

    return patterns[language]?.test(code) || false;
};

/**
 * Get starter template based on language
 */
export const getStarterTemplate = (language) => {
    const templates = {
        JAVASCRIPT: jsReadlineTemplate,
        PYTHON: pythonReadlineTemplate,
        JAVA: javaReadlineTemplate,
    };

    return templates[language] || jsReadlineTemplate;
};

export default {
    jsReadlineTemplate,
    pythonReadlineTemplate,
    javaReadlineTemplate,
    wrapWithReadline,
    hasInputHandling,
    getStarterTemplate,
};
