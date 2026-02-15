# 🧪 LeetLab — The Ultimate Code Practice Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

---

### 🚀 Level Up Your Coding Skills with LeetLab

**LeetLab** is a high-performance, full-stack LeetCode clone designed for developers who want a seamless, fast, and intelligent coding environment. Built with a modern tech stack and featuring a **triple-layer execution engine**, LeetLab allows you to solve 50+ problems with real-time feedback and AI assistance.

[**Explore the Code**](https://github.com/JeetuPalhub/leetlab) • [**Setup Guide**](./deployment.md) • [**Report Bug**](https://github.com/JeetuPalhub/leetlab/issues)

---

## 📸 Visual Showcase

### 🏠 Stunning Landing Page
> Experience a sleek, modern entry point designed to inspire.
![Landing Page](./screenshots/landing.png)

### 📊 Premium Dashboard
> Manage your progress and explore problems with ease.
![Dashboard](./screenshots/dashboard.png)

### 💻 Professional Editor Experience
> Featuring Monaco Editor, resizable split panels, and instant execution results.
![Editor](./screenshots/editor.png)

### 📝 Comprehensive Problem List
> Filter and find challenges tailored to your skill level.
![Problems List](./screenshots/problems.png)

---

## 💎 Key Features

- **⚡ Triple-Layer Execution Engine**:
  - **Local JS Fallback**: Run JavaScript instantly with zero external dependencies.
  - **Local Python Fallback**: Integrated local execution for Python (No API Key needed!).
  - **RapidAPI / Judge0**: Cloud-powered support for 70+ languages.
- **🤖 Smart AI Assistant**: Get hints, code reviews, and optimal solutions powered by **Groq AI (Llama 3.3 70B)**.
- **🔐 Enterprise-Grade Auth**: Secure login/signup with JWT and Role-Based Access Control (RBAC).
- **📝 Monaco Power**: The same editor that powers VS Code, right in your browser.
- **📉 Live Metrics**: Track runtime, memory usage, and execution status for every submission.
- **📱 Fluid Responsiveness**: A pixel-perfect experience from your 4K monitor to your mobile phone.
- **💬 Community Threads**: Discuss solutions and learn with nested comment replies.

---

## 🛠️ Tech Stack

| Category | Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express, TypeScript, Zod |
| **Database** | PostgreSQL, Prisma ORM |
| **Execution** | Judge0, Local Node/Python Spawners |
| **AI Layer** | Groq (Llama 3.3 70B) |

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/JeetuPalhub/leetlab.git
cd leetlab
```

### 2️⃣ Project Setup
We recommend setting up both the backend and frontend:

```bash
# Setup Backend
cd backend && npm install

# Setup Frontend
cd ../frontend && npm install
```

### 3️⃣ Configuration
Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your-secret-key
RAPIDAPI_KEY=your-key # (Optional) For C++/Java support
```

### 4️⃣ Run the Application
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```
Visit **[http://localhost:5173](http://localhost:5173)** to start coding! 🚀

---

## 📁 Project Structure

```text
leetlab/
├── 🌐 backend/      # Express API & Prisma Schema
├── 🎨 frontend/     # Vite + React UI
├── 📜 deployment/   # Deployment guides
└── 📸 screenshots/  # High-quality UI previews
```

---

## 📄 License & Contributing

Distributed under the **MIT License**. We love contributions! Feel free to fork and submit a PR.

---
<p align="center">Made with ❤️ for the Developer Community</p>
