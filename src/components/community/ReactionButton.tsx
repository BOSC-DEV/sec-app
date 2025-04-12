
import React, { useState, useEffect } from 'react';
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

const ReactionButton: React.FC<ReactionButtonProps> = ({ 
  itemId, 
  itemType,
  size = 'sm' 
}) => {
  const { profile } = useProfile();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
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
    
    reactions.forEach(reaction => {
      if ('reaction_type' in reaction) {
        const type = reaction.reaction_type;
        counts[type] = (counts[type] || 0) + 1;
      }
    });
    
    return counts;
  };
  
  // Check if user has already reacted with a specific emoji
  const hasUserReacted = (emoji: string) => {
    return reactions.some(
      r => 'user_id' in r && 'reaction_type' in r && r.user_id === profile?.wallet_address && r.reaction_type === emoji
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
              className="px-2 py-1 h-auto gap-1"
              onClick={() => handleEmojiSelect(emoji)}
            >
              <span>{emoji}</span>
              <span className="text-xs">{count}</span>
            </Button>
          ))
        ) : null}
        
        <Button
          variant="outline"
          size={size}
          className="px-2 py-1 h-auto"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      </div>
      
      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full mb-2 z-10">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
