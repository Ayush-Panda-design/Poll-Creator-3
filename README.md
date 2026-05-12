# 🌊 PollWave — Real-Time Polling Platform

A full-stack, production-grade polling and feedback platform inspired by Mentimeter. Create polls, share them via public links, collect live responses, and view animated analytics — all in real-time via Socket.IO.

---

## 📁 Project Structure

```
poll-platform/
├── client/          # React + Vite + Tailwind CSS frontend
├── server/          # Node.js + Express + MongoDB backend
├── .gitignore
├── package.json     # Root monorepo scripts
└── README.md
```

---

## 🧰 Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Redux Toolkit |
| Backend   | Node.js, Express.js, MongoDB, Mongoose |
| Auth      | JWT, bcryptjs, Google OIDC (optional) |
| Real-Time | Socket.IO (server + client) |
| Cron Jobs | node-cron (auto poll expiry) |
| Validation| express-validator |

---

## ✅ Prerequisites

Make sure the following are installed on your machine **before starting**:

| Tool | Version | Download |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | (comes with Node) |
| MongoDB | v6+ | https://www.mongodb.com/try/download/community |
| Git | any | https://git-scm.com |

> **Windows tip:** Use PowerShell or Windows Terminal. Run commands one terminal per service.

---

## ⚡ Quick Start (Localhost)

### Step 1 — Clone / Navigate to the project

```powershell
cd "c:\Users\panda\Desktop\Polling Web\poll-platform"
```

---

### Step 2 — Start MongoDB

Make sure MongoDB is running locally. Open a **new terminal** and run:

```powershell
mongod
```

> If `mongod` is not in PATH, start it from MongoDB's installation directory or use MongoDB Compass (GUI) which starts the server automatically.

By default MongoDB listens on `mongodb://localhost:27017`. The app will create a database called `poll-platform` automatically.

---

### Step 3 — Configure Backend Environment

Open `server/.env` and fill in the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/poll-platform
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id        # optional
GOOGLE_CLIENT_SECRET=your_google_client_secret # optional
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
NODE_ENV=development
```

> **JWT_SECRET** — use any long random string, e.g. run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` in terminal.

---

### Step 4 — Install & Run the Backend

```powershell
cd server
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
✅ Poll expiry cron job started
🚀 Server running on http://localhost:5000
```

---

### Step 5 — Configure Frontend Environment

Open `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id   # optional
```

---

### Step 6 — Install & Run the Frontend

Open a **second terminal**:

```powershell
cd "c:\Users\panda\Desktop\Polling Web\poll-platform\client"
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

### Step 7 — Open the App

Visit **http://localhost:5173** in your browser.

| Page | URL |
|------|-----|
| Landing | http://localhost:5173/ |
| Sign Up | http://localhost:5173/signup |
| Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/dashboard |
| Create Poll | http://localhost:5173/polls/create |
| Public Poll | http://localhost:5173/poll/`<POLL_CODE>` |
| Public Results | http://localhost:5173/poll/`<POLL_CODE>`/results |

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/google` | ❌ | Google OAuth login |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Logout |
| PATCH | `/api/users/onboarding` | ✅ | Complete onboarding |
| GET | `/api/users/profile` | ✅ | Get profile |
| POST | `/api/polls` | ✅ | Create poll |
| GET | `/api/polls` | ✅ | Get my polls |
| GET | `/api/polls/:id` | ✅ | Get poll by ID |
| PATCH | `/api/polls/:id` | ✅ | Update poll |
| DELETE | `/api/polls/:id` | ✅ | Delete poll |
| POST | `/api/polls/:id/publish` | ✅ | Publish results |
| GET | `/api/polls/public/:pollCode` | ❌ | Get public poll |
| GET | `/api/polls/public/results/:pollCode` | ❌ | Get published results |
| POST | `/api/responses/:pollId` | Optional | Submit response |
| GET | `/api/responses/:pollId` | ✅ | Get responses (creator) |
| GET | `/api/analytics/:pollId` | ✅ | Get analytics |
| GET | `/api/health` | ❌ | Health check |

---

## 🔴 Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_poll` | Client → Server | Join a poll room |
| `leave_poll` | Client → Server | Leave a poll room |
| `new_response` | Server → Client | Someone submitted a response |
| `analytics_update` | Server → Client | Updated analytics data |
| `participant_count` | Server → Client | Live viewer count |
| `poll_expired` | Server → Client | Poll has expired |
| `poll_published` | Server → Client | Poll results published |
| `subscribe_analytics` | Client → Server | Subscribe to analytics stream |

---

## 🗃️ MongoDB Database Schema

### Users Collection
```json
{ "name": "string", "email": "string", "password": "hashed", "authProvider": "local|google",
  "role": "string", "interests": ["array"], "onboardingCompleted": false }
```

### Polls Collection
```json
{ "title": "string", "description": "string", "createdBy": "userId", "isAnonymous": true,
  "requiresAuth": false, "expiresAt": "Date|null", "isPublished": false,
  "pollCode": "UNIQUE8CHARS", "status": "active|expired|published",
  "questions": [{ "question": "string", "options": ["string"], "required": true }],
  "totalResponses": 0 }
```

### Responses Collection
```json
{ "pollId": "ObjectId", "respondent": "userId|null",
  "answers": [{ "questionIndex": 0, "selectedOption": "string" }], "submittedAt": "Date" }
```

### Analytics Collection
```json
{ "pollId": "ObjectId", "totalResponses": 0,
  "questionStats": [{ "questionIndex": 0, "optionCounts": {}, "optionPercentages": {} }] }
```

