# ⚙️ Code Execution Setup Guide

To support multiple languages like **Python, Java, and C++**, LeetLab integrates with **Judge0**. You have two main options for setting this up.

---

## 🚀 Option 1: RapidAPI (Recommended for Beginners)
This is the easiest way to get started using the cloud-managed version of Judge0.

1. **Get an API Key**:
   - Visit [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/).
   - Sign up for a free account and subscribe to the **Basic (Free)** plan.
2. **Configure Backend**:
   - Copy your `X-RapidAPI-Key`.
   - Add it to your `backend/.env`:
     ```env
     RAPIDAPI_KEY=your_key_here
     ```
3. **Restart**: Restart your backend server to apply changes.

---

## 🐳 Option 2: Local Docker Setup (For Power Users)
Use this option for unlimited executions and a completely local development environment.

### 1. Clone & Configure
```bash
git clone https://github.com/judge0/judge0.git
cd judge0
```

### 2. Generate Settings
```powershell
# On Windows (PowerShell)
./configure
```

### 3. Start Containers
```bash
docker-compose up -d
```

### 4. Verify Connection
Wait about 60 seconds, then run:
```bash
curl -s http://localhost:2358/about
```
> [!TIP]
> If you see a JSON response with version details, your local Judge0 instance is alive and well!

### 5. Update Backend `.env`
Add the local URL to your `backend/.env`:
```env
JUDGE0_API_URL=http://localhost:2358
```

---

## 💡 No Setup? No Problem!
LeetLab features a **Local Fallback Runner** for JavaScript. Even without Judge0, you can still:
- ✅ Run JavaScript code against test cases instantly.
- ✅ See "Accepted" or "Wrong Answer" status.
- ✅ Persist your submissions to the database.

*Note: Multi-language support still requires a Judge0 connection.*

---
<p align="center">Empowering developers to build faster. 🚀</p>
