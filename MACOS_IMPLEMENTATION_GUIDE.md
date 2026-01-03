# Warmwind Cloud OS - Complete Implementation Guide for macOS

> **For AI Agent:** Read this entire document and execute each phase sequentially. This is a complete implementation plan for building a Cloud OS with native application streaming on macOS using Docker.

---

## Overview

Build a Cloud OS that:
1. Runs real Linux desktop with X11 compositor
2. Executes native applications (Chrome, etc.)
3. Streams pixels via VNC to browser
4. Overlays beautiful Cloud OS UI (dock, controls)
5. Enables AI agent perception and control

**Target Platform:** macOS with Docker Desktop  
**Repository:** `warmwind-redesign` (already exists)  
**Estimated Time:** 30-45 minutes

---

## Prerequisites Checklist

Before starting, ensure:
- [ ] macOS 12.0+ (Monterey or newer)
- [ ] Homebrew installed (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
- [ ] Git installed (`brew install git`)
- [ ] Node.js 18+ installed (`brew install node`)
- [ ] Docker Desktop for Mac installed

---

## Phase 1: Install Docker Desktop

### Step 1.1: Download and Install
```bash
# Option A: Using Homebrew (recommended)
brew install --cask docker

# Option B: Download directly
# Go to https://www.docker.com/products/docker-desktop
# Download Docker Desktop for Mac (Apple Silicon or Intel)
# Open .dmg and drag to Applications
```

### Step 1.2: Start Docker Desktop
```bash
# Open Docker Desktop app
open -a Docker

# Wait for Docker to start (whale icon in menu bar stops animating)
# Verify installation:
docker --version
docker run hello-world
```

**Expected Output:**
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

---

## Phase 2: Create VNC Docker Container

### Step 2.1: Navigate to Project
```bash
cd ~/path/to/warmwind-redesign
# Or clone if needed:
# git clone https://github.com/KeamoMichael/warmwind-redesign.git
# cd warmwind-redesign
```

### Step 2.2: Create Dockerfile
Create file `docker/Dockerfile`:
```dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DISPLAY=:99

# Install X11, VNC, and dependencies
RUN apt-get update && apt-get install -y \
    xvfb \
    x11vnc \
    openbox \
    xterm \
    supervisor \
    websockify \
    novnc \
    wget \
    curl \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Create supervisor config
RUN mkdir -p /etc/supervisor/conf.d
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 6080

CMD ["/start.sh"]
```

### Step 2.3: Create Supervisor Config
Create file `docker/supervisord.conf`:
```ini
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:xvfb]
command=/usr/bin/Xvfb :99 -screen 0 1280x720x24 -ac +extension GLX +render -noreset
autorestart=true
priority=100

[program:openbox]
command=/usr/bin/openbox
environment=DISPLAY=":99"
autorestart=true
priority=200

[program:x11vnc]
command=/usr/bin/x11vnc -display :99 -nopw -listen 0.0.0.0 -xkb -forever -shared
autorestart=true
priority=300

[program:novnc]
command=/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080
autorestart=true
priority=400
```

### Step 2.4: Create Start Script
Create file `docker/start.sh`:
```bash
#!/bin/bash
echo "🚀 Starting Warmwind Cloud OS..."

# Create log directory
mkdir -p /var/log/supervisor

# Start supervisor (manages all services)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
```

### Step 2.5: Build Docker Image
```bash
cd docker
docker build -t warmwind-vnc .
```

**Expected Output:**
```
Successfully built abc123def456
Successfully tagged warmwind-vnc:latest
```

---

## Phase 3: Run VNC Container

### Step 3.1: Start Container
```bash
docker run -d \
  --name warmwind-os \
  -p 6080:6080 \
  warmwind-vnc
```

### Step 3.2: Verify Container Running
```bash
docker ps
# Should show warmwind-os container running

docker logs warmwind-os
# Should show supervisor starting services
```

### Step 3.3: Test VNC Access
Open browser: `http://localhost:6080/vnc.html`

1. Click **"Connect"**
2. You should see **gray Openbox desktop**
3. Right-click shows Openbox menu

### Step 3.4: Test Chrome
```bash
docker exec -e DISPLAY=:99 warmwind-os google-chrome --no-sandbox https://youtube.com &
```

**Expected:** Chrome window appears in VNC browser tab with YouTube loaded.

---

## Phase 4: Update Cloud OS Frontend

### Step 4.1: Update VNC URL in Config
Edit `config/apps.ts` - ensure apps use VNC:
```typescript
export const CLOUD_OS_CONFIG = {
    vncUrl: 'http://localhost:6080/vnc.html',
    // ... rest of config
};
```

### Step 4.2: Update VMSettings Default
Edit `components/VMSettings.tsx`:
```typescript
const [vncUrl, setVncUrl] = useState(
    localStorage.getItem('codespace_vnc_url') || 'http://localhost:6080/vnc.html'
);
```

### Step 4.3: Start Frontend
```bash
cd ~/path/to/warmwind-redesign
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## Phase 5: Configure Cloud OS

### Step 5.1: Open Cloud OS
Navigate to `http://localhost:5173` in browser.

### Step 5.2: Configure VNC
1. Click **"Configure VNC Settings"** button
2. Enter URL: `http://localhost:6080/vnc.html`
3. Click **"Save"**

### Step 5.3: Verify Connection
- VNC stream should appear in Cloud OS
- Loading animation shows, then desktop appears
- "Connected" badge visible

---

## Phase 6: Add App Launcher API

### Step 6.1: Create Launch Endpoint
Create file `server/app-launcher.ts`:
```typescript
import express from 'express';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

// CORS for frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Launch app in Docker container
app.post('/launch', async (req, res) => {
    const { app: appName, url } = req.body;
    
    let command = '';
    switch (appName) {
        case 'chrome':
            command = `docker exec -d -e DISPLAY=:99 warmwind-os google-chrome --no-sandbox "${url || 'https://google.com'}"`;
            break;
        case 'terminal':
            command = `docker exec -d -e DISPLAY=:99 warmwind-os xterm`;
            break;
        default:
            return res.status(400).json({ error: 'Unknown app' });
    }
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ success: true, message: `Launched ${appName}` });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 App Launcher API on http://localhost:${PORT}`);
});
```

### Step 6.2: Update Package.json
Add to `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "launcher": "tsx server/app-launcher.ts",
    "start:all": "concurrently \"npm run dev\" \"npm run launcher\""
  }
}
```

Install dependencies:
```bash
npm install concurrently tsx
```

### Step 6.3: Update VNCOverlayDock
Edit `components/VNCOverlayDock.tsx` to call API:
```typescript
const handleLaunchApp = async (appName: string, url?: string) => {
    try {
        const response = await fetch('http://localhost:3001/launch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ app: appName, url })
        });
        const result = await response.json();
        console.log('Launch result:', result);
    } catch (error) {
        console.error('Launch failed:', error);
    }
};
```

---

## Phase 7: Run Complete System

### Step 7.1: Start All Services
Terminal 1 - Docker VNC:
```bash
docker start warmwind-os
# Or if not created: docker run -d --name warmwind-os -p 6080:6080 warmwind-vnc
```

Terminal 2 - App Launcher API:
```bash
npm run launcher
```

Terminal 3 - Frontend:
```bash
npm run dev
```

### Step 7.2: Test Complete Flow
1. Open `http://localhost:5173`
2. VNC stream loads automatically
3. Click Chrome icon in dock
4. Chrome launches in VNC container
5. Visible in Cloud OS UI

