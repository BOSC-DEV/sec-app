import React from 'react';
import { cn } from '@/lib/utils';

interface GoldShimmerProps {
  className?: string;
}

const GoldShimmer: React.FC<GoldShimmerProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-gold-shimmer pointer-events-none",
        className
      )} 
    />
  );
};

export default GoldShimmer;
