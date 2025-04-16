
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BadgeInfo, BadgeTier as BadgeTierEnum, formatSecAmount, MIN_SEC_FOR_BADGE } from '@/utils/badgeUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface BadgeTierProps {
  badgeInfo: BadgeInfo | null;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  variant?: 'default' | 'tier' | 'plain';
  context?: 'chat' | 'profile';
}

const BadgeTier: React.FC<BadgeTierProps> = ({
  badgeInfo,
  showProgress = false,
  size = 'md',
  showTooltip = true,
  variant = 'default',
  context = 'profile'
}) => {
  const isMobile = useIsMobile();
  
  // If no badge info, user doesn't have enough SEC
  if (!badgeInfo) {
    // If we don't want to show anything when no badge, return null
    if (context === 'chat') return null;
    
    // For profile context, show "No Badge" indicator
    return (
      <div className="inline-block">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground text-xs">No Badge</span>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="p-4 max-w-sm">
              <div className="space-y-3">
                <div className="font-semibold text-center">No Badge</div>
                <div className="text-sm text-muted-foreground">
                  Minimum {formatSecAmount(MIN_SEC_FOR_BADGE)} SEC required for a badge
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  
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
  
  const badge = (
    <span 
      className={`
        ${context === 'chat' ? 'relative -top-2 -ml-0' : (variant === 'plain' ? '' : color)} 
        ${sizeClasses[size]} 
        ${context === 'chat' ? '' : (variant === 'default' || variant === 'tier' ? 'rounded-full border px-2.5 py-0.5' : '')}
        inline-flex items-center shrink-0
      `}
    >
      {icon}
    </span>
  );
  
  const progressBar = nextTier && (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>{tier}</span>
        <span>{nextTier.name}</span>
      </div>
      
      <Progress value={100 - nextTier.remaining / (nextTier.minHolding - badgeInfo.minHolding) * 100} className="h-2" />
      
      <div className="text-xs text-right text-muted-foreground">
        Need {formatSecAmount(nextTier.remaining)} more SEC
      </div>
    </div>
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
                <span className="truncate">{tier}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Requires {formatSecAmount(badgeInfo.minHolding)} SEC tokens
                {badgeInfo.percentOfSupply > 0 && <span> ({badgeInfo.percentOfSupply}% of total supply)</span>}
              </div>
              
              {showProgress && !isMobile && progressBar}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {showProgress && isMobile && <div className="mt-2">{progressBar}</div>}
    </div>
  );
};

export default BadgeTier;
