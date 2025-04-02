
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, ThumbsDown, DollarSign, MessageSquare, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { truncateText } from '@/lib/utils';
import { Scammer } from '@/types/dataTypes';
import { useProfile } from '@/contexts/ProfileContext';
import { likeScammer, dislikeScammer, getProfileByWallet } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import { Profile } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';

interface ScammerCardProps {
  scammer: Scammer;
}

const ScammerCard: React.FC<ScammerCardProps> = ({ scammer }) => {
  const { profile } = useProfile();
  const isCreator = profile?.wallet_address === scammer.added_by;
  const [likes, setLikes] = useState(scammer.likes || 0);
  const [dislikes, setDislikes] = useState(scammer.dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [viewCount, setViewCount] = useState(scammer.views || 0);

  // Fetch creator profile on component mount
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

  // Always display the latest view count from the scammer prop
  useEffect(() => {
    setViewCount(scammer.views || 0);
    
    // Update local likes and dislikes when scammer data changes
    setLikes(scammer.likes || 0);
    setDislikes(scammer.dislikes || 0);
  }, [scammer.views, scammer.likes, scammer.dislikes]);

  // Check if the current user has liked or disliked this scammer
  useEffect(() => {
    const checkUserInteraction = async () => {
      if (!profile?.wallet_address) return;
      
      try {
        // Query the user_scammer_interactions table to see if the user has liked/disliked
        const { data, error } = await supabase
          .from('user_scammer_interactions')
          .select('liked, disliked')
          .eq('scammer_id', scammer.id)
          .eq('user_id', profile.wallet_address)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking user interaction:', error);
          return;
        }
        
        if (data) {
          setIsLiked(data.liked);
          setIsDisliked(data.disliked);
        }
      } catch (error) {
        console.error('Error in checkUserInteraction:', error);
      }
    };
    
    checkUserInteraction();
  }, [scammer.id, profile?.wallet_address]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
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
      // Update UI optimistically
      const wasLiked = isLiked;
      const wasDisliked = isDisliked;
      
      if (isLiked) {
        // If already liked, unlike it
        setLikes(prev => Math.max(prev - 1, 0));
        setIsLiked(false);
      } else {
        // If not liked, like it
        setLikes(prev => prev + 1);
        setIsLiked(true);
        
        // If it was previously disliked, remove the dislike
        if (isDisliked) {
          setDislikes(prev => Math.max(prev - 1, 0));
          setIsDisliked(false);
        }
      }

      // Call the likeScammer function to update the database
      await likeScammer(scammer.id, profile.wallet_address);
      
      toast({
        title: wasLiked ? "Like removed" : "Report liked",
        description: wasLiked ? "You've removed your like from this report." : "You've marked this report as accurate."
      });
    } catch (error) {
      console.error("Error liking scammer:", error);
      // Revert UI changes on error
      setIsLiked(!isLiked);
      if (isDisliked !== isDisliked) {
        setIsDisliked(!isDisliked);
      }
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
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
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
      // Update UI optimistically
      const wasDisliked = isDisliked;
      const wasLiked = isLiked;
      
      if (isDisliked) {
        // If already disliked, un-dislike it
        setDislikes(prev => Math.max(prev - 1, 0));
        setIsDisliked(false);
      } else {
        // If not disliked, dislike it
        setDislikes(prev => prev + 1);
        setIsDisliked(true);
        
        // If it was previously liked, remove the like
        if (isLiked) {
          setLikes(prev => Math.max(prev - 1, 0));
          setIsLiked(false);
        }
      }
      
      // Call the dislikeScammer function to update the database
      await dislikeScammer(scammer.id, profile.wallet_address);
      
      toast({
        title: wasDisliked ? "Dislike removed" : "Report disliked",
        description: wasDisliked ? "You've removed your dislike from this report." : "You've marked this report as inaccurate."
      });
    } catch (error) {
      console.error("Error disliking scammer:", error);
      // Revert UI changes on error
      setIsDisliked(!isDisliked);
      if (isLiked !== isLiked) {
        setIsLiked(!isLiked);
      }
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

  return (
    <div className="icc-card overflow-hidden group">
      <Link to={`/scammer/${scammer.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={scammer.photo_url || '/placeholder.svg'} 
            alt={scammer.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 bg-icc-gold text-icc-blue-dark px-3 py-1 text-sm font-bold flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{scammer.bounty_amount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-serif font-bold text-icc-blue">{scammer.name}</h3>
          <p className="text-sm text-icc-gray mt-1">{truncateText(scammer.accused_of, 100)}</p>
          
          {creatorProfile && (
            <div className="mt-2 flex items-center">
              <Link 
                to={`/${creatorProfile.username}`} 
                className="flex items-center text-xs text-icc-gray-dark hover:text-icc-gold"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={creatorProfile.profile_pic_url || '/placeholder.svg'} 
                  alt={creatorProfile.display_name} 
                  className="w-5 h-5 rounded-full mr-1"
                />
                <span>@{creatorProfile.username || 'anonymous'}</span>
              </Link>
            </div>
          )}
          
          <div className="mt-4 text-xs text-icc-gray-dark flex justify-between items-center">
            <div>
              Added: {new Date(scammer.date_added).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {viewCount}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {likes}
              </span>
              <span className="flex items-center">
                <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                {dislikes}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {scammer.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4 pt-0 mt-2 border-t border-gray-100 flex justify-between">
        <Toggle
          pressed={isLiked}
          onPressedChange={() => {}}
          onClick={handleLike}
          className={`${isLiked ? 'bg-green-100 text-green-700' : ''} border border-gray-200`}
          size="sm"
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Agree
        </Toggle>
        
        <Button variant="outline" size="sm" className="text-xs">
          <DollarSign className="h-3.5 w-3.5 mr-1" />
          Add Bounty
        </Button>
        
        {isCreator ? (
          <Link to={`/report/${scammer.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </Link>
        ) : (
          <Toggle
            pressed={isDisliked}
            onPressedChange={() => {}}
            onClick={handleDislike}
            className={`${isDisliked ? 'bg-red-100 text-red-700' : ''} border border-gray-200`}
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
