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
import { MessageSquare, Image as ImageIcon, Send, Smile, AlertCircle, Download, Info, X, Clock, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { getChatMessages, sendChatMessage, deleteChatMessage, isUserAdmin } from '@/services/communityService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmojiPicker from '@/components/community/EmojiPicker';
import ReactionButton from './ReactionButton';
import AdminContextMenu from './AdminContextMenu';
import { Textarea } from '@/components/ui/textarea';
import BadgeTier from '@/components/profile/BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';
import { getUserTotalBountyAmount } from '@/services/bountyService';
import { useIsMobile } from '@/hooks/use-mobile';

const SLOW_MODE_DELAY = 30; // 30 seconds
const SLOW_MODE_STORAGE_KEY = 'chat_slow_mode';

const LiveChat = () => {
  const {
    profile,
    isConnected
  } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userBounties, setUserBounties] = useState<Record<string, number>>({});
  const [slowModeCountdown, setSlowModeCountdown] = useState(0);
  const [slowModeExpiry, setSlowModeExpiry] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slowModeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

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

  useEffect(() => {
    const loadSlowModeState = () => {
      if (isAdmin) return; // Admins don't need slow mode

      try {
        const storedData = localStorage.getItem(SLOW_MODE_STORAGE_KEY);
        if (storedData) {
          const {
            expiry,
            userId
          } = JSON.parse(storedData);
          if (userId === profile?.wallet_address && expiry > Date.now()) {
            const remainingSeconds = Math.ceil((expiry - Date.now()) / 1000);
            setSlowModeCountdown(remainingSeconds);
            setSlowModeExpiry(expiry);
          } else if (userId !== profile?.wallet_address || expiry <= Date.now()) {
            localStorage.removeItem(SLOW_MODE_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading slow mode state:', error);
        localStorage.removeItem(SLOW_MODE_STORAGE_KEY);
      }
    };
    if (profile?.wallet_address) {
      loadSlowModeState();
    }
  }, [profile?.wallet_address, isAdmin]);

  useEffect(() => {
    if (slowModeExpiry && slowModeCountdown > 0 && profile?.wallet_address && !isAdmin) {
      try {
        localStorage.setItem(SLOW_MODE_STORAGE_KEY, JSON.stringify({
          expiry: slowModeExpiry,
          userId: profile.wallet_address
        }));
      } catch (error) {
        console.error('Error saving slow mode state:', error);
      }
    } else if (slowModeCountdown === 0 && !isAdmin) {
      localStorage.removeItem(SLOW_MODE_STORAGE_KEY);
    }
  }, [slowModeExpiry, slowModeCountdown, profile?.wallet_address, isAdmin]);

  useEffect(() => {
    if (slowModeCountdown > 0) {
      slowModeTimerRef.current = setTimeout(() => {
        setSlowModeCountdown(prev => prev - 1);
      }, 1000);
      return () => {
        if (slowModeTimerRef.current) {
          clearTimeout(slowModeTimerRef.current);
        }
      };
    }
  }, [slowModeCountdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
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
    if (slowModeCountdown > 0 && !isAdmin) {
      toast({
        title: "Slow mode active",
        description: `Please wait ${slowModeCountdown} seconds before sending another message`,
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
        image_file: imageFile
      });
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
      if (!isAdmin) {
        const expiryTime = Date.now() + SLOW_MODE_DELAY * 1000;
        setSlowModeCountdown(SLOW_MODE_DELAY);
        setSlowModeExpiry(expiryTime);
      }
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
    if (!isAdmin) return;
    try {
      const success = await deleteChatMessage(messageId);
      if (success) {
        toast({
          title: "Message deleted",
          description: "The message has been deleted successfully",
          variant: "default"
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

  const fetchUserBounty = async (walletAddress: string) => {
    try {
      if (userBounties[walletAddress]) return;
      const bountyAmount = await getUserTotalBountyAmount(walletAddress);
      setUserBounties(prev => ({
        ...prev,
        [walletAddress]: bountyAmount || 0
      }));
    } catch (error) {
      console.error('Error fetching user bounty:', error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getChatMessages();
        setMessages(data);
        setIsLoading(false);
        const uniqueAuthors = new Set(data.map(message => message.author_id));
        uniqueAuthors.forEach(authorId => {
          if (authorId) fetchUserBounty(authorId);
        });
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        setIsLoading(false);
      }
    };
    fetchMessages();
    const channel = supabase.channel('public:chat_messages').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages'
    }, payload => {
      setMessages(prev => [...prev, payload.new as ChatMessage]);
      if (payload.new.author_id) {
        fetchUserBounty(payload.new.author_id);
      }
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
      if (slowModeTimerRef.current) {
        clearTimeout(slowModeTimerRef.current);
      }
    };
  }, []);

  const renderMessage = (message: ChatMessage, index: number) => {
    const userBadge = message.author_id ? userBounties[message.author_id] !== undefined ? calculateBadgeTier(userBounties[message.author_id]) : null : null;
    const isCurrentUser = message.author_id === profile?.wallet_address;
    const time = formatDistanceToNow(new Date(message.created_at), { addSuffix: false });
    const formattedTime = time.includes('minute') ? time.replace(' minutes', 'm').replace(' minute', 'm') : 
                          time.includes('second') ? time.replace(' seconds', 's').replace(' second', 's') : 
                          time.includes('hour') ? time.replace(' hours', 'h').replace(' hour', 'h') : time;
    
    const messageContent = (
      <div key={message.id} className={`flex my-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} space-x-2 ${isCurrentUser ? 'space-x-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <Link to={message.author_username ? `/profile/${message.author_username}` : '#'}>
              <Avatar className="h-10 w-10 cursor-pointer border-2 border-background">
                <AvatarImage src={message.author_profile_pic} alt={message.author_name} />
                <AvatarFallback className="text-xs">{message.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          
          <div className={`min-w-[180px] max-w-[75%] md:max-w-[60%] rounded-lg px-3 py-2 ${isCurrentUser ? 'bg-icc-blue-light text-white rounded-tr-none' : 'bg-card rounded-tl-none'}`}>
            <div className="flex items-center gap-1 mb-1 flex-wrap">
              <span className={`font-semibold text-sm ${isCurrentUser ? 'text-icc-gold' : 'text-icc-gold'}`}>
                {message.author_name}
              </span>
              {userBadge && <BadgeTier badgeInfo={userBadge} size="sm" showTooltip={true} />}
              {isAdmin && message.author_username === 'sec' && 
                <span className="text-xs bg-icc-gold/20 text-icc-gold px-1 rounded ml-1">admin</span>
              }
            </div>
            
            <div className="text-sm break-words">
              {message.content}
            </div>
            
            {message.image_url && (
              <div className="mt-2 relative group">
                <img src={message.image_url} alt="Chat attachment" 
                  className="max-h-40 rounded-md object-contain bg-muted/20" />
                <a href={message.image_url} target="_blank" rel="noopener noreferrer" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity 
                  bg-background/80 rounded-full p-1" title="View full image">
                  <Download className="h-4 w-4" />
                </a>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-1">
              <div className="flex gap-1">
                <ReactionButton itemId={message.id} itemType="message" size="xs" iconOnly />
              </div>
              <span className="text-xs text-muted-foreground">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
    
    return isAdmin ? (
      <AdminContextMenu key={message.id} onDelete={() => handleDeleteMessage(message.id)} canEdit={false}>
        {messageContent}
      </AdminContextMenu>
    ) : messageContent;
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
          </div>
          <div className="bg-muted rounded-full px-3 py-1 text-xs text-muted-foreground flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Stored for 24 hours
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100%-1rem)]">
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
            <Button variant="outline" onClick={() => toast({
              title: "Connect Wallet",
              description: "Please connect your wallet to participate in the chat"
            })}>
              Connect Wallet to Chat
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            {slowModeCountdown > 0 && !isAdmin && (
              <div className="flex items-center bg-muted/50 p-2 rounded text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                <span>Slow mode active: wait {slowModeCountdown}s</span>
              </div>
            )}
            
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Upload preview" className="max-h-32 rounded-md object-contain bg-muted/50" />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80" onClick={removeImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1">
                <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => fileInputRef.current?.click()} disabled={slowModeCountdown > 0 && !isAdmin}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={slowModeCountdown > 0 && !isAdmin}>
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Textarea 
                placeholder={slowModeCountdown > 0 && !isAdmin ? `Wait ${slowModeCountdown}s...` : "Type your message..."} 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)} 
                disabled={isSubmitting || (slowModeCountdown > 0 && !isAdmin)} 
                className="flex-1 min-h-[38px] max-h-[80px] py-2 text-sm resize-none"
                rows={1}
                style={{lineHeight: '1.2'}}
              />
              
              <Button type="submit" size="icon" className="h-9 w-9" disabled={isSubmitting || !newMessage.trim() && !imageFile || slowModeCountdown > 0 && !isAdmin}>
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
