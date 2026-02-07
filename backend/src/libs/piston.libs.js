import axios from "axios";

// Piston API base URL - free hosted service, no setup required!
const PISTON_API_URL = "https://emkc.org/api/v2/piston";

// Language mapping for Piston API
const PISTON_LANGUAGES = {
    "javascript": { language: "javascript", version: "18.15.0" },
    "JAVASCRIPT": { language: "javascript", version: "18.15.0" },
    "python": { language: "python", version: "3.10.0" },
    "PYTHON": { language: "python", version: "3.10.0" },
    "java": { language: "java", version: "15.0.2" },
    "JAVA": { language: "java", version: "15.0.2" },
    "cpp": { language: "cpp", version: "10.2.0" },
    "CPP": { language: "cpp", version: "10.2.0" },
};

// Map language ID (from Judge0 format) to Piston language
export function getPistonLanguage(languageId) {
    const languageMap = {
        63: "javascript",
        71: "python",
        62: "java",
        54: "cpp",
    };
    return languageMap[languageId] || "javascript";
}

// Get language name from language ID
export function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
        54: "C++",
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
}

// Execute code using Piston API
export async function executeWithPiston(sourceCode, languageId, stdin) {
    const langKey = getPistonLanguage(languageId);
    const langConfig = PISTON_LANGUAGES[langKey] || PISTON_LANGUAGES["javascript"];

    try {
        const response = await axios.post(`${PISTON_API_URL}/execute`, {
            language: langConfig.language,
            version: langConfig.version,
            files: [
                {
                    name: `main.${getFileExtension(langConfig.language)}`,
                    content: sourceCode,
                },
            ],
            stdin: stdin || "",
            args: [],
            compile_timeout: 10000,
            run_timeout: 5000,
            compile_memory_limit: -1,
            run_memory_limit: -1,
        });

        return {
            stdout: response.data.run?.stdout || "",
            stderr: response.data.run?.stderr || response.data.compile?.stderr || "",
            compile_output: response.data.compile?.output || null,
            status: {
                id: response.data.run?.code === 0 ? 3 : 11, // 3 = Accepted, 11 = Runtime Error
                description: response.data.run?.code === 0 ? "Accepted" : (response.data.run?.stderr ? "Runtime Error" : "Accepted"),
            },
            time: response.data.run?.time || "0",
            memory: response.data.run?.memory || 0,
        };
    } catch (error) {
        console.error("Piston API error:", error.response?.data || error.message);
        return {
            stdout: "",
            stderr: error.response?.data?.message || error.message || "Execution failed",
            compile_output: null,
            status: {
                id: 13, // Internal Error
                description: "Internal Error",
            },
            time: "0",
            memory: 0,
        };
    }
}

// Execute multiple test cases
export async function executeBatchWithPiston(sourceCode, languageId, stdinArray) {
    const results = [];

    for (const stdin of stdinArray) {
        const result = await executeWithPiston(sourceCode, languageId, stdin);
        results.push(result);
        // Small delay to respect rate limits (5 req/s)
        await sleep(250);
    }

    return results;
}

// Helper: Get file extension for language
function getFileExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java",
        cpp: "cpp",
        typescript: "ts",
    };
    return extensions[language] || "txt";
}

// Helper: Sleep function
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Legacy Judge0 functions (kept for compatibility if user wants to switch back)
export function getJudge0LanguageId(language) {
    const languageMap = {
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "JAVA": 62,
        "CPP": 54,
        "GO": 60,
    };
    return languageMap[language.toUpperCase()];
}
