import React, { useState, useCallback, memo } from 'react';
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
  isEditMode?: boolean;
}

/**
 * ScammerPhotoUpload component allows users to upload a photo of a scammer.
 * It handles file validation, preview generation, and form integration.
 * 
 * @param photoPreview - Current photo preview URL or base64 string
 * @param setPhotoPreview - Function to update the photo preview
 * @param photoFile - Current photo file object
 * @param setPhotoFile - Function to update the photo file
 * @param setValue - Optional React Hook Form setValue function
 * @param control - Optional React Hook Form control object
 * @param isEditMode - Optional boolean indicating if the component is in edit mode
 * @returns A component for uploading and previewing scammer photos
 */
const ScammerPhotoUpload = ({
  photoPreview,
  setPhotoPreview,
  photoFile,
  setPhotoFile,
  setValue,
  control,
  isEditMode = false
}: ScammerPhotoUploadProps) => {
  const {
    toast
  } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handlePhotoClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    setPhotoFile(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setPhotoPreview(preview);
    };
    reader.readAsDataURL(file);
  }, [setPhotoFile, setPhotoPreview, toast]);
  return <div className="photo-upload-container" role="region" aria-label="Photo upload section">
      <div className="flex items-center gap-x-3 my-[10px] py-[10px]">
        <PhotoPreview photoPreview={photoPreview} onClick={handlePhotoClick} />
        {isEditMode && (
          <Button type="button" variant="outline" size="sm" onClick={handlePhotoClick} aria-label={photoPreview ? "Change the uploaded photo" : "Upload a new photo"}>
            {photoPreview ? 'Change Photo' : 'Upload Photo'}
          </Button>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} aria-label="Upload photo" aria-hidden="true" tabIndex={-1} />
      </div>
      <FormDescription className="mt-1">
        Upload a photo of the scammer, if available.
      </FormDescription>
    </div>;
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ScammerPhotoUpload);