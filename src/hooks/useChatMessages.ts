
import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';

const MESSAGES_PER_PAGE = 20;

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Fetch initial messages
  const fetchMessages = async (startIndex: number = 0) => {
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
        setMessages(prev => [...prev, ...newMessages.reverse()]);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async (messageData: {
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
      
      // Handle image upload if present
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

      // Insert new message
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageData.content,
          author_id: messageData.author_id,
          author_name: messageData.author_name,
          author_username: messageData.author_username,
          author_profile_pic: messageData.author_profile_pic,
          author_sec_balance: messageData.author_sec_balance,
          image_url: imageUrl
        });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      // We don't need to update local state as the subscription will handle it
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully'
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to send message');
      return false;
    }
  };

  const deleteChatMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      // Subscription will handle the state update
      toast({
        title: 'Message deleted',
        description: 'Message deleted successfully'
      });
      
      return true;
    } catch (error) {
      handleError(error, 'Failed to delete message');
      return false;
    }
  };

  // Set up real-time subscription for messages
  useEffect(() => {
    fetchMessages();

    // Subscribe to channel only if not already subscribed
    if (!isSubscribed) {
      const channel = supabase
        .channel('chat-updates')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        }, payload => {
          const newMessage = payload.new as ChatMessage;
          console.log('New message received:', newMessage);
          
          // Add the new message to the end of the list
          setMessages(prev => [...prev, newMessage]);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages'
        }, payload => {
          console.log('Message deleted:', payload.old);
          
          // Remove the deleted message from the list
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        })
        .subscribe();

      setIsSubscribed(true);
      console.log('Supabase realtime subscription set up');

      return () => {
        supabase.removeChannel(channel);
        setIsSubscribed(false);
      };
    }
  }, [isSubscribed]);

  // Function to load older messages when scrolling up
  const loadOlderMessages = () => {
    if (!hasMore || isLoading) return;
    fetchMessages(messages.length);
  };

  return {
    messages,
    isLoading,
    hasMore,
    loadOlderMessages,
    sendChatMessage,
    deleteChatMessage
  };
};
