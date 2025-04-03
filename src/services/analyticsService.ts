
import { Profile } from '@/types/dataTypes';

// Track events types
type TrackEventName = 
  | 'page_view'
  | 'profile_view'
  | 'scammer_view'
  | 'scammer_like'
  | 'scammer_dislike'
  | 'scammer_report'
  | 'search'
  | 'error';

interface TrackEventProps {
  name: TrackEventName;
  properties?: Record<string, any>;
  user?: {
    id?: string;
    wallet?: string;
    username?: string;
  };
}

// Define gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    mixpanel?: {
      identify: (id: string) => void;
      people: {
        set: (properties: Record<string, any>) => void;
      };
    };
  }
}

// Implement debug logging in development
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${message}`, data);
  }
};

// Initialize analytics - this would connect to services like Google Analytics, Mixpanel, etc.
export const initAnalytics = () => {
  debugLog('Analytics initialized');
  
  // Track page views automatically
  trackPageView();
  
  // Set up navigation tracking
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    trackPageView();
  };
  
  window.addEventListener('popstate', trackPageView);
};

// Track a page view
export const trackPageView = () => {
  const url = window.location.pathname + window.location.search;
  
  trackEvent({
    name: 'page_view',
    properties: {
      path: url,
      title: document.title,
      referrer: document.referrer
    }
  });
};

// Track a custom event
export const trackEvent = ({ name, properties = {}, user }: TrackEventProps) => {
  debugLog(`Event: ${name}`, { properties, user });
  
  // In a real implementation, you would send this to your analytics provider
  // For example, with Google Analytics:
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties);
  }
};

// Identify a user
export const identifyUser = (profile: Profile | null) => {
  if (!profile) return;
  
  debugLog('User identified', {
    id: profile.id,
    wallet: profile.wallet_address,
    username: profile.username
  });
  
  // In a real implementation, you would identify the user in your analytics provider
  // For example, with Mixpanel:
  if (window.mixpanel?.identify) {
    window.mixpanel.identify(profile.id);
    window.mixpanel.people.set({
      wallet: profile.wallet_address,
      username: profile.username,
      $name: profile.display_name,
      $created: profile.created_at
    });
  }
};

// Track error
export const trackError = (error: Error, context?: string) => {
  trackEvent({
    name: 'error',
    properties: {
      message: error.message,
      stack: error.stack,
      context
    }
  });
};

export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  identifyUser,
  trackError
};
