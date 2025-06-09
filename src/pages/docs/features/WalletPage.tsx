
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Wallet, Download, Shield, Zap, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WalletPage = () => {
  return (
    <DocsContent 
      title="Phantom Wallet Integration" 
      description="Learn how to connect and use Phantom wallet with the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Why Phantom Wallet?</h2>
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-8 text-white mb-6">
            <Wallet className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Phantom is the leading Solana wallet that provides secure, fast, and user-friendly 
              access to the Solana ecosystem. It's required for all SEC platform interactions 
              to ensure security and accountability.
            </p>
          </div>
        </section>

        {/* Installation */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Installation Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <Download className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Browser Extension</h3>
              <p className="mb-4">Install Phantom as a browser extension for desktop use:</p>
              <ul className="space-y-2 mb-4">
                <li>• Chrome Web Store</li>
                <li>• Firefox Add-ons</li>
                <li>• Edge Add-ons</li>
                <li>• Brave Browser</li>
              </ul>
              <Button variant="outline" asChild>
                <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Extension
                </a>
              </Button>
            </div>
            <div className="p-6 border rounded-lg">
              <Zap className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
              <p className="mb-4">Get Phantom on your mobile device:</p>
              <ul className="space-y-2 mb-4">
                <li>• iOS App Store</li>
                <li>• Google Play Store</li>
                <li>• Direct APK download</li>
              </ul>
              <Button variant="outline" asChild>
                <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Mobile App
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Setup Process */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Setting Up Your Wallet</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create New Wallet</h3>
                <p>Download and install Phantom, then create a new wallet or import an existing one using your seed phrase.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Your Seed Phrase</h3>
                <p>Write down your 12-word recovery phrase and store it safely. Never share it with anyone!</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fund Your Wallet</h3>
                <p>Add SOL to your wallet to pay for transaction fees (usually just a few cents per transaction).</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect to SEC</h3>
                <p>Visit the SEC platform and click "Connect Wallet" to link your Phantom wallet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Wallet Features on SEC</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Secure Authentication</h3>
              <p className="text-sm">Your wallet serves as your secure login to the platform</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Bounty Contributions</h3>
              <p className="text-sm">Contribute SOL to bounties for exposing scammers</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Profile Verification</h3>
              <p className="text-sm">Verified wallet ownership ensures authentic user profiles</p>
            </div>
          </div>
        </section>

        {/* Security Tips */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security Best Practices</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Important Security Tips</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Never share your seed phrase with anyone</li>
              <li>• Always verify the SEC website URL before connecting</li>
              <li>• Only connect to trusted applications</li>
              <li>• Keep your Phantom extension updated</li>
              <li>• Use hardware wallets for large amounts</li>
              <li>• Be cautious of phishing attempts</li>
            </ul>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Common Issues & Solutions</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Wallet Won't Connect</h4>
              <p className="text-muted-foreground">Make sure Phantom is installed and unlocked. Try refreshing the page and clicking connect again.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Transaction Failed</h4>
              <p className="text-muted-foreground">Ensure you have enough SOL for transaction fees. Network congestion may also cause delays.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Profile Not Loading</h4>
              <p className="text-muted-foreground">Disconnect and reconnect your wallet. Clear browser cache if the issue persists.</p>
            </div>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default WalletPage;
