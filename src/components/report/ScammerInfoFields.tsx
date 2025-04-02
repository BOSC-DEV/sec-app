
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import ScammerPhotoUpload from './ScammerPhotoUpload';

interface ScammerInfoFieldsProps {
  form: UseFormReturn<any>;
  photoPreview: string | null;
  onPhotoChange: (file: File) => void;
}

const ScammerInfoFields = ({ form, photoPreview, onPhotoChange }: ScammerInfoFieldsProps) => {
  return (
    <>
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
      
      <ScammerPhotoUpload 
        photoPreview={photoPreview}
        onPhotoChange={onPhotoChange}
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
    </>
  );
};

export default ScammerInfoFields;
