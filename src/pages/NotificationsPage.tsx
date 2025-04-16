import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  getUserNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/services/notificationService';
import { Notification, NotificationType, EntityType } from '@/types/dataTypes';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Check, ThumbsUp, MessageSquare, Coins, Smile, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const NotificationsPage: React.FC = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);
  
  const { 
    data: notifications = [], 
    refetch, 
    isLoading 
  } = useQuery({
    queryKey: ['notifications', profile?.wallet_address],
    queryFn: () => getUserNotifications(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address,
  });
  
  const filteredNotifications = selectedTypes.length > 0
    ? notifications.filter(notification => selectedTypes.includes(notification.type as NotificationType))
    : notifications;
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markNotificationAsRead(notification.id);
    }
    
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
  };
  
  const handleMarkAllAsRead = async () => {
    if (profile?.wallet_address) {
      await markAllNotificationsAsRead(profile.wallet_address);
      refetch();
      toast({
        title: "Notifications cleared",
        description: "All notifications have been marked as read",
      });
    }
  };
  
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

  const toggleNotificationType = (type: NotificationType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const isFilterActive = (type: NotificationType) => {
    return selectedTypes.includes(type);
  };
  
  if (!profile) {
    return (
      <div className="container my-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Please Connect Your Wallet</h3>
            <p className="text-muted-foreground text-center mt-2 mb-6">
              You need to connect your wallet to view notifications
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container my-8">
      <Helmet>
        <title>Notifications | SEC</title>
      </Helmet>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <h1 className="text-xl font-semibold">Notifications</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={isFilterActive(NotificationType.LIKE)}
                    onCheckedChange={() => toggleNotificationType(NotificationType.LIKE)}
                  >
                    <ThumbsUp className="h-4 w-4 text-blue-500 mr-2" />
                    Likes
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={isFilterActive(NotificationType.COMMENT)}
                    onCheckedChange={() => toggleNotificationType(NotificationType.COMMENT)}
                  >
                    <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
                    Comments
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={isFilterActive(NotificationType.BOUNTY)}
                    onCheckedChange={() => toggleNotificationType(NotificationType.BOUNTY)}
                  >
                    <Coins className="h-4 w-4 text-icc-gold mr-2" />
                    Bounties
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={isFilterActive(NotificationType.REACTION)}
                    onCheckedChange={() => toggleNotificationType(NotificationType.REACTION)}
                  >
                    <Smile className="h-4 w-4 text-purple-500 mr-2" />
                    Reactions
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={isFilterActive(NotificationType.SYSTEM)}
                    onCheckedChange={() => toggleNotificationType(NotificationType.SYSTEM)}
                  >
                    <Bell className="h-4 w-4 text-gray-500 mr-2" />
                    System
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={isFilterActive(NotificationType.MENTION)}
                    onCheckedChange={() => toggleNotificationType(NotificationType.MENTION)}
                  >
                    <Bell className="h-4 w-4 text-orange-500 mr-2" />
                    Mentions
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedTypes([])}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Mark all
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium">No notifications</h3>
              <p className="text-muted-foreground mt-2">
                {selectedTypes.length > 0 
                  ? "No notifications match your selected filters"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-muted/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.actor_profile_pic ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.actor_profile_pic} alt={notification.actor_name || 'User'} />
                          <AvatarFallback>
                            {notification.actor_name?.substring(0, 2).toUpperCase() || 'US'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="rounded-full bg-primary/10 p-2">
                          {getNotificationIcon(notification.type as NotificationType)}
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
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-sm mt-1">
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
      </Card>
    </div>
  );
};

export default NotificationsPage;
