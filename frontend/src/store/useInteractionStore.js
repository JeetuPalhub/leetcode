import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const useInteractionStore = create((set, get) => ({
    interactionStatus: null,
    userBookmarks: [],
    userLikes: [],
    isLoading: false,

    // Get interaction status for a problem
    getInteractionStatus: async (problemId) => {
        try {
            const res = await axiosInstance.get(`/interactions/status/${problemId}`);
            set({ interactionStatus: res.data });
            return res.data;
        } catch (error) {
            console.error("Error getting interaction status:", error);
            return null;
        }
    },

    // Like a problem
    likeProblem: async (problemId) => {
        try {
            const res = await axiosInstance.post(`/interactions/like/${problemId}`);
            set({ interactionStatus: { ...get().interactionStatus, isLiked: true, likeCount: res.data.likeCount } });
            toast.success("Problem liked!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to like problem");
            return false;
        }
    },

    // Unlike a problem
    unlikeProblem: async (problemId) => {
        try {
            const res = await axiosInstance.delete(`/interactions/like/${problemId}`);
            set({ interactionStatus: { ...get().interactionStatus, isLiked: false, likeCount: res.data.likeCount } });
            toast.success("Like removed");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to unlike problem");
            return false;
        }
    },

    // Bookmark a problem
    bookmarkProblem: async (problemId, note = "") => {
        try {
            await axiosInstance.post(`/interactions/bookmark/${problemId}`, { note });
            set({ interactionStatus: { ...get().interactionStatus, isBookmarked: true, bookmarkNote: note } });
            toast.success("Bookmarked for revision!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to bookmark problem");
            return false;
        }
    },

    // Remove bookmark
    removeBookmark: async (problemId) => {
        try {
            await axiosInstance.delete(`/interactions/bookmark/${problemId}`);
            set({ interactionStatus: { ...get().interactionStatus, isBookmarked: false, bookmarkNote: null } });
            toast.success("Bookmark removed");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to remove bookmark");
            return false;
        }
    },

    // Get all bookmarks
    getUserBookmarks: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/interactions/bookmarks");
            set({ userBookmarks: res.data.bookmarks });
        } catch (error) {
            console.error("Error getting bookmarks:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Get all likes
    getUserLikes: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/interactions/likes");
            set({ userLikes: res.data.likes });
        } catch (error) {
            console.error("Error getting likes:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear interaction status (when leaving page)
    clearInteractionStatus: () => set({ interactionStatus: null }),
}));
