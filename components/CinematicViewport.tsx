import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChromeWindow } from './ChromeWindow';

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

const TopIsland: React.FC<{
  isAgenticMode: boolean;
  openApps: string[];
  onOpenApp: (appName: string) => void;
}> = ({ isAgenticMode, openApps, onOpenApp }) => {
  const [showApps, setShowApps] = React.useState(false);
  const [showPlusButton, setShowPlusButton] = React.useState(false);
  const [launchingApp, setLaunchingApp] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAgenticMode) {
      // Cross-fade: Show plus button almost immediately while logo is fading out
      const plusTimer = setTimeout(() => setShowPlusButton(true), 50);
      // Then show apps with slight delay for stagger effect
      const appsTimer = setTimeout(() => setShowApps(true), 250);

      return () => {
        clearTimeout(plusTimer);
        clearTimeout(appsTimer);
      };
    } else {
      setShowApps(false);
      setShowPlusButton(false);
    }
  }, [isAgenticMode]);

  const handleAppClick = (appName: string) => {
    // Start launching animation
    setLaunchingApp(appName);

    // After bounce animation completes (~1.8s), open the app
    setTimeout(() => {
      setLaunchingApp(null);

      // Only Chrome is implemented - other apps don't open yet
      if (appName === "Chrome") {
        onOpenApp(appName);
      }
    }, 1800);
  };

  const apps = [
    { icon: "/assets/gmail icon.png", alt: "Gmail" },
    { icon: "/assets/Chrome-Logo.png", alt: "Chrome" },
    { icon: "/assets/Google_Docs_logo.png", alt: "Docs" },
    { icon: "/assets/Google_Sheets_Logo.png", alt: "Sheets" },
  ];

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: 1,
        opacity: 1
      }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{
        scaleX: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3 }
      }}
      style={{
        transformOrigin: "center",
        willChange: "transform, opacity"
      }}
      className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-[24px] shadow-lg border border-white/40 flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap pointer-events-auto relative"
    >
      {/* Gradient Fade Masks */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      {/* Branding Logo - cross-fades out when agentic mode starts */}
      <AnimatePresence>
        {!isAgenticMode && (
          <motion.div
            key="logo"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative h-11 flex items-center justify-center overflow-hidden"
          >
            <img
              src="/assets/warmwind logo text.png"
              alt="warmwind"
              className="h-5 w-auto object-contain opacity-95 brightness-95"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Dock - appears after logo exits and island expands */}
      {isAgenticMode && (
        <div className="flex items-center gap-3">
          {/* Apps - only render when ready to show */}
          {showApps && (
            <div className="flex items-center gap-3">
              {apps.map((app, index) => {
                const isActive = openApps.includes(app.alt);
                const isLaunching = launchingApp === app.alt;

                return (
                  <motion.div
                    key={app.alt}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative flex flex-col items-center group cursor-pointer shrink-0"
                    onClick={() => handleAppClick(app.alt)}
                  >
                    {/* App Icon Container */}
                    <motion.div
                      animate={
                        isLaunching
                          ? { translateY: [0, -8, 0] }
                          : isActive
                            ? { scale: 0.9, translateY: -4 }
                            : { scale: 1, translateY: 0 }
                      }
                      whileHover={
                        isActive
                          ? { scale: 0.95 }
                          : isLaunching
                            ? {}
                            : { translateY: -4 }
                      }
                      transition={
                        isLaunching
                          ? {
                            duration: 0.6,
                            repeat: Infinity,
                            ease: [0.42, 0, 0.58, 1]
                          }
                          : {
                            duration: 0.2,
                            ease: "easeOut"
                          }
                      }
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      <img
                        src={app.icon}
                        alt={app.alt}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -bottom-2 w-1 h-1 rounded-full bg-neutral-600"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Plus Button - render immediately as placeholder, then animate */}
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: showPlusButton ? 1 : 1,
              opacity: showPlusButton ? 1 : 0
            }}
            transition={{
              opacity: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            style={{ willChange: "opacity" }}
            className="group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-95">
              <img
                src="/assets/plus button.png"
                alt="Add"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      )}
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
  const [openApps, setOpenApps] = React.useState<string[]>([]);

  const handleCloseApp = (appName: string) => {
    setOpenApps(prev => prev.filter(app => app !== appName));
  };

  const handleOpenApp = (appName: string) => {
    if (!openApps.includes(appName)) {
      setOpenApps(prev => [...prev, appName]);
    }
  };

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
        {!isBooting && <TopIsland isAgenticMode={isAgenticMode} openApps={openApps} onOpenApp={handleOpenApp} />}
      </div>

      {/* Chrome Window */}
      <AnimatePresence>
        {openApps.includes("Chrome") && (
          <ChromeWindow onClose={() => handleCloseApp("Chrome")} />
        )}
      </AnimatePresence>

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