
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocsPage from '@/pages/DocsPage';
import VisionPage from './VisionPage';
import QuickStartPage from './QuickStartPage';
import ReportingPage from './features/ReportingPage';
import WalletPage from './features/WalletPage';
import BountyPage from './features/BountyPage';
import BadgesPage from './features/BadgesPage';

// Placeholder components for remaining pages
const CommunityFeaturesPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Community Features</h1>
    <p>Documentation for community features coming soon...</p>
  </div>
);

const SearchPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Search & Navigation</h1>
    <p>Documentation for search features coming soon...</p>
  </div>
);

const LeaderboardPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
    <p>Documentation for leaderboard coming soon...</p>
  </div>
);

const NotificationsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Notifications</h1>
    <p>Documentation for notifications coming soon...</p>
  </div>
);

// Technical Documentation placeholders
const ArchitecturePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Architecture</h1>
    <p>Technical architecture documentation coming soon...</p>
  </div>
);

const FrontendPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Frontend Stack</h1>
    <p>Frontend technology documentation coming soon...</p>
  </div>
);

const BackendPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Backend Integration</h1>
    <p>Backend integration documentation coming soon...</p>
  </div>
);

const DatabasePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Database Schema</h1>
    <p>Database schema documentation coming soon...</p>
  </div>
);

const SecurityPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Security Features</h1>
    <p>Security documentation coming soon...</p>
  </div>
);

// User Guide placeholders
const ReportsGuidePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Creating Reports</h1>
    <p>User guide for creating reports coming soon...</p>
  </div>
);

const BountiesGuidePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Managing Bounties</h1>
    <p>User guide for managing bounties coming soon...</p>
  </div>
);

const WalletGuidePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Using Wallet Features</h1>
    <p>User guide for wallet features coming soon...</p>
  </div>
);

const CommunityGuidePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Community Participation</h1>
    <p>User guide for community participation coming soon...</p>
  </div>
);

// Developer Resources placeholders
const APIPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">API Reference</h1>
    <p>API documentation coming soon...</p>
  </div>
);

const ContributingPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Contributing</h1>
    <p>Contributing guide coming soon...</p>
  </div>
);

const DeploymentPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Deployment</h1>
    <p>Deployment guide coming soon...</p>
  </div>
);

// Legal & Compliance placeholders
const TermsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
    <p>Terms of service coming soon...</p>
  </div>
);

const PrivacyPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p>Privacy policy coming soon...</p>
  </div>
);

const LegalConsiderationsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Legal Considerations</h1>
    <p>Legal considerations documentation coming soon...</p>
  </div>
);

const TokenomicsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Tokenomics</h1>
    <p>Tokenomics documentation coming soon...</p>
  </div>
);

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
      
      {/* Technical */}
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
      
      {/* Developer */}
      <Route path="developer/api" element={<APIPage />} />
      <Route path="developer/contributing" element={<ContributingPage />} />
      <Route path="developer/deployment" element={<DeploymentPage />} />
      
      {/* Legal */}
      <Route path="legal/terms" element={<TermsPage />} />
      <Route path="legal/privacy" element={<PrivacyPage />} />
      <Route path="legal/considerations" element={<LegalConsiderationsPage />} />
      <Route path="legal/tokenomics" element={<TokenomicsPage />} />
    </Routes>
  );
};

export default DocsRouter;
