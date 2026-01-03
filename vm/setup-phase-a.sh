#!/bin/bash
# Oracle Cloud VM Setup Script - Phase A
# Run this on a fresh Ubuntu 22.04 ARM64 instance

set -e  # Exit on error

echo "🚀 Warmwind Cloud OS - Phase A Setup"
echo "===================================="
echo ""

# Update system
echo "📦 Step 1/6: Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install X11 and dependencies
echo "🖥️  Step 2/6: Installing X11 server and Openbox..."
sudo apt install -y \
    xvfb \
    openbox \
    x11vnc \
    xdotool \
    wget \
    curl \
    git \
    supervisor \
    net-tools

# Install KasmVNC
echo "📺 Step 3/6: Installing KasmVNC..."
cd /tmp
wget https://github.com/kasmtech/KasmVNC/releases/download/v1.2.0/kasmvncserver_jammy_1.2.0_arm64.deb
sudo apt install -y ./kasmvncserver_jammy_1.2.0_arm64.deb

# Configure Xvfb to start on boot
echo "⚙️  Step 4/6: Configuring virtual display..."
sudo tee /etc/systemd/system/xvfb.service > /dev/null <<EOF
[Unit]
Description=X Virtual Frame Buffer Service
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/Xvfb :99 -screen 0 1280x720x24 -ac +extension GLX +render -noreset
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Configure Openbox to start on boot
echo "🪟 Step 5/6: Configuring Openbox window manager..."
sudo tee /etc/systemd/system/openbox.service > /dev/null <<EOF
[Unit]
Description=Openbox Window Manager
After=xvfb.service
Requires=xvfb.service

[Service]
Type=simple
User=ubuntu
Environment="DISPLAY=:99"
ExecStart=/usr/bin/openbox
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Configure KasmVNC to start on boot
echo "🔌 Step 6/6: Configuring KasmVNC server..."
sudo tee /etc/systemd/system/kasmvnc.service > /dev/null <<EOF
[Unit]
Description=KasmVNC Server
After=openbox.service
Requires=openbox.service

[Service]
Type=forking
User=ubuntu
Environment="DISPLAY=:99"
ExecStart=/usr/bin/vncserver :1 -depth 24 -geometry 1280x720 -websocket 8443
ExecStop=/usr/bin/vncserver -kill :1
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Set VNC password
echo "🔐 Setting VNC password..."
mkdir -p ~/.vnc
echo "warmwind" | vncpasswd -f > ~/.vnc/passwd
chmod 600 ~/.vnc/passwd

# Configure VNC to use Openbox
echo "exec openbox" > ~/.vnc/xstartup
chmod +x ~/.vnc/xstartup

# Enable and start services
echo "▶️  Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable xvfb.service
sudo systemctl enable openbox.service
sudo systemctl enable kasmvnc.service

sudo systemctl start xvfb.service
sleep 2
sudo systemctl start openbox.service
sleep 2
sudo systemctl start kasmvnc.service

# Verify X11 is running
echo ""
echo "✅ Verifying X11 display..."
export DISPLAY=:99
xdotool getdisplaygeometry

# Open firewall for VNC port
echo "🔥 Configuring firewall..."
sudo ufw allow 8443/tcp
sudo ufw allow 22/tcp
echo "y" | sudo ufw enable

# Print status
echo ""
echo "════════════════════════════════════════"
echo "✅ Phase A Setup Complete!"
echo "════════════════════════════════════════"
echo ""
echo "🌐 VNC Web Access:"
echo "   https://$(curl -s ifconfig.me):8443/"
echo ""
echo "🔑 VNC Password: warmwind"
echo ""
echo "📊 Service Status:"
sudo systemctl status xvfb.service --no-pager | grep Active
sudo systemctl status openbox.service --no-pager | grep Active
sudo systemctl status kasmvnc.service --no-pager | grep Active
echo ""
echo "🎯 Next Steps:"
echo "   1. Access VNC web interface from browser"
echo "   2. Verify you see an empty Openbox desktop"
echo "   3. Proceed to Phase B (Install Chrome)"
echo ""
