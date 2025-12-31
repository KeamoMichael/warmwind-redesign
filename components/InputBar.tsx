import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onStop: () => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isResponding, onStop }) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleSend = () => {
    if (inputValue.trim() && !isResponding) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Dot animation variants
  const dotVariants = {
    initial: { y: 0 },
    animate: (i: number) => ({
      y: [0, -4, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: i * 0.1,
        ease: "easeInOut"
      }
    })
  };

  return (
    <motion.div
      className="relative flex items-center w-[380px] h-[60px] bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] pl-6 pr-2"
    >
      <div className="flex-1 flex items-center h-full relative">
        {isResponding ? (
          <div className="flex items-center text-neutral-400 font-light text-[15px] select-none">
            Thinking
            <div className="flex ml-1 gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={dotVariants}
                  initial="initial"
                  animate="animate"
                >
                  .
                </motion.span>
              ))}
            </div>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Ask something"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-neutral-600 placeholder-neutral-400 font-light text-[15px] h-full"
          />
        )}
      </div>

      <motion.button
        className="flex items-center justify-center w-10 h-10 shrink-0 ml-2 overflow-hidden"
        whileTap={{ scale: 0.95 }}
        onClick={isResponding ? onStop : handleSend}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <img
          src={isResponding ? "/assets/Stop Button.png" : "/assets/Send Button.png"}
          alt={isResponding ? "Stop" : "Send"}
          className="w-full h-full object-contain"
        />
      </motion.button>
    </motion.div>
  );
};

export default InputBar;