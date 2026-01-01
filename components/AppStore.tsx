import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInteraction } from '../contexts/InteractionContext';
import { APP_REGISTRY } from '../config/apps';
import { AppStoreFloatingDock } from './AppStoreFloatingDock';

interface AppStoreProps {
    onClose: () => void;
    onInstall: (appName: string) => void;
    installedApps: string[];
}

export const AppStore: React.FC<AppStoreProps> = ({ onClose, onInstall, installedApps }) => {
    const { registerElement, unregisterElement } = useInteraction();
    const [currentView, setCurrentView] = useState<'all' | 'installed'>('all');

    // Use APP_REGISTRY for store apps
    const allApps = Object.values(APP_REGISTRY).filter(app => app.id !== "App Store");

    // Filter based on current view
    const storeApps = currentView === 'installed'
        ? allApps.filter(app => installedApps.includes(app.id))
        : allApps;

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[850px] h-[750px] bg-white/20 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
        >
            {/* Unified Header - Exactly like reference */}
            <div className="pt-8 px-10 pb-6 flex items-center justify-between shrink-0">
                <span className="text-xl font-medium text-white/90">App Store</span>

                {/* Centered Search Bar */}
                <div className="flex-1 flex justify-center px-4">
                    <div className="relative w-full max-w-[320px]">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white/60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-11 bg-black/20 backdrop-blur-md border border-white/5 rounded-full pl-12 pr-4 text-white text-[15px] placeholder-white/40 outline-none transition-all focus:bg-black/30"
                        />
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all group"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-white/60 group-hover:text-white/90">
                        <path d="M2.5 2.5 L11.5 11.5 M11.5 2.5 L2.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="grid grid-cols-2 gap-x-6 gap-y-4"
                >
                    {storeApps.map((app) => {
                        const isInstalled = installedApps.includes(app.id);
                        const installButtonId = `install - btn - ${app.id.replace(/\s+/g, '-').toLowerCase()} `;

                        return (
                            <motion.div
                                key={app.id}
                                variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-white/10 backdrop-blur-md hover:bg-white/15 border border-white/5 rounded-[28px] p-4 pr-5 flex items-center justify-between group cursor-pointer transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-[52px] h-[52px] rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden p-2">
                                        <img
                                            src={app.icon}
                                            alt={app.name}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <span className="text-white/95 font-normal text-[16px] tracking-tight truncate max-w-[180px]">
                                        {app.name}
                                    </span>
                                </div>

                                {/* Install/Open Button */}
                                <button
                                    id={installButtonId}
                                    ref={(el) => {
                                        if (el && !isInstalled) {
                                            registerElement(installButtonId, el, { type: 'button' });
                                            return () => unregisterElement(installButtonId);
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isInstalled) {
                                            onInstall(app.id);
                                        }
                                    }}
                                    disabled={isInstalled}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${isInstalled
                                            ? 'bg-teal-500/80'
                                            : 'bg-neutral-600/60 hover:bg-neutral-600/80'
                                        }`}
                                >
                                    {isInstalled ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <img
                                            src="/assets/download.png"
                                            alt="Download"
                                            className="w-4 h-4 object-contain"
                                        />
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Floating Navigation Dock */}
            <AppStoreFloatingDock
                currentView={currentView}
                onViewChange={setCurrentView}
            />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; }
            `}</style>
        </motion.div>
    );
};
