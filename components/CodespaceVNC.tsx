import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodespaceVNCProps {
    vncUrl: string; // e.g., "https://your-codespace.github.dev:6080/vnc.html"
}

export const CodespaceVNC: React.FC<CodespaceVNCProps> = ({ vncUrl }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const handleIframeLoad = () => {
        setIsLoading(false);
        // Delay to allow VNC connection
        setTimeout(() => setIsConnected(true), 2000);
    };

    return (
        <div className="relative w-full h-full bg-neutral-50">
            {/* VNC Stream - Full Screen */}
            <iframe
                src={vncUrl}
                className="w-full h-full border-none"
                title="Cloud OS Desktop"
                allow="clipboard-read; clipboard-write"
                onLoad={handleIframeLoad}
            />

            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
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

                        <div className="text-center">
                            <p className="text-neutral-600 text-sm font-medium">
                                Connecting to Cloud OS...
                            </p>
                            <p className="text-neutral-400 text-xs mt-2">
                                Starting virtual desktop
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Connection Status Indicator */}
            {!isLoading && isConnected && (
                <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">Connected</span>
                </div>
            )}
        </div>
    );
};
