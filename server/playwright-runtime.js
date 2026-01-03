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

    // Queue for messages received before browser is ready
    const messageQueue = [];
    let browserReady = false;

    // Register message handler FIRST
    ws.on('message', async (rawData) => {
        try {
            const dataStr = rawData.toString();
            const command = JSON.parse(dataStr);

            // Queue messages if browser not ready
            if (!browserReady) {
                messageQueue.push(command);
                return;
            }

            await processCommand(command);
        } catch (err) {
            console.error('❌ Message error:', err.message);
        }
    });

    // Process a single command
    async function processCommand(command) {
        switch (command.type) {
            case 'navigate':
                console.log(`🌐 Navigating to ${command.url}`);
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
                } finally {
                    isNavigating = false;
                }
                break;

            case 'click':
                // Fast click without waiting
                page.mouse.click(command.x, command.y).catch(() => { });
                break;

            case 'mousemove':
                // Fast move without waiting
                page.mouse.move(command.x, command.y).catch(() => { });
                break;

            case 'type':
                // Type immediately
                page.keyboard.type(command.text).catch(() => { });
                break;

            case 'keypress':
                page.keyboard.press(command.key).catch(() => { });
                break;

            default:
                console.warn('⚠️ Unknown command:', command.type);
        }
    }

    try {
        // Launch browser with SPEED optimized settings
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-extensions',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows'
            ]
        });

        page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });

        sessions.set(sessionId, { browser, page });
        console.log(`✅ Browser ready: ${sessionId}`);

        // Browser is now ready
        browserReady = true;

        // Process queued messages
        if (messageQueue.length > 0) {
            console.log(`📬 Processing ${messageQueue.length} queued commands`);
            for (const cmd of messageQueue) {
                await processCommand(cmd);
            }
        }

        ws.send(JSON.stringify({
            type: 'connected',
            sessionId,
            message: 'Ready'
        }));

        // OPTIMIZED: Lower quality for SPEED, higher FPS
        let frameCount = 0;
        screenshotInterval = setInterval(async () => {
            if (page && ws.readyState === 1 && !isNavigating) {
                try {
                    const screenshot = await page.screenshot({
                        type: 'jpeg',
                        quality: 50 // Lower quality = faster transmission
                    });

                    ws.send(JSON.stringify({
                        type: 'frame',
                        data: screenshot.toString('base64')
                    }));

                    frameCount++;
                } catch (err) {
                    // Ignore screenshot errors during navigation
                }
            }
        }, 50); // 20 FPS for smoother feel

    } catch (err) {
        console.error('❌ Browser launch failed:', err);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to launch browser: ' + err.message
        }));
    }

    // Cleanup on disconnect
    ws.on('close', async () => {
        console.log(`🔌 Disconnected: ${sessionId}`);
        if (screenshotInterval) clearInterval(screenshotInterval);
        if (browser) {
            await browser.close();
            sessions.delete(sessionId);
        }
    });

    ws.on('error', (err) => {
        console.error(`❌ WebSocket error: ${err.message}`);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Playwright Runtime on port ${PORT}`);
});
