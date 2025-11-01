import { supabase } from '@/integrations/supabase/client';
import * as nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

const hashToHex = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const authenticateWallet = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> => {
  try {
    // Verify the signature
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, 'base64');
    const publicKeyBytes = new PublicKey(walletAddress).toBytes();
    
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    if (!verified) {
      console.error('Signature verification failed');
      return false;
    }
    
    // Sign in with email (wallet address as email)
    const email = `${walletAddress}@sec.digital`;
    // Derive a ≤72-char password from signature (64-char SHA-256 hex)
    const hashedPassword = await hashToHex(signature);
    
    // Try to sign in with hashed password first (for new users)
    let { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: hashedPassword,
    });
    
    // If sign in fails, try to sign up (new user or password migration)
    if (signInError) {
      // For existing users with old password format, signUp might fail
      // In that case, they need to use password reset or admin migration
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password: hashedPassword,
        options: {
          data: {
            wallet_address: walletAddress,
          },
        },
      });
      
      if (signUpError) {
        // If user already exists, this is a legacy password issue
        // Supabase signUp doesn't update existing users, so we need admin access
        if (
          signUpError.message?.toLowerCase().includes('already registered') || 
          signUpError.message?.toLowerCase().includes('already exists') ||
          signUpError.message?.toLowerCase().includes('user already registered')
        ) {
          console.error('Legacy user detected - password needs migration. User:', email);
          console.error('SignUp error details:', signUpError);
          
          // Provide clear error message
          const errorMsg = `Account already exists with old password format. Please contact support to migrate your account, or delete your account and sign up again.`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        console.error('Sign up error:', signUpError);
        return false;
      }
      
      // If signUp succeeded, check if we have a session
      if (signUpData?.user && signUpData?.session) {
        // User created and authenticated (email confirmation disabled)
        console.log('User created and authenticated successfully');
        return true;
      }
      
      if (signUpData?.user && !signUpData?.session) {
        // User created but email confirmation required
        // Try to sign in again - sometimes Supabase auto-confirms
        console.log('User created but requires email confirmation, trying to sign in...');
        const { error: retrySignInError, data: retrySignInData } = await supabase.auth.signInWithPassword({
          email,
          password: hashedPassword,
        });
        
        if (!retrySignInError && retrySignInData?.session) {
          console.log('Sign-in successful after signup');
          return true;
        }
        
        // If still failing, email confirmation is required
        console.error('Email confirmation required. Please disable email confirmation in Supabase Dashboard for wallet-based auth.');
        throw new Error('Email confirmation required. Please check your Supabase settings to disable email confirmation for wallet-based authentication.');
      }
    }
    
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
