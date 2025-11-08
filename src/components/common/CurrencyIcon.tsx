
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

interface CurrencyIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({ 
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4.5 w-4.5',
    lg: 'h-7 w-7'
  };

  return (
    <img 
      src="/lovable-uploads/9a333e8e-a34b-4dfe-95fb-d1be3b6d56ca.png" 
      alt="SEC" 
      className={cn(sizeClasses[size], 'inline-block align-middle', className)}
    />
  );
};

// This allows using CurrencyIcon as a component property
CurrencyIcon.displayName = 'CurrencyIcon';

export default CurrencyIcon;
