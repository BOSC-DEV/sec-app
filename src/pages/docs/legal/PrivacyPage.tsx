
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Eye, Shield, Database, Users, Lock, Globe } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <DocsContent 
      title="Privacy Policy" 
      description="Our commitment to protecting your privacy and personal data on the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Privacy Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Eye className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Your privacy is fundamental to the SEC platform. This Privacy Policy explains 
              how we collect, use, protect, and handle your personal information when you 
              use our services.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 p-6">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Effective Date:</strong> January 1, 2024<br/>
              <strong>Last Updated:</strong> January 1, 2024
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-bold mb-6">1. Information We Collect</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Database className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Automatically Collected</h3>
              <ul className="space-y-2 text-sm">
                <li>• Wallet addresses (when connected)</li>
                <li>• IP addresses (hashed for privacy)</li>
                <li>• Browser type and version</li>
                <li>• Page views and navigation patterns</li>
                <li>• Device and screen information</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">User-Provided</h3>
              <ul className="space-y-2 text-sm">
                <li>• Profile information (display name, bio)</li>
                <li>• Reports and evidence</li>
                <li>• Comments and community interactions</li>
                <li>• Uploaded images and files</li>
                <li>• Social media links (optional)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-bold mb-6">2. How We Use Your Information</h2>
          <div className="space-y-6">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Platform Functionality</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Authenticate users and manage accounts</li>
                <li>• Display user profiles and contributions</li>
                <li>• Process bounty contributions and transfers</li>
                <li>• Enable community features and interactions</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Security and Safety</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Detect and prevent fraudulent activities</li>
                <li>• Identify patterns of abuse or manipulation</li>
                <li>• Protect against spam and unauthorized access</li>
                <li>• Maintain platform integrity and safety</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Analytics and Improvement</h4>
              <ul className="mt-2 space-y-1 text-purple-700 dark:text-purple-300">
                <li>• Analyze usage patterns and user behavior</li>
                <li>• Improve platform features and performance</li>
                <li>• Generate anonymous statistics and insights</li>
                <li>• Optimize user experience and interface</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-bold mb-6">3. Data Protection Measures</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Lock className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Encryption</h3>
              <p className="text-sm">All data is encrypted in transit and at rest using industry standards</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Access Control</h3>
              <p className="text-sm">Strict access controls and authentication for all data access</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Database className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Data Minimization</h3>
              <p className="text-sm">We collect only necessary data and delete it when no longer needed</p>
            </div>
          </div>
        </section>

        {/* Sharing and Disclosure */}
        <section>
          <h2 className="text-2xl font-bold mb-6">4. Information Sharing and Disclosure</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">We DO NOT sell personal information</h3>
            <p>
              SEC does not sell, rent, or trade personal information to third parties 
              for commercial purposes.
            </p>
            
            <h3 className="text-lg font-semibold">Limited Sharing Scenarios</h3>
            <div className="bg-muted rounded-lg p-6">
              <ul className="space-y-2">
                <li>• <strong>Public Information:</strong> Profile data you choose to make public</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or legal process</li>
                <li>• <strong>Security:</strong> To investigate fraud or security threats</li>
                <li>• <strong>Service Providers:</strong> With trusted partners who help operate the platform</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Blockchain Transparency */}
        <section>
          <h2 className="text-2xl font-bold mb-6">5. Blockchain and Public Information</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Important Notice</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Blockchain transactions are public and permanent. Information recorded on the 
              blockchain, including wallet addresses and transaction amounts, cannot be deleted 
              or made private.
            </p>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Wallet addresses are publicly visible</li>
              <li>• Transaction history is permanently recorded</li>
              <li>• Bounty contributions are publicly traceable</li>
              <li>• Consider privacy implications before transacting</li>
            </ul>
          </div>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-bold mb-6">6. Your Rights and Choices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Data Rights</h3>
              <ul className="space-y-2 text-sm">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate data</li>
                <li>• Delete your account and data</li>
                <li>• Export your data</li>
                <li>• Opt out of communications</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Privacy Controls</h3>
              <ul className="space-y-2 text-sm">
                <li>• Control profile visibility</li>
                <li>• Manage notification preferences</li>
                <li>• Choose what information to share</li>
                <li>• Disconnect wallet at any time</li>
                <li>• Request data deletion</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section>
          <h2 className="text-2xl font-bold mb-6">7. Cookies and Tracking</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How We Use Cookies</h3>
            <p>
              We use cookies and similar technologies to enhance your experience, 
              remember preferences, and analyze platform usage.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Essential</h4>
                <p className="text-sm">Required for platform functionality and security</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Analytics</h4>
                <p className="text-sm">Help us understand usage patterns and improve features</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Preferences</h4>
                <p className="text-sm">Remember your settings and customizations</p>
              </div>
            </div>
          </div>
        </section>

        {/* International Users */}
        <section>
          <h2 className="text-2xl font-bold mb-6">8. International Data Transfers</h2>
          <div className="p-6 bg-muted rounded-lg">
            <Globe className="h-8 w-8 text-icc-gold mb-4" />
            <h3 className="text-xl font-semibold mb-3">Global Platform</h3>
            <p className="mb-4">
              SEC is accessible worldwide, and data may be processed in different countries. 
              We ensure appropriate safeguards are in place for international data transfers.
            </p>
            <ul className="space-y-2">
              <li>• Data processing complies with applicable privacy laws</li>
              <li>• Appropriate security measures for cross-border transfers</li>
              <li>• Users rights protected regardless of location</li>
            </ul>
          </div>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-bold mb-6">9. Data Retention</h2>
          <div className="space-y-4">
            <p>
              We retain personal information only as long as necessary for the purposes 
              outlined in this policy or as required by law.
            </p>
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Retention Periods</h3>
              <ul className="space-y-2">
                <li>• Account data: Until account deletion requested</li>
                <li>• Analytics data: Anonymized after 2 years</li>
                <li>• Security logs: 1 year for security purposes</li>
                <li>• Public contributions: May remain for platform integrity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-bold mb-6">10. Children's Privacy</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Age Restrictions</h3>
            <p className="text-red-700 dark:text-red-300">
              SEC is not intended for users under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we become aware 
              of such collection, we will delete the information immediately.
            </p>
          </div>
        </section>

        {/* Policy Updates */}
        <section>
          <h2 className="text-2xl font-bold mb-6">11. Policy Updates</h2>
          <div className="space-y-4">
            <p>
              We may update this Privacy Policy to reflect changes in our practices 
              or applicable laws. Significant changes will be communicated through 
              the platform or via email.
            </p>
            <p>
              Continued use of the platform after policy updates constitutes acceptance 
              of the modified policy.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-bold mb-6">12. Contact Us</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Privacy Questions</h3>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <ul className="space-y-2">
              <li>• Email: privacy@sec-platform.com</li>
              <li>• Discord: https://discord.gg/sec</li>
              <li>• GitHub: https://github.com/BOSC-DEV/sec-platform/issues</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default PrivacyPage;
