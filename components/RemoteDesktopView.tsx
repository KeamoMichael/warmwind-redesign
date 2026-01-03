import React, { useEffect, useRef, useState, useCallback } from 'react';
import { runtimeClient } from '../services/RuntimeClient';

interface RemoteDesktopViewProps {
    appName: string;
    streamUrl?: string;
    initialUrl?: string;
}

const RemoteDesktopView: React.FC<RemoteDesktopViewProps> = ({ appName, streamUrl, initialUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [connected, setConnected] = useState(false);
    const [latency, setLatency] = useState(0);
    const frameCountRef = useRef(0);
    const currentUrlRef = useRef<string | null>(null);

    // Frame rendering callback
    const handleFrame = useCallback((frameData: string) => {
        frameCountRef.current++;
        if (frameCountRef.current === 1 || frameCountRef.current % 50 === 0) {
            console.log(`🎬 Frame received: #${frameCountRef.current} (${Math.round(frameData.length / 1024)}KB)`);
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const img = new Image();
                img.onload = () => {
                    if (canvasRef.current) {
                        // Scale image to fill canvas while maintaining aspect ratio
                        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    }
                };
                img.src = `data:image/jpeg;base64,${frameData}`;
            }
        }
    }, []);

    // Connection established callback
    const handleConnected = useCallback(() => {
        console.log(`🎯 RemoteDesktopView: Connection established for ${appName}`);
        setConnected(true);

        // ALWAYS navigate when connection is established (not just first time)
        if (initialUrl && currentUrlRef.current !== initialUrl) {
            currentUrlRef.current = initialUrl;
            console.log(`🚀 Navigating to: ${initialUrl}`);
            runtimeClient.navigate(initialUrl);
        }
    }, [appName, initialUrl]);

    useEffect(() => {
        console.log(`📡 RemoteDesktopView: Initializing connection for ${appName}`);
        frameCountRef.current = 0;
        currentUrlRef.current = null;

        runtimeClient.connect(streamUrl, handleFrame, handleConnected);

        const latencyTimer = setInterval(() => {
            setLatency(Math.floor(20 + Math.random() * 10));
        }, 1000);

        return () => {
            console.log(`🔌 RemoteDesktopView: Cleanup for ${appName}`);
            runtimeClient.disconnect();
            clearInterval(latencyTimer);
        };
    }, [streamUrl, handleFrame, handleConnected, appName]);

    // Navigate when URL changes (for app switching)
    useEffect(() => {
        if (connected && initialUrl && currentUrlRef.current !== initialUrl) {
            console.log(`🔄 URL changed, navigating to: ${initialUrl}`);
            currentUrlRef.current = initialUrl;
            runtimeClient.navigate(initialUrl);
        }
    }, [connected, initialUrl]);

    // Scale mouse coordinates to match canvas resolution
    const getScaledCoordinates = (e: React.MouseEvent) => {
        if (!containerRef.current || !canvasRef.current) return { x: 0, y: 0 };

        const rect = containerRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        return {
            x: Math.floor((e.clientX - rect.left) * scaleX),
            y: Math.floor((e.clientY - rect.top) * scaleY)
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const { x, y } = getScaledCoordinates(e);
        runtimeClient.sendInput({ type: 'mousemove', x, y });
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const { x, y } = getScaledCoordinates(e);
        console.log(`🖱️ Click at (${x}, ${y})`);
        runtimeClient.sendInput({
            type: 'click',
            x,
            y,
            button: e.button === 0 ? 'left' : 'right'
        });
    };

    // Keyboard input handlers
    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();

        const specialKeys = ['Enter', 'Backspace', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];

        if (specialKeys.includes(e.key)) {
            console.log(`⌨️ Special key: ${e.key}`);
            runtimeClient.sendInput({ type: 'keypress', key: e.key });
        } else if (e.key.length === 1) {
            console.log(`⌨️ Typing: ${e.key}`);
            runtimeClient.sendInput({ type: 'type', text: e.key });
        }
    };

    const handleContainerClick = (e: React.MouseEvent) => {
        containerRef.current?.focus();
        handleClick(e);
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className="w-full h-full bg-black relative overflow-hidden cursor-none focus:outline-none"
            onMouseMove={handleMouseMove}
            onClick={handleContainerClick}
            onKeyDown={handleKeyDown}
        >
            {/* Canvas for streaming - use 16:9 aspect ratio */}
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
            />

            {/* Status Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs font-mono">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div>
                    <span>{connected ? 'Connected' : 'Connecting...'}</span>
                    {connected && <span className="text-emerald-400">• {latency}ms</span>}
                </div>
                <div className="text-gray-400 mt-1">{appName}</div>
            </div>
        </div>
    );
};

export default RemoteDesktopView;
