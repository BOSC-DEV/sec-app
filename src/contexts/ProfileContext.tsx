
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Profile } from '@/types/dataTypes';
import { getProfileByWallet } from '@/services/profileService';
import { toast } from '@/hooks/use-toast';

interface ProfileContextType {
  isConnected: boolean;
  walletAddress: string | null;
  profile: Profile | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check for saved wallet on load
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      fetchProfile(savedWallet);
    }
  }, []);

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

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // This is a mock implementation. In a real app, you would integrate with Phantom or other wallet
      // For now, we'll create a mock wallet address
      const mockWalletAddress = `wallet_${Date.now().toString(36)}`;
      
      // In a real implementation, you would request the user to sign a message to prove ownership
      // For demo purposes, we'll just simulate this
      
      // Save wallet address
      localStorage.setItem('walletAddress', mockWalletAddress);
      setWalletAddress(mockWalletAddress);
      setIsConnected(true);
      
      // Check if profile exists
      await fetchProfile(mockWalletAddress);
      
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully',
      });
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
    localStorage.removeItem('walletAddress');
    setWalletAddress(null);
    setIsConnected(false);
    setProfile(null);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
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
    refreshProfile
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
