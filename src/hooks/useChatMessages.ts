
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/dataTypes';
import { supabase, safeInsert } from '@/integrations/supabase/client';
import { sanitizeHtml, sanitizeInput, detectMaliciousPattern, sanitizeFormData } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

const MESSAGES_PER_PAGE = 50;

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (startIndex: number = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + MESSAGES_PER_PAGE - 1);

      if (error) throw error;

      const newMessages = data as ChatMessage[];
      setHasMore(newMessages.length === MESSAGES_PER_PAGE);
      
      // Sanitize message content before setting
      const sanitizedMessages = newMessages.map(msg => ({
        ...msg,
        content: sanitizeHtml(msg.content)
      }));
      
      if (startIndex === 0) {
        setMessages(sanitizedMessages.reverse());
      } else {
        setMessages(prev => [...sanitizedMessages.reverse(), ...prev]);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setError('Failed to load messages. Please try again later.');
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
      // Security checks
      if (detectMaliciousPattern(messageData.content)) {
        toast({
          title: "Security Warning",
          description: "Potentially malicious content detected. Message not sent.",
          variant: "destructive"
        });
        return null;
      }
      
      // Sanitize all input data
      const sanitizedData = sanitizeFormData({
        content: messageData.content,
        author_id: messageData.author_id,
        author_name: messageData.author_name,
        author_username: messageData.author_username,
        author_profile_pic: messageData.author_profile_pic,
        author_sec_balance: messageData.author_sec_balance
      });
      
      let imageUrl = null;
      
      // If there's an image file, upload it first
      if (messageData.image_file) {
        // Validate file size and type
        if (messageData.image_file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: "Error",
            description: "Image file is too large. Maximum size is 5MB.",
            variant: "destructive"
          });
          return null;
        }
        
        if (!messageData.image_file.type.startsWith('image/')) {
          toast({
            title: "Error",
            description: "Only image files are allowed.",
            variant: "destructive"
          });
          return null;
        }
        
        // Use more secure file naming to avoid path traversal issues
        const fileExt = messageData.image_file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `chat-images/${sanitizeInput(fileName)}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community')
          .upload(filePath, messageData.image_file, {
            cacheControl: '3600',
            contentType: messageData.image_file.type
          });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('community')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Use the safeInsert function to insert the chat message
      const result = await safeInsert('chat_messages', {
        content: sanitizedData.content,
        author_id: sanitizedData.author_id,
        author_name: sanitizedData.author_name,
        author_username: sanitizedData.author_username,
        author_profile_pic: sanitizedData.author_profile_pic,
        author_sec_balance: sanitizedData.author_sec_balance,
        image_url: imageUrl,
        likes: 0,
        dislikes: 0
      });
        
      if (result.error) {
        console.error('Error inserting chat message:', result.error);
        throw result.error;
      }
      
      const insertedData = result.data;
      if (insertedData && insertedData.length > 0) {
        return insertedData[0] as ChatMessage;
      }
      
      return null;
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      // Provide more specific error message based on error type
      if (error instanceof Error) {
        if (error.message.includes('new row violates row-level security policy')) {
          toast({
            title: "Authentication Error",
            description: "You need to be logged in to send messages.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send your message. Please try again.",
            variant: "destructive"
          });
        }
      }
      
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
      
      // Update local state to reflect deletion
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
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
        // Sanitize incoming message content
        const newMessage = payload.new as ChatMessage;
        newMessage.content = sanitizeHtml(newMessage.content);
        setMessages(prev => [...prev, newMessage]);
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
    error,
    loadMore,
    sendChatMessage,
    deleteChatMessage
  };
};
