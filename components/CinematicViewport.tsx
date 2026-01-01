import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChromeWindow } from './ChromeWindow';
import { AppStore } from './AppStore';
import ConversationWidget from './ConversationWidget';
import { useInteraction } from '../contexts/InteractionContext';
import { APP_REGISTRY } from '../config/apps';
import { ApplicationWindow } from './ApplicationWindow';
// ... (Top of file imports)

// ...



interface CinematicViewportProps {
  isResponding: boolean;
  assistantMessage: string;
  agentSteps: string[];
  activeStepIndex: number; // -1 = show message, 0+ = show steps
  isAgenticMode: boolean;
  isBooting: boolean; // Prop to control the startup reveal
  agentStatus?: "thinking" | "keyboard" | "clicking" | null;
  openApps: string[];
  onOpenApp: (appName: string) => void;
  onCloseApp: (appName: string) => void;

  // New Props for Conversation Widget
  installedApps: string[];
  onInstallApp: (appName: string) => void;
  showConversationWidget: boolean;
  messages: Array<{ role: 'user' | 'assistant', content: string }>;
  onSendMessage: (message: string) => void;
  onCloseConversationWidget: () => void;
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

// TopIsland definition restored
const TopIsland: React.FC<{
  isAgenticMode: boolean;
  openApps: string[];
  installedApps: string[];
  onOpenApp: (appName: string) => void;
  onOpenAppStore: () => void;
}> = ({ isAgenticMode, openApps, installedApps, onOpenApp, onOpenAppStore }) => {
  const [showApps, setShowApps] = React.useState(false);
  const [showPlusButton, setShowPlusButton] = React.useState(false);
  const [launchingApp, setLaunchingApp] = React.useState<string | null>(null);

  // Interaction Registry
  const { registerElement } = useInteraction();

  React.useEffect(() => {
    if (isAgenticMode) {
      const plusTimer = setTimeout(() => setShowPlusButton(true), 50);
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
    setLaunchingApp(appName);
    setTimeout(() => {
      setLaunchingApp(null);
      onOpenApp(appName);
    }, 1800);
  };

  const allApps = [
    { icon: "/assets/gmail icon.png", alt: "Gmail" },
    { icon: "/assets/Chrome-Logo.png", alt: "Chrome" },
    { icon: "/assets/Google_Docs_logo.png", alt: "Docs" },
    { icon: "/assets/Google_Sheets_Logo.png", alt: "Sheets" },
    { icon: "/assets/canva icon.png", alt: "Canva" },
    { icon: "/assets/chatgpt icon.png", alt: "ChatGPT" },
    { icon: "/assets/vscode.png", alt: "VS Code" },
  ];

  const visibleApps = allApps.filter(app => installedApps.includes(app.alt) || app.alt === "Chrome");

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{ scaleX: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
      style={{ transformOrigin: "center", willChange: "transform, opacity" }}
      className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-[24px] shadow-lg border border-white/40 flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap pointer-events-auto relative"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

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
            <img src="/assets/warmwind logo text.png" alt="warmwind" className="h-5 w-auto object-contain opacity-95 brightness-95" />
          </motion.div>
        )}
      </AnimatePresence>

      {isAgenticMode && (
        <div className="flex items-center gap-3">
          {showApps && (
            <div className="flex items-center gap-3">
              {visibleApps.map((app, index) => {
                const isActive = openApps.includes(app.alt);
                const isLaunching = launchingApp === app.alt;
                return (
                  <motion.div
                    key={app.alt}
                    ref={(el) => {
                      if (el instanceof HTMLElement) {
                        registerElement(`dock-icon-${app.alt}`, el, {
                          type: 'button',
                          onFocus: () => handleAppClick(app.alt) // Optional direct invoke
                        });
                      }
                    }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative flex flex-col items-center group cursor-pointer shrink-0"
                    onClick={() => handleAppClick(app.alt)}
                  >
                    <motion.div
                      animate={isLaunching ? { translateY: [0, -8, 0] } : isActive ? { scale: 0.9, translateY: -4 } : { scale: 1, translateY: 0 }}
                      whileHover={isActive ? { scale: 0.95 } : isLaunching ? {} : { translateY: -4 }}
                      transition={isLaunching ? { duration: 0.6, repeat: Infinity, ease: [0.42, 0, 0.58, 1] } : { duration: 0.2, ease: "easeOut" }}
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      <img src={app.icon} alt={app.alt} className="w-full h-full object-contain" />
                    </motion.div>
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
          <motion.div
            ref={(el) => {
              if (el instanceof HTMLElement) {
                registerElement(`dock-icon-App Store`, el, {
                  type: 'button',
                  onFocus: onOpenAppStore // Optional direct invoke
                });
              }
            }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: showPlusButton ? 1 : 1, opacity: showPlusButton ? 1 : 0 }}
            transition={{ opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            style={{ willChange: "opacity" }}
            className="group cursor-pointer shrink-0"
            onClick={onOpenAppStore}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-95">
              <img src="/assets/plus button.png" alt="Add" className="w-full h-full object-contain drop-shadow-sm" />
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
  isBooting,
  agentStatus,
  openApps,
  onOpenApp,
  onCloseApp,
  installedApps,
  onInstallApp,
  showConversationWidget,
  messages,
  onSendMessage,
  onCloseConversationWidget
}) => {
  const isAgenticState = activeStepIndex >= 0;
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to front when a new app is opened
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [openApps.length]);

  return (
    <div className="relative w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
      {/* Background Image */}
      <img
        src="/assets/Wallpaper For OS.jpg"
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
      <div className="absolute top-8 left-0 w-full flex justify-center pointer-events-none z-30">
        {!isBooting && (
          <TopIsland
            isAgenticMode={isAgenticMode}
            openApps={openApps}
            installedApps={installedApps}
            onOpenApp={onOpenApp}
            onOpenAppStore={() => onOpenApp("App Store")}
          />
        )}
      </div>

      {/* Carousel Window Container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-20 px-[calc(50vw-400px)] pointer-events-auto overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full py-20"
          style={{ scrollBehavior: 'smooth' }}
        >
          <AnimatePresence mode="popLayout">
            {openApps.map((appName, index) => (
              <motion.div
                key={appName}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  zIndex: 20 - index,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  layout: { duration: 0.6 }
                }}
                className="shrink-0 snap-center"
              >
                {appName === "Chrome" ? (
                  <ChromeWindow onClose={() => onCloseApp("Chrome")} />
                ) : appName === "App Store" ? (
                  <AppStore onClose={() => onCloseApp("App Store")} onInstall={onInstallApp} />
                ) : (
                  APP_REGISTRY[appName] ? (
                    <ApplicationWindow
                      app={APP_REGISTRY[appName]}
                      onClose={() => onCloseApp(appName)}
                    />
                  ) : null
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Agent Response/Agentic Widget - Persistent & Expandable */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none z-20 px-4">
        <AnimatePresence mode="wait">
          {(showConversationWidget || isResponding) && (
            <div className="pointer-events-auto">
              <ConversationWidget
                messages={messages}
                agentSteps={agentSteps}
                activeStepIndex={activeStepIndex}
                isAgenticMode={isAgenticMode}
                onSendMessage={onSendMessage}
                onClose={onCloseConversationWidget}
                isResponding={isResponding}
                currentAssistantMessage={assistantMessage}
                agentStatus={agentStatus}
              />
            </div>
          )}
        </AnimatePresence>
      </div>



      {/* Agent Feedback: Inner Screen Glow */}
      <AnimatePresence>
        {isResponding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-[40]"
          >
            {/* The actual glow container */}
            <motion.div
              animate={{
                boxShadow: [
                  "inset 0 0 60px rgba(0, 255, 255, 0.4)",
                  "inset 0 0 100px rgba(0, 255, 255, 0.6)",
                  "inset 0 0 60px rgba(0, 255, 255, 0.4)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full rounded-[32px] md:rounded-[40px] border-[3px] border-cyan-400/30"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicViewport;