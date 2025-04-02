import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScammerInfoFields from '@/components/report/ScammerInfoFields';
import DynamicFieldArray from '@/components/report/DynamicFieldArray';
import ScammerPhotoUpload from '@/components/report/ScammerPhotoUpload';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { generateScammerId } from '@/services/supabaseService';

const reportSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  accused_of: z.string().optional(),
  wallet_address: z.string().optional(),
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
  
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: '',
      accused_of: '',
      wallet_address: '',
      photo_url: '',
      aliases: [''],
      links: [''],
      accomplices: [''],
    }
  });

  const { data: scammer, isLoading: isLoadingScammer } = useQuery({
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
        wallet_address: scammer.wallet_address || '',
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
    
    try {
      let photoUrl = data.photo_url;
      
      if (photoFile) {
        const fileName = `scammer_photos/${Date.now()}_${photoFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, photoFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
          
        photoUrl = publicUrlData.publicUrl;
      }
      
      const aliases = data.aliases?.filter(item => item !== '') || [];
      const links = data.links?.filter(item => item !== '') || [];
      const accomplices = data.accomplices?.filter(item => item !== '') || [];
      
      if (isEditMode && id) {
        const { error } = await supabase
          .from('scammers')
          .update({
            name: data.name,
            accused_of: data.accused_of,
            wallet_address: data.wallet_address,
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
        const newId = await generateScammerId();
        
        const { error } = await supabase
          .from('scammers')
          .insert({
            id: newId,
            name: data.name,
            accused_of: data.accused_of,
            wallet_address: data.wallet_address,
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
          
        if (error) throw error;
        
        toast({
          title: "Scammer reported",
          description: "Your report has been submitted successfully.",
        });
        
        navigate(`/scammer/${newId}`);
      }
    } catch (error) {
      console.error('Error submitting scammer report:', error);
      toast({
        variant: "destructive",
        title: "Failed to submit report",
        description: "There was an error submitting your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Scammer Report" : "Report a Scammer"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update the scammer's information." : "Fill out the form below to report a scammer."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <ScammerInfoFields control={control} errors={errors} />
            </TabsContent>
            <TabsContent value="details">
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
            </TabsContent>
            <TabsContent value="media">
              <ScammerPhotoUpload
                photoPreview={photoPreview}
                setPhotoPreview={setPhotoPreview}
                photoFile={photoFile}
                setPhotoFile={setPhotoFile}
                setValue={setValue}
                control={control}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {isSubmitting ? "Submitting..." : isEditMode ? "Update Report" : "Submit Report"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportPage;