---

## Phase 8: Agent Integration (Optional)

### Step 8.1: Frame Capture for Perception
Add to `services/AgentVision.ts`:
```typescript
export const captureVNCFrame = async (): Promise<string> => {
    // Capture canvas content from VNC
    const canvas = document.querySelector('canvas');
    if (!canvas) throw new Error('No VNC canvas found');
    return canvas.toDataURL('image/jpeg', 0.8);
};

export const perceiveScreen = async (frame: string): Promise<string> => {
    // Send to Gemini Vision API
    const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: frame, prompt: 'What do you see on screen?' })
    });
    return response.json();
};
```

### Step 8.2: Action Injection
```typescript
export const injectAction = async (action: {
    type: 'click' | 'type';
    x?: number;
    y?: number;
    text?: string;
}) => {
    // Use xdotool in container
    let command = '';
    if (action.type === 'click') {
        command = `docker exec -e DISPLAY=:99 warmwind-os xdotool mousemove ${action.x} ${action.y} click 1`;
    } else if (action.type === 'type') {
        command = `docker exec -e DISPLAY=:99 warmwind-os xdotool type "${action.text}"`;
    }
    
    await fetch('http://localhost:3001/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
    });
};
```

---

## Verification Checklist

After completing all phases, verify:

- [ ] Docker Desktop running on Mac
- [ ] warmwind-vnc image built successfully
- [ ] warmwind-os container running (`docker ps`)
- [ ] VNC accessible at `http://localhost:6080/vnc.html`
- [ ] Chrome launches inside VNC container
- [ ] Cloud OS frontend running at `http://localhost:5173`
- [ ] VNC stream visible in Cloud OS UI
- [ ] Dock icons launch apps via API
- [ ] (Optional) Agent can perceive and act

---

## Troubleshooting

### Docker not starting
```bash
# Check Docker status
docker info

# Restart Docker Desktop
osascript -e 'quit app "Docker"'
open -a Docker
```

### Container not starting
```bash
# Check logs
docker logs warmwind-os

# Remove and recreate
docker rm -f warmwind-os
docker run -d --name warmwind-os -p 6080:6080 warmwind-vnc
```

### VNC not connecting
```bash
# Check if port is open
lsof -i :6080

# Check container services
docker exec warmwind-os supervisorctl status
```

### Chrome not launching
```bash
# Test manually
docker exec -e DISPLAY=:99 warmwind-os google-chrome --no-sandbox --disable-gpu https://google.com
```

---

## Quick Reference Commands

| Action | Command |
|--------|---------|
| Build image | `docker build -t warmwind-vnc docker/` |
| Start container | `docker run -d --name warmwind-os -p 6080:6080 warmwind-vnc` |
| Stop container | `docker stop warmwind-os` |
| Restart container | `docker restart warmwind-os` |
| View logs | `docker logs -f warmwind-os` |
| Launch Chrome | `docker exec -e DISPLAY=:99 warmwind-os google-chrome --no-sandbox` |
| Launch Terminal | `docker exec -e DISPLAY=:99 warmwind-os xterm` |
| Start frontend | `npm run dev` |
| Start launcher API | `npm run launcher` |

---

## Success Criteria

✅ Native Linux desktop running in Docker  
✅ Real Chrome browser with full functionality  
✅ VNC streaming to browser at 60fps  
✅ Beautiful Cloud OS overlay UI  
✅ App launching from dock  
✅ Zero cloud costs (runs locally)  
✅ Agent-ready architecture  

---

## Next Steps After Implementation

1. **Deploy to production** - Use Render.com or Fly.io for Docker container
2. **Add more apps** - VS Code, Spotify, etc.
3. **Multi-session support** - One container per user
4. **GPU acceleration** - For better performance
5. **Full agent integration** - Autonomous control

---

*This guide was created for Warmwind Cloud OS implementation on macOS with Docker Desktop.*
