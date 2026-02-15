import axios from "axios";
import env from "../config/env.js";

export const axiosInstance = axios.create({
  baseURL: env.BACKEND_API_BASEURL,
  withCredentials: true,
});

// Response interceptor to handle 401 errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't show error for auth check endpoint — it's expected on initial load
      const url = error.config?.url || "";
      if (!url.includes("/auth/check")) {
        console.warn("Unauthorized request:", url);
      }
    }
    return Promise.reject(error);
  }
);
