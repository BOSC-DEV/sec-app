
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { uploadScammerPhoto, updateScammerReport, createScammerReport } from '@/services/reportService';

// Validation schema for the report form
export const reportSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  accused_of: z.string().optional(),
  wallet_addresses: z.array(z.string()).optional(),
  photo_url: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  accomplices: z.array(z.string()).optional(),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

export const useReportForm = (id?: string) => {
  const navigate = useNavigate();
  const [isEditMode] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    }
  });
  
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
      
      if (photoFile) {
        try {
          photoUrl = await uploadScammerPhoto(photoFile);
          console.log("Generated public URL:", photoUrl);
        } catch (uploadErr) {
          setUploadError("Failed to upload photo. Please try again or skip adding a photo.");
          throw uploadErr;
        }
      }
      
      let scammerId;
      
      if (isEditMode && id) {
        scammerId = await updateScammerReport(id, data, photoUrl);
        
        toast({
          title: "Scammer updated",
          description: "The scammer report has been updated successfully.",
        });
      } else {
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
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    uploadError,
    onSubmit
  };
};
