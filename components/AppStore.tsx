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

    const [downloadingApp, setDownloadingApp] = useState<string | null>(null);

    const handleInstallClick = (appId: string) => {
        setDownloadingApp(appId);
        // Simulate download delay
        setTimeout(() => {
            onInstall(appId);
            setDownloadingApp(null);
        }, 2500);
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative flex items-center justify-center"
        >
            {/* Floating Navigation Dock - Now visible because parent lacks overflow-hidden */}
            <AppStoreFloatingDock
                currentView={currentView}
                onViewChange={setCurrentView}
            />

            {/* Main App Store Window */}
            <div className="w-[850px] h-[750px] bg-white/20 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20">
                {/* Unified Header - Exactly like reference */}
                <div className="pt-8 px-10 pb-6 flex items-center justify-between shrink-0">
                    <span className="text-xl font-medium text-white/90">App Store</span>

                    <div className="flex-1 max-w-md mx-8 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-white/40 group-focus-within:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-black/10 text-white placeholder-white/40 rounded-full py-3.5 pl-12 pr-4 outline-none focus:bg-black/20 transition-all border border-transparent focus:border-white/10"
                        />
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <svg className="w-6 h-6 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* App Grid */}
                <div className="flex-1 overflow-visible relative px-6 pb-8">
                    <div className="h-full overflow-y-auto custom-scrollbar px-4">
                        <div className="grid grid-cols-2 gap-x-5 gap-y-4 pb-20">
                            {storeApps.map((app) => {
                                const isInstalled = installedApps.includes(app.id);
                                const isDownloading = downloadingApp === app.id;
                                const installButtonId = `install-btn-${app.id.replace(/\s+/g, '-').toLowerCase()}`;

                                return (
                                    <motion.div
                                        key={app.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-5 rounded-[28px] border border-white/10 flex items-center justify-between group transition-colors"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-white rounded-2xl p-2.5 shadow-lg flex items-center justify-center shrink-0">
                                                <img
                                                    src={app.icon}
                                                    alt={app.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <span className="text-lg font-medium text-white tracking-wide truncate max-w-[180px]">
                                                {app.name}
                                            </span>
                                        </div>

                                        {/* Install/Open/Download Button */}
                                        <button
                                            id={installButtonId}
                                            ref={(el) => {
                                                if (el && !isInstalled && !isDownloading) {
                                                    registerElement(installButtonId, el, { type: 'button' });
                                                    return () => unregisterElement(installButtonId);
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isInstalled && !isDownloading) {
                                                    handleInstallClick(app.id);
                                                }
                                            }}
                                            disabled={isInstalled || isDownloading}
                                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${isInstalled
                                                    ? 'bg-teal-500/80'
                                                    : isDownloading
                                                        ? 'bg-transparent border-2 border-white/30'
                                                        : 'bg-neutral-600/60 hover:bg-neutral-600/80'
                                                }`}
                                        >
                                            {isInstalled ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : isDownloading ? (
                                                <svg className="animate-spin w-4 h-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 0px; }
                `}</style>
            </div>
        </motion.div>
    );
};
