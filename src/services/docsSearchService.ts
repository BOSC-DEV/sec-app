
import { Badge, Shield, Users, Coins, Trophy, Target, TrendingUp, AlertTriangle, Search, Filter, SortAsc, Eye, Vote, RefreshCw, Lock, Award, AlertCircle, Book, ExternalLink } from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  path: string;
  section?: string;
  sectionId?: string;
  type: 'page' | 'section' | 'content';
}

// Complete documentation content index
const DOCS_SEARCH_INDEX: SearchResult[] = [
  // Main Docs Page
  {
    id: 'docs-overview',
    title: 'SEC Documentation',
    content: 'SEC Documentation Welcome to the complete guide for the Scams & E-crimes Commission platform',
    excerpt: 'Welcome to the complete guide for the Scams & E-crimes Commission platform',
    path: '/docs',
    type: 'page'
  },
  {
    id: 'docs-vision',
    title: 'Vision and Mission',
    content: 'SEC envisions a self-regulated, safer crypto space where bad actors are discouraged through transparency and community vigilance. The platform mission is to equip users with decentralized tools that help identify and expose scams through token-based incentives and active community participation.',
    excerpt: 'SEC envisions a self-regulated, safer crypto space where bad actors are discouraged',
    path: '/docs',
    section: 'Vision and Mission',
    sectionId: 'vision-mission',
    type: 'section'
  },
  {
    id: 'docs-core-features',
    title: 'Core Features',
    content: 'Scammer Reporting Detailed reporting system with evidence upload. Bounty System Token-based rewards for scammer exposure. Community Features Live chat, reactions, and user profiles. Leaderboards Most Wanted Track, search and publicly scrutinise scammers.',
    excerpt: 'Scammer reporting, bounty system, community features, and leaderboards',
    path: '/docs',
    section: 'Core Features',
    sectionId: 'core-features',
    type: 'section'
  },

  // Badge System
  {
    id: 'badges-overview',
    title: 'Badge & Tier System',
    content: 'Badge System Overview SEC badge system recognizes community members based on their SEC token holdings. Each badge tier represents a different level of commitment to the platform and unlocks special privileges within the community, including enhanced voting power and delegation abilities.',
    excerpt: 'SEC badge system recognizes community members based on their SEC token holdings',
    path: '/docs/features/badges',
    type: 'page'
  },
  {
    id: 'badges-governance',
    title: 'Governance and Voting Power',
    content: 'Community Voting Power Each badge tier grants additional voting weight in community governance decisions, surveys, and platform direction votes. Higher commitment to the platform through SEC holdings translates to greater influence in shaping the community future. Each badge tier grants one additional vote compared to the previous tier. Voting weight is automatically calculated based on your current badge status.',
    excerpt: 'Each badge tier grants additional voting weight in community governance decisions',
    path: '/docs/features/badges',
    section: 'Governance',
    type: 'section'
  },
  {
    id: 'badges-delegation',
    title: 'Badge Delegation',
    content: 'Multi-Wallet Access Social Rewards Each badge holder can delegate their badge to other wallets or accounts. This provides a secure way to use hot wallets for app access while keeping cold storage safe, and also serves as a social activity to reward good community members with badges. Keep your main wallet in cold storage for maximum security. Use hot wallets for daily platform interactions. Delegate badges to trusted accounts without transferring SEC tokens. Reward active community members with badge delegations.',
    excerpt: 'Badge holders can delegate their badge to other wallets for security and social rewards',
    path: '/docs/features/badges',
    section: 'Badge Delegation',
    type: 'section'
  },
  {
    id: 'badges-tiers',
    title: 'Badge Tiers and Requirements',
    content: 'Shrimp Frog Fish Dolphin Shark Orca Whale Goat badge tiers. Requirements hold SEC tokens maintain balance connect wallet. Benefits community recognition special badge display voting power delegation slots. Goat and Whale tiers get chat moderation privileges.',
    excerpt: 'Eight badge tiers from Shrimp to Goat, each with increasing SEC requirements and benefits',
    path: '/docs/features/badges',
    section: 'Badge Tiers',
    type: 'section'
  },

  // Bounty System
  {
    id: 'bounty-overview',
    title: 'Bounty System',
    content: 'Bounty System Overview The SEC bounty system creates financial incentives for exposing scammers and fraudulent activities. Community members can contribute SEC tokens to bounties, increasing the reward for bringing scammers to justice.',
    excerpt: 'SEC bounty system creates financial incentives for exposing scammers',
    path: '/docs/features/bounty',
    type: 'page'
  },
  {
    id: 'bounty-how-it-works',
    title: 'How Bounties Work',
    content: 'Scammer Reported community member submits detailed report about scammer creating new bounty target. Community Contributes other users can add SEC tokens to bounty increasing total reward pool. Evidence Accumulates more evidence and verification from community strengthens case. Bounty Funds Used to Apply Social and Legal Pressure accumulated bounty funds utilized to apply social and legal pressure on scammers. Justice Served when scammer apprehended or funds recovered bounty contributors rewarded proportionally.',
    excerpt: 'Five-step process from scammer report to justice served with proportional rewards',
    path: '/docs/features/bounty',
    section: 'How Bounties Work',
    type: 'section'
  },
  {
    id: 'bounty-growth-flywheel',
    title: 'Growth Flywheel',
    content: 'Value Appreciation SEC token value rises existing bounties become more valuable attracting more attention resources. Supply Reduction bounties cannot be withdrawn but can be transferred permanently decreasing liquid supply SEC tokens. Creates deflationary pressure while increasing incentive to participate.',
    excerpt: 'SEC value appreciation creates deflationary pressure and increased participation incentives',
    path: '/docs/features/bounty',
    section: 'Growth Flywheel',
    type: 'section'
  },
  {
    id: 'bounty-contributing',
    title: 'Contributing to Bounties',
    content: 'Minimum Contribution contribute as few as 1 SEC token to any bounty. Proportional Rewards your share of recovered funds proportional to your contribution to total bounty amount. Early Contribution Benefits contributing early to bounties can increase visibility attract more contributors.',
    excerpt: 'Contribute as little as 1 SEC token with proportional rewards based on contribution',
    path: '/docs/features/bounty',
    section: 'Contributing to Bounties',
    type: 'section'
  },

  // Search & Navigation
  {
    id: 'search-overview',
    title: 'Search & Navigation',
    content: 'Search Overview Advanced search system helps you quickly locate scammers, reports, and community discussions. Find the information you need to stay safe in the crypto space.',
    excerpt: 'Advanced search system for quickly locating scammers, reports, and community discussions',
    path: '/docs/features/search',
    type: 'page'
  },
  {
    id: 'search-capabilities',
    title: 'Search Capabilities',
    content: 'Scammer Database Search by name alias known identifiers wallet address lookup keyword search in accusations filter by date added bounty amount. Community Content Search announcements discussions specific chat messages filter by author date search within comments replies.',
    excerpt: 'Search scammer database and community content with advanced filtering options',
    path: '/docs/features/search',
    section: 'Search Capabilities',
    type: 'section'
  },
  {
    id: 'search-methods',
    title: 'Search Methods',
    content: 'Quick Search use search bar in header instantly search across all scammer records. Advanced Filtering comprehensive filters on main scammer list narrow down results by bounty amount date added fraud categories. Wallet Address Lookup directly search wallet addresses see if associated with known scammers.',
    excerpt: 'Three main search methods: quick search, advanced filtering, and wallet lookup',
    path: '/docs/features/search',
    section: 'Search Methods',
    type: 'section'
  },
  {
    id: 'search-advanced-features',
    title: 'Advanced Search Features',
    content: 'Smart Filtering filter by multiple criteria including bounty amount date ranges fraud types. Custom Sorting sort results by relevance date bounty amount community engagement. Search History recent searches saved locally for quick access.',
    excerpt: 'Smart filtering, custom sorting, and search history for enhanced user experience',
    path: '/docs/features/search',
    section: 'Advanced Search Features',
    type: 'section'
  },

  // Quick Start
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    content: 'Quick Start Welcome to SEC Get started with the Scams E-crimes Commission platform. This guide will help you understand the basics and get you up and running quickly.',
    excerpt: 'Get started with the Scams E-crimes Commission platform quickly',
    path: '/docs/quick-start',
    type: 'page'
  },

  // Vision Page
  {
    id: 'vision-detailed',
    title: 'Vision & Mission Details',
    content: 'Vision Mission Detailed explanation of SEC vision mission community-driven approach to fighting scams cryptocurrency space. Self-regulation transparency community vigilance decentralized tools token-based incentives.',
    excerpt: 'Detailed explanation of SEC vision for community-driven scam fighting',
    path: '/docs/vision',
    type: 'page'
  },

  // Community Features
  {
    id: 'community-overview',
    title: 'Community Features',
    content: 'Community Features Overview Live chat real-time messaging community announcements user profiles reactions voting surveys. Interactive community platform for sharing information collaborating on scammer exposure.',
    excerpt: 'Live chat, announcements, profiles, and interactive community collaboration tools',
    path: '/docs/features/community',
    type: 'page'
  },

  // PHANTOM WALLET FEATURES - COMPREHENSIVE CONTENT
  {
    id: 'wallet-phantom-overview',
    title: 'Phantom Wallet Integration',
    content: 'Phantom Wallet Integration Phantom wallet required Solana wallet SEC platform authentication secure fast user-friendly access Solana ecosystem. Why Phantom Wallet leading Solana wallet secure authentication token management seamless integration bounty system. Phantom provides secure, fast, and user-friendly access to the Solana ecosystem. Required for all SEC platform interactions to ensure security and accountability.',
    excerpt: 'Phantom is the leading Solana wallet providing secure access to the SEC platform',
    path: '/docs/features/wallet',
    type: 'page'
  },
  {
    id: 'phantom-installation',
    title: 'Phantom Wallet Installation',
    content: 'Phantom Installation Guide browser extension desktop mobile app Chrome Web Store Firefox Add-ons Edge Add-ons Brave Browser iOS App Store Google Play Store Direct APK download. Install Phantom as browser extension for Chrome Firefox Brave Edge. Get Phantom mobile app iOS Android devices. Download extension mobile-optimized interface biometric authentication support.',
    excerpt: 'Install Phantom wallet as browser extension or mobile app from official sources',
    path: '/docs/features/wallet',
    section: 'Installation Guide',
    type: 'section'
  },
  {
    id: 'phantom-setup-process',
    title: 'Phantom Wallet Setup',
    content: 'Phantom Wallet Setup create new wallet import existing wallet seed phrase recovery phrase. Download install Phantom create new wallet import existing using seed phrase. Secure seed phrase 12-word recovery phrase store safely never share anyone. Fund wallet add SOL transaction fees few cents per transaction. Connect to SEC platform click Connect Wallet link Phantom wallet.',
    excerpt: 'Step-by-step process to create, secure, and connect your Phantom wallet',
    path: '/docs/features/wallet',
    section: 'Setting Up Your Wallet',
    type: 'section'
  },
  {
    id: 'phantom-security-tips',
    title: 'Phantom Wallet Security',
    content: 'Phantom Wallet Security Best Practices never share seed phrase verify SEC website URL before connecting only connect trusted applications keep Phantom extension updated use hardware wallets large amounts cautious phishing attempts. Important Security Tips never share seed phrase anyone always verify website URL before connecting only connect to trusted applications keep extension updated use hardware wallets for large amounts be cautious of phishing attempts.',
    excerpt: 'Essential security practices for protecting your Phantom wallet and funds',
    path: '/docs/features/wallet',
    section: 'Security Best Practices',
    type: 'section'
  },
  {
    id: 'phantom-troubleshooting',
    title: 'Phantom Wallet Troubleshooting',
    content: 'Phantom Wallet Troubleshooting common issues solutions wallet connection problems transaction failures profile loading issues. Wallet Won Connect make sure Phantom installed unlocked refresh page click connect again. Transaction Failed ensure enough SOL transaction fees network congestion delays. Profile Not Loading disconnect reconnect wallet clear browser cache issue persists.',
    excerpt: 'Solutions for common Phantom wallet connection and transaction issues',
    path: '/docs/features/wallet',
    section: 'Common Issues & Solutions',
    type: 'section'
  },

  // PHANTOM WALLET GUIDE - DETAILED CONTENT
  {
    id: 'phantom-guide-overview',
    title: 'Using Phantom Wallet - Complete Guide',
    content: 'Using Phantom Wallet Complete Guide setting up using Phantom wallet SEC platform. Phantom Wallet Overview Phantom recommended Solana wallet SEC platform provides secure authentication token management seamless integration bounty system. Complete guide help set up use Phantom effectively Solana wallet browser extension mobile app seed phrase security transaction fees SOL network.',
    excerpt: 'Complete guide to setting up and using Phantom wallet with the SEC platform',
    path: '/docs/guide/wallet',
    type: 'page'
  },
  {
    id: 'phantom-guide-installation',
    title: 'Installing Phantom Wallet - Detailed Guide',
    content: 'Installing Phantom Wallet browser extension Chrome Firefox Brave Edge mobile app iOS Android. Visit phantom.app click Download for your browser add to browser extensions pin extension easy access. Download Phantom mobile app iOS Android devices available App Store Google Play mobile-optimized interface biometric authentication support sync with browser extension.',
    excerpt: 'Detailed installation instructions for Phantom wallet on desktop and mobile',
    path: '/docs/guide/wallet',
    section: 'Installing Phantom Wallet',
    type: 'section'
  },
  {
    id: 'phantom-guide-setup',
    title: 'Setting Up Phantom Wallet Step by Step',
    content: 'Setting Up Phantom Wallet step by step create new wallet secure seed phrase set password import existing wallet. Create New Wallet open Phantom choose create new wallet new to Solana wallets. Secure Your Seed Phrase write down 12-word recovery phrase store securely offline never share anyone. Set Password create strong password protect wallet device. Import Existing Wallet already have Solana wallet choose import wallet enter seed phrase.',
    excerpt: 'Four-step process to set up your Phantom wallet securely',
    path: '/docs/guide/wallet',
    section: 'Setting Up Your Wallet',
    type: 'section'
  },
  {
    id: 'phantom-guide-sec-connection',
    title: 'Connecting Phantom to SEC Platform',
    content: 'Connecting Phantom SEC Platform authentication message signing ready use. Authentication click Connect Wallet approve connection request. Message Signing sign authentication messages verify wallet ownership. Ready to Use access all SEC features including bounties profile management. Secure authentication wallet serves secure login platform. Bounty Contributions contribute SOL bounties exposing scammers. Profile Verification verified wallet ownership ensures authentic user profiles.',
    excerpt: 'How to connect and authenticate your Phantom wallet with the SEC platform',
    path: '/docs/guide/wallet',
    section: 'Connecting to SEC Platform',
    type: 'section'
  },
  {
    id: 'phantom-guide-sec-tokens',
    title: 'Managing SEC Tokens with Phantom',
    content: 'Managing SEC Tokens Phantom wallet token operations. Token Operations use Phantom wallet manage SEC tokens bounty contributions platform features. View SEC token balance wallet send receive SEC tokens other users contribute tokens scammer bounties transfer bounties between reports monitor transaction history check token prices market data. SEC token management bounty contributions token transfer transaction monitoring.',
    excerpt: 'Use Phantom wallet to manage SEC tokens for bounties and platform features',
    path: '/docs/guide/wallet',
    section: 'Managing SEC Tokens',
    type: 'section'
  },
  {
    id: 'phantom-guide-security',
    title: 'Phantom Wallet Security Best Practices',
    content: 'Phantom Wallet Security Best Practices critical security rules general security tips. Critical Security Rules never share seed phrase anyone don store seed phrases digitally photos always verify website URLs before connecting use hardware wallets large amounts enable all available security features. General Security Tips keep browser extension updated use strong unique passwords enable two-factor authentication where possible regularly check transaction history be cautious phishing attempts.',
    excerpt: 'Critical security rules and general tips for protecting your Phantom wallet',
    path: '/docs/guide/wallet',
    section: 'Wallet Security Best Practices',
    type: 'section'
  },
  {
    id: 'phantom-guide-troubleshooting',
    title: 'Phantom Wallet Common Issues and Solutions',
    content: 'Phantom Wallet Common Issues Solutions connection issues transaction problems token display issues. Connection Issues refresh page try connecting again check Phantom extension enabled clear browser cache cookies try different browser incognito mode. Transaction Problems ensure sufficient SOL transaction fees check network status congestion wait previous transactions confirm verify recipient addresses before sending. Token Display Issues add SEC token manually if not visible check correct Solana network refresh token balances wallet settings verify token contract address.',
    excerpt: 'Solutions for connection, transaction, and token display issues',
    path: '/docs/guide/wallet',
    section: 'Common Issues & Solutions',
    type: 'section'
  },
  {
    id: 'phantom-guide-advanced',
    title: 'Advanced Phantom Wallet Features',
    content: 'Advanced Phantom Features DeFi Integration Portfolio Tracking. DeFi Integration swap tokens directly wallet access Solana DeFi protocols staking yield farming NFT collection management. Portfolio Tracking real-time token prices portfolio value tracking transaction history analysis performance metrics. Advanced features decentralized finance integration portfolio management tools.',
    excerpt: 'Advanced Phantom features including DeFi integration and portfolio tracking',
    path: '/docs/guide/wallet',
    section: 'Advanced Phantom Features',
    type: 'section'
  },
  {
    id: 'phantom-guide-warnings',
    title: 'Important Phantom Wallet Security Warnings',
    content: 'Important Phantom Wallet Security Warnings security reminders. Security Reminders SEC platform never ask seed phrase always verify correct SEC website URL cautious fake Phantom extensions apps report suspicious activity support team keep small amounts hot wallets larger amounts cold storage. SEC platform will never ask for your seed phrase always verify you are on the correct SEC website URL be cautious of fake Phantom extensions or apps.',
    excerpt: 'Critical security warnings and reminders for Phantom wallet users',
    path: '/docs/guide/wallet',
    section: 'Important Warnings',
    type: 'section'
  },

  // Wallet Features (Legacy entry maintained for compatibility)
  {
    id: 'wallet-overview',
    title: 'Sign Up and Wallet Connection',
    content: 'Wallet Features Phantom wallet integration SEC token management badge tier display wallet balance checking. Connect your Phantom wallet to access all platform features view your SEC holdings badge status.',
    excerpt: 'Phantom wallet integration for SEC token management and badge tier access',
    path: '/docs/features/wallet',
    type: 'page'
  },

  // Reporting
  {
    id: 'reporting-overview',
    title: 'Scammer Reporting System',
    content: 'Report Scammers comprehensive reporting system for documenting fraudulent activities. Submit detailed reports with evidence photos wallet addresses transaction details. Community verification collaborative evidence gathering.',
    excerpt: 'Comprehensive system for reporting scammers with evidence and community verification',
    path: '/docs/features/reporting',
    type: 'page'
  },

  // Leaderboard
  {
    id: 'leaderboard-overview',
    title: 'Leaderboard and Rankings',
    content: 'Leaderboard Rankings community contributors bounty leaders most active reporters. Track community engagement recognize top performers showcase community statistics achievements.',
    excerpt: 'Community rankings showing top contributors, bounty leaders, and active reporters',
    path: '/docs/features/leaderboard',
    type: 'page'
  },

  // Notifications
  {
    id: 'notifications-overview',
    title: 'Notifications System',
    content: 'Notifications System real-time alerts community updates bounty changes badge tier updates. Stay informed about platform activity relevant community discussions important announcements.',
    excerpt: 'Real-time alerts for community updates, bounty changes, and badge updates',
    path: '/docs/features/notifications',
    type: 'page'
  },

  // API Documentation - COMPREHENSIVE CONTENT
  {
    id: 'api-overview',
    title: 'API Documentation',
    content: 'API Documentation Complete reference for integrating with the SEC platform API endpoints and services. The SEC platform provides a comprehensive REST API built on Supabase, enabling developers to integrate scammer reporting, bounty management, and community features into their own applications.',
    excerpt: 'Complete reference for integrating with the SEC platform API endpoints and services',
    path: '/docs/developer/api',
    type: 'page'
  },
  {
    id: 'api-overview-section',
    title: 'API Overview',
    content: 'API Overview The SEC platform provides a comprehensive REST API built on Supabase, enabling developers to integrate scammer reporting, bounty management, and community features into their own applications. REST API Supabase integration scammer reporting bounty management community features developer integration.',
    excerpt: 'Comprehensive REST API built on Supabase for scammer reporting and bounty management',
    path: '/docs/developer/api',
    section: 'API Overview',
    sectionId: 'api-overview',
    type: 'section'
  },
  {
    id: 'api-authentication',
    title: 'API Authentication',
    content: 'Authentication API Keys Authenticate using Supabase service role keys for server-side access. Authorization Bearer YOUR_SUPABASE_ANON_KEY. Row Level Security All endpoints respect RLS policies ensuring users can only access authorized data. X-User-ID user_uuid_here.',
    excerpt: 'Authenticate using Supabase service role keys with row level security',
    path: '/docs/developer/api',
    section: 'Authentication',
    sectionId: 'authentication',
    type: 'section'
  },
  {
    id: 'api-endpoints',
    title: 'Core API Endpoints',
    content: 'Core API Endpoints GET /scammers Retrieve a list of reported scammers with optional filtering and pagination. POST /scammers Submit a new scammer report with evidence and details. POST /reports/scammer Report a scammer with comprehensive details including evidence wallet addresses and supporting documentation. POST /bounties/contribute Add SEC tokens to a scammer bounty pool. POST /bounties/transfer Transfer bounty tokens between users or scammer reports.',
    excerpt: 'GET and POST endpoints for scammers, reports, bounty contributions, and transfers',
    path: '/docs/developer/api',
    section: 'Core Endpoints',
    sectionId: 'core-endpoints',
    type: 'section'
  },
  {
    id: 'api-scammers-get',
    title: 'GET /scammers',
    content: 'GET /scammers Retrieve a list of reported scammers with optional filtering and pagination. Response includes scammer_id name total_bounty report_count created_at. Supports filtering by scam type date range bounty amount. Pagination with count and page parameters.',
    excerpt: 'Retrieve reported scammers with filtering and pagination support',
    path: '/docs/developer/api',
    section: 'GET /scammers',
    type: 'section'
  },
  {
    id: 'api-scammers-post',
    title: 'POST /scammers',
    content: 'POST /scammers Submit a new scammer report with evidence and details. Required fields: name crypto_addresses scam_type evidence photos. Creates new scammer entry in database with evidence documentation.',
    excerpt: 'Submit new scammer reports with evidence and crypto addresses',
    path: '/docs/developer/api',
    section: 'POST /scammers',
    type: 'section'
  },
  {
    id: 'api-reports-scammer',
    title: 'POST /reports/scammer',
    content: 'POST /reports/scammer Report a scammer with comprehensive details including evidence wallet addresses and supporting documentation. Required fields: scammer_name accused_of wallet_addresses aliases accomplices links evidence_description photo_evidence official_response. Creates detailed scammer report with full evidence trail.',
    excerpt: 'Report scammers with comprehensive evidence and supporting documentation',
    path: '/docs/developer/api',
    section: 'POST /reports/scammer',
    type: 'section'
  },
  {
    id: 'api-bounties-contribute',
    title: 'POST /bounties/contribute',
    content: 'POST /bounties/contribute Add SEC tokens to a scammer bounty pool. Required fields: scammer_id amount comment transaction_signature. Increases total bounty amount for specified scammer.',
    excerpt: 'Add SEC tokens to scammer bounty pools with transaction verification',
    path: '/docs/developer/api',
    section: 'POST /bounties/contribute',
    type: 'section'
  },
  {
    id: 'api-bounties-transfer',
    title: 'POST /bounties/transfer',
    content: 'POST /bounties/transfer Transfer bounty tokens between users or scammer reports. Required fields: from_scammer_id to_scammer_id amount reason. Moves bounty contributions between different scammer targets.',
    excerpt: 'Transfer bounty tokens between scammer reports with reasoning',
    path: '/docs/developer/api',
    section: 'POST /bounties/transfer',
    type: 'section'
  },
  {
    id: 'api-response-formats',
    title: 'Response Formats',
    content: 'Response Formats Success Response includes success true data object message. Error Response includes success false error message code. Standard JSON responses for all API endpoints with consistent structure.',
    excerpt: 'Consistent JSON response formats for success and error cases',
    path: '/docs/developer/api',
    section: 'Response Formats',
    sectionId: 'response-formats',
    type: 'section'
  },
  {
    id: 'api-rate-limiting',
    title: 'Rate Limiting',
    content: 'Rate Limiting API Limits 100 requests per minute for authenticated users. 10 requests per minute for unauthenticated requests. 1000 requests per hour for premium users. Rate limit headers included in all responses.',
    excerpt: 'Rate limits: 100/min authenticated, 10/min unauthenticated, 1000/hour premium',
    path: '/docs/developer/api',
    section: 'Rate Limiting',
    sectionId: 'rate-limiting',
    type: 'section'
  },
  {
    id: 'api-sdk-examples',
    title: 'SDK Examples',
    content: 'SDK Examples JavaScript TypeScript import createClient from @supabase/supabase-js. Example code for fetching scammers using Supabase client with select and limit operations.',
    excerpt: 'JavaScript/TypeScript SDK examples using Supabase client',
    path: '/docs/developer/api',
    section: 'SDK Examples',
    sectionId: 'sdk-examples',
    type: 'section'
  },
  {
    id: 'api-webhooks',
    title: 'Webhooks',
    content: 'Webhooks New Reports Triggered when new scammer reports are submitted. Bounty Updates Notifications for bounty contributions and transfers. Community Events Real-time updates for chat and community interactions.',
    excerpt: 'Webhooks for new reports, bounty updates, and community events',
    path: '/docs/developer/api',
    section: 'Webhooks',
    sectionId: 'webhooks',
    type: 'section'
  },

  // Developer - Contributing
  {
    id: 'contributing-overview',
    title: 'Contributing',
    content: 'Contributing Guide How to contribute to the SEC platform development. Code contribution guidelines development setup pull request process issue reporting. Open source community development standards best practices.',
    excerpt: 'Guide for contributing to SEC platform development with guidelines and setup',
    path: '/docs/developer/contributing',
    type: 'page'
  },

  // Developer - Deployment
  {
    id: 'deployment-overview',
    title: 'Deployment',
    content: 'Deployment Guide How to deploy the SEC platform to production environments. Environment setup configuration management database migrations security considerations. Production deployment best practices monitoring logging.',
    excerpt: 'Production deployment guide with environment setup and security considerations',
    path: '/docs/developer/deployment',
    type: 'page'
  },

  // Technical Documentation
  {
    id: 'architecture-overview',
    title: 'Architecture',
    content: 'Architecture Overview System architecture design patterns infrastructure components. Frontend React TypeScript backend Supabase database schema API design. Scalability security performance considerations.',
    excerpt: 'System architecture with React frontend, Supabase backend, and security design',
    path: '/docs/technical/architecture',
    type: 'page'
  },
  {
    id: 'frontend-overview',
    title: 'Frontend Stack',
    content: 'Frontend Stack React TypeScript Tailwind CSS Vite build system. Component architecture state management routing authentication. Development tools testing framework deployment pipeline.',
    excerpt: 'React TypeScript frontend with Tailwind CSS and Vite build system',
    path: '/docs/technical/frontend',
    type: 'page'
  },
  {
    id: 'backend-overview',
    title: 'Backend Integration',
    content: 'Backend Integration Supabase backend services database management authentication API endpoints. Real-time subscriptions row level security edge functions file storage.',
    excerpt: 'Supabase backend with database, authentication, and real-time features',
    path: '/docs/technical/backend',
    type: 'page'
  },
  {
    id: 'database-overview',
    title: 'Database Schema',
    content: 'Database Schema Table structures relationships indexes constraints. Scammers table bounties table users table community tables. Data integrity referential integrity performance optimization.',
    excerpt: 'Database schema with scammers, bounties, users, and community tables',
    path: '/docs/technical/database',
    type: 'page'
  },
  {
    id: 'security-overview',
    title: 'Security Features',
    content: 'Security Features Row level security authentication authorization data protection. Input validation SQL injection prevention XSS protection CSRF protection. Wallet security transaction verification.',
    excerpt: 'Comprehensive security with RLS, authentication, and wallet protection',
    path: '/docs/technical/security',
    type: 'page'
  },

  // User Guide
  {
    id: 'reports-guide',
    title: 'Creating Reports',
    content: 'Creating Reports Step-by-step guide for submitting scammer reports. Evidence collection photo upload wallet address verification. Report quality guidelines community standards.',
    excerpt: 'Step-by-step guide for submitting quality scammer reports with evidence',
    path: '/docs/guide/reports',
    type: 'page'
  },
  {
    id: 'bounties-guide',
    title: 'Managing Bounties',
    content: 'Managing Bounties How to contribute to bounties transfer funds track progress. Bounty strategy optimization contribution timing reward distribution.',
    excerpt: 'Guide for contributing to and managing bounty funds effectively',
    path: '/docs/guide/bounties',
    type: 'page'
  },
  {
    id: 'wallet-guide',
    title: 'Using Wallet Features',
    content: 'Using Wallet Features Phantom wallet connection SEC token management badge tier system. Wallet security best practices transaction signing delegation features.',
    excerpt: 'Complete guide for Phantom wallet integration and SEC token management',
    path: '/docs/guide/wallet',
    type: 'page'
  },
  {
    id: 'community-guide',
    title: 'Community Participation',
    content: 'Community Participation Live chat participation community guidelines moderation features. Voting surveys discussions announcement engagement best practices.',
    excerpt: 'Guide for effective community participation and engagement',
    path: '/docs/guide/community',
    type: 'page'
  },

  // Legal & Compliance
  {
    id: 'terms-overview',
    title: 'Terms of Service',
    content: 'Terms of Service Legal terms conditions user agreements platform usage. User responsibilities prohibited activities dispute resolution liability limitations.',
    excerpt: 'Legal terms and conditions for platform usage and user responsibilities',
    path: '/docs/legal/terms',
    type: 'page'
  },
  {
    id: 'privacy-overview',
    title: 'Privacy Policy',
    content: 'Privacy Policy Data collection usage storage protection user privacy rights. Personal information handling cookie policy data retention deletion.',
    excerpt: 'Privacy policy covering data handling, storage, and user privacy rights',
    path: '/docs/legal/privacy',
    type: 'page'
  },
  {
    id: 'legal-considerations',
    title: 'Legal Considerations',
    content: 'Legal Considerations Regulatory compliance jurisdiction issues international law. Scammer reporting legal implications evidence handling law enforcement cooperation.',
    excerpt: 'Legal considerations for scammer reporting and regulatory compliance',
    path: '/docs/legal/considerations',
    type: 'page'
  },
  {
    id: 'tokenomics-overview',
    title: 'Tokenomics',
    content: 'Tokenomics SEC token economics supply distribution utility value proposition. Token allocation bounty economics deflationary mechanisms staking rewards.',
    excerpt: 'SEC token economics, distribution, and utility within the platform',
    path: '/docs/legal/tokenomics',
    type: 'page'
  }
];

