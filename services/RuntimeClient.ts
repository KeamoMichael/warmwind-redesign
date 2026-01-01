export interface MouseEvent {
    type: 'mousemove' | 'mousedown' | 'mouseup' | 'click';
    x: number;
    y: number;
    button?: 'left' | 'right' | 'middle';
}

export interface KeyboardEvent {
    type: 'keydown' | 'keyup';
    key: string;
    code: string;
}

class RuntimeClient {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;

    connect(url: string = "wss://api.warmwind.os/runtime/v1/stream") {
        // Mock Connection
        console.log(`🔌 Connecting to Cloud Runtime at ${url}...`);
        this.isConnected = true;

        // Simulate connection event
        setTimeout(() => {
            console.log("✅ Runtime Connected. Stream Ready.");
        }, 500);
    }

    sendInput(event: MouseEvent | KeyboardEvent) {
        if (!this.isConnected) {
            // console.warn("Runtime not connected. Input dropped.");
            return;
        }

        // In production, this would be: this.socket.send(JSON.stringify(event));
        console.log(`[Runtime Input] Sending:`, event);
    }

    disconnect() {
        this.isConnected = false;
        console.log("🔌 Disconnected from Runtime.");
    }
}

export const runtimeClient = new RuntimeClient();
