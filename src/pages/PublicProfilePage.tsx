
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getProfileByUsername } from '@/services/profileService';
import { Twitter, Globe, Copy, ExternalLink } from 'lucide-react';
import { getScammersByReporter } from '@/services/supabaseService';
import { Profile, Scammer } from '@/types/dataTypes';

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState("reports");
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfileByUsername(username || ''),
    enabled: !!username,
  });

  const { data: scammerReports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['scammerReports', profile?.wallet_address],
    queryFn: () => getScammersByReporter(profile?.wallet_address || ''),
    enabled: !!profile?.wallet_address,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  if (error) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
                <Button asChild>
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-3 text-center md:text-left">
          <Skeleton className="h-8 w-40 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || '👤';
  };

  const truncateWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container py-10">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
          {isLoading ? (
            renderProfileSkeleton()
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={profile?.profile_pic_url} alt={profile?.display_name} />
                <AvatarFallback className="text-4xl bg-icc-gold/20 text-icc-gold">
                  {getInitials(profile?.display_name || '')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div>
                  <h1 className="text-3xl font-bold text-icc-gold">{profile?.display_name}</h1>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>
                
                <p className="text-base max-w-2xl">{profile?.bio}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile?.x_link && (
                    <a href={profile.x_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                      <Twitter size={16} />
                      <span>Twitter</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  
                  {profile?.website_link && (
                    <a href={profile.website_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                      <Globe size={16} />
                      <span>Website</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                
                {profile?.wallet_address && (
                  <div className="pt-2">
                    <Badge variant="outline" className="inline-flex gap-2 py-1.5 pl-3 pr-2 cursor-pointer" onClick={() => copyToClipboard(profile.wallet_address)}>
                      <span>{truncateWalletAddress(profile.wallet_address)}</span>
                      <Copy size={14} />
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
          
        {/* Tabs Section */}
        <Tabs defaultValue="reports" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto bg-background/60 backdrop-blur-sm rounded-lg border p-1 mb-6">
            <TabsTrigger value="reports" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
              Reports
            </TabsTrigger>
            <TabsTrigger value="bounties" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
              Bounties
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
              Info
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
              Activity
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
              Comments
            </TabsTrigger>
          </TabsList>
            
          <TabsContent value="reports" className="mt-0">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
              <h2 className="text-2xl font-bold text-icc-gold mb-6">Scammer Reports</h2>
              
              {isLoadingReports ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : scammerReports && scammerReports.length > 0 ? (
                <div className="space-y-4">
                  {scammerReports.map((scammer) => (
                    <Card key={scammer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <Link to={`/scammer/${scammer.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold">{scammer.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{scammer.accused_of}</p>
                            </div>
                            <Badge variant="secondary">${scammer.bounty_amount}</Badge>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-6">No scammer reports yet</p>
                  <Button asChild>
                    <Link to="/report">Report a Scammer <ExternalLink className="ml-2" size={16} /></Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
            
          <TabsContent value="bounties" className="mt-0">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
              <h2 className="text-2xl font-bold text-icc-gold mb-6">Bounties</h2>
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No bounties available yet</p>
              </div>
            </div>
          </TabsContent>
            
          <TabsContent value="info" className="mt-0">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
              <h2 className="text-2xl font-bold text-icc-gold mb-6">User Information</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Display Name</h3>
                    <p>{profile?.display_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Username</h3>
                    <p>@{profile?.username || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Bio</h3>
                    <p>{profile?.bio || 'No bio provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Joined</h3>
                    <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Wallet Address</h3>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{profile?.wallet_address || 'Not provided'}</p>
                      {profile?.wallet_address && (
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(profile.wallet_address)}>
                          <Copy size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
            
          <TabsContent value="activity" className="mt-0">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
              <h2 className="text-2xl font-bold text-icc-gold mb-6">Activity</h2>
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No recent activity</p>
              </div>
            </div>
          </TabsContent>
            
          <TabsContent value="comments" className="mt-0">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
              <h2 className="text-2xl font-bold text-icc-gold mb-6">Comments</h2>
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No comments yet</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicProfilePage;
