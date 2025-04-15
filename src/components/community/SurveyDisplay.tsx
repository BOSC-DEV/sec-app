
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeTier } from '@/utils/badgeUtils';
import { BarChart, CheckCircle, LockIcon } from 'lucide-react';
import { MINIMUM_VOTING_BADGE, canVoteInSurvey } from '@/utils/adminUtils';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from '@/hooks/use-toast';
import { useBadgeTier } from '@/hooks/useBadgeTier';

export interface SurveyOption {
  text: string;
  votes: number;
  voters: {
    userId: string;
    badgeTier: string;
  }[];
}

export interface SurveyData {
  id: string;
  title: string;
  options: SurveyOption[];
  userVote?: number; // Index of the option the current user voted for
}

interface SurveyDisplayProps {
  survey: SurveyData;
  onVote: (surveyId: string, optionIndex: number) => Promise<boolean>;
}

const SurveyDisplay: React.FC<SurveyDisplayProps> = ({ survey, onVote }) => {
  const { profile, isConnected } = useProfile();
  const [selectedOption, setSelectedOption] = useState<number | null>(
    survey.userVote !== undefined ? survey.userVote : null
  );
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(survey.userVote !== undefined);
  const badgeInfo = useBadgeTier(profile?.sec_balance || 0);
  
  const totalVotes = survey.options.reduce((sum, option) => sum + option.votes, 0);
  
  const badgeCounts: Record<BadgeTier, number> = Object.values(BadgeTier).reduce(
    (acc, tier) => ({ ...acc, [tier]: 0 }), 
    {} as Record<BadgeTier, number>
  );
  
  // Count votes by badge tier
  survey.options.forEach(option => {
    option.voters.forEach(voter => {
      if (voter.badgeTier in badgeCounts) {
        badgeCounts[voter.badgeTier as BadgeTier] += 1;
      }
    });
  });
  
  const canVote = isConnected && canVoteInSurvey(badgeInfo?.tier || null);
  const hasVoted = survey.userVote !== undefined;
  
  const handleVote = async () => {
    if (!canVote) {
      toast({
        title: "Voting restricted",
        description: `Only ${MINIMUM_VOTING_BADGE} badge holders and above can vote in surveys`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedOption === null) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote",
        variant: "destructive",
      });
      return;
    }
    
    setIsVoting(true);
    
    try {
      const success = await onVote(survey.id, selectedOption);
      if (success) {
        setShowResults(true);
        toast({
          title: "Vote recorded",
          description: "Your vote has been recorded successfully",
          variant: "default",
        });
      }
    } finally {
      setIsVoting(false);
    }
  };
  
  const toggleResults = () => {
    setShowResults(!showResults);
  };
  
  // Render badge count pill
  const renderBadgeCount = (tier: BadgeTier, count: number) => {
    if (count === 0) return null;
    
    return (
      <div key={tier} className="flex items-center text-xs bg-muted/50 rounded-full px-2 py-1">
        <span className="mr-1">{tier}</span>
        <span>{count}</span>
      </div>
    );
  };
  
  return (
    <Card className="mt-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{survey.title}</h3>
          
          {!canVote && !hasVoted && (
            <div className="flex items-center text-amber-500 text-sm mt-2">
              <LockIcon className="h-4 w-4 mr-1" />
              <span>Only badge holders can vote in surveys</span>
            </div>
          )}
        </div>
        
        {!showResults ? (
          <div className="space-y-4">
            <RadioGroup 
              value={selectedOption?.toString()} 
              onValueChange={(value) => setSelectedOption(parseInt(value))}
            >
              {survey.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${survey.id}-${index}`} disabled={!canVote || hasVoted} />
                  <label 
                    htmlFor={`option-${survey.id}-${index}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="flex justify-between items-center mt-4">
              {hasVoted ? (
                <Button variant="outline" size="sm" onClick={toggleResults}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Show Results
                </Button>
              ) : (
                <Button 
                  onClick={handleVote} 
                  disabled={selectedOption === null || !canVote || isVoting}
                  size="sm"
                >
                  {isVoting ? "Voting..." : "Vote"}
                </Button>
              )}
              
              {totalVotes > 0 && (
                <span className="text-xs text-muted-foreground">
                  {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {survey.options.map((option, index) => {
              const percentage = totalVotes > 0 
                ? Math.round((option.votes / totalVotes) * 100) 
                : 0;
                
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm">{option.text}</span>
                      {survey.userVote === index && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            
            <div className="mt-4">
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(badgeCounts)
                  .filter(([_, count]) => count > 0)
                  .sort(([a], [b]) => {
                    const tierOrder = Object.values(BadgeTier);
                    return tierOrder.indexOf(a as BadgeTier) - tierOrder.indexOf(b as BadgeTier);
                  })
                  .map(([tier, count]) => renderBadgeCount(tier as BadgeTier, count))
                }
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" size="sm" onClick={toggleResults}>
                  Hide Results
                </Button>
                <span className="text-xs text-muted-foreground">
                  {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurveyDisplay;
