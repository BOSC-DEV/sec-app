
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useBadgeTier } from '@/hooks/useBadgeTier';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SurveyVoter {
  userId: string;
  badgeTier: string;
}

interface SurveyOption {
  text: string;
  votes: number;
  voters: SurveyVoter[];
}

interface SurveyProps {
  survey: {
    id: string;
    title: string;
    options: SurveyOption[];
    userVote?: number;
  };
  onVote: (surveyId: string, optionIndex: number) => Promise<boolean>;
}

const SurveyDisplay: React.FC<SurveyProps> = ({ survey, onVote }) => {
  const { profile, isConnected } = useProfile();
  const [selectedOption, setSelectedOption] = useState<number | undefined>(survey.userVote);
  const [isVoting, setIsVoting] = useState(false);
  const badgeInfo = useBadgeTier(profile?.sec_balance || 0);
  const [showResults, setShowResults] = useState(survey.userVote !== undefined);
  
  const totalVotes = survey.options.reduce((total, option) => total + option.votes, 0);
  
  const handleOptionSelect = (index: number) => {
    if (isVoting) return;
    setSelectedOption(index);
  };
  
  const handleSubmitVote = async () => {
    if (!isConnected || !profile) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedOption === undefined) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote",
        variant: "destructive",
      });
      return;
    }
    
    if (!badgeInfo) {
      toast({
        title: "No badge tier",
        description: "You need a badge to vote in surveys",
        variant: "destructive",
      });
      return;
    }
    
    setIsVoting(true);
    
    try {
      const success = await onVote(survey.id, selectedOption);
      if (success) {
        toast({
          title: "Vote recorded",
          description: "Your vote has been recorded successfully",
          variant: "default",
        });
        setShowResults(true);
      } else {
        throw new Error("Failed to submit vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to submit your vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  const countVotersByBadge = (option: SurveyOption) => {
    // Count voters by badge tier
    const badgeCounts: Record<string, number> = {};
    
    option.voters.forEach(voter => {
      if (!badgeCounts[voter.badgeTier]) {
        badgeCounts[voter.badgeTier] = 0;
      }
      badgeCounts[voter.badgeTier]++;
    });
    
    return badgeCounts;
  };
  
  const renderBadgeBreakdown = (option: SurveyOption) => {
    const badgeCounts = countVotersByBadge(option);
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(badgeCounts).map(([badge, count]) => (
          <TooltipProvider key={badge}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs py-0 px-1.5">
                  {badge === "Shrimp" ? "🦐" : 
                   badge === "Whale" ? "🐳" : 
                   badge === "Shark" ? "🦈" : 
                   badge === "Bull" ? "🐂" : "👑"} {count}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{count} {badge}{count !== 1 ? 's' : ''}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-card border rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium mb-4">{survey.title}</h3>
      
      <div className="space-y-4">
        {survey.options.map((option, index) => {
          const percentage = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === index;
          const isUserVote = survey.userVote === index;
          
          if (showResults) {
            return (
              <div key={index} className={`border rounded-md p-3 ${isUserVote ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{option.text}</span>
                    {isUserVote && (
                      <CheckCircle2 className="h-4 w-4 text-blue-500 ml-2" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{option.votes} vote{option.votes !== 1 ? 's' : ''}</span>
                  {renderBadgeBreakdown(option)}
                </div>
              </div>
            );
          }
          
          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "outline"}
              className="w-full justify-start h-auto py-3 text-left"
              onClick={() => handleOptionSelect(index)}
            >
              {option.text}
            </Button>
          );
        })}
      </div>
      
      {!showResults && (
        <Button
          className="w-full mt-4"
          disabled={selectedOption === undefined || isVoting}
          onClick={handleSubmitVote}
        >
          {isVoting ? "Voting..." : "Submit Vote"}
        </Button>
      )}
      
      {showResults && survey.userVote === undefined && (
        <div className="text-center text-muted-foreground text-sm mt-4">
          You can see the results without voting
        </div>
      )}
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Total: {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default SurveyDisplay;
