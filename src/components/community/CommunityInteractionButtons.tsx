
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  likeAnnouncement, 
  dislikeAnnouncement, 
  likeReply, 
  dislikeReply, 
  likeChatMessage, 
  dislikeChatMessage,
  getUserAnnouncementInteraction,
  getUserReplyInteraction,
  getUserChatMessageInteraction
} from '@/services/communityService';

interface InteractionButtonProps {
  icon: React.ReactNode;
  count: number;
  onClick?: () => void;
  isActive?: boolean;
  label?: string;
}

export const InteractionButton: React.FC<InteractionButtonProps> = ({
  icon,
  count,
  onClick,
  isActive = false,
  label,
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={`flex items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
    onClick={onClick}
    title={label}
  >
    {icon}
    <span>{count > 999 ? `${(count / 1000).toFixed(1)}k` : count}</span>
  </Button>
);

type ItemType = 'announcement' | 'reply' | 'message';

interface CommunityInteractionButtonsProps {
  itemId: string;
  itemType: ItemType;
  initialLikes?: number;
  initialDislikes?: number;
  onUpdateInteraction?: () => void;
}

const CommunityInteractionButtons: React.FC<CommunityInteractionButtonsProps> = ({ 
  itemId, 
  itemType, 
  initialLikes = 0, 
  initialDislikes = 0,
  onUpdateInteraction
}) => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [localLikes, setLocalLikes] = useState(initialLikes);
  const [localDislikes, setLocalDislikes] = useState(initialDislikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    const fetchUserInteraction = async () => {
      if (!profile?.wallet_address) return;

      try {
        let interaction = { liked: false, disliked: false };
        
        switch (itemType) {
          case 'announcement':
            interaction = await getUserAnnouncementInteraction(itemId, profile.wallet_address);
            break;
          case 'reply':
            interaction = await getUserReplyInteraction(itemId, profile.wallet_address);
            break;
          case 'message':
            interaction = await getUserChatMessageInteraction(itemId, profile.wallet_address);
            break;
        }
        
        setIsLiked(interaction.liked);
        setIsDisliked(interaction.disliked);
      } catch (error) {
        console.error('Error fetching user interaction:', error);
      }
    };

    fetchUserInteraction();
  }, [itemId, itemType, profile?.wallet_address]);

  useEffect(() => {
    setLocalLikes(initialLikes);
    setLocalDislikes(initialDislikes);
  }, [initialLikes, initialDislikes]);

  const handleLike = async () => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to like this item",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const wasLiked = isLiked;
      if (wasLiked) {
        setLocalLikes(Math.max(localLikes - 1, 0));
        setIsLiked(false);
      } else {
        setLocalLikes(localLikes + 1);
        setIsLiked(true);
        
        if (isDisliked) {
          setLocalDislikes(Math.max(localDislikes - 1, 0));
          setIsDisliked(false);
        }
      }
      
      let result = null;
      
      switch (itemType) {
        case 'announcement':
          result = await likeAnnouncement(itemId, profile.wallet_address);
          break;
        case 'reply':
          result = await likeReply(itemId, profile.wallet_address);
          break;
        case 'message':
          result = await likeChatMessage(itemId, profile.wallet_address);
          break;
      }
      
      if (result && typeof result === 'object' && 'likes' in result) {
        setLocalLikes(result.likes);
        setLocalDislikes(result.dislikes);
      }
      
      if (onUpdateInteraction) {
        onUpdateInteraction();
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
      // Reset to previous state on error
      await fetchCurrentInteraction();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to dislike this item",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const wasDisliked = isDisliked;
      if (wasDisliked) {
        setLocalDislikes(Math.max(localDislikes - 1, 0));
        setIsDisliked(false);
      } else {
        setLocalDislikes(localDislikes + 1);
        setIsDisliked(true);
        
        if (isLiked) {
          setLocalLikes(Math.max(localLikes - 1, 0));
          setIsLiked(false);
        }
      }
      
      let result = null;
      
      switch (itemType) {
        case 'announcement':
          result = await dislikeAnnouncement(itemId, profile.wallet_address);
          break;
        case 'reply':
          result = await dislikeReply(itemId, profile.wallet_address);
          break;
        case 'message':
          result = await dislikeChatMessage(itemId, profile.wallet_address);
          break;
      }
      
      if (result && typeof result === 'object' && 'likes' in result) {
        setLocalLikes(result.likes);
        setLocalDislikes(result.dislikes);
      }
      
      if (onUpdateInteraction) {
        onUpdateInteraction();
      }
    } catch (error) {
      console.error("Error in handleDislike:", error);
      // Reset to previous state on error
      await fetchCurrentInteraction();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentInteraction = async () => {
    if (!profile?.wallet_address) return;

    try {
      let interaction = { liked: false, disliked: false };
      let counts = { likes: initialLikes, dislikes: initialDislikes };
      
      switch (itemType) {
        case 'announcement':
          interaction = await getUserAnnouncementInteraction(itemId, profile.wallet_address);
          break;
        case 'reply':
          interaction = await getUserReplyInteraction(itemId, profile.wallet_address);
          break;
        case 'message':
          interaction = await getUserChatMessageInteraction(itemId, profile.wallet_address);
          break;
      }
      
      setIsLiked(interaction.liked);
      setIsDisliked(interaction.disliked);
      setLocalLikes(counts.likes);
      setLocalDislikes(counts.dislikes);
    } catch (error) {
      console.error('Error fetching user interaction:', error);
    }
  };

  return (
    <div className="flex space-x-1">
      <InteractionButton
        icon={<ThumbsUp size={16} />}
        count={localLikes}
        onClick={handleLike}
        isActive={isLiked}
        label="Like"
      />
      <InteractionButton
        icon={<ThumbsDown size={16} />}
        count={localDislikes}
        onClick={handleDislike}
        isActive={isDisliked}
        label="Dislike"
      />
    </div>
  );
};

export default CommunityInteractionButtons;
