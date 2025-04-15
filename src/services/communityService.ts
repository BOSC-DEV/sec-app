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
import { isAdmin } from '@/utils/adminUtils';

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
    // First, check if the user has already reacted to this announcement
    const { data: existingReaction, error: reactionError } = await supabase
      .from('announcement_reactions')
      .select('id, reaction_type')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (reactionError && reactionError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw reactionError;
    }
    
    // For backward compatibility, also check if there's any record in the older table
    const { data: oldInteraction, error: oldInteractionError } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (oldInteractionError && oldInteractionError.code !== 'PGRST116') {
      throw oldInteractionError;
    }
    
    // Get current likes/dislikes count from announcements table
    const { data: announcement, error: fetchAnnouncementError } = await supabase
      .from('announcements')
      .select('likes, dislikes')
      .eq('id', announcementId)
      .single();
      
    if (fetchAnnouncementError) {
      throw fetchAnnouncementError;
    }
    
    let likes = announcement?.likes || 0;
    let dislikes = announcement?.dislikes || 0;
    
    // If user has an existing reaction in the new format
    if (existingReaction) {
      // If already liked, remove the like
      if (existingReaction.reaction_type === 'like') {
        const { error: deleteError } = await supabase
          .from('announcement_reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement likes in announcements table
        likes = Math.max(0, likes - 1);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      } 
      // If has another reaction type (dislike), change to like
      else if (existingReaction.reaction_type === 'dislike') {
        const { error: updateError } = await supabase
          .from('announcement_reactions')
          .update({ reaction_type: 'like' })
          .eq('id', existingReaction.id);
          
        if (updateError) throw updateError;
        
        // Increment likes, decrement dislikes
        likes = likes + 1;
        dislikes = Math.max(0, dislikes - 1);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes, dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      }
    }
    // If user has an interaction in the old format
    else if (oldInteraction) {
      // Clean up the old interaction record
      const { error: deleteOldError } = await supabase
        .from('user_scammer_interactions')
        .delete()
        .eq('scammer_id', announcementId)
        .eq('user_id', userId);
        
      if (deleteOldError) throw deleteOldError;
      
      // If not already liked in the old format, add a new like
      if (!oldInteraction.liked) {
        // Insert new reaction
        const { error: insertError } = await supabase
          .from('announcement_reactions')
          .insert({
            announcement_id: announcementId,
            user_id: userId,
            reaction_type: 'like'
          });
          
        if (insertError) throw insertError;
        
        // Update counts in announcements table
        likes = likes + 1;
        
        if (oldInteraction.disliked) {
          dislikes = Math.max(0, dislikes - 1);
        }
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes, dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      } else {
        // If was liked in old format, just update the counts to reflect removal
        likes = Math.max(0, likes - 1);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      }
    }
    // If no existing reaction at all
    else {
      // Insert new reaction
      const { error: insertError } = await supabase
        .from('announcement_reactions')
        .insert({
          announcement_id: announcementId,
          user_id: userId,
          reaction_type: 'like'
        });
        
      if (insertError) throw insertError;
      
      // Increment likes
      likes = likes + 1;
      
      const { error: updateAnnouncementError } = await supabase
        .from('announcements')
        .update({ likes })
        .eq('id', announcementId);
        
      if (updateAnnouncementError) throw updateAnnouncementError;
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error liking announcement');
    return null;
  }
};

