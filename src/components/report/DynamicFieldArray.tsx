
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Plus, Trash } from 'lucide-react';

interface DynamicFieldArrayProps {
  form: UseFormReturn<any>;
  fieldName: 'walletAddresses' | 'links' | 'aliases';
  label: string;
  placeholder: string;
  description: string;
  buttonLabel: string;
}

const DynamicFieldArray = ({
  form,
  fieldName,
  label,
  placeholder,
  description,
  buttonLabel,
}: DynamicFieldArrayProps) => {
  const addField = () => {
    const currentValues = form.getValues(fieldName);
    form.setValue(fieldName, [...currentValues, '']);
  };

  const removeField = (index: number) => {
    const currentValues = form.getValues(fieldName);
    if (currentValues.length > 1) {
      form.setValue(
        fieldName,
        currentValues.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <FormLabel>{label}</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addField}
        >
          <Plus className="h-4 w-4 mr-1" /> {buttonLabel}
        </Button>
      </div>
      {form.getValues(fieldName).map((_, index) => (
        <div key={`${fieldName}-${index}`} className="flex gap-2 mb-2">
          <FormField
            control={form.control}
            name={`${fieldName}.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={placeholder} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => removeField(index)}
            disabled={form.getValues(fieldName).length <= 1}
          >
            <Trash className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      ))}
      <FormDescription>
        {description}
      </FormDescription>
    </div>
  );
};

export default DynamicFieldArray;
