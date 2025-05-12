import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import MostWantedPage from "./pages/MostWantedPage";
import ScammerDetailPage from "./pages/ScammerDetailPage";
import ReportPage from "./pages/ReportPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LegalPages from "./pages/LegalPages";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";
import EnhancedErrorBoundary from "./components/common/EnhancedErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import analyticsService from "./services/analyticsService";
import log from "./services/loggingService";
import { handleError, ErrorSeverity } from "./utils/errorHandling";
import environmentUtils from "./utils/environmentUtils";
import { HelmetProvider } from "react-helmet-async";

// Initialize analytics service
analyticsService.initAnalytics();

// Create query client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: !environmentUtils.isDevelopment(),
      retry: environmentUtils.isProduction() ? 2 : 1, // More retries in production
      refetchOnReconnect: true,
      meta: {
        onError: (error: Error) => {
          handleError(error, {
            severity: ErrorSeverity.MEDIUM,
            context: 'query_error'
          });
        }
      }
    },
    mutations: {
      retry: environmentUtils.isProduction() ? 2 : 0,
      meta: {
        onError: (error: Error) => {
          handleError(error, {
            severity: ErrorSeverity.MEDIUM,
            context: 'mutation_error'
          });
        }
      }
    }
  },
});

// Log application startup
log.info('Application starting', 'app_initialization', {
  environment: environmentUtils.getEnvironment(),
  buildId: process.env.BUILD_ID || 'dev',
  buildTime: process.env.BUILD_TIME || new Date().toISOString()
});

// Analytics tracker component - enhanced with visitor tracking and error handling
const AnalyticsTracker = () => {
  const location = useLocation();
  const { profile } = useProfile();
  
  // Track page views and visitor data
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = localStorage.getItem('visitor_id') || crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
        
        // Try to get visitor's IP and location data, but don't block if it fails
        try {
          const response = await fetch('https://api.ipapi.com/check?format=json');
          const geoData = await response.json();
          
          // Track the visitor
          await supabaseTrackVisitor(visitorId, geoData);
          
          // Track the pageview
          await supabaseTrackPageview(visitorId, location.pathname, document.title);
        } catch (error) {
          // If geo data fails, still track pageview with just visitor ID
          await supabaseTrackPageview(visitorId, location.pathname, document.title);
          console.log('Analytics geo data unavailable:', error);
        }

        analyticsService.trackPageView();
        log.info(`Page view: ${location.pathname}`, 'page_navigation');
      } catch (error) {
        // Log error but don't throw - we don't want analytics to break the app
        log.error('Analytics tracking failed:', error);
      }
    };

    trackVisit();
  }, [location.pathname]);
  
  // Identify user when profile changes
  useEffect(() => {
    if (profile) {
      try {
        analyticsService.identifyUser(profile);
        log.info(`User identified: ${profile.username || profile.wallet_address}`, 'user_authentication');
      } catch (error) {
        log.error('User identification failed:', error);
      }
    }
  }, [profile]);
  
  return null;
};

// Helper function for tracking visitors
const supabaseTrackVisitor = async (visitorId: string, geoData: any) => {
  try {
    const { data: { supabase } } = await import('@/integrations/supabase/client');
    await supabase.rpc('track_visitor', {
      p_visitor_id: visitorId,
      p_ip_address: geoData?.ip || null,
      p_user_agent: navigator.userAgent,
      p_country_code: geoData?.country_code || null,
      p_country_name: geoData?.country_name || null,
      p_city: geoData?.city || null,
      p_referrer: document.referrer || null
    });
  } catch (error) {
    console.log('Visitor tracking unavailable:', error);
  }
};

// Helper function for tracking pageviews
const supabaseTrackPageview = async (visitorId: string, path: string, title: string) => {
  try {
    const { data: { supabase } } = await import('@/integrations/supabase/client');
    await supabase.rpc('track_pageview', {
      p_visitor_id: visitorId,
      p_page_path: path,
      p_page_title: title,
      p_session_id: localStorage.getItem('session_id') || null
    });
  } catch (error) {
    console.log('Pageview tracking unavailable:', error);
  }
};

// Performance monitoring component
const PerformanceMonitor = () => {
  useEffect(() => {
    // Report initial performance metrics
    const reportPerformance = () => {
      if (window.performance) {
        const metrics = {
          dns: window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart,
          tcp: window.performance.timing.connectEnd - window.performance.timing.connectStart,
          ttfb: window.performance.timing.responseStart - window.performance.timing.requestStart,
          domLoad: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
          fullLoad: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        };
        
        log.info('Performance metrics', 'performance', metrics);
        
        if (metrics.domLoad > 3000 || metrics.fullLoad > 5000) {
          log.warn('Slow page load detected', 'performance', metrics);
        }
      }
    };
    
    // Wait for the page to fully load
    if (document.readyState === 'complete') {
      reportPerformance();
    } else {
      window.addEventListener('load', reportPerformance);
      return () => window.removeEventListener('load', reportPerformance);
    }
  }, []);
  
  return null;
};

// App component with improved error handling
const App = () => {
  return (
    <EnhancedErrorBoundary componentName="App">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ProfileProvider>
            <HelmetProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </HelmetProvider>
          </ProfileProvider>
        </TooltipProvider>
        {environmentUtils.isDevelopment() && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
};

// Separate component to use hooks after BrowserRouter is initialized
const AppContent = () => {
  return (
    <>
      <AnalyticsTracker />
      {environmentUtils.featureFlags.enablePerformanceMonitoring && <PerformanceMonitor />}
      <Layout>
        <EnhancedErrorBoundary componentName="Routes">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/most-wanted" element={<MostWantedPage />} />
            <Route path="/scammer/:id" element={<ScammerDetailPage />} />
            <Route path="/report" element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            } />
            <Route path="/report/:id" element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile/:username" element={<PublicProfilePage />} />
            <Route path="/wallet/:address" element={<PublicProfilePage />} />
            <Route path="/:username" element={<PublicProfilePage />} />
            
            {/* Legal and Information Pages */}
            <Route path="/terms" element={<LegalPages />} />
            <Route path="/privacy" element={<LegalPages />} />
            <Route path="/disclaimer" element={<LegalPages />} />
            <Route path="/cookies" element={<LegalPages />} />
            <Route path="/safety" element={<LegalPages />} />
            <Route path="/faq" element={<LegalPages />} />
            <Route path="/about" element={<LegalPages />} />
            <Route path="/contact" element={<LegalPages />} />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </EnhancedErrorBoundary>
      </Layout>
    </>
  );
};

export default App;
