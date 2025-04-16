
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';

// Define the missing interface for ScammerActionButton props
interface ScammerActionButtonProps {
  icon: React.ReactNode;
  count: number;
  onClick: () => void;
  isActive?: boolean;
  label: string;
}

// Update the ScammerActionButton to have a gold color in dark mode
export const ScammerActionButton: React.FC<ScammerActionButtonProps> = ({
  icon,
  count,
  onClick,
  isActive = false,
  label,
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={`flex items-center gap-1 
      ${isActive 
        ? 'text-primary' 
        : 'text-muted-foreground dark:text-icc-gold'
      }`}
    onClick={onClick}
    title={label}
  >
    {icon}
    <span>{formatNumber(count)}</span>
  </Button>
);
