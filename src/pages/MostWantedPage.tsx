
import React, { useEffect, useState } from 'react';
import Hero from '@/components/common/Hero';
import ScammerCard from '@/components/common/ScammerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getScammers } from '@/services/supabaseService';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Scammer } from '@/types/dataTypes';

const MostWantedPage = () => {
  const [filteredScammers, setFilteredScammers] = useState<Scammer[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('bounty');
  const [showFilters, setShowFilters] = useState(false);

  const { 
    data: scammers = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['scammers'],
    queryFn: getScammers,
  });

  useEffect(() => {
    // Filter scammers based on search query
    const filtered = scammers.filter(scammer => 
      scammer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scammer.accused_of && scammer.accused_of.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Sort filtered scammers
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'bounty':
          return b.bounty_amount - a.bounty_amount;
        case 'date':
          return new Date(b.date_added).getTime() - new Date(a.date_added).getTime();
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
    
    setFilteredScammers(sorted);
  }, [scammers, searchQuery, sortBy]);

  if (error) {
    console.error('Failed to load scammers', error);
  }

  return (
    <div>
      <Hero 
        title="Most Wanted"
        subtitle="Browse the database of reported cryptocurrency scammers and fraudsters."
        showCta={false}
      />

      <section className="icc-section bg-white">
        <div className="icc-container">
          {/* Search and Filters */}
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-icc-gray">
              Showing <span className="font-semibold">{filteredScammers.length}</span> results
            </p>
          </div>

          {/* Scammers List */}
          {isLoading ? (
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
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredScammers.map(scammer => (
                <ScammerCard key={scammer.id} scammer={scammer} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left font-serif">Name</th>
                    <th className="px-4 py-3 text-left font-serif">Accusations</th>
                    <th className="px-4 py-3 text-left font-serif">Bounty</th>
                    <th className="px-4 py-3 text-left font-serif">Date Added</th>
                    <th className="px-4 py-3 text-left font-serif">Stats</th>
                    <th className="px-4 py-3 text-left font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScammers.map(scammer => (
                    <tr key={scammer.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <img 
                            src={scammer.photo_url} 
                            alt={scammer.name} 
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <span className="font-medium">{scammer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{scammer.accused_of}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-icc-blue">
                          ${scammer.bounty_amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(scammer.date_added).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-3 text-sm text-gray-600">
                          <span>👍 {scammer.likes || 0}</span>
                          <span>👎 {scammer.dislikes || 0}</span>
                          <span>👁️ {scammer.views || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm">
                          <Link to={`/scammer/${scammer.id}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
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
