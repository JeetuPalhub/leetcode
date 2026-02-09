import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';

export const useGamificationStore = create((set) => ({
    userStats: {
        streak: 0,
        maxStreak: 0,
        xp: 0,
        level: 1,
        points: 0
    },
    loading: false,

    fetchUserStats: async () => {
        set({ loading: true });
        try {
            // Reusing the general user profile endpoint if it has these fields, 
            // otherwise we'll append to it.
            const res = await axiosInstance.get('/user/profile');
            const { streak, maxStreak, xp, level, points } = res.data.user;
            set({
                userStats: { streak, maxStreak, xp, level, points }
            });
        } catch (error) {
            console.error('Fetch Stats Error:', error);
        } finally {
            set({ loading: false });
        }
    },


    updateLocalStats: (gamificationResult) => {
        if (!gamificationResult) return;
        set((state) => ({
            userStats: {
                ...state.userStats,
                xp: state.userStats.xp + gamificationResult.xpAwarded,
                level: gamificationResult.newLevel,
                streak: gamificationResult.newStreak,
                maxStreak: Math.max(state.userStats.maxStreak, gamificationResult.newStreak)
            }
        }));
    }
}));
