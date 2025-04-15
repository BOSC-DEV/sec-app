
import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const { profile, isConnected } = useProfile();
  
  const { data: unreadCount = 0, refetch } = useQuery({
    queryKey: ['notifications-unread-count', profile?.wallet_address],
    queryFn: () => getUnreadNotificationsCount(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address && isConnected,
    refetchInterval: 30000, // Refetch more frequently (every 30 seconds)
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
    staleTime: 10000, // Consider data stale after 10 seconds
  });
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className="text-white hover:bg-icc-blue-light relative"
      onClick={() => {
        onClick();
        refetch(); // Refetch when clicked
      }}
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
