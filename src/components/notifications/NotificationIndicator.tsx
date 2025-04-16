
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useProfile } from '@/contexts/ProfileContext';
import { getUnreadNotificationsCount } from '@/services/notificationService';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationIndicatorProps {
  onClick: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
}

const NotificationIndicator: React.FC<NotificationIndicatorProps> = ({
  onClick,
  size = 'icon',
  variant = 'ghost'
}) => {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-unread-count', profile?.wallet_address],
    queryFn: () => getUnreadNotificationsCount(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address,
    refetchInterval: 60000, // Refetch every minute
  });

  // Expose method to manually set unread count to 0
  React.useEffect(() => {
    window.setUnreadCount = () => {
      queryClient.setQueryData(
        ['notifications-unread-count', profile?.wallet_address],
        0
      );
    };

    return () => {
      // Clean up the global function when component unmounts
      delete window.setUnreadCount;
    };
  }, [queryClient, profile?.wallet_address]);
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className="text-white hover:bg-icc-blue-light relative"
      onClick={onClick}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default NotificationIndicator;
