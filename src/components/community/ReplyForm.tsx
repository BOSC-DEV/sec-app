
import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RichTextEditor from './RichTextEditor';

export interface ReplyFormProps {
  announcementId: string;
  onSubmit: (content: string) => Promise<void>;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ announcementId, onSubmit }) => {
  const { profile } = useProfile();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={profile?.profile_pic_url} alt={profile?.display_name || 'User'} />
          <AvatarFallback>{profile?.display_name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <RichTextEditor 
            value={content}
            onChange={setContent}
            placeholder="Write a reply..."
            minHeight="100px"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.trim() || isSubmitting}
          className="ml-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Reply'}
        </Button>
      </div>
    </form>
  );
};

export default ReplyForm;
