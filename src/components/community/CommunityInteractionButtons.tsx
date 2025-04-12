
import React from 'react';
import { cn } from '@/lib/utils';
import ReactionButton from './ReactionButton';

interface CommunityInteractionButtonsProps {
  itemId: string;
  itemType: 'announcement' | 'message' | 'reply';
  initialLikes?: number;
  initialDislikes?: number;
  className?: string;
}

const CommunityInteractionButtons = ({ 
  itemId, 
  itemType, 
  initialLikes = 0, 
  initialDislikes = 0,
  className 
}: CommunityInteractionButtonsProps) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <ReactionButton 
        itemId={itemId} 
        itemType={itemType} 
        size="sm" 
        iconOnly={false} 
      />
    </div>
  );
};

export default CommunityInteractionButtons;
