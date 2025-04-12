
import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, Star, Smile } from 'lucide-react';
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
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
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
  
  // Get counts of each reaction type
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
  const reactionCounts = getReactionCounts();
  
  // Sort reactions by count (descending)
  const sortedReactions = Object.entries(reactionCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3); // Show top 3 reactions
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {sortedReactions.length > 0 ? (
          sortedReactions.map(([emoji, count]) => (
            <Button
              key={emoji}
              variant={hasUserReacted(emoji) ? "secondary" : "outline"}
              size={size}
              className={`px-2 py-1 h-auto border shadow-sm ${hasUserReacted(emoji) ? 'bg-accent/50' : 'bg-background hover:bg-accent/30'}`}
              onClick={() => handleEmojiSelect(emoji)}
            >
              <span>{emoji}</span>
              <span className="ml-1 text-xs font-medium">{count}</span>
            </Button>
          ))
        ) : null}
        
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
        <div ref={pickerRef} className="absolute right-0 bottom-full mb-2 z-10">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
