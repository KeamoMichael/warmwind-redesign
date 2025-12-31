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
                    <div className="relative flex items-center justify-center">
                        {/* Continuous Pulse Ring (Outer Halo) */}
                        <motion.div
                            className="absolute bg-[#4db7ae] rounded-full opacity-40"
                            style={{
                                width: '40px',
                                height: '40px',
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Main Cursor Dot */}
                        <div className="relative z-20 w-5 h-5 bg-[#4db7ae] rounded-full border-[2px] border-white shadow-md" />

                        {/* Click Ripple Ripple */}
                        {isDown && (
                            <motion.div
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 rounded-full border-2 border-[#4db7ae] z-10"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgentCursor;
