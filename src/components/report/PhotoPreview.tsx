
import React, { memo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image, Upload } from 'lucide-react';

interface PhotoPreviewProps {
  photoPreview: string;
  onClick: () => void;
}

/**
 * PhotoPreview component displays an avatar with preview image or a placeholder.
 * It shows an upload icon on hover and handles click events.
 * 
 * @param photoPreview - URL or base64 string of the image to display
 * @param onClick - Function to call when the component is clicked
 * @returns A component that displays the photo preview with hover effects
 */
const PhotoPreview = ({ photoPreview, onClick }: PhotoPreviewProps) => {
  return (
    <div 
      onClick={onClick}
      className="relative group cursor-pointer"
      role="button"
      aria-label={photoPreview ? "Change photo" : "Upload photo"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Avatar className="h-20 w-20 border border-gray-200">
        {photoPreview ? (
          <AvatarImage src={photoPreview} alt="Preview" />
        ) : (
          <AvatarFallback className="bg-gray-100 text-gray-400">
            <Image className="h-8 w-8" data-testid="fallback-icon" />
          </AvatarFallback>
        )}
      </Avatar>
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <Upload className="h-6 w-6 text-white" data-testid="upload-icon" />
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PhotoPreview);
