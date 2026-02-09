import { db } from './libs/db.js';

async function createPlaylists() {
    try {
        // Get the first user (admin)
        const user = await db.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!user) {
            console.log('No admin user found. Please log in first.');
            return;
        }

        // Get all problems
        const problems = await db.problem.findMany({
            select: { id: true, title: true, difficulty: true }
        });

        if (problems.length === 0) {
            console.log('No problems found in database.');
            return;
        }

        console.log(`Found ${problems.length} problems. Creating playlists...`);

        // Group problems by difficulty
        const easyProblems = problems.filter(p => p.difficulty === 'EASY');
        const mediumProblems = problems.filter(p => p.difficulty === 'MEDIUM');
        const hardProblems = problems.filter(p => p.difficulty === 'HARD');

        // Create Playlist 1: Beginner Bootcamp (Easy problems)
        const playlist1 = await db.playlist.create({
            data: {
                name: 'Beginner Bootcamp',
                description: 'Start your coding journey with these easy problems. Perfect for warming up!',
                userId: user.id,
                problems: {
                    create: easyProblems.slice(0, 10).map((p) => ({
                        problemId: p.id
                    }))
                }
            }
        });
        console.log(`✅ Created playlist: ${playlist1.name} with ${easyProblems.slice(0, 10).length} problems`);

        // Create Playlist 2: Interview Prep (Mix of Medium and Hard)
        const interviewProblems = [...mediumProblems.slice(0, 5), ...hardProblems.slice(0, 5)];
        const playlist2 = await db.playlist.create({
            data: {
                name: 'Interview Prep',
                description: 'Essential problems to crack your next technical interview. Covers key patterns!',
                userId: user.id,
                problems: {
                    create: interviewProblems.map((p) => ({
                        problemId: p.id
                    }))
                }
            }
        });
        console.log(`✅ Created playlist: ${playlist2.name} with ${interviewProblems.length} problems`);

        console.log('\n🎉 Playlists created successfully!');
        console.log('\nPlaylist Summary:');
        console.log('1. Beginner Bootcamp - Easy problems for beginners');
        console.log('2. Interview Prep - Medium & Hard problems for interview prep');

    } catch (error) {
        console.error('Error creating playlists:', error);
    } finally {
        await db.$disconnect();
    }
}

createPlaylists();
