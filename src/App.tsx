
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
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";
import EnhancedErrorBoundary from "./components/common/EnhancedErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import analyticsService from "./services/analyticsService";
import { HelmetProvider } from "react-helmet-async";

// Initialize analytics service
analyticsService.initAnalytics();

// Create query client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1, // Limit retries on failure
      refetchOnReconnect: true,
      meta: {
        onError: (error: Error) => {
          analyticsService.trackError(error, 'query_error');
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          analyticsService.trackError(error, 'mutation_error');
        }
      }
    }
  },
});

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  const { profile } = useProfile();
  
  // Track page views
  useEffect(() => {
    analyticsService.trackPageView();
  }, [location.pathname]);
  
  // Identify user when profile changes
  useEffect(() => {
    analyticsService.identifyUser(profile);
  }, [profile]);
  
  return null;
};

const App = () => (
  <EnhancedErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProfileProvider>
          <HelmetProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsTracker />
              <Layout>
                <EnhancedErrorBoundary>
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
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile/:username" element={<PublicProfilePage />} />
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
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </EnhancedErrorBoundary>
              </Layout>
            </BrowserRouter>
          </HelmetProvider>
        </ProfileProvider>
      </TooltipProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </EnhancedErrorBoundary>
);

export default App;
