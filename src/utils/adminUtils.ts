
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_USERNAMES = ['sec', 'thesec'];

export const BANNED_USERNAMES: string[] = [];

export const getAdminList = (): string[] => {
  return [...ADMIN_USERNAMES];
};

export const isAdmin = async (username: string): Promise<boolean> => {
  if (!username) {
    console.log('No username provided to isAdmin check');
    return false;
  }

  // First check hardcoded admin list (case-insensitive)
  const isHardcodedAdmin = ADMIN_USERNAMES.some(admin => 
    admin.toLowerCase() === username.toLowerCase()
  );
  
  console.log(`Checking if ${username} is an admin. Hardcoded admin status:`, isHardcodedAdmin);
  
  if (isHardcodedAdmin) {
    return true;
  }

  // If not in hardcoded list, check database
  try {
    const { data: isDbAdmin, error } = await supabase
      .rpc('is_admin', { username_param: username.toLowerCase() })
      .single();

    if (error) {
      console.error('Error checking admin status in database:', error);
      return false;
    }

    console.log(`Database admin check for ${username}:`, isDbAdmin);
    return isDbAdmin || false;
  } catch (error) {
    console.error('Error in isAdmin check:', error);
    return false;
  }
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
};

// Required minimum badge tier to vote in surveys
export const MINIMUM_VOTING_BADGE = 'Shrimp';

// Check if a user can vote based on their badge tier
export const canVoteInSurvey = (badgeTier: string | null): boolean => {
  return !!badgeTier; // Any badge holder (including Shrimp) can vote
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
