
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, ThumbsUp, Eye, MessageSquare, Clock, Link, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import Hero from '@/components/common/Hero';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getProfiles } from '@/services/supabaseService';
import { Profile } from '@/types/dataTypes';
import { formatNumber } from '@/lib/utils';

type SortField = 'rank' | 'name' | 'reports' | 'likes' | 'views' | 'comments' | 'bounty' | 'activity';
type SortOrder = 'asc' | 'desc';

const LeaderboardPage = () => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: getProfiles,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending order
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  // Apply sorting to the profiles
  const sortedProfiles = [...profiles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'rank':
        comparison = (b.points || 0) - (a.points || 0); // Higher points = better rank
        break;
      case 'name':
        comparison = a.display_name.localeCompare(b.display_name);
        break;
      case 'reports':
        comparison = (b.reports_count || 0) - (a.reports_count || 0);
        break;
      case 'likes':
        comparison = (b.likes_count || 0) - (a.likes_count || 0);
        break;
      case 'views':
        comparison = (b.views_count || 0) - (a.views_count || 0);
        break;
      case 'comments':
        comparison = (b.comments_count || 0) - (a.comments_count || 0);
        break;
      case 'bounty':
        comparison = (b.bounty_amount || 0) - (a.bounty_amount || 0);
        break;
      case 'activity':
        // For activity, we'll use the most recent timestamp (not implemented yet)
        comparison = 0;
        break;
      default:
        comparison = 0;
    }
    
    // Invert comparison if sort order is descending
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const renderRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className="text-gray-700 font-medium">{rank + 1}</span>;
  };

  return (
    <div>
      <Hero 
        title="Leaderboard"
        subtitle="Top hunters tracking and reporting cryptocurrency scammers."
        showCta={false}
      />

      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead 
                        className="w-20 text-center cursor-pointer"
                        onClick={() => handleSort('rank')}
                      >
                        <div className="flex items-center justify-center">
                          <span>Rank</span>
                          {getSortIcon('rank')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          <span>Hunter</span>
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      
                      <TableHead className="w-32 text-center">
                        Links
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('reports')}
                      >
                        <div className="flex items-center justify-center">
                          <span>Reports</span>
                          <FileText className="h-4 w-4 ml-1 text-gray-500" />
                          {getSortIcon('reports')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('likes')}
                      >
                        <div className="flex items-center justify-center">
                          <ThumbsUp className="h-4 w-4 text-gray-500" />
                          {getSortIcon('likes')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('views')}
                      >
                        <div className="flex items-center justify-center">
                          <Eye className="h-4 w-4 text-gray-500" />
                          {getSortIcon('views')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('comments')}
                      >
                        <div className="flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          {getSortIcon('comments')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('bounty')}
                      >
                        <div className="flex items-center justify-center">
                          <span>Total Bounty</span>
                          {getSortIcon('bounty')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="w-20 text-center cursor-pointer"
                        onClick={() => handleSort('activity')}
                      >
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {getSortIcon('activity')}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProfiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center text-gray-500 space-y-3">
                            <Trophy className="h-12 w-12 text-gray-300" />
                            <p className="text-lg font-medium">No hunters found</p>
                            <p>Be the first to start hunting scammers!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProfiles.map((profile, index) => (
                        <TableRow 
                          key={profile.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="text-center font-medium">
                            <div className="flex items-center justify-center">
                              {renderRankIcon(index)}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-amber-800 flex items-center justify-center text-white mr-3 overflow-hidden">
                                {profile.profile_pic_url ? (
                                  <img 
                                    src={profile.profile_pic_url} 
                                    alt={profile.display_name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full w-full">
                                    {profile.display_name.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{profile.display_name}</div>
                                <div className="text-sm text-gray-500">@{profile.username || profile.display_name.toLowerCase().replace(/\s/g, '')}</div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex space-x-2 justify-center">
                              {profile.x_link && (
                                <a 
                                  href={profile.x_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-amber-50 hover:bg-amber-100 p-2 rounded-full transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-800">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                  </svg>
                                </a>
                              )}
                              {profile.website_link && (
                                <a 
                                  href={profile.website_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-amber-50 hover:bg-amber-100 p-2 rounded-full transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-800">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center font-medium">
                            {profile.reports_count || 0}
                          </TableCell>
                          
                          <TableCell className="text-center">
                            {profile.likes_count || 0}
                          </TableCell>
                          
                          <TableCell className="text-center">
                            {formatNumber(profile.views_count || 0)}
                          </TableCell>
                          
                          <TableCell className="text-center">
                            {profile.comments_count || 0}
                          </TableCell>
                          
                          <TableCell className="text-center font-medium text-amber-800">
                            {profile.bounty_amount ? `${formatNumber(profile.bounty_amount)} BOSC` : '0 BOSC'}
                          </TableCell>
                          
                          <TableCell className="text-center text-gray-500">
                            1w
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
