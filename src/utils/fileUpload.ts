
import { toast } from "@/hooks/use-toast";
import { handleError, ErrorSeverity } from "./errorHandling";

// Maximum file size in bytes (5MB default)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Supported image file types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Validate file type and size
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
  } = {}
): Promise<boolean> => {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = SUPPORTED_IMAGE_TYPES,
    minWidth,
    minHeight
  } = options;

  return new Promise((resolve) => {
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${formatFileSize(maxSize)}`,
        variant: 'destructive',
      });
      resolve(false);
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: `Supported formats: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`,
        variant: 'destructive',
      });
      resolve(false);
      return;
    }

    // If dimensions check is needed
    if (minWidth || minHeight) {
      // For images, check dimensions
      if (file.type.startsWith('image/')) {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          
          if ((minWidth && img.width < minWidth) || (minHeight && img.height < minHeight)) {
            toast({
              title: 'Image too small',
              description: `Minimum dimensions: ${minWidth || 0}x${minHeight || 0} pixels`,
              variant: 'destructive',
            });
            resolve(false);
          } else {
            resolve(true);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast({
            title: 'Invalid image',
            description: 'Could not process the image',
            variant: 'destructive',
          });
          resolve(false);
        };
        
        img.src = objectUrl;
      } else {
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
};

// Compress image before upload
export const compressImage = async (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<File | null> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    // Create image from file
    const image = await createImageBitmap(file);
    
    // Calculate new dimensions while maintaining aspect ratio
    let width = image.width;
    let height = image.height;
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    ctx.drawImage(image, 0, 0, width, height);
    
    // Convert to blob
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                    format === 'png' ? 'image/png' : 'image/webp';
                    
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), mimeType, quality);
    });
    
    if (!blob) {
      throw new Error('Failed to compress image');
    }
    
    // Create new file from blob
    const newFile = new File([blob], file.name, {
      type: mimeType,
      lastModified: Date.now()
    });
    
    return newFile;
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Image compression failed',
      severity: ErrorSeverity.MEDIUM,
      context: 'IMAGE_COMPRESSION'
    });
    return null;
  }
};

// Format file size to human-readable string
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// Read file as data URL
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
