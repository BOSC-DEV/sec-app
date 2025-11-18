import React from 'react';
import { LayoutDashboard, BarChart3, Users, FileText, AlertCircle, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminTab } from '@/pages/AdminDashboard';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'reports' as AdminTab, label: 'Reports', icon: FileText },
    { id: 'moderation' as AdminTab, label: 'Moderation', icon: AlertCircle },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });

      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const handleItemClick = (tab: AdminTab) => {
    setActiveTab(tab);
    onMobileClose?.();
  };

  return (
    <aside className={cn(
      "border-r border-border bg-card min-h-screen relative",
      "w-[230px] lg:w-[230px]",
      "md:w-32"
    )}>
      <div className="p-6 pb-24 md:p-3 md:pb-16">
        <div className="mb-8 md:mb-4">
          <h2 className="text-4xl font-bold text-primary md:text-sm md:text-center">Admin Panel</h2>
          <p className="text-lg text-muted-foreground mt-1 md:text-[0.6rem] md:text-center">Management Console</p>
        </div>

        <nav className="space-y-2 md:space-y-1">
          <button
            onClick={() => navigate('/')}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all',
              'hover:bg-muted/50 text-muted-foreground',
              'md:gap-2 md:px-2 md:py-2 md:text-[0.6rem]'
            )}
          >
            <Home className="h-7 w-7 md:h-3 md:w-3 flex-shrink-0" />
            <span className="md:text-[0.6rem] truncate">Home</span>
          </button>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all',
                'md:gap-2 md:px-2 md:py-2 md:text-[0.6rem]',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="h-7 w-7 md:h-3 md:w-3 flex-shrink-0" />
              <span className="md:text-[0.6rem] truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 md:bottom-3 md:left-2 md:right-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-3 justify-start text-lg md:gap-1 md:text-[0.6rem] md:py-1 md:px-2"
          >
            <LogOut className="h-7 w-7 md:h-3 md:w-3" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
