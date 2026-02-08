import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../libs/db.js';
import { AuthUser, JwtPayload } from '../types/index.js';

// Extend Express Request globally
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ message: 'Unauthorized - No Token Provided' });
            return;
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        } catch (err) {
            res.status(401).json({ message: 'Unauthorized - Invalid Token' });
            return;
        }

        const user = await db.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.user = user as AuthUser;
        next();
    } catch (error) {
        const err = error as Error;
        console.error('Error in authenticate middleware:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;

        const user = await db.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            res.status(403).json({ error: 'Access denied. User is not an admin.' });
            return;
        }

        next();
    } catch (error) {
        const err = error as Error;
        console.error('Error in checkAdmin middleware:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
