
import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { addAnnouncementReply } from '@/services/communityService';
import RichTextEditor from './RichTextEditor';

interface ReplyFormProps {
  announcementId?: string;
  onSubmit: (content: string) => Promise<void>;
  onReplySubmitted?: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ 
  announcementId, 
  onSubmit, 
  onReplySubmitted 
}) => {
  const { profile, isConnected } = useProfile();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !profile) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet to reply",
        variant: "default",
      });
      return;
    }
    
    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(replyContent);
      
      setReplyContent('');
      if (onReplySubmitted) {
        onReplySubmitted();
      }
      
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <RichTextEditor 
        value={replyContent}
        onChange={setReplyContent}
      />
      <div className="mt-3 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !replyContent.trim()}
          size="sm"
        >
          {isSubmitting ? "Posting..." : "Post Reply"}
        </Button>
      </div>
    </form>
  );
};

export default ReplyForm;
