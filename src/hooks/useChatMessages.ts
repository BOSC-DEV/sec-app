
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';

const MESSAGES_PER_PAGE = 50;

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = useCallback(async (startIndex: number = 0) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + MESSAGES_PER_PAGE - 1);

      if (error) throw error;

      const newMessages = data as ChatMessage[];
      setHasMore(newMessages.length === MESSAGES_PER_PAGE);
      
      if (startIndex === 0) {
        setMessages(newMessages.reverse());
      } else {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendChatMessage = useCallback(async (messageData: {
    content: string;
    author_id: string;
    author_name: string;
    author_username?: string;
    author_profile_pic?: string;
    author_sec_balance?: number;
    image_file?: File | null;
  }) => {
    try {
      let imageUrl = null;
      
      // If there's an image file, upload it first
      if (messageData.image_file) {
        const fileExt = messageData.image_file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `chat-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community')
          .upload(filePath, messageData.image_file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('community')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Now insert the chat message with the image URL if available
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageData.content,
          author_id: messageData.author_id,
          author_name: messageData.author_name,
          author_username: messageData.author_username,
          author_profile_pic: messageData.author_profile_pic,
          author_sec_balance: messageData.author_sec_balance,
          image_url: imageUrl,
          likes: 0,
          dislikes: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as ChatMessage;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }, []);

  const deleteChatMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting chat message:', error);
      return false;
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    fetchMessages(messages.length);
  }, [fetchMessages, hasMore, isLoading, messages.length]);

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, payload => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    hasMore,
    loadMore,
    sendChatMessage,
    deleteChatMessage
  };
};
