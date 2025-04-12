
import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import { 
  toggleAnnouncementReaction, 
  toggleChatMessageReaction, 
  toggleReplyReaction 
} from '@/services/communityService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EntityType } from '@/types/dataTypes';

type ReactionButtonProps = {
  itemId: string;
  itemType: 'announcement' | 'message' | 'reply';
  size?: 'sm' | 'default';
};

// Define reaction type for type safety
interface Reaction {
  id: string;
  user_id: string;
  reaction_type: string;
  [key: string]: any; // For other properties that might exist
}

const ReactionButton: React.FC<ReactionButtonProps> = ({ 
  itemId, 
  itemType,
  size = 'sm' 
}) => {
  const { profile } = useProfile();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);
  
  // Get the appropriate table name based on item type
  const getTableName = (): string => {
    switch (itemType) {
      case 'announcement':
        return 'announcement_reactions';
      case 'message':
        return 'chat_message_reactions';
      case 'reply':
        return 'reply_reactions';
      default:
        return 'announcement_reactions'; // Default to prevent empty string
    }
  };
  
  // Get the appropriate ID field name based on item type
  const getIdFieldName = (): string => {
    switch (itemType) {
      case 'announcement':
        return 'announcement_id';
      case 'message':
        return 'message_id';
      case 'reply':
        return 'reply_id';
      default:
        return 'announcement_id'; // Default to prevent empty string
    }
  };

  // Map the item type to EntityType
  const getEntityType = (): EntityType => {
    switch (itemType) {
      case 'announcement':
        return EntityType.ANNOUNCEMENT;
      case 'message':
        return EntityType.CHAT_MESSAGE;
      case 'reply':
        return EntityType.REPLY;
      default:
        return EntityType.ANNOUNCEMENT;
    }
  };
  
  // Query to get all reactions for this item
  const { data: reactions = [], refetch } = useQuery({
    queryKey: [`${itemType}-reactions`, itemId],
    queryFn: async () => {
      const tableName = getTableName();
      const idField = getIdFieldName();
      
      // Use the explicit table name to avoid type errors
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq(idField, itemId);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    enabled: !!itemId && !!profile?.wallet_address,
  });
  
  // Check if user has already reacted with a specific emoji
  const hasUserReacted = (emoji: string) => {
    return (reactions as unknown as Reaction[]).some(
      r => r.user_id === profile?.wallet_address && r.reaction_type === emoji
    );
  };
  
  // Handle selecting an emoji
  const handleEmojiSelect = async (emoji: string) => {
    if (!profile?.wallet_address) return;
    
    let success = false;
    
    switch (itemType) {
      case 'announcement':
        success = await toggleAnnouncementReaction(
          itemId, 
          profile.wallet_address, 
          emoji,
          profile.display_name,
          profile.username,
          profile.profile_pic_url
        );
        break;
      case 'message':
        success = await toggleChatMessageReaction(
          itemId, 
          profile.wallet_address, 
          emoji,
          profile.display_name,
          profile.username,
          profile.profile_pic_url
        );
        break;
      case 'reply':
        success = await toggleReplyReaction(
          itemId, 
          profile.wallet_address, 
          emoji,
          profile.display_name,
          profile.username,
          profile.profile_pic_url
        );
        break;
    }
    
    if (success) {
      refetch();
    }
    
    setShowEmojiPicker(false);
  };
  
  // Get reaction counts
  const getReactionCounts = () => {
    const counts: Record<string, number> = {};
    
    // First convert to unknown and then to our Reaction type for safety
    (reactions as unknown as Reaction[]).forEach(reaction => {
      const type = reaction.reaction_type;
      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }
    });
    
    return counts;
  };
  
  // Get reaction counts
  const reactionCounts = getReactionCounts();
  
  // Sort reactions by count (descending) and limit to 6
  const sortedReactions = Object.entries(reactionCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 6); // Show top 6 reactions
  
  // Function to determine the optimal positioning for the emoji picker
  const getEmojiPickerPosition = () => {
    if (!containerRef.current) return {};
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const pickerWidth = 288; // Width of the emoji picker (72px * 4 columns)
    
    // Check if emoji picker would overflow on the right
    const rightOverflow = containerRect.left + pickerWidth > viewportWidth;
    // Check if emoji picker would overflow on the left
    const leftOverflow = containerRect.left - pickerWidth/2 < 0;
    
    // Calculate left position to keep picker fully visible
    if (leftOverflow) {
      return { left: 0, transform: 'none' };
    } else if (rightOverflow) {
      return { right: 0, left: 'auto', transform: 'none' };
    } else {
      return { left: '50%', transform: 'translateX(-50%)' };
    }
  };
  
  return (
    <div className="relative" ref={containerRef}
         onMouseEnter={() => setShowReactionBar(true)}
         onMouseLeave={() => setShowReactionBar(false)}>
      <div className="flex items-center">
        {showReactionBar && sortedReactions.length > 0 && (
          <div className="absolute right-full mr-2 flex items-center bg-background border rounded-full shadow-sm px-1.5 py-0.5">
            {sortedReactions.map(([emoji, count]) => (
              <button
                key={emoji}
                className={`px-1 mx-0.5 text-sm hover:bg-accent/20 rounded-full ${hasUserReacted(emoji) ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                onClick={() => handleEmojiSelect(emoji)}
              >
                <span>{emoji}</span>
                <span className="ml-0.5 text-xs">{count}</span>
              </button>
            ))}
          </div>
        )}
        
        <Button
          ref={buttonRef}
          variant="outline"
          size={size}
          className="px-2 py-1 h-auto bg-background shadow-sm"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      </div>
      
      {showEmojiPicker && (
        <div 
          ref={pickerRef} 
          className="absolute bottom-full mb-2 z-10"
          style={getEmojiPickerPosition()}
        >
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
