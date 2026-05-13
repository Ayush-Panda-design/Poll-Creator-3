# 🌍 PollWave Cloud Deployment Guide (Full Stack)

This guide provides the complete, step-by-step process to deploy PollWave using **MongoDB Atlas**, **Render**, and **Vercel**.

---

## 🏗️ 1. Database: MongoDB Atlas
1.  **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2.  **Create Cluster**: Choose the **Free Tier (Shared)**.
3.  **Database Access**: Create a database user with a **Username** and **Password**. *Save these!*
4.  **Network Access**: 
    - Click "Network Access" -> "Add IP Address".
    - Choose **"Allow Access from Anywhere" (0.0.0.0/0)**. This is required for Render.
5.  **Get Connection String**:
    - Go to "Clusters" -> "Connect" -> "Drivers".
    - Copy the connection string. It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
    - Replace `<username>` and `<password>` with your actual credentials.

---

## 🚀 2. Backend: Render (Node.js)
1.  **Push to GitHub**: Ensure your project is in a GitHub repository.
2.  **Create Web Service**:
    - Log in to [Render](https://render.com).
    - Click "New +" -> "Web Service".
    - Connect your GitHub repository.
3.  **Configure Service**:
    - **Name**: `pollwave-api`
    - **Root Directory**: `server`
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node src/server.js`
4.  **Environment Variables**:
    Click "Advanced" -> "Add Environment Variable":
    | Key | Value | Note |
    | :--- | :--- | :--- |
    | `NODE_ENV` | `production` | Enables production optimizations |
    | `PORT` | `10000` | Render usually uses 10000 |
    | `MONGO_URI` | `mongodb+srv://...` | Your Atlas string from Step 1 |
    | `JWT_SECRET` | `a_long_random_string` | Your unique secret |
    | `CLIENT_URL` | `https://your-app.vercel.app` | **Update this after Step 3** |
    | `GOOGLE_CLIENT_ID` | `your_google_id` | From Google Cloud Console |
    | `GOOGLE_CLIENT_SECRET` | `your_google_secret` | From Google Cloud Console |

---

## 🎨 3. Frontend: Vercel (React/Vite)
1.  **Create Project**:
    - Log in to [Vercel](https://vercel.com).
    - Click "Add New" -> "Project".
    - Connect your GitHub repository.
2.  **Configure Build**:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `client`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
3.  **Environment Variables**:
    Add these under the "Environment Variables" section:
    | Key | Value | Note |
    | :--- | :--- | :--- |
    | `VITE_API_URL` | `https://pollwave-api.onrender.com/api` | Your Render URL + `/api` |
    | `VITE_SOCKET_URL` | `https://pollwave-api.onrender.com` | Your Render URL (No slash) |
    | `VITE_GOOGLE_CLIENT_ID` | `your_google_id` | Same as backend |

---

## 🔗 4. Final Connection (Crucial)
Once Vercel gives you your frontend URL (e.g., `https://pollwave.vercel.app`):
1.  **Update Render**: Go to Render dashboard -> Environment -> Update `CLIENT_URL` to your Vercel URL.
2.  **Update Google Cloud**:
    - Go to [Google Cloud Console](https://console.cloud.google.com).
    - Under **APIs & Services** -> **Credentials**.
    - **Authorized JavaScript Origins**: Add your Vercel URL.
    - **Authorized Redirect URIs**: Add `https://pollwave-api.onrender.com/api/auth/google/callback`.

---

## 📂 Summary of .env Changes

### Backend (`server/.env`)
In production, most of these will be set in the Render dashboard, but your local file should look like:
```env
PORT=5009
MONGO_URI=mongodb+srv://... (Your Atlas Link)
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (`client/.env`)
```env
VITE_API_URL=https://your-api.onrender.com/api
VITE_SOCKET_URL=https://your-api.onrender.com
VITE_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
```

---

## 🚀 5. Code-Level Changes for Production

To ensure the app works correctly on **Render** and **Vercel**, verify these specific code blocks:

### 1. Backend: CORS & Socket.io Configuration
In `server/src/app.js` and `server/src/config/socket.js`, ensure the `origin` is dynamic:
```javascript
// This allows your Vercel frontend to talk to your Render backend
cors({
  origin: process.env.CLIENT_URL, // Must be your Vercel URL
  credentials: true
})
```

### 2. Backend: Port Listening
In `server/src/server.js`, Render will automatically inject a `PORT` environment variable. Ensure your code uses it:
```javascript
const PORT = process.env.PORT || 5009;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 3. Frontend: API & Socket URLs
In `client/src/services/api.js` and `client/src/socket/socket.js`, we use `import.meta.env`. Make sure your Vercel project has these defined:
- **`VITE_API_URL`**: `https://your-api.onrender.com/api`
- **`VITE_SOCKET_URL`**: `https://your-api.onrender.com`

---

## 🛠️ Deployment Checklist (Final Audit)

| Task | Location | Status |
| :--- | :--- | :---: |
| Whitelist `0.0.0.0/0` | MongoDB Atlas | [ ] |
| Set `NODE_ENV=production` | Render Env Vars | [ ] |
| Update `CLIENT_URL` | Render Env Vars | [ ] |
| Add `VITE_API_URL` | Vercel Env Vars | [ ] |
| Add `VITE_SOCKET_URL` | Vercel Env Vars | [ ] |
| Add Redirect URIs | Google Cloud Console | [ ] |

---
💡 **Important Note on Redirects**:
If you are using **React Router**, you must add a `vercel.json` file in your `client` folder to prevent 404 errors on page refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🛑 Troubleshooting "Login Failed" in Production

If login works locally but fails on Vercel/Render, check these 3 common killers:

### 1. The CORS / CLIENT_URL Mismatch (Most Common)
In **Render Environment Variables**, ensure `CLIENT_URL` is exactly your Vercel URL **WITHOUT a trailing slash**.
- ✅ `https://pollwave.vercel.app`
- ❌ `https://pollwave.vercel.app/`

### 2. Cookie Security (SameSite Issue)
Since your Frontend (Vercel) and Backend (Render) are on **different domains**, the browser treats cookies as "Third-Party". 
To fix this, update `server/src/constants/index.js`:
```javascript
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // Must be true for SameSite: none
  sameSite: 'none', // Required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
```

### 3. Google Client ID Sync
Ensure the **exact same** Google Client ID is used in:
1.  Google Cloud Console (Authorized Origins)
2.  Render Dashboard (`GOOGLE_CLIENT_ID`)
3.  Vercel Dashboard (`VITE_GOOGLE_CLIENT_ID`)

If they don't match exactly, Google will refuse the token.

---

## 🛑 Troubleshooting 404 on Poll Links

If your poll link (e.g., `/poll/XYZ`) shows a **404 Page Not Found** on Vercel, this is a **Routing Issue**.

### The Reason:
Vite is a Single Page Application (SPA). When you click a link inside the app, React handles it. But when you **refresh** or **paste a link** in the address bar, Vercel looks for a real file at `/poll/XYZ`. Since that file doesn't exist, it returns 404.

### The Fix:
I have added a `client/vercel.json` file. Ensure this file is pushed to GitHub. 

**Important**: If you connected your **Project Root** to Vercel (instead of just the `client` folder), you must move `vercel.json` from `client/vercel.json` to the **main project root**.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---
MIT © 2025 PollWave
