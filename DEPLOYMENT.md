# Warmwind OS - Playwright Runtime Deployment Guide

## Overview
This guide walks you through deploying the Playwright runtime server to Render.com (FREE tier).

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Playwright runtime server for cloud execution"
git push
```

---

## Step 2: Deploy to Render.com

1. **Sign up at [Render.com](https://render.com)**
   - No credit card required for Free tier

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your `warmwind-redesign` repository

3. **Configure Service:**
   - **Name:** `warmwind-runtime` (or any name you prefer)
   - **Root Directory:** Leave blank (render.yaml handles this)
   - **Branch:** `main`
   - Click "Apply" (Render auto-detects `render.yaml`)

4. **Deploy:**
   - Render will automatically install Playwright and start the server
   - First deployment takes ~5-10 minutes (installing Chromium)
   - Subsequent deploys: ~2 minutes

---

## Step 3: Get Your Server URL

After deployment completes, Render provides a URL like:
```
https://warmwind-runtime.onrender.com
```

**Convert to WebSocket URL:**
```
wss://warmwind-runtime.onrender.com
```

---

## Step 4: Update Vercel Environment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add new variable:
   - **Name:** `VITE_RUNTIME_URL`
   - **Value:** `wss://warmwind-runtime.onrender.com`
4. Redeploy your Vercel app

---

## Local Development (Optional)

To test locally before deploying:

```bash
cd server
npm install
npm start
```

Server runs at `http://localhost:8080`

Update `.env.local`:
```
VITE_RUNTIME_URL=ws://localhost:8080
```

---

## Troubleshooting

### Render Service Not Starting
- Check Render dashboard logs
- Ensure Node version is 18+ (set in `render.yaml`)

### WebSocket Connection Failed
- Verify the URL starts with `wss://` (not `http://`)
- Check Render service is "Live" (not sleeping)

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- Wakes up in ~30 seconds on first request
- 750 hours/month limit (enough for 24/7 if no other services)

---

## What Happens Now

When you open VS Code, Gmail, or Chrome in your OS:
1. Frontend connects to Playwright server via WebSocket
2. Server launches real Chromium browser
3. Screenshots streamed at 10 FPS (JPEG, ~70% quality)
4. Your clicks/typing sent to server
5. Browser executes actions
6. You see live desktop stream

---

## Cost: $0/month ✅
