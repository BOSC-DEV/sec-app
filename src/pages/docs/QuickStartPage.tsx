
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import CodeBlock from '@/components/docs/CodeBlock';
import { Button } from '@/components/ui/button';
import { CheckCircle, Wallet, FileText, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickStartPage = () => {
  return (
    <DocsContent 
      title="Quick Start Guide" 
      description="Get up and running with SEC in minutes"
    >
      <div className="space-y-8">
        {/* Prerequisites */}
        <section>
          <h2 id="prerequisites">Prerequisites</h2>
          <p>Before you begin, make sure you have:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
            <li>Phantom wallet extension installed</li>
            <li>Some SOL for transaction fees (optional for browsing)</li>
          </ul>
        </section>

        {/* Step-by-step guide */}
        <section>
          <h2 id="getting-started">Getting Started</h2>
          <div className="space-y-6 mt-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-icc-gold text-icc-blue-dark rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Install Phantom Wallet
                </h3>
                <p className="mb-3">
                  First, install the Phantom wallet browser extension. This will allow you to connect 
                  your wallet and interact with the SEC platform.
                </p>
                <Button variant="outline" asChild>
                  <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
                    Download Phantom
                  </a>
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-icc-gold text-icc-blue-dark rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="mb-3">
                  Navigate to SEC.digital and click the "Connect Wallet" button in the top right corner. 
                  Follow the prompts to connect your Phantom wallet.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> You can browse the platform without connecting a wallet, 
                    but you'll need to connect to report scammers or participate in bounties.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-icc-gold text-icc-blue-dark rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Create Your First Report
                </h3>
                <p className="mb-3">
                  Ready to report a scammer? Navigate to the Report page and fill out the form 
                  with as much detail as possible.
                </p>
                <Button variant="iccblue" asChild>
                  <Link to="/new-report">Start Reporting</Link>
                </Button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-icc-gold text-icc-blue-dark rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Participate in Bounties
                </h3>
                <p className="mb-3">
                  Browse the Most Wanted section to see active bounties. You can contribute 
                  SEC tokens to increase bounties or claim rewards for providing information.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/most-wanted">View Most Wanted</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key concepts */}
        <section>
          <h2 id="key-concepts">Key Concepts</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Scammer Reports</h3>
              <p className="text-sm">
                Detailed submissions containing information about known scammers, 
                including wallet addresses, accusations, and supporting evidence.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Bounties</h3>
              <p className="text-sm">
                SEC token rewards placed on scammer reports to incentivize 
                information gathering and community participation.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Badge System</h3>
              <p className="text-sm">
                Tiered recognition system based on SEC token holdings, 
                from "Shrimp" to "Whale" with special privileges.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm">
                Interactive features including live chat, reactions, 
                and collaborative information sharing.
              </p>
            </div>
          </div>
        </section>

        {/* Common tasks */}
        <section>
          <h2 id="common-tasks">Common Tasks</h2>
          <div className="space-y-4 mt-4">
            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium hover:bg-muted">
                How to submit a high-quality scammer report
              </summary>
              <div className="p-4 pt-0 space-y-3">
                <p>Follow these guidelines for effective reporting:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Include all known wallet addresses</li>
                  <li>Provide clear description of the scam</li>
                  <li>Upload supporting evidence (screenshots, etc.)</li>
                  <li>Add relevant social media links</li>
                  <li>Use descriptive tags for better discoverability</li>
                </ul>
              </div>
            </details>
            
            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium hover:bg-muted">
                How to contribute to bounties
              </summary>
              <div className="p-4 pt-0 space-y-3">
                <p>To contribute SEC tokens to a bounty:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Navigate to a scammer's detail page</li>
                  <li>Click "Contribute to Bounty"</li>
                  <li>Enter the amount of SEC tokens</li>
                  <li>Confirm the transaction in your Phantom wallet</li>
                  <li>Wait for blockchain confirmation</li>
                </ol>
              </div>
            </details>
            
            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-medium hover:bg-muted">
                How to search for specific scammers
              </summary>
              <div className="p-4 pt-0 space-y-3">
                <p>Use the advanced search features:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Search by name, alias, or wallet address</li>
                  <li>Filter by accusation type or bounty amount</li>
                  <li>Sort by recency, popularity, or bounty size</li>
                  <li>Use the "Most Wanted" section for high-priority cases</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Next steps */}
        <section className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">🎉 You're Ready!</h2>
          <p className="mb-4">
            You now have everything you need to start using SEC effectively. 
            Here are some recommended next steps:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 text-icc-gold" />
              <div>
                <p className="font-medium">Explore the platform</p>
                <p className="text-sm opacity-90">Browse existing reports and familiarize yourself with the interface</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 text-icc-gold" />
              <div>
                <p className="font-medium">Join the community</p>
                <p className="text-sm opacity-90">Participate in discussions and help others identify scams</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 text-icc-gold" />
              <div>
                <p className="font-medium">Read the guides</p>
                <p className="text-sm opacity-90">Learn advanced features and best practices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 text-icc-gold" />
              <div>
                <p className="font-medium">Stay updated</p>
                <p className="text-sm opacity-90">Follow announcements and platform updates</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default QuickStartPage;
