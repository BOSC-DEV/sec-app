
import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { isAdmin } from '@/utils/adminUtils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LiveChat = () => {
  const { profile } = useProfile();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    sendChatMessage,
    deleteChatMessage,
    hasMore,
    loadMore
  } = useChatMessages();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!profile?.username) {
        setIsUserAdmin(false);
        return;
      }
      
      const adminStatus = await isAdmin(profile.username);
      setIsUserAdmin(adminStatus);
    };
    
    checkAdminStatus();
  }, [profile?.username]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Set up realtime subscription for new chat messages
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('New chat message received:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !message.trim()) return;

    try {
      await sendChatMessage({
        content: message,
        author_id: profile.id,
        author_name: profile.display_name,
        author_username: profile.username,
        author_profile_pic: profile.profile_pic_url,
        author_sec_balance: profile.sec_balance
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteChatMessage(messageId);
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="flex-1 overflow-hidden h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Live Chat</h3>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {hasMore && (
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={loadMore}
                disabled={isLoading}
              >
                Load More Messages
              </Button>
            )}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2 ${
                  msg.author_id === profile?.id ? 'flex-row-reverse' : ''
                }`}
              >
                {msg.author_profile_pic && (
                  <img 
                    src={msg.author_profile_pic} 
                    alt={msg.author_name} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div 
                  className={`
                    flex-1 p-3 rounded-lg 
                    ${msg.author_id === profile?.id 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-muted mr-12'
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">
                      {msg.author_name}
                    </span>
                    {(isUserAdmin || msg.author_id === profile?.id) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-1">{msg.content}</p>
                  {msg.image_url && (
                    <img 
                      src={msg.image_url} 
                      alt="Chat attachment" 
                      className="mt-2 max-w-full rounded"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {profile ? (
          <form onSubmit={handleSendMessage} className="p-4 flex gap-2 border-t">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="p-4 text-center text-muted-foreground border-t">
            Please sign in to participate in the chat
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveChat;
