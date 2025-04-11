import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Eye,
  DollarSign
} from 'lucide-react';
import { Scammer } from '@/types/dataTypes';
import { handleError } from '@/utils/errorHandling';
import { 
  likeScammer, 
  dislikeScammer
} from '@/services/interactionService';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BountyForm from '@/components/scammer/BountyForm';
import CurrencyIcon from '@/components/common/CurrencyIcon';

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
  showBountyDialog?: boolean;
  developerWalletAddress?: string;
}

const ScammerCardActions: React.FC<ScammerCardActionsProps> = ({
  scammer,
  userInteraction,
  onUpdateInteraction,
  showBountyDialog = false,
  developerWalletAddress = "A6X5A7ZSvez8BK82Z5tnZJC3qarGbsxRVv8Hc3DKBiZx",
}) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [bountyDialogOpen, setBountyDialogOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState(scammer.likes || 0);
  const [localDislikes, setLocalDislikes] = useState(scammer.dislikes || 0);
  const [isLiked, setIsLiked] = useState(userInteraction?.liked || false);
  const [isDisliked, setIsDisliked] = useState(userInteraction?.disliked || false);

  React.useEffect(() => {
    setLocalLikes(scammer.likes || 0);
    setLocalDislikes(scammer.dislikes || 0);
    setIsLiked(userInteraction?.liked || false);
    setIsDisliked(userInteraction?.disliked || false);
  }, [scammer, userInteraction]);

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

    if (isLoading) return;
    setIsLoading(true);

    try {
      console.log(`Attempting to like scammer ${scammer.id} with wallet ${profile.wallet_address}`);
      
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
      
      const result = await likeScammer(scammer.id, profile.wallet_address);
      console.log("Like result:", result);
      
      if (result && typeof result === 'object' && 'likes' in result) {
        setLocalLikes(result.likes);
        setLocalDislikes(result.dislikes);
        
        scammer.likes = result.likes;
        scammer.dislikes = result.dislikes;
      }
      
      if (onUpdateInteraction) {
        console.log("Calling onUpdateInteraction after like");
        onUpdateInteraction();
      }
      
      toast({
        title: "Success",
        description: "Your feedback has been recorded",
      });
    } catch (error) {
      console.error("Error in handleLike:", error);
      handleError(error, "Failed to like scammer");
      setIsLiked(userInteraction?.liked || false);
      setIsDisliked(userInteraction?.disliked || false);
      setLocalLikes(scammer.likes || 0);
      setLocalDislikes(scammer.dislikes || 0);
    } finally {
      setIsLoading(false);
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

    if (isLoading) return;
    setIsLoading(true);

    try {
      console.log(`Attempting to dislike scammer ${scammer.id} with wallet ${profile.wallet_address}`);
      
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
      
      const result = await dislikeScammer(scammer.id, profile.wallet_address);
      console.log("Dislike result:", result);
      
      if (result && typeof result === 'object' && 'likes' in result) {
        setLocalLikes(result.likes);
        setLocalDislikes(result.dislikes);
        
        scammer.likes = result.likes;
        scammer.dislikes = result.dislikes;
      }
      
      if (onUpdateInteraction) {
        console.log("Calling onUpdateInteraction after dislike");
        onUpdateInteraction();
      }
      
      toast({
        title: "Success",
        description: "Your feedback has been recorded",
      });
    } catch (error) {
      console.error("Error in handleDislike:", error);
      handleError(error, "Failed to dislike scammer");
      setIsLiked(userInteraction?.liked || false);
      setIsDisliked(userInteraction?.disliked || false);
      setLocalLikes(scammer.likes || 0);
      setLocalDislikes(scammer.dislikes || 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBountyClick = () => {
    if (showBountyDialog) {
      setBountyDialogOpen(true);
    } else {
      window.location.href = `/scammer/${scammer.id}#bounty-section`;
    }
  };

  return (
    <div className="flex justify-between items-center pt-2 border-t mt-auto">
      <div className="flex space-x-1">
        <ScammerActionButton
          icon={<ThumbsUp size={16} />}
          count={localLikes}
          onClick={handleLike}
          isActive={isLiked}
          label="Like"
        />
        <ScammerActionButton
          icon={<ThumbsDown size={16} />}
          count={localDislikes}
          onClick={handleDislike}
          isActive={isDisliked}
          label="Dislike"
        />
      </div>
      <div className="flex space-x-1">
        <Dialog open={bountyDialogOpen} onOpenChange={setBountyDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground"
              onClick={handleBountyClick}
              title="Add Bounty"
            >
              <DollarSign size={16} />
              <span>{scammer.bounty_amount || 0}</span>
            </Button>
          </DialogTrigger>
          {showBountyDialog && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Bounty for {scammer.name}</DialogTitle>
                <DialogDescription>
                  Contribute to the bounty for this scammer. All funds go to the developer wallet.
                </DialogDescription>
              </DialogHeader>
              <BountyForm 
                scammerId={scammer.id} 
                scammerName={scammer.name}
                developerWalletAddress={developerWalletAddress}
              />
            </DialogContent>
          )}
        </Dialog>
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
