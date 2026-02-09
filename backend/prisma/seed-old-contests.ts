
import { db } from '../src/libs/db';
import { randomUUID } from 'crypto';

async function main() {
    console.log('Adding old contests via Raw SQL...');

    // Get some existing problems
    const problems = await db.problem.findMany({ take: 6 });

    if (problems.length < 2) {
        console.log('Not enough problems found. Please add more problems first.');
        return;
    }

    const now = new Date();
    const contests = [];

    // Old Contest 1: 5 days ago
    const old1Start = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const old1End = new Date(old1Start.getTime() + 60 * 60 * 1000); // 1 hour duration

    contests.push({
        id: randomUUID(),
        title: 'Weekly Contest 101',
        description: 'Standard weekly contest with mixed difficulty problems.',
        startTime: old1Start,
        endTime: old1End,
        problems: [
            { problemId: problems[0].id, points: 100, order: 0 },
            { problemId: problems[Math.min(2, problems.length - 1)].id, points: 200, order: 1 },
            { problemId: problems[Math.min(4, problems.length - 1)].id, points: 300, order: 2 }
        ]
    });

    // Old Contest 2: 2 weeks ago
    const old2Start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const old2End = new Date(old2Start.getTime() + 90 * 60 * 1000); // 1.5 hour duration

    contests.push({
        id: randomUUID(),
        title: 'Bi-Weekly Challenge 45',
        description: 'Bi-weekly challenge for intermediate developers.',
        startTime: old2Start,
        endTime: old2End,
        problems: [
            { problemId: problems[1].id, points: 100, order: 0 },
            { problemId: problems[Math.min(3, problems.length - 1)].id, points: 250, order: 1 }
        ]
    });

    // Old Contest 3: 1 month ago
    const old3Start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const old3End = new Date(old3Start.getTime() + 120 * 60 * 1000); // 2 hour duration

    contests.push({
        id: randomUUID(),
        title: 'Monthly Grand Prix',
        description: 'Our monthly grand contest with high stakes!',
        startTime: old3Start,
        endTime: old3End,
        problems: [
            { problemId: problems[0].id, points: 100, order: 0 },
            { problemId: problems[Math.min(2, problems.length - 1)].id, points: 200, order: 1 },
            { problemId: problems[Math.min(5, problems.length - 1)].id, points: 500, order: 2 }
        ]
    });

    for (const contest of contests) {
        // Insert Contest
        await db.$executeRawUnsafe(
            `INSERT INTO "Contest" ("id", "title", "description", "startTime", "endTime", "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            contest.id,
            contest.title,
            contest.description,
            contest.startTime,
            contest.endTime,
            new Date(), // updatedAt
            contest.startTime // createdAt (same as start for old contests)
        );
        console.log(`Created old contest: ${contest.title}`);

        // Insert ContestProblems
        for (const p of contest.problems) {
            await db.$executeRawUnsafe(
                `INSERT INTO "ContestProblem" ("id", "contestId", "problemId", "points", "order") VALUES ($1, $2, $3, $4, $5)`,
                randomUUID(),
                contest.id,
                p.problemId,
                p.points,
                p.order
            );

        }
    }

    console.log('\n✅ 3 old contests created successfully!');
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());
