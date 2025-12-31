import React from 'react';
import CinematicViewport from './components/CinematicViewport';
import BottomDock from './components/BottomDock';

const App: React.FC = () => {
  const [isResponding, setIsResponding] = React.useState(false);
  const [assistantMessage, setAssistantMessage] = React.useState("");

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setIsResponding(true);
    setAssistantMessage(`Let me search the ${message} for you.`);

    // Simulate response ending after 5 seconds
    setTimeout(() => {
      setIsResponding(false);
    }, 5000);
  };

  return (
    <main className="h-screen w-full bg-[#F3F3F3] p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
      {/* Component A: The Cinematic Viewport */}
      <section className="flex-1 w-full relative min-h-0">
        <CinematicViewport isResponding={isResponding} assistantMessage={assistantMessage} />
      </section>

      {/* Component B: The Bottom Dock */}
      <section className="h-20 w-full shrink-0 flex items-center">
        <BottomDock onSendMessage={handleSendMessage} />
      </section>
    </main>
  );
};

export default App;