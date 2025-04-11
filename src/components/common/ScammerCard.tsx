
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ThumbsUp, ThumbsDown, MessageSquare, Edit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { truncateText } from '@/lib/utils';
import { Scammer } from '@/types/dataTypes';
import { useProfile } from '@/contexts/ProfileContext';
import { likeScammer, dislikeScammer, getUserScammerInteraction } from '@/services/interactionService';
import { getProfileByWallet } from '@/services/profileService';
import { toast } from '@/hooks/use-toast';
import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ScammerCardProps {
  scammer: Scammer;
  rank?: number;
}

const ScammerCard: React.FC<ScammerCardProps> = ({ scammer, rank }) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const isCreator = profile?.wallet_address === scammer.added_by;
  const [likes, setLikes] = useState(scammer.likes || 0);
  const [dislikes, setDislikes] = useState(scammer.dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [viewCount, setViewCount] = useState(scammer.views || 0);

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (scammer.added_by) {
        try {
          const profile = await getProfileByWallet(scammer.added_by);
          setCreatorProfile(profile);
        } catch (error) {
          console.error("Error fetching creator profile:", error);
        }
      }
    };

    fetchCreatorProfile();
  }, [scammer.added_by]);

  useEffect(() => {
    setViewCount(scammer.views || 0);
    setLikes(scammer.likes || 0);
    setDislikes(scammer.dislikes || 0);
  }, [scammer.views, scammer.likes, scammer.dislikes]);

  useEffect(() => {
    const checkUserInteraction = async () => {
      if (!profile?.wallet_address) return;
      
      try {
        const interaction = await getUserScammerInteraction(scammer.id, profile.wallet_address);
        
        if (interaction) {
          console.log("Found user interaction:", interaction);
          setIsLiked(interaction.liked);
          setIsDisliked(interaction.disliked);
        } else {
          setIsLiked(false);
          setIsDisliked(false);
        }
      } catch (error) {
        console.error('Error in checkUserInteraction:', error);
      }
    };
    
    checkUserInteraction();
  }, [scammer.id, profile?.wallet_address]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to like this report.",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log(`ScammerCard: Trying to like scammer ${scammer.id} by user ${profile.wallet_address}`);
      const wasLiked = isLiked;
      
      let newLikes = likes;
      let newDislikes = dislikes;
      
      if (isLiked) {
        newLikes = Math.max(likes - 1, 0);
        setLikes(newLikes);
        setIsLiked(false);
      } else {
        newLikes = likes + 1;
        setLikes(newLikes);
        setIsLiked(true);
        
        if (isDisliked) {
          newDislikes = Math.max(dislikes - 1, 0);
          setDislikes(newDislikes);
          setIsDisliked(false);
        }
      }

      const result = await likeScammer(scammer.id, profile.wallet_address);
      
      if (result && typeof result === 'object' && 'likes' in result) {
        console.log("Received updated counts from likeScammer:", result);
        setLikes(result.likes || 0);
        setDislikes(result.dislikes || 0);
        scammer.likes = result.likes || 0;
        scammer.dislikes = result.dislikes || 0;
      }
      
      toast({
        title: wasLiked ? "Like removed" : "Report liked",
        description: wasLiked ? "You've removed your like from this report." : "You've marked this report as accurate."
      });
      
    } catch (error) {
      console.error("Error liking scammer:", error);
      const interaction = await getUserScammerInteraction(scammer.id, profile.wallet_address);
      setIsLiked(interaction?.liked || false);
      setIsDisliked(interaction?.disliked || false);
      setLikes(scammer.likes || 0);
      setDislikes(scammer.dislikes || 0);
      
      toast({
        title: "Error",
        description: "Failed to like this report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to dislike this report.",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log(`ScammerCard: Trying to dislike scammer ${scammer.id} by user ${profile.wallet_address}`);
      const wasDisliked = isDisliked;
      
      let newDislikes = dislikes;
      let newLikes = likes;
      
      if (isDisliked) {
        newDislikes = Math.max(dislikes - 1, 0);
        setDislikes(newDislikes);
        setIsDisliked(false);
      } else {
        newDislikes = dislikes + 1;
        setDislikes(newDislikes);
        setIsDisliked(true);
        
        if (isLiked) {
          newLikes = Math.max(likes - 1, 0);
          setLikes(newLikes);
          setIsLiked(false);
        }
      }
      
      const result = await dislikeScammer(scammer.id, profile.wallet_address);
      
      if (result && typeof result === 'object' && 'likes' in result) {
        console.log("Received updated counts from dislikeScammer:", result);
        setLikes(result.likes || 0);
        setDislikes(result.dislikes || 0);
        scammer.likes = result.likes || 0;
        scammer.dislikes = result.dislikes || 0;
      }
      
      toast({
        title: wasDisliked ? "Dislike removed" : "Report disliked",
        description: wasDisliked ? "You've removed your dislike from this report." : "You've marked this report as inaccurate."
      });
      
    } catch (error) {
      console.error("Error disliking scammer:", error);
      const interaction = await getUserScammerInteraction(scammer.id, profile.wallet_address);
      setIsLiked(interaction?.liked || false);
      setIsDisliked(interaction?.disliked || false);
      setLikes(scammer.likes || 0);
      setDislikes(scammer.dislikes || 0);
      
      toast({
        title: "Error",
        description: "Failed to dislike this report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBountyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/scammer/${scammer.id}#bounty-section`);
  };

  return (
    <div className="icc-card overflow-hidden group">
      <Link to={`/scammer/${scammer.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={scammer.photo_url || '/placeholder.svg'} 
            alt={scammer.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {rank !== undefined && rank < 3 && (
            <div className="absolute top-0 left-0 bg-icc-red text-white px-3 py-1 text-sm font-serif font-bold rounded-br-lg">
              #{rank + 1} Most Wanted
            </div>
          )}
          <div className="absolute top-0 right-0 bg-icc-gold text-icc-blue-dark px-3 py-1 text-sm font-serif font-bold flex items-center rounded-bl-lg">
            <CurrencyIcon className="h-4 w-4 mr-1" />
            <span>{scammer.bounty_amount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-serif font-bold text-white dark:text-white">{scammer.name}</h3>
          <p className="text-sm text-gray-300 dark:text-gray-300 mt-1">{truncateText(scammer.accused_of, 100)}</p>
          
          {creatorProfile && (
            <div className="mt-2 flex items-center">
              <span 
                className="flex items-center text-xs text-gray-400 dark:text-gray-400"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={creatorProfile.profile_pic_url || '/placeholder.svg'} 
                  alt={creatorProfile.display_name} 
                  className="w-5 h-5 rounded-full mr-1"
                />
                <span>@{creatorProfile.username || 'anonymous'}</span>
              </span>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-400 flex justify-between items-center">
            <div>
              Added: {new Date(scammer.date_added).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-gray-300 dark:text-gray-300">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {viewCount}
              </span>
              <span className="flex items-center text-gray-300 dark:text-gray-300">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {likes}
              </span>
              <span className="flex items-center text-gray-300 dark:text-gray-300">
                <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                {dislikes}
              </span>
              <span className="flex items-center text-gray-300 dark:text-gray-300">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {scammer.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4 pt-0 mt-2 flex justify-between">
        <Toggle
          pressed={isLiked}
          onPressedChange={() => {}}
          onClick={handleLike}
          className={`${isLiked ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'text-white'} text-xs`}
          size="sm"
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Agree
        </Toggle>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white dark:text-white"
                onClick={handleBountyClick}
              >
                <Info className="h-3.5 w-3.5 mr-1" />
                More
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {isCreator ? (
          <Link to={`/report/${scammer.id}`} onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="text-white dark:text-white">
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </Link>
        ) : (
          <Toggle
            pressed={isDisliked}
            onPressedChange={() => {}}
            onClick={handleDislike}
            className={`${isDisliked ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'text-white'} text-xs`}
            size="sm"
          >
            <ThumbsDown className="h-3.5 w-3.5 mr-1" />
            Disagree
          </Toggle>
        )}
      </div>
    </div>
  );
};

export default ScammerCard;
