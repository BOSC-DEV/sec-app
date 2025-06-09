
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Search, Filter, SortAsc, Eye, AlertTriangle, Users } from 'lucide-react';

const SearchPage = () => {
  return (
    <DocsContent 
      title="Search & Navigation" 
      description="Efficiently find scammers, reports, and community content with our powerful search tools"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Search Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Search className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Our advanced search system helps you quickly locate scammers, reports, and community 
              discussions. Find the information you need to stay safe in the crypto space.
            </p>
          </div>
        </section>

        {/* Search Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <AlertTriangle className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Scammer Database Search</h3>
              <ul className="space-y-2">
                <li>• Search by name, alias, or known identifiers</li>
                <li>• Wallet address lookup</li>
                <li>• Keyword search in accusations</li>
                <li>• Filter by date added or bounty amount</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Content Search</h3>
              <ul className="space-y-2">
                <li>• Search announcements and discussions</li>
                <li>• Find specific chat messages</li>
                <li>• Filter by author or date</li>
                <li>• Search within comments and replies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Search Types */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Methods</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
                <p>Use the search bar in the header to instantly search across all scammer records. Perfect for quick lookups when you have a specific name or identifier.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
                <p>Use comprehensive filters on the main scammer list to narrow down results by bounty amount, date added, or specific categories of fraud.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Wallet Address Lookup</h3>
                <p>Directly search for wallet addresses to see if they're associated with any known scammers or fraudulent activities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Advanced Search Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Filter className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Smart Filtering</h3>
              <p className="text-sm">Filter by multiple criteria including bounty amount, date ranges, and fraud types</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <SortAsc className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Custom Sorting</h3>
              <p className="text-sm">Sort results by relevance, date, bounty amount, or community engagement</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Eye className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Search History</h3>
              <p className="text-sm">Recent searches are saved locally for quick access to previously searched items</p>
            </div>
          </div>
        </section>

        {/* Search Tips */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Tips & Best Practices</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Effective Searching</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Use partial wallet addresses (first/last 6 characters)</li>
                <li>• Try different variations of names and aliases</li>
                <li>• Use keywords from scam descriptions</li>
                <li>• Check multiple spelling variations</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Search Optimization</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Use specific terms rather than generic keywords</li>
                <li>• Combine filters for more precise results</li>
                <li>• Search within date ranges for recent activity</li>
                <li>• Use bounty filters to find high-priority cases</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Integration</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Platform-Wide Search</h3>
            <p className="mb-4">
              Our search functionality is integrated throughout the platform, accessible from:
            </p>
            <ul className="space-y-2">
              <li>• Main navigation header for global search</li>
              <li>• Scammer listing pages with advanced filters</li>
              <li>• Community pages for content search</li>
              <li>• Report submission forms for duplicate checking</li>
              <li>• Leaderboard and analytics pages</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default SearchPage;
