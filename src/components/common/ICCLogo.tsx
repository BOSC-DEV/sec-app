
import React from 'react';

interface ICCLogoProps {
  className?: string;
}

const ICCLogo: React.FC<ICCLogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className="h-full w-full"
      >
        <circle cx="50" cy="50" r="45" fill="#13294B" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#C8B06B" strokeWidth="2" />
        <g fill="#C8B06B">
          <path d="M30 35h40v5H30z" />
          <path d="M30 35h5v30h-5z" />
          <path d="M65 35h5v30h-5z" />
          <path d="M30 60h40v5H30z" />
          <path d="M45 40h10v20H45z" />
        </g>
        <circle cx="50" cy="50" r="35" fill="none" stroke="#C8B06B" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    </div>
  );
};

export default ICCLogo;
