import React from 'react';
import { motion } from 'framer-motion';

const CinematicViewport: React.FC = () => {
  return (
    <div className="w-full h-full relative rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm">
      {/* Background Image - Updated to the pink/purple lake landscape as requested */}
      <img 
        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2940&auto=format&fit=crop" 
        alt="Mountain Landscape with Pink Sky"
        className="w-full h-full object-cover"
      />
      
      {/* Overlay gradient for better text readability if needed, kept very subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />

      {/* Top Badge - Wrapped in a flex container to guarantee centering regardless of transforms */}
      <div className="absolute top-8 left-0 w-full flex justify-center pointer-events-none z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <div className="bg-white/90 backdrop-blur-md px-12 py-4 rounded-[20px] shadow-sm border border-white/20 flex items-center justify-center">
            <span className="text-[#4A4A4A] text-[15px] font-medium tracking-wide">
              warmwind
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CinematicViewport;