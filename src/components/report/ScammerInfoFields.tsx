
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DynamicFieldArray from './DynamicFieldArray';
import ScammerPhotoUpload from './ScammerPhotoUpload';
import { Separator } from '@/components/ui/separator';

interface ScammerInfoFieldsProps {
  form: any;
  photoFile: File | null;
  setPhotoFile: (file: File | null) => void;
  photoPreview: string;
  setPhotoPreview: (url: string) => void;
}

const ScammerInfoFields = ({
  form,
  photoFile,
  setPhotoFile,
  photoPreview,
  setPhotoPreview
}: ScammerInfoFieldsProps) => {
  const { control } = form;
  const { errors } = form.formState;
  
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
                className="min-h-120"
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
      
      {/* Photo upload section after description */}
      <div className="my-4">
        <FormLabel>Scammer's Photo</FormLabel>
        <ScammerPhotoUpload 
          photoFile={photoFile}
          setPhotoFile={setPhotoFile}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setValue={form.setValue}
          control={control}
        />
      </div>
      
      <Separator className="my-6" />
      
      {/* Dynamic form arrays */}
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
      
      {/* Add Official Response field */}
      <FormField
        control={control}
        name="official_response"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Official Response</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Official response from the accused (if available)..." 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Add any official response or statement from the accused party.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ScammerInfoFields;
