import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProfile } from '@/contexts/ProfileContext';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notificationService';
import { Notification, EntityType } from '@/types/dataTypes';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, X, CheckCheck, Sparkles, MessageSquare, ThumbsUp, CircleDollarSign, Info } from 'lucide-react';

interface NotificationDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  open,
  onOpenChange
}) => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications', profile?.wallet_address],
    queryFn: () => getUserNotifications(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address && open,
  });
  
  const handleMarkAllAsRead = async () => {
    if (!profile?.wallet_address) return;
    
    await markAllNotificationsAsRead(profile.wallet_address);
    // Update unread count immediately
    if (window.setUnreadCount) {
      window.setUnreadCount();
    }
    refetch();
  };
  
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleLinkClick = (url: string) => {
    // Check if URL has protocol, if not add https://
    const fullUrl = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };
  
  const processContent = (content: string) => {
    // Match URLs with or without protocol
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s]|(?<![\w/])[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s<]*)?)/g;
    
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <span
            key={index}
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => handleLinkClick(part)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };
  
  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationAsRead(notification.id);
    
    switch (notification.entity_type) {
      case EntityType.scammer:
        navigate(`/scammer/${notification.entity_id}`);
        break;
      case EntityType.comment:
        navigate(`/scammer/${notification.entity_id.split('-')[1]}`);
        break;
      case EntityType.announcement:
        navigate('/community');
        break;
      case EntityType.reply:
        navigate('/community');
        break;
      case EntityType.chat_message:
        navigate('/community');
        break;
      default:
        navigate('/community');
    }
    
    refetch();
    handleClose();
  };
  
  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'bounty':
        return <CircleDollarSign className="h-4 w-4 text-yellow-500" />;
      case 'reaction':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90vw]">
        <SheetHeader className="pb-4 flex flex-row items-center justify-between">
          <SheetTitle className="flex-1">Notifications</SheetTitle>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.is_read) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMarkAllAsRead}
                className="h-8 w-8 p-0"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-12 pb-4 px-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Notifications</h3>
              <p className="text-center text-muted-foreground mt-1">
                You don't have any notifications yet. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="space-y-4 pr-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors
                    ${notification.is_read ? 'bg-background hover:bg-muted/30' : 'bg-muted/20 hover:bg-muted/40'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {notification.actor_profile_pic ? (
                      <Avatar>
                        <AvatarImage src={notification.actor_profile_pic} alt={notification.actor_name || ''} />
                        <AvatarFallback>
                          {notification.actor_name ? notification.actor_name.substring(0, 2).toUpperCase() : 'SU'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getNotificationIcon(notification)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {notification.actor_name || 'System'}
                        {notification.actor_username && (
                          <span className="text-icc-gold ml-1 font-bold">@{notification.actor_username}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notification.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <p className="text-sm mt-1">
                      {processContent(notification.content)}
                    </p>
                    {!notification.is_read && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDropdown;
