/**
 * Validated environment configuration.
 * All env vars are centralized here so missing values are caught once
 * instead of silently failing across the app.
 */

const env = {
    BACKEND_API_BASEURL: (
        import.meta.env.VITE_BACKEND_API_BASEURL || 'http://localhost:3000/api/v1'
    ).trim(),
    GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || '',
};

// Warn about missing optional vars in development
if (import.meta.env.DEV) {
    if (!env.GROQ_API_KEY) {
        console.warn(
            '[env] VITE_GROQ_API_KEY is not set — AI features (hints, code review, solutions) will not work.'
        );
    }
}

export default env;
