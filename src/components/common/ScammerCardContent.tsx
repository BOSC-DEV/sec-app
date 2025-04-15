
import React, { useState } from 'react';
import { Comment, Scammer } from '@/types/dataTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommunityInteractionButtons from '@/components/community/CommunityInteractionButtons';
import AdminContextMenu from '@/components/community/AdminContextMenu';
import { toast } from '@/hooks/use-toast';
import { deleteComment } from '@/services/commentService';
import { banUser } from '@/utils/adminUtils';
import { formatTimeAgo } from '@/utils/formatTime';

interface ScammerCardContentProps {
  scammer: Scammer;
  comments: Comment[];
  isAdmin: boolean;
}

const ScammerCardContent: React.FC<ScammerCardContentProps> = ({ scammer, comments, isAdmin }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteComment = async (commentId: string) => {
    if (!isAdmin || isDeleting) return;

    setIsDeleting(true);
    try {
      const success = await deleteComment(commentId);
      if (success) {
        toast({
          title: "Comment deleted",
          description: "The comment has been deleted successfully",
          variant: "default",
        });
        // Refresh comments or update state as needed
        window.location.reload();
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBanUser = (authorName: string) => {
    if (!authorName) return;
    try {
      banUser(authorName);
      toast({
        title: "User banned",
        description: "The user has been banned from sending messages",
        variant: "default"
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderComment = (comment: Comment) => {
    const time = formatTimeAgo(comment.created_at);

    const commentContent = (
      <div key={comment.id} className="border rounded-md p-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={comment.author_profile_pic} alt={comment.author_name} />
              <AvatarFallback>{comment.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium">{comment.author_name}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {time}
          </div>
        </div>
        <div className="text-sm mt-2">{comment.content}</div>
        <div className="mt-2">
          <CommunityInteractionButtons
            itemId={comment.id}
            itemType="scammer-comment"
            initialLikes={comment.likes}
            initialDislikes={comment.dislikes}
          />
        </div>
      </div>
    );
    
    return isAdmin ? (
      <AdminContextMenu 
        key={comment.id}
        onDelete={() => handleDeleteComment(comment.id)}
        onBanUser={() => handleBanUser(comment.author_name)}
        canEdit={false}
      >
        {commentContent}
      </AdminContextMenu>
    ) : commentContent;
  };

  return (
    <div className="space-y-3">
      {comments.map(renderComment)}
    </div>
  );
};

export default ScammerCardContent;
