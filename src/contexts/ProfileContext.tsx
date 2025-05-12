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

  useEffect(() => {
    const checkPhantomAvailability = () => {
      setIsPhantomAvailable(isPhantomInstalled());
    };

    checkPhantomAvailability();
    
    // Setup auth state change listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sessionData) => {
      console.log('Auth state changed:', event, sessionData?.user?.email);
      
      // Handle token refresh separately to avoid state changes
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, updating session');
        setSession(sessionData);
        return;
      }

      if (event === 'SIGNED_IN') {
        console.log('Sign in event received');
        setSession(sessionData);
        
        if (sessionData?.user?.email) {
          const walletFromEmail = sessionData.user.email.split('@')[0];
          
          if (walletFromEmail && walletFromEmail !== 'null') {
            setWalletAddress(walletFromEmail);
            setIsConnected(true);
            localStorage.setItem('walletAddress', walletFromEmail);
            
            try {
              await fetchProfile(walletFromEmail);
            } catch (error) {
              console.error('Error in auth state change profile fetch:', error);
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Sign out event received');
        // Double check if we really should sign out
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          console.log('No active session found, clearing state');
          setSession(null);
          setProfile(null);
          setWalletAddress(null);
          setIsConnected(false);
          localStorage.removeItem('walletAddress');
        } else {
          console.log('Active session still exists, ignoring sign out event');
        }
        setIsLoading(false);
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
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
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
      provider.on('connect', async () => {
        const publicKey = getWalletPublicKey();
        if (publicKey) {
          try {
            // Check if we already have a valid session for this wallet
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession?.user?.email?.split('@')[0] === publicKey) {
              console.log('Already authenticated with this wallet');
              setWalletAddress(publicKey);
              setIsConnected(true);
              localStorage.setItem('walletAddress', publicKey);
              await fetchProfile(publicKey);
              return;
            }

            // Sign out of any existing session before attempting new authentication
            if (existingSession) {
              console.log('Signing out of existing session before new authentication');
              await supabase.auth.signOut();
            }

            const message = `Login to SEC Community with wallet ${publicKey} at ${Date.now()}`;
            const signature = await signMessageWithPhantom(message);
            
            if (signature) {
              const authenticated = await signInWithCustomToken(publicKey, signature, message);
              
              if (authenticated) {
                console.log('Authentication successful');
                // Let the auth state change listener handle the state updates
              } else {
                console.error('Authentication failed');
                toast({
                  title: 'Authentication Failed',
                  description: 'Could not authenticate with your wallet',
                  variant: 'destructive',
                });
                await disconnectWallet();
              }
            }
          } catch (error) {
            console.error('Error during wallet authentication:', error);
            toast({
              title: 'Authentication Error',
              description: 'Failed to authenticate wallet signature',
              variant: 'destructive',
            });
            await disconnectWallet();
          }
        }
      });
      
      provider.on('disconnect', async () => {
        console.log('Wallet disconnect event received');
        setIsLoading(true);
        try {
          // Get current session before disconnecting
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          setWalletAddress(null);
          setIsConnected(false);
          setProfile(null);
          localStorage.removeItem('walletAddress');
          
          // Only sign out if we have an active session
          if (currentSession) {
            console.log('Active session found, signing out from Supabase');
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error('Error during disconnect:', error);
        } finally {
          setIsLoading(false);
        }
      });
    }
  }, [isPhantomAvailable]);

  // Add a cleanup effect for loading state
  useEffect(() => {
    let mounted = true;
    
    if (isLoading) {
      // Set a maximum time for loading state
      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.log('Loading state timeout reached, clearing loading state');
          setIsLoading(false);
        }
      }, 5000); // 5 seconds maximum loading time
      
      return () => {
        mounted = false;
        clearTimeout(timeoutId);
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [isLoading]);

  const fetchProfile = async (address: string) => {
    let mounted = true;
    setIsLoading(true);
    
    try {
      console.log("Fetching profile for wallet:", address);
      
      // Use getProfileByWallet which has been modified to work without authentication
      const fetchedProfile = await getProfileByWallet(address);
      console.log("Fetched profile:", fetchedProfile);
      
      if (!mounted) return;
      
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        console.log("No profile found, checking if we can create default profile");
        // Check if we have a valid session before attempting to create profile
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (currentSession) {
          console.log("Creating default profile");
          try {
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
            
            if (!mounted) return;
            
            if (savedProfile) {
              setProfile(savedProfile);
              toast({
                title: 'Profile Created',
                description: 'Default profile has been created. You can update it in your profile page.',
              });
            }
          } catch (error) {
            if (!mounted) return;
            console.error('Error creating default profile:', error);
            toast({
              title: 'Error',
              description: 'Failed to create profile',
              variant: 'destructive',
            });
          }
        } else {
          console.log("No session available, cannot create profile");
          toast({
            title: 'Authentication Required',
            description: 'Please connect your wallet to create a profile',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      if (!mounted) return;
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }
    
    return () => {
      mounted = false;
    };
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
          return publicUrl;
        }
      } else if (publicUrl) {
        // If we have a URL but no profile, create a default profile
        const defaultProfile: Profile = {
          id: crypto.randomUUID(),
          wallet_address: walletAddress,
          display_name: `User ${walletAddress.substring(0, 6)}`,
          username: `user_${Date.now().toString(36)}`,
          profile_pic_url: publicUrl,
          created_at: new Date().toISOString(),
          x_link: '',
          website_link: '',
          bio: '',
          points: 0
        };
        
        const savedProfile = await saveProfile(defaultProfile);
        
        if (savedProfile) {
          setProfile(savedProfile);
          emitProfileUpdatedEvent(savedProfile);
          return publicUrl;
        }
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
      
      const publicKey = await connectPhantomWallet();
      
      if (publicKey) {
        // We'll handle authentication and profile fetching in the connect event handler
        console.log("Wallet connected with public key:", publicKey);
        
        // Authentication will be handled in the connect event handler
      } else {
        setIsLoading(false);
      }
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
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        toast({
          title: 'Authentication Required',
          description: 'Please connect your wallet to update your profile',
          variant: 'destructive',
        });
        return null;
      }
      
      // Ensure we have all required fields
      const profileData = {
        ...updatedProfile,
        id: updatedProfile.id || crypto.randomUUID(),
        wallet_address: updatedProfile.wallet_address,
        display_name: updatedProfile.display_name || `User ${updatedProfile.wallet_address.substring(0, 6)}`,
        username: updatedProfile.username || `user_${Date.now().toString(36)}`,
        profile_pic_url: updatedProfile.profile_pic_url || '',
        created_at: updatedProfile.created_at || new Date().toISOString(),
        x_link: updatedProfile.x_link || '',
        website_link: updatedProfile.website_link || '',
        bio: updatedProfile.bio || '',
        points: updatedProfile.points || 0
      };
      
      const savedProfile = await saveProfile(profileData);
      
      if (savedProfile) {
        setProfile(savedProfile);
        emitProfileUpdatedEvent(savedProfile);
        
        toast({
          title: 'Success',
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
