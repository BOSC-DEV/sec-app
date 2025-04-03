import React, { useEffect, useState } from 'react';
import CompactHero from '@/components/common/CompactHero';
import ScammerCard from '@/components/common/ScammerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getScammers } from '@/services/supabaseService';
import { getProfileByWallet } from '@/services/profileService';
import { Grid, Globe, List, Search, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Scammer, Profile } from '@/types/dataTypes';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    queryFn: getScammers,
  });

  useEffect(() => {
    const fetchReporterProfiles = async () => {
      const uniqueReporterIds = [...new Set(scammers.map(scammer => scammer.added_by).filter(Boolean))];
      
      const profilesMap: Record<string, Profile> = {};
      
      await Promise.all(uniqueReporterIds.map(async (walletAddress) => {
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
    const filtered = scammers.filter(scammer => 
      scammer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scammer.accused_of && scammer.accused_of.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (scammer.aliases && scammer.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    
    const sorted = [...filtered].sort((a, b) => {
      let compareResult = 0;
      
      switch (sortBy) {
        case 'rank':
          compareResult = (filtered.indexOf(a) + 1) - (filtered.indexOf(b) + 1);
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
          compareResult = ((a.aliases || []).join(', ')).localeCompare((b.aliases || []).join(', '));
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
      return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    }
    return null;
  };

  const getReporterProfile = (walletAddress: string | undefined) => {
    if (!walletAddress) return null;
    return reporterProfiles[walletAddress] || null;
  };

  return (
    <div>
      <CompactHero 
        title="Most Wanted"
        subtitle="Browse the database of reported cryptocurrency scammers and fraudsters."
      />

      <section className="icc-section bg-white">
        <div className="icc-container">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Search by name or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select defaultValue={sortBy} onValueChange={(value) => setSortBy(value)}>
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
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className={viewMode === 'table' ? 'bg-muted' : ''}
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
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
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-icc-gray">
              Showing <span className="font-semibold">{filteredScammers.length}</span> results
            </p>
          </div>

          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50">
                      <TableHead className="w-12 font-bold text-icc-primary">№</TableHead>
                      <TableHead className="font-bold text-icc-primary">Outlaw</TableHead>
                      <TableHead className="font-bold text-icc-primary">Links</TableHead>
                      <TableHead className="font-bold text-icc-primary">Accused Of</TableHead>
                      <TableHead className="font-bold text-icc-primary">Aliases</TableHead>
                      <TableHead className="font-bold text-icc-primary text-center">
                        <span>💰</span>
                      </TableHead>
                      <TableHead className="font-bold text-icc-primary text-center">
                        <span>👍</span>
                      </TableHead>
                      <TableHead className="font-bold text-icc-primary text-center">
                        <span>👁️</span>
                      </TableHead>
                      <TableHead className="font-bold text-icc-primary">Posted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <TableRow key={index}>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredScammers.map(scammer => (
                <ScammerCard key={scammer.id} scammer={scammer} />
              ))}
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50">
                    <TableHead 
                      className="w-12 font-bold text-icc-primary cursor-pointer"
                      onClick={() => handleSort('rank')}
                    >
                      №{renderSortIndicator('rank')}
                    </TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Outlaw{renderSortIndicator('name')}
                    </TableHead>
                    <TableHead className="font-bold text-icc-primary">Links</TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary cursor-pointer"
                      onClick={() => handleSort('accused_of')}
                    >
                      Accused Of{renderSortIndicator('accused_of')}
                    </TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary cursor-pointer"
                      onClick={() => handleSort('aliases')}
                    >
                      Aliases{renderSortIndicator('aliases')}
                    </TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary text-center cursor-pointer"
                      onClick={() => handleSort('bounty')}
                    >
                      <span>💰</span>{renderSortIndicator('bounty')}
                    </TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary text-center cursor-pointer"
                      onClick={() => handleSort('likes')}
                    >
                      <span>👍</span>{renderSortIndicator('likes')}
                    </TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary text-center cursor-pointer"
                      onClick={() => handleSort('views')}
                    >
                      <span>👁️</span>{renderSortIndicator('views')}
                    </TableHead>
                    <TableHead 
                      className="font-bold text-icc-primary cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      Posted{renderSortIndicator('date')}
                    </TableHead>
                    <TableHead className="font-bold text-icc-primary text-center flex items-center justify-center">By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScammers.map((scammer, index) => {
                    const reporterProfile = getReporterProfile(scammer.added_by);
                    
                    return (
                      <TableRow 
                        key={scammer.id} 
                        className="bg-amber-50/30 hover:bg-amber-50/50 cursor-pointer"
                        onClick={() => handleRowClick(scammer.id)}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={scammer.photo_url || 'public/placeholder.svg'} 
                              alt={scammer.name} 
                              className="w-10 h-10 rounded-full object-cover border border-amber-200"
                            />
                            <span className="font-medium">{scammer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {scammer.links && scammer.links.length > 0 ? (
                              scammer.links.map((link, i) => (
                                <a 
                                  key={i} 
                                  href={link.startsWith('http') ? link : `https://${link}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block p-1 rounded-full bg-amber-100 hover:bg-amber-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Globe className="h-4 w-4 text-amber-800" />
                                </a>
                              ))
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {scammer.accused_of || '-'}
                        </TableCell>
                        <TableCell>
                          {scammer.aliases && scammer.aliases.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {scammer.aliases.map((alias, i) => (
                                <Badge key={i} variant="outline" className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300">
                                  {alias}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-icc-primary">
                          {scammer.bounty_amount ? `${scammer.bounty_amount} $SEC` : '0 $SEC'}
                        </TableCell>
                        <TableCell className="text-center">
                          {scammer.likes || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          {scammer.views || 0}
                        </TableCell>
                        <TableCell>
                          {new Date(scammer.date_added).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <Avatar 
                            className="w-8 h-8 bg-icc-blue-light cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (reporterProfile) {
                                navigate(`/profile/${reporterProfile.username || reporterProfile.wallet_address}`);
                              }
                            }}
                          >
                            {reporterProfile?.profile_pic_url ? (
                              <AvatarImage 
                                src={reporterProfile.profile_pic_url} 
                                alt={reporterProfile.display_name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                            <AvatarFallback className="bg-icc-blue text-white">
                              {reporterProfile ? 
                                reporterProfile.display_name.substring(0, 2).toUpperCase() : 
                                '?'}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && filteredScammers.length === 0 && (
            <div className="text-center py-12">
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MostWantedPage;
