
import { toast } from "@/hooks/use-toast";

export const ADMIN_USERNAMES = ['sec', 'thesec', 'willy'];

export const BANNED_USERNAMES: string[] = [];

export const getAdminList = (): string[] => {
  return [...ADMIN_USERNAMES];
};

export const isAdmin = (username: string): boolean => {
  return ADMIN_USERNAMES.includes(username);
};

export const isBanned = (username: string): boolean => {
  return BANNED_USERNAMES.includes(username);
};

export const banUser = (username: string): void => {
  if (!BANNED_USERNAMES.includes(username)) {
    BANNED_USERNAMES.push(username);
    // Show toast notification to admins
    toast({
      title: "User Banned",
      description: `User ${username} has been banned from commenting`,
      variant: "default",
    });
  }
};

// Survey types and option limits
export const MAX_SURVEY_OPTIONS = 5;
export type SurveyVote = {
  userId: string;
  optionIndex: number;
  badgeTier: string;
  timestamp: string;
};

export const validateSurvey = (
  title: string, 
  options: string[]
): { valid: boolean; message: string } => {
  if (!title.trim()) {
    return { valid: false, message: "Survey title cannot be empty" };
  }
  
  if (options.length < 2) {
    return { valid: false, message: "Survey must have at least 2 options" };
  }
  
  if (options.length > MAX_SURVEY_OPTIONS) {
    return { valid: false, message: `Survey cannot have more than ${MAX_SURVEY_OPTIONS} options` };
  }
  
  const emptyOptions = options.filter(option => !option.trim());
  if (emptyOptions.length > 0) {
    return { valid: false, message: "All survey options must have content" };
  }
  
  return { valid: true, message: "" };
};

// Required minimum badge tier to vote in surveys
export const MINIMUM_VOTING_BADGE = 'Shrimp';

// Check if a user can vote based on their badge tier
export const canVoteInSurvey = (badgeTier: string | null): boolean => {
  return !!badgeTier; // Any badge holder (including Shrimp) can vote
};
