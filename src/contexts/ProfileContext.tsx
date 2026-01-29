import { createContext, useState, useContext, useEffect, ReactNode, useRef, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Profile } from '@/types/dataTypes';
import { getProfileByWallet, uploadProfilePicture, saveProfile } from '@/services/profileService';
import { toast } from '@/hooks/use-toast';
import { signMessageWithWallet } from '@/utils/walletAdapter';
import { supabase } from '@/integrations/supabase/client';
import { authenticateWallet } from '@/utils/authUtils';
import { Session } from '@supabase/supabase-js';

export const PROFILE_UPDATED_EVENT = 'profile-updated';

// Session storage keys
const SESSION_EXPIRY_KEY = 'sec_session_expiry';
const WALLET_ADDRESS_KEY = 'walletAddress';

// 24 hours in milliseconds
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export const emitProfileUpdatedEvent = (profile: Profile) => {
  const event = new CustomEvent(PROFILE_UPDATED_EVENT, { detail: profile });
  window.dispatchEvent(event);
};

// Helper to check if stored session is still valid (within 24 hours)
const isSessionValid = (): boolean => {
  const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiryStr) return false;
  
  const expiry = parseInt(expiryStr, 10);
  return Date.now() < expiry;
};

// Helper to set session expiry
const setSessionExpiry = () => {
  const expiry = Date.now() + SESSION_DURATION_MS;
  localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
};

// Helper to clear session expiry
const clearSessionExpiry = () => {
  localStorage.removeItem(SESSION_EXPIRY_KEY);
};

