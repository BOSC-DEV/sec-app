
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shield, Users, Coins, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocsPage = () => {
  return (
    <DocsContent 
      title="SEC Documentation" 
      description="Welcome to the complete guide for the Scams & E-crimes Commission platform"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">🏛️ SEC: Scams & E-crimes Commission</h2>
          <p className="text-lg mb-6 opacity-90">
            A decentralized crime registry focused on the cryptocurrency and blockchain ecosystem. 
            SEC serves as a community-governed platform where users can report, track, and combat scams, 
            bringing much-needed accountability and transparency to the digital financial landscape.
          </p>
          <div className="flex gap-4">
            <Button variant="gold" asChild>
              <Link to="/docs/quick-start">Quick Start Guide</Link>
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-icc-blue" asChild>
              <Link to="/docs/features/reporting">Start Reporting</Link>
            </Button>
          </div>
        </section>

        {/* Vision & Mission */}
        <section>
          <h2 id="vision-mission">📌 Vision and Mission</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-icc-gold">Vision</h3>
              <p>The SEC envisions a self-regulated, safer crypto space where bad actors are discouraged through transparency and community vigilance.</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-icc-gold">Mission</h3>
              <p>The platform's mission is to equip users with decentralized tools that help identify and expose scams through token-based incentives and active community participation.</p>
            </div>
          </div>
        </section>

        {/* Core Features Overview */}
        <section>
          <h2 id="core-features">🎯 Core Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Scammer Reporting</h3>
              <p className="text-sm text-muted-foreground">Detailed reporting system with evidence upload</p>
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <Link to="/docs/features/reporting">Learn More</Link>
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Coins className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Bounty System</h3>
              <p className="text-sm text-muted-foreground">Token-based rewards for scammer exposure</p>
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <Link to="/docs/features/bounty">Learn More</Link>
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Community Features</h3>
              <p className="text-sm text-muted-foreground">Live chat, reactions, and user profiles</p>
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <Link to="/docs/features/community">Learn More</Link>
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Search className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">Robust filtering and navigation tools</p>
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <Link to="/docs/features/search">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 id="quick-links">🚀 Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-2">For Users</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/docs/guide/reports" className="text-icc-blue hover:underline">Creating Reports</Link></li>
                <li><Link to="/docs/guide/wallet" className="text-icc-blue hover:underline">Using Phantom Wallet</Link></li>
                <li><Link to="/docs/guide/bounties" className="text-icc-blue hover:underline">Managing Bounties</Link></li>
                <li><Link to="/docs/guide/community" className="text-icc-blue hover:underline">Community Participation</Link></li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-2">For Developers</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/docs/technical/architecture" className="text-icc-blue hover:underline">Architecture Overview</Link></li>
                <li><Link to="/docs/developer/api" className="text-icc-blue hover:underline">API Reference</Link></li>
                <li><Link to="/docs/developer/contributing" className="text-icc-blue hover:underline">Contributing Guide</Link></li>
                <li><Link to="/docs/developer/deployment" className="text-icc-blue hover:underline">Deployment Guide</Link></li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-2">Legal & Compliance</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/docs/legal/terms" className="text-icc-blue hover:underline">Terms of Service</Link></li>
                <li><Link to="/docs/legal/privacy" className="text-icc-blue hover:underline">Privacy Policy</Link></li>
                <li><Link to="/docs/legal/considerations" className="text-icc-blue hover:underline">Legal Considerations</Link></li>
                <li><Link to="/docs/legal/tokenomics" className="text-icc-blue hover:underline">Tokenomics</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Help */}
        <section className="bg-muted rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="mb-4">
            Can't find what you're looking for? Here are some ways to get help:
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="https://github.com/BOSC-DEV/sec-platform/issues" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Report Issue
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default DocsPage;
