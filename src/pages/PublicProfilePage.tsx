import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getProfileByUsername, getProfileByWallet } from '@/services/profileService';
import { Twitter, Globe, Copy, ExternalLink, Share2, Edit, LogOut, ExternalLinkIcon, ThumbsUp, MessageSquare, FileText, Trophy, Wallet as WalletIcon, Info, Package } from 'lucide-react';
import { getScammersByReporter, getLikedScammersByUser } from '@/services/scammerService';
import { getUserBountyContributions } from '@/services/bountyService';
import { Profile, Scammer } from '@/types/dataTypes';
import ScammerCard from '@/components/common/ScammerCard';
import { useProfile } from '@/contexts/ProfileContext';
import WalletBalance from '@/components/profile/WalletBalance';
import WalletInfo from '@/components/profile/WalletInfo';
import { useBadgeTier } from '@/hooks/useBadgeTier';
import BadgeTier from '@/components/profile/BadgeTier';
import { useIsMobile } from '@/hooks/use-mobile';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { formatCurrency } from '@/utils/formatCurrency';

const PublicProfilePage = () => {
  const {
    username,
    address
  } = useParams<{
    username?: string;
    address?: string;
  }>();
  const [activeTab, setActiveTab] = useState("reports");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile: currentUserProfile,
    disconnectWallet
  } = useProfile();
  const userIdentifier = address || username;
  const isWalletAddress = address || username && username.length > 30;
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', userIdentifier, isWalletAddress],
    queryFn: async () => {
      if (!userIdentifier) return null;
      if (isWalletAddress) {
        return getProfileByWallet(userIdentifier);
      }
      return getProfileByUsername(userIdentifier);
    },
    enabled: !!userIdentifier
  });
  useEffect(() => {
    refetch();
  }, [location, refetch]);
  const isOwnProfile = currentUserProfile?.wallet_address === profile?.wallet_address;
  const {
    data: bountyContributions,
    isLoading: isLoadingBounties
  } = useQuery({
    queryKey: ['userBounties', profile?.id],
    queryFn: () => getUserBountyContributions(profile?.id || '', 1, 50),
    enabled: !!profile?.id
  });
  const badgeInfo = useBadgeTier(profile?.sec_balance || null);
  const {
    data: scammerReports,
    isLoading: isLoadingReports
  } = useQuery({
    queryKey: ['scammerReports', profile?.id],
    queryFn: () => getScammersByReporter(profile?.id || ''),
    enabled: !!profile?.id
  });
  const {
    data: likedScammers,
    isLoading: isLoadingLikedScammers
  } = useQuery({
    queryKey: ['likedScammers', profile?.id],
    queryFn: () => getLikedScammersByUser(profile?.id || ''),
    enabled: !!profile?.id
  });
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard"
    });
  };
  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.display_name}'s Profile | SEC.digital`,
        text: `Check out ${profile?.display_name}'s profile on SEC.digital`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        copyProfileLink();
      });
    } else {
      copyProfileLink();
    }
  };
  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Profile link copied to clipboard"
    });
  };
  const handleEditProfile = () => {
    navigate('/profile');
  };
  const handleDisconnectWallet = () => {
    disconnectWallet();
    navigate('/');
  };
  const isMobile = useIsMobile();
  if (error) {
    return <div className="container py-10">
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
      </div>;
  }
  const renderProfileSkeleton = () => <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-3 text-center md:text-left">
          <Skeleton className="h-8 w-40 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>;
  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || '👤';
  };
  const truncateWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  const defaultShareImage = '/lovable-uploads/3f23090d-4e36-43fc-b230-a8f898d7edd2.png';
  const pageImage = profile?.profile_pic_url || defaultShareImage;
  const pageTitle = profile ? `${profile.display_name} (@${profile.username}) | SEC.digital` : 'Profile | SEC.digital';
  const pageDescription = profile?.bio || `Check out this profile on SEC.digital - The Scams & E-crimes Commission`;
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  return <HelmetProvider>
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          
          <meta property="og:type" content="profile" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={pageImage} />
          
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={window.location.href} />
          <meta property="twitter:title" content={pageTitle} />
          <meta property="twitter:description" content={pageDescription} />
          <meta property="twitter:image" content={pageImage} />
        </Helmet>
        
        <div className="container py-10">
          <div className="space-y-8">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
              {isLoading ? renderProfileSkeleton() : <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src={profile?.profile_pic_url} alt={profile?.display_name} />
                    <AvatarFallback className="text-4xl bg-icc-gold/20 text-icc-gold">
                      {getInitials(profile?.display_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                      <div className="flex items-center gap-2 relative">
                        <h1 className="text-3xl font-bold text-icc-gold">{profile?.display_name}</h1>
                        {badgeInfo && <div className="absolute -top-1 -right-6 ml-2">
                            <BadgeTier badgeInfo={badgeInfo} showTooltip={true} size="sm" variant="plain" />
                          </div>}
                      </div>
                      <div className="flex items-center space-x-3 mt-3 md:mt-0 p-0">
                        {isOwnProfile && <>
                            <Button variant="outline" size="sm" onClick={handleEditProfile} className="flex items-center gap-1 border-neutral-500 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 
                                           dark:border-icc-blue-light dark:text-white dark:hover:bg-icc-blue-dark dark:hover:text-white">
                              <Edit size={16} />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDisconnectWallet} className="flex items-center gap-1 border-red-500 text-red-700 hover:bg-red-50 hover:text-red-900
                                           dark:border-red-400 dark:text-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-200">
                              <LogOut size={16} />
                              Disconnect
                            </Button>
                          </>}
                        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={shareProfile}>
                          <Share2 size={16} />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground">@{profile?.username}</p>
                    <p className="text-base max-w-2xl">{profile?.bio}</p>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {profile?.x_link && <a href={profile.x_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors" title="Twitter/X">
                          <Twitter size={20} />
                        </a>}
                      
                      {profile?.website_link && <a href={profile.website_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors" title="Website">
                          <Globe size={20} />
                        </a>}
                    </div>
                    
                    {profile?.wallet_address && <div className="pt-2">
                        <Badge variant="outline" className="inline-flex gap-2 py-1.5 pl-3 pr-2 cursor-pointer" onClick={() => copyToClipboard(profile.wallet_address)}>
                          <span>{truncateWalletAddress(profile.wallet_address)}</span>
                          <Copy size={14} />
                        </Badge>
                      </div>}
                  </div>
                </div>}
            </div>
            
            <Tabs defaultValue="reports" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto bg-background/60 backdrop-blur-sm rounded-lg border p-1 mb-6">
                <TabsTrigger value="reports" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                  {isMobile ? <FileText className="h-5 w-5" /> : <>
                      <FileText className="h-4 w-4 mr-2" />
                      Reports
                    </>}
                </TabsTrigger>
                <TabsTrigger value="bounties" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                  {isMobile ? <Package className="h-5 w-5" /> : <>
                      <Package className="h-4 w-4 mr-2" />
                      Bounties
                    </>}
                </TabsTrigger>
                <TabsTrigger value="wallet" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                  {isMobile ? <WalletIcon className="h-5 w-5" /> : <>
                      <WalletIcon className="h-4 w-4 mr-2" />
                      Wallet
                    </>}
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                  {isMobile ? <Info className="h-5 w-5" /> : <>
                      <Info className="h-4 w-4 mr-2" />
                      Info
                    </>}
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                  {isMobile ? <ThumbsUp className="h-5 w-5" /> : <>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Agreed
                    </>}
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                  {isMobile ? <MessageSquare className="h-5 w-5" /> : <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comments
                    </>}
                </TabsTrigger>
              </TabsList>
                
              <TabsContent value="reports" className="mt-0">
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
                  <h2 className="text-2xl font-bold text-icc-gold mb-6">Reports</h2>
                  
                  {isLoadingReports ? <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                    </div> : scammerReports && scammerReports.length > 0 ? <div className="space-y-4">
                      {scammerReports.map(scammer => <Card key={scammer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <Link to={`/report/${scammer.report_number}`}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold">{scammer.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{scammer.accused_of}</p>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <CurrencyIcon size="sm" />
                                  {formatCurrency(scammer.bounty_amount)}
                                </Badge>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>)}
                    </div> : <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg mb-6">No reports yet</p>
                      <Button asChild>
                        
                      </Button>
                    </div>}
                </div>
              </TabsContent>
              
              <TabsContent value="bounties" className="mt-0">
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-icc-gold">Bounties</h2>
                    {bountyContributions && bountyContributions.totalBountyAmount > 0 && (
                      <div className="flex items-center gap-1 text-lg font-semibold text-icc-blue dark:text-white">
                        <CurrencyIcon size="sm" />
                        {formatCurrency(bountyContributions.totalBountyAmount)} SEC
                      </div>
                    )}
                  </div>
                  
                  {isLoadingBounties ? <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                    </div> : bountyContributions && bountyContributions.contributions.length > 0 ? <div className="overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Scammer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>TX</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bountyContributions.contributions.map(contribution => <TableRow key={contribution.id}>
                              <TableCell>
                                {formatDate(contribution.created_at)}
                              </TableCell>
                              <TableCell>
                                {contribution.scammers ? <Link to={`/report/${contribution.scammers.report_number}`} className="flex items-center gap-2 hover:text-icc-gold">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={contribution.scammers.photo_url} alt={contribution.scammers.name} />
                                      <AvatarFallback className="text-xs">
                                        {contribution.scammers.name.substring(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{contribution.scammers.name}</span>
                                  </Link> : <span>Unknown Scammer</span>}
                              </TableCell>
                              <TableCell className="font-mono font-medium text-icc-blue dark:text-white flex items-center gap-1">
                                <CurrencyIcon size="sm" /> {formatCurrency(contribution.amount)} SEC
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {contribution.comment || "-"}
                              </TableCell>
                              <TableCell>
                                {contribution.transaction_signature ? <a href={`https://solscan.io/tx/${contribution.transaction_signature}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-icc-blue hover:text-icc-blue-light">
                                    View
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a> : "-"}
                              </TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                      
                      {bountyContributions.totalCount > bountyContributions.contributions.length && <div className="text-center mt-6">
                          <p className="text-sm text-muted-foreground">
                            Showing {bountyContributions.contributions.length} of {bountyContributions.totalCount} contributions
                          </p>
                        </div>}
                    </div> : <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">No bounties available yet</p>
                    </div>}
                </div>
              </TabsContent>
              
              <TabsContent value="wallet" className="mt-0">
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
                  <h2 className="text-2xl font-bold text-icc-gold mb-6">Wallet</h2>
                  
                  <div className="space-y-8">
                    {profile?.wallet_address ? <>
                        <WalletBalance walletAddress={profile.wallet_address} />
                        <WalletInfo walletAddress={profile.wallet_address} isOwnProfile={isOwnProfile} secBalance={profile?.sec_balance} />
                      </> : <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No wallet information available</p>
                      </div>}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="mt-0">
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
                  <h2 className="text-2xl font-bold text-icc-gold mb-6">User Information</h2>
                  {isLoading ? <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div> : <div className="space-y-4">
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
                          {profile?.wallet_address && <Button variant="ghost" size="sm" onClick={() => copyToClipboard(profile.wallet_address)}>
                              <Copy size={14} />
                            </Button>}
                        </div>
                      </div>
                    </div>}
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-0">
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border">
                  <h2 className="text-2xl font-bold text-icc-gold mb-6 flex items-center">
                    <ThumbsUp className="mr-2 h-6 w-6" />
                    Agreed
                  </h2>
                  
                  {isLoadingLikedScammers ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
                    </div> : likedScammers && likedScammers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {likedScammers.map(scammer => <ScammerCard key={scammer.id} scammer={scammer} />)}
                    </div> : <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg mb-6">No liked reports yet</p>
                      <Button asChild>
                        <Link to="/most-wanted">Browse Scammers <ExternalLink className="ml-2" size={16} /></Link>
                      </Button>
                    </div>}
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
      </>
    </HelmetProvider>;
};
export default PublicProfilePage;
