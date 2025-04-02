
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
      <div className="flex justify-between items-center">
        <FormLabel>{label}</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addField}
        >
          <Plus className="h-4 w-4 mr-1" /> Add {label}
        </Button>
      </div>
      
      {fieldValues.map((_, index) => (
        <div key={`${name}-${index}`} className="flex gap-2 items-center">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1 mb-0">
                <FormControl>
                  <Input placeholder={`Enter ${label.toLowerCase()}`} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => removeField(index)}
            disabled={fieldValues.length <= 1}
          >
            <Trash className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DynamicFieldArray;
