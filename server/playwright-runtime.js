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

// Active browser sessions
const sessions = new Map();

wss.on('connection', async (ws) => {
    console.log('🔌 Client connected');

    const sessionId = Math.random().toString(36).substring(7);
    let browser = null;
    let page = null;
    let screenshotInterval = null;
    let isNavigating = false;

    try {
        // Launch browser with optimized settings
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ]
        });

        page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });

        sessions.set(sessionId, { browser, page });

        console.log(`✅ Browser launched for session ${sessionId}`);

        // Navigate to a default page to verify browser works
        try {
            console.log(`🌐 Auto-navigating to example.com to verify browser...`);
            await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
            console.log(`✅ Auto-navigation successful - browser is working`);
        } catch (navErr) {
            console.error(`❌ Auto-navigation failed:`, navErr.message);
        }

        ws.send(JSON.stringify({
            type: 'connected',
            sessionId,
            message: 'Browser launched successfully'
        }));

        // Start streaming high-quality screenshots (15 FPS)
        let frameCount = 0;
        screenshotInterval = setInterval(async () => {
            if (page && ws.readyState === 1 && !isNavigating) {
                try {
                    const screenshot = await page.screenshot({
                        type: 'jpeg',
                        quality: 85 // Higher quality for better fidelity
                    });

                    ws.send(JSON.stringify({
                        type: 'frame',
                        data: screenshot.toString('base64')
                    }));

                    frameCount++;
                    if (frameCount === 1 || frameCount % 100 === 0) {
                        console.log(`📹 Streaming frames: ${frameCount} sent to ${sessionId}`);
                    }
                } catch (err) {
                    // Page might be navigating, ignore
                }
            }
        }, 66); // ~15 FPS for smoother experience

        // Handle incoming commands
        ws.on('message', async (rawData) => {
            try {
                const dataStr = rawData.toString();
                console.log(`📨 Raw message received (${dataStr.length} chars)`);

                const command = JSON.parse(dataStr);
                console.log(`📨 Command: ${command.type}`, command.url || command.x || '');

                switch (command.type) {
                    case 'navigate':
                        console.log(`🌐 Navigating to ${command.url}...`);
                        isNavigating = true;
                        try {
                            await page.goto(command.url, {
                                waitUntil: 'domcontentloaded',
                                timeout: 30000
                            });
                            console.log(`✅ Navigation complete: ${command.url}`);
                            ws.send(JSON.stringify({ type: 'navigated', url: command.url }));
                        } catch (navErr) {
                            console.error(`❌ Navigation failed: ${navErr.message}`);
                            ws.send(JSON.stringify({ type: 'error', message: `Navigation failed: ${navErr.message}` }));
                        } finally {
                            isNavigating = false;
                        }
                        break;

                    case 'click':
                        console.log(`🖱️ Click at (${command.x}, ${command.y})`);
                        await page.mouse.click(command.x, command.y);
                        break;

                    case 'mousemove':
                        await page.mouse.move(command.x, command.y);
                        break;

                    case 'type':
                        console.log(`⌨️ Typing: ${command.text}`);
                        await page.keyboard.type(command.text);
                        break;

                    case 'keypress':
                        console.log(`⌨️ Key: ${command.key}`);
                        await page.keyboard.press(command.key);
                        break;

                    default:
                        console.warn('⚠️ Unknown command:', command.type);
                }
            } catch (err) {
                console.error('❌ Message handling error:', err.message);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: err.message
                }));
            }
        });

    } catch (err) {
        console.error('❌ Browser launch failed:', err);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to launch browser: ' + err.message
        }));
    }

    // Cleanup on disconnect
    ws.on('close', async () => {
        console.log(`🔌 Client disconnected: ${sessionId}`);

        if (screenshotInterval) clearInterval(screenshotInterval);

        if (browser) {
            await browser.close();
            sessions.delete(sessionId);
        }
    });

    ws.on('error', (err) => {
        console.error(`❌ WebSocket error for ${sessionId}:`, err.message);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Playwright Runtime Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
