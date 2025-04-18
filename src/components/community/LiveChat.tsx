
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { isAdmin } from '@/utils/adminUtils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages } from '@/hooks/useChatMessages';

const LiveChat = () => {
  const { profile } = useProfile();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!profile?.username) {
        setIsUserAdmin(false);
        return;
      }
      
      try {
        const adminStatus = await isAdmin(profile.username);
        setIsUserAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsUserAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [profile?.username]);

  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Live Chat</h3>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-[520px]">
          <div className="p-4">
            <p>Chat functionality will be implemented here</p>
            {isUserAdmin && <p className="text-green-500">Admin controls available</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveChat;
