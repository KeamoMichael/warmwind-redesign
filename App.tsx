import React from 'react';
import CinematicViewport from './components/CinematicViewport';
import BottomDock from './components/BottomDock';
import { processUserMessage } from './services/gemini';
import { APP_REGISTRY } from './config/apps';
import { InteractionProvider, useInteraction } from './contexts/InteractionContext';
import VisualInteractionLayer from './components/VisualInteractionLayer';
import { useInputController } from './hooks/useInputController';
import { perceptionService } from './services/PerceptionService';
import { CodespaceVNC } from './components/CodespaceVNC';
import { VMSettings } from './components/VMSettings';

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

  // VNC Integration State
  const [showVMSettings, setShowVMSettings] = React.useState(false);
  const [vncUrl, setVncUrl] = React.useState(
    localStorage.getItem('codespace_vnc_url') || ''
  );

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

  // Sync state with PerceptionService for action verification
  React.useEffect(() => {
    perceptionService.updateState({
      installedApps,
      openApps,
      activeScreen: openApps.length > 0 ? `app:${openApps[0]}` : 'desktop'
    });
  }, [installedApps, openApps]);

  const handleCloseApp = (appName: string) => {
    setOpenApps(prev => prev.filter(app => app !== appName));
  };

  const handleInstallApp = (appName: string) => {
    if (!installedApps.includes(appName)) {
      setInstalledApps(prev => [...prev, appName]);
    }
  };

  const handleUninstallApp = (appName: string) => {
    setInstalledApps(prev => prev.filter(app => app !== appName));
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
      const result = await processUserMessage(message, {
        installedApps,
        supportedApps: Object.keys(APP_REGISTRY)
      });

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
          return;
        }

        // 2. Plan: Locate Dock Icon
        const dockIconId = `dock-icon-${appName}`;

        // PUSH REAL-TIME STEPS
        setAgentSteps(prev => [...prev, `Locating ${appName}...`]);
        // Fix: activeStepIndex is number.
        // If we append, the new index is length-1.
        // Actually, let's just increment activeStepIndex.
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

        await new Promise(r => setTimeout(r, 2000));
      };


      setIsAgenticMode(true);
      // SYNC FIX: Do NOT use Gemini steps. Use Real-Time Execution steps.
      setAgentSteps(["Planning Execution..."]);
      setActiveStepIndex(0);

      if (result.action?.app) {
        const app = result.action.app;
        // Map "Docs" -> "Google Docs" for display/logic if needed, but "Docs" is the ID.
        const displayAppName = app === "Docs" ? "Google Docs" : app === "Sheets" ? "Google Sheets" : app;

        // Installation Check
        if (!installedApps.includes(app) && app !== "Chrome" && app !== "App Store") {
          const msg = `${displayAppName} is not installed. I'll open the App Store to install it.`;
          setAssistantMessage(msg);
          setMessages(prev => [...prev, { role: 'assistant', content: msg }]);

          // Explicit Reasoning Delay
          await new Promise(r => setTimeout(r, 1500));

          // Physical Install
          await openAppPhysically("App Store");

          setAgentStatus(null);
          setIsResponding(false);
          return;
        }

        // === PERCEPTION: Capture state BEFORE action ===
        const stateBefore = perceptionService.captureState();

        switch (app) {
          case "Chrome":
          case "App Store":
          case "VS Code":
          case "Gmail":
          case "Docs":
          case "Sheets": // Added Sheets
          default:
            // UNIVERSAL PHYSICAL HANDLER
            await openAppPhysically(app);

            // CHAINED MISSION: Chrome Search
            if (app === "Chrome" && result.action.query) {
              // 5. Locate Omnibox (Add to steps)
              const query = result.action.query;
              setAgentSteps(prev => [...prev, "Locating Omnibox..."]);
              setActiveStepIndex(prev => prev + 1);
              await new Promise(r => setTimeout(r, 600));

              // 6. Click Omnibox
              setAgentSteps(prev => [...prev, "Clicking Omnibox..."]);
              setActiveStepIndex(prev => prev + 1);
              setAgentStatus("clicking");
              await executeAction({ type: 'click', targetId: 'chrome-omnibox' });

              // 7. Type Query
              setAgentSteps(prev => [...prev, `Typing "${query}"...`]);
              setActiveStepIndex(prev => prev + 1);
              setAgentStatus("keyboard");
              await executeAction({ type: 'type', targetId: 'chrome-omnibox', text: query });

              // 8. Submit (Simulated wait)
              setAgentSteps(prev => [...prev, "Searching..."]);
              setActiveStepIndex(prev => prev + 1);
              setAgentStatus("thinking");
              await new Promise(r => setTimeout(r, 1500));
            }
            break;
        }

        // === PERCEPTION: Capture state AFTER action ===
        // Small delay to let React state update propagate
        await new Promise(r => setTimeout(r, 100));
        const stateAfter = perceptionService.captureState();

        // === VERIFICATION: Compare states ===
        const verification = perceptionService.verifyAction(stateBefore, stateAfter, {
          type: 'open',
          target: app
        });

        // Report ACTUAL result (not assumed success)
        setAgentStatus(null);
        setIsResponding(false);
        setMessages(prev => [...prev, { role: 'assistant', content: verification.message }]);

        // Log for debugging
        console.log('🔍 Perception Verification:', verification);

        return; // Skip cycleSteps for physical actions
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
        {vncUrl ? (
          // VNC Stream Integration
          <CodespaceVNC vncUrl={vncUrl} />
        ) : (
          // Configuration Prompt
          <div className="w-full h-full rounded-[32px] md:rounded-[40px] bg-gradient-to-b from-neutral-50 to-neutral-100 flex flex-col items-center justify-center gap-6 shadow-sm">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                Connect to Your Codespace
              </h2>
              <p className="text-neutral-500 text-sm">
                Configure your GitHub Codespace VNC URL to get started
              </p>
            </div>

            <button
              onClick={() => setShowVMSettings(true)}
              className="bg-[#4db7ae] hover:bg-[#3da89f] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure VNC Settings
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <p className="text-xs text-blue-800">
                <strong>Quick Start:</strong>
                <br />
                1. Create a GitHub Codespace from this repo
                <br />
                2. Run ./start-vnc.sh in the terminal
                <br />
                3. Copy the URL from port 6080
                <br />
                4. Click the button above to configure
              </p>
            </div>
          </div>
        )}
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

      {/* VM Settings Modal */}
      {showVMSettings && (
        <VMSettings
          onClose={() => {
            setShowVMSettings(false);
            setVncUrl(localStorage.getItem('codespace_vnc_url') || '');
          }}
        />
      )}
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