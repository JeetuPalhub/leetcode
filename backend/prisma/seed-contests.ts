
import { db } from '../src/libs/db';
import { randomUUID } from 'crypto';

async function main() {
    console.log('Adding test contests via Raw SQL...');

    // Clear existing contests to avoid clutter
    console.log('Clearing existing contests...');
    try {
        await db.$executeRawUnsafe('DELETE FROM "ContestProblem"');
        await db.$executeRawUnsafe('DELETE FROM "Contest"');
    } catch (e) {
        console.log('Error clearing tables:', e.message);
    }

    // Get some existing problems
    const problems = await db.problem.findMany({ take: 6 });

    if (problems.length < 2) {
        console.log('Not enough problems found. Please add more problems first.');
        return;
    }

    const now = new Date();
    const contests = [];

    // Contest 1
    contests.push({
        id: randomUUID(),
        title: 'Quick Challenge #1',
        description: 'A fast-paced 4-minute coding challenge. Solve as many problems as you can!',
        startTime: new Date(now.getTime() + 1 * 60 * 1000),
        endTime: new Date(now.getTime() + 5 * 60 * 1000), // 4 mins duration
        problems: [
            { problemId: problems[0].id, points: 100, order: 0 },
            { problemId: problems[1].id, points: 150, order: 1 }
        ]
    });

    // Contest 2
    contests.push({
        id: randomUUID(),
        title: 'Speed Coding Challenge',
        description: 'Test your coding speed in this 4-minute challenge!',
        startTime: new Date(now.getTime() + 5 * 60 * 1000),
        endTime: new Date(now.getTime() + 9 * 60 * 1000),
        problems: [
            { problemId: problems[Math.min(2, problems.length - 1)].id, points: 100, order: 0 },
            { problemId: problems[Math.min(3, problems.length - 1)].id, points: 200, order: 1 },
        ]
    });

    // Contest 3
    contests.push({
        id: randomUUID(),
        title: 'Algorithm Sprint',
        description: 'A quick sprint to test your algorithm skills!',
        startTime: new Date(now.getTime() + 10 * 60 * 1000),
        endTime: new Date(now.getTime() + 14 * 60 * 1000),
        problems: [
            { problemId: problems[Math.min(4, problems.length - 1)].id, points: 150, order: 0 },
            { problemId: problems[Math.min(5, problems.length - 1)].id, points: 250, order: 1 }
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
            new Date(),
            new Date()
        );
        console.log(`Created contest: ${contest.title}`);

        // Insert ContestProblems - REMOVED updatedAt
        for (const p of contest.problems) {
            await db.$executeRawUnsafe(
                `INSERT INTO "ContestProblem" ("id", "contestId", "problemId", "points", "order", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`,
                randomUUID(),
                contest.id,
                p.problemId,
                p.points,
                p.order,
                new Date()
            );
        }
    }

    console.log('\n✅ 3 contests created successfully!');
    contests.forEach(c => {
        console.log(`- ${c.title} starts at ${c.startTime.toLocaleTimeString()}`);
    });
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());
