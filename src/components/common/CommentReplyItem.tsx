import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Edit2, Trash2, X, Check } from 'lucide-react';
import { commentReplyService, CommentReply } from '@/services/commentReplyService';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CommentReplyItemProps {
  reply: CommentReply;
  onReplyUpdated: () => void;
  onReplyDeleted: () => void;
}

export const CommentReplyItem: React.FC<CommentReplyItemProps> = ({ 
  reply, 
  onReplyUpdated,
  onReplyDeleted 
}) => {
  const { profile } = useProfile();
  const [likes, setLikes] = useState(reply.likes || 0);
  const [dislikes, setDislikes] = useState(reply.dislikes || 0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isAuthor = profile?.id === reply.author;

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

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await commentReplyService.updateReply(reply.id, editContent);
      setIsEditing(false);
      onReplyUpdated();
      toast.success('Reply updated successfully');
    } catch (error) {
      console.error('Error updating reply:', error);
      toast.error('Failed to update reply');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await commentReplyService.deleteReply(reply.id);
      onReplyDeleted();
      toast.success('Reply deleted successfully');
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(reply.content);
  };

  const isLiked = userReaction === 'like';
  const isDisliked = userReaction === 'dislike';

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    
    <div className="flex gap-3 pl-12 py-3 border-l-2 border-border/30">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={reply.author_profile_pic || undefined} alt={reply.author_name || 'User'} />
        <AvatarFallback className="text-xs">
          {reply.author_name?.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2">
            <Link 
              to={`/profile/${reply.author}`} 
              className="font-medium text-sm hover:text-icc-gold hover:underline transition-colors"
            >
              {reply.author_name || 'Anonymous'}
            </Link>
            <span className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</span>
          </div>
          
          {/* Edit/Delete buttons for author */}
          {isAuthor && !isEditing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0"
                title="Edit reply"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                title="Delete reply"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[60px] text-sm"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={isLoading || !editContent.trim()}
                className="h-7"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="h-7"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm break-words">{reply.content}</p>
        )}
        
        {/* Like/Dislike buttons - only show when not editing */}
        {!isEditing && (
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
        )}
      </div>
    </div>
    </>
  );
};
