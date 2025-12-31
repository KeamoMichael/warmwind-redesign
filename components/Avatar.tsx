import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, className = "" }) => {
  return (
    <div
      className={`relative aspect-square rounded-full overflow-hidden border border-white/50 shadow-sm transition-transform duration-300 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default Avatar;