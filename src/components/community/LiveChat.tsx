
import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/dataTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Send, 
  Smile, 
  AlertCircle, 
  Download,
  Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { getChatMessages, sendChatMessage, deleteChatMessage, isUserAdmin } from '@/services/communityService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmojiPicker from '@/components/community/EmojiPicker';
import ReactionButton from './ReactionButton';
import AdminContextMenu from './AdminContextMenu';
import { Textarea } from '@/components/ui/textarea';

const LiveChat = () => {
  const { profile, isConnected } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (profile?.username) {
        const admin = await isUserAdmin(profile.username);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [profile?.username]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to chat",
        variant: "destructive",
      });
      return;
    }
    
    if (!newMessage.trim() && !imageFile) {
      toast({
        title: "Empty message",
        description: "Please enter a message or add an image",
        variant: "destructive",
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
        image_file: imageFile,
      });
      
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    if (!isAdmin) return;
    
    try {
      const success = await deleteChatMessage(messageId);
      if (success) {
        toast({
          title: "Message deleted",
          description: "The message has been deleted successfully",
          variant: "default",
        });
        const data = await getChatMessages();
        setMessages(data);
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
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
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
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
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getChatMessages();
        setMessages(data);
        setIsLoading(false);
        
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        payload => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
          
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-2">
              <div className="rounded-full bg-muted h-8 w-8"></div>
              <div className="flex-1">
                <div className="h-2 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-icc-gold" />
            <h3 className="text-lg font-medium">Community Chat</h3>
          </div>
          <div className="bg-muted rounded-full px-3 py-1 text-xs text-muted-foreground flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Messages are stored for 24 hours
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100%-1rem)] p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-center">No Messages Yet</h3>
              <p className="text-muted-foreground text-center mt-1">
                Be the first to start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const messageContent = (
                  <div key={message.id} className="flex items-start space-x-3">
                    {message.author_username ? (
                      <Link to={`/profile/${message.author_username}`}>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                          <AvatarImage src={message.author_profile_pic} alt={message.author_name} />
                          <AvatarFallback>{message.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Link>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.author_profile_pic} alt={message.author_name} />
                        <AvatarFallback>{message.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {message.author_username ? (
                          <Link to={`/profile/${message.author_username}`} className="font-medium hover:underline">
                            {message.author_name}
                          </Link>
                        ) : (
                          <span className="font-medium">{message.author_name}</span>
                        )}
                        
                        {message.author_username && (
                          <Link to={`/profile/${message.author_username}`} className="text-icc-gold text-sm hover:underline">
                            @{message.author_username}
                          </Link>
                        )}
                        
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="mt-1 text-sm">
                        {message.content}
                      </div>
                      
                      {message.image_url && (
                        <div className="mt-2 relative group">
                          <img 
                            src={message.image_url} 
                            alt="Chat attachment" 
                            className="max-h-60 rounded-md object-contain bg-muted/50"
                          />
                          <a 
                            href={message.image_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full p-1"
                            title="View full image"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                      
                      <div className="mt-1">
                        <ReactionButton itemId={message.id} itemType="chat" />
                      </div>
                    </div>
                  </div>
                );
                
                return isAdmin ? (
                  <AdminContextMenu 
                    key={message.id}
                    onDelete={() => handleDeleteMessage(message.id)}
                    canEdit={false}
                  >
                    {messageContent}
                  </AdminContextMenu>
                ) : messageContent;
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-4 mt-auto">
        {!isConnected ? (
          <div className="w-full flex justify-center">
            <Button variant="outline" onClick={() => toast({
              title: "Connect Wallet",
              description: "Please connect your wallet to participate in the chat",
            })}>
              Connect Wallet to Chat
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            {imagePreview && (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Upload preview" 
                  className="max-h-32 rounded-md object-contain bg-muted/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80"
                  onClick={removeImage}
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 min-h-[40px] max-h-[100px]"
                rows={1}
              />
              
              <Button type="submit" disabled={isSubmitting || (!newMessage.trim() && !imageFile)}>
                {isSubmitting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};

export default LiveChat;
