import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

    useEffect(() => {
        // Connect to runtime with frame callback
        runtimeClient.connect(streamUrl, (frameData) => {
            // Render frame to canvas
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                    };
                    img.src = `data:image/jpeg;base64,${frameData}`;
                }
            }
        });

        setConnected(true);

        // Navigate to initial URL if provided
        if (initialUrl) {
            // Small delay to ensure connection is established
            setTimeout(() => {
                runtimeClient.navigate(initialUrl);
            }, 500);
        }

        // Simulate latency monitoring
        const latencyTimer = setInterval(() => {
            setLatency(Math.floor(20 + Math.random() * 10));
        }, 1000);

        return () => {
            runtimeClient.disconnect();
            clearInterval(latencyTimer);
        };
    }, [streamUrl, initialUrl]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        runtimeClient.sendInput({
            type: 'mousemove',
            x,
            y
        });
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        runtimeClient.sendInput({
            type: 'click',
            x,
            y,
            button: e.button === 0 ? 'left' : 'right'
        });
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-black relative overflow-hidden cursor-none"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            {/* Canvas for streaming */}
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full h-full object-contain"
            />

            {/* Status Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-xs font-mono">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                    <span>{connected ? 'Connected' : 'Connecting...'}</span>
                    {connected && <span className="text-emerald-400">• {latency}ms</span>}
                </div>
                <div className="text-gray-400 mt-1">{appName}</div>
            </div>
        </div>
    );
};

export default RemoteDesktopView;
