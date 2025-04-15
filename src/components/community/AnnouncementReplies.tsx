import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  getAnnouncementReplies, 
  addAnnouncementReply,
  deleteAnnouncementReply,
  editAnnouncementReply
} from '@/services/communityService';
import { AnnouncementReply } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import CommunityInteractionButtons from './CommunityInteractionButtons';
import AdminContextMenu from './AdminContextMenu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ReplyForm from './ReplyForm';
import RichTextEditor from './RichTextEditor';
import { formatTimeAgo } from '@/utils/formatTime';
import { banUser, isBanned } from '@/utils/adminUtils';

interface AnnouncementRepliesProps {
  announcementId: string;
  isAdmin: boolean;
}

const AnnouncementReplies: React.FC<AnnouncementRepliesProps> = ({ announcementId, isAdmin }) => {
  const { profile, isConnected } = useProfile();
  const [replies, setReplies] = useState<AnnouncementReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReplies, setShowReplies] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoading(true);
      try {
        const data = await getAnnouncementReplies(announcementId);
        setReplies(data || []);
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (showReplies) {
      fetchReplies();
    }
  }, [announcementId, showReplies]);
  
  const handleBanUser = async (username: string | undefined) => {
    if (!username) return;
    try {
      banUser(username);
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

  const handleAddReply = async (content: string) => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to reply",
        variant: "destructive",
      });
      return;
    }
    
    if (profile?.username && isBanned(profile.username)) {
      toast({
        title: "Unable to reply",
        description: "You have been banned from sending messages",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newReply = await addAnnouncementReply({
        announcement_id: announcementId,
        content,
        author_id: profile?.wallet_address || '',
        author_name: profile?.display_name || '',
        author_username: profile?.username || '',
        author_profile_pic: profile?.profile_pic_url || '',
      });
      
      if (newReply) {
        setReplies(prev => [...prev, newReply]);
        
        toast({
          title: "Reply added",
          description: "Your reply has been added successfully",
          variant: "default",
        });
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteReply = async (replyId: string) => {
    if (!isAdmin) return;
    
    try {
      const success = await deleteAnnouncementReply(replyId);
      if (success) {
        toast({
          title: "Reply deleted",
          description: "The reply has been deleted successfully",
          variant: "default",
        });
        setReplies(prev => prev.filter(reply => reply.id !== replyId));
      } else {
        throw new Error("Failed to delete reply");
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast({
        title: "Error",
        description: "Failed to delete reply. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (reply: AnnouncementReply) => {
    setEditContent(reply.content);
    setEditingReplyId(reply.id);
    setEditDialogOpen(true);
  };
  
  const handleEditReply = async () => {
    if (!editingReplyId || !isAdmin) return;
    
    try {
      const updated = await editAnnouncementReply(editingReplyId, editContent);
      if (updated) {
        toast({
          title: "Reply updated",
          description: "The reply has been updated successfully",
          variant: "default",
        });
        setEditDialogOpen(false);
        
        setReplies(prev => prev.map(reply => 
          reply.id === editingReplyId ? { ...reply, content: editContent } : reply
        ));
      } else {
        throw new Error("Failed to update reply");
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      toast({
        title: "Error",
        description: "Failed to update reply. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    const distance = formatDistanceToNow(new Date(dateString), { addSuffix: false });
    
    if (distance.includes('second')) return distance.replace(' seconds', 's').replace(' second', 's');
    if (distance.includes('minute')) return distance.replace(' minutes', 'm').replace(' minute', 'm');
    if (distance.includes('hour')) return distance.replace(' hours', 'h').replace(' hour', 'h');
    if (distance.includes('day')) return distance.replace(' days', 'd').replace(' day', 'd');
    if (distance.includes('week')) return distance.replace(' weeks', 'w').replace(' week', 'w');
    if (distance.includes('month')) return distance.replace(' months', 'mo').replace(' month', 'mo');
    if (distance.includes('year')) return distance.replace(' years', 'y').replace(' year', 'y');
    
    return distance;
  };
  
  const repliesCount = replies.length;
  
  return (
    <div className="w-full mt-2">
      <Button 
        variant="ghost"
        size="sm"
        className="text-muted-foreground py-1 px-2 h-auto text-xs"
        onClick={() => setShowReplies(!showReplies)}
      >
        {showReplies ? (
          <>
            <ChevronUp className="h-3 w-3 mr-1" />
            Hide Replies ({repliesCount})
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3 mr-1" />
            Show Replies ({repliesCount})
          </>
        )}
      </Button>
      
      {showReplies && (
        <div className="mt-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex items-start space-x-2">
                  <div className="bg-muted rounded-full h-6 w-6"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-muted rounded w-1/4"></div>
                    <div className="h-2 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {replies.length > 0 ? (
                <div className="space-y-3 mb-3">
                  {replies.map((reply) => {
                    const timeAgo = formatTimeAgo(reply.created_at);
                    
                    const replyContent = (
                      <div key={reply.id} className="border rounded-md p-3 bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            {reply.author_username ? (
                              <Link to={`/profile/${reply.author_username}`}>
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={reply.author_profile_pic} alt={reply.author_name} />
                                  <AvatarFallback>{reply.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              </Link>
                            ) : (
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={reply.author_profile_pic} alt={reply.author_name} />
                                <AvatarFallback>{reply.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              {reply.author_username ? (
                                <Link to={`/profile/${reply.author_username}`} className="hover:underline">
                                  <span className="text-sm font-medium">{reply.author_name}</span>
                                </Link>
                              ) : (
                                <span className="text-sm font-medium">{reply.author_name}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {timeAgo}
                          </div>
                        </div>
                        
                        <div 
                          className="text-sm mt-2 prose prose-sm max-w-none" 
                          dangerouslySetInnerHTML={{ __html: reply.content }}
                        />
                        
                        <div className="mt-2">
                          <CommunityInteractionButtons 
                            itemId={reply.id}
                            itemType="reply"
                            initialLikes={reply.likes}
                            initialDislikes={reply.dislikes}
                          />
                        </div>
                      </div>
                    );
                    
                    return isAdmin ? (
                      <AdminContextMenu 
                        key={reply.id}
                        onEdit={() => openEditDialog(reply)}
                        onDelete={() => handleDeleteReply(reply.id)}
                        onBanUser={() => handleBanUser(reply.author_username)}
                      >
                        {replyContent}
                      </AdminContextMenu>
                    ) : replyContent;
                  })}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground my-2">
                  No replies yet. Be the first to reply!
                </div>
              )}
              
              <Separator className="my-3" />
              
              <ReplyForm 
                announcementId={announcementId}
                onSubmit={handleAddReply}
              />
            </>
          )}
        </div>
      )}
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Reply</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RichTextEditor 
              value={editContent}
              onChange={setEditContent}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditReply}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementReplies;
