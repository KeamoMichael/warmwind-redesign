import React from 'react';
import { motion } from 'framer-motion';

interface AppStoreProps {
    onClose: () => void;
    onInstall: (appName: string) => void;
}

export const AppStore: React.FC<AppStoreProps> = ({ onClose, onInstall }) => {
    const storeApps = [
        { name: "Amazon", icon: "/assets/amazon icon.png" }, // Assuming asset exists or will be added
        { name: "Canva", icon: "/assets/canva icon.png" },
        { name: "ChatGPT", icon: "/assets/chatgpt icon.png" },
        { name: "Chrome", icon: "/assets/Chrome-Logo.png" },
        { name: "Cryptped", icon: "/assets/cryptped icon.png" },
        { name: "DuckDuckGo", icon: "/assets/duckduckgo icon.png" },
        { name: "Ebay", icon: "/assets/ebay icon.png" },
        { name: "Gmail", icon: "/assets/gmail icon.png" },
        { name: "Firebase Studio", icon: "/assets/firebase icon.png" },
        { name: "Google Calendar", icon: "/assets/Google_Calendar_logo.png" },
        { name: "Google Docs", icon: "/assets/Google_Docs_logo.png" },
        { name: "Google Drive", icon: "/assets/Google_Drive_logo.png" },
        { name: "Google Sheets", icon: "/assets/Google_Sheets_Logo.png" },
        { name: "Google Slides", icon: "/assets/Google_Slides_Logo.png" },
    ];

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[800px] h-[700px] bg-white/20 backdrop-blur-3xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
        >
            {/* Window Title Bar - Extremely Glassy */}
            <div className="h-11 bg-white/10 backdrop-blur-3xl flex items-center justify-between px-5 shrink-0 border-b border-white/5">
                {/* Left: App Store Title Only */}
                <div className="flex items-center gap-3">
                    <span className="text-[14px] text-white/90 font-medium tracking-tight">App Store</span>
                </div>

                {/* Right: Window Controls */}
                <div className="flex items-center">
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
            </div>

            {/* Header / Search Area */}
            <div className="pt-10 px-12 pb-8 flex items-center justify-between">
                <h1 className="text-2xl font-medium text-white/90">Featured</h1>

                {/* Search Bar */}
                <div className="flex-1 max-w-sm mx-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white/40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search Apps..."
                            className="w-full h-11 bg-white/10 hover:bg-white/15 border border-white/5 rounded-2xl pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all focus:bg-white/20"
                        />
                    </div>
                </div>

                <div className="w-10" /> {/* Spacer for symmetry */}
            </div>

            {/* Grid with Rowing Reveal Animation */}
            <div className="flex-1 overflow-y-auto px-12 pb-10 custom-scrollbar">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                    className="grid grid-cols-2 gap-x-8 gap-y-4"
                >
                    {storeApps.map((app) => (
                        <motion.div
                            key={app.name}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl p-4 flex items-center justify-between group cursor-pointer transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                    <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-white/90 font-medium text-lg">{app.name}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onInstall(app.name);
                                }}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white/80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 17V3m0 14-4-4m4 4 4-4M2 17l.6 2.1c.3.9 1.1 1.5 2 1.5h14.8c.9 0 1.7-.6 2-1.5l.6-2.1" />
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
        </motion.div>
    );
};
