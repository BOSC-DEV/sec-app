import { supabase, isAuthenticated } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandling';
import { sanitizeInput, sanitizeUrl } from '@/utils/securityUtils';
import { ErrorSeverity } from '@/utils/errorSeverity';

// Function to upload profile picture
export const uploadProfilePicture = async (walletAddress: string, file: File): Promise<string | null> => {
  try {
    if (!walletAddress || !file) {
      throw new Error('Missing required parameters for profile picture upload');
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed');
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }
    
    const sanitizedWallet = sanitizeInput(walletAddress);
    const fileExt = file.name.split('.').pop();
    const fileName = `${sanitizedWallet}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pics/${fileName}`;

    // Ensure user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      throw new Error('Authentication required to upload profile picture');
    }

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Error uploading profile picture',
      severity: ErrorSeverity.MEDIUM,
      context: 'uploadProfilePicture'
    });
    return null;
  }
};
