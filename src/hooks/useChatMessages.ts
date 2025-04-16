
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types/dataTypes';
import { supabase } from '@/integrations/supabase/client';

const MESSAGES_PER_PAGE = 50;

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async (startIndex: number = 0) => {
    try {
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
        setMessages(prev => [...prev, ...newMessages]);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    fetchMessages(messages.length);
  };

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
  }, []);

  return {
    messages,
    isLoading,
    hasMore,
    loadMore
  };
};
