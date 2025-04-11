
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
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  return (
    <img 
      src="/lovable-uploads/9a333e8e-a34b-4dfe-95fb-d1be3b6d56ca.png" 
      alt="SEC" 
      className={cn(sizeClasses[size], 'inline-block', className)}
    />
  );
};

// This allows using CurrencyIcon as a component property
CurrencyIcon.displayName = 'CurrencyIcon';

export default CurrencyIcon;
