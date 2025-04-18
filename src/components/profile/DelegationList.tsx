
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DelegationListProps {
  delegations: { delegated_wallet: string; display_name?: string }[];
  onRemove: (wallet: string) => void;
  isLoading: boolean;
}

const DelegationList: React.FC<DelegationListProps> = ({
  delegations,
  onRemove,
  isLoading
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Current Delegations</h3>
      {delegations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active delegations</p>
      ) : (
        <div className="space-y-2">
          {delegations.map((delegation) => (
            <div key={delegation.delegated_wallet} className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">{delegation.display_name || delegation.delegated_wallet}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(delegation.delegated_wallet)}
                disabled={isLoading}
              >
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DelegationList;
