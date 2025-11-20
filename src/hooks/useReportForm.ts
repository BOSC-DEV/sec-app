import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useQueryClient } from '@tanstack/react-query';
import { 
  uploadScammerPhoto, 
  updateScammerReport, 
  createScammerReport, 
  fetchScammerById 
} from '@/services/reportService';

// Validation schema for the report form
export const reportSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  accused_of: z.string().optional(),
  wallet_addresses: z.array(z.string()).optional(),
  photo_url: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  accomplices: z.array(z.string()).optional(),
  official_response: z.string().optional(), // Added official_response field
});

export type ReportFormValues = z.infer<typeof reportSchema>;

export const useReportForm = (id?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditMode] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: '',
      accused_of: '',
      wallet_addresses: [''],
      photo_url: '',
      aliases: [''],
      links: [''],
      accomplices: [''],
      official_response: '', // Added default value
    }
  });
  
  // Fetch existing scammer data for edit mode
  useEffect(() => {
    const fetchScammerData = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const scammerData = await fetchScammerById(id);
          if (scammerData) {
            // Populate form with existing data
            form.reset({
              name: scammerData.name,
              accused_of: scammerData.accused_of || '',
              wallet_addresses: scammerData.wallet_addresses?.length ? scammerData.wallet_addresses : [''],
              photo_url: scammerData.photo_url || '',
              aliases: scammerData.aliases?.length ? scammerData.aliases : [''],
              links: scammerData.links?.length ? scammerData.links : [''],
              accomplices: scammerData.accomplices?.length ? scammerData.accomplices : [''],
              official_response: scammerData.official_response || '',
            });
            
            if (scammerData.photo_url) {
              setPhotoPreview(scammerData.photo_url);
            }
          }
        } catch (error) {
          console.error('Error fetching scammer data:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load scammer data for editing.",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchScammerData();
  }, [id, isEditMode, form]);
  
  const onSubmit = async (data: ReportFormValues) => {
    if (!profile?.wallet_address) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to report a scammer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setUploadError(null);
    
    try {
      let photoUrl = data.photo_url;
      
      // Handle photo upload
      if (photoFile) {
        try {
          const newPhotoUrl = await uploadScammerPhoto(photoFile);
          if (newPhotoUrl) {
            photoUrl = newPhotoUrl;
            // Update the form data with the new photo URL
            form.setValue('photo_url', photoUrl);
            // Update the photo preview with the new URL
            setPhotoPreview(photoUrl);
          } else {
            throw new Error("Failed to get photo URL after upload");
          }
        } catch (uploadErr) {
          setUploadError("Failed to upload photo. Please try again or skip adding a photo.");
          throw uploadErr;
        }
      } else if (isEditMode) {
        // In edit mode, if no new photo is uploaded, keep the existing photo URL
        photoUrl = photoPreview || data.photo_url;
      }
      
      let scammerId;
      
      if (isEditMode && id) {
        // Get the latest form data after photo URL update
        const formData = form.getValues();
        // Update the form data with the final photo URL
        formData.photo_url = photoUrl;
        // Pass only the formData to updateScammerReport
        scammerId = await updateScammerReport(id, formData);
        
        // Invalidate relevant queries to refresh the data instantly
        await queryClient.invalidateQueries({
          queryKey: ['scammer', scammerId]
        });
        await queryClient.invalidateQueries({
          queryKey: ['comments', scammerId]
        });
        await queryClient.invalidateQueries({
          queryKey: ['bountyContributions', scammerId]
        });
        
        toast({
          title: "Scammer updated",
          description: "The scammer report has been updated successfully.",
        });
      } else {
        // For new reports, ensure photo_url is included
        data.photo_url = photoUrl;
        scammerId = await createScammerReport(data, photoUrl, profile);
        
        toast({
          title: "Scammer reported",
          description: "Your report has been submitted successfully.",
        });
      }
      
      navigate(`/scammer/${scammerId}`);
    } catch (error) {
      console.error('Error submitting scammer report:', error);
      
      // Use a more specific error message if we have one
      const errorMessage = uploadError || 
        (error instanceof Error ? error.message : "There was an error submitting your report. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Failed to submit report",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isEditMode,
    isSubmitting,
    isLoading,
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    uploadError,
    onSubmit
  };
};
