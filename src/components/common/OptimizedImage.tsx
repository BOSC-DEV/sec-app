
/**
 * OptimizedImage Component
 * 
 * A responsive image component with loading states, error handling, and optimization features.
 * This component enhances the standard img element with features like:
 * - Loading indicators using Skeleton
 * - Error state handling with fallback images
 * - Lazy loading for performance optimization
 * - Aspect ratio control
 * - Support for blur hash placeholders
 * 
 * @example
 * <OptimizedImage 
 *   src="/path/to/image.jpg" 
 *   alt="Description of image" 
 *   aspectRatio="16/9"
 *   fallbackSrc="/fallback.jpg"
 * />
 */
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Alternative source to use if the main src fails to load */
  fallbackSrc?: string;
  /** CSS aspect ratio value (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Whether to use lazy loading for the image */
  lazyLoad?: boolean;
  /** Blurhash string for a blurred placeholder while loading */
  blurhash?: string;
  /** Callback function that runs when the image loads successfully */
  onLoad?: () => void;
  /** Callback function that runs when the image fails to load */
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/placeholder.svg',
  aspectRatio = '1/1',
  lazyLoad = true,
  blurhash,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Reset states when src changes
    if (src) {
      setIsLoading(true);
      setError(false);
      setImageSrc(src);
    }
  }, [src]);

  /**
   * Handles successful image loading
   */
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  /**
   * Handles image loading errors by displaying a fallback
   */
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    setImageSrc(fallbackSrc);
    if (onError) onError();
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt || 'Image'}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" aria-hidden="true" />
      )}
      
      <img
        src={imageSrc}
        alt={alt || 'Image'}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazyLoad ? 'lazy' : 'eager'}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
