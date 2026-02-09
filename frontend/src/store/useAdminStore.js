import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
    stats: null,
    isLoading: false,

    getStats: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/admin/stats");
            set({ stats: res.data });
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            toast.error(error.response?.data?.error || "Failed to load platform stats");
        } finally {
            set({ isLoading: false });
        }
    },
}));
