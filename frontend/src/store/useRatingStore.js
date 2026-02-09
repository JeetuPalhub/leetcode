import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const useRatingStore = create((set) => ({
    stats: [],
    myRating: null,
    isLoading: false,

    getRatingStats: async (problemId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/ratings/${problemId}`);
            set({
                stats: res.data.stats,
                myRating: res.data.myRating
            });
        } catch (error) {
            console.error("Error fetching rating stats:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    rateDifficulty: async (problemId, rating) => {
        try {
            const res = await axiosInstance.post("/ratings/rate", {
                problemId,
                rating
            });
            set({
                stats: res.data.stats,
                myRating: rating
            });
            toast.success(`Rated as ${rating.toLowerCase()}`);
        } catch (error) {
            console.error("Error rating difficulty:", error);
            toast.error("Failed to rate difficulty");
        }
    },
}));
