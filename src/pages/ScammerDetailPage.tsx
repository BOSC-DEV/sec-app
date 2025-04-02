import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getScammerById, getScammerComments, addComment } from '@/services/supabaseService';
import { Scammer, Comment } from '@/types/dataTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, ThumbsDown, Share2, Flag } from 'lucide-react';
import { toast } from "@/components/ui/use-toast"
import Hero from '@/components/common/Hero';

const ScammerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState('');

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
        author: 'anonymous', // In a real app, this would be the user's wallet address
        author_name: 'Anonymous User',
        author_profile_pic: '/placeholder.svg'
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

  if (isScammerLoading) {
    return <div className="text-center py-12">Loading scammer details...</div>;
  }

  if (!scammer) {
    return <div className="text-center py-12">Scammer not found.</div>;
  }

  return (
    <div>
      <Hero 
        title={scammer.name}
        subtitle={scammer.accused_of || "No description provided."}
      />

      <section className="icc-section bg-white">
        <div className="icc-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scammer Details */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img 
                    src={scammer.photo_url || '/placeholder.svg'} 
                    alt={scammer.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Added on {new Date(scammer.date_added).toLocaleDateString()} by {scammer.added_by || 'Anonymous'}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {scammer.views} Views
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {scammer.likes} Likes
                    </span>
                    <span className="flex items-center">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {scammer.dislikes} Dislikes
                    </span>
                    <span className="flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      {scammer.shares} Shares
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Accusations</h3>
                <p className="text-gray-700">{scammer.accused_of || 'No accusations provided.'}</p>
              </div>

              {scammer.official_response && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Official Response</h3>
                  <p className="text-gray-700">{scammer.official_response}</p>
                </div>
              )}

              {scammer.links && scammer.links.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Related Links</h3>
                  <ul className="list-disc pl-5">
                    {scammer.links.map((link, index) => (
                      <li key={index} className="text-icc-blue hover:text-icc-blue-dark">
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                <div className="mb-3">
                  <span className="block font-medium text-gray-700">Wallet Address:</span>
                  <span className="text-gray-600">{scammer.wallet_address || 'N/A'}</span>
                </div>
                <div className="mb-3">
                  <span className="block font-medium text-gray-700">Aliases:</span>
                  <span className="text-gray-600">{scammer.aliases ? scammer.aliases.join(', ') : 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-medium text-gray-700">Accomplices:</span>
                  <span className="text-gray-600">{scammer.accomplices ? scammer.accomplices.join(', ') : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Anonymous User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <Button type="submit">Post</Button>
              </div>
            </form>

            {/* Display Comments */}
            {isCommentsLoading ? (
              <div className="text-center py-6">Loading comments...</div>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={comment.author_profile_pic || '/placeholder.svg'} alt={comment.author_name} />
                      <AvatarFallback>{comment.author_name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{comment.author_name}</div>
                      <div className="text-sm text-gray-500">
                        Posted on {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                      <p className="mt-2">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-2 text-gray-500">
                        <button className="flex items-center hover:text-icc-blue">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </button>
                        <button className="flex items-center hover:text-icc-blue">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          {comment.dislikes}
                        </button>
                        <button className="flex items-center hover:text-icc-blue">
                          <Flag className="h-4 w-4 mr-1" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">No comments yet. Be the first to comment!</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScammerDetailPage;
