
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ReportFormValues } from '@/types/formTypes';
import { Profile } from '@/types/dataTypes';
import { generateScammerId } from './supabaseService';

/**
 * Uploads a photo for a scammer report
 */
export const uploadScammerPhoto = async (
  photoFile: File
): Promise<string | null> => {
  try {
    const fileName = `scammer_photos/${Date.now()}_${photoFile.name}`;
    
    console.log("Uploading file to bucket 'media':", fileName);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, photoFile);
      
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
    console.error("Photo upload exception:", error);
    throw error;
  }
};

/**
 * Fetches a scammer by ID for editing
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
    
    const { error } = await supabase
      .from('scammers')
      .insert({
        id: newId,
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
      });
      
    if (error) {
      console.error("Error inserting new scammer:", error);
      
      if (error.code === '23505') { // Duplicate key error
        throw new Error("This scammer has already been reported. Please try with different information.");
      } else {
        throw error;
      }
    }
    
    return newId;
  } catch (error) {
    console.error("ID generation or insertion error:", error);
    throw error;
  }
};
