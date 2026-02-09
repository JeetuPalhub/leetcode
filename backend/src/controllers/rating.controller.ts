import { Request, Response } from 'express';
import { db } from '../libs/db.js';

// RATE PROBLEM DIFFICULTY
export const rateDifficulty = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { problemId, rating } = req.body; // rating: 'EASY', 'MEDIUM', 'HARD'
        const userId = req.user.id;

        if (!['EASY', 'MEDIUM', 'HARD'].includes(rating)) {
            res.status(400).json({ error: 'Invalid rating. Must be EASY, MEDIUM, or HARD' });
            return;
        }

        // Check if already rated
        await db.difficultyRating.upsert({
            where: {
                userId_problemId: { userId, problemId }
            },
            update: {
                rating
            },
            create: {
                userId,
                problemId,
                rating
            }
        });

        // Get updated stats
        const stats = await db.difficultyRating.groupBy({
            by: ['rating'],
            where: { problemId: problemId as string },
            _count: {
                rating: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Difficulty rated successfully',
            stats
        });
    } catch (error) {
        console.error('Rate Difficulty Error:', error);
        res.status(500).json({ error: 'Failed to rate difficulty' });
    }
};

// GET DIFFICULTY RATINGS FOR A PROBLEM
export const getProblemDifficultyStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const { problemId } = req.params;

        const stats = await db.difficultyRating.groupBy({
            by: ['rating'],
            where: { problemId: problemId as string },
            _count: {
                rating: true
            }
        });

        const userRating = req.user ? await db.difficultyRating.findUnique({
            where: { userId_problemId: { userId: req.user.id, problemId: problemId as string } }
        }) : null;

        res.status(200).json({
            success: true,
            stats,
            myRating: userRating?.rating || null
        });
    } catch (error) {
        console.error('Get Difficulty Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch difficulty stats' });
    }
};
