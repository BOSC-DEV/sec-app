
import React, { useState, useEffect } from 'react';
import { 
  getAnnouncementReplies,
  deleteAnnouncementReply,
  editAnnouncementReply
} from '@/services/communityService';
import { AnnouncementReply } from '@/types/dataTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  MessageSquareReply, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReactionButton from './ReactionButton';
import ReplyForm from './ReplyForm';
import BadgeTier from '@/components/profile/BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import AdminContextMenu from './AdminContextMenu';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import RichTextEditor from './RichTextEditor';

interface AnnouncementRepliesProps {
  announcementId: string;
  isAdmin?: boolean;
}

const AnnouncementReplies: React.FC<AnnouncementRepliesProps> = ({ 
  announcementId,
  isAdmin = false
}) => {
  const [replies, setReplies] = useState<AnnouncementReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  
  const fetchReplies = async () => {
    setIsLoading(true);
    try {
      const data = await getAnnouncementReplies(announcementId);
      setReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReplies();
  }, [announcementId]);
  
  useEffect(() => {
    const channelName = `announcement-replies-${announcementId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'announcement_replies',
          filter: `announcement_id=eq.${announcementId}`
        }, 
        () => {
          fetchReplies();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [announcementId]);
  
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
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
        fetchReplies();
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
        fetchReplies();
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
  
  const getUserBadge = (address: string) => {
    const mockBalanceBase = 100000;
    
    if (address === '5.8%' || address.includes('58') || address.includes('15')) {
      return calculateBadgeTier(15800000);
    } 
    
    const hash = address.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const mockBalance = mockBalanceBase * (hash % 200);
    return calculateBadgeTier(mockBalance);
  };
  
  if (replies.length === 0 && !showReplyForm) {
    return (
      <div className="mt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1" 
          onClick={toggleReplyForm}
        >
          <MessageSquareReply className="h-3.5 w-3.5" />
          Reply
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-3">
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className="border-t pt-3 mt-3"
      >
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1" 
            onClick={toggleReplyForm}
          >
            <MessageSquareReply className="h-3.5 w-3.5" />
            Reply
          </Button>
          
          {replies.length > 0 && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs flex items-center">
                {isOpen ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 mr-1" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 mr-1" />
                    Show Replies ({replies.length})
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
        
        {showReplyForm && (
          <div className="mt-3">
            <ReplyForm 
              announcementId={announcementId} 
              onReplySubmitted={() => {
                fetchReplies();
                setIsOpen(true);
                setShowReplyForm(false);
              }}
            />
          </div>
        )}
        
        <CollapsibleContent className="mt-3 space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="rounded-full bg-muted h-8 w-8"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            replies.map((reply) => {
              const userBadge = reply.author_id ? getUserBadge(reply.author_id) : null;
              
              const replyContent = (
                <div key={reply.id} className="py-3 border-t first:border-t-0">
                  <div className="flex items-start gap-3">
                    {reply.author_username ? (
                      <Link to={`/profile/${reply.author_username}`}>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                          <AvatarImage src={reply.author_profile_pic} alt={reply.author_name} />
                          <AvatarFallback>{reply.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Link>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.author_profile_pic} alt={reply.author_name} />
                        <AvatarFallback>{reply.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {reply.author_username ? (
                          <Link to={`/profile/${reply.author_username}`} className="font-medium hover:underline">
                            {reply.author_name}
                          </Link>
                        ) : (
                          <span className="font-medium">{reply.author_name}</span>
                        )}
                        
                        {userBadge && (
                          <BadgeTier badgeInfo={userBadge} size="sm" showTooltip={true} />
                        )}
                        
                        {reply.author_username && (
                          <Link to={`/profile/${reply.author_username}`} className="text-icc-gold text-sm hover:underline">
                            @{reply.author_username}
                          </Link>
                        )}
                        
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }} />
                      
                      <div className="mt-2">
                        <ReactionButton 
                          itemId={reply.id} 
                          itemType="reply" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
              
              return isAdmin ? (
                <AdminContextMenu 
                  key={reply.id}
                  onEdit={() => openEditDialog(reply)}
                  onDelete={() => handleDeleteReply(reply.id)}
                >
                  {replyContent}
                </AdminContextMenu>
              ) : replyContent;
            })
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Edit Reply Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
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
