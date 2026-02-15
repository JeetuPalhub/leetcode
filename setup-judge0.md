# Code Execution Setup Guide

To support multiple languages (Python, Java, C++, etc.) without managing your own server, I've integrated **RapidAPI (Judge0)**.

## 🚀 Option 1: Using RapidAPI (Easiest - Recommended)
1. Go to [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/).
2. Sign up for a **Free** account (50 requests/day).
3. Subscribe to the "Basic" (Free) plan.
4. Copy your **X-RapidAPI-Key**.
5. Update your `backend/.env`:
   ```env
   RAPIDAPI_KEY=your_key_here
   ```
6. Restart the backend server.

---

## 🐳 Option 2: Local Docker Setup (Unlimited usage)
If you prefer to run everything locally:

1. **Clone the Judge0 CE Repository**
   ```bash
   git clone https://github.com/judge0/judge0.git
   cd judge0
   ```

2. **Generate Configuration**
   ```bash
   # On Windows (PowerShell)
   ./configure
   ```

3. **Start Judge0**
   ```bash
   docker-compose up -d
   ```

4. **Verify Installation**
   Wait a minute for the containers to start, then try:
   ```bash
   curl -s http://localhost:2358/about
   ```
   If you see a JSON response with version information, it's working!

5. **Update .env**
   Ensure your `backend/.env` has the following line:
   ```env
   JUDGE0_API_URL=http://localhost:2358
   ```

---

## 🚀 No Setup? No Problem!
The platform now has a **Local Fallback Runner** for JavaScript. Even if Judge0 is not running, you can still:
- Run JavaScript code against test cases.
- See "Accepted" or "Wrong Answer" results.
- Save your submissions.

*Note: Multi-language support (Python, etc.) still requires Judge0.*