interface ProfileContextType {
  isConnected: boolean;
  walletAddress: string | null;
  profile: Profile | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  isWalletAvailable: boolean;
  updateProfile: (updatedProfile: Profile) => Promise<Profile | null>;
  session: Session | null;
  // Legacy alias for backwards compatibility
  isPhantomAvailable: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Loading timeout duration (15 seconds)
const LOADING_TIMEOUT_MS = 15000;

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isWalletReady, setIsWalletReady] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [pendingAuthentication, setPendingAuthentication] = useState<boolean>(false);

  // Refs for tracking state and preventing race conditions
  const initialCheckComplete = useRef(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAuthenticatedRef = useRef(false);

  // Check if any wallet adapter is available
  const isWalletAvailable = wallet.wallets.length > 0;

  // Helper to set loading with timeout protection
  const setLoadingWithTimeout = (loading: boolean) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    setIsLoading(loading);
    
    if (loading) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn('Loading timeout reached, forcing reset');
        setIsLoading(false);
        loadingTimeoutRef.current = null;
      }, LOADING_TIMEOUT_MS);
    }
  };

  // Helper to clear loading state safely
  const clearLoading = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    setIsLoading(false);
  };

  // Helper function to validate and set wallet address
  const setValidatedWalletAddress = async (address: string | null, skipWalletValidation: boolean = false): Promise<boolean> => {
    if (address) {
      // If we have a valid session within 24 hours, we can skip wallet validation
      if (skipWalletValidation && isSessionValid()) {
        console.log("Session is valid, skipping wallet validation");
        setWalletAddress(address);
        localStorage.setItem(WALLET_ADDRESS_KEY, address);
        setIsConnected(true);
        setIsWalletReady(true);
        return true;
      }

      // Check if wallet adapter is connected with matching address
      if (wallet.connected && wallet.publicKey) {
        const connectedAddress = wallet.publicKey.toString();
        if (connectedAddress.toLowerCase() === address.toLowerCase()) {
          setWalletAddress(connectedAddress);
          localStorage.setItem(WALLET_ADDRESS_KEY, connectedAddress);
          setIsConnected(true);
          setIsWalletReady(true);
          return true;
        }
      }

      // If we have a valid session but wallet isn't connected, still allow connection
      if (isSessionValid()) {
        console.log("Wallet not connected but session is valid, allowing connection");
        setWalletAddress(address);
        localStorage.setItem(WALLET_ADDRESS_KEY, address);
        setIsConnected(true);
        setIsWalletReady(true);
        return true;
      }

      return false;
    }
    return false;
  };

  const fetchProfile = async (address: string) => {
    if (!address || !isWalletReady) {
      console.log("Skipping profile fetch - wallet not ready or no address");
      return;
    }
    
    try {
      console.log("Fetching profile for wallet:", address);
      setLoadingWithTimeout(true);
      const fetchedProfile = await getProfileByWallet(address);
      console.log("Fetched profile:", fetchedProfile);
      
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      clearLoading();
    }
  };

  // Effect to handle profile fetching when wallet is ready
  useEffect(() => {
    if (isWalletReady && walletAddress) {
      fetchProfile(walletAddress);
    }
  }, [isWalletReady, walletAddress]);

  // Handle wallet connection and authentication
  const handleWalletAuthentication = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey || hasAuthenticatedRef.current) {
      return;
    }

    const publicKey = wallet.publicKey.toString();
    console.log("Wallet connected, checking authentication for:", publicKey);

    setLoadingWithTimeout(true);
    
    try {
      // Check if already authenticated
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession?.user?.email === `${publicKey}@sec.digital`) {
        console.log("Already authenticated with this wallet");
        hasAuthenticatedRef.current = true;
        setWalletAddress(publicKey);
        setIsConnected(true);
        setIsWalletReady(true);
        localStorage.setItem(WALLET_ADDRESS_KEY, publicKey);
        setSessionExpiry();
        await fetchProfile(publicKey);
        return;
      }

      // Need to authenticate - sign message
      const message = 'Sign in to Scams and E-Crimes Commission';
      console.log("Requesting signature for authentication...");
      
      const signature = await signMessageWithWallet(wallet, message);
      
      if (!signature) {
        console.log("Signature request was cancelled or failed");
        clearLoading();
        wallet.disconnect();
        return;
      }
      
      const authenticated = await authenticateWallet(publicKey, signature, message);
      
      if (authenticated) {
        hasAuthenticatedRef.current = true;
        setWalletAddress(publicKey);
        setIsConnected(true);
        setIsWalletReady(true);
        localStorage.setItem(WALLET_ADDRESS_KEY, publicKey);
        setSessionExpiry();
        
        toast({
          title: 'Wallet Connected',
          description: 'Successfully signed in with your wallet',
        });
        
        await fetchProfile(publicKey);
      } else {
        console.error('Authentication failed - no session returned');
        toast({
          title: 'Authentication Failed',
          description: 'Could not authenticate with your wallet. Please try disconnecting and reconnecting.',
          variant: 'destructive',
        });
        clearLoading();
        wallet.disconnect();
      }
    } catch (error: any) {
      console.error('Error during wallet authentication:', error);
      
      if (error?.code === 4001 || error?.message?.includes('User rejected')) {
        console.log("User rejected the signature request");
        toast({
          title: 'Signature Cancelled',
          description: 'You cancelled the signature request. Please try again to sign in.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Authentication Error',
          description: 'Failed to authenticate wallet signature. Please try again.',
          variant: 'destructive',
        });
      }
      clearLoading();
      wallet.disconnect();
    }
  }, [wallet.connected, wallet.publicKey, wallet]);

  // Watch for wallet connection changes
  useEffect(() => {
    if (wallet.connected && wallet.publicKey && pendingAuthentication) {
      setPendingAuthentication(false);
      handleWalletAuthentication();
    }
  }, [wallet.connected, wallet.publicKey, pendingAuthentication, handleWalletAuthentication]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!wallet.connected && hasAuthenticatedRef.current) {
      console.log("Wallet disconnected");
      hasAuthenticatedRef.current = false;
      setWalletAddress(null);
      setIsConnected(false);
      setProfile(null);
      setIsWalletReady(false);
      localStorage.removeItem(WALLET_ADDRESS_KEY);
      clearSessionExpiry();
      clearLoading();
      setTimeout(() => {
        supabase.auth.signOut();
      }, 0);
    }
  }, [wallet.connected]);

  // Setup auth state listener and check existing session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sessionData) => {
      console.log('Auth state changed:', event, sessionData?.user?.email);
      setSession(sessionData);
      
      if (sessionData && sessionData.user) {
        const sessionWalletAddress = sessionData.user.email?.split('@')[0];
        if (sessionWalletAddress) {
          setTimeout(async () => {
            const isValid = await setValidatedWalletAddress(sessionWalletAddress, true);
            if (!isValid) {
              setTimeout(async () => {
                await supabase.auth.signOut();
              }, 0);
              setWalletAddress(null);
              setIsConnected(false);
              setProfile(null);
              setIsWalletReady(false);
              localStorage.removeItem(WALLET_ADDRESS_KEY);
              clearSessionExpiry();
            }
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setWalletAddress(null);
        setIsConnected(false);
        setIsWalletReady(false);
        localStorage.removeItem(WALLET_ADDRESS_KEY);
        clearSessionExpiry();
        clearLoading();
      }
    });
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        setLoadingWithTimeout(true);

        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession && isSessionValid()) {
          console.log("Found valid session within 24 hours, restoring...");
          setSession(existingSession);
          hasAuthenticatedRef.current = true;
          const sessionWalletAddress = existingSession.user.email?.split('@')[0];
          
          if (sessionWalletAddress) {
            const isValid = await setValidatedWalletAddress(sessionWalletAddress, true);
            if (!isValid) {
              await supabase.auth.signOut();
              setWalletAddress(null);
              setIsConnected(false);
              setProfile(null);
              setIsWalletReady(false);
              localStorage.removeItem(WALLET_ADDRESS_KEY);
              clearSessionExpiry();
            }
          }
        } else if (existingSession) {
          console.log("Session exists but 24hr window expired, signing out...");
          await supabase.auth.signOut();
          setWalletAddress(null);
          setIsConnected(false);
          setProfile(null);
          setIsWalletReady(false);
          localStorage.removeItem(WALLET_ADDRESS_KEY);
          clearSessionExpiry();
        } else {
          const savedWallet = localStorage.getItem(WALLET_ADDRESS_KEY);
          if (savedWallet) {
            localStorage.removeItem(WALLET_ADDRESS_KEY);
            clearSessionExpiry();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        clearLoading();
        initialCheckComplete.current = true;
      }
    };

    checkExistingSession();
    
    return () => {
      subscription.unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!walletAddress) {
      toast({
        title: 'Error',
        description: 'You must be connected to upload an avatar',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoadingWithTimeout(true);
      const publicUrl = await uploadProfilePicture(walletAddress, file);
      
      if (publicUrl && profile) {
        const updatedProfile = {
          ...profile,
          profile_pic_url: publicUrl
        };
        
        const savedProfile = await saveProfile(updatedProfile);
        
        if (savedProfile) {
          setProfile(savedProfile);
          emitProfileUpdatedEvent(savedProfile);
        }
        
        toast({
          title: 'Success',
          description: 'Profile picture uploaded successfully',
        });
      }
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'destructive',
      });
      return null;
    } finally {
      clearLoading();
    }
  };

  const connectWallet = async () => {
    if (isConnecting) {
      console.log("Connection already in progress");
      return;
    }

    try {
      setIsConnecting(true);
      setLoadingWithTimeout(true);
      
      if (!isWalletAvailable) {
        toast({
          title: 'No Wallet Found',
          description: 'Please install a Solana wallet like Phantom, Solflare, or Backpack to continue',
          variant: 'destructive',
        });
        
        window.open('https://phantom.app/', '_blank');
        clearLoading();
        return;
      }
      
      // If already connected, just authenticate
      if (wallet.connected && wallet.publicKey) {
        await handleWalletAuthentication();
        return;
      }
      
      // Set flag to trigger authentication after connection
      setPendingAuthentication(true);
      
      // Open wallet modal for selection
      setWalletModalVisible(true);
      
      clearLoading();
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      if (error?.code === 4001 || error?.message?.includes('User rejected')) {
        toast({
          title: 'Connection Cancelled',
          description: 'You cancelled the wallet connection.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Could not connect to wallet',
          variant: 'destructive',
        });
      }
      clearLoading();
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    wallet.disconnect();
    
    localStorage.removeItem(WALLET_ADDRESS_KEY);
    clearSessionExpiry();
    setWalletAddress(null);
    setIsConnected(false);
    setIsWalletReady(false);
    setProfile(null);
    hasAuthenticatedRef.current = false;
    clearLoading();
    
    setTimeout(() => {
      supabase.auth.signOut();
    }, 0);
    
    toast({
      title: "Wallet disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  const refreshProfile = async () => {
    if (walletAddress) {
      await fetchProfile(walletAddress);
    }
  };

  const updateProfile = async (updatedProfile: Profile): Promise<Profile | null> => {
    try {
      setLoadingWithTimeout(true);
      const savedProfile = await saveProfile(updatedProfile);
      
      if (savedProfile) {
        setProfile(savedProfile);
        
        emitProfileUpdatedEvent(savedProfile);
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully',
        });
      }
      
      return savedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      return null;
    } finally {
      clearLoading();
    }
  };

  const value = {
    isConnected,
    walletAddress,
    profile,
    isLoading,
    connectWallet,
    disconnectWallet,
    refreshProfile,
    uploadAvatar,
    isWalletAvailable,
    updateProfile,
    session,
    // Legacy alias for backwards compatibility
    isPhantomAvailable: isWalletAvailable
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
