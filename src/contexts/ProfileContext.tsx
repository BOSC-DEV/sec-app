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
import { supabase, signInWithCustomToken, isAuthenticated } from '@/integrations/supabase/client';
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

  useEffect(() => {
    const checkPhantomAvailability = () => {
      setIsPhantomAvailable(isPhantomInstalled());
    };

    checkPhantomAvailability();
    
    // Setup auth state change listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sessionData) => {
      console.log('Auth state changed:', event, sessionData?.user?.email);
      
      try {
        if (event === 'SIGNED_IN') {
          setSession(sessionData);
          
          // Extract wallet address from user email or user metadata
          const email = sessionData?.user?.email;
          const walletFromEmail = email ? email.split('@')[0] : null;
          
          if (walletFromEmail && walletFromEmail !== 'null') {
            setWalletAddress(walletFromEmail);
            setIsConnected(true);
            localStorage.setItem('walletAddress', walletFromEmail);
            
            // Delay fetching the profile to avoid race conditions
            await new Promise(resolve => setTimeout(resolve, 500));
            await fetchProfile(walletFromEmail);
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear all auth state
          setSession(null);
          setProfile(null);
          setWalletAddress(null);
          setIsConnected(false);
          localStorage.removeItem('walletAddress');
        } else if (event === 'TOKEN_REFRESHED') {
          // Update session and verify wallet address matches
          setSession(sessionData);
          const email = sessionData?.user?.email;
          const walletFromEmail = email ? email.split('@')[0] : null;
          
          if (walletFromEmail && walletFromEmail !== 'null' && walletFromEmail.toLowerCase() === walletAddress?.toLowerCase()) {
            // Session is still valid for the same wallet
            console.log('Token refreshed successfully');
          } else {
            // Session is for a different wallet, sign out
            console.warn('Token refresh mismatch, signing out');
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Ensure we clean up state on error
        setSession(null);
        setProfile(null);
        setWalletAddress(null);
        setIsConnected(false);
        localStorage.removeItem('walletAddress');
      }
    });
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        setIsLoading(true);
        const isUserAuthenticated = await isAuthenticated();
        
        if (isUserAuthenticated) {
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          setSession(existingSession);
          
          // Extract wallet address from session
          const email = existingSession?.user?.email;
          const walletFromEmail = email ? email.split('@')[0] : null;
          
          if (walletFromEmail && walletFromEmail !== 'null') {
            // Verify the session is still valid
            try {
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              
              if (!userError && user?.email?.split('@')[0].toLowerCase() === walletFromEmail.toLowerCase()) {
                setWalletAddress(walletFromEmail);
                setIsConnected(true);
                localStorage.setItem('walletAddress', walletFromEmail);
                await fetchProfile(walletFromEmail);
              } else {
                throw new Error('Invalid session');
              }
            } catch (err) {
              console.warn('Session validation failed:', err);
              await supabase.auth.signOut();
              setIsLoading(false); // Ensure loading is set to false after signout
            }
          } else {
            setIsLoading(false);
          }
        } else {
          // Try from localStorage as fallback
          const savedWallet = localStorage.getItem('walletAddress');
          if (savedWallet) {
            // If we have a wallet address but no session, we need to reconnect
            console.log("Found saved wallet but no session, attempting to reconnect");
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clean up state on error
        setSession(null);
        setProfile(null);
        setWalletAddress(null);
        setIsConnected(false);
        localStorage.removeItem('walletAddress');
        setIsLoading(false);
      }
    };

    checkExistingSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const provider = getPhantomProvider();
    
    if (provider) {
      const handleConnect = async () => {
        const publicKey = getWalletPublicKey();
        if (!publicKey) return;
        
        setIsLoading(true);
        try {
          const message = `Login to SEC Community with wallet ${publicKey} at ${Date.now()}`;
          const signature = await signMessageWithPhantom(message);
          
          if (!signature) {
            throw new Error('Failed to get signature');
          }
          
          const authenticated = await signInWithCustomToken(publicKey, signature, message);
          
          if (!authenticated) {
            throw new Error('Authentication failed');
          }
          
          setWalletAddress(publicKey);
          setIsConnected(true);
          localStorage.setItem('walletAddress', publicKey);
          await fetchProfile(publicKey);
          
        } catch (error) {
          console.error('Error during wallet authentication:', error);
          toast({
            title: 'Authentication Error',
            description: 'Failed to authenticate wallet signature',
            variant: 'destructive',
          });
          disconnectWallet();
        } finally {
          setIsLoading(false);
        }
      };
      
      const handleDisconnect = () => {
        setWalletAddress(null);
        setIsConnected(false);
        setProfile(null);
        localStorage.removeItem('walletAddress');
        // Also sign out from Supabase
        supabase.auth.signOut();
      };
      
      provider.on('connect', handleConnect);
      provider.on('disconnect', handleDisconnect);
      
      return () => {
        provider.off('connect', handleConnect);
        provider.off('disconnect', handleDisconnect);
      };
    }
  }, [isPhantomAvailable]);

  const fetchProfile = async (address: string) => {
    try {
      console.log("Fetching profile for wallet:", address);
      setIsLoading(true);
      
      const fetchedProfile = await getProfileByWallet(address);
      console.log("Fetched profile:", fetchedProfile);
      
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        console.log("No profile found, creating default profile");
        if (session) {
          await createDefaultProfile(address);
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
    if (isLoading) return; // Prevent multiple connection attempts
    
    try {
      setIsLoading(true);
      
      if (!isPhantomAvailable) {
        toast({
          title: 'Phantom Wallet Not Installed',
          description: 'Please install Phantom wallet to continue',
          variant: 'destructive',
        });
        
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      // First check if we already have a session
      const hasExistingSession = await isAuthenticated();
      if (hasExistingSession) {
        await supabase.auth.signOut();
      }
      
      const publicKey = await connectPhantomWallet();
      
      if (!publicKey) {
        throw new Error('Failed to connect wallet');
      }

      // Generate a unique nonce for this login attempt
      const nonce = `Login to SEC Community with wallet ${publicKey} at ${Date.now()}`;
      
      // Request signature from Phantom
      const signature = await signMessageWithPhantom(nonce);
      
      if (!signature) {
        throw new Error('Failed to get signature from wallet');
      }
      
      // Authenticate with Supabase using the edge function
      const authSuccess = await signInWithCustomToken(publicKey, signature, nonce);
      
      if (!authSuccess) {
        throw new Error('Authentication failed');
      }

      setWalletAddress(publicKey);
      setIsConnected(true);
      localStorage.setItem('walletAddress', publicKey);
      
      // Fetch profile after successful authentication
      await fetchProfile(publicKey);
      
      toast({
        title: 'Connected Successfully',
        description: 'Your wallet has been connected',
      });
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // Clean up on error
      disconnectWallet();
      
      toast({
        title: 'Connection Failed',
        description: error.message || 'Could not connect to wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsLoading(true);
    try {
      if (isPhantomAvailable) {
        disconnectPhantomWallet();
      }
      
      localStorage.removeItem('walletAddress');
      setWalletAddress(null);
      setIsConnected(false);
      setProfile(null);
      
      // Also sign out from Supabase
      supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
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
