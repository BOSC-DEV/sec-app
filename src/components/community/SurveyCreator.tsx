
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MAX_SURVEY_OPTIONS, validateSurvey } from '@/utils/adminUtils';
import { toast } from '@/hooks/use-toast';

interface SurveyCreatorProps {
  onCreateSurvey: (title: string, options: string[]) => void;
  isSubmitting: boolean;
}

const SurveyCreator: React.FC<SurveyCreatorProps> = ({ 
  onCreateSurvey, 
  isSubmitting 
}) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  
  const addOption = () => {
    if (options.length < MAX_SURVEY_OPTIONS) {
      setOptions([...options, '']);
    } else {
      toast({
        title: "Maximum options reached",
        description: `You can have at most ${MAX_SURVEY_OPTIONS} options`,
        variant: "destructive",
      });
    }
  };
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    } else {
      toast({
        title: "Minimum options required",
        description: "A survey must have at least 2 options",
        variant: "destructive",
      });
    }
  };
  
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = () => {
    const validation = validateSurvey(title, options);
    if (!validation.valid) {
      toast({
        title: "Invalid survey",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    
    onCreateSurvey(title, options);
    
    // Reset form after submission
    setTitle('');
    setOptions(['', '']);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-medium">Create Survey</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="survey-title">Survey Title</Label>
            <Input
              id="survey-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your survey question"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Options (2-{MAX_SURVEY_OPTIONS})</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {options.length < MAX_SURVEY_OPTIONS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Survey"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyCreator;
