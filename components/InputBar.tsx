import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onStop: () => void;
  isBooting: boolean;
  agentStatus?: "thinking" | "keyboard" | "clicking" | null;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isResponding, onStop, isBooting, agentStatus }) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <motion.div
      className="relative flex items-center h-[60px] bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] pl-6 pr-2 overflow-hidden w-[380px]"
    >
      <div className="flex-1 flex items-center h-full relative">
        <input
          type="text"
          placeholder="Ask something"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-neutral-600 placeholder-neutral-400 font-light text-[15px] h-full"
        />
      </div>

      <motion.button
        className={`flex items-center justify-center w-10 h-10 shrink-0 ml-2 overflow-hidden transition-opacity duration-200 ${isBooting ? 'opacity-30 pointer-events-none' :
            (inputValue.trim() || isResponding) ? 'opacity-100' : 'opacity-50'
          }`}
        whileTap={!isBooting ? { scale: 0.95 } : {}}
        onClick={() => {
          if (isBooting) return;
          if (inputValue.trim()) {
            handleSend();
          } else if (isResponding) {
            onStop();
          }
        }}
        disabled={isBooting}
      >
        <img
          src={inputValue.trim() ? "/assets/Send Button.png" : (isResponding ? "/assets/Stop Button.png" : "/assets/Send Button.png")}
          alt={inputValue.trim() ? "Send" : (isResponding ? "Stop" : "Send")}
          className="w-full h-full object-contain"
        />
      </motion.button>
    </motion.div>
  );
};

export default InputBar;