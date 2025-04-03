
import React from 'react';
import { BountyContribution } from '@/types/dataTypes';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Calendar } from 'lucide-react';

interface BountyContributionListProps {
  contributions: BountyContribution[];
  isLoading: boolean;
}

const BountyContributionList: React.FC<BountyContributionListProps> = ({
  contributions,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!contributions || contributions.length === 0) {
    return (
      <div className="text-center py-4 text-icc-gray">
        No contributions yet. Be the first to add to this bounty!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-icc-blue">Recent Contributors</h4>
      {contributions.map((contribution) => (
        <div key={contribution.id} className="border border-icc-gold-light/30 rounded-lg p-3 bg-icc-gold-light/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage 
                  src={contribution.contributor_profile_pic || '/placeholder.svg'} 
                  alt={contribution.contributor_name} 
                />
                <AvatarFallback>
                  {contribution.contributor_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-icc-blue-dark">
                {contribution.contributor_name}
              </span>
            </div>
            <div className="flex items-center text-icc-gold-dark font-medium text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              <span>{formatCurrency(contribution.amount)} $SEC</span>
            </div>
          </div>
          
          {contribution.comment && (
            <p className="text-sm text-icc-gray-dark mb-2 italic">
              "{contribution.comment}"
            </p>
          )}
          
          <div className="flex items-center text-xs text-icc-gray">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(contribution.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BountyContributionList;
