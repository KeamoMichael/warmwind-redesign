import React from 'react';
import { motion } from 'framer-motion';
import { AppManifest } from '../config/apps';
import RemoteDesktopView from './RemoteDesktopView';

interface ApplicationWindowProps {
    app: AppManifest;
    onClose: () => void;
}

export const ApplicationWindow: React.FC<ApplicationWindowProps> = ({ app, onClose }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/20 backdrop-blur-3xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
            style={{
                width: app.width || 800,
                height: app.height || 600,
                zIndex: 10
            }}
        >
            {/* Window Title Bar - Glassy with simple X close button */}
            <div className="h-11 bg-white/10 backdrop-blur-3xl flex items-center justify-between px-5 shrink-0 border-b border-white/5 select-none">
                {/* Left: App Logo & Title */}
                <div className="flex items-center gap-3">
                    <img
                        src={app.icon}
                        alt={app.name}
                        className="w-4 h-4 shadow-sm object-contain"
                    />
                    <span className="text-[14px] text-white/90 font-medium tracking-tight">{app.name}</span>
                </div>

                {/* Right: Simple X Close Button (matching ChromeWindow reference) */}
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all group"
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className="text-white/40 group-hover:text-white/80 transition-colors"
                    >
                        <path
                            d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white relative">
                {app.type === 'remote' ? (
                    <RemoteDesktopView appName={app.name} initialUrl={app.url} />
                ) : app.type === 'iframe' && app.url ? (
                    <iframe
                        src={app.url}
                        className="w-full h-full border-none"
                        title={app.name}
                        allow="clipboard-read; clipboard-write; camera; microphone; geolocation"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                        Content Not Available
                    </div>
                )}
            </div>
        </motion.div>
    );
};
