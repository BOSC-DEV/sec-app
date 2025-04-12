
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import log from '@/services/loggingService';
import { ErrorSeverity } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showReset?: boolean;
  showHomeLink?: boolean;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName } = this.props;
    const context = componentName ? `ErrorBoundary:${componentName}` : 'ErrorBoundary';
    
    // Log the error with our improved logging service
    log.critical(
      `Uncaught UI error${componentName ? ` in ${componentName}` : ''}`, 
      error, 
      context,
      { errorInfo }
    );
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Update state with error info
    this.setState({ errorInfo });
    
    // Show toast notification
    toast({
      title: "An error occurred",
      description: error.message,
      variant: "destructive",
    });
  }

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback, showReset = true, showHomeLink = true } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }
      
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full p-6">
            <Alert className="mb-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                {error?.message || "An unexpected error occurred."}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              {process.env.NODE_ENV === 'development' && error && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-[200px] text-xs">
                  <pre>{error.stack}</pre>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                {showReset && (
                  <Button 
                    onClick={this.resetErrorBoundary} 
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Try Again
                  </Button>
                )}
                
                {showHomeLink && (
                  <Button 
                    asChild
                    variant="default"
                    size="sm"
                  >
                    <Link to="/">
                      <Home className="mr-2 h-3 w-3" />
                      Return Home
                    </Link>
                  </Button>
                )}
                
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="secondary"
                  size="sm"
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Reload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return children;
  }
}

export default EnhancedErrorBoundary;
