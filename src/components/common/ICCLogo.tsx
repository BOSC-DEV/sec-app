
import React from 'react';

interface ICCLogoProps {
  className?: string;
  size?: number;
}

const ICCLogo: React.FC<ICCLogoProps> = ({ className = "", size = 80 }) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img 
        src="/lovable-uploads/93335d93-ed13-47e0-9fe5-14761afa9bd3.png" 
        alt="SEC Logo" 
        className="h-full w-full object-contain"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default ICCLogo;
