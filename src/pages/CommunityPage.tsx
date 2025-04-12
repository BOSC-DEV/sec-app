
import React, { useState } from 'react';
import SEO from '@/components/common/SEO';
import CompactHero from '@/components/common/CompactHero';
import AnnouncementFeed from '@/components/community/AnnouncementFeed';
import LiveChat from '@/components/community/LiveChat';
import KeyUpdatesComponent from '@/components/community/KeyUpdates';
import SupportTicketForm from '@/components/community/SupportTicketForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, AlertCircle, Megaphone } from 'lucide-react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <>
      <SEO 
        title="Community Support & Updates | Scams & E-crimes Commission"
        description="Get the latest updates, support, and connect with our community"
      />
      
      <CompactHero
        title="Community Support"
        subtitle="Stay informed, get help, and connect with our community"
      />
      
      <div className="icc-container py-8">
        <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Key Updates
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Support
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="announcements">
            <AnnouncementFeed />
          </TabsContent>
          
          <TabsContent value="updates">
            <KeyUpdatesComponent />
          </TabsContent>
          
          <TabsContent value="support">
            <SupportTicketForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CommunityPage;
