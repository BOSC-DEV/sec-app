
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import SEO from '@/components/common/SEO';
import CompactHero from '@/components/common/CompactHero';
import AnnouncementFeed from '@/components/community/AnnouncementFeed';
import LiveChat from '@/components/community/LiveChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LayoutPanelLeft, Rows, Trophy } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import BadgeTiersPage from '@/components/profile/BadgeTiersPage';

const CommunityPage = () => {
  const { profile, isConnected } = useProfile();
  const [activeTab, setActiveTab] = useState("announcements");
  const [splitScreen, setSplitScreen] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connect your wallet",
        description: "Connect your wallet to interact with the community features",
        variant: "default",
      });
    }
  }, [isConnected]);

  const toggleSplitScreen = () => {
    setSplitScreen(!splitScreen);
  };

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
        {splitScreen ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Community</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab("badges")}
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>View Badge Tiers</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleSplitScreen}
                  className="flex items-center gap-2"
                >
                  <LayoutPanelLeft className="h-4 w-4" />
                  <span>Tabbed View</span>
                </Button>
              </div>
            </div>
            
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[600px] border rounded-lg overflow-hidden"
            >
              <ResizablePanel defaultSize={50} minSize={30} className="overflow-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Announcements</h3>
                  <AnnouncementFeed />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={50} minSize={30} className="overflow-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Live Chat</h3>
                  <LiveChat />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        ) : (
          <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="flex-1">
                <TabsTrigger value="announcements" className="flex-1">Announcements</TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">Live Chat</TabsTrigger>
                <TabsTrigger value="badges" className="flex-1 flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Badge Tiers
                </TabsTrigger>
              </TabsList>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSplitScreen}
                className="ml-2 flex items-center gap-2"
              >
                <Rows className="h-4 w-4" />
                <span>Split Screen</span>
              </Button>
            </div>
            
            <TabsContent value="announcements" className="mt-0">
              <AnnouncementFeed />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0">
              <LiveChat />
            </TabsContent>
            
            <TabsContent value="badges" className="mt-0">
              <BadgeTiersPage />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default CommunityPage;
