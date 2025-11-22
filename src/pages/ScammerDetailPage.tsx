import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getScammerById, deleteScammer, unarchiveScammer } from '@/services/scammerService';
import { getScammerComments, addComment } from '@/services/commentService';
import { commentReplyService, CommentReply } from '@/services/commentReplyService';
import { likeScammer, dislikeScammer, getUserScammerInteraction, likeComment, dislikeComment, getUserCommentInteraction } from '@/services/interactionService';
import { isScammerCreator } from '@/services/reportService';
import { addBountyContribution, getScammerBountyContributions, getUserContributionAmountForScammer } from '@/services/bountyService';
import CompactHero from '@/components/common/CompactHero';
import BountyContributionList from '@/components/scammer/BountyContributionList';
import BountyTransferDialog from '@/components/scammer/BountyTransferDialog';
import { CommentReplyItem } from '@/components/common/CommentReplyItem';
import { ThumbsUp, ThumbsDown, DollarSign, Share2, ArrowLeft, Copy, User, Calendar, Link2, Eye, AlertTriangle, Shield, TrendingUp, Edit, Clipboard, Trash2, MessageSquare, Users, FileText, Wallet2, ShieldCheck, ArchiveRestore, Reply } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { useProfile } from '@/contexts/ProfileContext';
import { getProfileById } from '@/services/profileService';
import { Scammer, Comment, Profile, BountyContribution } from '@/types/dataTypes';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import { sendTransactionToDevWallet, connectPhantomWallet } from '@/utils/phantomWallet';
import { PROFILE_UPDATED_EVENT } from '@/contexts/ProfileContext';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import BountyForm from '@/components/scammer/BountyForm';
import { ArrowLeftRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Comment item component with like/dislike and reply functionality
const CommentItem = ({ comment, profile }: { comment: Comment; profile: Profile | null }) => {
  const [likes, setLikes] = useState(comment.likes || 0);
  const [dislikes, setDislikes] = useState(comment.dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [replies, setReplies] = useState<CommentReply[]>([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Load user interaction and replies on mount
  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;
      
      try {
        const interaction = await getUserCommentInteraction(comment.id, profile.id);
        if (interaction) {
          setIsLiked(interaction.liked);
          setIsDisliked(interaction.disliked);
        }
        
        // Fetch replies
        const fetchedReplies = await commentReplyService.fetchReplies(comment.id);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error('Error loading comment data:', error);
      }
    };
    
    loadData();
  }, [comment.id, profile?.id]);

  const handleLike = async () => {
    if (!profile?.id || isLoading) return;
    setIsLoading(true);
    
    try {
      const result = await likeComment(comment.id, profile.id);
      if (result) {
        setLikes(result.likes);
        setDislikes(result.dislikes);
        setIsLiked(!isLiked);
        if (isDisliked) setIsDisliked(false);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!profile?.id || isLoading) return;
    setIsLoading(true);
    
    try {
      const result = await dislikeComment(comment.id, profile.id);
      if (result) {
        setLikes(result.likes);
        setDislikes(result.dislikes);
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(false);
      }
    } catch (error) {
      console.error('Error disliking comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !profile) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingReply(true);
    try {
      await commentReplyService.addReply(
        comment.id,
        replyContent,
        profile.id,
        profile.display_name,
        profile.profile_pic_url
      );
      
      // Refresh replies
      const fetchedReplies = await commentReplyService.fetchReplies(comment.id);
      setReplies(fetchedReplies);
      
      setReplyContent('');
      setShowReplyForm(false);
      
      toast({
        title: "Success",
        description: "Reply added successfully"
      });
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const refreshReplies = async () => {
    try {
      const fetchedReplies = await commentReplyService.fetchReplies(comment.id);
      setReplies(fetchedReplies);
    } catch (error) {
      console.error('Error refreshing replies:', error);
    }
  };

  return (
    <div className="flex items-start space-x-4 py-4 border-b">
      <Avatar>
        <AvatarImage src={comment.author_profile_pic || '/placeholder.svg'} alt={`${comment.author_name}'s profile`} />
        <AvatarFallback>{comment.author_name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-medium">{comment.author_name}</div>
          {/* Date next to username on tablet/desktop, hidden on mobile */}
          <div className="hidden md:block text-sm text-muted-foreground">{formatDate(comment.created_at)}</div>
        </div>
        <p className="mt-1 break-words">{comment.content}</p>
        
        {/* Like/Dislike buttons - below comment on mobile, hidden on tablet+ */}
        <div className="flex md:hidden items-center gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLoading || !profile}
            className={`flex items-center gap-1 ${isLiked ? 'text-icc-gold' : ''}`}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            disabled={isLoading || !profile}
            className={`flex items-center gap-1 ${isDisliked ? 'text-red-500' : ''}`}
          >
            <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
            <span className="text-sm">{dislikes}</span>
          </Button>
          
          {/* Date on mobile */}
          <div className="text-xs text-muted-foreground ml-auto">{formatDate(comment.created_at)}</div>
        </div>
        
        {/* Reply button - mobile */}
        <div className="flex md:hidden mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-muted-foreground hover:text-foreground h-7 px-2"
          >
            <Reply className="h-3 w-3 mr-1" />
            <span className="text-xs">Reply {replies.length > 0 && `(${replies.length})`}</span>
          </Button>
        </div>
      </div>
      
      {/* Like/Dislike buttons on the right - tablet/desktop only */}
      <div className="hidden md:flex flex-col items-end gap-2 ml-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLoading || !profile}
            className={`flex items-center gap-1 ${isLiked ? 'text-icc-gold' : ''}`}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            disabled={isLoading || !profile}
            className={`flex items-center gap-1 ${isDisliked ? 'text-red-500' : ''}`}
          >
            <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
            <span className="text-sm">{dislikes}</span>
          </Button>
        </div>
        
        {/* Reply button - desktop */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Reply className="h-3 w-3 mr-1" />
          <span className="text-xs">Reply {replies.length > 0 && `(${replies.length})`}</span>
        </Button>
      </div>
      
      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-3 pl-4 md:pl-14 border-l-2 border-border/50">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[80px] mb-2"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleReplySubmit}
              disabled={!replyContent.trim() || isSubmittingReply}
            >
              {isSubmittingReply ? 'Posting...' : 'Post Reply'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Display replies */}
      {replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {replies.map((reply) => (
            <CommentReplyItem
              key={reply.id}
              reply={reply}
              onReplyUpdated={refreshReplies}
              onReplyDeleted={refreshReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ScammerDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    profile
  } = useProfile();
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [agreePercentage, setAgreePercentage] = useState(0);
  const [isCreator, setIsCreator] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('0.00');
  const [bountyComment, setBountyComment] = useState('');
  const developerWalletAddress = "A6X5A7ZSvez8BK82Z5tnZJC3qarGbsxRVv8Hc3DKBiZx";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [contributionsPage, setContributionsPage] = useState(1);
  const contributionsPerPage = 5;
  const [profileChangeCounter, setProfileChangeCounter] = useState(0);
  const isMobile = useIsMobile();

  // Comment pagination state
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(5);
  const [commentSortFilter, setCommentSortFilter] = useState<'newest' | 'oldest' | 'most_liked'>('newest');

  // Adjust comments per page based on screen size (9 for iPad, 5 for mobile/desktop)
  useEffect(() => {
    const updateCommentsPerPage = () => {
      const width = window.innerWidth;
      // iPad/tablet range: 768px - 1024px
      if (width >= 768 && width < 1024) {
        setCommentsPerPage(9);
      } else {
        setCommentsPerPage(5);
      }
    };
    updateCommentsPerPage();
    window.addEventListener('resize', updateCommentsPerPage);
    return () => window.removeEventListener('resize', updateCommentsPerPage);
  }, []);

  // Touch gesture state for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset comment pagination when scammer changes
  useEffect(() => {
    setCurrentCommentPage(1);
  }, [id]);
  useEffect(() => {
    const handleProfileUpdated = () => {
      console.log("Profile updated event received, refreshing contributions");
      setProfileChangeCounter(prev => prev + 1);
      queryClient.invalidateQueries({
        queryKey: ['bountyContributions', id]
      });
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, [id, queryClient]);
  const deleteScammerMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Scammer ID is required");
      return deleteScammer(id);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The scammer report has been archived successfully."
      });
      navigate('/most-wanted');
    },
    onError: error => {
      handleError(error, {
        fallbackMessage: "Failed to archive the scammer report. Please try again.",
        severity: ErrorSeverity.HIGH,
        context: "DELETE_SCAMMER"
      });
    }
  });
  const unarchiveScammerMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Scammer ID is required");
      return unarchiveScammer(id);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "The scammer report has been unarchived successfully and is now visible in searches."
      });
      queryClient.invalidateQueries({
        queryKey: ['scammer', id]
      });
    },
    onError: error => {
      handleError(error, {
        fallbackMessage: "Failed to unarchive the scammer report. Please try again.",
        severity: ErrorSeverity.HIGH,
        context: "UNARCHIVE_SCAMMER"
      });
    }
  });
  const {
    data: scammer,
    isLoading: isLoadingScammer,
    error: errorScammer
  } = useQuery({
    queryKey: ['scammer', id],
    queryFn: () => getScammerById(id || ''),
    enabled: !!id
  });
  const {
    data: comments,
    isLoading: isLoadingComments,
    error: errorComments
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getScammerComments(id || ''),
    enabled: !!id
  });
  const {
    data: bountyContributionsData,
    isLoading: isLoadingBountyContributions
  } = useQuery({
    queryKey: ['bountyContributions', id, contributionsPage, contributionsPerPage, profileChangeCounter],
    queryFn: () => getScammerBountyContributions(id || '', contributionsPage, contributionsPerPage),
    enabled: !!id,
    placeholderData: previousData => previousData
  });
  const {
    data: userContributionAmount = 0,
    isLoading: isLoadingUserContribution
  } = useQuery({
    queryKey: ['userContribution', id, profile?.id],
    queryFn: () => getUserContributionAmountForScammer(id || '', profile?.id || ''),
    enabled: !!id && !!profile?.id
  });
  const bountyContributions = bountyContributionsData?.contributions || [];
  const totalContributions = bountyContributionsData?.totalCount || 0;
  useEffect(() => {
    const checkIsCreator = async () => {
      if (!profile?.id || !id) return;
      try {
        const result = await isScammerCreator(id, profile.id);
        setIsCreator(result);
      } catch (error) {
        handleError(error, {
          fallbackMessage: "Failed to check if user is the creator",
          severity: ErrorSeverity.LOW,
          context: "CHECK_CREATOR"
        });
      }
    };
    checkIsCreator();
  }, [id, profile?.wallet_address]);
  useEffect(() => {
    const fetchUserInteraction = async () => {
      if (!profile?.id || !scammer?.id) return;
      try {
        const interaction = await getUserScammerInteraction(scammer.id, profile.id);
        if (interaction) {
          setIsLiked(interaction.liked);
          setIsDisliked(interaction.disliked);
        } else {
          setIsLiked(false);
          setIsDisliked(false);
        }
      } catch (error) {
        handleError(error, {
          fallbackMessage: "Failed to fetch user interaction",
          severity: ErrorSeverity.LOW,
          context: "FETCH_INTERACTION"
        });
      }
    };
    fetchUserInteraction();
  }, [scammer?.id, profile?.wallet_address]);
  useEffect(() => {
    if (scammer) {
      setLikes(scammer.likes || 0);
      setDislikes(scammer.dislikes || 0);
      const total = (scammer.likes || 0) + (scammer.dislikes || 0);
      if (total > 0) {
        setAgreePercentage(Math.round((scammer.likes || 0) * 100 / total));
      } else {
        setAgreePercentage(0);
      }
    }
  }, [scammer]);
  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (scammer?.added_by) {
        try {
          const profile = await getProfileById(scammer.added_by);
          setCreatorProfile(profile);
        } catch (error) {
          handleError(error, {
            fallbackMessage: "Failed to fetch creator profile",
            severity: ErrorSeverity.LOW,
            context: "FETCH_CREATOR"
          });
        }
      }
    };
    fetchCreatorProfile();
  }, [scammer?.added_by]);
  useEffect(() => {
    if (profile) {
      setProfileChangeCounter(prev => prev + 1);
    }
  }, [profile?.display_name, profile?.profile_pic_url]);
  const handleEditScammer = () => {
    if (!id) return;
    navigate(`/edit-report/${id}`);
  };

  // Touch event handlers for swipe gestures
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const totalCommentPages = Math.ceil((comments?.length || 0) / commentsPerPage);
    if (isLeftSwipe && currentCommentPage < totalCommentPages) {
      setCurrentCommentPage(prev => prev + 1);
    }
    if (isRightSwipe && currentCommentPage > 1) {
      setCurrentCommentPage(prev => prev - 1);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Wallet address copied!"
      });
    });
  };
  const addCommentMutation = useMutation({
    mutationFn: (newComment: {
      scammer_id: string;
      content: string;
      author: string;
      author_name: string;
      author_profile_pic?: string;
    }) => addComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', id]
      });
      setCommentText('');
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully!"
      });
    },
    onError: error => {
      handleError(error, {
        fallbackMessage: "Failed to add comment. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "ADD_COMMENT"
      });
    }
  });
  const addBountyContributionMutation = useMutation({
    mutationFn: (contribution: {
      scammer_id: string;
      amount: number;
      comment?: string;
      contributor_id: string;
      contributor_name: string;
      contributor_profile_pic?: string;
      transaction_signature?: string;
    }) => addBountyContribution(contribution),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bountyContributions', id]
      });
      queryClient.invalidateQueries({
        queryKey: ['scammer', id]
      });
      setContributionAmount('0.00');
      setBountyComment('');
      toast({
        title: "Bounty contribution",
        description: `Thank you for contributing to this bounty!`
      });
    },
    onError: error => {
      handleError(error, {
        fallbackMessage: "Failed to contribute to the bounty. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "ADD_BOUNTY"
      });
    }
  });
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
      const result = await likeScammer(scammer?.id || '', profile.id);
      if (result && typeof result === 'object' && 'likes' in result) {
        setLikes(result.likes || 0);
        setDislikes(result.dislikes || 0);
        setIsLiked(!isLiked);
        setIsDisliked(false);
        const total = (result.likes || 0) + (result.dislikes || 0);
        if (total > 0) {
          setAgreePercentage(Math.round((result.likes || 0) * 100 / total));
        }
        toast({
          title: "Agreed"
        });
        queryClient.setQueryData(['scammer', id], (oldScammer: Scammer | undefined) => {
          if (oldScammer) {
            return {
              ...oldScammer,
              likes: result.likes || 0,
              dislikes: result.dislikes || 0
            };
          }
          return oldScammer;
        });
      }
    } catch (error) {
      handleError(error, {
        fallbackMessage: "Failed to like this report. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "LIKE_SCAMMER"
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
      const result = await dislikeScammer(scammer?.id || '', profile.id);
      if (result && typeof result === 'object' && 'likes' in result) {
        setLikes(result.likes || 0);
        setDislikes(result.dislikes || 0);
        setIsDisliked(!isDisliked);
        setIsLiked(false);
        const total = (result.likes || 0) + (result.dislikes || 0);
        if (total > 0) {
          setAgreePercentage(Math.round((result.likes || 0) * 100 / total));
        }
        queryClient.setQueryData(['scammer', id], (oldScammer: Scammer | undefined) => {
          if (oldScammer) {
            return {
              ...oldScammer,
              likes: result.likes || 0,
              dislikes: result.dislikes || 0
            };
          }
          return oldScammer;
        });
      }
    } catch (error) {
      handleError(error, {
        fallbackMessage: "Failed to dislike this report. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "DISLIKE_SCAMMER"
      });
    } finally {
      setIsLoading(false);
    }
  };
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
      author: profile.id,
      author_name: profile.display_name,
      author_profile_pic: profile.profile_pic_url
    });
  };
  const handleAddBounty = async () => {
    if (!profile) {
      await connectPhantomWallet();
      if (!profile) {
        toast({
          title: "Authentication required",
          description: "Please connect your wallet to contribute to this bounty.",
          variant: "destructive"
        });
        return;
      }
    }
    const amount = parseFloat(contributionAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log(`Processing bounty transaction of ${amount} $SEC to ${developerWalletAddress}`);
      const transactionSignature = await sendTransactionToDevWallet(developerWalletAddress, amount);
      if (!transactionSignature) {
        setIsLoading(false);
        return;
      }
      console.log("Recording bounty contribution in database");
      addBountyContributionMutation.mutate({
        scammer_id: scammer?.id || '',
        amount: amount,
        comment: bountyComment || undefined,
        contributor_id: profile.id,
        contributor_name: profile.display_name,
        contributor_profile_pic: profile.profile_pic_url,
        transaction_signature: transactionSignature
      });
    } catch (error) {
      handleError(error, {
        fallbackMessage: "Failed to process bounty contribution. Please try again.",
        severity: ErrorSeverity.MEDIUM,
        context: "PROCESS_BOUNTY"
      });
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setContributionsPage(page);
  };
  const handleDeleteScammer = () => {
    setShowDeleteDialog(true);
  };
  const handleUnarchiveScammer = () => {
    setShowUnarchiveDialog(true);
  };
  const confirmDelete = () => {
    deleteScammerMutation.mutate();
  };
  const confirmUnarchive = () => {
    unarchiveScammerMutation.mutate();
  };
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/report/${scammer?.report_number || id}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Link copied to clipboard. Share this scammer report!"
      });
    } catch (error) {
      handleError(error, {
        fallbackMessage: "Failed to copy link to clipboard",
        severity: ErrorSeverity.LOW,
        context: "SHARE_SCAMMER"
      });
    }
  };
  const handleTransferComplete = () => {
    queryClient.invalidateQueries({
      queryKey: ['bountyContributions', id]
    });
    queryClient.invalidateQueries({
      queryKey: ['scammer', id]
    });
  };
  const developerWallet = `${developerWalletAddress.substring(0, 4)}...${developerWalletAddress.substring(developerWalletAddress.length - 4)}`;
  if (isLoadingScammer) {
    return <div>
        <CompactHero title="Loading..." />
        <section className="icc-section bg-white">
          <div className="icc-container">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-8 w-1/4 mt-4" />
            <Skeleton className="h-6 w-1/2 mt-2" />
          </div>
        </section>
      </div>;
  }
  if (errorScammer || !scammer) {
    return <div>
        <CompactHero title="Error" />
        <section className="icc-section bg-white">
          <div className="icc-container">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-center text-icc-blue mb-2">
              Failed to load scammer details.
            </h2>
            <p className="text-icc-gray text-center">
              Please try again later.
            </p>
          </div>
        </section>
      </div>;
  }
  return <div>
      <CompactHero title={scammer?.name} />

      <section className="icc-section bg-white">
        <div className="icc-container">
          {scammer.deleted_at && <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Archived Report</AlertTitle>
              <AlertDescription>
                This scammer report has been archived and is no longer visible in search results.
              </AlertDescription>
            </Alert>}
          
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/most-wanted')} aria-label="Back to Most Wanted list">
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              {isMobile ? 'Back' : 'Back to Most Wanted'}
            </Button>
            <div className="flex items-center space-x-2 md:space-x-3">
              {isCreator && <>
                  {scammer.deleted_at ? <Button variant="gold" size="sm" onClick={handleUnarchiveScammer} aria-label="Unarchive this report">
                      <ArchiveRestore className="h-3.5 w-3.5" aria-hidden="true" />
                      {!isMobile && <span className="ml-1">Unarchive Report</span>}
                    </Button> : <>
                      <Button variant="outline" size="sm" onClick={handleEditScammer} aria-label="Edit this report">
                        <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                        {!isMobile && <span className="ml-1">Edit Report</span>}
                      </Button>
                      <Button variant="gold" size="sm" onClick={handleDeleteScammer} aria-label="Delete this report">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {!isMobile && <span className="ml-1">Archive Report</span>}
                      </Button>
                    </>}
                </>}
              
              <Button variant="outline" size="sm" onClick={handleShare} aria-label="Share this scammer report">
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                {!isMobile && <span className="ml-1">Share</span>}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-md mb-6">
                <img src={scammer.photo_url || '/placeholder.svg'} alt={`Photo of ${scammer.name}`} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 bg-icc-gold text-icc-blue-dark px-4 py-2 text-sm font-bold rounded-br-lg flex items-center gap-1" aria-label={`Bounty amount: ${formatCurrency(scammer.bounty_amount)} SEC`}>
                  <CurrencyIcon size="sm" /> {formatCurrency(scammer.bounty_amount)}
                </div>
              </div>

              <div className="mt-4 mb-6">
                <h2 className="icc-title">{scammer?.name}'s Accusations</h2>
                <p className="text-lg text-icc-gray-dark dark:text-white mt-2">{scammer.accused_of}</p>
              </div>

              <Tabs defaultValue="comments" className="w-full mb-6">
                <div className="relative">
                  <TabsList className="w-full justify-start overflow-x-auto bg-background/60 backdrop-blur-sm rounded-lg border p-1 mb-4" aria-label="Scammer information tabs">
                    <TabsTrigger value="comments" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <MessageSquare className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Comments</span>
                    </TabsTrigger>
                    <TabsTrigger value="links" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <Link2 className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Links</span>
                    </TabsTrigger>
                    <TabsTrigger value="aliases" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <User className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Aliases</span>
                    </TabsTrigger>
                    <TabsTrigger value="accomplices" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <Users className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Accomplices</span>
                    </TabsTrigger>
                    <TabsTrigger value="evidence" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <FileText className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Evidence</span>
                    </TabsTrigger>
                    <TabsTrigger value="wallet-addresses" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <Wallet2 className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Wallets</span>
                    </TabsTrigger>
                    <TabsTrigger value="official" className="data-[state=active]:bg-icc-gold/20 data-[state=active]:text-icc-gold">
                      <ShieldCheck className="h-4 w-4 lg:hidden" />
                      <span className="hidden lg:inline">Official Response</span>
                    </TabsTrigger>
                  </TabsList>
                  
                </div>
                
                <TabsContent value="comments" className="mt-2">
                  
                  <div className="mb-4">
                    <Textarea placeholder="Write your comment here..." value={commentText} onChange={e => setCommentText(e.target.value)} aria-label="Comment text" />
                    <Button className="mt-2 w-full" onClick={handleAddComment} disabled={addCommentMutation.isPending} aria-label="Add comment">
                      {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                    </Button>
                  </div>

                  {/* Comment Sort Filter */}
                  {comments && comments.length > 0 && (
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sort by:</span>
                      <Select value={commentSortFilter} onValueChange={(value: 'newest' | 'oldest' | 'most_liked') => {
                        setCommentSortFilter(value);
                        setCurrentCommentPage(1);
                      }}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="oldest">Oldest</SelectItem>
                          <SelectItem value="most_liked">Most Liked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isLoadingComments ? <div className="space-y-4" aria-live="polite" aria-busy="true">
                      {[1, 2, 3].map(index => <div key={index} className="flex items-start space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-4 w-64" />
                          </div>
                        </div>)}
                      <span className="sr-only">Loading comments...</span>
                    </div> : errorComments ? <div className="text-red-500">Error loading comments.</div> : comments && comments.length > 0 ? (() => {
                  // Sort comments based on selected filter
                  const sortedComments = [...comments].sort((a, b) => {
                    if (commentSortFilter === 'most_liked') {
                      return (b.likes || 0) - (a.likes || 0);
                    } else if (commentSortFilter === 'oldest') {
                      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                    } else { // newest
                      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                    }
                  });
                  
                  const totalCommentPages = Math.ceil(sortedComments.length / commentsPerPage);
                  const startIndex = (currentCommentPage - 1) * commentsPerPage;
                  const endIndex = startIndex + commentsPerPage;
                  const paginatedComments = sortedComments.slice(startIndex, endIndex);
                  return <div aria-label="Comments section" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="select-none">
                          <div className="min-h-[500px]">
                            {paginatedComments.map(comment => <CommentItem key={comment.id} comment={comment} profile={profile} />)}
                          </div>
                          
                          {/* Pagination Controls */}
                          {totalCommentPages > 1 && <Pagination className="mt-6">
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious onClick={() => setCurrentCommentPage(prev => Math.max(1, prev - 1))} className={currentCommentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                </PaginationItem>
                                
                                {/* Page numbers */}
                                {Array.from({
                          length: totalCommentPages
                        }, (_, i) => i + 1).map(pageNum => <PaginationItem key={pageNum}>
                                    <PaginationLink onClick={() => setCurrentCommentPage(pageNum)} isActive={currentCommentPage === pageNum} className="cursor-pointer">
                                      {pageNum}
                                    </PaginationLink>
                                  </PaginationItem>)}
                                
                                <PaginationItem>
                                  <PaginationNext onClick={() => setCurrentCommentPage(prev => Math.min(totalCommentPages, prev + 1))} className={currentCommentPage === totalCommentPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>}
                        </div>;
                })() : <div aria-live="polite">No comments yet. Be the first to comment!</div>}
                </TabsContent>
                
                <TabsContent value="links" className="mt-2">
                  <h2 className="text-2xl font-gothic font-bold text-icc-blue mb-4" id="links-section">Links</h2>
                  {scammer?.links && scammer.links.length > 0 ? <ul className="list-disc pl-5 space-y-2">
                      {scammer.links.map((link, index) => <li key={index} className="text-icc-gray">
                          <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-icc-blue hover:underline">
                            {link}
                          </a>
                        </li>)}
                    </ul> : <p className="text-icc-gray">No links provided.</p>}
                </TabsContent>
                
                <TabsContent value="aliases" className="mt-2">
                  <h2 className="text-2xl font-gothic font-bold text-icc-blue mb-4" id="aliases-section">Aliases</h2>
                  {scammer?.aliases && scammer.aliases.length > 0 ? <div className="flex flex-wrap gap-2">
                      {scammer.aliases.map((alias, index) => <Badge key={index} className="bg-icc-blue text-white py-2 px-4">{alias}</Badge>)}
                    </div> : <p className="text-icc-gray">No aliases provided.</p>}
                </TabsContent>
                
                <TabsContent value="accomplices" className="mt-2">
                  <h2 className="text-2xl font-gothic font-bold text-icc-blue mb-4" id="accomplices-section">Known Accomplices</h2>
                  {scammer?.accomplices && scammer.accomplices.length > 0 ? <div className="flex flex-wrap gap-2">
                      {scammer.accomplices.map((accomplice, index) => <Badge key={index} className="bg-icc-blue text-white py-2 px-4">{accomplice}</Badge>)}
                    </div> : <p className="text-icc-gray">No accomplices listed.</p>}
                </TabsContent>
                
                <TabsContent value="evidence" className="mt-2">
                  <h2 className="text-2xl font-gothic font-bold text-icc-blue mb-4" id="evidence-section">Evidence</h2>
                  <div className="text-icc-gray">No evidence provided.</div>
                </TabsContent>
                
                <TabsContent value="wallet-addresses" className="mt-2">
                  <h2 className="text-2xl font-gothic font-bold text-icc-blue mb-4" id="wallets-section">Wallet Addresses</h2>
                  {scammer?.wallet_addresses && scammer.wallet_addresses.length > 0 ? <ul className="list-disc pl-5 space-y-2 text-icc-gray">
                      {scammer.wallet_addresses.map((address, index) => <li key={index} className="flex items-center">
                          <span className="font-mono mr-2">{address}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(address)} aria-label={`Copy wallet address ${address}`}>
                            <Copy className="h-3.5 w-3.5 text-icc-blue" aria-hidden="true" />
                          </Button>
                        </li>)}
                    </ul> : <p className="text-icc-gray">No wallet addresses provided.</p>}
                </TabsContent>
                
                <TabsContent value="official" className="mt-2">
                  <h2 className="text-2xl font-gothic font-bold text-icc-blue mb-4" id="official-response-section">Official Response</h2>
                  {scammer?.official_response ? <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-icc-gray whitespace-pre-wrap">{scammer.official_response}</p>
                    </div> : <p className="text-icc-gray">No official response yet.</p>}
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card className="mb-6 bg-gray-50 dark:bg-icc-blue-dark dark:text-white">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-icc-blue dark:text-white mb-3">Reported By</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  {creatorProfile ? <Link to={`/profile/${creatorProfile.username || creatorProfile.wallet_address}`} className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-icc-blue p-2 rounded-md transition-colors py-0 px-0 -mt-2">
                      <Avatar className="group-hover:ring-2 group-hover:ring-icc-gold transition-all">
                        <AvatarImage src={creatorProfile.profile_pic_url} alt={`${creatorProfile.display_name}'s profile`} />
                        <AvatarFallback>{creatorProfile.display_name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium font-bold text-icc-blue dark:text-white leading-none group-hover:text-icc-gold transition-colors">
                          {creatorProfile.display_name}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300">@{creatorProfile.username}</p>
                      </div>
                    </Link> : <p className="text-sm text-gray-500 dark:text-gray-300">Anonymous</p>}
                  <Separator className="my-4 dark:bg-gray-700" />
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                      Added {formatDate(scammer.date_added)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                      {scammer.views} Views
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                      <Link2 className="h-4 w-4 mr-1" aria-hidden="true" />
                      <button onClick={handleShare} className="hover:underline">
                        Share
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-icc-blue dark:text-white mb-3 text-center md:text-left">Take Action</h3>
                
                <div className="flex space-x-2 mb-4">
                  <Button variant={isLiked ? "gold" : "outline"} size="sm" className={`flex-1 ${isLiked ? 'hover:bg-icc-gold-dark' : ''}`} onClick={handleLike} disabled={isLoading} aria-pressed={isLiked} aria-label="Like this report">
                    <ThumbsUp className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span>{likes}</span>
                  </Button>
                  <Button variant={isDisliked ? "gold" : "outline"} size="sm" className={`flex-1 ${isDisliked ? 'hover:bg-icc-gold-dark' : ''}`} onClick={handleDislike} disabled={isLoading} aria-pressed={isDisliked} aria-label="Dislike this report">
                    <ThumbsDown className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span>{dislikes}</span>
                  </Button>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mb-3">
                        <Progress value={agreePercentage} className="h-2 bg-red-100" aria-valuemin={0} aria-valuemax={100} aria-valuenow={agreePercentage} aria-label={`${agreePercentage}% agreement rate`}>
                          <div className="h-full bg-green-500 transition-all" style={{
                          width: `${agreePercentage}%`
                        }} />
                        </Progress>
                        <div className="flex justify-center text-sm md:text-xs lg:text-sm text-white mt-1">
                          <span className="whitespace-nowrap">{agreePercentage}% Agree</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Based on {likes + dislikes} community votes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {isMobile && <div className="mt-6">
                    <BountyForm scammerId={scammer.id} scammerName={scammer.name} developerWalletAddress={developerWalletAddress} />
                    
                    <div className="mt-6">
                      <BountyContributionList contributions={bountyContributions} isLoading={isLoadingBountyContributions} totalCount={totalContributions} onPageChange={handlePageChange} currentPage={contributionsPage} itemsPerPage={contributionsPerPage} userContributionAmount={userContributionAmount} />
                    </div>
                  </div>}
                
                {!isMobile && <div className="mt-6">
                    <BountyForm scammerId={scammer.id} scammerName={scammer.name} developerWalletAddress={developerWalletAddress} />
                    
                    <div className="mt-6">
                      <BountyContributionList contributions={bountyContributions} isLoading={isLoadingBountyContributions} totalCount={totalContributions} onPageChange={handlePageChange} currentPage={contributionsPage} itemsPerPage={contributionsPerPage} userContributionAmount={userContributionAmount} />
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this scammer report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide the report from public view, but any bounty contributions will remain active and transferrable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteScammerMutation.isPending ? "Archiving..." : "Archive Report"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnarchiveDialog} onOpenChange={setShowUnarchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unarchive this scammer report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make the report visible in public searches and in the Most Wanted list again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnarchive} className="bg-green-600 hover:bg-green-700">
              {unarchiveScammerMutation.isPending ? "Unarchiving..." : "Unarchive Report"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default ScammerDetailPage;