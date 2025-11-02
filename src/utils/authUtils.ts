import { supabase } from '@/integrations/supabase/client';
import * as nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';

const hashToHex = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Authenticate with Phantom wallet using Edge Function
 * This bypasses all the complexity and uses a simple endpoint
 */
export const authenticateWallet = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> => {
  try {
    console.log('[AUTH] Authenticating with Phantom wallet');
    
    // Verify the signature client-side first
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

    // Call Edge Function for authentication
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-phantom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        walletAddress,
        signature,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[AUTH] Edge function error:', data.error);
      
      if (data.error?.includes('password mismatch') || data.error?.includes('already registered')) {
        toast({
          title: 'Account Exists',
          description: 'Please delete your account in Supabase Dashboard and try again.',
          variant: 'destructive'
        });
      }
      
      return false;
    }

    if (data.session) {
      console.log('[AUTH] Authentication successful');
      // Set the session in Supabase client
      await supabase.auth.setSession(data.session);
      return true;
    }

    return false;
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
