
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Heart, Flame, PartyPopper, ThumbsUp, MessagesSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type ReactionType = 'like' | 'fire' | 'party' | 'applause';
type ItemType = 'announcement' | 'message' | 'reply';

interface ReactionButtonProps {
  itemId: string;
  itemType: ItemType;
  size?: 'xs' | 'sm' | 'md';
  iconOnly?: boolean;
}

const getReactionIcon = (type: ReactionType, active: boolean, size: 'xs' | 'sm' | 'md') => {
  const sizeClass = size === 'xs' ? 'h-3.5 w-3.5' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const activeClass = active ? 'text-icc-gold' : 'text-muted-foreground';
  
  switch (type) {
    case 'like':
      return <Heart className={cn(sizeClass, activeClass)} />;
    case 'fire':
      return <Flame className={cn(sizeClass, activeClass)} />;
    case 'party':
      return <PartyPopper className={cn(sizeClass, activeClass)} />;
    case 'applause':
      return <ThumbsUp className={cn(sizeClass, activeClass)} />;
    default:
      return <Heart className={cn(sizeClass, activeClass)} />;
  }
};

interface ReactionCount {
  reaction_type: string;
  count: number;
  has_reacted: boolean;
}

const ReactionButton = ({ itemId, itemType, size = 'sm', iconOnly = false }: ReactionButtonProps) => {
  const { profile, isConnected } = useProfile();
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);

  const reactionTypes: ReactionType[] = ['like', 'fire', 'party', 'applause'];
  
  const handleToggleReaction = async (reactionType: ReactionType) => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Connect your wallet to react to messages",
        variant: "destructive"
      });
      return;
    }
    
    try {
      let success = false;
      
      // Determine which table to use based on itemType
      let table: 'announcement_reactions' | 'chat_message_reactions' | 'reply_reactions';
      let idColumn: string;
      
      if (itemType === 'announcement') {
        table = 'announcement_reactions';
        idColumn = 'announcement_id';
      } else if (itemType === 'message') {
        table = 'chat_message_reactions';
        idColumn = 'message_id';
      } else {
        table = 'reply_reactions';
        idColumn = 'reply_id';
      }
      
      // Check if the user already has the same reaction
      const { data: existing, error: checkError } = await supabase
        .from(table)
        .select('id')
        .eq(idColumn, itemId)
        .eq('user_id', profile?.wallet_address || '')
        .eq('reaction_type', reactionType)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existing) {
        // Remove reaction if it exists
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', existing.id);
          
        if (deleteError) throw deleteError;
        success = true;
      } else {
        // Add new reaction
        const insertData: Record<string, any> = {
          reaction_type: reactionType,
          user_id: profile?.wallet_address || ''
        };
        
        // Set the appropriate ID column
        insertData[idColumn] = itemId;
        
        const { error: insertError } = await supabase
          .from(table)
          .insert(insertData);
          
        if (insertError) throw insertError;
        success = true;
      }
      
      if (success) {
        fetchReactions();
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };
  
  const fetchReactions = async () => {
    try {
      // Determine which table to use based on itemType
      let table: 'announcement_reactions' | 'chat_message_reactions' | 'reply_reactions';
      let idColumn: string;
      
      if (itemType === 'announcement') {
        table = 'announcement_reactions';
        idColumn = 'announcement_id';
      } else if (itemType === 'message') {
        table = 'chat_message_reactions';
        idColumn = 'message_id';
      } else {
        table = 'reply_reactions';
        idColumn = 'reply_id';
      }
      
      const { data: reactionData, error: reactionError } = await supabase
        .from(table)
        .select('reaction_type, user_id')
        .eq(idColumn, itemId);
        
      if (reactionError) throw reactionError;
      
      const reactionCounts: ReactionCount[] = [];
      const reactionMap = new Map<string, { count: number, has_reacted: boolean }>();
      
      reactionTypes.forEach(type => {
        reactionMap.set(type, { count: 0, has_reacted: false });
      });
      
      if (reactionData) {
        reactionData.forEach((reaction: {reaction_type: string, user_id: string}) => {
          const type = reaction.reaction_type;
          const currentData = reactionMap.get(type) || { count: 0, has_reacted: false };
          
          currentData.count += 1;
          
          if (reaction.user_id === profile?.wallet_address) {
            currentData.has_reacted = true;
          }
          
          reactionMap.set(type, currentData);
        });
      }
      
      reactionMap.forEach((value, key) => {
        reactionCounts.push({
          reaction_type: key,
          count: value.count,
          has_reacted: value.has_reacted
        });
      });
      
      setReactions(reactionCounts);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };
  
  useEffect(() => {
    fetchReactions();
    
    // Create a unique channel name to avoid collisions
    const channelName = `reactions_${itemType}_${itemId}`;
    
    // Determine the table to listen to based on itemType
    let tableName: 'announcement_reactions' | 'chat_message_reactions' | 'reply_reactions';
    let filterColumn: string;
    
    if (itemType === 'announcement') {
      tableName = 'announcement_reactions';
      filterColumn = 'announcement_id';
    } else if (itemType === 'message') {
      tableName = 'chat_message_reactions';
      filterColumn = 'message_id';
    } else {
      tableName = 'reply_reactions';
      filterColumn = 'reply_id';
    }
    
    // Set up the realtime subscription
    const channel = supabase.channel(channelName);
    
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: `${filterColumn}=eq.${itemId}`
      }, () => {
        fetchReactions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId, itemType, profile?.wallet_address]);

  if (reactions.length === 0 && iconOnly) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          'h-auto w-auto p-1 rounded-full hover:bg-muted/30', 
          size === 'xs' ? 'scale-75' : size === 'md' ? 'scale-110' : ''
        )}
        onClick={() => handleToggleReaction('like')}
      >
        <ThumbsUp className={cn(
          size === 'xs' ? 'h-3.5 w-3.5' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          'text-muted-foreground'
        )} />
      </Button>
    );
  }

  if (iconOnly) {
    return (
      <div className="flex items-center gap-0.5">
        {reactions.map(reaction => (
          reaction.count > 0 && (
            <Button
              key={reaction.reaction_type}
              variant="ghost"
              size="icon"
              className={cn(
                'h-auto w-auto p-0.5 rounded-full',
                reaction.has_reacted ? 'text-icc-gold' : 'text-muted-foreground'
              )}
              onClick={() => handleToggleReaction(reaction.reaction_type as ReactionType)}
            >
              {getReactionIcon(reaction.reaction_type as ReactionType, reaction.has_reacted, size)}
            </Button>
          )
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu open={showEmojis} onOpenChange={setShowEmojis}>
      <div className="flex flex-wrap items-center">
        {reactions.length > 0 ? (
          <>
            {reactions.map(reaction => (
              reaction.count > 0 && (
                <Button
                  key={reaction.reaction_type}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 mr-1 mb-1 rounded-full',
                    reaction.has_reacted ? 'bg-muted/30' : 'hover:bg-muted/30'
                  )}
                  onClick={() => handleToggleReaction(reaction.reaction_type as ReactionType)}
                >
                  <span className="flex items-center">
                    {getReactionIcon(reaction.reaction_type as ReactionType, reaction.has_reacted, size)}
                    <span className="ml-1 text-xs font-medium">{reaction.count}</span>
                  </span>
                </Button>
              )
            ))}
            
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 rounded-full">
                <MessagesSquare className={size === 'xs' ? 'h-3.5 w-3.5' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
              </Button>
            </DropdownMenuTrigger>
          </>
        ) : (
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-3 rounded-full">
              <Heart className={size === 'xs' ? 'h-3.5 w-3.5' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
              <span className="ml-1 text-sm">React</span>
            </Button>
          </DropdownMenuTrigger>
        )}
        
        <DropdownMenuContent align="start" className="p-1 min-w-0">
          <div className="flex space-x-1">
            {reactionTypes.map(type => (
              <DropdownMenuItem
                key={type}
                className="p-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleReaction(type);
                  setShowEmojis(false);
                }}
              >
                {getReactionIcon(type, false, 'md')}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};

export default ReactionButton;
