
import React from 'react';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrencyIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({ 
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  return (
    <Coins 
      className={cn(sizeClasses[size], 'inline-block', className)}
    />
  );
};

// This allows using CurrencyIcon as a component property
CurrencyIcon.displayName = 'CurrencyIcon';

export default CurrencyIcon;
