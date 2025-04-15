import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DynamicFieldArray from './DynamicFieldArray';
import ScammerPhotoUpload from './ScammerPhotoUpload';
import { Separator } from '@/components/ui/separator';
import ScammerSearchDropdown from './ScammerSearchDropdown';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useNavigate } from 'react-router-dom';
import { Scammer } from '@/types/dataTypes';

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
  const { control, watch } = form;
  const navigate = useNavigate();
  const scammerName = watch('name');
  const debouncedName = useDebouncedValue(scammerName, 300);
  
  const handleScammerSelect = (scammer: Scammer) => {
    navigate(`/scammer/${scammer.id}`);
  };

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>Scammer's Name*</FormLabel>
            <FormControl>
              <Input placeholder="Enter the scammer's name" {...field} />
            </FormControl>
            {scammerName && (
              <ScammerSearchDropdown
                searchTerm={debouncedName}
                onScammerSelect={handleScammerSelect}
              />
            )}
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
      
      <DynamicFieldArray 
        name="wallet_addresses" 
        label="Wallet Addresses" 
        control={control} 
        errors={form.formState.errors} 
        setValue={form.setValue} 
      />
      
      <DynamicFieldArray 
        name="aliases" 
        label="Known Aliases" 
        control={control} 
        errors={form.formState.errors} 
        setValue={form.setValue} 
      />
      
      <DynamicFieldArray 
        name="links" 
        label="Related Links" 
        control={control} 
        errors={form.formState.errors} 
        setValue={form.setValue} 
      />
      
      <DynamicFieldArray 
        name="accomplices" 
        label="Known Accomplices" 
        control={control} 
        errors={form.formState.errors} 
        setValue={form.setValue} 
      />
      
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
