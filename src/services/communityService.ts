
import { supabase } from '@/integrations/supabase/client';
import { 
  Announcement, 
  ChatMessage, 
  AnnouncementReply
} from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';
import { sanitizeHtml } from '@/utils/securityUtils';
import { notifyReaction } from '@/services/notificationService';
import { EntityType } from '@/types/dataTypes';

// Announcement Services
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleError(error, 'Error fetching announcements');
    return [];
  }
};

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'views'>): Promise<Announcement | null> => {
  try {
    const sanitizedContent = sanitizeHtml(announcement.content);
    
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        content: sanitizedContent,
        author_id: announcement.author_id,
        author_name: announcement.author_name,
        author_username: announcement.author_username,
        author_profile_pic: announcement.author_profile_pic,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, 'Error creating announcement');
    return null;
  }
};

export const incrementAnnouncementViews = async (announcementId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('increment_announcement_views', {
      p_announcement_id: announcementId
    });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return false;
  }
};

// Announcement Reply Services
export const getAnnouncementReplies = async (announcementId: string): Promise<AnnouncementReply[]> => {
  try {
    const { data, error } = await supabase
      .from('announcement_replies')
      .select('*')
      .eq('announcement_id', announcementId)
      .order('created_at', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data as AnnouncementReply[] || [];
  } catch (error) {
    handleError(error, 'Error fetching announcement replies');
    return [];
  }
};

export const addAnnouncementReply = async (reply: Omit<AnnouncementReply, 'id' | 'created_at'>): Promise<AnnouncementReply | null> => {
  try {
    const sanitizedContent = sanitizeHtml(reply.content);
    
    const { data, error } = await supabase
      .from('announcement_replies')
      .insert({
        announcement_id: reply.announcement_id,
        content: sanitizedContent,
        author_id: reply.author_id,
        author_name: reply.author_name,
        author_username: reply.author_username,
        author_profile_pic: reply.author_profile_pic,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as AnnouncementReply;
  } catch (error) {
    handleError(error, 'Error adding announcement reply');
    return null;
  }
};

// Chat Message Services
export const getChatMessages = async (): Promise<ChatMessage[]> => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .gte('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleError(error, 'Error fetching chat messages');
    return [];
  }
};

export const sendChatMessage = async (message: {
  content: string;
  author_id: string;
  author_name: string;
  author_username?: string;
  author_profile_pic?: string;
  image_file?: File | null;
}): Promise<ChatMessage | null> => {
  try {
    let imageUrl = null;
    
    if (message.image_file) {
      const timestamp = Date.now();
      const fileExt = message.image_file.name.split('.').pop();
      const filePath = `chat/${message.author_id}/${timestamp}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('community')
        .upload(filePath, message.image_file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('community')
        .getPublicUrl(filePath);
        
      imageUrl = urlData.publicUrl;
    }
    
    const sanitizedContent = sanitizeHtml(message.content);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        content: sanitizedContent,
        author_id: message.author_id,
        author_name: message.author_name,
        author_username: message.author_username || null,
        author_profile_pic: message.author_profile_pic || null,
        image_url: imageUrl,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, 'Error sending chat message');
    return null;
  }
};

// Like/Dislike Functions for Announcements
export const likeAnnouncement = async (announcementId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already liked or disliked the announcement
    const { data: existingInteractions, error: fetchError } = await supabase
      .from('user_scammer_interactions')  // Using existing interactions table
      .select('liked, disliked')
      .eq('scammer_id', announcementId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // If the user has already interacted with this announcement
    if (existingInteractions) {
      // If already liked, remove the like
      if (existingInteractions.liked) {
        const { error: updateError } = await supabase
          .from('user_scammer_interactions')
          .update({ liked: false, last_updated: new Date().toISOString() })
          .eq('scammer_id', announcementId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Decrement likes
        const { data: announcement, error: fetchAnnouncementError } = await supabase
          .from('announcements')
          .select('likes, dislikes')
          .eq('id', announcementId)
          .single();
          
        if (fetchAnnouncementError) {
          throw fetchAnnouncementError;
        }
        
        likes = Math.max(0, (announcement?.likes || 1) - 1);
        dislikes = announcement?.dislikes || 0;
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) {
          throw updateAnnouncementError;
        }
      }
      // If not liked, add like and remove dislike if it exists
      else {
        const updates: { liked: boolean; disliked: boolean; last_updated: string } = {
          liked: true,
          disliked: false,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_scammer_interactions')
          .update(updates)
          .eq('scammer_id', announcementId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get current likes/dislikes
        const { data: announcement, error: fetchAnnouncementError } = await supabase
          .from('announcements')
          .select('likes, dislikes')
          .eq('id', announcementId)
          .single();
          
        if (fetchAnnouncementError) {
          throw fetchAnnouncementError;
        }
        
        likes = (announcement?.likes || 0) + 1;
        dislikes = existingInteractions.disliked 
          ? Math.max(0, (announcement?.dislikes || 1) - 1) 
          : (announcement?.dislikes || 0);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ 
            likes,
            dislikes
          })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) {
          throw updateAnnouncementError;
        }
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('user_scammer_interactions')
        .insert({
          scammer_id: announcementId,
          user_id: userId,
          liked: true,
          disliked: false,
          last_updated: new Date().toISOString()
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment likes
      const { data: announcement, error: fetchAnnouncementError } = await supabase
        .from('announcements')
        .select('likes')
        .eq('id', announcementId)
        .single();
        
      if (fetchAnnouncementError) {
        throw fetchAnnouncementError;
      }
      
      likes = (announcement?.likes || 0) + 1;
      
      const { error: updateAnnouncementError } = await supabase
        .from('announcements')
        .update({ likes })
        .eq('id', announcementId);
        
      if (updateAnnouncementError) {
        throw updateAnnouncementError;
      }
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error liking announcement');
    return null;
  }
};

export const dislikeAnnouncement = async (announcementId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already liked or disliked the announcement
    const { data: existingInteractions, error: fetchError } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', announcementId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // If the user has already interacted with this announcement
    if (existingInteractions) {
      // If already disliked, remove the dislike
      if (existingInteractions.disliked) {
        const { error: updateError } = await supabase
          .from('user_scammer_interactions')
          .update({ disliked: false, last_updated: new Date().toISOString() })
          .eq('scammer_id', announcementId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Decrement dislikes
        const { data: announcement, error: fetchAnnouncementError } = await supabase
          .from('announcements')
          .select('likes, dislikes')
          .eq('id', announcementId)
          .single();
          
        if (fetchAnnouncementError) {
          throw fetchAnnouncementError;
        }
        
        dislikes = Math.max(0, (announcement?.dislikes || 1) - 1);
        likes = announcement?.likes || 0;
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) {
          throw updateAnnouncementError;
        }
      }
      // If not disliked, add dislike and remove like if it exists
      else {
        const updates: { liked: boolean; disliked: boolean; last_updated: string } = {
          liked: false,
          disliked: true,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_scammer_interactions')
          .update(updates)
          .eq('scammer_id', announcementId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get current likes/dislikes
        const { data: announcement, error: fetchAnnouncementError } = await supabase
          .from('announcements')
          .select('likes, dislikes')
          .eq('id', announcementId)
          .single();
          
        if (fetchAnnouncementError) {
          throw fetchAnnouncementError;
        }
        
        dislikes = (announcement?.dislikes || 0) + 1;
        likes = existingInteractions.liked 
          ? Math.max(0, (announcement?.likes || 1) - 1) 
          : (announcement?.likes || 0);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ 
            likes,
            dislikes
          })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) {
          throw updateAnnouncementError;
        }
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('user_scammer_interactions')
        .insert({
          scammer_id: announcementId,
          user_id: userId,
          liked: false,
          disliked: true,
          last_updated: new Date().toISOString()
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment dislikes
      const { data: announcement, error: fetchAnnouncementError } = await supabase
        .from('announcements')
        .select('dislikes')
        .eq('id', announcementId)
        .single();
        
      if (fetchAnnouncementError) {
        throw fetchAnnouncementError;
      }
      
      dislikes = (announcement?.dislikes || 0) + 1;
      
      const { error: updateAnnouncementError } = await supabase
        .from('announcements')
        .update({ dislikes })
        .eq('id', announcementId);
        
      if (updateAnnouncementError) {
        throw updateAnnouncementError;
      }
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error disliking announcement');
    return null;
  }
};

// Like/Dislike Functions for Replies
export const likeReply = async (replyId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already liked or disliked the reply
    const { data: existingInteractions, error: fetchError } = await supabase
      .from('user_comment_interactions')  // Using existing interactions table
      .select('liked, disliked')
      .eq('comment_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // If the user has already interacted with this reply
    if (existingInteractions) {
      // If already liked, remove the like
      if (existingInteractions.liked) {
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update({ liked: false, last_updated: new Date().toISOString() })
          .eq('comment_id', replyId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Decrement likes
        const { data: reply, error: fetchReplyError } = await supabase
          .from('announcement_replies')
          .select('likes, dislikes')
          .eq('id', replyId)
          .single();
          
        if (fetchReplyError) {
          throw fetchReplyError;
        }
        
        likes = Math.max(0, (reply?.likes || 1) - 1);
        dislikes = reply?.dislikes || 0;
        
        const { error: updateReplyError } = await supabase
          .from('announcement_replies')
          .update({ likes })
          .eq('id', replyId);
          
        if (updateReplyError) {
          throw updateReplyError;
        }
      }
      // If not liked, add like and remove dislike if it exists
      else {
        const updates: { liked: boolean; disliked: boolean; last_updated: string } = {
          liked: true,
          disliked: false,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update(updates)
          .eq('comment_id', replyId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get current likes/dislikes
        const { data: reply, error: fetchReplyError } = await supabase
          .from('announcement_replies')
          .select('likes, dislikes')
          .eq('id', replyId)
          .single();
          
        if (fetchReplyError) {
          throw fetchReplyError;
        }
        
        likes = (reply?.likes || 0) + 1;
        dislikes = existingInteractions.disliked 
          ? Math.max(0, (reply?.dislikes || 1) - 1) 
          : (reply?.dislikes || 0);
        
        const { error: updateReplyError } = await supabase
          .from('announcement_replies')
          .update({ 
            likes,
            dislikes
          })
          .eq('id', replyId);
          
        if (updateReplyError) {
          throw updateReplyError;
        }
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('user_comment_interactions')
        .insert({
          comment_id: replyId,
          user_id: userId,
          liked: true,
          disliked: false,
          last_updated: new Date().toISOString()
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment likes
      const { data: reply, error: fetchReplyError } = await supabase
        .from('announcement_replies')
        .select('likes')
        .eq('id', replyId)
        .single();
        
      if (fetchReplyError) {
        throw fetchReplyError;
      }
      
      likes = (reply?.likes || 0) + 1;
      
      const { error: updateReplyError } = await supabase
        .from('announcement_replies')
        .update({ likes })
        .eq('id', replyId);
        
      if (updateReplyError) {
        throw updateReplyError;
      }
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error liking reply');
    return null;
  }
};

export const dislikeReply = async (replyId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already liked or disliked the reply
    const { data: existingInteractions, error: fetchError } = await supabase
      .from('user_comment_interactions')
      .select('liked, disliked')
      .eq('comment_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // If the user has already interacted with this reply
    if (existingInteractions) {
      // If already disliked, remove the dislike
      if (existingInteractions.disliked) {
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update({ disliked: false, last_updated: new Date().toISOString() })
          .eq('comment_id', replyId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Decrement dislikes
        const { data: reply, error: fetchReplyError } = await supabase
          .from('announcement_replies')
          .select('likes, dislikes')
          .eq('id', replyId)
          .single();
          
        if (fetchReplyError) {
          throw fetchReplyError;
        }
        
        dislikes = Math.max(0, (reply?.dislikes || 1) - 1);
        likes = reply?.likes || 0;
        
        const { error: updateReplyError } = await supabase
          .from('announcement_replies')
          .update({ dislikes })
          .eq('id', replyId);
          
        if (updateReplyError) {
          throw updateReplyError;
        }
      }
      // If not disliked, add dislike and remove like if it exists
      else {
        const updates: { liked: boolean; disliked: boolean; last_updated: string } = {
          liked: false,
          disliked: true,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update(updates)
          .eq('comment_id', replyId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get current likes/dislikes
        const { data: reply, error: fetchReplyError } = await supabase
          .from('announcement_replies')
          .select('likes, dislikes')
          .eq('id', replyId)
          .single();
          
        if (fetchReplyError) {
          throw fetchReplyError;
        }
        
        dislikes = (reply?.dislikes || 0) + 1;
        likes = existingInteractions.liked 
          ? Math.max(0, (reply?.likes || 1) - 1) 
          : (reply?.likes || 0);
        
        const { error: updateReplyError } = await supabase
          .from('announcement_replies')
          .update({ 
            likes,
            dislikes
          })
          .eq('id', replyId);
          
        if (updateReplyError) {
          throw updateReplyError;
        }
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('user_comment_interactions')
        .insert({
          comment_id: replyId,
          user_id: userId,
          liked: false,
          disliked: true,
          last_updated: new Date().toISOString()
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment dislikes
      const { data: reply, error: fetchReplyError } = await supabase
        .from('announcement_replies')
        .select('dislikes')
        .eq('id', replyId)
        .single();
        
      if (fetchReplyError) {
        throw fetchReplyError;
      }
      
      dislikes = (reply?.dislikes || 0) + 1;
      
      const { error: updateReplyError } = await supabase
        .from('announcement_replies')
        .update({ dislikes })
        .eq('id', replyId);
        
      if (updateReplyError) {
        throw updateReplyError;
      }
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error disliking reply');
    return null;
  }
};

// Like/Dislike Functions for Chat Messages
export const likeChatMessage = async (messageId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already liked or disliked the message
    const { data: existingInteractions, error: fetchError } = await supabase
      .from('user_comment_interactions')  // Using existing interactions table for simplicity
      .select('liked, disliked')
      .eq('comment_id', messageId)  // Using comment_id column for the message id
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // If the user has already interacted with this message
    if (existingInteractions) {
      // If already liked, remove the like
      if (existingInteractions.liked) {
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update({ liked: false, last_updated: new Date().toISOString() })
          .eq('comment_id', messageId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Decrement likes
        const { data: message, error: fetchMessageError } = await supabase
          .from('chat_messages')
          .select('likes, dislikes')
          .eq('id', messageId)
          .single();
          
        if (fetchMessageError) {
          throw fetchMessageError;
        }
        
        likes = Math.max(0, (message?.likes || 1) - 1);
        dislikes = message?.dislikes || 0;
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes })
          .eq('id', messageId);
          
        if (updateMessageError) {
          throw updateMessageError;
        }
      }
      // If not liked, add like and remove dislike if it exists
      else {
        const updates: { liked: boolean; disliked: boolean; last_updated: string } = {
          liked: true,
          disliked: false,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update(updates)
          .eq('comment_id', messageId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get current likes/dislikes
        const { data: message, error: fetchMessageError } = await supabase
          .from('chat_messages')
          .select('likes, dislikes')
          .eq('id', messageId)
          .single();
          
        if (fetchMessageError) {
          throw fetchMessageError;
        }
        
        likes = (message?.likes || 0) + 1;
        dislikes = existingInteractions.disliked 
          ? Math.max(0, (message?.dislikes || 1) - 1) 
          : (message?.dislikes || 0);
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ 
            likes,
            dislikes
          })
          .eq('id', messageId);
          
        if (updateMessageError) {
          throw updateMessageError;
        }
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('user_comment_interactions')
        .insert({
          comment_id: messageId,
          user_id: userId,
          liked: true,
          disliked: false,
          last_updated: new Date().toISOString()
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment likes
      const { data: message, error: fetchMessageError } = await supabase
        .from('chat_messages')
        .select('likes')
        .eq('id', messageId)
        .single();
        
      if (fetchMessageError) {
        throw fetchMessageError;
      }
      
      likes = (message?.likes || 0) + 1;
      
      const { error: updateMessageError } = await supabase
        .from('chat_messages')
        .update({ likes })
        .eq('id', messageId);
          
      if (updateMessageError) {
        throw updateMessageError;
      }
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error liking chat message');
    return null;
  }
};

export const dislikeChatMessage = async (messageId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already liked or disliked the message
    const { data: existingInteractions, error: fetchError } = await supabase
      .from('user_comment_interactions')
      .select('liked, disliked')
      .eq('comment_id', messageId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // If the user has already interacted with this message
    if (existingInteractions) {
      // If already disliked, remove the dislike
      if (existingInteractions.disliked) {
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update({ disliked: false, last_updated: new Date().toISOString() })
          .eq('comment_id', messageId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Decrement dislikes
        const { data: message, error: fetchMessageError } = await supabase
          .from('chat_messages')
          .select('likes, dislikes')
          .eq('id', messageId)
          .single();
          
        if (fetchMessageError) {
          throw fetchMessageError;
        }
        
        dislikes = Math.max(0, (message?.dislikes || 1) - 1);
        likes = message?.likes || 0;
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) {
          throw updateMessageError;
        }
      }
      // If not disliked, add dislike and remove like if it exists
      else {
        const updates: { liked: boolean; disliked: boolean; last_updated: string } = {
          liked: false,
          disliked: true,
          last_updated: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_comment_interactions')
          .update(updates)
          .eq('comment_id', messageId)
          .eq('user_id', userId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get current likes/dislikes
        const { data: message, error: fetchMessageError } = await supabase
          .from('chat_messages')
          .select('likes, dislikes')
          .eq('id', messageId)
          .single();
          
        if (fetchMessageError) {
          throw fetchMessageError;
        }
        
        dislikes = (message?.dislikes || 0) + 1;
        likes = existingInteractions.liked 
          ? Math.max(0, (message?.likes || 1) - 1) 
          : (message?.likes || 0);
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ 
            likes,
            dislikes
          })
          .eq('id', messageId);
          
        if (updateMessageError) {
          throw updateMessageError;
        }
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('user_comment_interactions')
        .insert({
          comment_id: messageId,
          user_id: userId,
          liked: false,
          disliked: true,
          last_updated: new Date().toISOString()
        });
        
      if (insertError) {
        throw insertError;
      }
      
      // Increment dislikes
      const { data: message, error: fetchMessageError } = await supabase
        .from('chat_messages')
        .select('dislikes')
        .eq('id', messageId)
        .single();
        
      if (fetchMessageError) {
        throw fetchMessageError;
      }
      
      dislikes = (message?.dislikes || 0) + 1;
      
      const { error: updateMessageError } = await supabase
        .from('chat_messages')
        .update({ dislikes })
        .eq('id', messageId);
          
      if (updateMessageError) {
        throw updateMessageError;
      }
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error disliking chat message');
    return null;
  }
};

// Check if user has liked or disliked an announcement
export const getUserAnnouncementInteraction = async (announcementId: string, userId: string): Promise<{liked: boolean, disliked: boolean}> => {
  try {
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', announcementId)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return { liked: false, disliked: false };
      }
      throw error;
    }
    
    return { 
      liked: data.liked || false, 
      disliked: data.disliked || false 
    };
  } catch (error) {
    console.error('Error getting user announcement interaction:', error);
    return { liked: false, disliked: false };
  }
};

// Check if user has liked or disliked a reply
export const getUserReplyInteraction = async (replyId: string, userId: string): Promise<{liked: boolean, disliked: boolean}> => {
  try {
    const { data, error } = await supabase
      .from('user_comment_interactions')
      .select('liked, disliked')
      .eq('comment_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return { liked: false, disliked: false };
      }
      throw error;
    }
    
    return { 
      liked: data.liked || false, 
      disliked: data.disliked || false 
    };
  } catch (error) {
    console.error('Error getting user reply interaction:', error);
    return { liked: false, disliked: false };
  }
};

// Check if user has liked or disliked a chat message
export const getUserChatMessageInteraction = async (messageId: string, userId: string): Promise<{liked: boolean, disliked: boolean}> => {
  try {
    const { data, error } = await supabase
      .from('user_comment_interactions')
      .select('liked, disliked')
      .eq('comment_id', messageId)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return { liked: false, disliked: false };
      }
      throw error;
    }
    
    return { 
      liked: data.liked || false, 
      disliked: data.disliked || false 
    };
  } catch (error) {
    console.error('Error getting user chat message interaction:', error);
    return { liked: false, disliked: false };
  }
};

// Admin Management Functions
export const deleteAnnouncement = async (announcementId: string): Promise<boolean> => {
  try {
    const { error: repliesError } = await supabase
      .from('announcement_replies')
      .delete()
      .eq('announcement_id', announcementId);
      
    if (repliesError) {
      throw repliesError;
    }
    
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    handleError(error, 'Error deleting announcement');
    return false;
  }
};

export const editAnnouncement = async (
  announcementId: string,
  content: string
): Promise<Announcement | null> => {
  try {
    const sanitizedContent = sanitizeHtml(content);
    
    const { data, error } = await supabase
      .from('announcements')
      .update({ content: sanitizedContent })
      .eq('id', announcementId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, 'Error updating announcement');
    return null;
  }
};

export const deleteAnnouncementReply = async (replyId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcement_replies')
      .delete()
      .eq('id', replyId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    handleError(error, 'Error deleting reply');
    return false;
  }
};

export const editAnnouncementReply = async (
  replyId: string,
  content: string
): Promise<AnnouncementReply | null> => {
  try {
    const sanitizedContent = sanitizeHtml(content);
    
    const { data, error } = await supabase
      .from('announcement_replies')
      .update({ content: sanitizedContent })
      .eq('id', replyId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, 'Error updating reply');
    return null;
  }
};

export const deleteChatMessage = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    handleError(error, 'Error deleting chat message');
    return false;
  }
};

export const isUserAdmin = async (username: string): Promise<boolean> => {
  const ADMIN_USERNAMES = ['sec', 'thesec'];
  return ADMIN_USERNAMES.includes(username);
};
