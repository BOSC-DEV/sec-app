
import React, { KeyboardEvent } from 'react';
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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, isLastField: boolean) => {
    if (event.key === 'Enter' && isLastField) {
      event.preventDefault();
      addField();
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
                  <Input 
                    placeholder={`Enter ${label.toLowerCase()}`} 
                    {...field} 
                    onKeyDown={(e) => handleKeyDown(e, index === fieldValues.length - 1)}
                  />
                </FormControl>
                <div className="flex justify-between mt-2">
                  {index === fieldValues.length - 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addField}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> 
                      {name === 'wallet_addresses' ? 'Add Address' : `Add ${label}`}
                    </Button>
                  )}
                  <div className="flex justify-end flex-grow">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeField(index)}
                      disabled={fieldValues.length <= 1}
                      className="text-xs ml-auto"
                    >
                      <Trash className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default DynamicFieldArray;
