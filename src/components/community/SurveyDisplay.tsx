import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useBadgeTier } from '@/hooks/useBadgeTier';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface SurveyVoter {
  userId: string;
  badgeTier: string;
  username?: string;
  profilePic?: string;
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

  const getBadgeEmoji = (badgeTier: string) => {
    switch (badgeTier) {
      case "Shrimp": return "🦐";
      case "Frog": return "🐸";
      case "Bull": return "🐂";
      case "Lion": return "🦁";
      case "King Cobra": return "🐍";
      case "Bull Shark": return "🦈";
      case "Bald Eagle": return "🦅";
      case "Great Ape": return "🦍";
      case "T-Rex": return "🦖";
      case "Goat": return "🐐";
      case "Whale": return "🐳";
      default: return "👑";
    }
  };

  const renderVoterTooltip = (option: SurveyOption) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer flex items-center gap-1">
              <Badge variant="outline" className="text-xs py-0 px-1.5">
                {getBadgeEmoji(option.voters[0]?.badgeTier || '')} {option.votes}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-0">
            <div className="p-2 max-h-48 overflow-y-auto space-y-2">
              <div className="font-medium text-sm">Voters ({option.votes})</div>
              <div className="space-y-1">
                {option.voters.map((voter, idx) => (
                  <Link 
                    key={idx} 
                    to={voter.username ? `/profile/${voter.username}` : '#'} 
                    className="flex items-center p-1 hover:bg-muted rounded gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={voter.profilePic} />
                      <AvatarFallback>{getBadgeEmoji(voter.badgeTier)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{voter.username || 'Anonymous'}</span>
                  </Link>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="bg-card border rounded-lg p-4 mt-4">
      <div className="space-y-4">
        {showResults ? survey.options.map((option, index) => {
          const percentage = totalVotes ? Math.round(option.votes / totalVotes * 100) : 0;
          const isUserVote = survey.userVote === index;
          return (
            <div key={index} className={`border rounded-md p-3 ${isUserVote ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{option.text}</span>
                  {isUserVote && <CheckCircle2 className="h-4 w-4 text-blue-500 ml-2" />}
                </div>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">{option.votes} vote{option.votes !== 1 ? 's' : ''}</span>
                {option.votes > 0 && renderVoterTooltip(option)}
              </div>
            </div>
          );
        }) : survey.options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <Button key={index} variant={isSelected ? "default" : "outline"} className="w-full justify-start h-auto py-3 text-left" onClick={() => handleOptionSelect(index)}>
              {option.text}
            </Button>
          );
        })}
      </div>
      
      {!showResults ? (
        <div className="mt-4 space-y-2">
          <Button className="w-full" disabled={selectedOption === undefined || isVoting} onClick={handleSubmitVote}>
            {isVoting ? "Voting..." : "Vote"}
          </Button>
          
          <Button variant="outline" className="w-full" onClick={viewResults}>
            View Results
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {survey.userVote === undefined && (
            <Button variant="outline" className="w-full" onClick={backToVoting}>
              Back to Voting
            </Button>
          )}
          
          <div className="text-center text-muted-foreground text-xs">
            Total: {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyDisplay;
