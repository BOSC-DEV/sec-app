import React, { useEffect, useState } from 'react';
import CompactHero from '@/components/common/CompactHero';
import ScammerCard from '@/components/common/ScammerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getScammers } from '@/services/scammerService';
import { getProfileByWallet } from '@/services/profileService';
import { Grid, List, Search, SlidersHorizontal, Globe, ThumbsUp, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Scammer, Profile } from '@/types/dataTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import CurrencyIcon from '@/components/common/CurrencyIcon';
import { formatNumber } from '@/lib/utils';
const MostWantedPage = () => {
  const [filteredScammers, setFilteredScammers] = useState<Scammer[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('bounty');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [reporterProfiles, setReporterProfiles] = useState<Record<string, Profile>>({});
  const navigate = useNavigate();
  const {
    data: scammers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['scammers'],
    queryFn: getScammers
  });
  useEffect(() => {
    const fetchReporterProfiles = async () => {
      const uniqueReporterIds = [...new Set(scammers.map(scammer => scammer.added_by).filter(Boolean))];
      const profilesMap: Record<string, Profile> = {};
      await Promise.all(uniqueReporterIds.map(async walletAddress => {
        if (walletAddress) {
          try {
            const profile = await getProfileByWallet(walletAddress);
            if (profile) {
              profilesMap[walletAddress] = profile;
            }
          } catch (err) {
            console.error(`Error fetching profile for ${walletAddress}:`, err);
          }
        }
      }));
      setReporterProfiles(profilesMap);
    };
    if (scammers.length > 0) {
      fetchReporterProfiles();
    }
  }, [scammers]);
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  const handleRowClick = (scammerId: string) => {
    navigate(`/scammer/${scammerId}`);
  };
  useEffect(() => {
    const filtered = scammers.filter(scammer => scammer.name.toLowerCase().includes(searchQuery.toLowerCase()) || scammer.accused_of && scammer.accused_of.toLowerCase().includes(searchQuery.toLowerCase()) || scammer.aliases && scammer.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) || scammer.wallet_addresses && scammer.wallet_addresses.some(address => address.toLowerCase().includes(searchQuery.toLowerCase())));
    const sorted = [...filtered].sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case 'rank':
          compareResult = filtered.indexOf(a) + 1 - (filtered.indexOf(b) + 1);
          break;
        case 'name':
          compareResult = a.name.localeCompare(b.name);
          break;
        case 'bounty':
          compareResult = (b.bounty_amount || 0) - (a.bounty_amount || 0);
          break;
        case 'accused_of':
          compareResult = (a.accused_of || '').localeCompare(b.accused_of || '');
          break;
        case 'aliases':
          compareResult = (a.aliases || []).join(', ').localeCompare((b.aliases || []).join(', '));
          break;
        case 'views':
          compareResult = (b.views || 0) - (a.views || 0);
          break;
        case 'likes':
          compareResult = (b.likes || 0) - (a.likes || 0);
          break;
        case 'date':
          compareResult = new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
          break;
        default:
          compareResult = 0;
      }
      return sortDirection === 'asc' ? compareResult * -1 : compareResult;
    });
    setFilteredScammers(sorted);
  }, [scammers, searchQuery, sortBy, sortDirection]);
  if (error) {
    console.error('Failed to load scammers', error);
  }
  const renderSortIndicator = (columnName: string) => {
    if (sortBy === columnName) {
      return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
    }
    return null;
  };
  const getReporterProfile = (walletAddress: string | undefined) => {
    if (!walletAddress) return null;
    return reporterProfiles[walletAddress] || null;
  };
  return <div>
      <CompactHero title="Most Wanted" subtitle="Browse the database of reported crimes." />

      <section className="icc-section bg-white">
        <div className="icc-container">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input type="search" placeholder="Search by name or description..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              
              <div className="flex gap-2">
                <Select defaultValue={sortBy} onValueChange={value => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bounty">Highest Bounty</SelectItem>
                    <SelectItem value="date">Most Recent</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="likes">Most Agreed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className={viewMode === 'grid' ? 'bg-muted' : ''} onClick={() => setViewMode('grid')}>
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon" className={viewMode === 'table' ? 'bg-muted' : ''} onClick={() => setViewMode('table')}>
                  <List className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            
            {showFilters && <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bounty Range</label>
                    <div className="flex gap-2 items-center">
                      <Input placeholder="Min" type="number" className="w-full" />
                      <span>-</span>
                      <Input placeholder="Max" type="number" className="w-full" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Added</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </div>
              </div>}
          </div>

          <div className="mb-6">
            
          </div>

          {isLoading ? viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(index => <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>)}
              </div> : <div className="w-full overflow-hidden rounded-lg border border-icc-gold/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-icc-gold/30 border-b border-icc-gold">
                      <TableHead className="w-12 font-bold text-icc-blue">№</TableHead>
                      <TableHead className="font-bold text-icc-blue">Outlaw</TableHead>
                      <TableHead className="font-bold text-icc-blue text-center">
                        <div className="flex items-center justify-center">
                          <CurrencyIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue">Accused Of</TableHead>
                      <TableHead className="font-bold text-icc-blue">Aliases</TableHead>
                      <TableHead className="font-bold text-icc-blue text-center">
                        <div className="flex items-center justify-center">
                          <Globe className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center">
                        <div className="flex items-center justify-center">
                          <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center">
                        <div className="flex items-center justify-center">
                          <Eye className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue">Posted</TableHead>
                      <TableHead className="font-bold text-icc-blue text-center">
                        <div className="flex items-center justify-center">
                          By
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map(index => <TableRow key={index} className="border-b border-icc-gold/30">
                        <TableCell>
                          <Skeleton className="h-6 w-6" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div> : viewMode === 'grid' ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredScammers.map((scammer, index) => <ScammerCard key={scammer.id} scammer={scammer} rank={index} />)}
            </div> : <div className="w-full overflow-hidden rounded-lg border border-icc-gold/50">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-icc-gold/30 border-b border-icc-gold">
                      <TableHead className="w-12 font-bold text-icc-blue dark:text-white cursor-pointer" onClick={() => handleSort('rank')}>
                        <div className="flex items-center">
                          <span>№</span>
                          {renderSortIndicator('rank')}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue dark:text-white cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center">
                          <span>The Accused</span>
                          {renderSortIndicator('name')}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center dark:text-white cursor-pointer" onClick={() => handleSort('bounty')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <CurrencyIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              {renderSortIndicator('bounty')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Bounty Amount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue dark:text-white cursor-pointer" onClick={() => handleSort('accused_of')}>
                        <div className="flex items-center">
                          <span>Accusations</span>
                          {renderSortIndicator('accused_of')}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue dark:text-white cursor-pointer" onClick={() => handleSort('aliases')}>
                        <div className="flex items-center">
                          <span>Aliases</span>
                          {renderSortIndicator('aliases')}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center dark:text-white">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <Globe className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Links</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center dark:text-white cursor-pointer" onClick={() => handleSort('likes')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              {renderSortIndicator('likes')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Likes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center dark:text-white cursor-pointer" onClick={() => handleSort('views')}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center cursor-pointer">
                              <Eye className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                              {renderSortIndicator('views')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Views</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue dark:text-white cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          <span>Posted</span>
                          {renderSortIndicator('date')}
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-icc-blue text-center dark:text-white">
                        <div className="flex items-center justify-center">
                          By
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScammers.map((scammer, index) => {
                  const reporterProfile = getReporterProfile(scammer.added_by);
                  return <TableRow key={scammer.id} className="border-b border-icc-gold/30 hover:bg-icc-gold/10 cursor-pointer transition-colors" onClick={() => handleRowClick(scammer.id)}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img src={scammer.photo_url || '/placeholder.svg'} alt={scammer.name} className="w-10 h-10 rounded-full object-cover border-2 border-icc-gold" />
                              <span className="font-medium text-icc-blue dark:text-white">{scammer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-icc-primary dark:text-white">
                            {scammer.bounty_amount ? <span className="flex items-center justify-center">
                                {formatNumber(scammer.bounty_amount)} <CurrencyIcon size="sm" className="ml-1" />
                              </span> : <span className="flex items-center justify-center">
                                0 <CurrencyIcon size="sm" className="ml-1" />
                              </span>}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate dark:text-white">
                            {scammer.accused_of || '-'}
                          </TableCell>
                          <TableCell>
                            {scammer.aliases && scammer.aliases.length > 0 ? <div className="flex flex-wrap gap-1">
                                <Badge variant="gold" className="text-xs dark:text-white">
                                  {scammer.aliases[0]}
                                </Badge>
                                {scammer.aliases.length > 1 && <Badge variant="gold" className="text-xs flex items-center gap-0.5 dark:text-white">
                                    <Plus className="h-3 w-3" />
                                    {scammer.aliases.length - 1}
                                  </Badge>}
                              </div> : <span className="text-gray-400 dark:text-gray-300">-</span>}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {scammer.links && scammer.links.length > 0 ? scammer.links.map((link, i) => <a key={i} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="inline-block p-1 rounded-full bg-icc-blue hover:bg-icc-blue-light transition-colors" onClick={e => e.stopPropagation()}>
                                    <Globe className="h-4 w-4 text-white" />
                                  </a>) : <span className="text-gray-400 dark:text-gray-300">-</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {formatNumber(scammer.likes || 0)}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatNumber(scammer.views || 0)}
                          </TableCell>
                          <TableCell>
                            {new Date(scammer.date_added).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit'
                      })}
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="w-8 h-8 bg-icc-blue-light cursor-pointer border border-icc-gold/50 mx-auto" onClick={e => {
                            e.stopPropagation();
                            if (reporterProfile) {
                              navigate(`/profile/${reporterProfile.username || reporterProfile.wallet_address}`);
                            }
                          }}>
                                  {reporterProfile?.profile_pic_url ? <AvatarImage src={reporterProfile.profile_pic_url} alt={reporterProfile.display_name} onError={e => {
                              e.currentTarget.style.display = 'none';
                            }} /> : null}
                                  <AvatarFallback className="bg-icc-blue text-white">
                                    {reporterProfile ? reporterProfile.display_name.substring(0, 2).toUpperCase() : '?'}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{reporterProfile?.display_name || 'Unknown Reporter'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>;
                })}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </div>}

          {!isLoading && filteredScammers.length === 0 && <div className="text-center py-12">
              <div className="mb-4">
                <Search className="h-12 w-12 mx-auto text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No scammers found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
            setSearchQuery('');
            setSortBy('bounty');
            setShowFilters(false);
          }}>
                Clear All Filters
              </Button>
            </div>}
        </div>
      </section>
    </div>;
};
export default MostWantedPage;