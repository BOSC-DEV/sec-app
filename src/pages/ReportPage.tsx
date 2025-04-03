import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import ScammerInfoFields from '@/components/report/ScammerInfoFields';
import DynamicFieldArray from '@/components/report/DynamicFieldArray';
import ScammerPhotoUpload from '@/components/report/ScammerPhotoUpload';
import CompactHero from '@/components/common/CompactHero';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { generateScammerId } from '@/services/supabaseService';
import { handleError } from '@/utils/errorHandling';
import FallbackUI from '@/components/common/FallbackUI';

const reportSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  accused_of: z.string().optional(),
  wallet_addresses: z.array(z.string()).optional(),
  photo_url: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  accomplices: z.array(z.string()).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
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
  
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  const { data: scammer, isLoading: isLoadingScammer, error: scammerError } = useQuery({
    queryKey: ['edit-scammer', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('scammers')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (scammer) {
      setIsEditMode(true);
      
      reset({
        name: scammer.name || '',
        accused_of: scammer.accused_of || '',
        wallet_addresses: scammer.wallet_addresses?.length ? scammer.wallet_addresses : [''],
        photo_url: scammer.photo_url || '',
        aliases: scammer.aliases?.length ? scammer.aliases : [''],
        links: scammer.links?.length ? scammer.links : [''],
        accomplices: scammer.accomplices?.length ? scammer.accomplices : [''],
      });
      
      if (scammer.photo_url) {
        setPhotoPreview(scammer.photo_url);
      }
    }
  }, [scammer, reset]);

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
          const fileName = `scammer_photos/${Date.now()}_${photoFile.name}`;
          
          // Log the upload attempt
          console.log("Uploading file to bucket 'media':", fileName);
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, photoFile);
            
          if (uploadError) {
            console.error("Photo upload error:", uploadError);
            setUploadError(`Failed to upload photo: ${uploadError.message}`);
            throw new Error(`Photo upload failed: ${uploadError.message}`);
          }
          
          console.log("File uploaded successfully, getting public URL");
          
          const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);
            
          photoUrl = publicUrlData.publicUrl;
          console.log("Generated public URL:", photoUrl);
        } catch (uploadErr) {
          console.error("Photo upload exception:", uploadErr);
          setUploadError("Failed to upload photo. Please try again or skip adding a photo.");
          throw uploadErr;
        }
      }
      
      const aliases = data.aliases?.filter(item => item !== '') || [];
      const links = data.links?.filter(item => item !== '') || [];
      const accomplices = data.accomplices?.filter(item => item !== '') || [];
      const wallet_addresses = data.wallet_addresses?.filter(item => item !== '') || [];
      
      if (isEditMode && id) {
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
        
        toast({
          title: "Scammer updated",
          description: "The scammer report has been updated successfully.",
        });
        
        navigate(`/scammer/${id}`);
      } else {
        console.log("Creating new scammer report");
        
        try {
          const newId = await generateScammerId();
          console.log("Generated new scammer ID:", newId);
          
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
              toast({
                title: "Duplicate report",
                description: "This scammer has already been reported. Please try with different information.",
                variant: "destructive"
              });
            } else {
              throw error;
            }
            return;
          }
          
          toast({
            title: "Scammer reported",
            description: "Your report has been submitted successfully.",
          });
          
          navigate(`/scammer/${newId}`);
        } catch (idError) {
          console.error("ID generation or insertion error:", idError);
          toast({
            title: "Failed to submit report",
            description: "There was an error creating your report. Please try again.",
            variant: "destructive"
          });
        }
      }
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

  if (scammerError) {
    return (
      <FallbackUI 
        title="Error Loading Scammer Data"
        message="We couldn't load the scammer information. Please try again."
        onRetry={() => window.location.reload()}
        variant="error"
      />
    );
  }

  return (
    <>
      <CompactHero 
        title={isEditMode ? "Edit Scammer Report" : "Report a Scammer"} 
        subtitle={isEditMode ? "Update scammer details to help keep the community informed" : "Fill out the form below to report a scammer to the $SEC database"} 
      />
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? "Edit Scammer Report" : "Report a Scammer"}</CardTitle>
            <CardDescription>
              {isEditMode ? "Update the scammer's information." : "Fill out the form below to report a scammer."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} id="report-form" className="space-y-6">
                <div className="space-y-6">
                  <ScammerInfoFields control={control} errors={errors} />

                  <DynamicFieldArray
                    name="wallet_addresses"
                    label="Wallet Addresses"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <DynamicFieldArray
                    name="aliases"
                    label="Aliases"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <DynamicFieldArray
                    name="links"
                    label="Links"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <DynamicFieldArray
                    name="accomplices"
                    label="Accomplices"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <ScammerPhotoUpload
                    photoPreview={photoPreview}
                    setPhotoPreview={setPhotoPreview}
                    photoFile={photoFile}
                    setPhotoFile={setPhotoFile}
                    setValue={setValue}
                    control={control}
                  />
                  
                  {uploadError && (
                    <div className="text-red-500 text-sm mt-2">
                      {uploadError}
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button form="report-form" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Report" : "Submit Report"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ReportPage;
