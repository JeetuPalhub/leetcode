# 🚀 Deployment Guide

Follow these steps to deploy LeetLab to production.

## 1. Backend (Render.com)
Deploy the `backend` folder to Render as a **Web Service**.

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run migrate && npm start`
- **Environment Variables**:
  - `DATABASE_URL`: Your PostgreSQL connection string.
  - `JWT_SECRET`: A long random string.
  - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
  - `RAPIDAPI_KEY`: (Optional) Your Judge0 API key for multi-language support.
  - `GEMINI_API_KEY`: (Optional) For AI hints/solutions.

## 2. Frontend (Vercel.com)
Deploy the `frontend` folder to Vercel.

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Environment Variables**:
  - `VITE_BACKEND_API_BASEURL`: `https://your-backend-url.onrender.com/api/v1`
  - `VITE_GROQ_API_KEY`: Your Groq AI key.

---

## ✅ Post-Deployment Checks
1. Ensure the **CORS** setting on Render matches your **Vercel URL**.
2. Verify that `VITE_BACKEND_API_BASEURL` on Vercel ends with `/api/v1`.
3. Check the Render logs to ensure `prisma migrate` ran successfully.
