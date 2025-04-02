
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ThumbsUp, ThumbsDown, Eye, Share, DollarSign, ExternalLink, 
  Calendar, User, AlertTriangle, Shield, MessageSquare 
} from 'lucide-react';
import { getScammerById, getScammerComments, Comment } from '@/services/mockData';
import { formatDate } from '@/lib/utils';

const ScammerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [scammer, setScammer] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);

  useEffect(() => {
    const loadScammerData = async () => {
      if (!id) return;

      try {
        const scammerData = await getScammerById(id);
        if (scammerData) {
          setScammer(scammerData);
          
          // Load comments
          setLoadingComments(true);
          const commentsData = await getScammerComments(id);
          setComments(commentsData);
          setLoadingComments(false);
        }
      } catch (error) {
        console.error('Failed to load scammer details', error);
      } finally {
        setLoading(false);
      }
    };

    loadScammerData();
  }, [id]);

  if (loading) {
    return (
      <div className="icc-container py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="bg-gray-200 aspect-square rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="md:w-2/3">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-4 mt-8"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scammer) {
    return (
      <div className="icc-container py-16 text-center">
        <AlertTriangle className="h-16 w-16 text-icc-red mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-bold mb-2">Scammer Not Found</h1>
        <p className="text-gray-600 mb-6">The scammer you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/most-wanted">Return to Most Wanted</Link>
        </Button>
      </div>
    );
  }

  const totalInteractions = scammer.likes + scammer.dislikes;
  const agreementPercentage = totalInteractions > 0 
    ? Math.round((scammer.likes / totalInteractions) * 100) 
    : 0;

  const handleLike = () => {
    if (userHasLiked) {
      setUserHasLiked(false);
      setScammer({
        ...scammer,
        likes: scammer.likes - 1
      });
    } else {
      setUserHasLiked(true);
      if (userHasDisliked) {
        setUserHasDisliked(false);
        setScammer({
          ...scammer,
          likes: scammer.likes + 1,
          dislikes: scammer.dislikes - 1
        });
      } else {
        setScammer({
          ...scammer,
          likes: scammer.likes + 1
        });
      }
    }
  };

  const handleDislike = () => {
    if (userHasDisliked) {
      setUserHasDisliked(false);
      setScammer({
        ...scammer,
        dislikes: scammer.dislikes - 1
      });
    } else {
      setUserHasDisliked(true);
      if (userHasLiked) {
        setUserHasLiked(false);
        setScammer({
          ...scammer,
          dislikes: scammer.dislikes + 1,
          likes: scammer.likes - 1
        });
      } else {
        setScammer({
          ...scammer,
          dislikes: scammer.dislikes + 1
        });
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Warning Banner */}
      <div className="bg-icc-red text-white py-3">
        <div className="icc-container flex items-center justify-center text-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            This information is provided for awareness purposes only. Please verify all details independently.
          </p>
        </div>
      </div>

      <div className="icc-container pt-8 pb-16">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/most-wanted" className="text-icc-blue hover:underline flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Most Wanted
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-icc-blue text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                      {scammer.name}
                    </h1>
                    <div className="flex items-center mt-2">
                      <Badge className="bg-icc-gold text-icc-blue-dark mr-2">WANTED</Badge>
                      <span className="text-gray-200 text-sm">
                        ID: {scammer.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={userHasLiked ? "default" : "outline"} 
                      className={userHasLiked ? "bg-green-600 hover:bg-green-700" : "border-white text-white hover:bg-white/10"}
                      onClick={handleLike}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Agree ({scammer.likes})
                    </Button>
                    <Button 
                      variant={userHasDisliked ? "default" : "outline"} 
                      className={userHasDisliked ? "bg-red-600 hover:bg-red-700" : "border-white text-white hover:bg-white/10"}
                      onClick={handleDislike}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Disagree ({scammer.dislikes})
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Main Content Tabs */}
              <Tabs defaultValue="details" className="p-6">
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                  <TabsTrigger value="comments">
                    Comments ({comments.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Photo */}
                    <div>
                      <div className="aspect-square overflow-hidden rounded-md border border-gray-200 mb-4">
                        <img 
                          src={scammer.photo_url || '/placeholder.svg'} 
                          alt={scammer.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="bg-gray-50 rounded-md p-4 mb-4">
                        <h3 className="font-medium mb-2">Community Consensus</h3>
                        <div className="flex items-center mb-2">
                          <Progress value={agreementPercentage} className="h-2 flex-grow mr-3" />
                          <span className="text-sm font-medium">{agreementPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Agree: {scammer.likes}</span>
                          <span>Disagree: {scammer.dislikes}</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="bg-gray-50 rounded-md p-4">
                        <h3 className="font-medium mb-2">Listing Statistics</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Added on:</span>
                            <span className="font-medium">{formatDate(scammer.date_added)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Views:</span>
                            <span className="font-medium">{scammer.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shares:</span>
                            <span className="font-medium">{scammer.shares.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Comments:</span>
                            <span className="font-medium">{comments.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="md:col-span-2">
                      <div className="mb-6">
                        <h2 className="text-xl font-serif font-bold mb-4">Accusations</h2>
                        <p className="text-gray-700 whitespace-pre-line">
                          {scammer.accused_of}
                        </p>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column */}
                        <div>
                          <h3 className="text-lg font-serif font-medium mb-3">Known Information</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Wallet Address</h4>
                              <div className="flex items-center bg-gray-50 p-2 rounded text-sm font-mono overflow-x-auto">
                                {scammer.wallet_address}
                                <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Aliases</h4>
                              <div className="flex flex-wrap gap-2">
                                {scammer.aliases.map((alias: string, index: number) => (
                                  <Badge variant="outline" key={index}>
                                    {alias}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Known Links</h4>
                              <ul className="space-y-1">
                                {scammer.links.map((link: string, index: number) => (
                                  <li key={index} className="text-sm flex items-center">
                                    <ExternalLink className="h-3 w-3 mr-2 text-gray-400" />
                                    <a 
                                      href={link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-icc-blue hover:underline truncate"
                                    >
                                      {link}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right column */}
                        <div>
                          <h3 className="text-lg font-serif font-medium mb-3">Additional Information</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Known Accomplices</h4>
                              <div className="flex flex-wrap gap-2">
                                {scammer.accomplices.map((accomplice: string, index: number) => (
                                  <Badge variant="secondary" key={index}>
                                    {accomplice}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Reported By</h4>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm font-mono">{scammer.added_by}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Official Response</h4>
                              <div className="bg-gray-50 p-3 rounded-md text-sm">
                                <p>{scammer.official_response || "No official response recorded."}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="evidence">
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">Evidence Collection</h3>
                    <p className="text-gray-600 mb-4">
                      Evidence is being collected and verified. Check back later for updates.
                    </p>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Submit Evidence
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments">
                  <div>
                    {/* Comment Form */}
                    <div className="mb-6">
                      <h3 className="text-lg font-serif font-medium mb-3">Join the Discussion</h3>
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <textarea 
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-icc-blue focus:border-transparent"
                            placeholder="Share your knowledge or experience..."
                            rows={3}
                          ></textarea>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                              Please be respectful and only share verified information.
                            </p>
                            <Button>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Comments List */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-serif font-medium">
                          {comments.length} Comments
                        </h3>
                        <Select defaultValue="newest">
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="mostLiked">Most Liked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {loadingComments ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((index) => (
                            <div key={index} className="animate-pulse flex gap-3">
                              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                              <div className="flex-grow">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : comments.length > 0 ? (
                        <div className="space-y-6">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={comment.author_profile_pic} alt={comment.author_name} />
                                <AvatarFallback>{comment.author_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{comment.author_name}</h4>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 mt-1">{comment.content}</p>
                                <div className="flex gap-4 mt-2">
                                  <button className="text-xs text-gray-500 flex items-center hover:text-gray-700">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {comment.likes}
                                  </button>
                                  <button className="text-xs text-gray-500 flex items-center hover:text-gray-700">
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    {comment.dislikes}
                                  </button>
                                  <button className="text-xs text-gray-500 flex items-center hover:text-gray-700">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border border-dashed border-gray-200 rounded-md">
                          <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <h4 className="text-lg font-medium mb-1">No comments yet</h4>
                          <p className="text-gray-500">Be the first to share information about this scammer.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Bounty Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-bold">Bounty</h2>
                <div className="text-2xl font-bold text-icc-blue">
                  ${scammer.bounty_amount.toLocaleString()}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">
                Contribute to this bounty to incentivize additional information and evidence about this scammer.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-icc-gold hover:bg-icc-gold-light text-icc-blue-dark">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Contribute to Bounty
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Shield className="h-5 w-5 mr-2" />
                  Submit Information
                </Button>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="font-medium mb-3">Recent Contributors</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://picsum.photos/200/200?random=101" />
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">Crypto Detective</span>
                      <span className="text-xs text-gray-500 block">2 days ago</span>
                    </div>
                  </div>
                  <span className="font-medium text-green-600">+$5,000</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://picsum.photos/200/200?random=102" />
                      <AvatarFallback>BG</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">Blockchain Guardian</span>
                      <span className="text-xs text-gray-500 block">1 week ago</span>
                    </div>
                  </div>
                  <span className="font-medium text-green-600">+$2,500</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://picsum.photos/200/200?random=103" />
                      <AvatarFallback>CW</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">Crypto Watchdog</span>
                      <span className="text-xs text-gray-500 block">2 weeks ago</span>
                    </div>
                  </div>
                  <span className="font-medium text-green-600">+$1,000</span>
                </div>
              </div>
              
              <Button variant="link" className="text-sm mt-2 w-full">
                View All Contributors
              </Button>
            </div>
            
            {/* Similar Scammers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-serif font-bold mb-4">Similar Scammers</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <img 
                    src="https://picsum.photos/500/500?random=2" 
                    alt="Similar scammer" 
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div>
                    <h3 className="font-medium">Rebecca 'Yield Queen' Johnson</h3>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                      Created a Ponzi scheme DeFi platform...
                    </p>
                    <Link to="/scammer/scm-002" className="text-xs text-icc-blue hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <img 
                    src="https://picsum.photos/500/500?random=6" 
                    alt="Similar scammer" 
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div>
                    <h3 className="font-medium">Olivia 'Stake & Take' Chen</h3>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                      Created a fake staking platform...
                    </p>
                    <Link to="/scammer/scm-006" className="text-xs text-icc-blue hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScammerDetailPage;
