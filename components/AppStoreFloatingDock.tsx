import React from 'react';
import { motion } from 'framer-motion';

interface AppStoreFloatingDockProps {
    currentView: 'all' | 'installed';
    onViewChange: (view: 'all' | 'installed') => void;
}

export const AppStoreFloatingDock: React.FC<AppStoreFloatingDockProps> = ({ currentView, onViewChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-20 top-1/2 -translate-y-1/2 z-20"
        >
            <div className="w-16 bg-white/20 backdrop-blur-3xl rounded-full shadow-2xl border border-white/20 p-3 flex flex-col gap-3">
                {/* All Apps Button */}
                <motion.button
                    onClick={() => onViewChange('all')}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative overflow-hidden ${currentView === 'all'
                            ? 'bg-white/30'
                            : 'bg-transparent hover:bg-white/10'
                        }`}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Home Icon */}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={currentView === 'all' ? '#ffffff' : '#ffffff80'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-colors"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>

                    {/* Active Indicator */}
                    {currentView === 'all' && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 bg-white/20 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </motion.button>

                {/* Downloaded Apps Button */}
                <motion.button
                    onClick={() => onViewChange('installed')}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative overflow-hidden ${currentView === 'installed'
                            ? 'bg-white/30'
                            : 'bg-transparent hover:bg-white/10'
                        }`}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Download Icon */}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={currentView === 'installed' ? '#ffffff' : '#ffffff80'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-colors"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>

                    {/* Active Indicator */}
                    {currentView === 'installed' && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 bg-white/20 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};
