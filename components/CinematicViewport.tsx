import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicViewportProps {
  isResponding: boolean;
  assistantMessage: string;
  agentSteps: string[];
  activeStepIndex: number; // -1 = show message, 0+ = show steps
  isAgenticMode: boolean;
  isBooting: boolean; // Prop to control the startup reveal
}

const WelcomeText: React.FC = () => {
  const text = "Welcome";
  const characters = text.split("");

  return (
    <div className="flex gap-[2px]">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.5 + i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-white text-7xl md:text-9xl font-['Dancing_Script'] drop-shadow-2xl"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

const BrandingIsland: React.FC = () => (
  <motion.div
    key="branding"
    initial={{ width: 0, opacity: 0 }}
    animate={{ width: "auto", opacity: 1 }}
    exit={{ width: 0, opacity: 0 }}
    transition={{
      width: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.4 },
      layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }}
    className="bg-white/95 backdrop-blur-sm px-9 py-5 rounded-[24px] shadow-sm border border-white/20 flex items-center justify-center overflow-hidden whitespace-nowrap pointer-events-auto"
  >
    <motion.img
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      src="/assets/warmwind logo text.png"
      alt="warmwind"
      className="h-5 w-auto object-contain opacity-95 brightness-95"
    />
  </motion.div>
);

const AppIcon: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-11 h-11 flex items-center justify-center p-2 rounded-[14px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-neutral-100/50 hover:scale-105 transition-transform cursor-pointer overflow-hidden shrink-0"
  >
    <img src={src} alt={alt} className="w-full h-full object-contain" />
  </motion.div>
);

const AgenticIsland: React.FC = () => {
  const apps = [
    { domain: "gmail.com", alt: "Gmail" },
    { domain: "google.com", alt: "Chrome" },
    { domain: "docs.google.com", alt: "Docs" },
    { domain: "sheets.google.com", alt: "Sheets" },
  ];

  return (
    <motion.div
      key="agentic"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: 1,
        opacity: 1,
      }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{
        scaleX: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.4 }
      }}
      style={{
        transformOrigin: "center",
        borderRadius: "24px"
      }}
      className="bg-white/95 backdrop-blur-md px-5 py-3 shadow-lg border border-white/40 flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap pointer-events-auto"
    >
      <div className="flex items-center gap-3">
        {apps.map((app, index) => (
          <motion.div
            key={app.alt}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            className="w-11 h-11 flex items-center justify-center p-2 rounded-[14px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-neutral-100/50 hover:scale-105 transition-transform cursor-pointer overflow-hidden shrink-0"
          >
            <img src={`https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`} alt={app.alt} className="w-full h-full object-contain" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shrink-0"
      >
        <img
          src="/assets/plus button.png"
          alt="Add"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </motion.div>
    </motion.div>
  );
};

const CinematicViewport: React.FC<CinematicViewportProps> = ({
  isResponding,
  assistantMessage,
  agentSteps,
  activeStepIndex,
  isAgenticMode,
  isBooting
}) => {
  const isAgenticState = activeStepIndex >= 0;

  return (
    <div className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
      {/* Background Image */}
      <img
        src="/assets/OS Wallpaper.jpeg"
        alt="OS Wallpaper"
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Welcome Sequence Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)", transition: { duration: 1 } }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/10"
          >
            <WelcomeText />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />

      {/* Top Island (Badge) */}
      <div className="absolute top-8 left-0 w-full flex justify-center pointer-events-none z-20">
        <AnimatePresence mode="wait">
          {!isBooting && (
            !isAgenticMode ? <BrandingIsland /> : <AgenticIsland />
          )}
        </AnimatePresence>
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
                        // Only show the current step and the next one. Past steps are removed entirely.
                        if (relativePos < 0 || relativePos > 1) return null;

                        return (
                          <motion.div
                            key={step}
                            initial={{ y: 50, opacity: 0, filter: "blur(8px)" }}
                            animate={{
                              y: relativePos === 0 ? 0 : 50, // Active at center, next at bottom
                              opacity: relativePos === 0 ? 1 : 0.3, // Next step is greyed out
                              filter: relativePos === 0 ? "blur(0px)" : "blur(2px)",
                              scale: relativePos === 0 ? 1 : 0.95
                            }}
                            exit={{ y: -50, opacity: 0, filter: "blur(8px)" }} // Past steps slide up and out
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute flex items-center gap-3 w-full justify-center whitespace-nowrap px-4"
                          >
                            {relativePos === 0 && (
                              <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="w-2.5 h-2.5 rounded-full bg-[#E9516E] shadow-[0_0_12px_rgba(233,81,110,0.5)]"
                              />
                            )}
                            <span className={`text-[17px] tracking-tight ${relativePos === 0 ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-light'}`}>
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