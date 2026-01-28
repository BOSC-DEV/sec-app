import { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { Profile } from '@/types/dataTypes';
import { getProfileByWallet, uploadProfilePicture, saveProfile } from '@/services/profileService';
import { toast } from '@/hooks/use-toast';
import { 
  connectPhantomWallet, 
  disconnectPhantomWallet, 
  getPhantomProvider, 
  getWalletPublicKey, 
  isPhantomInstalled,
  signMessageWithPhantom
} from '@/utils/phantomWallet';
import { supabase } from '@/integrations/supabase/client';
import { authenticateWallet } from '@/utils/authUtils';
import { Session } from '@supabase/supabase-js';

export const PROFILE_UPDATED_EVENT = 'profile-updated';

export const emitProfileUpdatedEvent = (profile: Profile) => {
  const event = new CustomEvent(PROFILE_UPDATED_EVENT, { detail: profile });
  window.dispatchEvent(event);
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
  isPhantomAvailable: boolean;
  updateProfile: (updatedProfile: Profile) => Promise<Profile | null>;
  session: Session | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Loading timeout duration (15 seconds)
const LOADING_TIMEOUT_MS = 15000;

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPhantomAvailable, setIsPhantomAvailable] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isWalletReady, setIsWalletReady] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Refs for tracking state and preventing race conditions
  const initialCheckComplete = useRef(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to set loading with timeout protection
  const setLoadingWithTimeout = (loading: boolean) => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    setIsLoading(loading);
    
    // Set safety timeout when loading starts
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
  const setValidatedWalletAddress = async (address: string | null): Promise<boolean> => {
    if (address) {
      const provider = getPhantomProvider();
      if (!provider) {
        console.log("Phantom provider not available");
        return false;
      }

      try {
        // If wallet is not connected, try to reconnect using trusted apps feature
        if (!provider.isConnected) {
          console.log("Attempting to reconnect to Phantom wallet...");
          await provider.connect({ onlyIfTrusted: true });
        }

        // Check if the wallet is now connected and matches
        if (!provider.isConnected || !provider.publicKey || provider.publicKey.toString().toLowerCase() !== address.toLowerCase()) {
          console.log("Wallet not properly connected in Phantom");
          return false;
        }

        const publicKey = getWalletPublicKey();
        if (publicKey && publicKey.toLowerCase() === address.toLowerCase()) {
          setWalletAddress(publicKey);
          localStorage.setItem('walletAddress', publicKey);
          setIsConnected(true);
          setIsWalletReady(true);
          return true;
        }
      } catch (error) {
        console.error("Error reconnecting to Phantom wallet:", error);
        return false;
      }
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

  useEffect(() => {
    const checkPhantomAvailability = () => {
      setIsPhantomAvailable(isPhantomInstalled());
    };

    checkPhantomAvailability();
    
    // Setup auth state change listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sessionData) => {
      console.log('Auth state changed:', event, sessionData?.user?.email);
      setSession(sessionData);
      
      if (sessionData && sessionData.user) {
        // Extract wallet address from session email (it's in lowercase)
        const sessionWalletAddress = sessionData.user.email?.split('@')[0];
        if (sessionWalletAddress) {
          // Defer async operations to prevent deadlocks
          setTimeout(async () => {
            const isValid = await setValidatedWalletAddress(sessionWalletAddress);
            if (!isValid) {
              // Defer signOut to prevent recursive auth events
              setTimeout(async () => {
                await supabase.auth.signOut();
              }, 0);
              // Reset state synchronously
              setWalletAddress(null);
              setIsConnected(false);
              setProfile(null);
              setIsWalletReady(false);
              localStorage.removeItem('walletAddress');
            }
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setWalletAddress(null);
        setIsConnected(false);
        setIsWalletReady(false);
        localStorage.removeItem('walletAddress');
        clearLoading();
      }
    });
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        setLoadingWithTimeout(true);

        // First check if Phantom is available and wait a bit for it to initialize if needed
        const maxAttempts = 5;
        let attempts = 0;
        let provider = getPhantomProvider();
        
        while (!provider && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          provider = getPhantomProvider();
          attempts++;
        }

        if (!provider) {
          console.log("Phantom provider not available after waiting");
          clearLoading();
          initialCheckComplete.current = true;
          return;
        }

        // Try to reconnect to Phantom if we have a previous connection
        try {
          if (!provider.isConnected && provider.isPhantom) {
            console.log("Attempting to restore Phantom connection...");
            await provider.connect({ onlyIfTrusted: true });
          }
        } catch (error) {
          console.log("Could not auto-reconnect to Phantom:", error);
        }

        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          setSession(existingSession);
          const sessionWalletAddress = existingSession.user.email?.split('@')[0];
          
          if (sessionWalletAddress) {
            const isValid = await setValidatedWalletAddress(sessionWalletAddress);
            if (!isValid) {
              await supabase.auth.signOut();
              setWalletAddress(null);
              setIsConnected(false);
              setProfile(null);
              setIsWalletReady(false);
              localStorage.removeItem('walletAddress');
            }
          }
        } else {
          // Check if we have a saved wallet address
          const savedWallet = localStorage.getItem('walletAddress');
          if (savedWallet) {
            const isValid = await setValidatedWalletAddress(savedWallet);
            if (!isValid) {
              setWalletAddress(null);
              setIsConnected(false);
              setProfile(null);
              setIsWalletReady(false);
              localStorage.removeItem('walletAddress');
            }
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
    
    window.addEventListener('DOMContentLoaded', checkPhantomAvailability);
    
    return () => {
      window.removeEventListener('DOMContentLoaded', checkPhantomAvailability);
      subscription.unsubscribe();
      // Clean up timeout on unmount
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const provider = getPhantomProvider();
    
    if (provider) {
      provider.on('connect', async () => {
        const publicKey = getWalletPublicKey();
        if (publicKey) {
          setLoadingWithTimeout(true);
          // Need to authenticate with Supabase after wallet connect
          try {
            // Check if already authenticated
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email === `${publicKey}@sec.digital`) {
              console.log("Already authenticated with this wallet");
              setWalletAddress(publicKey);
              setIsConnected(true);
              localStorage.setItem('walletAddress', publicKey);
              await fetchProfile(publicKey);
              return;
            }

            // Use a constant message for authentication (never changes)
            const message = 'Sign in to Scams and E-Crimes Commission';
            const signature = await signMessageWithPhantom(message);
            
            if (!signature) {
              console.log("Signature request was cancelled or already in progress");
              clearLoading();
              return;
            }
            
            const authenticated = await authenticateWallet(publicKey, signature, message);
            
            if (authenticated) {
              setWalletAddress(publicKey);
              setIsConnected(true);
              localStorage.setItem('walletAddress', publicKey);
              await fetchProfile(publicKey);
            } else {
              console.error('Authentication failed - no session returned');
              toast({
                title: 'Authentication Failed',
                description: 'Could not authenticate with your wallet. Please try disconnecting and reconnecting.',
                variant: 'destructive',
              });
              // Reset loading state immediately before disconnecting
              clearLoading();
              disconnectWallet();
            }
          } catch (error: any) {
            console.error('Error during wallet authentication:', error);
            
            // Handle user rejection (error code 4001)
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
            // Reset loading state immediately before disconnecting
            clearLoading();
            disconnectWallet();
          }
        }
      });
      
      provider.on('disconnect', () => {
        setWalletAddress(null);
        setIsConnected(false);
        setProfile(null);
        localStorage.removeItem('walletAddress');
        clearLoading();
        // Defer signOut to prevent potential issues
        setTimeout(() => {
          supabase.auth.signOut();
        }, 0);
      });
    }
  }, [isPhantomAvailable]);

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
    // Prevent concurrent connection attempts
    if (isConnecting) {
      console.log("Connection already in progress");
      return;
    }

    try {
      setIsConnecting(true);
      setLoadingWithTimeout(true);
      
      if (!isPhantomAvailable) {
        toast({
          title: 'Phantom Wallet Not Installed',
          description: 'Please install Phantom wallet to continue',
          variant: 'destructive',
        });
        
        // Open the Phantom wallet website in a new tab
        window.open('https://phantom.app/', '_blank');
        clearLoading();
        return;
      }
      
      const publicKey = await connectPhantomWallet();
      
      if (publicKey) {
        // We'll handle authentication and profile fetching in the connect event handler
        console.log("Wallet connected with public key:", publicKey);
        
        // Authentication will be handled in the connect event handler
      } else {
        clearLoading();
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      // Handle user rejection
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
    if (isPhantomAvailable) {
      disconnectPhantomWallet();
    }
    
    localStorage.removeItem('walletAddress');
    setWalletAddress(null);
    setIsConnected(false);
    setProfile(null);
    clearLoading();
    
    // Defer signOut to prevent potential issues
    setTimeout(() => {
      supabase.auth.signOut();
    }, 0);
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
    isPhantomAvailable,
    updateProfile,
    session
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
