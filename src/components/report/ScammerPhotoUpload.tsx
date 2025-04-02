
import React, { useRef, useState } from 'react';
import { FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScammerPhotoUploadProps {
  photoPreview: string | null;
  onPhotoChange: (file: File) => void;
}

const ScammerPhotoUpload = ({
  photoPreview,
  onPhotoChange,
}: ScammerPhotoUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    onPhotoChange(file);
  };

  return (
    <FormItem>
      <FormLabel>Scammer's Photo</FormLabel>
      <div className="mt-2 flex items-center gap-x-3">
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
      <FormDescription>
        Upload a photo of the scammer, if available.
      </FormDescription>
    </FormItem>
  );
};

export default ScammerPhotoUpload;
