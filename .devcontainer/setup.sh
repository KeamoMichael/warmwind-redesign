#!/bin/bash
# GitHub Codespaces - Warmwind Cloud OS Setup
# This runs automatically when codespace is created

set -e

echo "🚀 Setting up Warmwind Cloud OS in Codespace..."
echo "================================================"

# Update packages
echo "📦 Updating system..."
sudo apt-get update
sudo apt-get upgrade -y

# Install X11 and window manager
echo "🖥️  Installing X11 and Openbox..."
sudo apt-get install -y \
    xvfb \
    x11vnc \
    openbox \
    xterm \
    supervisor \
    websockify \
    tigervnc-standalone-server \
    tigervnc-common \
    novnc \
    net-tools \
    wget \
    curl

# Install Google Chrome
echo "🌐 Installing Google Chrome..."
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Create supervisor config
echo "⚙️  Configuring services..."
sudo mkdir -p /etc/supervisor/conf.d

sudo tee /etc/supervisor/conf.d/warmwind.conf > /dev/null <<'EOF'
[supervisord]
nodaemon=false
logfile=/tmp/supervisord.log
pidfile=/tmp/supervisord.pid

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
EOF

# Create startup script
echo "📝 Creating startup script..."
tee ~/start-vnc.sh > /dev/null <<'EOF'
#!/bin/bash
echo "🎬 Starting Warmwind Cloud OS..."

# Start supervisor
sudo supervisord -c /etc/supervisor/conf.d/warmwind.conf

echo ""
echo "✅ Cloud OS Started!"
echo "=================="
echo ""
echo "🌐 Access VNC:"
echo "   Open browser to forwarded port 6080"
echo "   Or: http://localhost:6080/vnc.html"
echo ""
echo "🖥️  Display: :99"
echo ""
echo "🚀 Launch Chrome:"
echo "   DISPLAY=:99 google-chrome --no-sandbox &"
echo ""
EOF

chmod +x ~/start-vnc.sh

echo ""
echo "════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════"
echo ""
echo "🎯 To start Cloud OS:"
echo "   ./start-vnc.sh"
echo ""
