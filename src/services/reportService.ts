
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ReportFormValues } from '@/hooks/useReportForm';
import { Profile } from '@/types/dataTypes';
import { sanitizeInput } from '@/utils/securityUtils';
import { handleError } from '@/utils/errorHandling';
import { ErrorSeverity } from '@/utils/errorSeverity';

/**
 * Uploads a scammer photo to storage
 * @param file The photo file to upload
 * @returns The public URL of the uploaded image
 */
export const uploadScammerPhoto = async (
  file: File
): Promise<string | null> => {
  try {
    if (!file) {
      throw new Error('No file provided for upload');
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
    
    // Create a safe filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const safeFileName = `scammer_photos/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    console.log("Uploading file to bucket 'media':", safeFileName);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(safeFileName, file, {
        cacheControl: '3600',
        contentType: file.type
      });
      
    if (uploadError) {
      console.error("Photo upload error:", uploadError);
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }
    
    console.log("File uploaded successfully, getting public URL");
    
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(safeFileName);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to upload scammer photo',
      severity: ErrorSeverity.MEDIUM,
      context: 'uploadScammerPhoto'
    });
    return null;
  }
};

/**
 * Fetches a scammer by ID
 */
export const fetchScammerById = async (id: string) => {
  try {
    if (!id) return null;
    
    const sanitizedId = sanitizeInput(id);
    
    const { data, error } = await supabase
      .from('scammers')
      .select('*')
      .eq('id', sanitizedId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to fetch scammer details',
      severity: ErrorSeverity.MEDIUM,
      context: 'fetchScammerById'
    });
    return null;
  }
};

/**
 * Checks if the current user is the creator of a scammer report
 */
export const isScammerCreator = async (scammerId: string, walletAddress: string): Promise<boolean> => {
  try {
    if (!scammerId || !walletAddress) return false;
    
    const sanitizedId = sanitizeInput(scammerId);
    const sanitizedWallet = sanitizeInput(walletAddress);
    
    const { data, error } = await supabase
      .from('scammers')
      .select('added_by')
      .eq('id', sanitizedId)
      .single();
      
    if (error) {
      console.error("Error checking scammer creator:", error);
      return false;
    }
    
    return data.added_by === sanitizedWallet;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to verify scammer creator',
      severity: ErrorSeverity.LOW,
      context: 'isScammerCreator',
      silent: true
    });
    return false;
  }
};

/**
 * Updates an existing scammer report
 */
export const updateScammerReport = async (
  id: string,
  data: ReportFormValues,
  photoUrl: string | null
) => {
  try {
    if (!id) {
      throw new Error('No scammer ID provided for update');
    }
    
    const sanitizedId = sanitizeInput(id);
    
    // Filter out empty values and sanitize arrays
    const aliases = data.aliases?.filter(item => item !== '').map(sanitizeInput) || [];
    const links = data.links?.filter(item => item !== '').map(sanitizeInput) || [];
    const accomplices = data.accomplices?.filter(item => item !== '').map(sanitizeInput) || [];
    const wallet_addresses = data.wallet_addresses?.filter(item => item !== '').map(sanitizeInput) || [];
    
    // Sanitize other fields
    const sanitizedName = sanitizeInput(data.name);
    const sanitizedAccusedOf = sanitizeInput(data.accused_of);
    const sanitizedResponse = data.official_response ? sanitizeInput(data.official_response) : null;
    
    console.log("Updating existing scammer:", sanitizedId);
    
    const { error } = await supabase
      .from('scammers')
      .update({
        name: sanitizedName,
        accused_of: sanitizedAccusedOf,
        wallet_addresses,
        photo_url: photoUrl,
        aliases,
        links,
        accomplices,
        official_response: sanitizedResponse,
      })
      .eq('id', sanitizedId);
      
    if (error) throw error;
    
    return sanitizedId;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update scammer report',
      severity: ErrorSeverity.MEDIUM,
      context: 'updateScammerReport'
    });
    throw error; // Rethrow to allow calling functions to handle the error
  }
};

/**
 * Creates a new scammer report
 */
export const createScammerReport = async (
  data: ReportFormValues,
  photoUrl: string | null,
  profile: Profile
) => {
  try {
    if (!profile || !profile.wallet_address) {
      throw new Error('User profile information is missing');
    }
    
    console.log("Creating new scammer report");
    
    const newId = await generateScammerId();
    console.log("Generated new scammer ID:", newId);
    
    // Filter out empty values and sanitize arrays
    const aliases = data.aliases?.filter(item => item !== '').map(sanitizeInput) || [];
    const links = data.links?.filter(item => item !== '').map(sanitizeInput) || [];
    const accomplices = data.accomplices?.filter(item => item !== '').map(sanitizeInput) || [];
    const wallet_addresses = data.wallet_addresses?.filter(item => item !== '').map(sanitizeInput) || [];
    
    // Sanitize other fields
    const sanitizedName = sanitizeInput(data.name);
    const sanitizedAccusedOf = sanitizeInput(data.accused_of);
    const sanitizedResponse = data.official_response ? sanitizeInput(data.official_response) : null;
    
    // Convert the numeric ID to a string before inserting
    const newIdString = newId.toString();
    
    const { error } = await supabase
      .from('scammers')
      .insert({
        id: newIdString,
        name: sanitizedName,
        accused_of: sanitizedAccusedOf,
        wallet_addresses,
        photo_url: photoUrl,
        aliases,
        links,
        accomplices,
        added_by: profile.wallet_address,
        date_added: new Date().toISOString(),
        views: 0,
        likes: 0,
        dislikes: 0,
        shares: 0,
        bounty_amount: 0,
        official_response: sanitizedResponse,
      });
      
    if (error) {
      console.error("Error inserting new scammer:", error);
      
      if (error.code === '23505') {
        throw new Error("This scammer has already been reported. Please try with different information.");
      }
      
      throw error;
    }
    
    return newIdString;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create scammer report',
      severity: ErrorSeverity.MEDIUM,
      context: 'createScammerReport'
    });
    throw error; // Rethrow to allow calling functions to handle the error
  }
};

/**
 * Generates a new scammer ID
 */
export const generateScammerId = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    return data[0]?.id ? parseInt(data[0].id) + 1 : 1;
  } catch (error) {
    console.error("Error generating scammer ID:", error);
    throw error;
  }
};
