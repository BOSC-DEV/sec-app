
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { AlertTriangle, Upload, Shield, CheckCircle, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ReportingPage = () => {
  return (
    <DocsContent 
      title="Scammer Reporting System" 
      description="Learn how to effectively report scammers and contribute to community safety"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Reporting Overview</h2>
          <div className="bg-muted rounded-lg p-6 mb-6">
            <p className="text-lg">
              The SEC reporting system is the cornerstone of our platform, allowing community members 
              to document and expose fraudulent activities. Every report contributes to building a 
              comprehensive database of known scammers and their tactics.
            </p>
          </div>
        </section>

        {/* How to Report */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How to Submit a Report</h2>
          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p>You must connect your Phantom wallet to submit reports. This ensures accountability and prevents spam.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Gather Evidence</h3>
                <p>Collect screenshots, transaction IDs, wallet addresses, and any other relevant documentation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fill the Report Form</h3>
                <p>Provide detailed information about the scammer, including names, aliases, and methods used.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Evidence</h3>
                <p>Attach photos, screenshots, and documents that support your report.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Required Information */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Required Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Basic Details</h3>
              <ul className="space-y-2">
                <li>• Scammer's name or pseudonym</li>
                <li>• Known aliases</li>
                <li>• Description of the scam</li>
                <li>• Date of incident</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Technical Evidence</h3>
              <ul className="space-y-2">
                <li>• Wallet addresses involved</li>
                <li>• Transaction signatures</li>
                <li>• Social media profiles</li>
                <li>• Website URLs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Reporting Best Practices</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">Do</h4>
                <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                  <li>• Be as detailed and specific as possible</li>
                  <li>• Include multiple forms of evidence</li>
                  <li>• Double-check all wallet addresses</li>
                  <li>• Use clear, high-quality screenshots</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200">Don't</h4>
                <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                  <li>• Submit false or unverified information</li>
                  <li>• Include personal identifying information</li>
                  <li>• Make accusations without evidence</li>
                  <li>• Duplicate existing reports</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Community Verification */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Verification</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-6 text-white mb-6">
            <Users className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Peer Review Process</h3>
            <p>
              Once submitted, your report becomes visible to the community for verification. 
              Other users can like, comment, and add additional evidence to strengthen the case.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Report?</h2>
          <p className="mb-6">Help protect the community by reporting known scammers and fraudulent activities.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/new-report">Submit a Report</Link>
          </Button>
        </section>
      </div>
    </DocsContent>
  );
};

export default ReportingPage;
