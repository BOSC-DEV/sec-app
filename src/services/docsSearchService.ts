
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

  // Wallet Features
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
