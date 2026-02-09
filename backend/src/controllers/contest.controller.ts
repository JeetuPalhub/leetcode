import { Request, Response } from 'express';
import { db } from '../libs/db.js';

export const createContest = async (req: Request, res: Response) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;

        if (!req.user || req.user.role !== 'ADMIN') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const contest = await db.contest.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                problems: {
                    create: problems.map((p: any, index: number) => ({
                        problemId: p.problemId,
                        points: p.points || 100,
                        order: index
                    }))
                }
            },
            include: {
                problems: true
            }
        });

        res.json(contest);
    } catch (error) {
        console.error('Create Contest Error:', error);
        res.status(500).json({ error: 'Failed to create contest' });
    }
};

export const getContests = async (req: Request, res: Response) => {
    try {
        const contests = await db.contest.findMany({
            include: {
                _count: {
                    select: {
                        problems: true,
                        registrations: true
                    }
                }
            },
            orderBy: {
                startTime: 'desc'
            }
        });

        res.json(contests);
    } catch (error) {
        console.error('Get Contests Error:', error);
        res.status(500).json({ error: 'Failed to fetch contests' });
    }
};

export const getContestById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const contest = await db.contest.findUnique({
            where: { id },
            include: {
                problems: {
                    include: {
                        problem: {
                            select: {
                                id: true,
                                title: true,
                                difficulty: true,
                                tags: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            }
        });

        if (!contest) {
            res.status(404).json({ error: 'Contest not found' });
            return;
        }

        // Check if user is registered
        let isRegistered = false;
        if (req.user) {
            const registration = await db.contestRegistration.findUnique({
                where: {
                    userId_contestId: {
                        userId: req.user.id,
                        contestId: id
                    }
                }
            });
            isRegistered = !!registration;
        }

        res.json({ ...contest, isRegistered });
    } catch (error) {
        console.error('Get Contest Error:', error);
        res.status(500).json({ error: 'Failed to fetch contest details' });
    }
};

export const registerForContest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const contest = await db.contest.findUnique({ where: { id } });
        if (!contest) {
            res.status(404).json({ error: 'Contest not found' });
            return;
        }

        if (new Date() > new Date(contest.endTime)) {
            res.status(400).json({ error: 'Contest has already ended' });
            return;
        }

        const registration = await db.contestRegistration.upsert({
            where: {
                userId_contestId: {
                    userId,
                    contestId: id
                }
            },
            create: {
                userId,
                contestId: id
            },
            update: {}
        });

        res.json({ success: true, registration });
    } catch (error) {
        console.error('Register Contest Error:', error);
        res.status(500).json({ error: 'Failed to register for contest' });
    }
};

export const getContestLeaderboard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const submissions = await db.submission.findMany({
            where: {
                contestId: id,
                status: 'Accepted'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                problem: {
                    select: {
                        id: true
                    }
                }
            }
        });

        const contestProblems = await db.contestProblem.findMany({
            where: { contestId: id }
        });

        const problemPoints = contestProblems.reduce((acc: any, cp: any) => {
            acc[cp.problemId] = cp.points;
            return acc;
        }, {});

        // Calculate scores
        const leaderboardMap: any = {};

        submissions.forEach((sub) => {
            const userId = sub.userId;
            if (!leaderboardMap[userId]) {
                leaderboardMap[userId] = {
                    user: sub.user,
                    totalScore: 0,
                    solvedProblems: new Set(),
                    lastSubmissionTime: sub.createdAt
                };
            }

            if (!leaderboardMap[userId].solvedProblems.has(sub.problemId)) {
                leaderboardMap[userId].totalScore += problemPoints[sub.problemId] || 0;
                leaderboardMap[userId].solvedProblems.add(sub.problemId);

                if (new Date(sub.createdAt) > new Date(leaderboardMap[userId].lastSubmissionTime)) {
                    leaderboardMap[userId].lastSubmissionTime = sub.createdAt;
                }
            }
        });

        const leaderboard = Object.values(leaderboardMap)
            .map((entry: any) => ({
                ...entry,
                solvedCount: entry.solvedProblems.size,
                solvedProblems: Array.from(entry.solvedProblems)
            }))
            .sort((a: any, b: any) => {
                if (b.totalScore !== a.totalScore) {
                    return b.totalScore - a.totalScore;
                }
                return new Date(a.lastSubmissionTime).getTime() - new Date(b.lastSubmissionTime).getTime();
            });

        res.json(leaderboard);
    } catch (error) {
        console.error('Contest Leaderboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};
