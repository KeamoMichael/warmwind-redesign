import React from 'react';
import { motion } from 'framer-motion';
import InputBar from './InputBar';
import Avatar from './Avatar';

interface BottomDockProps {
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onStop: () => void;
  isBooting: boolean; // Add isBooting prop
}

const BottomDock: React.FC<BottomDockProps> = ({ onSendMessage, isResponding, onStop, isBooting }) => {
  return (
    <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center">
      {/* Left Area: Empty */}
      <div className="flex items-center justify-start">
      </div>

      {/* Center Area: Input Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: isBooting ? 0 : 1,
          scale: isBooting ? 0 : 1,
          y: isBooting ? 20 : 0
        }}
        transition={{
          duration: 0.8,
          delay: isBooting ? 0 : 1.2,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="flex items-center justify-center"
      >
        <InputBar
          onSendMessage={onSendMessage}
          isResponding={isResponding}
          onStop={onStop}
          isBooting={isBooting}
        />
      </motion.div>

      {/* Right Area: Profile - Right aligned with a responsive left offset */}
      <div className="flex items-center justify-end pr-6 md:pr-10 lg:pr-12">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isBooting ? 0 : 1,
            scale: isBooting ? 0 : 1
          }}
          transition={{
            duration: 0.6,
            delay: isBooting ? 0 : 1.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-all duration-300 hover:scale-110 cursor-pointer"
        >
          <Avatar
            src="/assets/profile-image.png"
            alt="Profile"
            className="w-full h-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BottomDock;