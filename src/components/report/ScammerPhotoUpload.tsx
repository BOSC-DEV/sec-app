
import React, { useState } from 'react';
import { FormDescription } from '@/components/ui/form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

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
        <div 
          onClick={handlePhotoClick}
          className="relative group cursor-pointer"
        >
          <Avatar className="h-20 w-20 border border-gray-200">
            {photoPreview ? (
              <AvatarImage src={photoPreview} alt="Preview" />
            ) : (
              <AvatarFallback className="bg-gray-100 text-gray-400">
                <Image className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>
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
        />
      </div>
      <FormDescription className="mt-1">
        Upload a photo of the scammer, if available.
      </FormDescription>
    </div>
  );
};

export default ScammerPhotoUpload;
