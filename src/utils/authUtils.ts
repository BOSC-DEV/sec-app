import { supabase } from '@/integrations/supabase/client';

export const authenticateWallet = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> => {
  try {
    console.log('Calling auth-phantom edge function...');
    console.log('Wallet address:', walletAddress);
    
    // Call the edge function to handle all authentication logic
    const { data, error } = await supabase.functions.invoke('auth-phantom', {
      body: {
        walletAddress,
        signature,
        message,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return false;
    }

    if (!data?.session) {
      console.error('No session returned from authentication');
      return false;
    }

    console.log('Session received from edge function');

    // Set the session in Supabase client
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    if (sessionError) {
      console.error('Error setting session:', sessionError);
      return false;
    }

    console.log('Authentication successful! Session set in client.');
    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

export const validateUserAuthentication = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Authentication error:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Error validating authentication:', error);
    return null;
  }
};

export const validateUserOwnership = async (
  table: 'comments' | 'scammers' | 'bounty_contributions' | 'announcements' | 'replies',
  recordId: string,
  userIdField: string = 'author'
): Promise<boolean> => {
  try {
    const userId = await validateUserAuthentication();
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from(table)
      .select(userIdField)
      .eq('id', recordId)
      .single();
    
    if (error) {
      console.error('Error validating ownership:', error);
      return false;
    }
    
    return data?.[userIdField] === userId;
  } catch (error) {
    console.error('Error in ownership validation:', error);
    return false;
  }
};

export const requireAuthentication = async (): Promise<string> => {
  const userId = await validateUserAuthentication();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
};
