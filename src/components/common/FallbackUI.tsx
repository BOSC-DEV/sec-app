
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface FallbackUIProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'error' | 'empty';
}

const FallbackUI: React.FC<FallbackUIProps> = ({
  title = "Something went wrong",
  message = "We couldn't load the content you requested.",
  onRetry,
  showRetry = true,
  icon,
  variant = 'default'
}) => {
  const renderContent = () => {
    switch (variant) {
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 mb-4">
              {icon || <Info className="h-12 w-12" />}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mb-4">{message}</p>
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        );
        
      case 'empty':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="text-gray-400 mb-4">
              {icon || <Info className="h-12 w-12" />}
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mb-4">{message}</p>
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh
              </Button>
            )}
          </div>
        );
        
      default:
        return (
          <Alert className="max-w-full">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>{message}</p>
              {showRetry && onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="w-full my-4">
      {renderContent()}
    </div>
  );
};

export default FallbackUI;
