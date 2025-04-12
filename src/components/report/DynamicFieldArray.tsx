
import React from 'react';
import { Control, FieldErrors, UseFormSetValue, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Plus, Trash } from 'lucide-react';

interface DynamicFieldArrayProps {
  name: string;
  label: string;
  control: Control<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
}

const DynamicFieldArray = ({
  name,
  label,
  control,
  errors,
  setValue,
}: DynamicFieldArrayProps) => {
  const fieldValues = useWatch({ control, name }) || [''];
  
  const addField = () => {
    setValue(name, [...fieldValues, '']);
  };

  const removeField = (index: number) => {
    if (fieldValues.length > 1) {
      setValue(
        name,
        fieldValues.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="space-y-4 mb-4">
      <FormLabel>{label}</FormLabel>
      
      {fieldValues.map((_, index) => (
        <div key={`${name}-${index}`} className="space-y-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={`Enter ${label.toLowerCase()}`} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => removeField(index)}
              disabled={fieldValues.length <= 1}
              className="text-xs"
            >
              <Trash className="h-3 w-3 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={addField}
        className="w-full mt-2"
      >
        <Plus className="h-4 w-4 mr-1" /> 
        {name === 'wallet_addresses' ? 'Add Address' : `Add ${label}`}
      </Button>
    </div>
  );
};

export default DynamicFieldArray;

