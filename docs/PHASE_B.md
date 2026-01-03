# Phase B: Codespace VNC Integration

## Current Status
Your Codespace AI copilot has set up the VNC server. Now you need to:

1. **Get your VNC URL** from the PORTS tab in VS Code
2. **Configure Cloud OS** to connect to it

---

## Response to AI Copilot

**Reply with:** `Option 2 - Replace the placeholder Codespace URL`

Then tell the copilot:
```
Please help me find the VNC URL from port 6080 in the PORTS tab, 
and update any placeholder URLs in the codebase with this actual URL.
```

---

## What the Copilot Will Do

1. Check the PORTS tab for port 6080
2. Get the forwarded URL (e.g., `https://abc123.github.dev:6080/vnc.html`)
3. Update placeholder URLs in the code

---

## Next: Test VNC Connection

### Step 1: Find VNC URL
In your Codespace:
1. Look at bottom panel → **PORTS** tab
2. Find row with **Port 6080**
3. Look for the **Forwarded Address** column
4. Copy the full URL (should include `/vnc.html`)

### Step 2: Test in Browser
1. Open new browser tab
2. Paste the VNC URL
3. Click "Connect"
4. You should see Openbox desktop

### Step 3: Test Chrome
In Codespace terminal:
```bash
DISPLAY=:99 google-chrome --no-sandbox --new-window https://youtube.com &
```

Chrome should appear in the VNC browser tab!

---

## Integration with Cloud OS

Once VNC is working, we'll integrate it into Cloud OS:

1. Import `CodespaceVNC` component
2. Add `VMSettings` for URL configuration  
3. Embed VNC stream in Cloud OS UI
4. Add overlay dock

**Files ready:**
- `components/CodespaceVNC.tsx` ✅
- `components/VMSettings.tsx` ✅

**Next commit:** Integration into App.tsx
