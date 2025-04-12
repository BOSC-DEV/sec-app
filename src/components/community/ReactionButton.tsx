
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  toggleAnnouncementReaction, 
  toggleChatMessageReaction, 
  toggleReplyReaction 
} from '@/services/communityService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AnnouncementReaction, 
  ChatMessageReaction, 
  ReplyReaction 
} from '@/types/dataTypes';

interface ReactionButtonProps {
  itemId: string;
  itemType: 'announcement' | 'chat' | 'reply';
  initialReactions?: Record<string, string[]>;
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const ReactionButton: React.FC<ReactionButtonProps> = ({ 
  itemId, 
  itemType,
  initialReactions = {} 
}) => {
  const { profile, isConnected } = useProfile();
  const [reactions, setReactions] = useState<Record<string, string[]>>(initialReactions);
  const [open, setOpen] = useState(false);
  
  // Determine the channel name and table based on item type
  const getConfig = () => {
    switch (itemType) {
      case 'announcement':
        return {
          channelName: `announcement-reactions-${itemId}`,
          tableName: 'announcement_reactions',
          idField: 'announcement_id'
        };
      case 'chat':
        return {
          channelName: `chat-reactions-${itemId}`,
          tableName: 'chat_message_reactions',
          idField: 'message_id'
        };
      case 'reply':
        return {
          channelName: `reply-reactions-${itemId}`,
          tableName: 'reply_reactions',
          idField: 'reply_id'
        };
    }
  };
  
  const config = getConfig();
  
  useEffect(() => {
    // Set up real-time subscription for reactions
    const channel = supabase
      .channel(config.channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: config.tableName,
          filter: `${config.idField}=eq.${itemId}`
        }, 
        () => {
          // Refresh reactions when changes occur
          fetchReactions();
        }
      )
      .subscribe();
      
    // Initial fetch
    fetchReactions();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId, itemType]);
  
  const fetchReactions = async () => {
    try {
      let query;
      
      if (itemType === 'announcement') {
        query = supabase
          .from('announcement_reactions')
          .select('user_id, reaction_type')
          .eq('announcement_id', itemId);
      } else if (itemType === 'chat') {
        query = supabase
          .from('chat_message_reactions')
          .select('user_id, reaction_type')
          .eq('message_id', itemId);
      } else if (itemType === 'reply') {
        query = supabase
          .from('reply_reactions')
          .select('user_id, reaction_type')
          .eq('reply_id', itemId);
      }
      
      const { data, error } = await query!;
        
      if (error) throw error;
      
      if (data) {
        // Group by reaction type
        const groupedReactions: Record<string, string[]> = {};
        
        data.forEach((reaction: any) => {
          if (!groupedReactions[reaction.reaction_type]) {
            groupedReactions[reaction.reaction_type] = [];
          }
          groupedReactions[reaction.reaction_type].push(reaction.user_id);
        });
        
        setReactions(groupedReactions);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };
  
  const handleReaction = async (emoji: string) => {
    if (!isConnected || !profile) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet to react to messages",
        variant: "default",
      });
      return;
    }
    
    try {
      let success = false;
      
      switch (itemType) {
        case 'announcement':
          success = await toggleAnnouncementReaction(itemId, profile.wallet_address, emoji);
          break;
        case 'chat':
          success = await toggleChatMessageReaction(itemId, profile.wallet_address, emoji);
          break;
        case 'reply':
          success = await toggleReplyReaction(itemId, profile.wallet_address, emoji);
          break;
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getTotalReactionCount = () => {
    return Object.values(reactions).reduce((total, users) => total + users.length, 0);
  };
  
  const hasUserReacted = (emoji: string) => {
    return profile && reactions[emoji]?.includes(profile.wallet_address);
  };
  
  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center space-x-1 h-7 px-2"
          >
            <span>😊</span>
            {getTotalReactionCount() > 0 && (
              <span className="ml-1">{getTotalReactionCount()}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex space-x-1">
            {REACTION_EMOJIS.map(emoji => (
              <Button
                key={emoji}
                variant={hasUserReacted(emoji) ? "secondary" : "ghost"}
                size="sm"
                className="p-1 h-8 w-8 text-lg"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="flex space-x-1">
        {Object.entries(reactions)
          .filter(([_, users]) => users.length > 0)
          .map(([emoji, users]) => (
            <div 
              key={emoji}
              className={`text-xs rounded-full px-2 py-0.5 border flex items-center 
                ${hasUserReacted(emoji) ? 'bg-secondary' : 'bg-muted'}
              `}
            >
              <span>{emoji}</span>
              <span className="ml-1">{users.length}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReactionButton;
