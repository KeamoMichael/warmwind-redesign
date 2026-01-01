import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInteraction } from '../contexts/InteractionContext';
import { APP_REGISTRY } from '../config/apps';
import { AppStoreFloatingDock } from './AppStoreFloatingDock';

interface AppStoreProps {
    onClose: () => void;
    onInstall: (appName: string) => void;
    onUninstall: (appName: string) => void;
    installedApps: string[];
}

export const AppStore: React.FC<AppStoreProps> = ({ onClose, onInstall, onUninstall, installedApps }) => {
    const { registerElement, unregisterElement } = useInteraction();
    const [currentView, setCurrentView] = useState<'all' | 'installed'>('all');

    // Use APP_REGISTRY for store apps
    const allApps = Object.values(APP_REGISTRY).filter(app => app.id !== "App Store");

    const [searchQuery, setSearchQuery] = useState('');

    // Filter based on current view and search query
    const storeApps = (currentView === 'installed'
        ? allApps.filter(app => installedApps.includes(app.id))
        : allApps).filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const [downloadState, setDownloadState] = useState<Record<string, 'idle' | 'detecting' | 'downloading' | 'installed'>>({});
    const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

    const handleInstallClick = (appId: string) => {
        // Phase 1: Hardware Detection (Spinner)
        setDownloadState(prev => ({ ...prev, [appId]: 'detecting' }));

        setTimeout(() => {
            // Phase 2: Detecting finished, start download
            setDownloadState(prev => ({ ...prev, [appId]: 'downloading' }));
            setDownloadProgress(prev => ({ ...prev, [appId]: 0 }));

            // Simulate progress 0 -> 100
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                setDownloadProgress(prev => ({ ...prev, [appId]: progress }));

                if (progress >= 100) {
                    clearInterval(interval);
                    // Phase 3: Complete
                    onInstall(appId);
                    setDownloadState(prev => {
                        const newState = { ...prev };
                        delete newState[appId]; // Reset state
                        return newState;
                    });
                }
            }, 100); // 2 seconds total for download (20 steps * 100ms)
        }, 2000); // 2 seconds for detection
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentView + searchQuery} // Key ensures fade transition on view change
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-2 gap-x-5 gap-y-4 pb-20"
                            >
                                {storeApps.map((app) => {
                                    const isInstalled = installedApps.includes(app.id);
                                    const state = downloadState[app.id] || 'idle';
                                    const progress = downloadProgress[app.id] || 0;
                                    const isBusy = state === 'detecting' || state === 'downloading';

                                    const installButtonId = `install-btn-${app.id.replace(/\s+/g, '-').toLowerCase()}`;

                                    return (
                                        <div
                                            key={app.id}
                                            className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-5 rounded-[28px] border border-white/10 flex items-center justify-between group transition-colors"
                                        >
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        {/* Progress */}
                                                        <path
                                                            className="text-teal-400 transition-all duration-100 ease-linear"
                                                            strokeDasharray={`${progress}, 100`}
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                    </svg>
                                                    {/* Tiny stop icon in middle */}
                                                    <div className="absolute w-2.5 h-2.5 bg-teal-400 rounded-sm" />
                                                </div>
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
            </div >
        </motion.div >
    );
};
