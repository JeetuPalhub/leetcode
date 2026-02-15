import { Request, Response, NextFunction } from 'express';

// Extended user type from Prisma
export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    role: 'ADMIN' | 'USER';
    image: string | null;
}

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user: AuthUser;
}

// JWT Payload
export interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}

// Auth Controller Types
export interface RegisterBody {
    email: string;
    password: string;
    name: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

// Problem Controller Types
export interface TestCase {
    input: string;
    output: string;
}

export interface Example {
    input: string;
    output: string;
    explanation?: string;
}

export interface CodeSnippets {
    [language: string]: string;
}

export interface ReferenceSolutions {
    [language: string]: string;
}

export interface CreateProblemBody {
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags: string[];
    examples: Example[];
    constraints: string;
    testCases: TestCase[];
    codeSnippets: CodeSnippets;
    referenceSolutions: ReferenceSolutions;
}

export interface UpdateProblemBody extends CreateProblemBody { }

// Execute Code Controller Types
export interface ExecuteCodeBody {
    source_code: string;
    language_id: number;
    stdin: string[];
    expected_outputs: string[];
    problemId: string;
}

// Playlist Controller Types
export interface CreatePlaylistBody {
    name: string;
    description?: string;
}

export interface AddProblemsToPlaylistBody {
    problemIds: string[];
}

// Judge0 Types
export interface Judge0Submission {
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output: string;
}

export interface Judge0Result {
    token: string;
    status: {
        id: number;
        description: string;
    };
    stdout?: string;
    stderr?: string;
    compile_output?: string;
    time?: string;
    memory?: number;
}

// Async handler wrapper type
export type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response>;
