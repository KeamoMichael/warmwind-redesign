import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputBarProps {
  onSendMessage: (message: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage }) => {
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
      className="relative flex items-center w-[380px] h-[60px] bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] pl-6 pr-2"
    >
      <input
        type="text"
        placeholder="Ask something"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-neutral-600 placeholder-neutral-400 font-light text-[15px] h-full w-full"
      />

      <motion.button
        className="flex items-center justify-center w-10 h-10 shrink-0 ml-2 overflow-hidden"
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <img
          src="/assets/Send Button.png"
          alt="Send"
          className="w-full h-full object-contain"
        />
      </motion.button>
    </motion.div>
  );
};

export default InputBar;