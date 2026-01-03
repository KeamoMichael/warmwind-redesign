# GitHub Codespaces Setup Guide

## Prerequisites
- GitHub account (you already have one)
- GitHub Codespaces access (free tier: 60 hours/month)

---

## Step 1: Commit Devcontainer Config

### 1.1 Commit Files
```bash
cd "m:\ANTIGRAVITY PROJECTS\warmwind-redesign"

git add .devcontainer/
git commit -m "Add GitHub Codespaces devcontainer config"
git push origin main
```

---

## Step 2: Launch Codespace

### 2.1 Open Repository on GitHub
1. Go to https://github.com/KeamoMichael/warmwind-redesign
2. Click green **"Code"** button
3. Click **"Codespaces"** tab
4. Click **"Create codespace on main"**

### 2.2 Wait for Setup
- Codespace provisions Ubuntu container (~2 min)
- Runs `.devcontainer/setup.sh` automatically (~5 min)
- Installs X11, Openbox, Chrome, noVNC

**Total Time:** ~7 minutes

### 2.3 Setup Complete
When you see:
```
✅ Setup Complete!
════════════════════════════════════════
🎯 To start Cloud OS:
   ./start-vnc.sh
```

You're ready!

---

## Step 3: Start VNC Server

### 3.1 Run Startup Script
In the Codespace terminal:
```bash
./start-vnc.sh
```

**Expected Output:**
```
🎬 Starting Warmwind Cloud OS...
✅ Cloud OS Started!
==================

🌐 Access VNC:
   Open browser to forwarded port 6080
```

---

## Step 4: Access VNC Desktop

### 4.1 Find Forwarded Port
1. In VS Code, look for **"PORTS"** tab (bottom panel)
2. Find port **6080** (noVNC Web)
3. Hover over the port row
4. Click **🌐 globe icon** or **"Open in Browser"**

### 4.2 Connect to VNC
1. Browser opens to `https://<random>.github.dev:6080/vnc.html`
2. Click **"Connect"**
3. No password needed
4. You see **Openbox desktop** (gray background)

---

## Step 5: Test Chrome

### 5.1 Launch Chrome in VNC
In Codespace terminal:
```bash
DISPLAY=:99 google-chrome --no-sandbox --new-window https://youtube.com &
```

### 5.2 Verify in VNC
- Switch to VNC browser tab
- Chrome window appears on Openbox desktop
- YouTube loads
- You can click, scroll, type

✅ **Native Chrome running in real X11!**

---

## Step 6: Test Other Apps

### Launch Terminal
```bash
DISPLAY=:99 xterm &
```

### Launch Calculator
```bash
DISPLAY=:99 xcalc &
```

### Window Management
- **Move:** Click title bar, drag
- **Resize:** Drag window edges
- **Close:** Right-click title bar → Close

---

## Step 7: Integrate with Cloud OS

### 7.1 Architecture
```
Cloud OS Client (Vercel)
    ↓
noVNC Canvas (embedded iframe)
    ↓
Codespace Port 6080 (noVNC server)
    ↓
X11 Display :99 (Chrome, apps)
```

### 7.2 Create VNC Component
```tsx
// components/CodespaceVNC.tsx
export const CodespaceVNC = () => {
    const vncUrl = "https://<your-codespace>.github.dev:6080/vnc.html";
    
    return (
        <div className="relative w-full h-full">
            {/* Embedded VNC */}
            <iframe 
                src={vncUrl} 
                className="w-full h-full border-none"
            />
            
            {/* Cloud OS UI Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <OverlayDock />
            </div>
        </div>
    );
};
```

---

## GitHub Codespaces Free Tier

### Limits
- **Hours:** 60 hours/month (2 hours/day)
- **Storage:** 15 GB
- **Instance:** 2 cores, 4 GB RAM

### Best Practices
1. **Stop when not using** - hours count when running
2. **Use timeout** - set auto-stop to 30 min idle
3. **Delete old codespaces** - free up storage

### How to Stop
1. Click **"Codespaces"** menu (bottom left in VS Code)
2. Click **"Stop Current Codespace"**
3. VNC stops, no hours consumed

### How to Resume
1. Go to GitHub repo
2. **Code** → **Codespaces** → Select existing codespace
3. VNC auto-starts via `postStartCommand`

---

## Troubleshooting

### VNC Not Loading
```bash
# Check services
sudo supervisorctl status

# Restart
sudo supervisorctl restart all
```

### Chrome Won't Launch
```bash
# Check X11 display
export DISPLAY=:99
xdotool getdisplaygeometry

# Expected: 1280 720
```

### Port Not Forwarded
1. Open **PORTS** tab
2. Right-click port 6080
3. **"Port Visibility"** → **"Public"**

---

## Next Steps

### Phase A Checklist
- [ ] Codespace created
- [ ] VNC accessible via browser
- [ ] Chrome launches successfully
- [ ] Window management works
- [ ] Ready for Cloud OS integration

### Phase B: Cloud OS Integration
- [ ] Create `CodespaceVNC.tsx` component
- [ ] Embed VNC iframe in Cloud OS
- [ ] Add overlay dock
- [ ] Test app launching from UI

---

## Cost Analysis

### Free Tier Usage
- **Development:** 2 hours/day = 60 hours/month ✅
- **Perfect for:** Solo development, POC
- **Not for:** Production, multi-user

### Upgrade Options
| Tier | Hours | Cost |
|------|-------|------|
| Free | 60 hrs/mo | $0 |
| Pro | 180 hrs/mo | $10/mo |

---

## Comparison: Codespaces vs Oracle Cloud

| Feature | Codespaces | Oracle Cloud |
|---------|------------|--------------|
| Credit Card | ❌ No | ✅ Yes (€0.93) |
| RAM | 4 GB | 24 GB |
| Hours | 60/mo free | Unlimited |
| Setup | 7 min | 45 min |
| Use Case | Development | Production |

**Recommendation:** Start with Codespaces for POC, migrate to Oracle later when you have credit card.

---

## Ready?

Once devcontainer files are committed and pushed, you can:
1. Create codespace on GitHub
2. Wait for setup (~7 min)
3. Run `./start-vnc.sh`
4. Access VNC on port 6080
5. Test Chrome

**Estimated time to first Chrome window:** 10 minutes from now!
