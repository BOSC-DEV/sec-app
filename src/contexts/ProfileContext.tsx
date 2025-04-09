
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Profile } from '@/types/dataTypes';
import { getProfileByWallet, uploadProfilePicture, saveProfile } from '@/services/profileService';
import { toast } from '@/hooks/use-toast';
import { 
  connectPhantomWallet, 
  disconnectPhantomWallet, 
  getPhantomProvider, 
  getWalletPublicKey, 
  isPhantomInstalled 
} from '@/utils/phantomWallet';

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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPhantomAvailable, setIsPhantomAvailable] = useState<boolean>(false);

  // Check for Phantom wallet and saved wallet on load
  useEffect(() => {
    const checkPhantomAvailability = () => {
      setIsPhantomAvailable(isPhantomInstalled());
    };

    checkPhantomAvailability();

    // Check if wallet is already connected
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      fetchProfile(savedWallet);
    }

    // Add event listener for when Phantom is installed
    window.addEventListener('DOMContentLoaded', checkPhantomAvailability);
    
    return () => {
      window.removeEventListener('DOMContentLoaded', checkPhantomAvailability);
    };
  }, []);

  // Add event listeners for Phantom wallet connection changes
  useEffect(() => {
    const provider = getPhantomProvider();
    
    if (provider) {
      // Handle connection events
      provider.on('connect', () => {
        const publicKey = getWalletPublicKey();
        if (publicKey) {
          setWalletAddress(publicKey);
          setIsConnected(true);
          localStorage.setItem('walletAddress', publicKey);
          fetchProfile(publicKey);
        }
      });
      
      // Handle disconnection events
      provider.on('disconnect', () => {
        setWalletAddress(null);
        setIsConnected(false);
        setProfile(null);
        localStorage.removeItem('walletAddress');
      });
    }
  }, [isPhantomAvailable]);

  const fetchProfile = async (address: string) => {
    try {
      setIsLoading(true);
      const fetchedProfile = await getProfileByWallet(address);
      setProfile(fetchedProfile);
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
      // Create a default profile for new users
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
      
      if (publicUrl) {
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
      
      if (isPhantomAvailable) {
        // Connect to Phantom wallet
        const publicKey = await connectPhantomWallet();
        
        if (publicKey) {
          setWalletAddress(publicKey);
          setIsConnected(true);
          localStorage.setItem('walletAddress', publicKey);
          
          // Check if profile exists
          const existingProfile = await getProfileByWallet(publicKey);
          
          if (existingProfile) {
            // Profile exists, set it
            setProfile(existingProfile);
          } else {
            // Profile doesn't exist, create a new one
            await createDefaultProfile(publicKey);
          }
        }
      } else {
        // Fallback to mock wallet for testing
        const mockWalletAddress = `wallet_${Date.now().toString(36)}`;
        
        localStorage.setItem('walletAddress', mockWalletAddress);
        setWalletAddress(mockWalletAddress);
        setIsConnected(true);
        
        // Create a mock profile
        await createDefaultProfile(mockWalletAddress);
        
        toast({
          title: 'Mock Wallet Connected',
          description: 'Phantom wallet not detected. Using a mock wallet for testing.',
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to wallet',
        variant: 'destructive',
      });
    } finally {
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
    
    if (!isPhantomAvailable) {
      toast({
        title: 'Wallet Disconnected',
        description: 'Your mock wallet has been disconnected',
      });
    }
  };

  const refreshProfile = async () => {
    if (walletAddress) {
      await fetchProfile(walletAddress);
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
    isPhantomAvailable
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
