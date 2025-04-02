
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import Hero from '@/components/common/Hero';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { uploadScammerPhoto } from '@/services/profileService';
import DynamicFieldArray from '@/components/report/DynamicFieldArray';
import ScammerInfoFields from '@/components/report/ScammerInfoFields';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Scammer's name must be at least 2 characters.",
  }),
  accusedOf: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  walletAddresses: z.array(z.string()),
  photoUrl: z.string().optional(),
  links: z.array(z.string()),
  aliases: z.array(z.string()),
  accomplices: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams(); // For edit mode
  const { profile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      accusedOf: '',
      walletAddresses: [''],
      photoUrl: '',
      links: [''],
      aliases: [''],
      accomplices: [''],
    },
  });

  // Fetch scammer data if in edit mode
  useEffect(() => {
    const fetchScammerData = async () => {
      if (id) {
        setIsEditMode(true);
        try {
          const { data, error } = await supabase
            .from('scammers')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Check if current user is the creator of this report
            if (profile?.wallet_address !== data.added_by) {
              toast({
                variant: "destructive",
                title: "Access denied",
                description: "You can only edit reports you created.",
              });
              navigate('/most-wanted');
              return;
            }
            
            form.reset({
              name: data.name,
              accusedOf: data.accused_of || '',
              walletAddresses: data.wallet_address ? [data.wallet_address] : [''],
              photoUrl: data.photo_url || '',
              links: data.links?.length ? data.links : [''],
              aliases: data.aliases?.length ? data.aliases : [''],
              accomplices: data.accomplices?.length ? data.accomplices : [''],
            });
            
            if (data.photo_url) {
              setPhotoPreview(data.photo_url);
            }
          }
        } catch (error) {
          console.error('Error fetching scammer data:', error);
          toast({
            variant: "destructive",
            title: "Error loading report",
            description: "Could not load the scammer report for editing.",
          });
        }
      }
    };
    
    fetchScammerData();
  }, [id, form, navigate, toast, profile?.wallet_address]);

  const handlePhotoChange = (file: File) => {
    setPhotoFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (!profile?.wallet_address) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to submit a report.",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Upload photo if there is one
      let photoUrl = values.photoUrl;
      if (photoFile) {
        const uploadedUrl = await uploadScammerPhoto(photoFile);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }
      
      // Filter out empty entries
      const filteredWalletAddresses = values.walletAddresses.filter(address => address.trim() !== '');
      const filteredLinks = values.links.filter(link => link.trim() !== '');
      const filteredAliases = values.aliases.filter(alias => alias.trim() !== '');
      const filteredAccomplices = values.accomplices.filter(accomplice => accomplice.trim() !== '');
      
      const scammerData = {
        name: values.name,
        accused_of: values.accusedOf,
        photo_url: photoUrl,
        wallet_address: filteredWalletAddresses.length > 0 ? filteredWalletAddresses[0] : null,
        links: filteredLinks,
        aliases: filteredAliases,
        accomplices: filteredAccomplices,
        added_by: profile.wallet_address,
      };
      
      console.log('Submitting scammer report:', scammerData);
      
      let result;
      
      if (isEditMode && id) {
        // Update existing scammer
        result = await supabase
          .from('scammers')
          .update(scammerData)
          .eq('id', id)
          .select();
          
        toast({
          title: "Report updated",
          description: "Your scammer report has been updated successfully.",
        });
      } else {
        // Insert new scammer
        const scammerId = `scammer-${Date.now()}`;
        result = await supabase
          .from('scammers')
          .insert({
            id: scammerId,
            ...scammerData,
          })
          .select();
          
        toast({
          title: "Report submitted",
          description: "Your scammer report has been submitted successfully.",
        });
      }
      
      if (result.error) throw result.error;
      
      // Redirect to the scammer detail page
      if (result.data && result.data.length > 0) {
        navigate(`/scammer/${result.data[0].id}`);
      } else {
        navigate('/most-wanted');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Hero
        title={isEditMode ? "Edit Scammer Report" : "Report a Scammer"}
        subtitle="Help the community by reporting cryptocurrency scammers and fraudsters."
        showCta={false}
      />
      
      <section className="icc-section bg-white">
        <div className="icc-container max-w-3xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ScammerInfoFields 
                form={form} 
                photoPreview={photoPreview}
                onPhotoChange={handlePhotoChange}
              />
              
              <DynamicFieldArray
                form={form}
                fieldName="aliases"
                label="Known Aliases"
                placeholder="Other name they go by"
                description="Other names they go by."
                buttonLabel="Add Alias"
              />
              
              <DynamicFieldArray
                form={form}
                fieldName="accomplices"
                label="Known Accomplices"
                placeholder="Name of accomplice"
                description="Others involved in the scam."
                buttonLabel="Add Accomplice"
              />
              
              <DynamicFieldArray
                form={form}
                fieldName="walletAddresses"
                label="Wallet Addresses"
                placeholder="0x..."
                description="Crypto wallet(s) used in the scam, if known."
                buttonLabel="Add Address"
              />
              
              <DynamicFieldArray
                form={form}
                fieldName="links"
                label="Related Links"
                placeholder="https://example.com"
                description="Websites, social media profiles, etc."
                buttonLabel="Add Link"
              />
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/most-wanted')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Report' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
