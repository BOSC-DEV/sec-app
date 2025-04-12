
import React, { useEffect, useRef, useState } from 'react';
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
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!window.turnstile && !scriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load verification system. Please try again later.",
          variant: "destructive"
        });
      };
      
      document.head.appendChild(script);
    } else if (window.turnstile) {
      setScriptLoaded(true);
    }
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile) return;
      
      try {
        // Remove any existing widget
        if (widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (e) {
            console.error("Error resetting turnstile:", e);
          }
        }
        
        // Render new widget
        widgetIdRef.current = window.turnstile.render(containerRef.current!, {
          sitekey: siteKey,
          callback: (token: string) => {
            console.log("Turnstile verification successful");
            onVerify(token);
          },
          theme: theme,
          size: size,
          'refresh-expired': refreshExpired,
          'expired-callback': () => {
            console.log("Turnstile token expired");
            onVerify('');
          }
        });
      } catch (error) {
        console.error('Failed to render Turnstile:', error);
      }
    };

    renderWidget();
  }, [scriptLoaded, siteKey, onVerify, theme, size, refreshExpired]);

  useEffect(() => {
    return () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (error) {
          console.error('Failed to reset Turnstile:', error);
        }
      }
    };
  }, []);

  return (
    <div className="mt-2 mb-4">
      <div ref={containerRef} className="cf-turnstile" data-sitekey={siteKey}></div>
    </div>
  );
};

export default Turnstile;