export class DocsSearchService {
  private static instance: DocsSearchService;
  private searchIndex: SearchResult[] = DOCS_SEARCH_INDEX;

  static getInstance(): DocsSearchService {
    if (!DocsSearchService.instance) {
      DocsSearchService.instance = new DocsSearchService();
    }
    return DocsSearchService.instance;
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const terms = normalizedQuery.split(/\s+/);

    const results = this.searchIndex
      .map(item => {
        let score = 0;
        const content = `${item.title} ${item.content} ${item.section || ''}`.toLowerCase();

        // Exact phrase match in title (highest priority)
        if (item.title.toLowerCase().includes(normalizedQuery)) {
          score += 100;
        }

        // Exact phrase match in content
        if (content.includes(normalizedQuery)) {
          score += 50;
        }

        // Individual term matches
        terms.forEach(term => {
          if (item.title.toLowerCase().includes(term)) {
            score += 20;
          }
          if (content.includes(term)) {
            score += 10;
          }
        });

        // Boost for section matches
        if (item.section && item.section.toLowerCase().includes(normalizedQuery)) {
          score += 30;
        }

        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limit to top 10 results

    return results;
  }

  getHighlightedContent(content: string, query: string): string {
    if (!query.trim()) return content;

    const terms = query.toLowerCase().trim().split(/\s+/);
    let highlighted = content;

    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return highlighted;
  }

  generateExcerpt(content: string, query: string, maxLength: number = 150): string {
    const normalizedQuery = query.toLowerCase();
    const normalizedContent = content.toLowerCase();
    
    // Find the position of the query in the content
    const queryIndex = normalizedContent.indexOf(normalizedQuery);
    
    if (queryIndex === -1) {
      // If query not found, return beginning of content
      return content.length > maxLength 
        ? content.substring(0, maxLength) + '...'
        : content;
    }

    // Calculate excerpt boundaries
    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, start + maxLength);
    
    let excerpt = content.substring(start, end);
    
    // Add ellipsis if we're not at the beginning/end
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  }
}

export const docsSearchService = DocsSearchService.getInstance();
