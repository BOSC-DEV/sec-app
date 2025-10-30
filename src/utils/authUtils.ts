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
    const password = await hashToHex(signature);
    
    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If sign in fails, try to sign up
    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            wallet_address: walletAddress,
          },
        },
      });
      
      if (signUpError) {
        console.error('Sign up error:', signUpError);
        return false;
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
