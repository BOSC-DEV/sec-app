
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Hero from '@/components/common/Hero';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Scammer's name must be at least 2 characters.",
  }),
  accusedOf: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  walletAddress: z.string().optional(),
  photoUrl: z.string().url({
    message: "Please enter a valid URL for the photo.",
  }).optional().or(z.literal('')),
  links: z.string().optional(),
  aliases: z.string().optional(),
  accomplices: z.string().optional(),
  bountyAmount: z.coerce.number().min(0).default(0),
});

type FormValues = z.infer<typeof formSchema>;

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      accusedOf: '',
      walletAddress: '',
      photoUrl: '',
      links: '',
      aliases: '',
      accomplices: '',
      bountyAmount: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // This is a placeholder for the actual submission logic
    // In a real implementation, this would connect to Supabase
    try {
      // Convert comma-separated strings to arrays
      const formattedValues = {
        ...values,
        links: values.links ? values.links.split(',').map(item => item.trim()) : [],
        aliases: values.aliases ? values.aliases.split(',').map(item => item.trim()) : [],
        accomplices: values.accomplices ? values.accomplices.split(',').map(item => item.trim()) : [],
      };
      
      console.log('Submitting scammer report:', formattedValues);
      
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scammer's Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the scammer's name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name or handle the scammer is known by.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accusedOf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Scam*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what they did in detail..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible about the scam.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Crypto wallet(s) used in the scam, if known.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Link to a photo of the scammer, if available.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="links"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Links</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com, https://another.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Websites, social media profiles, etc. (comma-separated).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="aliases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Aliases</FormLabel>
                      <FormControl>
                        <Input placeholder="Alias 1, Alias 2" {...field} />
                      </FormControl>
                      <FormDescription>
                        Other names they go by (comma-separated).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accomplices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Accomplices</FormLabel>
                      <FormControl>
                        <Input placeholder="Name 1, Name 2" {...field} />
                      </FormControl>
                      <FormDescription>
                        Others involved in the scam (comma-separated).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bountyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bounty Amount (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional bounty for catching this scammer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
