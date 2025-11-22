import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { commentReplyService, CommentReply } from '@/services/commentReplyService';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';

interface CommentReplyItemProps {
  reply: CommentReply;
  onReplyUpdated: () => void;
}

export const CommentReplyItem: React.FC<CommentReplyItemProps> = ({ reply, onReplyUpdated }) => {
  const { profile } = useProfile();
  const [likes, setLikes] = useState(reply.likes || 0);
  const [dislikes, setDislikes] = useState(reply.dislikes || 0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (profile?.id) {
        const reaction = await commentReplyService.getUserReaction(reply.id, profile.id);
        setUserReaction(reaction);
      }
    };
    fetchUserReaction();
  }, [reply.id, profile?.id]);

  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!profile?.id) {
      toast.error('Please sign in to react');
      return;
    }

    setIsLoading(true);
    try {
      const result = await commentReplyService.toggleReaction(reply.id, profile.id, reactionType);
      setLikes(result.likes);
      setDislikes(result.dislikes);
      
      if (userReaction === reactionType) {
        setUserReaction(null);
      } else {
        setUserReaction(reactionType);
      }
      
      onReplyUpdated();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const isLiked = userReaction === 'like';
  const isDisliked = userReaction === 'dislike';

  return (
    <div className="flex gap-3 pl-12 py-3 border-l-2 border-border/30">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={reply.author_profile_pic || undefined} alt={reply.author_name || 'User'} />
        <AvatarFallback className="text-xs">
          {reply.author_name?.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{reply.author_name || 'Anonymous'}</span>
          <span className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</span>
        </div>
        <p className="mt-1 text-sm break-words">{reply.content}</p>
        
        {/* Like/Dislike buttons */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('like')}
            disabled={isLoading || !profile}
            className={`flex items-center gap-1 h-7 px-2 ${isLiked ? 'text-icc-gold' : ''}`}
          >
            <ThumbsUp className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('dislike')}
            disabled={isLoading || !profile}
            className={`flex items-center gap-1 h-7 px-2 ${isDisliked ? 'text-red-500' : ''}`}
          >
            <ThumbsDown className={`h-3 w-3 ${isDisliked ? 'fill-current' : ''}`} />
            <span className="text-xs">{dislikes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
