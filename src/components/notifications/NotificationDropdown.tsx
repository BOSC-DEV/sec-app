
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  getUserNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount
} from '@/services/notificationService';
import { Notification, NotificationType, EntityType } from '@/types/dataTypes';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Check, ThumbsUp, MessageSquare, Coins, Smile } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationDropdownProps {
  onClose: () => void;
  isMobile?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  onClose,
  isMobile = false
}) => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  
  // Query for notifications
  const { 
    data: notifications = [], 
    refetch, 
    isLoading 
  } = useQuery({
    queryKey: ['notifications', profile?.wallet_address],
    queryFn: () => getUserNotifications(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address,
  });
  
  // Query for unread count
  const { 
    data: unreadCount = 0,
    refetch: refetchUnreadCount
  } = useQuery({
    queryKey: ['notifications-unread-count', profile?.wallet_address],
    queryFn: () => getUnreadNotificationsCount(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address,
  });
  
  // Handle clicking a notification
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markNotificationAsRead(notification.id);
    
    // Navigate based on entity type
    switch (notification.entity_type) {
      case EntityType.SCAMMER:
        navigate(`/scammer/${notification.entity_id}`);
        break;
      case EntityType.COMMENT:
        // For comments, we need to navigate to the scammer page
        navigate(`/scammer/${notification.entity_id.split('-')[1]}`);
        break;
      case EntityType.ANNOUNCEMENT:
        navigate('/community');
        break;
      case EntityType.REPLY:
        navigate('/community');
        break;
      case EntityType.CHAT_MESSAGE:
        navigate('/community');
        break;
      default:
        // Default to community page
        navigate('/community');
    }
    
    refetch();
    refetchUnreadCount();
    onClose();
  };
  
  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (profile?.wallet_address) {
      await markAllNotificationsAsRead(profile.wallet_address);
      refetch();
      refetchUnreadCount();
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LIKE:
        return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      case NotificationType.COMMENT:
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case NotificationType.BOUNTY:
        return <Coins className="h-4 w-4 text-icc-gold" />;
      case NotificationType.REACTION:
        return <Smile className="h-4 w-4 text-purple-500" />;
      case NotificationType.MENTION:
        return <Bell className="h-4 w-4 text-orange-500" />;
      case NotificationType.SYSTEM:
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown') && !target.closest('[aria-label="Notifications"]')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <Card className={`notification-dropdown shadow-lg w-80`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <h3 className="text-sm font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleMarkAllAsRead}
          className="text-xs"
        >
          <Check className="h-3 w-3 mr-1" />
          Mark all read
        </Button>
      </CardHeader>
      
      <Separator />
      
      <ScrollArea className="h-[300px]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-muted/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.actor_profile_pic ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.actor_profile_pic} alt={notification.actor_name || 'User'} />
                          <AvatarFallback>
                            {notification.actor_name?.substring(0, 2).toUpperCase() || 'US'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="rounded-full bg-primary/10 p-2">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-sm line-clamp-2">
                        {notification.content}
                      </p>
                      {!notification.is_read && (
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1"></span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </ScrollArea>
      
      <Separator />
      
      <CardFooter className="py-2 px-3">
        <Button 
          variant="link" 
          className="text-xs text-muted-foreground w-full justify-center"
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
        >
          View all notifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationDropdown;
