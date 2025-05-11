
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import analyticsService from '@/services/analyticsService';
import log from '@/services/loggingService';

export const AnalyticsTracker = () => {
  const location = useLocation();
  const { profile } = useProfile();
  
  // Track page views and visitor data
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = localStorage.getItem('visitor_id') || crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
        
        // Get visitor's IP and location data
        const response = await fetch('https://api.ipapi.com/check?format=json');
        const geoData = await response.json();
        
        // First track the visitor
        try {
          await supabase.rpc('track_visitor', {
            p_visitor_id: visitorId,
            p_ip_address: geoData.ip || null,
            p_user_agent: navigator.userAgent,
            p_country_code: geoData.country_code || null,
            p_country_name: geoData.country_name || null,
            p_city: geoData.city || null,
            p_referrer: document.referrer || null
          });

          // Then track the pageview
          const title = document.title;
          await supabase.rpc('track_pageview', {
            p_visitor_id: visitorId,
            p_page_path: location.pathname,
            p_page_title: title,
            p_session_id: localStorage.getItem('session_id') || null
          });
        } catch (dbError) {
          // Silently handle database errors to prevent app crashes
          console.error('Database tracking error:', dbError);
        }

        analyticsService.trackPageView();
        log.info(`Page view: ${location.pathname}`, 'page_navigation');
      } catch (error) {
        // Log error but don't throw - we don't want to break the app if analytics fails
        log.error('Analytics tracking failed:', error);
      }
    };

    trackVisit();
  }, [location.pathname]);
  
  // Identify user when profile changes
  useEffect(() => {
    if (profile) {
      analyticsService.identifyUser(profile);
      log.info(`User identified: ${profile.username || profile.wallet_address}`, 'user_authentication');
    }
  }, [profile]);
  
  return null;
};
