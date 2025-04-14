
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ReportFormValues } from '@/hooks/useReportForm';
import { Profile } from '@/types/dataTypes';

/**
 * Uploads a scammer photo to storage
 * @param file The photo file to upload
 * @returns The public URL of the uploaded image
 */
export const uploadScammerPhoto = async (
  file: File
): Promise<string | null> => {
  try {
    const fileName = `scammer_photos/${Date.now()}_${file.name}`;
    
    console.log("Uploading file to bucket 'media':", fileName);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);
      
    if (uploadError) {
      console.error("Photo upload error:", uploadError);
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }
    
    console.log("File uploaded successfully, getting public URL");
    
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

/**
 * Fetches a scammer by ID
 */
export const fetchScammerById = async (id: string) => {
  if (!id) return null;
  
  const { data, error } = await supabase
    .from('scammers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

/**
 * Checks if the current user is the creator of a scammer report
 */
export const isScammerCreator = async (scammerId: string, walletAddress: string): Promise<boolean> => {
  if (!scammerId || !walletAddress) return false;
  
  try {
    const { data, error } = await supabase
      .from('scammers')
      .select('added_by')
      .eq('id', scammerId)
      .single();
      
    if (error) {
      console.error("Error checking scammer creator:", error);
      return false;
    }
    
    return data.added_by === walletAddress;
  } catch (error) {
    console.error("Error checking scammer creator:", error);
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
  const aliases = data.aliases?.filter(item => item !== '') || [];
  const links = data.links?.filter(item => item !== '') || [];
  const accomplices = data.accomplices?.filter(item => item !== '') || [];
  const wallet_addresses = data.wallet_addresses?.filter(item => item !== '') || [];
  
  console.log("Updating existing scammer:", id);
  
  const { error } = await supabase
    .from('scammers')
    .update({
      name: data.name,
      accused_of: data.accused_of,
      wallet_addresses,
      photo_url: photoUrl,
      aliases,
      links,
      accomplices,
      official_response: data.official_response,
    })
    .eq('id', id);
    
  if (error) throw error;
  
  return id;
};

/**
 * Creates a new scammer report
 */
export const createScammerReport = async (
  data: ReportFormValues,
  photoUrl: string | null,
  profile: Profile
) => {
  console.log("Creating new scammer report");
  
  try {
    const newId = await generateScammerId();
    console.log("Generated new scammer ID:", newId);
    
    const aliases = data.aliases?.filter(item => item !== '') || [];
    const links = data.links?.filter(item => item !== '') || [];
    const accomplices = data.accomplices?.filter(item => item !== '') || [];
    const wallet_addresses = data.wallet_addresses?.filter(item => item !== '') || [];
    
    // Convert the numeric ID to a string before inserting
    const newIdString = newId.toString();
    
    const { error } = await supabase
      .from('scammers')
      .insert({
        id: newIdString,
        name: data.name,
        accused_of: data.accused_of,
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
        official_response: data.official_response,
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
    console.error("Error creating scammer report:", error);
    throw error;
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