export const dislikeAnnouncement = async (announcementId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already reacted to this announcement
    const { data: existingReaction, error: reactionError } = await supabase
      .from('announcement_reactions')
      .select('id, reaction_type')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (reactionError && reactionError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw reactionError;
    }
    
    // For backward compatibility, also check if there's any record in the older table
    const { data: oldInteraction, error: oldInteractionError } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (oldInteractionError && oldInteractionError.code !== 'PGRST116') {
      throw oldInteractionError;
    }
    
    // Get current likes/dislikes count from announcements table
    const { data: announcement, error: fetchAnnouncementError } = await supabase
      .from('announcements')
      .select('likes, dislikes')
      .eq('id', announcementId)
      .single();
      
    if (fetchAnnouncementError) {
      throw fetchAnnouncementError;
    }
    
    let likes = announcement?.likes || 0;
    let dislikes = announcement?.dislikes || 0;
    
    // If user has an existing reaction in the new format
    if (existingReaction) {
      // If already disliked, remove the dislike
      if (existingReaction.reaction_type === 'dislike') {
        const { error: deleteError } = await supabase
          .from('announcement_reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement dislikes in announcements table
        dislikes = Math.max(0, dislikes - 1);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      } 
      // If has another reaction type (like), change to dislike
      else if (existingReaction.reaction_type === 'like') {
        const { error: updateError } = await supabase
          .from('announcement_reactions')
          .update({ reaction_type: 'dislike' })
          .eq('id', existingReaction.id);
          
        if (updateError) throw updateError;
        
        // Increment dislikes, decrement likes
        dislikes = dislikes + 1;
        likes = Math.max(0, likes - 1);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes, dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      }
    }
    // If user has an interaction in the old format
    else if (oldInteraction) {
      // Clean up the old interaction record
      const { error: deleteOldError } = await supabase
        .from('user_scammer_interactions')
        .delete()
        .eq('scammer_id', announcementId)
        .eq('user_id', userId);
        
      if (deleteOldError) throw deleteOldError;
      
      // If not already disliked in the old format, add a new dislike
      if (!oldInteraction.disliked) {
        // Insert new reaction
        const { error: insertError } = await supabase
          .from('announcement_reactions')
          .insert({
            announcement_id: announcementId,
            user_id: userId,
            reaction_type: 'dislike'
          });
          
        if (insertError) throw insertError;
        
        // Update counts in announcements table
        dislikes = dislikes + 1;
        
        if (oldInteraction.liked) {
          likes = Math.max(0, likes - 1);
        }
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ likes, dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      } else {
        // If was disliked in old format, just update the counts to reflect removal
        dislikes = Math.max(0, dislikes - 1);
        
        const { error: updateAnnouncementError } = await supabase
          .from('announcements')
          .update({ dislikes })
          .eq('id', announcementId);
          
        if (updateAnnouncementError) throw updateAnnouncementError;
      }
    }
    // If no existing reaction at all
    else {
      // Insert new reaction
      const { error: insertError } = await supabase
        .from('announcement_reactions')
        .insert({
          announcement_id: announcementId,
          user_id: userId,
          reaction_type: 'dislike'
        });
        
      if (insertError) throw insertError;
      
      // Increment dislikes
      dislikes = dislikes + 1;
      
      const { error: updateAnnouncementError } = await supabase
        .from('announcements')
        .update({ dislikes })
        .eq('id', announcementId);
        
      if (updateAnnouncementError) throw updateAnnouncementError;
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
    // First, check if the user has already interacted with this message by checking chat_message_reactions
    const { data: existingReaction, error: reactionError } = await supabase
      .from('chat_message_reactions')
      .select('id, reaction_type')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (reactionError && reactionError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw reactionError;
    }
    
    // Also check older user_comment_interactions for backward compatibility
    const { data: existingInteractions, error: interactionError } = await supabase
      .from('user_comment_interactions')
      .select('liked, disliked')
      .eq('comment_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (interactionError && interactionError.code !== 'PGRST116') {
      throw interactionError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // Get current likes/dislikes
    const { data: message, error: fetchMessageError } = await supabase
      .from('chat_messages')
      .select('likes, dislikes')
      .eq('id', messageId)
      .single();
      
    if (fetchMessageError) {
      throw fetchMessageError;
    }
    
    // If user has an existing reaction in chat_message_reactions
    if (existingReaction) {
      // If already liked, remove the like
      if (existingReaction.reaction_type === 'like') {
        const { error: deleteError } = await supabase
          .from('chat_message_reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement likes
        likes = Math.max(0, (message?.likes || 1) - 1);
        dislikes = message?.dislikes || 0;
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      } 
      // If has another reaction, change to like
      else {
        const { error: updateError } = await supabase
          .from('chat_message_reactions')
          .update({ reaction_type: 'like' })
          .eq('id', existingReaction.id);
          
        if (updateError) throw updateError;
        
        // Increment likes, decrement other reactions if needed
        likes = (message?.likes || 0) + 1;
        dislikes = existingReaction.reaction_type === 'dislike' 
          ? Math.max(0, (message?.dislikes || 1) - 1) 
          : (message?.dislikes || 0);
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes, dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      }
    }
    // If user has older interaction in user_comment_interactions
    else if (existingInteractions) {
      // Clean up legacy data structure - remove the old interaction
      const { error: deleteError } = await supabase
        .from('user_comment_interactions')
        .delete()
        .eq('comment_id', messageId)
        .eq('user_id', userId);
        
      if (deleteError) throw deleteError;
      
      // Then add a new reaction unless removing a like
      if (!existingInteractions.liked) {
        const { error: insertError } = await supabase
          .from('chat_message_reactions')
          .insert({
            reaction_type: 'like',
            user_id: userId,
            message_id: messageId
          });
          
        if (insertError) throw insertError;
        
        // Update counts
        likes = (message?.likes || 0) + 1;
        dislikes = existingInteractions.disliked 
          ? Math.max(0, (message?.dislikes || 1) - 1) 
          : (message?.dislikes || 0);
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes, dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      } else {
        // Just removing a like
        likes = Math.max(0, (message?.likes || 1) - 1);
        dislikes = message?.dislikes || 0;
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('chat_message_reactions')
        .insert({
          reaction_type: 'like',
          user_id: userId,
          message_id: messageId
        });
        
      if (insertError) throw insertError;
      
      // Increment likes
      likes = (message?.likes || 0) + 1;
      dislikes = message?.dislikes || 0;
      
      const { error: updateMessageError } = await supabase
        .from('chat_messages')
        .update({ likes })
        .eq('id', messageId);
          
      if (updateMessageError) throw updateMessageError;
    }
    
    return { likes, dislikes };
  } catch (error) {
    handleError(error, 'Error liking chat message');
    return null;
  }
};

export const dislikeChatMessage = async (messageId: string, userId: string): Promise<{likes: number, dislikes: number} | null> => {
  try {
    // First, check if the user has already interacted with this message by checking chat_message_reactions
    const { data: existingReaction, error: reactionError } = await supabase
      .from('chat_message_reactions')
      .select('id, reaction_type')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (reactionError && reactionError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw reactionError;
    }
    
    // Also check older user_comment_interactions for backward compatibility
    const { data: existingInteractions, error: interactionError } = await supabase
      .from('user_comment_interactions')
      .select('liked, disliked')
      .eq('comment_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (interactionError && interactionError.code !== 'PGRST116') {
      throw interactionError;
    }
    
    let likes = 0;
    let dislikes = 0;
    
    // Get current likes/dislikes
    const { data: message, error: fetchMessageError } = await supabase
      .from('chat_messages')
      .select('likes, dislikes')
      .eq('id', messageId)
      .single();
      
    if (fetchMessageError) {
      throw fetchMessageError;
    }
    
    // If user has an existing reaction in chat_message_reactions
    if (existingReaction) {
      // If already disliked, remove the dislike
      if (existingReaction.reaction_type === 'dislike') {
        const { error: deleteError } = await supabase
          .from('chat_message_reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement dislikes
        dislikes = Math.max(0, (message?.dislikes || 1) - 1);
        likes = message?.likes || 0;
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      } 
      // If has another reaction, change to dislike
      else {
        const { error: updateError } = await supabase
          .from('chat_message_reactions')
          .update({ reaction_type: 'dislike' })
          .eq('id', existingReaction.id);
          
        if (updateError) throw updateError;
        
        // Increment dislikes, decrement other reactions if needed
        dislikes = (message?.dislikes || 0) + 1;
        likes = existingReaction.reaction_type === 'like' 
          ? Math.max(0, (message?.likes || 1) - 1) 
          : (message?.likes || 0);
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes, dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      }
    }
    // If user has older interaction in user_comment_interactions
    else if (existingInteractions) {
      // Clean up legacy data structure - remove the old interaction
      const { error: deleteError } = await supabase
        .from('user_comment_interactions')
        .delete()
        .eq('comment_id', messageId)
        .eq('user_id', userId);
        
      if (deleteError) throw deleteError;
      
      // Then add a new reaction unless removing a dislike
      if (!existingInteractions.disliked) {
        const { error: insertError } = await supabase
          .from('chat_message_reactions')
          .insert({
            reaction_type: 'dislike',
            user_id: userId,
            message_id: messageId
          });
          
        if (insertError) throw insertError;
        
        // Update counts
        dislikes = (message?.dislikes || 0) + 1;
        likes = existingInteractions.liked 
          ? Math.max(0, (message?.likes || 1) - 1) 
          : (message?.likes || 0);
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ likes, dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      } else {
        // Just removing a dislike
        dislikes = Math.max(0, (message?.dislikes || 1) - 1);
        likes = message?.likes || 0;
        
        const { error: updateMessageError } = await supabase
          .from('chat_messages')
          .update({ dislikes })
          .eq('id', messageId);
          
        if (updateMessageError) throw updateMessageError;
      }
    }
    // If this is the first interaction
    else {
      const { error: insertError } = await supabase
        .from('chat_message_reactions')
        .insert({
          reaction_type: 'dislike',
          user_id: userId,
          message_id: messageId
        });
        
      if (insertError) throw insertError;
      
      // Increment dislikes
      dislikes = (message?.dislikes || 0) + 1;
      likes = message?.likes || 0;
      
      const { error: updateMessageError } = await supabase
        .from('chat_messages')
        .update({ dislikes })
        .eq('id', messageId);
          
      if (updateMessageError) throw updateMessageError;
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
    // First check in the new announcement_reactions table
    const { data: reaction, error: reactionError } = await supabase
      .from('announcement_reactions')
      .select('reaction_type')
      .eq('announcement_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (reactionError && reactionError.code !== 'PGRST116') {
      throw reactionError;
    }
    
    // If found in new table, return based on reaction type
    if (reaction) {
      return { 
        liked: reaction.reaction_type === 'like', 
        disliked: reaction.reaction_type === 'dislike' 
      };
    }
    
    // If not in new table, check legacy table for backward compatibility
    const { data, error } = await supabase
      .from('user_scammer_interactions')
      .select('liked, disliked')
      .eq('scammer_id', announcementId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return { liked: false, disliked: false };
      }
      throw error;
    }
    
    return { 
      liked: data?.liked || false, 
      disliked: data?.disliked || false 
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
    // First check in the new chat_message_reactions table
    const { data: reaction, error: reactionError } = await supabase
      .from('chat_message_reactions')
      .select('reaction_type')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (reactionError && reactionError.code !== 'PGRST116') {
      throw reactionError;
    }
    
    // If found in new table, return based on reaction type
    if (reaction) {
      return { 
        liked: reaction.reaction_type === 'like', 
        disliked: reaction.reaction_type === 'dislike' 
      };
    }
    
    // If not in new table, check legacy table for backward compatibility
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
  return isAdmin(username);
};

// Survey Functions
export const createSurveyAnnouncement = async (
  title: string,
  options: string[],
  authorInfo: {
    author_id: string;
    author_name: string;
    author_username?: string;
    author_profile_pic?: string;
  }
): Promise<Announcement | null> => {
  try {
    // Create survey data structure
    const surveyData = {
      title: title,
      options: options.map(opt => ({
        text: opt,
        votes: 0,
        voters: []
      }))
    };

    // Create announcement with survey_data
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        content: `<div class="text-center"><strong>SURVEY:</strong> ${title}</div>`,
        author_id: authorInfo.author_id,
        author_name: authorInfo.author_name,
        author_username: authorInfo.author_username,
        author_profile_pic: authorInfo.author_profile_pic,
        survey_data: surveyData
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleError(error, 'Error creating survey announcement');
    return null;
  }
};

export const voteSurvey = async (
  announcementId: string,
  optionIndex: number,
  userId: string,
  badgeTier: string
): Promise<boolean> => {
  try {
    // First get the current announcement with survey data
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (!announcement?.survey_data) {
      throw new Error('No survey data found in announcement');
    }
    
    const surveyData = announcement.survey_data;
    
    // Check if user has already voted
    const hasVoted = surveyData.options.some(option => 
      option.voters.some(voter => voter.userId === userId)
    );
    
    if (hasVoted) {
      // Remove the previous vote if exists
      for (const option of surveyData.options) {
        option.votes = option.voters.filter(voter => voter.userId === userId).length > 0 
          ? option.votes - 1 
          : option.votes;
        option.voters = option.voters.filter(voter => voter.userId !== userId);
      }
    }
    
    // Add the new vote
    if (optionIndex >= 0 && optionIndex < surveyData.options.length) {
      surveyData.options[optionIndex].votes += 1;
      surveyData.options[optionIndex].voters.push({
        userId,
        badgeTier
      });
    } else {
      throw new Error('Invalid option index');
    }
    
    // Update the survey data in the database
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        survey_data: surveyData
      })
      .eq('id', announcementId);
      
    if (updateError) {
      throw updateError;
    }
    
    return true;
  } catch (error) {
    handleError(error, 'Error voting in survey');
    return false;
  }
};

export const getUserSurveyVote = async (
  announcementId: string,
  userId: string
): Promise<number | undefined> => {
  try {
    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('survey_data')
      .eq('id', announcementId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!announcement?.survey_data) {
      return undefined;
    }
    
    // Find which option the user voted for
    for (let i = 0; i < announcement.survey_data.options.length; i++) {
      const option = announcement.survey_data.options[i];
      if (option.voters.some(voter => voter.userId === userId)) {
        return i;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting user survey vote:', error);
    return undefined;
  }
};
