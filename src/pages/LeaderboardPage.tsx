
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, ThumbsUp, Eye, MessageSquare, Clock, FileText, ChevronUp, ChevronDown, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompactHero from '@/components/common/CompactHero';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { getProfiles } from '@/services/profileService';
import { Profile } from '@/types/dataTypes';
import { formatNumber } from '@/lib/utils';
import CurrencyIcon from '@/components/common/CurrencyIcon';

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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const sortedProfiles = [...profiles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'rank':
        comparison = (b.points || 0) - (a.points || 0);
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
        comparison = 0;
        break;
      default:
        comparison = 0;
    }
    
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
      <CompactHero 
        title="Leaderboard"
        subtitle="Top hunters tracking and reporting cryptocurrency scammers."
      />

      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-icc-gold/30 border-b border-icc-gold">
                      <TableHead 
                        className="w-20 text-center cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('rank')}
                      >
                        <div className="flex items-center justify-center">
                          <span>Rank</span>
                          {getSortIcon('rank')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          <span>Hunter</span>
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="font-bold text-icc-blue text-center cursor-pointer"
                        onClick={() => handleSort('reports')}
                      >
                        <div className="flex items-center justify-center">
                          <span>Reports</span>
                          <FileText className="h-4 w-4 ml-1 text-gray-500" />
                          {getSortIcon('reports')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('likes')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <ThumbsUp className="h-4 w-4 text-gray-500" />
                              {getSortIcon('likes')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Likes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('views')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <Eye className="h-4 w-4 text-gray-500" />
                              {getSortIcon('views')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Views</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('comments')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              {getSortIcon('comments')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Comments</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="font-bold text-icc-blue text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <Globe className="h-4 w-4 text-gray-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Links</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead 
                        className="text-center cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('bounty')}
                      >
                        <div className="flex items-center justify-center">
                          <span>Total Bounty</span>
                          {getSortIcon('bounty')}
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="w-20 text-center cursor-pointer font-bold text-icc-blue"
                        onClick={() => handleSort('activity')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <Clock className="h-4 w-4 text-gray-500" />
                              {getSortIcon('activity')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Last Activity</p>
                          </TooltipContent>
                        </Tooltip>
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
                          className="border-b border-icc-gold/30 hover:bg-icc-gold/10 transition-colors"
                        >
                          <TableCell className="text-center font-medium">
                            <div className="flex items-center justify-center">
                              {renderRankIcon(index)}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:opacity-80 transition-opacity">
                              <div className="flex items-center">
                                <Avatar className="mr-3 border-2 border-icc-gold">
                                  <AvatarImage 
                                    src={profile.profile_pic_url} 
                                    alt={profile.display_name}
                                  />
                                  <AvatarFallback className="bg-icc-blue-light text-white">
                                    {profile.display_name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-icc-blue">{profile.display_name}</div>
                                  <div className="text-sm text-gray-500">@{profile.username || profile.display_name.toLowerCase().replace(/\s/g, '')}</div>
                                </div>
                              </div>
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center font-medium">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.reports_count || 0}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.likes_count || 0}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {formatNumber(profile.views_count || 0)}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.comments_count || 0}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {profile.x_link && (
                                <a 
                                  href={profile.x_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block p-2 rounded-full bg-icc-blue hover:bg-icc-blue-light transition-colors"
                                  aria-label={`${profile.display_name} on X`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                  </svg>
                                </a>
                              )}
                              {profile.website_link && (
                                <a 
                                  href={profile.website_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block p-2 rounded-full bg-icc-blue hover:bg-icc-blue-light transition-colors"
                                  aria-label={`${profile.display_name}'s website`}
                                >
                                  <Globe className="h-4 w-4 text-white" />
                                </a>
                              )}
                              {!profile.x_link && !profile.website_link && (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center font-semibold text-icc-primary">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.bounty_amount ? (
                                <span className="flex items-center justify-center">
                                  {profile.bounty_amount} <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  0 <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              )}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center text-gray-500">
                            1w
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
