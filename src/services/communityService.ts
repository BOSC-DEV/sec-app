
import { supabase } from '@/integrations/supabase/client';
import { Announcement, ChatMessage } from '@/types/dataTypes';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';
import { sanitizeHtml } from '@/utils/securityUtils';

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

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement | null> => {
  try {
    // Sanitize content
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

// Chat Message Services
export const getChatMessages = async (): Promise<ChatMessage[]> => {
  try {
    // Get messages from the last 24 hours
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
    
    // Upload image if provided
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
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('community')
        .getPublicUrl(filePath);
        
      imageUrl = urlData.publicUrl;
    }
    
    // Sanitize content
    const sanitizedContent = sanitizeHtml(message.content);
    
    // Insert message
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

// Check if user is an admin
export const isUserAdmin = async (username: string): Promise<boolean> => {
  const ADMIN_USERNAMES = ['sec', 'thesec'];
  return ADMIN_USERNAMES.includes(username);
};
