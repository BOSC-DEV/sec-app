
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeHtml, sanitizeInput, detectMaliciousPattern, sanitizeFormData } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

const MESSAGES_PER_PAGE = 10;

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
      const sanitizedData = {
        content: sanitizeInput(messageData.content),
        author_id: messageData.author_id,
        author_name: sanitizeInput(messageData.author_name),
        author_username: messageData.author_username ? sanitizeInput(messageData.author_username) : undefined,
        author_profile_pic: messageData.author_profile_pic,
        author_sec_balance: messageData.author_sec_balance
      };
      
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
      
      // Insert the chat message with image_url if available
      const { data: insertedData, error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          ...sanitizedData,
          image_url: imageUrl || null
        })
        .select()
        .single();
        
      if (insertError) {
        console.error('Error inserting chat message:', insertError);
        throw insertError;
      }
      
      // Add the new message to local state immediately (optimistic update)
      if (insertedData) {
        const newMessage = {
          ...insertedData,
          content: sanitizeHtml(insertedData.content)
        } as ChatMessage;
        
        setMessages(prev => [...prev, newMessage]);
      }
      
      return insertedData as ChatMessage;
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
        
        // Add to state only if message doesn't already exist (prevent duplicates)
        setMessages(prev => {
          // Check if message already exists (might have been added optimistically)
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) {
            return prev;
          }
          return [...prev, newMessage];
        });
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
