import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentCursorProps {
    x: number;
    y: number;
    isVisible: boolean;
}

const AgentCursor: React.FC<AgentCursorProps> = ({ x, y, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        x: x - 12, // Center the 24px dot
                        y: y - 12
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        opacity: { duration: 0.2 }
                    }}
                    className="fixed pointer-events-none z-[100]"
                >
                    {/* Main Red Dot */}
                    <div className="w-6 h-6 bg-[#FF4B4B] rounded-full shadow-[0_0_15px_rgba(255,75,75,0.5)] border-2 border-white relative">
                        {/* Pulsing Outer Ring */}
                        <motion.div
                            animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.6, 0, 0.6]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                            className="absolute inset-[-4px] rounded-full bg-[#FF4B4B]/40"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgentCursor;
