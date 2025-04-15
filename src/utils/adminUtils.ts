
import { supabase } from '@/integrations/supabase/client';

export const ADMIN_USERNAMES = ['sec', 'thesec'];

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
  }
  // Remove the user's messages after banning
  deleteUserMessages(username);
};

const deleteUserMessages = async (username: string): Promise<void> => {
  try {
    // Delete chat messages
    await supabase
      .from('chat_messages')
      .delete()
      .eq('author_username', username);
      
    // Delete announcement replies
    await supabase
      .from('announcement_replies')
      .delete()
      .eq('author_username', username);
      
    // Delete scammer comments
    await supabase
      .from('comments')
      .delete()
      .eq('author_name', username);
  } catch (error) {
    console.error('Error deleting user messages:', error);
    throw error;
  }
};
