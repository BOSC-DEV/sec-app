
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

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

const SurveyDisplay: React.FC<SurveyProps> = ({
  survey,
  onVote
}) => {
  const {
    profile,
    isConnected
  } = useProfile();
  const [selectedOption, setSelectedOption] = useState<number | undefined>(survey.userVote);
  const [isVoting, setIsVoting] = useState(false);
  const badgeInfo = useBadgeTier(profile?.sec_balance || 0);
  const [showResults, setShowResults] = useState(Boolean(survey.userVote !== undefined));

  useEffect(() => {
    setSelectedOption(survey.userVote);
    setShowResults(survey.userVote !== undefined);
  }, [survey.userVote]);

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
        variant: "destructive"
      });
      return;
    }
    
    if (selectedOption === undefined) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote",
        variant: "destructive"
      });
      return;
    }
    
    if (!badgeInfo) {
      toast({
        title: "No badge tier",
        description: "You need a badge to vote in surveys",
        variant: "destructive"
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
          variant: "default"
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
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const viewResults = () => {
    setShowResults(true);
  };

  const backToVoting = () => {
    if (survey.userVote === undefined) {
      setShowResults(false);
    }
  };

  // Modified to show usernames instead of counts
  const renderBadgeBreakdown = (option: SurveyOption) => {
    // Group voters by badge tier
    const votersByBadge: Record<string, string[]> = {};
    
    option.voters.forEach(voter => {
      if (!votersByBadge[voter.badgeTier]) {
        votersByBadge[voter.badgeTier] = [];
      }
      votersByBadge[voter.badgeTier].push(voter.userId);
    });
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(votersByBadge).map(([badge, voters]) => (
          <HoverCard key={badge}>
            <HoverCardTrigger asChild>
              <div className="text-xs py-0 px-1.5 bg-muted/40 rounded-md border border-border/50 cursor-help">
                {badge === "Shrimp" ? "🦐" : badge === "Frog" ? "🐸" : badge === "Bull" ? "🐂" : 
                badge === "Lion" ? "🦁" : badge === "King Cobra" ? "🐍" : badge === "Bull Shark" ? 
                "🦈" : badge === "Bald Eagle" ? "🦅" : badge === "Great Ape" ? "🦍" : badge}
                <span className="ml-1">{voters.length}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-2" side="top">
              <div className="text-xs space-y-1">
                <p className="font-semibold">{badge} voters:</p>
                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                  {voters.map((voterId, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {voterId.includes('@') ? (
                        <span className="text-muted-foreground">{voterId}</span>
                      ) : (
                        <Link to={`/profile/${voterId}`} className="hover:underline text-blue-500">
                          {voterId}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    );
  };

  return <div className="bg-card border rounded-lg p-4 mt-4">
      
      
      <div className="space-y-4">
        {showResults ? survey.options.map((option, index) => {
        const percentage = totalVotes ? Math.round(option.votes / totalVotes * 100) : 0;
        const isUserVote = survey.userVote === index;
        return <div key={index} className={`border rounded-md p-3 ${isUserVote ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{option.text}</span>
                    {isUserVote && <CheckCircle2 className="h-4 w-4 ml-2 text-blue-500" />}
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{option.votes} vote{option.votes !== 1 ? 's' : ''}</span>
                  {renderBadgeBreakdown(option)}
                </div>
              </div>;
      }) : survey.options.map((option, index) => {
        const isSelected = selectedOption === index;
        return <Button key={index} className={`w-full justify-start h-auto py-3 ${isSelected ? '' : 'variant-outline'}`} variant={isSelected ? "default" : "outline"} onClick={() => handleOptionSelect(index)}>
                {option.text}
              </Button>;
      })}
      </div>
      
      {!showResults ? <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="ml-auto"
            onClick={viewResults}
          >
            View Results
          </Button>
          <Button 
            onClick={handleSubmitVote}
            disabled={isVoting || selectedOption === undefined}
          >
            {isVoting ? "Submitting..." : "Vote"}
          </Button>
        </div> : 
        survey.userVote === undefined && 
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={backToVoting}
            >
              Back to Voting
            </Button>
          </div>
      }
    </div>;
};

export default SurveyDisplay;
