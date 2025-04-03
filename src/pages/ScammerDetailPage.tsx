
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getScammerById } from '@/services/scammerService';
import { getScammerComments, addComment } from '@/services/commentService';
import { likeScammer, dislikeScammer, getUserScammerInteraction } from '@/services/interactionService';
import CompactHero from '@/components/common/CompactHero';
import { ThumbsUp, ThumbsDown, DollarSign, Share2, ArrowLeft, Copy, User, Calendar, Link2, Eye, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import { useProfile } from '@/contexts/ProfileContext';
import { getProfileByWallet } from '@/services/profileService';
import { Scammer, Comment, Profile } from '@/types/dataTypes';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ScammerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [agreePercentage, setAgreePercentage] = useState(0);

  // Fetch scammer details
  const {
    data: scammer,
    isLoading: isLoadingScammer,
    error: errorScammer,
  } = useQuery({
    queryKey: ['scammer', id],
    queryFn: () => getScammerById(id || ''),
    enabled: !!id,
  });

  // Fetch comments for the scammer
  const {
    data: comments,
    isLoading: isLoadingComments,
    error: errorComments,
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getScammerComments(id || ''),
    enabled: !!id,
  });

  // Fetch user interaction (like/dislike)
  useEffect(() => {
    const fetchUserInteraction = async () => {
      if (!profile?.wallet_address || !scammer?.id) return;
      
      try {
        const interaction = await getUserScammerInteraction(scammer.id, profile.wallet_address);
        if (interaction) {
          setIsLiked(interaction.liked);
          setIsDisliked(interaction.disliked);
        } else {
          setIsLiked(false);
          setIsDisliked(false);
        }
      } catch (error) {
        console.error('Error fetching user interaction:', error);
      }
    };
    
    fetchUserInteraction();
  }, [scammer?.id, profile?.wallet_address]);

  // Update likes and dislikes when scammer data changes
  useEffect(() => {
    if (scammer) {
      setLikes(scammer.likes || 0);
      setDislikes(scammer.dislikes || 0);
      
      // Calculate agree percentage
      const total = (scammer.likes || 0) + (scammer.dislikes || 0);
      if (total > 0) {
        setAgreePercentage(Math.round((scammer.likes || 0) * 100 / total));
      } else {
        setAgreePercentage(0);
      }
    }
  }, [scammer]);

  // Fetch creator profile on component mount
  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (scammer?.added_by) {
        try {
          const profile = await getProfileByWallet(scammer.added_by);
          setCreatorProfile(profile);
        } catch (error) {
          console.error("Error fetching creator profile:", error);
        }
      }
    };

    fetchCreatorProfile();
  }, [scammer?.added_by]);

  // Mutation to add a comment
  const addCommentMutation = useMutation({
    mutationFn: (newComment: { 
      scammer_id: string; 
      content: string; 
      author: string; 
      author_name: string; 
      author_profile_pic?: string 
    }) => addComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setCommentText('');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Handlers for like and dislike
  const handleLike = async () => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to like this report.",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await likeScammer(scammer?.id || '', profile.wallet_address);
      if (result && typeof result === 'object' && 'likes' in result) {
        setLikes(result.likes || 0);
        setDislikes(result.dislikes || 0);
        setIsLiked(!isLiked);
        setIsDisliked(false);
        
        // Recalculate agree percentage
        const total = (result.likes || 0) + (result.dislikes || 0);
        if (total > 0) {
          setAgreePercentage(Math.round((result.likes || 0) * 100 / total));
        }
        
        queryClient.setQueryData(['scammer', id], (oldScammer: Scammer | undefined) => {
          if (oldScammer) {
            return { ...oldScammer, likes: result.likes || 0, dislikes: result.dislikes || 0 };
          }
          return oldScammer;
        });
      }
    } catch (error) {
      console.error("Error liking scammer:", error);
      toast({
        title: "Error",
        description: "Failed to like this report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to dislike this report.",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await dislikeScammer(scammer?.id || '', profile.wallet_address);
      if (result && typeof result === 'object' && 'likes' in result) {
        setLikes(result.likes || 0);
        setDislikes(result.dislikes || 0);
        setIsDisliked(!isDisliked);
        setIsLiked(false);
        
        // Recalculate agree percentage
        const total = (result.likes || 0) + (result.dislikes || 0);
        if (total > 0) {
          setAgreePercentage(Math.round((result.likes || 0) * 100 / total));
        }
        
        queryClient.setQueryData(['scammer', id], (oldScammer: Scammer | undefined) => {
          if (oldScammer) {
            return { ...oldScammer, likes: result.likes || 0, dislikes: result.dislikes || 0 };
          }
          return oldScammer;
        });
      }
    } catch (error) {
      console.error("Error disliking scammer:", error);
      toast({
        title: "Error",
        description: "Failed to dislike this report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for submitting a comment
  const handleAddComment = () => {
    if (!profile) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to leave a comment.",
        variant: "destructive"
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    addCommentMutation.mutate({
      scammer_id: scammer?.id || '',
      content: commentText,
      author: profile.wallet_address,
      author_name: profile.display_name,
      author_profile_pic: profile.profile_pic_url,
    });
  };

  // Placeholder content while loading
  if (isLoadingScammer) {
    return (
      <div>
        <CompactHero title="Loading..." />
        <section className="icc-section bg-white">
          <div className="icc-container">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-8 w-1/4 mt-4" />
            <Skeleton className="h-6 w-1/2 mt-2" />
          </div>
        </section>
      </div>
    );
  }

  // Error message if scammer details could not be loaded
  if (errorScammer || !scammer) {
    return (
      <div>
        <CompactHero title="Error" />
        <section className="icc-section bg-white">
          <div className="icc-container">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center text-icc-blue mb-2">
              Failed to load scammer details.
            </h2>
            <p className="text-icc-gray text-center">
              Please try again later.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <CompactHero title={scammer.name} />

      <section className="icc-section bg-white">
        <div className="icc-container">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/most-wanted')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Most Wanted
            </Button>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Add Bounty
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                <img
                  src={scammer.photo_url || '/placeholder.svg'}
                  alt={scammer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-icc-gold text-icc-blue-dark px-4 py-2 text-sm font-bold rounded-br-lg">
                  {scammer.bounty_amount.toLocaleString()} $SEC Bounty
                </div>
              </div>

              <div className="mt-6">
                <h2 className="icc-title">Accusations</h2>
                <p className="text-icc-gray">{scammer.accused_of}</p>
              </div>

              <div className="mt-6">
                <h2 className="icc-title">Links</h2>
                {scammer.links && scammer.links.length > 0 ? (
                  <ul className="list-disc pl-5 text-icc-gray">
                    {scammer.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-icc-blue hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-icc-gray">No links provided.</p>
                )}
              </div>

              <div className="mt-6">
                <h2 className="icc-title">Aliases</h2>
                {scammer.aliases && scammer.aliases.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {scammer.aliases.map((alias, index) => (
                      <Badge key={index}>{alias}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-icc-gray">No aliases provided.</p>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-icc-blue mb-3">Reported By</h3>
                {creatorProfile ? (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={creatorProfile.profile_pic_url} alt={creatorProfile.display_name} />
                      <AvatarFallback>{creatorProfile.display_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium leading-none">{creatorProfile.display_name}</div>
                      <p className="text-sm text-gray-500">@{creatorProfile.username}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Anonymous</p>
                )}
                <Separator className="my-4" />
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Added on {formatDate(scammer.date_added)}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {scammer.views} Views
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Link2 className="h-4 w-4 mr-1" />
                    <a href="#" className="hover:underline">
                      Permalink
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-icc-blue mb-3">Take Action</h3>
                
                {/* Consensus Bar */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-icc-gray mb-1">
                          <span>Community Consensus</span>
                          <span>{agreePercentage}% Agree</span>
                        </div>
                        <Progress value={agreePercentage} className="h-2 bg-red-100">
                          <div 
                            className="h-full bg-green-500 transition-all" 
                            style={{ width: `${agreePercentage}%` }}
                          />
                        </Progress>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Based on {likes + dislikes} community votes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant={isLiked ? "iccblue" : "outline"}
                    onClick={handleLike}
                    className="w-full justify-center"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    Agree{likes > 0 ? ` (${likes})` : ''}
                  </Button>
                  
                  <Button 
                    variant={isDisliked ? "destructive" : "outline"}
                    onClick={handleDislike}
                    className="w-full justify-center"
                  >
                    <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                    Disagree{dislikes > 0 ? ` (${dislikes})` : ''}
                  </Button>
                  
                  <div className="bg-icc-gold/20 border border-icc-gold/50 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-icc-blue">Current Bounty</h4>
                      <span className="text-xl font-bold text-icc-blue">{scammer.bounty_amount.toLocaleString()} $SEC</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-icc-gray mb-3">
                      <TrendingUp className="h-4 w-4" />
                      <span>Top 5% of all bounties</span>
                    </div>
                    
                    <div className="text-sm text-icc-gray mb-4">
                      Add to this bounty to increase visibility and encourage information sharing about this scammer.
                    </div>
                    
                    <Button variant="outline" className="w-full justify-center bg-icc-gold/20 text-icc-blue border-icc-gold/50 hover:bg-icc-gold/30">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      Add Bounty
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="icc-section bg-gray-50">
        <div className="icc-container">
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto bg-background/60 backdrop-blur-sm rounded-lg border p-1 mb-6">
              <TabsTrigger value="comments" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                Comments
              </TabsTrigger>
              <TabsTrigger value="evidence" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                Evidence
              </TabsTrigger>
              <TabsTrigger value="official" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                Official Response
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-2">
              <div className="mb-4">
                <Textarea
                  placeholder="Write your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  className="mt-2"
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending}
                >
                  {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                </Button>
              </div>

              {isLoadingComments ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : errorComments ? (
                <div className="text-red-500">Error loading comments.</div>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4 py-4 border-b">
                    <Avatar>
                      <AvatarImage src={comment.author_profile_pic || '/placeholder.svg'} alt={comment.author_name} />
                      <AvatarFallback>{comment.author_name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.author_name}</div>
                      <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No comments yet. Be the first to comment!</div>
              )}
            </TabsContent>
            <TabsContent value="evidence" className="mt-2">
              <div>No evidence provided.</div>
            </TabsContent>
            <TabsContent value="official" className="mt-2">
              <div>No official response yet.</div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ScammerDetailPage;
