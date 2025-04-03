
import React, { useState } from 'react';
import { FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Control, UseFormSetValue } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import PhotoPreview from './PhotoPreview';

interface ScammerPhotoUploadProps {
  photoPreview: string;
  setPhotoPreview: React.Dispatch<React.SetStateAction<string>>;
  photoFile: File | null;
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
  setValue?: UseFormSetValue<any>;
  control?: Control<any>;
}

const ScammerPhotoUpload = ({
  photoPreview,
  setPhotoPreview,
  photoFile,
  setPhotoFile,
  setValue,
  control,
}: ScammerPhotoUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setPhotoFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setPhotoPreview(preview);
      if (setValue) {
        setValue('photo_url', preview);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center gap-x-3">
        <PhotoPreview photoPreview={photoPreview} onClick={handlePhotoClick} />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handlePhotoClick}
        >
          {photoPreview ? 'Change Photo' : 'Upload Photo'}
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload photo"
        />
      </div>
      <FormDescription className="mt-1">
        Upload a photo of the scammer, if available.
      </FormDescription>
    </div>
  );
};

export default ScammerPhotoUpload;
