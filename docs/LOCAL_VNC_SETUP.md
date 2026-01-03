# Local VNC Setup for Windows

## Overview
Run VNC server locally on your Windows PC - no Codespaces needed.

---

## Option 1: WSL2 + X11 + noVNC (Recommended)

### Step 1: Install WSL2 (if not already)
```powershell
wsl --install -d Ubuntu
```

Restart computer if prompted, then continue.

### Step 2: Install X11 + noVNC in WSL
Open Ubuntu terminal:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install X11, VNC, and Chrome
sudo apt install -y xvfb x11vnc openbox xterm novnc websockify

# Install Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install -y google-chrome-stable
```

### Step 3: Start VNC Server
```bash
# Start virtual display
Xvfb :99 -screen 0 1280x720x24 &
export DISPLAY=:99

# Start window manager
openbox &

# Start VNC server
x11vnc -display :99 -nopw -listen 0.0.0.0 -forever &

# Start noVNC (web interface)
websockify --web=/usr/share/novnc 6080 localhost:5900 &
```

### Step 4: Access VNC
1. Open browser: `http://localhost:6080/vnc.html`
2. Click "Connect"
3. See your local Linux desktop!

### Step 5: Launch Chrome
In WSL terminal:
```bash
DISPLAY=:99 google-chrome --no-sandbox https://youtube.com &
```

---

## Option 2: One-Command Start Script

Create `start-local-vnc.sh` in WSL:
```bash
#!/bin/bash
echo "🚀 Starting Warmwind Local VNC..."

# Kill existing processes
pkill -f Xvfb
pkill -f x11vnc
pkill -f websockify

# Start services
Xvfb :99 -screen 0 1280x720x24 &
sleep 1
export DISPLAY=:99
openbox &
sleep 1
x11vnc -display :99 -nopw -listen 0.0.0.0 -forever &
sleep 1
websockify --web=/usr/share/novnc 6080 localhost:5900 &

echo ""
echo "✅ VNC Ready!"
echo "🌐 Open: http://localhost:6080/vnc.html"
echo ""
echo "🚀 Launch Chrome: DISPLAY=:99 google-chrome --no-sandbox https://youtube.com &"
```

Make executable: `chmod +x start-local-vnc.sh`
Run: `./start-local-vnc.sh`

---

## Configure Cloud OS

### VNC URL for Local Setup
```
http://localhost:6080/vnc.html
```

Paste this URL into the Cloud OS VNC settings.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start VNC | `./start-local-vnc.sh` |
| Open Chrome | `DISPLAY=:99 google-chrome --no-sandbox &` |
| Open YouTube | `DISPLAY=:99 google-chrome --no-sandbox https://youtube.com &` |
| Access VNC | `http://localhost:6080/vnc.html` |

---

## Benefits of Local VNC
- ✅ No Codespaces needed
- ✅ No internet required for VNC
- ✅ Faster (localhost)
- ✅ Full control
- ✅ Uses your existing Windows PC
