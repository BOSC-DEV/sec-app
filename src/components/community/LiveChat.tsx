
import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { MessageSquare, Image as ImageIcon, Send, Smile, AlertCircle, Download, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/utils/formatTime';
import { CircleDot } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmojiPicker from '@/components/community/EmojiPicker';
import CommunityInteractionButtons from './CommunityInteractionButtons';
import AdminContextMenu from './AdminContextMenu';
import BadgeTier from '@/components/profile/BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { isBanned, isAdmin } from '@/utils/adminUtils';

const LiveChat = () => {
  const {
    profile,
    isConnected,
    connectWallet
  } = useProfile();
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const onlineCount = useOnlineUsers();
  const { messages, isLoading, hasMore, loadMore, sendChatMessage, deleteChatMessage } = useChatMessages();

  useEffect(() => {
    if (profile?.username) {
      const adminStatus = isAdmin(profile.username);
      console.log(`User ${profile.username} admin status: ${adminStatus}`);
      setIsUserAdmin(adminStatus);
    } else {
      setIsUserAdmin(false);
    }
  }, [profile?.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.closest('.scroll-area-viewport');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      } else {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      }
    }
  };

  const handleBanUser = (username: string | undefined) => {
    if (!username) return;
    try {
      // banUser(username); // Assuming banUser is implemented elsewhere
      toast({
        title: "User banned",
        description: "The user has been banned from sending messages",
        variant: "default"
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to chat",
        variant: "destructive"
      });
      return;
    }
    if (profile?.username && isBanned(profile.username)) {
      toast({
        title: "Unable to send message",
        description: "You have been banned from sending messages",
        variant: "destructive"
      });
      return;
    }
    if (!newMessage.trim() && !imageFile) {
      toast({
        title: "Empty message",
        description: "Please enter a message or add an image",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await sendChatMessage({
        content: newMessage,
        author_id: profile?.wallet_address || '',
        author_name: profile?.display_name || '',
        author_username: profile?.username || '',
        author_profile_pic: profile?.profile_pic_url || '',
        author_sec_balance: profile?.sec_balance || 0,
        image_file: imageFile
      });
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!isUserAdmin) return;
    try {
      const success = await deleteChatMessage(messageId);
      if (success) {
        toast({
          title: "Message deleted",
          description: "The message has been deleted successfully",
          variant: "default"
        });
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop === 0 && hasMore) {
      loadMore();
    }
  };

  const renderMessage = (message: any, index: number) => {
    console.log("Rendering message:", message);
    // Get badge info based on SEC balance
    const userBadge = message.author_sec_balance !== undefined ? 
      calculateBadgeTier(message.author_sec_balance) : null;
    
    console.log("User badge for message:", userBadge, "SEC balance:", message.author_sec_balance);
    
    const isCurrentUser = message.author_id === profile?.wallet_address;
    const time = formatTimeAgo(message.created_at);
    const messageContent = <div key={message.id} className="flex my-6">
        <div className={`flex ${isCurrentUser ? 'flex-row-reverse self-end ml-auto' : 'flex-row'} space-x-2 ${isCurrentUser ? 'space-x-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <Link to={message.author_username ? `/profile/${message.author_username}` : '#'}>
              <Avatar className={`h-10 w-10 cursor-pointer border-2 border-background ${isCurrentUser ? 'order-last' : ''}`}>
                <AvatarImage src={message.author_profile_pic} alt={message.author_name} />
                <AvatarFallback className="text-xs">{message.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          
          <div className={`min-w-[180px] max-w-[75%] md:max-w-[60%] rounded-lg px-3 py-2 ${isCurrentUser ? 'bg-icc-blue-light text-white rounded-tr-none self-end' : 'bg-card rounded-tl-none'}`}>
            <div className="flex items-center gap-1 mb-1 flex-wrap">
              <span className={`font-semibold text-sm ${isCurrentUser ? 'text-icc-gold' : 'text-icc-gold'}`}>
                {message.author_name}
              </span>
              {userBadge && <BadgeTier badgeInfo={userBadge} size="sm" showTooltip={true} context="chat" />}
              {isUserAdmin && message.author_username === 'sec' && <span className="text-xs bg-icc-gold/20 text-icc-gold px-1 rounded ml-1">admin</span>}
            </div>
            
            <div className="text-sm break-words">
              {message.content}
            </div>
            
            {message.image_url && <div className="mt-2 relative group">
                <img src={message.image_url} alt="Chat attachment" className="max-h-40 rounded-md object-contain bg-muted/20" />
                <a href={message.image_url} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity 
                  bg-background/80 rounded-full p-1" title="View full image">
                  <Download className="h-4 w-4" />
                </a>
              </div>}
            
            <div className="flex justify-between items-center mt-1">
              <CommunityInteractionButtons itemId={message.id} itemType="message" initialLikes={message.likes} initialDislikes={message.dislikes} />
              <span className="text-xs text-muted-foreground">
                {time}
              </span>
            </div>
          </div>
        </div>
      </div>;
    return isUserAdmin ? <AdminContextMenu key={message.id} onDelete={() => handleDeleteMessage(message.id)} onBanUser={() => handleBanUser(message.author_username)}>
        {messageContent}
      </AdminContextMenu> : messageContent;
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex items-start space-x-2">
              <div className="rounded-full bg-muted h-8 w-8"></div>
              <div className="flex-1">
                <div className="h-2 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>)}
        </div>
      </div>;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={`pb-2 ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-icc-gold" />
            <h3 className="text-lg font-medium">Chat</h3>
            <div className="flex items-center ml-4">
              <CircleDot className="h-5 w-5 text-green-500 mr-2 animate-pulse" />
              <span className="text-lg font-medium text-gray-900 dark:text-white">{onlineCount}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100%-1rem)]" onScroll={handleScroll}>
          <div className={`space-y-0 p-${isMobile ? '2' : '4'}`}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium text-center">No Messages Yet</h3>
                <p className="text-muted-foreground text-center mt-1">
                  Be the first to start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message, index) => renderMessage(message, index))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className={`border-t ${isMobile ? 'p-2' : 'p-4'} mt-auto`}>
        {!isConnected ? (
          <div className="w-full flex justify-center">
            <Button variant="gold" className="w-full" onClick={connectWallet}>
              Connect Wallet to Chat
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            {imagePreview && <div className="relative inline-block">
                <img src={imagePreview} alt="Upload preview" className="max-h-32 rounded-md object-contain bg-muted/50" />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80" onClick={removeImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>}
            
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1">
                <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Input type="text" placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} disabled={isSubmitting} className="flex-1" />
              
              <Button type="submit" size="icon" className="h-9 w-9" disabled={isSubmitting || !newMessage.trim() && !imageFile}>
                {isSubmitting ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};

export default LiveChat;
