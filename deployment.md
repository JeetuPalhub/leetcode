# 🚀 Deployment Guide

This guide provides a step-by-step process for deploying **LeetLab** to production environments.

---

## 1. 🌐 Backend Deployment (Render.com)

We recommend using [Render](https://render.com) for its excellent Node.js and PostgreSQL support.

### 🛠️ Configuration
Deploy the `backend` folder as a **Web Service**:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run migrate && npm start`

### 🔑 Environment Variables
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string (Internal if on Render). |
| `JWT_SECRET` | A secure, long random string for authentication. |
| `FRONTEND_URL` | Your production frontend URL (e.g., `https://leetlab.vercel.app`). |
| `RAPIDAPI_KEY` | (Optional) Your Judge0 API key from RapidAPI. |
| `GEMINI_API_KEY` | (Optional) For AI-powered hints and solutions. |

---

## 2. 🎨 Frontend Deployment (Vercel.com)

[Vercel](https://vercel.com) is the ideal choice for deploying Vite + React applications.

### 🛠️ Configuration
Deploy the `frontend` folder using the standard Vite preset:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 🔑 Environment Variables
| Variable | Description |
| :--- | :--- |
| `VITE_BACKEND_API_BASEURL` | Should point to your Render URL: `https://your-app.onrender.com/api/v1` |
| `VITE_GROQ_API_KEY` | Your Groq API key (Llama 3.3 70B recommended). |

---

## ✅ Post-Deployment Checklist

1. **CORS Configuration**: Ensure the backend allows requests from your Vercel frontend URL.
2. **API Path**: Double-check that `VITE_BACKEND_API_BASEURL` ends with `/api/v1`.
3. **Database Population**: If the problem list is empty, update your Render **Start Command** to:
   `npx prisma db push && npm run seed && npm start`
   Run this once to populate sample problems, then you can change it back to `npm start`.
4. **Health Check**: Visit your frontend URL and verify that you can register and see the problem list.

---
<p align="center">Need help? Join our community or open an issue on GitHub. 🚀</p>
