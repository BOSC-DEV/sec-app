
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Eye,
  Check
} from 'lucide-react';
import { Scammer } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';
import { 
  likeScammer, 
  dislikeScammer, 
  incrementScammerView 
} from '@/services/interactionService';
import { useProfile } from '@/contexts/ProfileContext';

interface ScammerActionButtonProps {
  icon: React.ReactNode;
  count: number;
  onClick?: () => void;
  isActive?: boolean;
  label?: string;
}

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
    className={`flex items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
    onClick={onClick}
    title={label}
  >
    {icon}
    <span>{count > 999 ? `${(count / 1000).toFixed(1)}k` : count}</span>
  </Button>
);

interface ScammerCardActionsProps {
  scammer: Scammer;
  userInteraction?: {
    liked: boolean;
    disliked: boolean;
  };
  onUpdateInteraction?: () => void;
}

const ScammerCardActions: React.FC<ScammerCardActionsProps> = ({
  scammer,
  userInteraction,
  onUpdateInteraction,
}) => {
  const { toast } = useToast();
  const { profile } = useProfile();

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/scammer/${scammer.id}`;
      await navigator.clipboard.writeText(url);
      
      toast({
        title: "Link copied",
        description: "Scammer profile link copied to clipboard",
      });
    } catch (error) {
      handleError(error, "Failed to copy link");
    }
  };

  const handleLike = async () => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to like this scammer",
        variant: "destructive",
      });
      return;
    }

    try {
      await likeScammer(scammer.id, profile.wallet_address);
      if (onUpdateInteraction) onUpdateInteraction();
      
      toast({
        title: "Success",
        description: "Your feedback has been recorded",
      });
    } catch (error) {
      handleError(error, "Failed to like scammer");
    }
  };

  const handleDislike = async () => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to dislike this scammer",
        variant: "destructive",
      });
      return;
    }

    try {
      await dislikeScammer(scammer.id, profile.wallet_address);
      if (onUpdateInteraction) onUpdateInteraction();
      
      toast({
        title: "Success",
        description: "Your feedback has been recorded",
      });
    } catch (error) {
      handleError(error, "Failed to dislike scammer");
    }
  };

  return (
    <div className="flex justify-between items-center pt-2 border-t mt-auto">
      <div className="flex space-x-1">
        <ScammerActionButton
          icon={<ThumbsUp size={16} />}
          count={scammer.likes || 0}
          onClick={handleLike}
          isActive={userInteraction?.liked}
          label="Like"
        />
        <ScammerActionButton
          icon={<ThumbsDown size={16} />}
          count={scammer.dislikes || 0}
          onClick={handleDislike}
          isActive={userInteraction?.disliked}
          label="Dislike"
        />
      </div>
      <div className="flex space-x-1">
        <ScammerActionButton
          icon={<Eye size={16} />}
          count={scammer.views || 0}
          label="Views"
        />
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleShare}
          title="Share"
        >
          <Share2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ScammerCardActions;