---

## 🔐 Google OIDC Setup (Optional)

1. Go to https://console.cloud.google.com
2. Create a project → **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth 2.0 Client IDs**
4. Application type: **Web application**
5. Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy the **Client ID** and **Client Secret** into `server/.env`
7. Copy the **Client ID** into `client/.env` as `VITE_GOOGLE_CLIENT_ID`

---

## 🚀 Deployment Guide

### Option A — Deploy Backend to Render.com (Free)

1. Push your code to GitHub (single repo)
2. Go to https://render.com → **New** → **Web Service**
3. Connect your GitHub repo
4. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
5. Add Environment Variables (same as `server/.env`):
   - `MONGO_URI` → Use MongoDB Atlas URI (see below)
   - `JWT_SECRET` → Your secret
   - `CLIENT_URL` → Your Vercel frontend URL
   - `NODE_ENV` → `production`
6. Click **Deploy**

---

### Option B — Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → **New Project**
2. Import your GitHub repo
3. Set:
   - **Framework:** Vite
   - **Root Directory:** `client`
4. Add Environment Variables:
   - `VITE_API_URL` → `https://your-render-backend.onrender.com/api`
   - `VITE_SOCKET_URL` → `https://your-render-backend.onrender.com`
5. Click **Deploy**

---

### Option C — MongoDB Atlas (Free Cloud DB)

1. Go to https://cloud.mongodb.com
2. Create a free **M0** cluster
3. **Database Access** → Add user with password
4. **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Connect your application**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/poll-platform?retryWrites=true&w=majority
   ```
7. Paste it as `MONGO_URI` in your backend env vars

---

## 🛠️ Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `mongod` not found | Add MongoDB `bin` folder to system PATH or start via MongoDB Compass |
| Port 5000 in use | Change `PORT` in `server/.env` to `5001` |
| CORS errors | Ensure `CLIENT_URL` in `server/.env` matches the frontend URL exactly |
| JWT errors | Make sure `JWT_SECRET` is the same string in both development and production |
| `Cannot find module` | Run `npm install` inside both `server/` and `client/` folders |
| Socket not connecting | Check `VITE_SOCKET_URL` in `client/.env` matches the backend URL |
| Poll not found (public) | The poll must be `status: active` — check if it expired |

---

## 📂 Complete File Structure

```
poll-platform/
├── client/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/pages/        (LandingPage, LoginPage, SignupPage)
│   │   │   ├── onboarding/pages/  (OnboardingPage)
│   │   │   ├── polls/pages/       (DashboardPage, CreatePollPage, EditPollPage, PollDetailPage)
│   │   │   ├── analytics/pages/   (AnalyticsPage)
│   │   │   ├── presentation/pages/(PresentationPage)
│   │   │   └── publicPoll/pages/  (PublicPollPage, PublicResultsPage)
│   │   ├── components/ui/         (Button, Input, Modal, Badge, Spinner)
│   │   ├── layouts/               (DashboardLayout, AuthLayout, PublicLayout)
│   │   ├── routes/                (AppRoutes, ProtectedRoute, PublicRoute)
│   │   ├── context/               (AuthContext, SocketContext, ThemeContext)
│   │   ├── store/                 (Redux store + slices)
│   │   ├── socket/                (Socket.IO singleton)
│   │   ├── services/              (api.js — Axios instance)
│   │   └── utils/                 (constants, formatters, helpers, validators)
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/
    ├── src/
    │   ├── config/     (db.js, socket.js)
    │   ├── controllers/(auth, poll, response, analytics, user)
    │   ├── models/     (User, Poll, Response, Analytics)
    │   ├── routes/     (auth, poll, response, analytics, user)
    │   ├── middleware/ (auth, error, validation, expiry, role)
    │   ├── services/   (auth, poll, response, analytics, socket)
    │   ├── sockets/    (poll.socket, analytics.socket)
    │   ├── validators/ (auth, poll, response)
    │   ├── jobs/       (expiry.job — node-cron)
    │   ├── utils/      (ApiError, asyncHandler, generateToken, generatePollCode, calculateAnalytics)
    │   ├── constants/  (index.js)
    │   ├── app.js
    │   └── server.js
    ├── .env
    └── package.json
```

---

## 🎯 Features Checklist

- ✅ JWT Authentication (Signup / Login / Logout)
- ✅ Personalized Onboarding (role + interests)
- ✅ Create / Edit / Delete Polls
- ✅ Single-option question type
- ✅ Mandatory / Optional questions
- ✅ Anonymous + Authenticated response modes
- ✅ Poll expiry system (auto via cron job)
- ✅ Poll sharing via unique code / public link
- ✅ Public poll submission form
- ✅ Poll result publishing
- ✅ Analytics dashboard (charts + % breakdown)
- ✅ Real-time updates via Socket.IO
- ✅ Live participant count
- ✅ Fullscreen Presentation Mode
- ✅ Dark mode glassmorphism UI
- ✅ Framer Motion animations
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Fully responsive (mobile-first)
- ✅ Protected routes
- ✅ Role-based middleware

---

## 👨‍💻 Development Commands

```powershell
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev

# Terminal 3 — MongoDB (if not running as a service)
mongod
```

---

## 📝 License

MIT © 2025 PollWave. Built for the hackathon.
#   P o l l - c r e a t o r  
 #   P o l l - C r e a t o r - 2  
 #   P o l l - C r e a t o r - 2  
 