import express from 'express';
import { WebSocketServer } from 'ws';
import { chromium } from 'playwright';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;

// Health check for Render
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// CORS for Vercel
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Active browser sessions (session-id -> { browser, page })
const sessions = new Map();

wss.on('connection', async (ws) => {
    console.log('🔌 Client connected');

    const sessionId = Math.random().toString(36).substring(7);
    let browser = null;
    let page = null;
    let screenshotInterval = null;

    try {
        // Launch browser
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });

        sessions.set(sessionId, { browser, page });

        console.log(`✅ Browser launched for session ${sessionId}`);

        ws.send(JSON.stringify({
            type: 'connected',
            sessionId,
            message: 'Browser launched successfully'
        }));

        // Start streaming screenshots (10 FPS)
        let frameCount = 0;
        screenshotInterval = setInterval(async () => {
            if (page && ws.readyState === 1) {
                try {
                    const screenshot = await page.screenshot({
                        type: 'jpeg',
                        quality: 70
                    });

                    ws.send(JSON.stringify({
                        type: 'frame',
                        data: screenshot.toString('base64')
                    }));

                    frameCount++;
                    if (frameCount % 50 === 1) {
                        console.log(`📹 Streamed ${frameCount} frames to session ${sessionId}`);
                    }
                } catch (err) {
                    // Page might be navigating, ignore
                }
            }
        }, 100);

        // Handle incoming commands
        ws.on('message', async (data) => {
            try {
                const command = JSON.parse(data.toString());
                console.log(`📨 Command received: ${command.type}`, command.type === 'navigate' ? command.url : '');

                switch (command.type) {
                    case 'navigate':
                        console.log(`🌐 Navigating to ${command.url}...`);
                        await page.goto(command.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                        console.log(`✅ Navigation complete: ${command.url}`);
                        ws.send(JSON.stringify({ type: 'navigated', url: command.url }));
                        break;

                    case 'click':
                        await page.mouse.click(command.x, command.y);
                        break;

                    case 'mousemove':
                        await page.mouse.move(command.x, command.y);
                        break;

                    case 'type':
                        await page.keyboard.type(command.text);
                        break;

                    case 'keypress':
                        await page.keyboard.press(command.key);
                        break;

                    default:
                        console.warn('Unknown command:', command.type);
                }
            } catch (err) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: err.message
                }));
            }
        });

    } catch (err) {
        console.error('Browser launch failed:', err);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to launch browser: ' + err.message
        }));
    }

    // Cleanup on disconnect
    ws.on('close', async () => {
        console.log('🔌 Client disconnected');

        if (screenshotInterval) clearInterval(screenshotInterval);

        if (browser) {
            await browser.close();
            sessions.delete(sessionId);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Playwright Runtime Server running on port ${PORT}`);
});
