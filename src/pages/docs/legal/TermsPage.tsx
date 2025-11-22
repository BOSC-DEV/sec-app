
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Scale, Shield, AlertTriangle, Users } from 'lucide-react';

const TermsPage = () => {
  return (
    <DocsContent 
      title="Terms of Service" 
      description="Legal terms and conditions for using the SEC platform and services"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Terms Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Scale className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              These Terms of Service govern your access to and use of the SEC (Scams and E-Crimes Commission) 
              platform. By accessing or using our services, you agree to be bound by these terms and our 
              Privacy Policy.
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mb-2" />
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Effective Date:</strong> January 1, 2024<br/>
              <strong>Last Updated:</strong> January 1, 2024
            </p>
          </div>
        </section>

        {/* Acceptance of Terms */}
        <section>
          <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
          <div className="space-y-4">
            <p>
              By accessing, browsing, or using the SEC platform (the "Service"), you acknowledge 
              that you have read, understood, and agree to be bound by these Terms of Service 
              ("Terms") and to comply with all applicable laws and regulations.
            </p>
            <p>
              If you do not agree with these Terms, you are prohibited from using or accessing 
              this site and must discontinue use immediately.
            </p>
          </div>
        </section>

        {/* Platform Description */}
        <section>
          <h2 className="text-2xl font-bold mb-6">2. Platform Description</h2>
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Service Overview</h3>
            <p className="mb-4">
              SEC is a decentralized platform that allows users to:
            </p>
            <ul className="space-y-2">
              <li>• Report and document cryptocurrency scams and fraudulent activities</li>
              <li>• Contribute to bounties for scammer information</li>
              <li>• Participate in community discussions about security</li>
              <li>• Access a database of known scammers and fraudulent entities</li>
              <li>• Connect with other security-minded community members</li>
            </ul>
          </div>
        </section>

        {/* User Responsibilities */}
        <section>
          <h2 className="text-2xl font-bold mb-6">3. User Responsibilities</h2>
          <div className="space-y-6">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Permitted Uses</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Report legitimate scammer activities with evidence</li>
                <li>• Participate constructively in community discussions</li>
                <li>• Contribute accurate information and documentation</li>
                <li>• Use the platform for educational and preventive purposes</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Prohibited Activities</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• Submitting false, misleading, or defamatory information</li>
                <li>• Harassment, doxxing, or personal attacks against any individual</li>
                <li>• Using the platform for illegal activities or fraud</li>
                <li>• Attempting to manipulate or game the bounty system</li>
                <li>• Sharing personal information without consent</li>
                <li>• Circumventing security measures or platform restrictions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Content and Liability */}
        <section>
          <h2 className="text-2xl font-bold mb-6">4. Content and Liability</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User-Generated Content</h3>
            <p>
              Users are solely responsible for the content they submit, including reports, 
              comments, and evidence. All content must be factual, evidence-based, and 
              comply with applicable laws.
            </p>
            
            <h3 className="text-lg font-semibold">Platform Liability</h3>
            <p>
              SEC provides a platform for information sharing but does not verify, 
              endorse, or guarantee the accuracy of user-submitted content. Users 
              should conduct their own due diligence before making decisions based 
              on platform information.
            </p>
          </div>
        </section>

        {/* Wallet and Token Terms */}
        <section>
          <h2 className="text-2xl font-bold mb-6">5. Wallet Connection and Tokens</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Wallet Responsibility</h3>
            <ul className="space-y-2">
              <li>• Users are solely responsible for their wallet security</li>
              <li>• SEC never requests or stores private keys or seed phrases</li>
              <li>• All token transactions are irreversible once confirmed</li>
              <li>• Users assume all risks associated with cryptocurrency usage</li>
              <li>• Network fees and transaction costs are the user's responsibility</li>
            </ul>
          </div>
        </section>

        {/* Privacy and Data */}
        <section>
          <h2 className="text-2xl font-bold mb-6">6. Privacy and Data Handling</h2>
          <div className="space-y-4">
            <p>
              Your privacy is important to us. Please review our Privacy Policy, 
              which describes how we collect, use, and protect your information.
            </p>
            <p>
              By using the platform, you consent to the collection and use of 
              information in accordance with our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold mb-6">7. Intellectual Property</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Platform Rights</h3>
              <p className="text-sm">
                SEC owns all rights to the platform's design, code, and original content. 
                Users may not copy, modify, or distribute our intellectual property 
                without permission.
              </p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">User Content Rights</h3>
              <p className="text-sm">
                Users retain ownership of their submitted content but grant SEC 
                a license to display, distribute, and use the content for platform 
                operations and improvements.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers */}
        <section>
          <h2 className="text-2xl font-bold mb-6">8. Disclaimers</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <Shield className="h-6 w-6 text-red-600 mb-3" />
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Important Disclaimers</h3>
            <ul className="space-y-2 text-red-700 dark:text-red-300">
              <li>• The platform is provided "as is" without warranties of any kind</li>
              <li>• SEC is not responsible for financial losses or damages</li>
              <li>• Information accuracy is not guaranteed or verified</li>
              <li>• Users should not rely solely on platform information for decisions</li>
              <li>• Cryptocurrency investments carry inherent risks</li>
            </ul>
          </div>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-bold mb-6">9. Account Termination</h2>
          <div className="space-y-4">
            <p>
              SEC reserves the right to suspend or terminate user access for 
              violations of these Terms, illegal activities, or at our sole discretion.
            </p>
            <p>
              Users may discontinue use of the platform at any time. Upon termination, 
              these Terms will remain in effect regarding previously submitted content.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-bold mb-6">10. Governing Law</h2>
          <div className="p-6 bg-muted rounded-lg">
            <p>
              These Terms are governed by and construed in accordance with applicable 
              international laws and regulations regarding digital platforms and 
              cryptocurrency services.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <section>
          <h2 className="text-2xl font-bold mb-6">11. Changes to Terms</h2>
          <div className="space-y-4">
            <p>
              SEC reserves the right to modify these Terms at any time. Changes will 
              be effective immediately upon posting. Continued use of the platform 
              constitutes acceptance of modified Terms.
            </p>
            <p>
              Users are encouraged to review these Terms periodically for updates.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-bold mb-6">12. Contact Information</h2>
          <div className="bg-muted rounded-lg p-6">
            <Users className="h-8 w-8 text-icc-gold mb-4" />
            <h3 className="text-xl font-semibold mb-3">Questions or Concerns</h3>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2">
              <li>• Email: legal@sec-platform.com</li>
              <li>• Discord: https://discord.gg/sec</li>
              <li>• GitHub: https://github.com/BOSC-DEV/sec-platform</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default TermsPage;
