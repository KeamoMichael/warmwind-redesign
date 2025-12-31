import React from 'react';
import InputBar from './InputBar';
import Avatar from './Avatar';

const BottomDock: React.FC = () => {
  return (
    <div className="w-full max-w-[1800px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      {/* Left Area: Empty as requested */}
      <div className="flex items-center justify-start pl-2">
      </div>

      {/* Center Area: Input Bar */}
      <div className="flex items-center justify-center w-full">
        <InputBar />
      </div>

      {/* Right Area: Profile */}
      <div className="flex items-center justify-end pr-2">
        <Avatar 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" 
          alt="Profile" 
        />
      </div>
    </div>
  );
};

export default BottomDock;