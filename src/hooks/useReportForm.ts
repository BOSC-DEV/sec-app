import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  uploadScammerPhoto, 
  updateScammerReport, 
  createScammerReport, 
  fetchScammerById 
} from '@/services/reportService';
import { verifyTurnstileToken, submitReportWithVerification } from '@/services/turnstileService';

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
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  
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
  
  // Handle Turnstile verification
  const handleTurnstileVerify = async (token: string) => {
    console.log("Turnstile verification callback with token length:", token.length);
    setTurnstileToken(token);
    
    if (token.length > 0) {
      const isVerified = await verifyTurnstileToken(token);
      setIsTurnstileVerified(isVerified);
      
      if (isVerified) {
        toast({
          title: "Verification complete",
          description: "You can now submit your report",
        });
      }
    } else {
      setIsTurnstileVerified(false);
    }
  };
  
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
    
    // For new submissions, verify Turnstile using server-side verification
    if (!isEditMode) {
      if (!isTurnstileVerified) {
        const isVerified = await verifyTurnstileToken(turnstileToken);
        if (!isVerified) {
          console.log("Turnstile verification failed in submission");
          return;
        }
      }
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
        // For new reports, use our rate-limited submission process
        const submissionSuccess = await submitReportWithVerification(
          { ...data, photo_url: photoUrl },
          turnstileToken,
          profile.wallet_address
        );
        
        if (!submissionSuccess) {
          throw new Error("Report submission failed");
        }
        
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
    onSubmit,
    turnstileToken,
    handleTurnstileVerify,
    isTurnstileVerified
  };
};
