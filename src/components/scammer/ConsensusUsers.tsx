
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Users, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ConsensusUser {
  wallet_address: string;
  display_name: string;
  username?: string;
  profile_pic_url?: string;
  liked: boolean;
}

interface ConsensusUsersProps {
  scammerId: string;
  maxDisplayed?: number;
}

const ConsensusUsers: React.FC<ConsensusUsersProps> = ({ 
  scammerId,
  maxDisplayed = 5
}) => {
  const [users, setUsers] = useState<ConsensusUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agree' | 'disagree'>('agree');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchConsensusUsers = async () => {
      setIsLoading(true);
      try {
        // Get user interactions for this scammer
        const { data: interactions, error: interactionsError } = await supabase
          .from('user_scammer_interactions')
          .select('user_id, liked, disliked')
          .eq('scammer_id', scammerId);
        
        if (interactionsError) {
          throw interactionsError;
        }
        
        if (!interactions || interactions.length === 0) {
          setUsers([]);
          setIsLoading(false);
          return;
        }
        
        // Extract user IDs to fetch their profiles
        const userIds = interactions.map(interaction => interaction.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('wallet_address, display_name, username, profile_pic_url')
          .in('wallet_address', userIds);
          
        if (profilesError) {
          throw profilesError;
        }
        
        // Combine interaction data with profile data
        const usersWithData = interactions
          .filter(interaction => interaction.liked || interaction.disliked)
          .map(interaction => {
            const profile = profiles?.find(p => p.wallet_address === interaction.user_id);
            
            if (!profile) return null;
            
            return {
              wallet_address: profile.wallet_address,
              display_name: profile.display_name,
              username: profile.username ?? undefined,
              profile_pic_url: profile.profile_pic_url,
              liked: interaction.liked
            };
          })
          // Fix: Correct the type predicate to properly match the ConsensusUser interface
          .filter((user): user is ConsensusUser => user !== null);
          
        setUsers(usersWithData);
      } catch (error) {
        console.error('Error fetching consensus users:', error);
        toast({
          title: 'Error',
          description: 'Could not load user consensus data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (scammerId) {
      fetchConsensusUsers();
    }
    
    // Listen for real-time updates to user_scammer_interactions
    const channel = supabase
      .channel(`scammer-consensus-${scammerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_scammer_interactions',
          filter: `scammer_id=eq.${scammerId}`
        },
        () => {
          fetchConsensusUsers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [scammerId, toast]);
  
  const filteredUsers = users.filter(user => 
    activeTab === 'agree' ? user.liked : !user.liked
  );
  
  const agreeCount = users.filter(user => user.liked).length;
  const disagreeCount = users.filter(user => !user.liked).length;
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-2">
        <div className="flex space-x-1">
          {[1, 2, 3].map((i) => (
            <Avatar key={i} className="h-6 w-6 opacity-50 animate-pulse">
              <AvatarFallback className="bg-muted" />
            </Avatar>
          ))}
        </div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-xs text-muted-foreground flex items-center mt-1 justify-center">
        <Info className="h-3 w-3 mr-1" />
        No consensus data yet
      </div>
    );
  }
  
  return (
    <div className="mt-2">
      <div className="flex space-x-1 mb-2">
        <Button
          variant={activeTab === 'agree' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('agree')}
          className="h-7 px-2 text-xs"
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Agree ({agreeCount})
        </Button>
        <Button
          variant={activeTab === 'disagree' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('disagree')}
          className="h-7 px-2 text-xs"
        >
          <ThumbsDown className="h-3.5 w-3.5 mr-1" />
          Disagree ({disagreeCount})
        </Button>
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {filteredUsers.slice(0, maxDisplayed).map((user) => (
            <TooltipProvider key={user.wallet_address}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage 
                      src={user.profile_pic_url || '/placeholder.svg'} 
                      alt={user.display_name}
                    />
                    <AvatarFallback>
                      {user.display_name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {user.display_name}
                  {user.username && <span className="text-muted-foreground"> @{user.username}</span>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          
          {filteredUsers.length > maxDisplayed && (
            <Popover>
              <PopoverTrigger asChild>
                <Badge 
                  variant="outline" 
                  className="h-6 rounded-full px-2 cursor-pointer hover:bg-muted/50"
                >
                  +{filteredUsers.length - maxDisplayed}
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0" align="start">
                <div className="p-2 border-b">
                  <h4 className="font-medium text-sm">
                    {activeTab === 'agree' ? 'Users who agree' : 'Users who disagree'}
                  </h4>
                </div>
                <ScrollArea className="max-h-60">
                  <div className="p-2 space-y-2">
                    {filteredUsers.slice(maxDisplayed).map((user) => (
                      <div key={user.wallet_address} className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage 
                            src={user.profile_pic_url || '/placeholder.svg'} 
                            alt={user.display_name}
                          />
                          <AvatarFallback>
                            {user.display_name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{user.display_name}</p>
                          {user.username && (
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground text-center py-2">
          No users have {activeTab === 'agree' ? 'agreed' : 'disagreed'} yet
        </div>
      )}
    </div>
  );
};

export default ConsensusUsers;
