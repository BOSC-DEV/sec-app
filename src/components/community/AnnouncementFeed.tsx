import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  getAnnouncements, 
  createAnnouncement, 
  incrementAnnouncementViews,
  deleteAnnouncement,
  editAnnouncement,
  isUserAdmin,
  createSurveyAnnouncement,
  voteSurvey,
  getUserSurveyVote
} from '@/services/communityService';
import { notifyAllUsersAboutAnnouncement } from '@/services/notificationService';
import { Announcement } from '@/types/dataTypes';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Megaphone, 
  Calendar, 
  AlertCircle, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Search,
  BarChart3
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import AnnouncementReplies from './AnnouncementReplies';
import CommunityInteractionButtons from './CommunityInteractionButtons';
import AdminContextMenu from './AdminContextMenu';
import RichTextEditor from './RichTextEditor';
import SurveyCreator from './SurveyCreator';
import SurveyDisplay from './SurveyDisplay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatTimeAgo } from '@/utils/formatTime';
import { useBadgeTier } from '@/hooks/useBadgeTier';
import { isAdmin } from '@/utils/adminUtils';
import { BadgeTier } from '@/utils/badgeUtils';

const AnnouncementFeed: React.FC<AnnouncementFeedProps> = ({ useCarousel = false }) => {
  const { profile, isConnected } = useProfile();
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);
  const [viewedAnnouncements, setViewedAnnouncements] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserAdminState, setIsUserAdmin] = useState(false);
  const [canCreateAnnouncements, setCanCreateAnnouncements] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementTab, setAnnouncementTab] = useState<'post' | 'survey'>('post');
  const [userSurveyVotes, setUserSurveyVotes] = useState<Record<string, number>>({});
  const [loadingVotes, setLoadingVotes] = useState(true);
  const badgeInfo = useBadgeTier(profile?.sec_balance || 0);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  
  useEffect(() => {
    if (profile?.username) {
      const adminStatus = isAdmin(profile.username);
      console.log(`User ${profile.username} admin status: ${adminStatus}`);
      setIsUserAdmin(adminStatus);
      
      const checkAdmin = async () => {
        if (!adminStatus && profile?.username) {
          try {
            const serverAdminStatus = await isUserAdmin(profile.username);
            console.log(`Server admin check for ${profile.username}: ${serverAdminStatus}`);
            setIsUserAdmin(prevStatus => prevStatus || serverAdminStatus);
          } catch (error) {
            console.error('Error checking admin status:', error);
          }
        }
      };
      
      checkAdmin();
    } else {
      setIsUserAdmin(false);
    }

    const isWhale = badgeInfo?.tier === BadgeTier.Whale;
    setCanCreateAnnouncements(isUserAdminState || isWhale);
  }, [profile?.username, isUserAdminState, badgeInfo]);
  
  const { data: announcements = [], refetch, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });
  
  useEffect(() => {
    const loadUserVotes = async () => {
      try {
        let storedVotes = {};
        try {
          storedVotes = JSON.parse(localStorage.getItem('userSurveyVotes') || '{}');
        } catch (error) {
          console.error("Error reading from localStorage:", error);
        }
        
        const tempVotes = { ...storedVotes };
        
        if (!profile?.wallet_address) {
          setUserSurveyVotes(tempVotes);
          setLoadingVotes(false);
          return;
        }
        
        try {
          setLoadingVotes(true);
          const surveyAnnouncements = announcements.filter(a => a.survey_data);
          let serverVotesFound = false;
          
          for (const announcement of surveyAnnouncements) {
            if (announcement.survey_data) {
              const userVote = await getUserSurveyVote(announcement.id, profile.wallet_address);
              if (userVote !== undefined) {
                tempVotes[announcement.id] = userVote;
                serverVotesFound = true;
              }
            }
          }
          
          console.log("User survey votes loaded:", tempVotes);
          
          setUserSurveyVotes(tempVotes);
          
          if (serverVotesFound) {
            localStorage.setItem('userSurveyVotes', JSON.stringify(tempVotes));
          }
        } catch (error) {
          console.error("Error loading user votes:", error);
        } finally {
          setLoadingVotes(false);
        }
      } catch (error) {
        console.error("Error in vote loading process:", error);
        setLoadingVotes(false);
      }
    };
    
    loadUserVotes();
  }, [announcements, profile?.wallet_address]);
  
  const filteredAnnouncements = React.useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    
    const query = searchQuery.toLowerCase();
    return announcements.filter(announcement => 
      announcement.content.toLowerCase().includes(query) || 
      announcement.author_name.toLowerCase().includes(query) ||
      (announcement.author_username && announcement.author_username.toLowerCase().includes(query)) ||
      (announcement.survey_data?.title.toLowerCase().includes(query))
    );
  }, [searchQuery, announcements]);
  
  useEffect(() => {
    if (currentIndex >= filteredAnnouncements.length && filteredAnnouncements.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredAnnouncements.length, currentIndex]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateAnnouncements) {
      toast({
        title: "Unauthorized",
        description: "Only administrators and Whale badge holders can post announcements",
        variant: "destructive",
      });
      return;
    }
    
    if (!newAnnouncement.trim()) {
      toast({
        title: "Empty announcement",
        description: "Please enter an announcement",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const createdAnnouncement = await createAnnouncement({
        content: newAnnouncement,
        author_id: profile?.wallet_address || '',
        author_name: profile?.display_name || '',
        author_username: profile?.username || '',
        author_profile_pic: profile?.profile_pic_url || '',
        likes: 0,
        dislikes: 0
      });
      
      if (createdAnnouncement) {
        await notifyAllUsersAboutAnnouncement(
          createdAnnouncement.id,
          createdAnnouncement.content,
          profile?.wallet_address || '',
          profile?.display_name || '',
          profile?.username,
          profile?.profile_pic_url
        );
        
        toast({
          title: "Announcement posted",
          description: "Your announcement has been posted and all users have been notified",
          variant: "default",
        });
      } else {
        throw new Error("Failed to create announcement");
      }
      
      setNewAnnouncement('');
      refetch();
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to post announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateSurvey = async (title: string, options: string[]) => {
    if (!canCreateAnnouncements) {
      toast({
        title: "Unauthorized",
        description: "Only administrators and Whale badge holders can create surveys",
        variant: "destructive",
      });
      return;
    }
    
    setIsSurveySubmitting(true);
    
    try {
      const createdSurvey = await createSurveyAnnouncement(
        title,
        options,
        {
          author_id: profile?.wallet_address || '',
          author_name: profile?.display_name || '',
          author_username: profile?.username || '',
          author_profile_pic: profile?.profile_pic_url || '',
          likes: 0,
          dislikes: 0
        }
      );
      
      if (createdSurvey) {
        await notifyAllUsersAboutAnnouncement(
          createdSurvey.id,
          `New survey: ${title}`,
          profile?.wallet_address || '',
          profile?.display_name || '',
          profile?.username,
          profile?.profile_pic_url
        );
        
        toast({
          title: "Survey created",
          description: "Your survey has been created and all users have been notified",
          variant: "default",
        });
        
        refetch();
      } else {
        throw new Error("Failed to create survey");
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      toast({
        title: "Error",
        description: "Failed to create survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSurveySubmitting(false);
    }
  };
  
  const handleSurveyVote = async (announcementId: string, optionIndex: number) => {
    if (!profile?.wallet_address || !badgeInfo?.tier) {
      toast({
        title: "Can't vote",
        description: "You need to be connected and have a badge to vote",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const success = await voteSurvey(
        announcementId, 
        optionIndex, 
        profile.wallet_address,
        badgeInfo.tier,
        profile.display_name,
        profile.username
      );
      
      if (success) {
        const updatedVotes = {
          ...userSurveyVotes,
          [announcementId]: optionIndex
        };
        
        setUserSurveyVotes(updatedVotes);
        
        try {
          localStorage.setItem('userSurveyVotes', JSON.stringify(updatedVotes));
        } catch (error) {
          console.error("Error storing vote in localStorage:", error);
        }
        
        await refetch();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error voting in survey:', error);
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleDeleteAnnouncement = async (id: string) => {
    if (!isUserAdminState) return;
    
    try {
      const success = await deleteAnnouncement(id);
      if (success) {
        toast({
          title: "Announcement deleted",
          description: "The announcement has been deleted successfully",
          variant: "default",
        });
        refetch();
      } else {
        throw new Error("Failed to delete announcement");
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (announcement: Announcement) => {
    setEditContent(announcement.content);
    setEditingAnnouncementId(announcement.id);
    setEditDialogOpen(true);
  };
  
  const handleEditAnnouncement = async () => {
    if (!editingAnnouncementId || !isUserAdminState) return;
    
    try {
      const updated = await editAnnouncement(editingAnnouncementId, editContent);
      if (updated) {
        toast({
          title: "Announcement updated",
          description: "The announcement has been updated successfully",
          variant: "default",
        });
        setEditDialogOpen(false);
        refetch();
      } else {
        throw new Error("Failed to update announcement");
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePrevAnnouncement = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredAnnouncements.length - 1));
  };
  
  const handleNextAnnouncement = () => {
    setCurrentIndex(prev => (prev < filteredAnnouncements.length - 1 ? prev + 1 : 0));
  };
  
  useEffect(() => {
    if (!filteredAnnouncements.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const announcementId = entry.target.getAttribute('data-announcement-id');
            if (announcementId && !viewedAnnouncements.has(announcementId)) {
              incrementAnnouncementViews(announcementId);
              setViewedAnnouncements(prev => new Set(prev).add(announcementId));
            }
          }
        });
      },
      { threshold: 0.7 }
    );
    
    const elements = document.querySelectorAll('.announcement-card');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [filteredAnnouncements, viewedAnnouncements]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-md h-40 w-full"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (announcements.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-center">No Announcements Yet</h3>
          <p className="text-muted-foreground text-center mt-1">
            Check back later for updates from the team
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const renderAnnouncementCard = (announcement: Announcement) => {
    const time = formatTimeAgo(announcement.created_at);
    
    const surveyData = announcement.survey_data ? {
      id: announcement.id,
      title: announcement.survey_data.title,
      options: announcement.survey_data.options,
      userVote: userSurveyVotes[announcement.id]
    } : undefined;

    const cardContent = (
      <Card 
        key={announcement.id} 
        className="announcement-card overflow-hidden h-full"
        data-announcement-id={announcement.id}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {announcement.author_username ? (
                <Link to={`/profile/${announcement.author_username}`}>
                  <Avatar className="h-8 w-8 mr-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={announcement.author_profile_pic} alt={announcement.author_name} />
                    <AvatarFallback>{announcement.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={announcement.author_profile_pic} alt={announcement.author_name} />
                  <AvatarFallback>{announcement.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <div className="font-medium">
                  {announcement.author_username ? (
                    <Link to={`/profile/${announcement.author_username}`} className="hover:underline">
                      {announcement.author_name}
                    </Link>
                  ) : (
                    announcement.author_name
                  )}
                </div>
                <div className="text-xs text-icc-gold font-medium mt-0.5">
                  {announcement.survey_data ? "SEC Community Survey" : "Official SEC Announcement"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              {time}
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="py-4">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: announcement.content }} />
          
          {surveyData && (
            <SurveyDisplay 
              survey={surveyData}
              onVote={handleSurveyVote}
            />
          )}
        </CardContent>
        
        <CardFooter className="pt-0 px-6 pb-3 flex flex-col items-start">
          <div className="w-full flex justify-between items-center">
            <CommunityInteractionButtons 
              itemId={announcement.id} 
              itemType="announcement"
              initialLikes={announcement.likes}
              initialDislikes={announcement.dislikes}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {announcement.views || 0}
              </div>
            </div>
          </div>
          
          <AnnouncementReplies 
            announcementId={announcement.id} 
            isAdmin={isUserAdminState} 
            refetch={refetch}
          />
        </CardFooter>
      </Card>
    );
    
    return isUserAdminState ? (
      <AdminContextMenu 
        key={announcement.id}
        onEdit={() => openEditDialog(announcement)}
        onDelete={() => handleDeleteAnnouncement(announcement.id)}
      >
        {cardContent}
      </AdminContextMenu>
    ) : cardContent;
  };
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {filteredAnnouncements.length === 0 && searchQuery !== '' && (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-center">No Matching Announcements</h3>
            <p className="text-muted-foreground text-center mt-1">
              No announcements match your search query "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      )}
      
      {(isUserAdminState || badgeInfo?.tier === BadgeTier.Whale) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Megaphone className="h-5 w-5 mr-2 text-icc-gold" />
              <h3 className="text-lg font-medium">
                {isUserAdminState ? "Admin Tools" : "Whale Badge Privileges"}
              </h3>
            </div>
            <Tabs value={announcementTab} onValueChange={(value) => setAnnouncementTab(value as 'post' | 'survey')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="post">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Post Announcement
                </TabsTrigger>
                <TabsTrigger value="survey">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Create Poll
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="post" className="mt-4">
                <form onSubmit={handleSubmit}>
                  <RichTextEditor 
                    value={newAnnouncement}
                    onChange={setNewAnnouncement}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !newAnnouncement.trim()}
                    >
                      {isSubmitting ? "Posting..." : "Post Announcement"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="survey" className="mt-4">
                <SurveyCreator 
                  onCreateSurvey={handleCreateSurvey}
                  isSubmitting={isSurveySubmitting}
                />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      )}
      
      {useCarousel ? (
        <>
          <Carousel className="w-full">
            <CarouselContent>
              {filteredAnnouncements.map((announcement) => (
                <CarouselItem key={announcement.id}>
                  {renderAnnouncementCard(announcement)}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <div className="text-center text-muted-foreground text-sm">
            {currentIndex + 1} of {filteredAnnouncements.length} announcements
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map(renderAnnouncementCard)}
        </div>
      )}
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RichTextEditor 
              value={editContent}
              onChange={setEditContent}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAnnouncement}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AnnouncementFeedProps {
  useCarousel?: boolean;
}

export default AnnouncementFeed;
