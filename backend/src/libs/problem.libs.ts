import axios from 'axios';
import { Judge0Submission, Judge0Result } from '../types/index.js';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;

const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    CPP: 54,
    GO: 60,
};

const LANGUAGE_NAMES: Record<number, string> = {
    74: 'TypeScript',
    63: 'JavaScript',
    71: 'Python',
    62: 'Java',
};

export function getJudge0LanguageId(language: string): number | undefined {
    return languageMap[language.toUpperCase()];
}

export function getLanguageName(languageId: number): string {
    return LANGUAGE_NAMES[languageId] || 'Unknown';
}

// Poll Judge0 for result until it's no longer "In Queue" or "Processing"
export async function getJudge0Result(token: string): Promise<Judge0Result> {
    let result: Judge0Result;
    while (true) {
        const response = await axios.get(`${JUDGE0_API_URL}/submissions/${token}`);
        result = response.data;
        if (result.status.id !== 1 && result.status.id !== 2) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return result;
}

export const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Utility: split into chunks of max 20 for Judge0 batch
export function chunkArray<T>(arr: T[], size: number = 20): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// Submit batch of submissions to Judge0
export async function submitBatch(
    submissions: Judge0Submission[]
): Promise<{ token: string }[]> {
    const { data } = await axios.post(
        `${JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        { submissions }
    );
    console.log('Batch submission response:', data);
    return data;
}

// Poll all tokens until they are done
export async function pollBatchResults(tokens: string[]): Promise<Judge0Result[]> {
    while (true) {
        const { data } = await axios.get(`${JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(','),
                base64_encoded: false,
            },
        });

        const results: Judge0Result[] = data.submissions;
        const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);
        if (isAllDone) return results;

        await sleep(1000);
    }
}
