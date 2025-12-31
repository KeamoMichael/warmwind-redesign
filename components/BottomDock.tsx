import React from 'react';
import InputBar from './InputBar';
import Avatar from './Avatar';

interface BottomDockProps {
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onStop: () => void;
}

const BottomDock: React.FC<BottomDockProps> = ({ onSendMessage, isResponding, onStop }) => {
  return (
    <div className="w-full max-w-[1800px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      {/* Left Area: Empty as requested */}
      <div className="flex items-center justify-start pl-2">
      </div>

      {/* Center Area: Input Bar */}
      <div className="flex items-center justify-center w-full">
        <InputBar
          onSendMessage={onSendMessage}
          isResponding={isResponding}
          onStop={onStop}
        />
      </div>

      {/* Right Area: Profile */}
      <div className="flex items-center justify-end pr-2">
        <Avatar
          src="/assets/profile-image.png"
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default BottomDock;