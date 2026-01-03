# Phase B: Cloud OS VNC Integration

## Overview
Integrate the Codespace VNC stream into the Cloud OS UI, replacing the current Playwright streaming approach.

---

## Step 1: Test Codespace VNC

### 1.1 Create Codespace
Follow `walkthrough.md` to:
1. Create GitHub Codespace
2. Run `./start-vnc.sh`
3. Access VNC on port 6080

### 1.2 Get VNC URL
1. In Codespace, open **PORTS** tab
2. Find port **6080**
3. Right-click → **"Port Visibility"** → **"Public"**
4. Copy the forwarded URL (e.g., `https://abc123.github.dev:6080/vnc.html`)
5. Save this URL - you'll need it in Step 3

---

## Step 2: Update App.tsx

### 2.1 Add VM Settings State
```tsx
// Add to App.tsx state
const [showVMSettings, setShowVMSettings] = useState(false);
const [vncUrl, setVncUrl] = useState(
    localStorage.getItem('codespace_vnc_url') || ''
);
```

### 2.2 Replace CinematicViewport
Find the `<CinematicViewport>` component and replace with:

```tsx
{vncUrl ? (
    <CodespaceVNC vncUrl={vncUrl} />
) : (
    <div className="flex items-center justify-center h-full">
        <button 
            onClick={() => setShowVMSettings(true)}
            className="bg-[#4db7ae] text-white px-6 py-3 rounded-lg"
        >
            Configure Codespace VNC
        </button>
    </div>
)}
```

### 2.3 Add Settings Modal
```tsx
{showVMSettings && (
    <VMSettings 
        onClose={() => {
            setShowVMSettings(false);
            setVncUrl(localStorage.getItem('codespace_vnc_url') || '');
        }} 
    />
)}
```

---

## Step 3: Configure VNC URL

### 3.1 Run Development Server
```bash
npm run dev
```

### 3.2 Open Cloud OS
1. Go to http://localhost:5173
2. Click **"Configure Codespace VNC"**
3. Paste your Codespace VNC URL from Step 1.2
4. Click **"Save"**

### 3.3 Verify Connection
- Cloud OS should now show your Codespace desktop
- You see Openbox window manager
- Chrome window (if launched in Codespace)
- "Connected" badge in top right

---

## Step 4: Add Overlay Dock

### 4.1 Modify BottomDock.tsx
The dock should appear **above** the VNC stream:

```tsx
// In App.tsx
<div className="relative flex-1">
    <CodespaceVNC vncUrl={vncUrl} />
    
    {/* Overlay Dock */}
    <div className="absolute bottom-0 w-full pointer-events-none">
        <div className="pointer-events-auto">
            <BottomDock
                openApps={openApps}
                installedApps={installedApps}
                onOpenApp={handleOpenApp}
            />
        </div>
    </div>
</div>
```

### 4.2 Make Dock Transparent
Update BottomDock styles to use transparency:
```tsx
className="bg-white/10 backdrop-blur-xl"
```

---

## Step 5: VM Control API (Optional)

### 5.1 Create API Endpoint
For launching apps from Cloud OS dock:

```typescript
// server/codespace-api.ts
app.post('/codespace/launch', async (req, res) => {
    const { app, url } = req.body;
    
    // SSH to Codespace and launch app
    const command = `DISPLAY=:99 ${app} ${url} &`;
    
    // Execute via Codespace CLI or SSH
    // (requires Codespace SSH access)
});
```

### 5.2 Update Dock Click Handlers
```tsx
const handleOpenApp = async (appName: string) => {
    // Send launch command to Codespace
    await fetch('/codespace/launch', {
        method: 'POST',
        body: JSON.stringify({ app: 'google-chrome', url: '...' })
    });
};
```

---

## Architecture Comparison

### Before (Playwright)
```
Vercel UI → Render Server → Playwright → Screenshots → WebSocket → Client
```
- ❌ 512 MB RAM limit
- ❌ Cold starts
- ❌ High latency
- ✅ Agent control

### After (Codespace VNC)
```
Vercel UI → Codespace VNC (iframe) → X11 Desktop → Native Apps
```
- ✅ 4 GB RAM
- ✅ Native app fidelity
- ✅ Low latency (direct VNC)
- ⚠️ Manual app launching (for now)

---

## Phase B Checklist

- [ ] Codespace VNC accessible
- [ ] VNC URL configured in Cloud OS
- [ ] VNC stream displays in Cloud OS UI
- [ ] Overlay dock visible and functional
- [ ] Chrome visible in VNC stream
- [ ] Connection status indicator shows "Connected"

---

## Next: Phase C - Agent Integration

Once Phase B is complete:
1. Capture VNC frames for agent perception
2. Forward agent actions to Codespace
3. Implement verification loop
4. Full autonomous control

**Current Status:** Manual app launching via Codespace terminal  
**Goal:** Agent launches and controls apps autonomously
