import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { runtimeClient } from '../services/RuntimeClient';

interface RemoteDesktopViewProps {
    appName: string;
    streamUrl?: string; // Optional real stream URL
}

const RemoteDesktopView: React.FC<RemoteDesktopViewProps> = ({ appName, streamUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        runtimeClient.connect();
        return () => runtimeClient.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Send relative coordinates
        runtimeClient.sendInput({
            type: 'mousemove',
            x,
            y
        });
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
            className="w-full h-full bg-black relative overflow-hidden cursor-none" // Hide default cursor, AgentCursor will overlay
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            {/* Stream Simulation Layer */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white/50">
                <div className="text-center">
                    <div className="text-2xl font-semibold mb-2">☁️ Cloud Runtime: {appName}</div>
                    <div className="text-sm font-mono text-emerald-400">Stream Active • Latency: 24ms</div>
                    {/* Dynamic Noise/Stream placeholder */}
                    <div className="mt-8 w-64 h-32 bg-gray-800 rounded border border-gray-700 mx-auto flex items-center justify-center">
                        <span className="text-xs text-gray-500">[ Video Stream Buffer ]</span>
                    </div>
                </div>
            </div>

            {/* Actual Iframe Fallback (Optional for transition) */}
            {/* If we had a real VNC url we would put <canvas> or <img> here */}
        </div>
    );
};

export default RemoteDesktopView;
