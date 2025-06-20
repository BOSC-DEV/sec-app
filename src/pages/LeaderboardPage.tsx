import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, ThumbsUp, Eye, MessageSquare, Clock, Globe, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompactHero from '@/components/common/CompactHero';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProfileStatistics } from '@/services/statisticsService';
import { Profile } from '@/types/dataTypes';
import { formatNumber, formatProfileAge } from '@/lib/utils';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import BadgeTier from '@/components/profile/BadgeTier';
import { calculateBadgeTier } from '@/utils/badgeUtils';

type SortField = 'total_bounty' | 'rank' | 'name' | 'reports' | 'likes' | 'views' | 'comments' | 'bounty' | 'bounties_raised' | 'activity' | 'sec_balance';
type SortOrder = 'asc' | 'desc';

const LeaderboardPage = () => {
  const [sortField, setSortField] = useState<SortField>('total_bounty');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: profiles = [],
    isLoading
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: getProfileStatistics
  });
  
  const profilesWithTotalBounty = profiles.map(profile => ({
    ...profile,
    total_bounty: (profile.bounty_amount || 0) + (profile.bounties_raised || 0)
  }));
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><path d="m5 15 7-7 7 7"/></svg> : 
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1"><path d="m19 9-7 7-7-7"/></svg>;
  };
  
  const filteredProfiles = useMemo(() => {
    if (!searchTerm.trim()) return profilesWithTotalBounty;
    
    const term = searchTerm.toLowerCase().trim();
    
    return profilesWithTotalBounty.filter(profile => {
      return (
        profile.display_name.toLowerCase().includes(term) ||
        (profile.username && profile.username.toLowerCase().includes(term)) ||
        (profile.wallet_address && profile.wallet_address.toLowerCase().includes(term))
      );
    });
  }, [profilesWithTotalBounty, searchTerm]);
  
  const sortedProfiles = useMemo(() => {
    return [...filteredProfiles].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'total_bounty':
          comparison = (b.total_bounty || 0) - (a.total_bounty || 0);
          if (comparison === 0 && a.created_at && b.created_at) {
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          break;
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
        case 'bounties_raised':
          comparison = (b.bounties_raised || 0) - (a.bounties_raised || 0);
          break;
        case 'activity':
          if (a.created_at && b.created_at) {
            comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          break;
        case 'sec_balance':
          comparison = (b.sec_balance || 0) - (a.sec_balance || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [filteredProfiles, sortField, sortOrder]);
  
  const renderRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-amber-700" />;
    return <span className="text-gray-700 dark:text-gray-300 font-medium">{rank + 1}</span>;
  };
  
  return (
    <div>
      <CompactHero title="Leaderboard" subtitle="Top hunters tracking and reporting cryptocurrency scammers." />

      <section className="py-12 bg-white dark:bg-icc-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="relative w-full md:w-1/2 lg:w-1/3 mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, username or wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-icc-gold/30 focus:border-icc-gold focus:ring focus:ring-icc-gold/20 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {searchTerm && (
            <div className="mb-4 text-center">
              <Badge variant="coin" className="inline-flex">
                {sortedProfiles.length} {sortedProfiles.length === 1 ? 'hunter' : 'hunters'} found
              </Badge>
            </div>
          )}
          
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-icc-gold/50">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-icc-gold/30 border-b border-icc-gold">
                      <TableHead className="w-20 text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('total_bounty')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <span>Rank</span>
                              {getSortIcon('total_bounty')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ranked by total bounty (paid + raised)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('name')}>
                        <div className="flex items-center">
                          <span>Hunter</span>
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      
                      <TableHead className="font-bold text-icc-blue text-center cursor-pointer dark:text-white" onClick={() => handleSort('reports')}>
                        <div className="flex items-center justify-center">
                          <span>Reports</span>
                          {getSortIcon('reports')}
                        </div>
                      </TableHead>
                      
                      <TableHead className="text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('likes')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              {getSortIcon('likes')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Likes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('views')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <Eye className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              {getSortIcon('views')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Views</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('comments')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              {getSortIcon('comments')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Comments</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="font-bold text-icc-blue text-center dark:text-white">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <Globe className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Links</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('bounty')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <span>Bounties Paid</span>
                              {getSortIcon('bounty')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total bounties contributed by hunter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('bounties_raised')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <span>Bounties Raised</span>
                              {getSortIcon('bounties_raised')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total bounties raised for reports created by hunter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>

                      <TableHead className="text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('sec_balance')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              <span>SEC Balance</span>
                              {getSortIcon('sec_balance')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>SEC token balance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      
                      <TableHead className="w-20 text-center cursor-pointer font-bold text-icc-blue dark:text-white" onClick={() => handleSort('activity')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-300" />
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
                        <TableCell colSpan={10} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center text-gray-500 space-y-3">
                            <Trophy className="h-12 w-12 text-gray-300" />
                            {searchTerm ? (
                              <>
                                <p className="text-lg font-medium">No hunters found matching "{searchTerm}"</p>
                                <p>Try a different search term or clear the search</p>
                              </>
                            ) : (
                              <>
                                <p className="text-lg font-medium">No hunters found</p>
                                <p>Be the first to start hunting scammers!</p>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProfiles.map((profile, index) => (
                        <TableRow key={profile.id} className="border-b border-icc-gold/30 hover:bg-icc-gold/10 transition-colors">
                          <TableCell className="text-center font-medium">
                            <div className="flex items-center justify-center">
                              {renderRankIcon(index)}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:opacity-80 transition-opacity">
                              <div className="flex items-center">
                                <Avatar className="mr-3 border-2 border-icc-gold">
                                  <AvatarImage src={profile.profile_pic_url} alt={profile.display_name} />
                                  <AvatarFallback className="bg-icc-blue-light text-white">
                                    {profile.display_name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-icc-blue dark:text-white flex items-center gap-2">
                                    {profile.display_name}
                                    {profile.sec_balance !== undefined && profile.sec_balance !== null && (
                                      <BadgeTier 
                                        badgeInfo={calculateBadgeTier(profile.sec_balance)}
                                        size="sm"
                                        showProgress={false}
                                        context="chat"
                                      />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-300">@{profile.username || profile.display_name.toLowerCase().replace(/\s/g, '')}</div>
                                </div>
                              </div>
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center font-medium dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {formatNumber(profile.reports_count || 0)}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {formatNumber(profile.likes_count || 0)}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {formatNumber(profile.views_count || 0)}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {formatNumber(profile.comments_count || 0)}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {profile.x_link && (
                                <a href={profile.x_link} target="_blank" rel="noopener noreferrer" className="inline-block p-2 rounded-full bg-icc-blue hover:bg-icc-blue-light transition-colors" aria-label={`${profile.display_name} on X`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                  </svg>
                                </a>
                              )}
                              {profile.website_link && (
                                <a href={profile.website_link} target="_blank" rel="noopener noreferrer" className="inline-block p-2 rounded-full bg-icc-blue hover:bg-icc-blue-light transition-colors" aria-label={`${profile.display_name}'s website`}>
                                  <Globe className="h-4 w-4 text-white" />
                                </a>
                              )}
                              {!profile.x_link && !profile.website_link && <span className="text-gray-400 dark:text-gray-500">-</span>}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center font-semibold text-icc-primary dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.bounty_amount ? (
                                <span className="flex items-center justify-center">
                                  {formatNumber(profile.bounty_amount)} <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  0 <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              )}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center font-semibold text-icc-primary dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.bounties_raised ? (
                                <span className="flex items-center justify-center">
                                  {formatNumber(profile.bounties_raised)} <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  0 <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              )}
                            </Link>
                          </TableCell>

                          <TableCell className="text-center font-semibold text-icc-primary dark:text-white">
                            <Link to={`/profile/${profile.username || profile.wallet_address}`} className="hover:underline">
                              {profile.sec_balance !== undefined ? (
                                <span className="flex items-center justify-center">
                                  {formatNumber(profile.sec_balance)} <CurrencyIcon size="sm" className="ml-1" />
                                </span>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </Link>
                          </TableCell>
                          
                          <TableCell className="text-center text-gray-500 dark:text-gray-300">
                            {profile.created_at ? formatProfileAge(profile.created_at) : '-'}
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
