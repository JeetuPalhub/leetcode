import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useInterviewStore = create((set, get) => ({
    currentSession: null,
    isLoading: false,

    startInterview: async (config) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/interviews/start", config);
            set({ currentSession: res.data.session });
            toast.success("Interview session started! Good luck.");
            return res.data.session.id;
        } catch (error) {
            console.error("Error starting interview:", error);
            toast.error(error.response?.data?.error || "Failed to start interview");
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    getSession: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/interviews/session/${id}`);
            set({ currentSession: res.data.session });
        } catch (error) {
            console.error("Error fetching session:", error);
            toast.error("Failed to load interview session");
        } finally {
            set({ isLoading: false });
        }
    },

    submitInterview: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(`/interviews/submit/${id}`);
            set({ currentSession: res.data.session });
            toast.success("Interview submitted successfully!");
        } catch (error) {
            console.error("Error submitting interview:", error);
            toast.error("Failed to finalize interview");
        } finally {
            set({ isLoading: false });
        }
    },

    getHint: async (sessionId, problemId, currentCode) => {
        try {
            const res = await axiosInstance.post(`/interviews/hint/${sessionId}`, {
                problemId,
                currentCode
            });
            return res.data.hint;
        } catch (error) {
            console.error("Error getting hint:", error);
            toast.error("Failed to generate hint");
            return null;
        }
    },
}));
