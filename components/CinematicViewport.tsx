import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicViewportProps {
  isResponding: boolean;
  assistantMessage: string;
}

const CinematicViewport: React.FC<CinematicViewportProps> = ({ isResponding, assistantMessage }) => {
  return (
    <div className="w-full h-full relative rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
      {/* Background Image - Updated to the pink/purple lake landscape as requested */}
      <img
        src="/assets/OS Wallpaper.jpeg"
        alt="OS Wallpaper"
        className="w-full h-full object-cover"
      />

      {/* Overlay gradient for better text readability if needed, kept very subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />

      {/* Top Badge - Wrapped in a flex container to guarantee centering regardless of transforms */}
      <div className="absolute top-8 left-0 w-full flex justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <div className="bg-white/90 backdrop-blur-md px-12 py-4 rounded-[20px] shadow-sm border border-white/20 flex items-center justify-center">
            <span className="text-[#4A4A4A] text-[15px] font-medium tracking-wide">
              warmwind
            </span>
          </div>
        </motion.div>
      </div>

      {/* Agent Response Widget - Centered at the bottom */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none z-20">
        <AnimatePresence>
          {isResponding && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-full h-[60px] flex items-center px-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden whitespace-nowrap pointer-events-auto"
            >
              <div className="flex items-center gap-4">
                <span className="text-neutral-600 text-[15px] font-light">
                  {assistantMessage}
                </span>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E9516E]">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CinematicViewport;