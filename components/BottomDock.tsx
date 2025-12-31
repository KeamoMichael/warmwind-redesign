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
    <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center">
      {/* Left Area: Empty */}
      <div className="flex items-center justify-start">
      </div>

      {/* Center Area: Input Bar */}
      <div className="flex items-center justify-center">
        <InputBar
          onSendMessage={onSendMessage}
          isResponding={isResponding}
          onStop={onStop}
        />
      </div>

      {/* Right Area: Profile - Right aligned with a responsive left offset */}
      <div className="flex items-center justify-end pr-6 md:pr-10 lg:pr-12">
        <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 hover:scale-110 cursor-pointer">
          <Avatar
            src="/assets/profile-image.png"
            alt="Profile"
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomDock;