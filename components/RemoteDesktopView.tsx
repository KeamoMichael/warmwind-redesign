import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [loadingProgress, setLoadingProgress] = useState(0);
    const frameCountRef = useRef(0);
    const currentUrlRef = useRef<string | null>(null);

    // Simulate loading progress
    useEffect(() => {
        if (!connected) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) return prev; // Cap at 90% until actually connected
                    return prev + Math.random() * 15;
                });
            }, 200);
            return () => clearInterval(interval);
        } else {
            setLoadingProgress(100);
        }
    }, [connected]);

    // Frame rendering callback
    const handleFrame = useCallback((frameData: string) => {
        frameCountRef.current++;

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const img = new Image();
                img.onload = () => {
                    if (canvasRef.current && containerRef.current) {
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
        console.log(`🎯 Connected: ${appName}`);
        setConnected(true);

        if (initialUrl && currentUrlRef.current !== initialUrl) {
            currentUrlRef.current = initialUrl;
            runtimeClient.navigate(initialUrl);
        }
    }, [appName, initialUrl]);

    useEffect(() => {
        frameCountRef.current = 0;
        currentUrlRef.current = null;
        setLoadingProgress(0);
        setConnected(false);

        runtimeClient.connect(streamUrl, handleFrame, handleConnected);

        return () => {
            runtimeClient.disconnect();
        };
    }, [streamUrl, handleFrame, handleConnected, appName]);

    useEffect(() => {
        if (connected && initialUrl && currentUrlRef.current !== initialUrl) {
            currentUrlRef.current = initialUrl;
            runtimeClient.navigate(initialUrl);
        }
    }, [connected, initialUrl]);

    const getScaledCoordinates = (e: React.MouseEvent) => {
        if (!containerRef.current || !canvasRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
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
        runtimeClient.sendInput({ type: 'click', x, y, button: e.button === 0 ? 'left' : 'right' });
    };

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
            className="w-full h-full bg-neutral-50 relative overflow-hidden focus:outline-none"
            onMouseMove={handleMouseMove}
            onClick={handleContainerClick}
            onKeyDown={handleKeyDown}
        >
            {/* Canvas for streaming */}
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Beautiful Loading Overlay */}
            <AnimatePresence>
                {!connected && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-neutral-100 flex flex-col items-center justify-center gap-6"
                    >
                        {/* Spinning Loader */}
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 rounded-full border-[3px] border-neutral-200 border-t-[#4db7ae]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-[#4db7ae] rounded-full" />
                            </div>
                        </div>

                        {/* Loading Text */}
                        <div className="text-center">
                            <p className="text-neutral-600 text-sm font-medium">Connecting to {appName}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-48 h-1 bg-neutral-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#4db7ae] to-[#7dd3c8] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadingProgress}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RemoteDesktopView;
