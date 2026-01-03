export interface MouseEvent {
    type: 'mousemove' | 'mousedown' | 'mouseup' | 'click';
    x: number;
    y: number;
    button?: 'left' | 'right' | 'middle';
}

export interface KeyboardEvent {
    type: 'keydown' | 'keyup' | 'keypress';
    key: string;
    text?: string;
}

interface FrameMessage {
    type: 'frame';
    data: string; // base64 jpeg
}

interface StatusMessage {
    type: 'connected' | 'navigated' | 'error';
    message?: string;
    sessionId?: string;
}

type ServerMessage = FrameMessage | StatusMessage;

class RuntimeClient {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private frameCallback: ((frameData: string) => void) | null = null;
    private onConnectedCallback: (() => void) | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    connect(url?: string, onFrame?: (frameData: string) => void, onConnected?: () => void) {
        const wsUrl = url || import.meta.env.VITE_RUNTIME_URL || 'ws://localhost:8080';

        console.log(`🔌 Connecting to Playwright Runtime at ${wsUrl}...`);

        this.frameCallback = onFrame || null;
        this.onConnectedCallback = onConnected || null;

        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log("✅ Runtime Connected. Stream Ready.");
                this.isConnected = true;
                this.reconnectAttempts = 0;

                // Call the onConnected callback if provided
                if (this.onConnectedCallback) {
                    this.onConnectedCallback();
                }
            };

            this.socket.onmessage = (event) => {
                try {
                    const message: ServerMessage = JSON.parse(event.data);

                    if (message.type === 'frame' && this.frameCallback) {
                        this.frameCallback(message.data);
                    } else if (message.type === 'connected') {
                        console.log(`📡 Session started: ${message.sessionId}`);
                    } else if (message.type === 'navigated') {
                        console.log(`🌐 Navigation confirmed by server: ${(message as any).url}`);
                    } else if (message.type === 'error') {
                        console.error('❌ Runtime error:', message.message);
                    }
                } catch (err) {
                    console.error('Failed to parse server message:', err);
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.socket.onclose = () => {
                console.log('🔌 Disconnected from Runtime.');
                this.isConnected = false;

                // Auto-reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                    setTimeout(() => this.connect(wsUrl, this.frameCallback || undefined, this.onConnectedCallback || undefined), 2000);
                }
            };
        } catch (err) {
            console.error('Failed to create WebSocket:', err);
        }
    }

    sendInput(event: MouseEvent | KeyboardEvent) {
        if (!this.isConnected || !this.socket) {
            console.warn("Runtime not connected. Input dropped.");
            return;
        }

        this.socket.send(JSON.stringify(event));
    }

    navigate(url: string) {
        if (!this.isConnected || !this.socket) {
            console.warn("Runtime not connected. Navigation dropped.");
            return;
        }

        const message = JSON.stringify({ type: 'navigate', url });
        console.log(`📤 Sending navigate command: ${url} (${message.length} chars)`);
        this.socket.send(message);
        console.log(`✅ Navigate command sent to server`);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.isConnected = false;
        this.frameCallback = null;
        console.log("🔌 Manually disconnected from Runtime.");
    }
}

export const runtimeClient = new RuntimeClient();
