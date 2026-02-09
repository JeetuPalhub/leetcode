import { Request, Response } from 'express';
import { db } from '../libs/db.js';

// GET TOP USERS BY POINTS
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const topUsers = await db.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                points: true,
                _count: {
                    select: {
                        solvedProblems: true,
                        submissions: true,
                    },
                },
            },
            orderBy: [
                { points: 'desc' },
                { solvedProblems: { _count: 'desc' } }
            ],
            take: 50, // Top 50 users
        });

        // Format the output
        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            name: user.name,
            image: user.image,
            points: user.points,
            solvedCount: user._count.solvedProblems,
            submissionCount: user._count.submissions,
        }));

        res.status(200).json({
            success: true,
            leaderboard,
        });
    } catch (error) {
        console.error('Get Leaderboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

// GET CURRENT USER RANK
export const getMyRank = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { points: true }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Count users with more points
        const higherPointUsers = await db.user.count({
            where: {
                points: { gt: user.points }
            }
        });

        res.status(200).json({
            success: true,
            rank: higherPointUsers + 1,
            points: user.points
        });
    } catch (error) {
        console.error('Get My Rank Error:', error);
        res.status(500).json({ error: 'Failed to fetch ranking' });
    }
};
