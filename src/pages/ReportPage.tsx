
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Hero from '@/components/common/Hero';
import { Button } from '@/components/ui/button';
import { Trash, Plus, Upload, Image } from 'lucide-react';
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
import { uploadScammerPhoto } from '@/services/profileService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setPhotoFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addField = (fieldName: 'walletAddresses' | 'links' | 'aliases') => {
    const currentValues = form.getValues(fieldName);
    form.setValue(fieldName, [...currentValues, '']);
  };

  const removeField = (fieldName: 'walletAddresses' | 'links' | 'aliases', index: number) => {
    const currentValues = form.getValues(fieldName);
    if (currentValues.length > 1) {
      form.setValue(
        fieldName,
        currentValues.filter((_, i) => i !== index)
      );
    }
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
              
              <FormItem>
                <FormLabel>Scammer's Photo</FormLabel>
                <div className="mt-2 flex items-center gap-x-3">
                  <div 
                    onClick={handlePhotoClick}
                    className="relative group cursor-pointer"
                  >
                    <Avatar className="h-20 w-20 border border-gray-200">
                      {photoPreview ? (
                        <AvatarImage src={photoPreview} alt="Preview" />
                      ) : (
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                          <Image className="h-8 w-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handlePhotoClick}
                  >
                    {photoFile ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <FormDescription>
                  Upload a photo of the scammer, if available.
                </FormDescription>
              </FormItem>
              
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
              
              {/* Wallet Addresses */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Wallet Addresses</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addField('walletAddresses')}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Address
                  </Button>
                </div>
                {form.getValues('walletAddresses').map((_, index) => (
                  <div key={`wallet-${index}`} className="flex gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`walletAddresses.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeField('walletAddresses', index)}
                      disabled={form.getValues('walletAddresses').length <= 1}
                    >
                      <Trash className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
                <FormDescription>
                  Crypto wallet(s) used in the scam, if known.
                </FormDescription>
              </div>
              
              {/* Links */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Related Links</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addField('links')}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Link
                  </Button>
                </div>
                {form.getValues('links').map((_, index) => (
                  <div key={`link-${index}`} className="flex gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`links.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeField('links', index)}
                      disabled={form.getValues('links').length <= 1}
                    >
                      <Trash className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
                <FormDescription>
                  Websites, social media profiles, etc.
                </FormDescription>
              </div>
              
              {/* Aliases */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Known Aliases</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addField('aliases')}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Alias
                  </Button>
                </div>
                {form.getValues('aliases').map((_, index) => (
                  <div key={`alias-${index}`} className="flex gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`aliases.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Other name they go by" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeField('aliases', index)}
                      disabled={form.getValues('aliases').length <= 1}
                    >
                      <Trash className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
                <FormDescription>
                  Other names they go by.
                </FormDescription>
              </div>
              
              {/* Accomplices */}
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
