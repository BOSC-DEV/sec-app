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
    const email = `${walletAddress}@sec.digital`.toLowerCase();
    const hashedPassword = await hashToHex(signature);
    
    // Try to sign in with hashed password first (for new users)
    let { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password: hashedPassword,
    });
    
    // If sign in fails, try with old password format (base64 signature) for legacy users
    if (signInError) {
      console.log('Hashed password failed, trying legacy base64 format...');
      const { error: legacySignInError, data: legacySignInData } = await supabase.auth.signInWithPassword({
        email,
        password: signature, // Try with original base64 signature
      });
      
      if (!legacySignInError && legacySignInData?.session) {
        console.log('Successfully authenticated with legacy password format');
        
        // IMPORTANT: Update password to new format for future logins
        const SUPABASE_SERVICE_ROLE_KEY = (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '') as string;
        if (SUPABASE_SERVICE_ROLE_KEY) {
          console.log('Updating legacy password to new format...');
          try {
            const { updateUserPassword } = await import('@/utils/adminPasswordUpdate');
            const result = await updateUserPassword(walletAddress, signature);
            if (result.success) {
              console.log('Password successfully migrated to new format');
            } else {
              console.warn('Failed to migrate password:', result.error);
            }
          } catch (migrationError) {
            console.warn('Password migration skipped:', migrationError);
          }
        } else {
          console.warn('Service role key not available - password migration skipped. User will continue using legacy format.');
        }
        
        return true;
      }
      
      // If legacy format also fails, try to sign up (new user)
      console.log('Both password formats failed, attempting signup...');
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
        // If user already exists with old password format
        if (
          signUpError.message?.toLowerCase().includes('already registered') || 
          signUpError.message?.toLowerCase().includes('already exists') ||
          signUpError.message?.toLowerCase().includes('user already registered') ||
          signUpError.code === 'user_already_registered'
        ) {
          console.error('Legacy user detected but both password formats failed');
          console.error('SignUp error:', signUpError);
          
          const errorMsg = `❌ Account exists but password doesn't match. This usually happens when the account was created before the password fix. 

🔧 SOLUTION: Delete the user in Supabase Dashboard:
1. Go to Supabase Dashboard → Authentication → Users
2. Find user: ${email}
3. Click ⋮ menu → Delete User
4. Try logging in again - account will be recreated with correct password`;
          console.error(errorMsg);
          
          toast({
            title: 'Account Exists with Old Password',
            description: 'Please delete your account in Supabase Dashboard and try again.',
            variant: 'destructive'
          });
          
          throw new Error('Account exists but password format is incompatible. Please delete user in Supabase Dashboard.');
        }
        console.error('Sign up error:', signUpError);
        return false;
      }
      
      // If signUp succeeded, check if we have a session
      if (signUpData?.user && signUpData?.session) {
        console.log('User created and authenticated successfully');
        return true;
      }
      
      if (signUpData?.user && !signUpData?.session) {
        // User created but email confirmation required
        console.log('User created but requires email confirmation, trying to sign in...');
        const { error: retrySignInError, data: retrySignInData } = await supabase.auth.signInWithPassword({
          email,
          password: hashedPassword,
        });
        
        if (!retrySignInError && retrySignInData?.session) {
          console.log('Sign-in successful after signup');
          return true;
        }
        
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
