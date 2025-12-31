import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 44 }) => {
  return (
    <div 
      className="rounded-full overflow-hidden border border-white/50 shadow-sm transition-transform hover:scale-105 duration-300"
      style={{ width: size, height: size }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Avatar;