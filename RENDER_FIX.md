# Fix: Switch Render Service to Docker

## The Problem
Render keeps using the old Node.js configuration. We need to manually switch it to Docker.

---

## Option 1: Delete and Recreate (Easiest)

1. **Go to your Render dashboard**
2. **Click on your `warmwind-runtime` service**
3. **Settings** (in left sidebar)
4. **Scroll to bottom** → Click **"Delete Service"**
5. **Create New Web Service** (same as before)
6. **This time Render will detect Docker automatically**

---

## Option 2: Manual Configuration Change

1. **Go to your service** → **Settings**

2. **Find "Build & Deploy" section**

3. **Change these fields:**
   - **Runtime:** Change from `Node` to `Docker`
   - **Dockerfile Path:** `./server/Dockerfile`
   - **Docker Context:** `./server`

4. **Remove the old build command:**
   - Delete: `cd server && npm install && npx playwright install --with-deps chromium`

5. **Remove the old start command:**
   - Delete: `cd server && npm start`

6. **Save Changes**

7. **Click "Manual Deploy" → "Deploy latest commit"**

---

## Expected Result

After switching to Docker, you should see in the logs:
```
==> Building with Dockerfile...
Step 1/8 : FROM mcr.microsoft.com/playwright:v1.40.0-jammy
...
Successfully built
```

**No more "Authentication failure" errors!**

---

## If You Still Have Issues

Delete the service completely and start fresh:
1. Delete the service
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` (which now uses Docker)
5. Click "Create Web Service"
