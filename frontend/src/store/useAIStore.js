import { create } from "zustand";
import toast from "react-hot-toast";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

// Rate limit tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useAIStore = create((set, get) => ({
    hint: null,
    suggestion: null,
    isLoadingHint: false,
    isLoadingSuggestion: false,
    error: null,
    lastRequestTime: 0,

    // Get a hint for the current problem
    getHint: async (problemDescription, userCode, language) => {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        // Check cooldown
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
            toast.error(`Please wait ${waitTime}s before requesting another hint`);
            return;
        }

        set({ isLoadingHint: true, error: null, hint: null });

        try {
            if (!GEMINI_API_KEY) {
                toast.error("Gemini API key not configured");
                set({
                    hint: "💡 AI hints are not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the server.",
                    isLoadingHint: false
                });
                return;
            }

            lastRequestTime = Date.now();

            const prompt = `You are a helpful coding tutor. Give a SHORT hint (2-3 sentences max) for this problem without giving away the solution:

Problem: ${problemDescription?.substring(0, 500) || "No description"}

Language: ${language}

Focus on algorithm approach or key concept. Do not provide code.`;

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || "";

                // Handle rate limit specifically
                if (errorMsg.includes("quota") || errorMsg.includes("rate") || response.status === 429) {
                    const retryMatch = errorMsg.match(/retry in ([\d.]+)s/i);
                    const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

                    toast.error(`Rate limited. Wait ${retrySeconds}s and try again.`);
                    set({
                        hint: `⏱️ Rate limited by Google. Please wait ${retrySeconds} seconds before trying again.\n\n💡 Tip: The free tier allows ~15 requests per minute.`,
                        isLoadingHint: false,
                        error: "rate_limit"
                    });
                    return;
                }

                throw new Error(errorMsg || `API error: ${response.status}`);
            }

            const data = await response.json();
            const hintText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate hint.";

            toast.success("Hint generated!");
            set({ hint: hintText, isLoadingHint: false });
        } catch (error) {
            console.error("AI Hint Error:", error);
            toast.error(`Error: ${error.message}`);
            set({
                hint: `Unable to get AI hint: ${error.message}`,
                isLoadingHint: false,
                error: error.message
            });
        }
    },

    // Get code suggestions/improvements
    getSuggestion: async (problemDescription, userCode, language) => {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        // Check cooldown
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
            toast.error(`Please wait ${waitTime}s before requesting another review`);
            return;
        }

        if (!userCode || userCode.trim().length < 10) {
            toast.error("Write some code first before requesting a review");
            return;
        }

        set({ isLoadingSuggestion: true, error: null, suggestion: null });

        try {
            if (!GEMINI_API_KEY) {
                set({
                    suggestion: "💡 AI suggestions are not configured. Add VITE_GEMINI_API_KEY to your .env file.",
                    isLoadingSuggestion: false
                });
                return;
            }

            lastRequestTime = Date.now();

            const prompt = `Review this ${language} code briefly (3-4 points max):

Code:
${userCode.substring(0, 1000)}

Check: 1) Bugs? 2) Complexity issues? 3) One improvement?
Keep each point to 1-2 sentences.`;

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || "";

                if (errorMsg.includes("quota") || errorMsg.includes("rate") || response.status === 429) {
                    const retryMatch = errorMsg.match(/retry in ([\d.]+)s/i);
                    const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

                    toast.error(`Rate limited. Wait ${retrySeconds}s and try again.`);
                    set({
                        suggestion: `⏱️ Rate limited. Please wait ${retrySeconds} seconds.`,
                        isLoadingSuggestion: false,
                        error: "rate_limit"
                    });
                    return;
                }

                throw new Error(errorMsg || `API error: ${response.status}`);
            }

            const data = await response.json();
            const suggestionText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate suggestions.";

            toast.success("Code review complete!");
            set({ suggestion: suggestionText, isLoadingSuggestion: false });
        } catch (error) {
            console.error("AI Suggestion Error:", error);
            toast.error(`Error: ${error.message}`);
            set({
                suggestion: `Unable to get review: ${error.message}`,
                isLoadingSuggestion: false,
                error: error.message
            });
        }
    },

    // Clear hints and suggestions
    clearAI: () => set({ hint: null, suggestion: null, error: null }),
}));
