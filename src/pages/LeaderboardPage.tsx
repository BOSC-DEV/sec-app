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

type SortField = 'total_bounty' | 'rank' | 'name' | 'reports' | 'likes' | 'views' | 'comments' | 'bounty' | 'bounties_raised' | 'activity';
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
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [filteredProfiles, sortField, sortOrder]);
  
  const renderRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-gray-700 font-medium">{rank + 1}</span>;
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1A1F2C] text-white py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Leaderboard</h1>
          <p className="text-lg text-gray-300">Top hunters tracking and reporting cryptocurrency scammers</p>
        </div>
      </div>

      <div className="border-b-4 border-icc-gold" />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="relative w-full md:w-1/2 lg:w-1/3 mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, username or wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              <Badge variant="secondary" className="inline-flex">
                {sortedProfiles.length} {sortedProfiles.length === 1 ? 'hunter' : 'hunters'} found
              </Badge>
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F0] border-b border-gray-200">
                    <TableHead className="w-20 text-center cursor-pointer font-bold" onClick={() => handleSort('total_bounty')}>
                      Rank {getSortIcon('total_bounty')}
                    </TableHead>
                    
                    <TableHead className="cursor-pointer font-bold" onClick={() => handleSort('name')}>
                      Hunter {getSortIcon('name')}
                    </TableHead>
                    
                    <TableHead className="w-24 text-center cursor-pointer font-bold" onClick={() => handleSort('reports')}>
                      Reports {getSortIcon('reports')}
                    </TableHead>
                    
                    <TableHead className="w-24 text-center cursor-pointer" onClick={() => handleSort('likes')}>
                      <ThumbsUp className="h-4 w-4 mx-auto text-gray-600" />
                      {getSortIcon('likes')}
                    </TableHead>
                    
                    <TableHead className="w-24 text-center cursor-pointer" onClick={() => handleSort('views')}>
                      <Eye className="h-4 w-4 mx-auto text-gray-600" />
                      {getSortIcon('views')}
                    </TableHead>
                    
                    <TableHead className="w-24 text-center cursor-pointer" onClick={() => handleSort('comments')}>
                      <MessageSquare className="h-4 w-4 mx-auto text-gray-600" />
                      {getSortIcon('comments')}
                    </TableHead>
                    
                    <TableHead className="w-24 text-center">
                      <Globe className="h-4 w-4 mx-auto text-gray-600" />
                    </TableHead>
                    
                    <TableHead className="text-center cursor-pointer font-bold" onClick={() => handleSort('bounty')}>
                      Bounties Paid {getSortIcon('bounty')}
                    </TableHead>
                    
                    <TableHead className="text-center cursor-pointer font-bold" onClick={() => handleSort('bounties_raised')}>
                      Bounties Raised {getSortIcon('bounties_raised')}
                    </TableHead>
                    
                    <TableHead className="w-20 text-center cursor-pointer" onClick={() => handleSort('activity')}>
                      <Clock className="h-4 w-4 mx-auto text-gray-600" />
                      {getSortIcon('activity')}
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
                      <TableRow key={profile.id} className="hover:bg-gray-50">
                        <TableCell className="text-center">
                          {renderRankIcon(index)}
                        </TableCell>
                        
                        <TableCell>
                          <Link to={`/profile/${profile.username || profile.wallet_address}`} className="flex items-center hover:opacity-80">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={profile.profile_pic_url} alt={profile.display_name} />
                              <AvatarFallback className="bg-[#1A1F2C] text-white">
                                {profile.display_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{profile.display_name}</div>
                              <div className="text-sm text-gray-500">@{profile.username || profile.display_name.toLowerCase().replace(/\s/g, '')}</div>
                            </div>
                          </Link>
                        </TableCell>
                        
                        <TableCell className="text-center font-medium">
                          {formatNumber(profile.reports_count || 0)}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          {formatNumber(profile.likes_count || 0)}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          {formatNumber(profile.views_count || 0)}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          {formatNumber(profile.comments_count || 0)}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {profile.x_link && (
                              <a href={profile.x_link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-[#1A1F2C] hover:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                              </a>
                            )}
                            {profile.website_link && (
                              <a href={profile.website_link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-[#1A1F2C] hover:bg-gray-800">
                                <Globe className="h-3.5 w-3.5 text-white" />
                              </a>
                            )}
                            {!profile.x_link && !profile.website_link && <span className="text-gray-400">-</span>}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center font-semibold">
                          <span className="flex items-center justify-center">
                            {formatNumber(profile.bounty_amount || 0)}
                            <CurrencyIcon size="sm" className="ml-1" />
                          </span>
                        </TableCell>
                        
                        <TableCell className="text-center font-semibold">
                          <span className="flex items-center justify-center">
                            {formatNumber(profile.bounties_raised || 0)}
                            <CurrencyIcon size="sm" className="ml-1" />
                          </span>
                        </TableCell>
                        
                        <TableCell className="text-center text-gray-500">
                          {profile.created_at ? formatProfileAge(profile.created_at) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
