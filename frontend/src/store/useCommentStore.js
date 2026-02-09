import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const useCommentStore = create((set) => ({
    comments: [],
    isLoading: false,

    getComments: async (problemId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/comments/${problemId}`);
            set({ comments: res.data.comments });
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addComment: async (problemId, content, parentId = null) => {
        try {
            const res = await axiosInstance.post("/comments/create", {
                problemId,
                content,
                parentId
            });

            // Re-fetch all comments to ensure threading/ordering is correct
            const commentsRes = await axiosInstance.get(`/comments/${problemId}`);
            set({ comments: commentsRes.data.comments });

            toast.success("Comment added");
            return res.data.comment;
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        }
    },

    deleteComment: async (commentId, problemId) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);

            // Re-fetch
            const commentsRes = await axiosInstance.get(`/comments/${problemId}`);
            set({ comments: commentsRes.data.comments });

            toast.success("Comment deleted");
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment");
        }
    },
}));
