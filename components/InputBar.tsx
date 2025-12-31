import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const InputBar: React.FC = () => {
  return (
    <motion.div
      className="relative flex items-center w-[380px] h-[60px] bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] pl-6 pr-2"
    >
      <input
        type="text"
        placeholder="Ask something"
        className="flex-1 bg-transparent border-none outline-none text-neutral-600 placeholder-neutral-400 font-light text-[15px] h-full w-full"
      />

      <motion.button
        className="flex items-center justify-center w-10 h-10 bg-[#5DC8B5] rounded-full shrink-0 ml-2"
        whileTap={{ scale: 0.9, rotate: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Play
          className="w-3.5 h-3.5 text-white fill-current ml-0.5"
          strokeWidth={0}
        />
      </motion.button>
    </motion.div>
  );
};

export default InputBar;