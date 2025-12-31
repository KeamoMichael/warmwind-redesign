import React from 'react';
import CinematicViewport from './components/CinematicViewport';
import BottomDock from './components/BottomDock';
import { processUserMessage } from './services/gemini';

const App: React.FC = () => {
  const [isResponding, setIsResponding] = React.useState(false);
  const [assistantMessage, setAssistantMessage] = React.useState("");
  const [agentSteps, setAgentSteps] = React.useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = React.useState(-1);
  const [isAgenticMode, setIsAgenticMode] = React.useState(false);
  const [isBooting, setIsBooting] = React.useState(true);
  const [agentStatus, setAgentStatus] = React.useState<"thinking" | "keyboard" | "clicking" | null>(null);
  const [cursorPosition, setCursorPosition] = React.useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [openApps, setOpenApps] = React.useState<string[]>([]);
  const responseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // OS Boot Sequence
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
      const morphTimer = setTimeout(() => {
        setIsAgenticMode(true);
      }, 5500);
      return () => clearTimeout(morphTimer);
    }, 4500);
    return () => clearTimeout(bootTimer);
  }, []);

  const handleCloseApp = (appName: string) => {
    setOpenApps(prev => prev.filter(app => app !== appName));
  };

  const handleOpenApp = (appName: string) => {
    const name = appName === "Docs" ? "Google Docs" : appName;
    setOpenApps(prev => {
      if (prev.includes(name)) {
        return [name, ...prev.filter(app => app !== name)];
      }
      return [name, ...prev];
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);

    setIsResponding(true);
    setAgentStatus("thinking");
    setAssistantMessage("Processing request...");
    setActiveStepIndex(-1);

    try {
      const result = await processUserMessage(message);
      setAssistantMessage(result.message);

      if (result.intent === "conversational") {
        setIsResponding(true);
        setTimeout(() => setIsResponding(false), 5000);
        setAgentStatus(null);
        return;
      }

      // Agentic Flow
      setIsAgenticMode(true);
      if (result.steps) setAgentSteps(result.steps);

      if (result.action?.app) {
        handleOpenApp(result.action.app);
      }

      setActiveStepIndex(0);
      setAgentStatus("keyboard");

      const cycleSteps = (index: number) => {
        if (result.steps && index < result.steps.length) {
          responseTimeoutRef.current = setTimeout(() => {
            setActiveStepIndex(index + 1);

            const statuses: ("thinking" | "keyboard" | "clicking")[] = ["thinking", "keyboard", "clicking"];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            setAgentStatus(newStatus);

            if (newStatus === "clicking") {
              setCursorPosition({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
              });
            }

            cycleSteps(index + 1);
          }, 2000);
        } else {
          setIsResponding(false);
          setAgentStatus(null);
        }
      };

      cycleSteps(0);
    } catch (error) {
      console.error(error);
      setAssistantMessage("I'm sorry, I'm having trouble connecting to my brain right now.");
      setAgentStatus(null);
      setTimeout(() => setIsResponding(false), 3000);
    }
  };

  const handleStop = () => {
    setIsResponding(false);
    setActiveStepIndex(-1);
    setAgentSteps([]);
    setIsAgenticMode(false);
    setAgentStatus(null);
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  };

  return (
    <main className="h-screen w-full bg-[#F3F3F3] p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
      <section className="flex-1 w-full relative min-h-0">
        <CinematicViewport
          isResponding={isResponding}
          assistantMessage={assistantMessage}
          agentSteps={agentSteps}
          activeStepIndex={activeStepIndex}
          isAgenticMode={isAgenticMode}
          isBooting={isBooting}
          agentStatus={agentStatus}
          cursorPosition={cursorPosition}
          openApps={openApps}
          onOpenApp={handleOpenApp}
          onCloseApp={handleCloseApp}
        />
      </section>
      <section className="h-20 w-full shrink-0 flex items-center">
        <BottomDock
          onSendMessage={handleSendMessage}
          isResponding={isResponding}
          onStop={handleStop}
          isBooting={isBooting}
          agentStatus={agentStatus}
        />
      </section>
    </main>
  );
};

export default App;