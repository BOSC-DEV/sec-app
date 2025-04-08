
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Scammer } from '@/types/dataTypes';
import { LucideIcon, User, DollarSign, AlertTriangle, Calendar, Tag, Plus } from 'lucide-react';

interface ScammerMetadataProps {
  icon: LucideIcon;
  label: string;
  value: string | number | React.ReactNode;
}

export const ScammerMetadata = ({ icon: Icon, label, value }: ScammerMetadataProps) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

interface ScammerCardContentProps {
  scammer: Scammer;
  showBounty?: boolean;
}

const ScammerCardContent: React.FC<ScammerCardContentProps> = ({
  scammer,
  showBounty = true,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold truncate">{scammer.name}</h3>
        <p className="text-muted-foreground line-clamp-2 h-10 text-sm">
          {scammer.accused_of}
        </p>
      </div>

      <div className="space-y-2">
        <ScammerMetadata
          icon={User}
          label="Aliases"
          value={
            scammer.aliases && scammer.aliases.length > 0 ? (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {scammer.aliases[0]}
                </Badge>
                {scammer.aliases.length > 1 && (
                  <Badge variant="outline" className="text-xs flex items-center gap-0.5">
                    <Plus className="h-3 w-3" />
                    {scammer.aliases.length - 1}
                  </Badge>
                )}
              </div>
            ) : (
              "None"
            )
          }
        />

        {showBounty && (
          <ScammerMetadata
            icon={DollarSign}
            label="Bounty"
            value={scammer.bounty_amount ? `$${scammer.bounty_amount.toLocaleString()}` : "$0"}
          />
        )}

        <ScammerMetadata
          icon={AlertTriangle}
          label="Reported"
          value={
            <div className="flex items-center">
              <span className="mr-1">1 time</span>
            </div>
          }
        />

        <ScammerMetadata
          icon={Calendar}
          label="Added"
          value={
            scammer.date_added
              ? formatDistanceToNow(new Date(scammer.date_added), { addSuffix: true })
              : "Recently"
          }
        />

        {scammer.wallet_addresses && scammer.wallet_addresses.length > 0 && (
          <ScammerMetadata
            icon={Tag}
            label="Wallets"
            value={
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs truncate max-w-[120px]">
                  {scammer.wallet_addresses[0].substring(0, 6)}...
                  {scammer.wallet_addresses[0].substring(scammer.wallet_addresses[0].length - 4)}
                </Badge>
                {scammer.wallet_addresses.length > 1 && (
                  <Badge variant="outline" className="text-xs flex items-center gap-0.5">
                    <Plus className="h-3 w-3" />
                    {scammer.wallet_addresses.length - 1}
                  </Badge>
                )}
              </div>
            }
          />
        )}
        
        {scammer.accomplices && scammer.accomplices.length > 0 && (
          <ScammerMetadata
            icon={User}
            label="Accomplices"
            value={
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {scammer.accomplices[0]}
                </Badge>
                {scammer.accomplices.length > 1 && (
                  <Badge variant="outline" className="text-xs flex items-center gap-0.5">
                    <Plus className="h-3 w-3" />
                    {scammer.accomplices.length - 1}
                  </Badge>
                )}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ScammerCardContent;
