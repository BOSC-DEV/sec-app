
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Wallet, Download, Shield, Key, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WalletGuidePage = () => {
  return (
    <DocsContent 
      title="Using Phantom Wallet" 
      description="Complete guide to setting up and using Phantom wallet with the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Phantom Wallet Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Wallet className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Phantom is the recommended Solana wallet for the SEC platform. It provides secure 
              authentication, token management, and seamless integration with our bounty system. 
              This guide will help you set up and use Phantom effectively.
            </p>
          </div>
        </section>

        {/* Installation */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Installing Phantom Wallet</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Download className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Browser Extension</h3>
              <p className="mb-4">
                Install Phantom as a browser extension for Chrome, Firefox, Brave, or Edge.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Visit phantom.app</li>
                <li>• Click "Download" for your browser</li>
                <li>• Add to browser extensions</li>
                <li>• Pin the extension for easy access</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
              <p className="mb-4">
                Download the Phantom mobile app for iOS or Android devices.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Available on App Store and Google Play</li>
                <li>• Sync with browser extension</li>
                <li>• Mobile-optimized interface</li>
                <li>• Biometric authentication support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Wallet Setup */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Setting Up Your Wallet</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create New Wallet</h3>
                <p>Open Phantom and choose "Create a new wallet" if you're new to Solana wallets.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Your Seed Phrase</h3>
                <p>Write down your 12-word recovery phrase and store it securely offline. Never share this with anyone.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Password</h3>
                <p>Create a strong password to protect your wallet on this device.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Import Existing Wallet</h3>
                <p>If you already have a Solana wallet, choose "Import wallet" and enter your seed phrase.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Connecting to SEC */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Connecting to SEC Platform</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Key className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm">Click "Connect Wallet" and approve the connection request</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Message Signing</h3>
              <p className="text-sm">Sign authentication messages to verify wallet ownership</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Ready to Use</h3>
              <p className="text-sm">Access all SEC features including bounties and profile management</p>
            </div>
          </div>
        </section>

        {/* Managing SEC Tokens */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Managing SEC Tokens</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Token Operations</h3>
            <p className="mb-4">
              Use your Phantom wallet to manage SEC tokens for bounty contributions and platform features.
            </p>
            <ul className="space-y-2">
              <li>• View your SEC token balance in the wallet</li>
              <li>• Send and receive SEC tokens to/from other users</li>
              <li>• Contribute tokens to scammer bounties</li>
              <li>• Transfer bounties between reports</li>
              <li>• Monitor transaction history</li>
              <li>• Check token prices and market data</li>
            </ul>
          </div>
        </section>

        {/* Wallet Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Wallet Security Best Practices</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Critical Security Rules</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• Never share your seed phrase with anyone</li>
                <li>• Don't store seed phrases digitally or in photos</li>
                <li>• Always verify website URLs before connecting</li>
                <li>• Use hardware wallets for large amounts</li>
                <li>• Enable all available security features</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">General Security Tips</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• Keep your browser and extension updated</li>
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication where possible</li>
                <li>• Regularly check transaction history</li>
                <li>• Be cautious of phishing attempts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Common Issues & Solutions</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Connection Issues</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Refresh the page and try connecting again</li>
                <li>• Check that Phantom extension is enabled</li>
                <li>• Clear browser cache and cookies</li>
                <li>• Try a different browser or incognito mode</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Transaction Problems</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Ensure sufficient SOL for transaction fees</li>
                <li>• Check network status and congestion</li>
                <li>• Wait for previous transactions to confirm</li>
                <li>• Verify recipient addresses before sending</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Token Display Issues</h4>
              <ul className="mt-2 space-y-1 text-purple-700 dark:text-purple-300">
                <li>• Add SEC token manually if not visible</li>
                <li>• Check if you're on the correct Solana network</li>
                <li>• Refresh token balances in wallet settings</li>
                <li>• Verify token contract address</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Advanced Phantom Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">DeFi Integration</h3>
              <ul className="space-y-2 text-sm">
                <li>• Swap tokens directly in wallet</li>
                <li>• Access to Solana DeFi protocols</li>
                <li>• Staking and yield farming</li>
                <li>• NFT collection management</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Portfolio Tracking</h3>
              <ul className="space-y-2 text-sm">
                <li>• Real-time token prices</li>
                <li>• Portfolio value tracking</li>
                <li>• Transaction history analysis</li>
                <li>• Performance metrics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Warning Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Important Warnings</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Security Reminders</h3>
            <ul className="space-y-2 text-red-700 dark:text-red-300">
              <li>• SEC platform will never ask for your seed phrase</li>
              <li>• Always verify you're on the correct SEC website URL</li>
              <li>• Be cautious of fake Phantom extensions or apps</li>
              <li>• Report suspicious activity to our support team</li>
              <li>• Keep small amounts in hot wallets, larger amounts in cold storage</li>
            </ul>
          </div>
        </section>

        {/* Support */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Need Help with Phantom?</h2>
          <p className="mb-6">Visit Phantom's official support resources or contact our team for SEC-specific issues.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" asChild>
              <a href="https://help.phantom.app" target="_blank" rel="noopener noreferrer">
                Phantom Help Center
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://discord.gg/phantom" target="_blank" rel="noopener noreferrer">
                Phantom Discord
              </a>
            </Button>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default WalletGuidePage;
