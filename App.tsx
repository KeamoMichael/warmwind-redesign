import React from 'react';
import CinematicViewport from './components/CinematicViewport';
import BottomDock from './components/BottomDock';

const App: React.FC = () => {
  const [isResponding, setIsResponding] = React.useState(false);
  const [assistantMessage, setAssistantMessage] = React.useState("");
  const [agentSteps, setAgentSteps] = React.useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = React.useState(-1);
  const [isAgenticMode, setIsAgenticMode] = React.useState(false);
  const [isBooting, setIsBooting] = React.useState(true);
  const responseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // OS Boot Sequence
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 4500); // Allow time for character-by-character reveal + display + hide
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setIsResponding(true);
    setAssistantMessage(`Let me search the ${message} for you.`);
    setAgentSteps(["Open Browser", `Search ${message}`, "Read Results", "Synthesize Data"]);
    setActiveStepIndex(-1); // -1 means initial message state
    setIsAgenticMode(true); // Switch top island to plus mode

    if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);

    // Initial message shows for 2 seconds
    responseTimeoutRef.current = setTimeout(() => {
      setActiveStepIndex(0);

      // Cycle through steps every 1.5 seconds
      const cycleSteps = (index: number) => {
        if (index < 4) {
          responseTimeoutRef.current = setTimeout(() => {
            setActiveStepIndex(index + 1);
            cycleSteps(index + 1);
          }, 1500);
        } else {
          setIsResponding(false);
        }
      };

      cycleSteps(0);
    }, 2000);
  };

  const handleStop = () => {
    setIsResponding(false);
    setActiveStepIndex(-1);
    setAgentSteps([]);
    setIsAgenticMode(false);
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  };

  return (
    <main className="h-screen w-full bg-[#F3F3F3] p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
      {/* Component A: The Cinematic Viewport */}
      <section className="flex-1 w-full relative min-h-0">
        <CinematicViewport
          isResponding={isResponding}
          assistantMessage={assistantMessage}
          agentSteps={agentSteps}
          activeStepIndex={activeStepIndex}
          isAgenticMode={isAgenticMode}
          isBooting={isBooting}
        />
      </section>

      {/* Component B: The Bottom Dock */}
      <section className="h-20 w-full shrink-0 flex items-center">
        <BottomDock
          onSendMessage={handleSendMessage}
          isResponding={isResponding}
          onStop={handleStop}
          isBooting={isBooting}
        />
      </section>
    </main>
  );
};

export default App;