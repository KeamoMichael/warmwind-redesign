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
    const frameCountRef = useRef(0);
    const currentUrlRef = useRef<string | null>(null);

    // Frame rendering callback
    const handleFrame = useCallback((frameData: string) => {
        frameCountRef.current++;

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const img = new Image();
                img.onload = () => {
                    if (canvasRef.current && containerRef.current) {
                        // Match canvas to container size for perfect fit
                        const container = containerRef.current;
                        canvasRef.current.width = container.clientWidth;
                        canvasRef.current.height = container.clientHeight;
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

        // Navigate when connection is established
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

        return () => {
            console.log(`🔌 RemoteDesktopView: Cleanup for ${appName}`);
            runtimeClient.disconnect();
        };
    }, [streamUrl, handleFrame, handleConnected, appName]);

    // Navigate when URL changes
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
        // Use 1280x720 as the server viewport size
        const scaleX = 1280 / rect.width;
        const scaleY = 720 / rect.height;

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
            runtimeClient.sendInput({ type: 'keypress', key: e.key });
        } else if (e.key.length === 1) {
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
            className="w-full h-full bg-white relative overflow-hidden focus:outline-none"
            onMouseMove={handleMouseMove}
            onClick={handleContainerClick}
            onKeyDown={handleKeyDown}
        >
            {/* Canvas for streaming - fills container */}
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />

            {/* Loading state - only shown briefly */}
            {!connected && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <div className="flex items-center gap-2 text-neutral-400">
                        <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin"></div>
                        <span>Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RemoteDesktopView;
