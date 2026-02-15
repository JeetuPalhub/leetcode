import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JUDGE0_API_URL: z.string().url().optional().default('http://localhost:2358'),
    GEMINI_API_KEY: z.string().optional().default(''),
    PORT: z.coerce.number().optional().default(3000),
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .optional()
        .default('development'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        const missing = error.issues
            .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
            .join('\n');
        console.error(
            `\n❌ Invalid environment variables:\n${missing}\n\nPlease check your .env file.\n`
        );
        process.exit(1);
    }
    throw error;
}

export { env };
