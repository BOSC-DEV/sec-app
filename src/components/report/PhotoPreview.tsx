
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image, Upload } from 'lucide-react';

interface PhotoPreviewProps {
  photoPreview: string;
  onClick: () => void;
}

const PhotoPreview = ({ photoPreview, onClick }: PhotoPreviewProps) => {
  return (
    <div 
      onClick={onClick}
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
  );
};

export default PhotoPreview;
