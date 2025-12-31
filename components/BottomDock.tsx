import React from 'react';
import { motion } from 'framer-motion';
import InputBar from './InputBar';
import Avatar from './Avatar';

interface BottomDockProps {
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onStop: () => void;
  isBooting: boolean; // Add isBooting prop
  agentStatus?: "thinking" | "keyboard" | "clicking" | null;
}

const BottomDock: React.FC<BottomDockProps> = ({ onSendMessage, isResponding, onStop, isBooting, agentStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={{
        opacity: isBooting ? 0 : 1,
        y: isBooting ? 40 : 0,
        filter: isBooting ? "blur(10px)" : "blur(0px)"
      }}
      transition={{
        duration: 1,
        delay: isBooting ? 0 : 1.2,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full grid grid-cols-[1fr_auto_1fr] items-center"
    >
      {/* Left Area: Empty */}
      <div className="flex items-center justify-start">
      </div>

      {/* Center Area: Input Bar */}
      <div className="flex items-center justify-center">
        <InputBar
          onSendMessage={onSendMessage}
          isResponding={isResponding}
          onStop={onStop}
          isBooting={isBooting}
          agentStatus={agentStatus}
        />
      </div>

      {/* Right Area: Profile - Right aligned */}
      <div className="flex items-center justify-end pr-6 md:pr-10 lg:pr-12">
        <div
          className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 hover:scale-110 cursor-pointer"
        >
          <Avatar
            src="/assets/profile-image.png"
            alt="Profile"
            className="w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BottomDock;