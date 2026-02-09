import { Request, Response } from "express";
import { db } from "../libs/db.js";

export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        // 1. Basic Counts
        const [totalUsers, totalProblems, totalSubmissions, totalComments] = await Promise.all([
            db.user.count(),
            db.problem.count(),
            db.submission.count(),
            db.comment.count(),
        ]);

        // 2. Success Rate
        const acceptedSubmissions = await db.submission.count({
            where: { status: "Accepted" },
        });
        const successRate = totalSubmissions > 0
            ? (acceptedSubmissions / totalSubmissions) * 100
            : 0;

        // 3. Submissions Trend (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const submissionsTrendRaw = await db.submission.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            _count: {
                _all: true
            }
        });

        // Format trend data for charts (group by date string)
        const trendMap: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            trendMap[dateStr] = 0;
        }

        submissionsTrendRaw.forEach((item: any) => {
            const dateStr = new Date(item.createdAt).toISOString().split('T')[0];
            if (trendMap[dateStr] !== undefined) {
                trendMap[dateStr] += item._count._all;
            }
        });

        const trend = Object.entries(trendMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // 4. Popular Problems (Top 5)
        const popularProblemsRaw = await db.submission.groupBy({
            by: ['problemId'],
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    problemId: 'desc'
                }
            },
            take: 5
        });

        const popularProblems = await Promise.all(
            popularProblemsRaw.map(async (item: any) => {
                const problem = await db.problem.findUnique({
                    where: { id: item.problemId },
                    select: { title: true, difficulty: true }
                });
                return {
                    id: item.problemId,
                    title: problem?.title || "Unknown",
                    difficulty: problem?.difficulty,
                    count: item._count._all
                };
            })
        );

        // 5. Recent Submissions
        const recentSubmissions = await db.submission.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, image: true } },
                problem: { select: { title: true } }
            }
        });

        res.json({
            counts: {
                users: totalUsers,
                problems: totalProblems,
                submissions: totalSubmissions,
                comments: totalComments
            },
            successRate: Math.round(successRate),
            trend,
            popularProblems,
            recentSubmissions
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
