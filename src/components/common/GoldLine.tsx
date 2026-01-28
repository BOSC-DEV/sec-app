import React from 'react';
import { cn } from '@/lib/utils';

interface GoldLineProps {
  className?: string;
}

const GoldLine: React.FC<GoldLineProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "relative h-4 bg-gradient-to-r from-icc-gold-dark via-icc-gold to-icc-gold-dark overflow-hidden",
        className
      )} 
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-gold-shimmer" />
    </div>
  );
};

export default GoldLine;
