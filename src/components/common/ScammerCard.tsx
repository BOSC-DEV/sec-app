
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, ThumbsDown, DollarSign, MessageSquare, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { truncateText } from '@/lib/utils';
import { Scammer } from '@/types/dataTypes';
import { useProfile } from '@/contexts/ProfileContext';

interface ScammerCardProps {
  scammer: Scammer;
}

const ScammerCard: React.FC<ScammerCardProps> = ({ scammer }) => {
  const { profile } = useProfile();
  const isCreator = profile?.wallet_address === scammer.added_by;

  return (
    <div className="icc-card overflow-hidden group">
      <Link to={`/scammer/${scammer.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={scammer.photo_url || '/placeholder.svg'} 
            alt={scammer.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 bg-icc-gold text-icc-blue-dark px-3 py-1 text-sm font-bold flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{scammer.bounty_amount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-serif font-bold text-icc-blue">{scammer.name}</h3>
          <p className="text-sm text-icc-gray mt-1">{truncateText(scammer.accused_of, 100)}</p>
          
          <div className="mt-4 text-xs text-icc-gray-dark flex justify-between items-center">
            <div>
              Added: {new Date(scammer.date_added).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {scammer.views}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {scammer.likes}
              </span>
              <span className="flex items-center">
                <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                {scammer.dislikes}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {scammer.comments?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4 pt-0 mt-2 border-t border-gray-100 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Agree
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <DollarSign className="h-3.5 w-3.5 mr-1" />
          Add Bounty
        </Button>
        {isCreator ? (
          <Link to={`/report/${scammer.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="text-xs">
            <ThumbsDown className="h-3.5 w-3.5 mr-1" />
            Disagree
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScammerCard;
