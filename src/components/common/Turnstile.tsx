
import React, { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    }
  }
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  refreshExpired?: 'auto' | 'manual';
}

const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  theme = 'auto',
  size = 'normal',
  refreshExpired = 'auto'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');

  useEffect(() => {
    // Load the Turnstile script if it hasn't been loaded yet
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load verification system. Please try again later.",
          variant: "destructive"
        });
      };
      
      document.head.appendChild(script);
    }

    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            theme: theme,
            size: size,
            'refresh-expired': refreshExpired,
            'expired-callback': () => {
              onVerify('');
            }
          });
        } catch (error) {
          console.error('Failed to render Turnstile:', error);
        }
      }
    };

    // Initialize when turnstile is available
    const checkTurnstileLoaded = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkTurnstileLoaded);
        renderTurnstile();
      }
    }, 100);

    return () => {
      clearInterval(checkTurnstileLoaded);
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (error) {
          console.error('Failed to reset Turnstile:', error);
        }
      }
    };
  }, [siteKey, onVerify, theme, size, refreshExpired]);

  return (
    <div className="mt-2 mb-4">
      <div ref={containerRef} className="cf-turnstile" data-sitekey={siteKey}></div>
    </div>
  );
};

export default Turnstile;
