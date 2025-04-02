
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Star, ArrowUp, ArrowDown, DollarSign, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import Hero from '@/components/common/Hero';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfiles } from '@/services/supabaseService';
import { Profile } from '@/types/dataTypes';

const LeaderboardPage = () => {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: getProfiles,
  });

  // Sort profiles by points in descending order
  const rankedProfiles = [...profiles].sort((a, b) => (b.points || 0) - (a.points || 0));

  const renderRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-gray-500 font-medium">{rank + 1}</span>;
  };

  return (
    <div>
      <Hero 
        title="Leaderboard"
        subtitle="Top contributors helping to identify and report cryptocurrency scammers."
        showCta={false}
      />

      <section className="icc-section bg-white">
        <div className="icc-container">
          <Tabs defaultValue="points">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="points">Overall Points</TabsTrigger>
              <TabsTrigger value="reports">Most Reports</TabsTrigger>
              <TabsTrigger value="bounties">Highest Bounties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="points" className="space-y-6">
              <div className="bg-gradient-to-r from-icc-blue-dark to-icc-blue p-6 rounded-lg mb-8 text-white">
                <h3 className="text-lg font-serif font-bold mb-2">How Points Are Calculated</h3>
                <p className="text-sm">
                  Points are awarded for reporting scammers, providing evidence, receiving agreement from the community, 
                  and offering bounties. The more you contribute to protecting the community, the higher your rank!
                </p>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading leaderboard data...</p>
                </div>
              ) : rankedProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Leaderboard Data Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Be the first to contribute by reporting scammers and earning points!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead className="text-right">Reports</TableHead>
                        <TableHead className="text-right">Bounties</TableHead>
                        <TableHead className="text-right">Activity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rankedProfiles.map((profile, index) => (
                        <TableRow key={profile.id} className={index < 3 ? "font-medium" : ""}>
                          <TableCell className="text-center">
                            {renderRankIcon(index)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-gray-100 mr-3 overflow-hidden">
                                {profile.profile_pic_url ? (
                                  <img 
                                    src={profile.profile_pic_url} 
                                    alt={profile.display_name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-icc-blue flex items-center justify-center text-white">
                                    {profile.display_name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{profile.display_name}</div>
                                <div className="text-xs text-gray-500">
                                  Joined {new Date(profile.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {profile.points || 0}
                          </TableCell>
                          <TableCell className="text-right">10</TableCell>
                          <TableCell className="text-right">$5,000</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2 text-gray-500">
                              <span className="flex items-center">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                120
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                45
                              </span>
                              <span className="flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                23
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  The reports leaderboard is currently being developed and will be available soon.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="bounties">
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  The bounties leaderboard is currently being developed and will be available soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
