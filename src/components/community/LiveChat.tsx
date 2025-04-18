import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { isAdmin } from '@/utils/adminUtils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Image, Clock, X, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/utils/formatTime';
import ReactionButton from './ReactionButton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useChatMessages } from '@/hooks/useChatMessages';
import BadgeTier from '../profile/BadgeTier';
import { useBadgeTier } from '@/hooks/useBadgeTier';

const LiveChat = () => {
  const { profile } = useProfile();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    hasMore,
    loadOlderMessages,
    sendChatMessage,
    deleteChatMessage
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!hasMore || isLoading || !loadMoreRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadOlderMessages();
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoading, loadOlderMessages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setImageFile(file);
    toast({
      title: "Image attached",
      description: file.name
    });
  };

  const clearImageAttachment = () => {
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast({
        title: "Error",
        description: "You must be signed in to send messages",
        variant: "destructive"
      });
      return;
    }
    
    if (!message.trim() && !imageFile) {
      toast({
        title: "Error",
        description: "Please enter a message or attach an image",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSending(true);
      
      const success = await sendChatMessage({
        content: message.trim(),
        author_id: profile.wallet_address,
        author_name: profile.display_name,
        author_username: profile.username,
        author_profile_pic: profile.profile_pic_url,
        author_sec_balance: profile.sec_balance,
        image_file: imageFile
      });
      
      if (success) {
        setMessage('');
        setImageFile(null);
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteChatMessage(messageId);
  };

  const renderMessage = (msg: ChatMessage) => {
    const badgeInfo = useBadgeTier(msg.author_sec_balance || 0);
    const isOwnMessage = msg.author_id === profile?.wallet_address;

    return (
      <div 
        key={msg.id} 
        className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
      >
        <Avatar className="h-8 w-8 border border-blue-400/30 flex-shrink-0">
          {msg.author_profile_pic ? (
            <AvatarImage 
              src={msg.author_profile_pic} 
              alt={msg.author_name} 
            />
          ) : (
            <AvatarFallback className="bg-blue-700 text-blue-100">
              {msg.author_name?.charAt(0) || '?'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div 
          className={`
            max-w-[75%] p-3 rounded-lg relative
            ${isOwnMessage 
              ? 'bg-blue-700/80 text-blue-50 rounded-tr-none' 
              : 'bg-blue-800/40 text-blue-50 rounded-tl-none border border-blue-700/30'
            }
          `}
        >
          <div className="flex items-center gap-2 mb-1 text-xs">
            <span className="font-semibold flex items-center gap-1">
              {msg.author_name}
              {msg.author_username && (
                <span className="text-blue-300/70">@{msg.author_username}</span>
              )}
              {badgeInfo && (
                <BadgeTier 
                  badgeInfo={badgeInfo} 
                  size="sm"
                  context="chat"
                />
              )}
            </span>
            <span className="opacity-70 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(msg.created_at)}
            </span>
          </div>
          
          {msg.content && (
            <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
          )}
          
          {msg.image_url && (
            <a 
              href={msg.image_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2"
            >
              <img 
                src={msg.image_url} 
                alt="Attachment" 
                className="max-w-full max-h-64 rounded object-contain bg-black/20"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.alt = 'Image failed to load';
                }}
              />
            </a>
          )}
          
          <div className="mt-2 flex items-center justify-end gap-2">
            <ReactionButton
              itemId={msg.id}
              itemType="message"
              size="xs"
              iconOnly
              variant="ghost"
            />
            
            {(isUserAdmin || isOwnMessage) && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-70 hover:opacity-100 hover:bg-red-900/30 hover:text-red-400" 
                onClick={() => handleDeleteMessage(msg.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex-1 overflow-hidden h-[600px] flex flex-col bg-gradient-to-b from-blue-950/20 to-blue-900/5 border-blue-800/30">
      <CardHeader className="pb-3 border-b border-blue-800/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-100">
            Community Chat
          </h3>
          <Badge variant="secondary" className="bg-blue-800/50 text-blue-100 border border-blue-700/50">
            {messages.length} messages
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {hasMore && (
            <div 
              ref={loadMoreRef} 
              className="py-2 text-center text-sm text-blue-300/70"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Loading older messages..."
              )}
            </div>
          )}
          
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-blue-300/70">
              <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
              <p>No messages yet. Be the first to say hello!</p>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {profile ? (
          <form onSubmit={handleSendMessage} className="p-4 flex flex-col gap-2 border-t border-blue-800/30 bg-blue-900/20">
            {imageFile && (
              <div className="flex items-center gap-2 p-2 bg-blue-800/30 rounded text-sm">
                <span className="flex-1 truncate">{imageFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={clearImageAttachment}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[40px] max-h-[120px] bg-blue-950/50 border-blue-800/50 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-blue-800/50 bg-blue-900/30 hover:bg-blue-800/50"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isSending || (!message.trim() && !imageFile)}
                  className="bg-blue-700 hover:bg-blue-600"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-4 text-center text-blue-300/70 border-t border-blue-800/30 bg-blue-900/20">
            Please sign in to participate in the chat
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveChat;
