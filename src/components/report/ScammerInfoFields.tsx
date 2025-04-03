
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import DynamicFieldArray from './DynamicFieldArray';
import ScammerPhotoUpload from './ScammerPhotoUpload';
import { Separator } from '@/components/ui/separator';

interface ScammerInfoFieldsProps {
  form: UseFormReturn<any>;
  photoFile: File | null;
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
  photoPreview: string;
  setPhotoPreview: React.Dispatch<React.SetStateAction<string>>;
}

const ScammerInfoFields = ({
  form,
  photoFile,
  setPhotoFile,
  photoPreview,
  setPhotoPreview
}: ScammerInfoFieldsProps) => {
  const { control, formState: { errors } } = form;
  
  return (
    <>
      <FormField
        control={control}
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
        control={control}
        name="accused_of"
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
      
      {/* Photo upload section now directly after scam description */}
      <div className="my-4">
        <FormLabel>Scammer's Photo</FormLabel>
        <ScammerPhotoUpload 
          photoFile={photoFile}
          setPhotoFile={setPhotoFile}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setValue={form.setValue}
          control={form.control}
        />
      </div>
      
      <Separator className="my-6" />
      
      {/* Dynamic form arrays for wallet addresses, aliases, links, and accomplices */}
      <DynamicFieldArray 
        name="wallet_addresses" 
        label="Wallet Addresses" 
        control={control} 
        errors={errors} 
        setValue={form.setValue} 
      />
      
      <DynamicFieldArray 
        name="aliases" 
        label="Known Aliases" 
        control={control} 
        errors={errors} 
        setValue={form.setValue} 
      />
      
      <DynamicFieldArray 
        name="links" 
        label="Related Links" 
        control={control} 
        errors={errors} 
        setValue={form.setValue} 
      />
      
      <DynamicFieldArray 
        name="accomplices" 
        label="Known Accomplices" 
        control={control} 
        errors={errors} 
        setValue={form.setValue} 
      />
    </>
  );
};

export default ScammerInfoFields;
