
import React, { useState, useEffect } from 'react';
import { BountyContribution } from '@/types/dataTypes';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';
import { getProfilesByDisplayName } from '@/services/profileService';
import CurrencyIcon from '@/components/common/CurrencyIcon';

interface BountyContributionListProps {
  contributions: BountyContribution[];
  isLoading: boolean;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  itemsPerPage?: number;
  userContributionAmount?: number;
}

const BountyContributionList: React.FC<BountyContributionListProps> = ({
  contributions,
  isLoading,
  totalCount = 0,
  onPageChange,
  currentPage = 1,
  itemsPerPage = 10,
  userContributionAmount = 0
}) => {
  const [focused, setFocused] = useState<string | null>(null);
  const [contributorUsernames, setContributorUsernames] = useState<Record<string, string>>({});
  const renderTimestamp = React.useMemo(() => Date.now(), [contributions]);

  useEffect(() => {
    const fetchContributorUsernames = async () => {
      const usernamesMap: Record<string, string> = {};
      
      await Promise.all(contributions.map(async contribution => {
        try {
          const profiles = await getProfilesByDisplayName(contribution.contributor_name);
          if (profiles && profiles.length > 0) {
            const matchingProfile = profiles.find(p => p.wallet_address === contribution.contributor_id) || profiles[0];
            usernamesMap[contribution.contributor_name] = matchingProfile.username || contribution.contributor_name;
          } else {
            usernamesMap[contribution.contributor_name] = contribution.contributor_name;
          }
        } catch (error) {
          console.error(`Error fetching profiles for ${contribution.contributor_name}:`, error);
          usernamesMap[contribution.contributor_name] = contribution.contributor_name;
        }
      }));
      
      setContributorUsernames(usernamesMap);
    };
    
    if (contributions.length > 0) {
      fetchContributorUsernames();
    }
  }, [contributions]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };

  if (isLoading) {
    return <div role="status" aria-live="polite" aria-busy="true" className="text-center py-4">
        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        <span className="sr-only">Loading bounty contributions...</span>
      </div>;
  }

  if (!contributions || contributions.length === 0) {
    return <div role="status" aria-live="polite" className="text-center py-4 text-icc-gray">
        <p>No contributions yet. Be the first to add to this bounty!</p>
      </div>;
  }

  return <div className="space-y-4">
      {userContributionAmount > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-green-800 dark:text-green-300 text-sm">
          You've contributed <CurrencyIcon size="sm" className="inline" /> {userContributionAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} to this bounty
        </div>
      )}

      <h4 id="contributions-heading" className="font-gothic font-bold text-icc-blue text-lg text-center">Recent Contributors:</h4>
      
      <div aria-labelledby="contributions-heading" className="space-y-3">
        {contributions.map(contribution => {
        const stableKey = `contribution-${contribution.id}`;
        const profilePicUrl = contribution.contributor_profile_pic ? `${contribution.contributor_profile_pic}${contribution.contributor_profile_pic.includes('?') ? '&' : '?'}t=${renderTimestamp}` : '/placeholder.svg';
        const profileLink = contributorUsernames[contribution.contributor_name] ? `/profile/${contributorUsernames[contribution.contributor_name]}` : `/profile/${contribution.contributor_name}`;
        
        return <div key={stableKey} className={`border border-icc-gold-light/30 rounded-lg p-3 bg-icc-gold-light/10 transition ${focused === contribution.id ? 'ring-2 ring-icc-gold' : ''}`} onFocus={() => setFocused(contribution.id)} onBlur={() => setFocused(null)} tabIndex={0}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Link to={profileLink} aria-label={`View ${contribution.contributor_name}'s profile`}>
                    <Avatar className="h-6 w-6 cursor-pointer hover:ring-2 hover:ring-icc-gold transition-all">
                      <AvatarImage src={profilePicUrl} alt={`${contribution.contributor_name}'s profile`} />
                      <AvatarFallback aria-hidden="true">
                        {contribution.contributor_name?.substring(0, 2).toUpperCase() || 'UN'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link to={profileLink} className="text-sm font-medium text-icc-blue-dark hover:text-icc-gold hover:underline transition-colors" aria-label={`View ${contribution.contributor_name}'s profile`}>
                    {contribution.contributor_name}
                  </Link>
                </div>
                <div className="flex items-center text-icc-gold-dark font-medium text-sm" aria-label={`Contributed ${contribution.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} SEC`}>
                  <span className="flex items-center gap-1">
                    <CurrencyIcon size="sm" />
                    {contribution.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} 
                  </span>
                </div>
              </div>
              
              {contribution.comment && <p className="text-sm text-icc-gray-dark dark:text-white mb-2 italic">
                  "{contribution.comment}"
                </p>}
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-icc-gray flex items-center" aria-label={`Contributed on ${formatDate(contribution.created_at)}`}>
                  <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                  <span>{formatDate(contribution.created_at)}</span>
                </div>
              </div>
            </div>;
      })}
      </div>
      
      {totalPages > 1 && onPageChange && <div className="flex justify-between items-center pt-3">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPreviousPage} aria-label="Previous page">
            <ArrowLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            Prev
          </Button>
          
          <span className="text-sm text-icc-gray" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage} aria-label="Next page">
            Next
            <ArrowRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        </div>}
    </div>;
};

export default BountyContributionList;
