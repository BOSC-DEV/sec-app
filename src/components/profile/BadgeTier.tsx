
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BadgeInfo, BadgeTier as BadgeTierEnum, formatSecAmount } from '@/utils/badgeUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface BadgeTierProps {
  badgeInfo: BadgeInfo;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  variant?: 'default' | 'tier' | 'plain';
}

const BadgeTier: React.FC<BadgeTierProps> = ({
  badgeInfo,
  showProgress = false,
  size = 'md',
  showTooltip = true,
  variant = 'default'
}) => {
  const isMobile = useIsMobile();
  const {
    tier,
    icon,
    color,
    nextTier
  } = badgeInfo;
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // Create the badge element - showing only the icon, removing the border and background
  const badge = (
    <span 
      className={`
        ${variant === 'plain' ? '' : color} 
        ${sizeClasses[size]} 
        inline-flex items-center shrink-0
        -mt-1
      `}
    >
      {icon}
    </span>
  );
  
  if (!showTooltip) {
    return badge;
  }
  
  return (
    <div className="inline-block">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent side="right" align="start" className="p-4 max-w-sm">
            <div className="space-y-3">
              <div className="font-semibold text-center flex items-center justify-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="truncate">{tier} Badge</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Requires minimum {formatSecAmount(badgeInfo.minHolding)} SEC tokens
                {badgeInfo.percentOfSupply > 0 && <span> ({badgeInfo.percentOfSupply}% of total supply)</span>}
              </div>
              
              {showProgress && nextTier && <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>{tier}</span>
                    <span>{nextTier.name}</span>
                  </div>
                  
                  <Progress value={100 - nextTier.remaining / (nextTier.minHolding - badgeInfo.minHolding) * 100} className="h-2" />
                  
                  <div className="text-xs text-right text-muted-foreground">
                    Need {formatSecAmount(nextTier.remaining)} more SEC
                  </div>
                </div>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default BadgeTier;
