import React from 'react';
import CinematicViewport from './components/CinematicViewport';
import BottomDock from './components/BottomDock';
import { processUserMessage } from './services/gemini';
import { InteractionProvider, useInteraction } from './contexts/InteractionContext';
import VisualInteractionLayer from './components/VisualInteractionLayer';
import { useInputController } from './hooks/useInputController';

const AppContent: React.FC = () => {
  const [isResponding, setIsResponding] = React.useState(false);
  const [assistantMessage, setAssistantMessage] = React.useState("");
  const [agentSteps, setAgentSteps] = React.useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = React.useState(-1);
  const [isAgenticMode, setIsAgenticMode] = React.useState(false);
  const [isBooting, setIsBooting] = React.useState(true);
  const [agentStatus, setAgentStatus] = React.useState<"thinking" | "keyboard" | "clicking" | null>(null);
  const [openApps, setOpenApps] = React.useState<string[]>([]);
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [showConversationWidget, setShowConversationWidget] = React.useState(false);
  const [installedApps, setInstalledApps] = React.useState<string[]>(["Chrome", "App Store"]);
  const responseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Hook enabled now that we are inside the Provider
  const { executeAction } = useInputController();
  const { updateCursor } = useInteraction();

  React.useEffect(() => {
    // OS Boot Sequence
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
      const morphTimer = setTimeout(() => {
        setIsAgenticMode(true);
        updateCursor({ isVisible: true });
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
    }
  };

  const handleOpenApp = (appName: string) => {
    const name = appName === "Docs" ? "Google Docs" : appName;

    // Check installation (except Key System Apps)
    if (!installedApps.includes(name) && name !== "App Store" && name !== "Chrome") {
      setAssistantMessage(`You need to install ${name} from the App Store first.`);
      setMessages(prev => [...prev, { role: 'assistant', content: `You need to install ${name} from the App Store first.` }]);
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

    setMessages(prev => [...prev, { role: 'user', content: message }]);

    // DEMO TRIGGER: "Simulate Search"
    if (message.toLowerCase().includes("simulate search")) {
      setIsResponding(true);
      setIsAgenticMode(true); // Ensure Dock is visible/registered
      setShowConversationWidget(true);
      setAgentStatus("thinking");
      setAssistantMessage("Initiating Visual Search Demo...");

      // Define the Cognitive Plan
      const plan = [
        "Locating Chrome Icon...",
        "Moving Cursor to Dock...",
        "Clicking Chrome...",
        "Waiting for Window...",
        "Locating Omnibox...",
        "Typing Query..."
      ];
      setAgentSteps(plan);

      // Reset state for demo authenticity
      if (openApps.includes("Chrome")) {
        handleCloseApp("Chrome");
      }

      // Execution Loop
      setTimeout(async () => {
        // Step 0: Locate Dock (Implicit) & Move
        setActiveStepIndex(0);
        await new Promise(r => setTimeout(r, 800));

        setActiveStepIndex(1);
        setAgentStatus("clicking");
        // Physical Action: Click Dock Icon
        await executeAction({ type: 'click', targetId: 'dock-icon-Chrome' });

        setActiveStepIndex(2);
        await new Promise(r => setTimeout(r, 500));

        setActiveStepIndex(3);
        setAgentStatus("thinking");
        // Wait for Window Animation
        await new Promise(r => setTimeout(r, 2000));

        // Step 4: Locate Omnibox
        setActiveStepIndex(4);
        setAgentStatus("clicking");
        // Physical Action: Click Omnibox (now registered)
        await executeAction({ type: 'click', targetId: 'chrome-omnibox' });

        // Step 5: Type
        setActiveStepIndex(5);
        setAgentStatus("keyboard");
        await executeAction({ type: 'type', targetId: 'chrome-omnibox', text: "Price of apple s" });

        // Finish
        setAgentStatus(null);
        setIsResponding(false);
        setMessages(prev => [...prev, { role: 'assistant', content: "✅ Physical Visual Search Completed" }]);
      }, 1000);
      return;
    }

    setIsResponding(true);
    setShowConversationWidget(true);
    setAgentStatus("thinking");
    setAssistantMessage("Processing request...");
    setActiveStepIndex(-1);

    try {
      const result = await processUserMessage(message);

      setAssistantMessage(result.message);
      setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);

      if (result.intent === "conversational") {
        setIsResponding(false);
        setAgentStatus(null);
        return;
      }

      // Dynamic Physical Execution Engine
      const openAppPhysically = async (appName: string) => {
        setIsAgenticMode(true);

        // 1. Perception: Check if already open
        if (openApps.includes(appName)) {
          // Maybe focus it? For now just return
          return;
        }

        // 2. Plan: Locate Dock Icon
        const dockIconId = `dock-icon-${appName}`;

        // update UI to show thinking
        setAgentSteps(prev => [...prev, `Locating ${appName}...`]);
        setActiveStepIndex(prev => prev + 1);
        await new Promise(r => setTimeout(r, 600));

        // 3. Act: Move & Click
        setAgentSteps(prev => [...prev, "Moving to Dock..."]);
        setActiveStepIndex(prev => prev + 1);
        setAgentStatus("clicking");

        await executeAction({ type: 'click', targetId: dockIconId });

        // 4. Wait for UI
        setAgentSteps(prev => [...prev, `Opening ${appName}...`]);
        setActiveStepIndex(prev => prev + 1);
        setAgentStatus("thinking");

        // Logic for React state update happens via the component's onClick
        // We wait for the animation
        await new Promise(r => setTimeout(r, 2000));
      };

      setIsAgenticMode(true);
      if (result.steps) setAgentSteps(result.steps);
      else setAgentSteps(["Processing Intent..."]); // Default step if none provided

      if (result.action?.app) {
        const app = result.action.app;

        if (!installedApps.includes(app) && app !== "Chrome" && app !== "App Store") {
          setAssistantMessage(`I need to install ${app} to do that.`);
          setMessages(prev => [...prev, { role: 'assistant', content: `I need to install ${app} to do that.` }]);

          // Physical Install? For now, physical open store
          await openAppPhysically("App Store");
          setAgentStatus(null);
          setIsResponding(false);
          return;
        }

        switch (app) {
          case "Chrome":
          case "App Store":
          case "VS Code":
          case "Gmail":
          case "Docs":
          default:
            // UNIVERSAL PHYSICAL HANDLER
            await openAppPhysically(app);
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
              // Execute Interaction Action
              executeAction({
                type: 'click',
                position: {
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
                }
              });
            }

            cycleSteps(index + 1);
          }, 2000);
        } else {
          // Record steps in history
          if (result.steps && result.steps.length > 0) {
            const stepsSummary = `✅ Task Completed:\n${result.steps.map(s => `• ${s}`).join('\n')}`;
            setMessages(prev => [...prev, { role: 'assistant', content: stepsSummary }]);
          }
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
          openApps={openApps}
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

const App: React.FC = () => {
  return (
    <InteractionProvider>
      <AppContent />
      <VisualInteractionLayer />
    </InteractionProvider>
  );
};

export default App;