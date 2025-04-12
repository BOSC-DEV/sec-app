import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  getAnnouncements, 
  createAnnouncement, 
  incrementAnnouncementViews,
  deleteAnnouncement,
  editAnnouncement,
  isUserAdmin
} from '@/services/communityService';
import { notifyAllUsersAboutAnnouncement } from '@/services/notificationService';
import { Announcement } from '@/types/dataTypes';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Megaphone, 
  Calendar, 
  AlertCircle, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Search
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import ReactionButton from './ReactionButton';
import RichTextEditor from './RichTextEditor';
import AnnouncementReplies from './AnnouncementReplies';
import AdminContextMenu from './AdminContextMenu';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ADMIN_USERNAMES = ['sec', 'thesec'];

interface AnnouncementFeedProps {
  useCarousel?: boolean;
}

const AnnouncementFeed: React.FC<AnnouncementFeedProps> = ({ useCarousel = false }) => {
  const { profile, isConnected } = useProfile();
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewedAnnouncements, setViewedAnnouncements] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (profile?.username) {
        const admin = await isUserAdmin(profile.username);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [profile?.username]);
  
  const { data: announcements = [], refetch, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });
  
  const filteredAnnouncements = React.useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    
    const query = searchQuery.toLowerCase();
    return announcements.filter(announcement => 
      announcement.content.toLowerCase().includes(query) || 
      announcement.author_name.toLowerCase().includes(query) ||
      (announcement.author_username && announcement.author_username.toLowerCase().includes(query))
    );
  }, [searchQuery, announcements]);
  
  useEffect(() => {
    if (currentIndex >= filteredAnnouncements.length && filteredAnnouncements.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredAnnouncements.length, currentIndex]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "Only admins can post announcements",
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
      });
      
      if (createdAnnouncement) {
        // Notify all users about the new announcement
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
  
  const handleDeleteAnnouncement = async (id: string) => {
    if (!isAdmin) return;
    
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
    if (!editingAnnouncementId || !isAdmin) return;
    
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
    const formatTimeStamp = (dateString: string) => {
      const distance = formatDistanceToNow(new Date(dateString), { addSuffix: true });
      
      if (distance.includes('second')) return distance.replace(' seconds ago', 's').replace(' second ago', 's');
      if (distance.includes('minute')) return distance.replace(' minutes ago', 'm').replace(' minute ago', 'm');
      if (distance.includes('hour')) return distance.replace(' hours ago', 'h').replace(' hour ago', 'h');
      if (distance.includes('day')) return distance.replace(' days ago', 'd').replace(' day ago', 'd');
      if (distance.includes('week')) return distance.replace(' weeks ago', 'w').replace(' week ago', 'w');
      if (distance.includes('month')) return distance.replace(' months ago', 'mo').replace(' month ago', 'mo');
      if (distance.includes('year')) return distance.replace(' years ago', 'y').replace(' year ago', 'y');
      
      return distance;
    };

    const time = formatTimeStamp(announcement.created_at);

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
                      <span className="text-icc-gold ml-1 font-bold">@{announcement.author_username}</span>
                    </Link>
                  ) : (
                    <>
                      {announcement.author_name}
                      <span className="text-icc-gold ml-1 font-bold">@{announcement.author_username}</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-icc-gold font-medium mt-0.5">
                  Official SEC Announcement
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
        </CardContent>
        
        <CardFooter className="pt-0 px-6 pb-3 flex flex-col items-start">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {announcement.views || 0}
              </div>
            </div>
            <div className="bg-accent/10 rounded-md py-1.5 px-2">
              <ReactionButton itemId={announcement.id} itemType="announcement" />
            </div>
          </div>
          
          <AnnouncementReplies announcementId={announcement.id} isAdmin={isAdmin} />
        </CardFooter>
      </Card>
    );
    
    return isAdmin ? (
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
      
      {isAdmin && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Megaphone className="h-5 w-5 mr-2 text-icc-gold" />
              <h3 className="text-lg font-medium">Post New Announcement</h3>
            </div>
          </CardHeader>
          
          <CardContent>
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
          </CardContent>
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

export default AnnouncementFeed;
