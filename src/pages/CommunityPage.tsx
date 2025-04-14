import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import SEO from '@/components/common/SEO';
import CompactHero from '@/components/common/CompactHero';
import AnnouncementFeed from '@/components/community/AnnouncementFeed';
import LiveChat from '@/components/community/LiveChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LayoutPanelLeft, Rows, Medal, Megaphone, MessageSquare } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import BadgeTiersPage from '@/components/profile/BadgeTiersPage';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
const CommunityPage = () => {
  const {
    profile,
    isConnected
  } = useProfile();
  const [activeTab, setActiveTab] = useState("announcements");
  const [splitScreen, setSplitScreen] = useState(true);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connect your wallet",
        description: "Connect your wallet to interact with the community features",
        variant: "default"
      });
    }
  }, [isConnected]);
  useEffect(() => {
    if (isMobile) {
      setSplitScreen(false);
    }
  }, [isMobile]);
  const toggleSplitScreen = () => {
    setSplitScreen(!splitScreen);
  };
  const handleBadgeButtonClick = () => {
    setActiveTab("badges");
    if (splitScreen) {
      setSplitScreen(false);
    }
  };
  return <>
      <SEO title="Community | Scams & E-crimes Commission" description="Join the community to discuss and stay updated on the latest scams and fraud prevention." />
      
      <CompactHero title="Community" subtitle="Connect with fellow fraud fighters and stay updated on the latest scam prevention efforts" />
      
      <div className="icc-container py-8">
        {splitScreen && !isMobile ? <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Community</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBadgeButtonClick} className="flex items-center gap-2">
                  <Medal className="h-4 w-4" />
                  <span>Badge Tiers</span>
                </Button>
                <Button variant="outline" size="sm" onClick={toggleSplitScreen} className="flex items-center gap-2">
                  <LayoutPanelLeft className="h-4 w-4" />
                  <span>Tabbed View</span>
                </Button>
              </div>
            </div>
            
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[600px] flex flex-col">
                <Card className="flex-1 overflow-hidden">
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold">Announcements</h3>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <ScrollArea className="h-[520px]">
                      <div className="p-4">
                        <AnnouncementFeed useCarousel={false} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              
              <div className="h-[600px] flex flex-col">
                <LiveChat />
              </div>
            </div>
          </> : <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="flex-1 w-full">
                <TabsTrigger value="announcements" className="flex-1">
                  {isMobile ? <Megaphone className="h-5 w-5" /> : <>
                      <Megaphone className="h-4 w-4 mr-2" />
                      Announcements
                    </>}
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  {isMobile ? <MessageSquare className="h-5 w-5" /> : <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Live Chat
                    </>}
                </TabsTrigger>
                <TabsTrigger value="badges" className="flex-1">
                  {isMobile ? <Medal className="h-5 w-5" /> : <>
                      <Medal className="h-4 w-4 mr-2" />
                      Badge Tiers
                    </>}
                </TabsTrigger>
              </TabsList>
              
              {!isMobile && <Button variant="outline" size="sm" onClick={toggleSplitScreen} className="ml-2 flex items-center gap-2">
                  <Rows className="h-4 w-4" />
                  <span>Split Screen</span>
                </Button>}
            </div>
            
            
            <TabsContent value="announcements" className="mt-0">
              <AnnouncementFeed useCarousel={false} />
            </TabsContent>
            
            
            <TabsContent value="chat" className="mt-0">
              <div className="h-[600px]">
                <LiveChat />
              </div>
            </TabsContent>
            
            
            <TabsContent value="badges" className="mt-0">
              <BadgeTiersPage />
            </TabsContent>
          </Tabs>}
      </div>
    </>;
};
export default CommunityPage;
