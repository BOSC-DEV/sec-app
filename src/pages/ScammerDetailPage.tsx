
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getScammerById, getScammerComments, addComment } from '@/services/supabaseService';
import { Scammer, Comment } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Copy, 
  ArrowRight,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useProfile } from '@/contexts/ProfileContext';

const ScammerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('identity');
  const { profile } = useProfile();
  const [bountyAmount, setBountyAmount] = useState('0.0');

  const { 
    data: scammer, 
    isLoading: isScammerLoading, 
    error: scammerError 
  } = useQuery({
    queryKey: ['scammer', id],
    queryFn: () => getScammerById(id || ''),
  });

  const { 
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getScammerComments(id || ''),
  });

  useEffect(() => {
    if (scammerError) {
      console.error('Failed to load scammer', scammerError);
    }
    if (commentsError) {
      console.error('Failed to load comments', commentsError);
    }
  }, [scammerError, commentsError]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const comment = {
        scammer_id: id || '',
        content: newComment,
        author: profile?.wallet_address || 'anonymous',
        author_name: profile?.display_name || 'Anonymous User',
        author_profile_pic: profile?.profile_pic_url || '/placeholder.svg'
      };

      await addComment(comment);
      
      // Refresh comments
      await refetchComments();
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description: "There was an error adding your comment. Please try again.",
      });
    }
  };

  const handleLikeScammer = () => {
    toast({
      title: "Liked",
      description: "You've marked this report as accurate.",
    });
  };

  const handleDislikeScammer = () => {
    toast({
      title: "Disliked",
      description: "You've marked this report as inaccurate.",
    });
  };

  const handleShareScammer = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Link has been copied to clipboard.",
    });
  };

  const handleCopyWalletAddress = () => {
    if (scammer?.wallet_address) {
      navigator.clipboard.writeText(scammer.wallet_address);
      toast({
        title: "Copied!",
        description: "Wallet address has been copied to clipboard.",
      });
    }
  };

  const handleContributeToBounty = () => {
    if (!bountyAmount || parseFloat(bountyAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid bounty amount.",
      });
      return;
    }

    toast({
      title: "Thank you!",
      description: `You've contributed ${bountyAmount} $BOSC to the bounty.`,
    });
  };

  if (isScammerLoading) {
    return <div className="text-center py-12">Loading scammer details...</div>;
  }

  if (!scammer) {
    return <div className="text-center py-12">Scammer not found.</div>;
  }

  const agreePercentage = scammer.likes 
    ? Math.round((scammer.likes / (scammer.likes + scammer.dislikes)) * 100) 
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="md:col-span-2">
            {/* Scammer Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="mb-2">
                <h1 className="text-2xl font-bold">{scammer.name}</h1>
                <p className="text-gray-600">{scammer.accused_of || "No description provided."}</p>
              </div>
              
              {/* Interaction Buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-600"
                  onClick={handleLikeScammer}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {scammer.likes || 0}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600"
                  onClick={handleDislikeScammer}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  {scammer.dislikes || 0}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShareScammer}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Scammer Photo */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src={scammer.photo_url || '/placeholder.svg'} 
                  alt={scammer.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Details</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Added on</span>
                    <p>{new Date(scammer.date_added).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Added by</span>
                    <p className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-amber-600 rounded-full mr-1"></span>
                      {scammer.added_by || 'Anonymous'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="identity" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 rounded-none">
                  <TabsTrigger value="identity">Identity</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>
                
                <TabsContent value="identity" className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Known Aliases</h3>
                  <div className="flex flex-wrap gap-2">
                    {scammer.aliases && scammer.aliases.length > 0 ? (
                      scammer.aliases.map((alias, index) => (
                        <Badge key={index} variant="outline">
                          {alias}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No known aliases.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="links" className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Related Links</h3>
                  {scammer.links && scammer.links.length > 0 ? (
                    <ul className="space-y-2">
                      {scammer.links.map((link, index) => (
                        <li key={index} className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                          <a 
                            href={link.startsWith('http') ? link : `https://${link}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No links provided.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="network" className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Wallet Address</h3>
                  {scammer.wallet_address ? (
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-hidden text-ellipsis">
                        {scammer.wallet_address}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopyWalletAddress}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No wallet address provided.</p>
                  )}

                  <h3 className="text-lg font-semibold mt-4 mb-2">Accomplices</h3>
                  <div className="flex flex-wrap gap-2">
                    {scammer.accomplices && scammer.accomplices.length > 0 ? (
                      scammer.accomplices.map((accomplice, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50">
                          {accomplice}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No known accomplices.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="response" className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Official Response</h3>
                  {scammer.official_response ? (
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                      <p>{scammer.official_response}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No official response has been provided.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Community Agreement */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-green-600">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>Agree ({scammer.likes || 0})</span>
                </div>
                <div className="flex items-center text-red-600">
                  <span>Disagree ({scammer.dislikes || 0})</span>
                  <ThumbsDown className="h-4 w-4 ml-1" />
                </div>
              </div>
              <Progress value={agreePercentage} className="h-3" />
              <p className="text-center text-sm text-gray-500 mt-1">
                {agreePercentage}% of community members agree
              </p>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments
                </h2>
                <span className="text-sm text-gray-500">
                  {comments?.length || 0} comments
                </span>
              </div>
              
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="mb-2">
                  <Input
                    placeholder="Share your thoughts about this scammer..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary">
                    Post Comment
                  </Button>
                </div>
              </form>

              {/* Display Comments */}
              {isCommentsLoading ? (
                <div className="text-center py-4">Loading comments...</div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={comment.author_profile_pic || '/placeholder.svg'} alt={comment.author_name} />
                          <AvatarFallback>{comment.author_name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium">{comment.author_name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <button className="flex items-center text-xs text-gray-500 hover:text-blue-600">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.likes || 0}
                            </button>
                            <button className="flex items-center text-xs text-gray-500 hover:text-blue-600">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              {comment.dislikes || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Bounty Contribution */}
          <div className="md:col-span-1">
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 text-xl">Contribute to Bounty</CardTitle>
                <p className="text-sm text-amber-800">
                  Add $BOSC tokens to increase the bounty for {scammer.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Current Bounty
                    </label>
                    <div className="bg-white border border-amber-200 rounded-md p-2 flex items-center">
                      <span className="flex items-center text-amber-900">
                        <span className="inline-block w-4 h-4 bg-amber-400 rounded-full mr-1"></span>
                        {scammer.bounty_amount || 0} $BOSC
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Developer Wallet
                    </label>
                    <div className="bg-white border border-amber-200 rounded-md p-2 flex items-center justify-between">
                      <div className="truncate text-amber-900 text-sm">
                        {profile?.wallet_address 
                          ? `${profile.wallet_address.substring(0, 4)}...${profile.wallet_address.substring(profile.wallet_address.length - 4)}`
                          : 'Connect wallet to contribute'}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-1">
                      Contribution Amount
                    </label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="rounded-r-none border-r-0 bg-white border-amber-200"
                        value={bountyAmount}
                        onChange={(e) => setBountyAmount(e.target.value)}
                      />
                      <div className="bg-amber-100 border border-amber-200 text-amber-900 py-2 px-3 rounded-r-md">
                        $BOSC
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-amber-800 text-white hover:bg-amber-900"
                    onClick={handleContributeToBounty}
                  >
                    Contribute to Bounty <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScammerDetailPage;
