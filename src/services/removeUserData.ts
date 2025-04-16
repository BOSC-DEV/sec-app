
import { removeUserDataByUsername } from './profileService';
import { toast } from '@/hooks/use-toast';

// Execute the data removal for dandev
export const removeDataForDandev = async () => {
  try {
    console.log('Starting data removal process for dandev');
    
    const success = await removeUserDataByUsername('dandev');
    
    if (success) {
      console.log('Successfully removed all data for dandev');
      toast({
        title: 'User Data Removed',
        description: 'All data for user @dandev has been successfully removed from the system.',
        variant: 'default',
      });
    } else {
      console.error('Failed to remove all data for dandev');
      toast({
        title: 'Operation Failed',
        description: 'Could not remove all data for user @dandev. Please try again or contact support.',
        variant: 'destructive',
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error in removeDataForDandev:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while trying to remove user data.',
      variant: 'destructive',
    });
    return false;
  }
};

// Execute immediately on load
removeDataForDandev();
