import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Hero from '@/components/common/Hero';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { uploadScammerPhoto } from '@/services/profileService';
import DynamicFieldArray from '@/components/report/DynamicFieldArray';
import ScammerInfoFields from '@/components/report/ScammerInfoFields';

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
  accomplices: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      accusedOf: '',
      walletAddresses: [''],
      photoUrl: '',
      links: [''],
      aliases: [''],
      accomplices: '',
    },
  });

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
      // Upload photo if there is one
      let photoUrl = '';
      if (photoFile) {
        const uploadedUrl = await uploadScammerPhoto(photoFile);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }
      
      // Filter out empty entries
      const filteredValues = {
        ...values,
        photoUrl,
        walletAddresses: values.walletAddresses.filter(address => address.trim() !== ''),
        links: values.links.filter(link => link.trim() !== ''),
        aliases: values.aliases.filter(alias => alias.trim() !== ''),
      };
      
      console.log('Submitting scammer report:', filteredValues);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Report submitted",
        description: "Your scammer report has been submitted successfully.",
      });
      
      // Redirect to home page after successful submission
      navigate('/most-wanted');
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
        title="Report a Scammer"
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
              
              <DynamicFieldArray
                form={form}
                fieldName="aliases"
                label="Known Aliases"
                placeholder="Other name they go by"
                description="Other names they go by."
                buttonLabel="Add Alias"
              />
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/most-wanted')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
