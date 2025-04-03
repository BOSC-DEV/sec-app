
import React from 'react';

interface ICCLogoProps {
  className?: string;
}

const ICCLogo: React.FC<ICCLogoProps> = ({ className = "h-14 w-14" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/lovable-uploads/93335d93-ed13-47e0-9fe5-14761afa9bd3.png" 
        alt="SEC Logo" 
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default ICCLogo;
