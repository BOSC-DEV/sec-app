
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Profile } from '@/types/dataTypes';
import { 
  getProfileByWallet, 
  uploadProfilePicture, 
  saveProfile, 
  createDefaultProfile 
} from '@/services/profileService';
import { toast } from '@/hooks/use-toast';
import { 
  connectPhantomWallet, 
  disconnectPhantomWallet, 
  getPhantomProvider, 
  getWalletPublicKey, 
  isPhantomInstalled,
  signMessageWithPhantom
} from '@/utils/phantomWallet';
import { supabase, signInWithCustomToken } from '@/integrations/supabase/client';
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

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPhantomAvailable, setIsPhantomAvailable] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    const checkPhantomAvailability = () => {
      setIsPhantomAvailable(isPhantomInstalled());
    };

    checkPhantomAvailability();
    
    // Setup auth state change listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sessionData) => {
      console.log('Auth state changed:', event, sessionData?.user?.email);
      
      // Only update session if the event is not a token refresh
      if (event !== 'TOKEN_REFRESHED') {
        setSession(sessionData);
      }
      
      if (sessionData && sessionData.user) {
        // Extract wallet address from user email or user metadata
        const email = sessionData.user.email;
        const walletFromEmail = email ? email.split('@')[0] : null;
        
        if (walletFromEmail && walletFromEmail !== 'null') {
          setWalletAddress(walletFromEmail);
          setIsConnected(true);
          localStorage.setItem('walletAddress', walletFromEmail);
          
          // Only fetch profile if this is a new sign in
          if (event === 'SIGNED_IN' && isAuthInitialized) {
            // Delay fetching the profile to avoid race conditions
            setTimeout(() => {
              fetchProfile(walletFromEmail);
            }, 0);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Only clear state if we're actually signed out and initialization is complete
        if (!sessionData && isAuthInitialized) {
          setProfile(null);
          setWalletAddress(null);
          setIsConnected(false);
          localStorage.removeItem('walletAddress');
        }
      }
    });
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          setSession(existingSession);
          
          // Extract wallet address from session
          const email = existingSession.user.email;
          const walletFromEmail = email ? email.split('@')[0] : null;
          
          if (walletFromEmail && walletFromEmail !== 'null') {
            setWalletAddress(walletFromEmail);
            setIsConnected(true);
            fetchProfile(walletFromEmail);
          } else {
            setIsLoading(false);
          }
        } else {
          // Try from localStorage as fallback
          const savedWallet = localStorage.getItem('walletAddress');
          if (savedWallet) {
            // If we have a wallet address but no session, we need to reconnect
            console.log("Found saved wallet but no session, attempting to reconnect");
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        }
        
        // Mark auth as initialized after initial check
        setIsAuthInitialized(true);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
        setIsAuthInitialized(true); // Still mark as initialized even if there was an error
      }
    };

    checkExistingSession();
    
    window.addEventListener('DOMContentLoaded', checkPhantomAvailability);
    
    return () => {
      window.removeEventListener('DOMContentLoaded', checkPhantomAvailability);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const provider = getPhantomProvider();
    
    if (provider) {
      // Handler for wallet connection
      const handleConnect = async (publicKey: string | null) => {
        if (publicKey) {
          setIsLoading(true);
          // Need to authenticate with Supabase after wallet connect
          try {
            const message = `Login to SEC Community with wallet ${publicKey} at ${Date.now()}`;
            const signature = await signMessageWithPhantom(message);
            
            if (signature) {
              const authenticated = await signInWithCustomToken(publicKey, signature, message);
              
              if (authenticated) {
                setWalletAddress(publicKey);
                setIsConnected(true);
                localStorage.setItem('walletAddress', publicKey);
                await fetchProfile(publicKey);
              } else {
                toast({
                  title: 'Authentication Failed',
                  description: 'Could not authenticate with your wallet',
                  variant: 'destructive',
                });
                // Handle failed authentication without disconnecting
                setIsLoading(false);
              }
            }
          } catch (error) {
            console.error('Error during wallet authentication:', error);
            toast({
              title: 'Authentication Error',
              description: 'Failed to authenticate wallet signature',
              variant: 'destructive',
            });
            setIsLoading(false);
          }
        }
      };
      
      // Handler for wallet disconnection
      const handleDisconnect = () => {
        // Only process disconnect if we're currently connected
        if (isConnected) {
          setWalletAddress(null);
          setIsConnected(false);
          setProfile(null);
          localStorage.removeItem('walletAddress');
          // Also sign out from Supabase
          supabase.auth.signOut();
        }
      };
      
      provider.on('connect', () => {
        const publicKey = getWalletPublicKey();
        handleConnect(publicKey);
      });
      
      provider.on('disconnect', handleDisconnect);
      
      return () => {
        provider.removeListener('connect', () => {
          const publicKey = getWalletPublicKey();
          handleConnect(publicKey);
        });
        provider.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [isConnected, isPhantomAvailable, isAuthInitialized]);

  const fetchProfile = async (address: string) => {
    try {
      console.log("Fetching profile for wallet:", address);
      setIsLoading(true);
      
      // Use getProfileByWallet which has been modified to work without authentication
      const fetchedProfile = await getProfileByWallet(address);
      console.log("Fetched profile:", fetchedProfile);
      
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        console.log("No profile found, creating default profile");
        // Creating a default profile requires authentication
        if (session) {
          await createDefaultProfile(address);
          // Fetch the profile after creating it
          const newProfile = await getProfileByWallet(address);
          if (newProfile) {
            setProfile(newProfile);
            toast({
              title: 'Profile Created',
              description: 'Default profile has been created. You can update it in your profile page.',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultProfile = async (address: string) => {
    try {
      setIsLoading(true);
      const defaultProfile: Profile = {
        id: crypto.randomUUID(),
        wallet_address: address,
        display_name: `User ${address.substring(0, 6)}`,
        username: `user_${Date.now().toString(36)}`,
        profile_pic_url: '',
        created_at: new Date().toISOString(),
        x_link: '',
        website_link: '',
        bio: '',
        points: 0
      };
      
      const savedProfile = await saveProfile(defaultProfile);
      
      if (savedProfile) {
        setProfile(savedProfile);
        toast({
          title: 'Profile Created',
          description: 'Default profile has been created. You can update it in your profile page.',
        });
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to create profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      if (!isPhantomAvailable) {
        toast({
          title: 'Phantom Wallet Not Installed',
          description: 'Please install Phantom wallet to continue',
          variant: 'destructive',
        });
        
        // Open the Phantom wallet website in a new tab
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      await connectPhantomWallet();
      // Connection will be handled in the connect event handler
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to wallet',
        variant: 'destructive',
      });
      setIsLoading(false);
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
    
    // Also sign out from Supabase
    supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (walletAddress) {
      await fetchProfile(walletAddress);
    }
  };

  const updateProfile = async (updatedProfile: Profile): Promise<Profile | null> => {
    try {
      setIsLoading(true);
      
      // Check if we're authenticated before trying to update
      if (!session) {
        toast({
          title: 'Authentication Required',
          description: 'Please connect your wallet to update your profile',
          variant: 'destructive',
        });
        return null;
      }
      
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
      setIsLoading(false);
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
