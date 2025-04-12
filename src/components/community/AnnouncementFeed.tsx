
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProfile } from '@/contexts/ProfileContext';
import { getAnnouncements, createAnnouncement } from '@/services/communityService';
import { Announcement } from '@/types/dataTypes';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Megaphone, Calendar, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import ReactionButton from './ReactionButton';

const ADMIN_USERNAMES = ['sec', 'thesec'];

const AnnouncementFeed = () => {
  const { profile, isConnected } = useProfile();
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isAdmin = profile?.username && ADMIN_USERNAMES.includes(profile.username);
  
  // Fetch announcements
  const { data: announcements = [], refetch, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });
  
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
      await createAnnouncement({
        content: newAnnouncement,
        author_id: profile?.wallet_address || '',
        author_name: profile?.display_name || '',
        author_username: profile?.username || '',
        author_profile_pic: profile?.profile_pic_url || '',
      });
      
      setNewAnnouncement('');
      refetch();
      
      toast({
        title: "Announcement posted",
        description: "Your announcement has been posted successfully",
        variant: "default",
      });
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
  
  return (
    <div className="space-y-6">
      {/* Admin Post Form */}
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
              <Textarea
                placeholder="Write an announcement for the community..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className="min-h-[120px]"
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
      
      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-center">No Announcements Yet</h3>
            <p className="text-muted-foreground text-center mt-1">
              Check back later for updates from the team
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement: Announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={announcement.author_profile_pic} alt={announcement.author_name} />
                      <AvatarFallback>{announcement.author_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {announcement.author_name}
                        <span className="text-icc-gold ml-1 font-bold">@{announcement.author_username}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                  </div>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="py-4">
                <div className="whitespace-pre-wrap">{announcement.content}</div>
              </CardContent>
              
              <CardFooter className="bg-muted/30 py-2 flex justify-between items-center">
                <ReactionButton itemId={announcement.id} itemType="announcement" />
                <div className="text-xs text-muted-foreground">
                  Official SEC Announcement
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementFeed;
