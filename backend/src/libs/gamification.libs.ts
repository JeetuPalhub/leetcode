import { db } from './db.js';

export const calculateLevel = (xp: number) => {
    // Simple level formula: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 300 XP, etc.
    // L = floor(sqrt(xp / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const updateGamification = async (userId: string, difficulty: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { streak: true, lastActive: true, xp: true, maxStreak: true, level: true }
        });

        if (!user) return null;

        if (userId === 'SYSTEM') return null;

        let xpToAward = 10;
        if (difficulty === 'MEDIUM') xpToAward = 30;
        else if (difficulty === 'HARD') xpToAward = 50;
        else if (difficulty === 'DAILY_BONUS') xpToAward = 100; // Extra for daily rituals
        else if (difficulty === 'MATCH_WIN') xpToAward = 75; // Extra for duels

        const now = new Date();
        const lastActive = new Date(user.lastActive);

        let newStreak = user.streak;
        const diffInDays = Math.floor((now.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));

        if (diffInDays === 1) {
            // Yesterday was last active, increment streak
            newStreak += 1;
        } else if (diffInDays > 1) {
            // Missed a day or more, reset to 1
            newStreak = 1;
        } else if (user.streak === 0) {
            // First time ever
            newStreak = 1;
        }

        const newXP = user.xp + xpToAward;
        const newLevel = calculateLevel(newXP);
        const newMaxStreak = Math.max(user.maxStreak, newStreak);

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                xp: newXP,
                level: newLevel,
                streak: newStreak,
                maxStreak: newMaxStreak,
                lastActive: new Date(),
                points: { increment: xpToAward }
            }
        });

        // Elite: Check for new badges
        await checkBadges(userId, newLevel, newStreak, updatedUser.points);

        return {
            xpAwarded: xpToAward,
            newLevel,
            newStreak,
            isLeveledUp: newLevel > user.level
        };
    } catch (error) {
        console.error('Gamification Update Error:', error);
        return null;
    }
};

export const adjustElo = async (userId: string, opponentId: string, result: 'WIN' | 'LOSS' | 'DRAW') => {
    try {
        const user = await db.user.findUnique({ where: { id: userId }, select: { elo: true } });
        const opponent = await db.user.findUnique({ where: { id: opponentId }, select: { elo: true } });

        if (!user || !opponent) return null;

        const K = 32;
        const expectedScore = 1 / (1 + Math.pow(10, (opponent.elo - user.elo) / 400));

        let actualScore = 0.5;
        if (result === 'WIN') actualScore = 1;
        else if (result === 'LOSS') actualScore = 0;

        const eloChange = Math.round(K * (actualScore - expectedScore));
        const newElo = Math.max(100, user.elo + eloChange);

        await db.user.update({
            where: { id: userId },
            data: { elo: newElo }
        });

        return { eloChange, newElo };
    } catch (error) {
        console.error('Elo Adjustment Error:', error);
        return null;
    }
}

const checkBadges = async (userId: string, level: number, streak: number, points: number) => {
    // Representative elite badges
    const potentialBadges = [
        { name: 'Level 5 Master', req: () => level >= 5, icon: 'Award' },
        { name: 'Week Warrior', req: () => streak >= 7, icon: 'Flame' },
        { name: 'Grandmaster', req: () => points >= 1000, icon: 'Shield' }
    ];

    for (const b of potentialBadges) {
        if (b.req()) {
            const badge = await db.badge.upsert({
                where: { name: b.name },
                update: {},
                create: { name: b.name, description: `Unlocked by reaching ${b.name} milestones.`, icon: b.icon, requirement: {} }
            });

            await db.userBadge.upsert({
                where: { userId_badgeId: { userId, badgeId: badge.id } },
                update: {},
                create: { userId, badgeId: badge.id }
            });
        }
    }
};
