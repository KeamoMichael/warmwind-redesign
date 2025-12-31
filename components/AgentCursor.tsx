import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentCursorProps {
    x: number;
    y: number;
    isVisible: boolean;
    isDown?: boolean;
}

const AgentCursor: React.FC<AgentCursorProps> = ({ x, y, isVisible, isDown = false }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 1,
                        scale: isDown ? 0.8 : 1, // Shrink on click
                        x,
                        y
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                        x: { type: "tween", ease: "linear", duration: 0 }, // Position updates handle smoothing in controller
                        y: { type: "tween", ease: "linear", duration: 0 },
                        scale: { duration: 0.1 },
                        opacity: { duration: 0.2 }
                    }}
                    className="fixed top-0 left-0 pointer-events-none z-[100]"
                    style={{ x, y }} // Use direct style for override
                >
                    {/* Main Pointer Body */}
                    <div className="relative">
                        {/* Glow effect */}
                        <div className={`absolute -inset-4 rounded-full blur-md bg-[#4db7ae]/30 transition-opacity duration-200 ${isDown ? 'opacity-80' : 'opacity-0'}`} />

                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            className={`drop-shadow-lg transition-colors duration-200 ${isDown ? 'text-[#3da095]' : 'text-[#4db7ae]'}`}
                            fill="currentColor"
                        >
                            <path d="M5.5 3.5l12 12-4.6 1.1 3.4 5.2-1.8 1.1-3.4-5.2-3.6 3.6z" />
                        </svg>

                        {/* Click Ripple Ripple */}
                        {isDown && (
                            <motion.div
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 rounded-full border border-[#4db7ae]"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgentCursor;
