
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import SEO from '@/components/common/SEO';
import CompactHero from '@/components/common/CompactHero';
import AnnouncementFeed from '@/components/community/AnnouncementFeed';
import LiveChat from '@/components/community/LiveChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const CommunityPage = () => {
  const { profile, isConnected } = useProfile();
  const [activeTab, setActiveTab] = useState("announcements");

  // Effect to show toast for unconnected users
  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connect your wallet",
        description: "Connect your wallet to interact with the community features",
        variant: "default",
      });
    }
  }, [isConnected]);

  return (
    <>
      <SEO 
        title="Community | Scams & E-crimes Commission"
        description="Join the community to discuss and stay updated on the latest scams and fraud prevention."
      />
      
      <CompactHero
        title="Community"
        subtitle="Connect with fellow fraud fighters and stay updated on the latest scam prevention efforts"
      />
      
      <div className="icc-container py-8">
        <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="announcements" className="flex-1">Announcements</TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">Live Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="announcements" className="mt-0">
            <AnnouncementFeed />
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0">
            <LiveChat />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CommunityPage;
