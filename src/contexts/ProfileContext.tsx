
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Profile } from '@/types/dataTypes';
import { getProfileByWallet, uploadProfilePicture, saveProfile } from '@/services/profileService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  connectWallet: () => void;
  disconnectWallet: () => void;
  refreshProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  isPhantomAvailable: boolean;
  updateProfile: (updatedProfile: Profile) => Promise<Profile | null>;
  session: any | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get the connected wallet address
  const walletAddress = wallets.find(wallet => wallet.walletClientType === 'phantom')?.address || 
                       wallets[0]?.address || null;

  const isConnected = authenticated && !!walletAddress;

  const fetchProfile = async (address: string) => {
    if (!address) {
      console.log("No wallet address provided");
      return;
    }
    
    try {
      console.log("Fetching profile for wallet:", address);
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Effect to handle authentication and profile fetching
  useEffect(() => {
    if (!ready) {
      setIsLoading(true);
      return;
    }

    if (authenticated && walletAddress) {
      // Authenticate with Supabase using wallet address
      const authenticateWithSupabase = async () => {
        try {
          const walletEmail = `${walletAddress.toLowerCase()}@sec.digital`;
          
          // Try to sign in, if that fails, sign up
          const { error } = await supabase.auth.signInWithPassword({
            email: walletEmail,
            password: walletAddress, // Use wallet address as password for simplicity
          });

          if (error) {
            // Sign up if sign in fails
            const { error: signUpError } = await supabase.auth.signUp({
              email: walletEmail,
              password: walletAddress,
              options: {
                data: {
                  wallet_address: walletAddress,
                }
              }
            });

            if (signUpError) {
              console.error('Supabase auth error:', signUpError);
            }
          }
        } catch (error) {
          console.error('Error authenticating with Supabase:', error);
        }
      };

      authenticateWithSupabase();
      fetchProfile(walletAddress);
    } else {
      setProfile(null);
      setIsLoading(false);
      // Sign out from Supabase if not authenticated with Privy
      supabase.auth.signOut();
    }
  }, [ready, authenticated, walletAddress]);

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

  const connectWallet = () => {
    if (!ready) return;
    login();
  };

  const disconnectWallet = () => {
    if (!ready) return;
    logout();
    setProfile(null);
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
    isLoading: isLoading || !ready,
    connectWallet,
    disconnectWallet,
    refreshProfile,
    uploadAvatar,
    isPhantomAvailable: true, // Privy handles wallet availability
    updateProfile,
    session: user // Privy user object acts as session
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
