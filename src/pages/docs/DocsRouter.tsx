
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocsPage from '@/pages/DocsPage';
import VisionPage from './VisionPage';
import QuickStartPage from './QuickStartPage';
import ReportingPage from './features/ReportingPage';
import WalletPage from './features/WalletPage';
import BountyPage from './features/BountyPage';
import BadgesPage from './features/BadgesPage';
import CommunityFeaturesPage from './features/CommunityFeaturesPage';
import SearchPage from './features/SearchPage';
import LeaderboardPage from './features/LeaderboardPage';
import NotificationsPage from './features/NotificationsPage';
import ArchitecturePage from './technical/ArchitecturePage';
import FrontendPage from './technical/FrontendPage';
import BackendPage from './technical/BackendPage';
import DatabasePage from './technical/DatabasePage';
import SecurityPage from './technical/SecurityPage';
import ReportsGuidePage from './guide/ReportsGuidePage';
import BountiesGuidePage from './guide/BountiesGuidePage';
import WalletGuidePage from './guide/WalletGuidePage';
import CommunityGuidePage from './guide/CommunityGuidePage';
import APIPage from './developer/APIPage';
import ContributingPage from './developer/ContributingPage';
import DeploymentPage from './developer/DeploymentPage';
import TermsPage from './legal/TermsPage';
import PrivacyPage from './legal/PrivacyPage';
import LegalConsiderationsPage from './legal/LegalConsiderationsPage';
import TokenomicsPage from './legal/TokenomicsPage';

const DocsRouter = () => {
  return (
    <Routes>
      <Route index element={<DocsPage />} />
      <Route path="vision" element={<VisionPage />} />
      <Route path="quick-start" element={<QuickStartPage />} />
      
      {/* Features */}
      <Route path="features/reporting" element={<ReportingPage />} />
      <Route path="features/wallet" element={<WalletPage />} />
      <Route path="features/bounty" element={<BountyPage />} />
      <Route path="features/badges" element={<BadgesPage />} />
      <Route path="features/community" element={<CommunityFeaturesPage />} />
      <Route path="features/search" element={<SearchPage />} />
      <Route path="features/leaderboard" element={<LeaderboardPage />} />
      <Route path="features/notifications" element={<NotificationsPage />} />
      
      {/* Technical Documentation */}
      <Route path="technical/architecture" element={<ArchitecturePage />} />
      <Route path="technical/frontend" element={<FrontendPage />} />
      <Route path="technical/backend" element={<BackendPage />} />
      <Route path="technical/database" element={<DatabasePage />} />
      <Route path="technical/security" element={<SecurityPage />} />
      
      {/* User Guide */}
      <Route path="guide/reports" element={<ReportsGuidePage />} />
      <Route path="guide/bounties" element={<BountiesGuidePage />} />
      <Route path="guide/wallet" element={<WalletGuidePage />} />
      <Route path="guide/community" element={<CommunityGuidePage />} />
      
      {/* Developer Resources */}
      <Route path="developer/api" element={<APIPage />} />
      <Route path="developer/contributing" element={<ContributingPage />} />
      <Route path="developer/deployment" element={<DeploymentPage />} />
      
      {/* Legal & Compliance */}
      <Route path="legal/terms" element={<TermsPage />} />
      <Route path="legal/privacy" element={<PrivacyPage />} />
      <Route path="legal/considerations" element={<LegalConsiderationsPage />} />
      <Route path="legal/tokenomics" element={<TokenomicsPage />} />
    </Routes>
  );
};

export default DocsRouter;
