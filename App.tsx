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
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [showConversationWidget, setShowConversationWidget] = React.useState(false);
  const [installedApps, setInstalledApps] = React.useState<string[]>(["Chrome", "App Store"]);
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

  const handleInstallApp = (appName: string) => {
    if (!installedApps.includes(appName)) {
      setInstalledApps(prev => [...prev, appName]);
      // Optional: Auto-open after install?
      // handleOpenApp(appName); 
    }
  };

  const handleOpenApp = (appName: string) => {
    const name = appName === "Docs" ? "Google Docs" : appName;

    // Check installation (except Key System Apps)
    if (!installedApps.includes(name) && name !== "App Store" && name !== "Chrome") {
      // Not installed? Open App Store
      setAssistantMessage(`You need to install ${name} from the App Store first.`);
      setMessages(prev => [...prev, { role: 'assistant', content: `You need to install ${name} from the App Store first.` }]);

      // Open App Store if not open
      if (!openApps.includes("App Store")) {
        setOpenApps(prev => ["App Store", ...prev]);
      }
      return;
    }

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

    // Add user message to history
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    setIsResponding(true);
    setShowConversationWidget(true); // Persist widget
    setAgentStatus("thinking");
    setAssistantMessage("Processing request...");
    setActiveStepIndex(-1);

    try {
      const result = await processUserMessage(message);

      setAssistantMessage(result.message);
      // Add assistant response to history
      setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);

      if (result.intent === "conversational") {
        setIsResponding(false); // Stop "thinking" animation, but keep widget open
        setAgentStatus(null);
        return;
      }

      // Agentic Flow
      setIsAgenticMode(true);
      if (result.steps) setAgentSteps(result.steps);

      // If agentic, we keep "isResponding" true while steps execute
      if (result.action?.app) {
        const app = result.action.app;

        // Installation Check for External Apps
        if (!installedApps.includes(app) && app !== "Chrome" && app !== "App Store") {
          setAssistantMessage(`I need to install ${app} to do that.`);
          setMessages(prev => [...prev, { role: 'assistant', content: `I need to install ${app} to do that.` }]);
          handleOpenApp("App Store");
          // Don't execute the external launch below
          setAgentStatus(null);
          setIsResponding(false);
          return;
        }

        switch (app) {
          case "VS Code":
            // Launch VS Code locally if installed
            window.open('vscode://', '_blank');
            break;
          case "Gmail":
            window.open('https://mail.google.com', '_blank');
            break;
          case "Docs":
            window.open('https://docs.new', '_blank');
            break;
          case "Chrome":
          case "App Store":
          default:
            // Internal Apps
            handleOpenApp(app);
            break;
        }
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
      const errorMsg = "I'm sorry, I'm having trouble connecting to my brain right now.";
      setAssistantMessage(errorMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      setAgentStatus(null);
      setIsResponding(false);
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
          // New Props
          installedApps={installedApps}
          onOpenApp={handleOpenApp}
          onCloseApp={handleCloseApp}
          onInstallApp={handleInstallApp}
          showConversationWidget={showConversationWidget}
          messages={messages}
          onSendMessage={handleSendMessage}
          onCloseConversationWidget={() => setShowConversationWidget(false)}
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