import React from 'react';
import { motion } from 'framer-motion';

interface VNCOverlayDockProps {
    onLaunchApp: (command: string) => void;
    onOpenSettings: () => void;
}

export const VNCOverlayDock: React.FC<VNCOverlayDockProps> = ({
    onLaunchApp,
    onOpenSettings
}) => {
    const apps = [
        {
            id: 'chrome',
            name: 'Chrome',
            icon: '/assets/Chrome-Logo.png',
            command: 'google-chrome --no-sandbox https://google.com'
        },
        {
            id: 'youtube',
            name: 'YouTube',
            icon: '/assets/youtube.png',
            command: 'google-chrome --no-sandbox https://youtube.com'
        },
        {
            id: 'gmail',
            name: 'Gmail',
            icon: '/assets/gmail icon.png',
            command: 'google-chrome --no-sandbox https://mail.google.com'
        },
        {
            id: 'docs',
            name: 'Docs',
            icon: '/assets/Google_Docs_logo.png',
            command: 'google-chrome --no-sandbox https://docs.google.com'
        },
        {
            id: 'terminal',
            name: 'Terminal',
            icon: '/assets/terminal.png',
            command: 'xterm'
        }
    ];

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl px-4 py-3 shadow-2xl border border-white/30 flex items-center gap-3">
                {/* App Icons */}
                {apps.map((app) => (
                    <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.15, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onLaunchApp(app.command)}
                        className="group relative"
                        title={app.name}
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all group-hover:bg-white/20 group-hover:shadow-lg">
                            <img
                                src={app.icon}
                                alt={app.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                    // Fallback icon
                                    (e.target as HTMLImageElement).src = '/assets/plus button.png';
                                }}
                            />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {app.name}
                        </div>
                    </motion.button>
                ))}

                {/* Divider */}
                <div className="w-px h-8 bg-white/20 mx-1" />

                {/* Settings Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenSettings}
                    className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                    title="VNC Settings"
                >
                    <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </motion.button>
            </div>
        </motion.div>
    );
};
