
import { Profile } from '@/types/dataTypes';
import { Environment, getEnvironment, isProduction } from '@/utils/environmentUtils';

// Track events types
type TrackEventName = 
  | 'page_view'
  | 'profile_view'
  | 'scammer_view'
  | 'scammer_like'
  | 'scammer_dislike'
  | 'scammer_report'
  | 'search'
  | 'error'
  | 'performance'
  | 'api_call'
  | 'feature_usage'
  | 'user_engagement';

interface TrackEventProps {
  name: TrackEventName;
  properties?: Record<string, any>;
  user?: {
    id?: string;
    wallet?: string;
    username?: string;
  };
}

interface PerformanceMetrics {
  timeToFirstByte?: number;
  timeToFirstPaint?: number;
  timeToFirstContentfulPaint?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  apiLatency?: Record<string, number>;
  memoryUsage?: number;
}

// Define interfaces for external analytics providers
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    mixpanel?: {
      identify: (id: string) => void;
      track: (event: string, properties?: Record<string, any>) => void;
      people: {
        set: (properties: Record<string, any>) => void;
      };
      register: (properties: Record<string, any>) => void;
    };
    dataLayer?: any[];
    sa_event?: (eventName: string, params?: Record<string, any>) => void;
  }
}

// Environment-aware logging
const debugLog = (message: string, data?: any) => {
  if (!isProduction()) {
    console.log(`[Analytics] ${message}`, data);
  }
};

// Check if analytics should be enabled
const isAnalyticsEnabled = (): boolean => {
  const env = getEnvironment();
  
  // Disable in development and test by default
  if (env === Environment.DEVELOPMENT || env === Environment.TEST) {
    return false;
  }
  
  // Check for user opt-out in localStorage
  const analyticsOptOut = localStorage.getItem('analytics_opt_out') === 'true';
  if (analyticsOptOut) {
    return false;
  }
  
  return true;
};

// Collect performance metrics
const collectPerformanceMetrics = (): PerformanceMetrics => {
  const metrics: PerformanceMetrics = {};
  
  if (window.performance) {
    const perf = window.performance;
    
    // Navigation timing
    if (perf.timing) {
      const timing = perf.timing;
      metrics.timeToFirstByte = timing.responseStart - timing.navigationStart;
      metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
    }
    
    // Paint timing
    if (perf.getEntriesByType) {
      const paintMetrics = perf.getEntriesByType('paint');
      
      paintMetrics.forEach(metric => {
        if (metric.name === 'first-paint') {
          metrics.timeToFirstPaint = metric.startTime;
        }
        if (metric.name === 'first-contentful-paint') {
          metrics.timeToFirstContentfulPaint = metric.startTime;
        }
      });
    }
    
    // Memory info
    if (performance as any).memory) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }
  }
  
  return metrics;
};

// Initialize analytics - this would connect to services like Google Analytics, Mixpanel, etc.
export const initAnalytics = () => {
  if (!isAnalyticsEnabled()) {
    debugLog('Analytics disabled');
    return;
  }
  
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
  
  // Track performance metrics
  setTimeout(() => {
    const metrics = collectPerformanceMetrics();
    trackEvent({
      name: 'performance',
      properties: metrics
    });
  }, 3000); // Wait for page to load
  
  // Set up error tracking
  window.addEventListener('error', (event) => {
    trackEvent({
      name: 'error',
      properties: {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? event.error.stack : null,
        type: 'unhandled_error'
      }
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    trackEvent({
      name: 'error',
      properties: {
        message: event.reason?.message || 'Promise rejection',
        error: event.reason?.stack || event.reason,
        type: 'unhandled_promise_rejection'
      }
    });
  });
};

// Track a page view
export const trackPageView = () => {
  if (!isAnalyticsEnabled()) return;
  
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

// Track API call performance
export const trackApiCall = (endpoint: string, duration: number, success: boolean, statusCode?: number) => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent({
    name: 'api_call',
    properties: {
      endpoint,
      duration,
      success,
      statusCode
    }
  });
};

// Track a custom event
export const trackEvent = ({ name, properties = {}, user }: TrackEventProps) => {
  if (!isAnalyticsEnabled()) return;
  
  debugLog(`Event: ${name}`, { properties, user });
  
  // Augment with standard properties
  const augmentedProps = {
    ...properties,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    environment: getEnvironment()
  };
  
  // Send to Google Analytics if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, augmentedProps);
  }
  
  // Send to Mixpanel if available
  if (window.mixpanel?.track) {
    window.mixpanel.track(name, augmentedProps);
  }
  
  // Send to Google Tag Manager if available
  if (window.dataLayer) {
    window.dataLayer.push({
      event: name,
      ...augmentedProps
    });
  }
  
  // Send to SimpleAnalytics if available
  if (window.sa_event) {
    window.sa_event(name, augmentedProps);
  }
};

// Identify a user
export const identifyUser = (profile: Profile | null) => {
  if (!isAnalyticsEnabled() || !profile) return;
  
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
  if (!isAnalyticsEnabled()) return;
  
  trackEvent({
    name: 'error',
    properties: {
      message: error.message,
      stack: error.stack,
      context,
      type: 'handled_error'
    }
  });
};

// Allow users to opt out of analytics
export const optOutOfAnalytics = () => {
  localStorage.setItem('analytics_opt_out', 'true');
  debugLog('User opted out of analytics');
  
  // Clear any existing analytics cookies if possible
  if (window.mixpanel) {
    window.mixpanel.opt_out_tracking();
  }
};

// Allow users to opt back into analytics
export const optInToAnalytics = () => {
  localStorage.setItem('analytics_opt_out', 'false');
  debugLog('User opted into analytics');
  
  if (window.mixpanel) {
    window.mixpanel.opt_in_tracking();
  }
  
  // Reinitialize
  initAnalytics();
};

export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  identifyUser,
  trackError,
  trackApiCall,
  optOutOfAnalytics,
  optInToAnalytics,
  isAnalyticsEnabled
};
