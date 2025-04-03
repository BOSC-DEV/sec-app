
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import MostWantedPage from "./pages/MostWantedPage";
import ScammerDetailPage from "./pages/ScammerDetailPage";
import ReportPage from "./pages/ReportPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LegalPages from "./pages/LegalPages";
import NotFound from "./pages/NotFound";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProfileProvider } from "./contexts/ProfileContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProfileProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/most-wanted" element={<MostWantedPage />} />
              <Route path="/scammer/:id" element={<ScammerDetailPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
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
          </Layout>
        </BrowserRouter>
      </ProfileProvider>
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
