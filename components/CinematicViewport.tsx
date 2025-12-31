import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicViewportProps {
  isResponding: boolean;
  assistantMessage: string;
  agentSteps: string[];
  activeStepIndex: number; // -1 = show message, 0+ = show steps
}

const CinematicViewport: React.FC<CinematicViewportProps> = ({
  isResponding,
  assistantMessage,
  agentSteps,
  activeStepIndex
}) => {
  const isAgenticState = activeStepIndex >= 0;

  return (
    <div className="w-full h-full relative rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
      {/* Background Image */}
      <img
        src="/assets/OS Wallpaper.jpeg"
        alt="OS Wallpaper"
        className="w-full h-full object-cover"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />

      {/* Top Badge */}
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

      {/* Agent Response/Agentic Widget */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none z-20 px-4">
        <AnimatePresence mode="wait">
          {isResponding && (
            <motion.div
              layout
              key={isAgenticState ? "agentic" : "message"}
              initial={{ height: 60, opacity: 0, scale: 0.95 }}
              animate={{ height: isAgenticState ? 160 : 60, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden pointer-events-auto flex items-center justify-center min-w-[320px] max-w-[500px] px-8"
            >
              {!isAgenticState ? (
                /* Initial Message State */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center w-full"
                >
                  <span className="text-neutral-600 text-[15px] font-light text-center leading-relaxed">
                    {assistantMessage}
                  </span>
                </motion.div>
              ) : (
                /* Agentic Steps State */
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-6">
                  {/* Gradient Fade Masks */}
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

                  {/* Steps List (Slot Machine Effect) */}
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {agentSteps.map((step, idx) => {
                        const relativePos = idx - activeStepIndex;
                        // Show current step and the next one
                        if (relativePos < -1 || relativePos > 1) return null;

                        return (
                          <motion.div
                            key={step}
                            initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
                            animate={{
                              y: relativePos === 0 ? 0 : relativePos * 40,
                              opacity: relativePos === 0 ? 1 : 0.2, // Grey out pending/past
                              filter: relativePos === 0 ? "blur(0px)" : "blur(1px)",
                              scale: relativePos === 0 ? 1 : 0.9
                            }}
                            exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute flex items-center gap-3 w-full justify-center whitespace-nowrap"
                          >
                            {relativePos === 0 && (
                              <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="w-2.5 h-2.5 rounded-full bg-[#E9516E] shadow-[0_0_10px_rgba(233,81,110,0.4)]"
                              />
                            )}
                            <span className={`text-[17px] ${relativePos === 0 ? 'text-neutral-700 font-medium' : 'text-neutral-300 font-light'}`}>
                              {step}
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CinematicViewport;