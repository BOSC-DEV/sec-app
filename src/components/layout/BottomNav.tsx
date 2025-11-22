import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, PlusCircle, User } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  const { isConnected } = useProfile();
  
  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      position: 'left'
    },
    {
      icon: PlusCircle,
      label: 'Report',
      path: '/new-report',
      position: 'center-left'
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      path: '/community?tab=chat',
      position: 'center-right'
    },
    {
      icon: User,
      label: 'Profile',
      path: isConnected ? '/profile' : '/profile',
      position: 'right'
    }
  ];

  const isActive = (path: string) => {
    // Handle query params for community chat
    if (path.includes('?tab=chat')) {
      return location.pathname === '/community' && location.search.includes('tab=chat');
    }
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mb-1",
                active && "fill-current"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
