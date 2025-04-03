
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control, FieldErrors } from 'react-hook-form';

interface ScammerInfoFieldsProps {
  control: Control<any>;
  errors: FieldErrors;
}

const ScammerInfoFields = ({ control, errors }: ScammerInfoFieldsProps) => {
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
    </>
  );
};

export default ScammerInfoFields;
