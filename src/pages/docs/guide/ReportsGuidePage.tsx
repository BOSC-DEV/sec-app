
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { FileText, Upload, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ReportsGuidePage = () => {
  return (
    <DocsContent 
      title="Creating Reports" 
      description="Step-by-step guide to submitting reports and contributing to the SEC database"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Reporting Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Creating reports is the core mission of the SEC platform. Your reports help 
              protect the crypto community by exposing bad actors and preventing future victims. 
              Follow this guide to create effective, well-documented reports.
            </p>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p>Before creating reports, connect your Phantom wallet to authenticate your identity and enable features like bounty contributions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Check for Existing Reports</h3>
                <p>Search the database to ensure the subject hasn't already been reported. If they have, consider adding additional information or contributing to their bounty.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Gather Evidence</h3>
                <p>Collect all relevant evidence including screenshots, wallet addresses, communication records, and any other supporting documentation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Report Form Guide */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Filling Out the Report Form</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <AlertTriangle className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Required Information</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Subject Name:</strong> Primary name or alias</li>
                <li>• <strong>Accusation:</strong> Detailed description of the incident</li>
                <li>• <strong>Evidence:</strong> Supporting documentation or photos</li>
                <li>• <strong>Impact:</strong> Financial or other damages caused</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <CheckCircle className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Optional Enhancements</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Aliases:</strong> Additional names used</li>
                <li>• <strong>Wallet Addresses:</strong> Associated crypto wallets</li>
                <li>• <strong>Accomplices:</strong> Known associates</li>
                <li>• <strong>Links:</strong> Social media or website links</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Evidence Guidelines */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Evidence Guidelines</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Strong Evidence</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Screenshots of fraudulent communications</li>
                <li>• Blockchain transaction records</li>
                <li>• Verified wallet addresses involved in scams</li>
                <li>• Documentation of false promises or claims</li>
                <li>• Multiple victim testimonials</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Supporting Evidence</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• Social media profiles or posts</li>
                <li>• Website screenshots or archives</li>
                <li>• Community discussions about the individual</li>
                <li>• News articles or public records</li>
                <li>• Pattern recognition across multiple incidents</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Avoid Including</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• Personal information of victims</li>
                <li>• Unverified rumors or speculation</li>
                <li>• Private contact information</li>
                <li>• Content that could enable harassment</li>
                <li>• Copyrighted material without permission</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Photo Upload Guide */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Photo Upload Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">File Requirements</h3>
              <p className="text-sm">JPEG, PNG, or WebP format, maximum 5MB file size</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Search className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Image Quality</h3>
              <p className="text-sm">Clear, high-resolution images that clearly show evidence</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Privacy Protection</h3>
              <p className="text-sm">Redact personal information before uploading</p>
            </div>
          </div>
        </section>

        {/* Writing Effective Accusations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Writing Effective Accusations</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Structure Your Accusation</h3>
            <ol className="space-y-3">
              <li><strong>1. Summary:</strong> Brief overview of the scam type and impact</li>
              <li><strong>2. Timeline:</strong> When the scam occurred and how it unfolded</li>
              <li><strong>3. Methods:</strong> Specific tactics used by the scammer</li>
              <li><strong>4. Evidence:</strong> Reference to supporting documentation</li>
              <li><strong>5. Impact:</strong> Financial losses or other consequences</li>
              <li><strong>6. Warning:</strong> How others can avoid similar scams</li>
            </ol>
          </div>
        </section>

        {/* After Submission */}
        <section>
          <h2 className="text-2xl font-bold mb-6">After Submission</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <Clock className="h-8 w-8 text-icc-gold mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Processing Time</h3>
                <p>Reports are typically reviewed and published within 24-48 hours. Complex cases may take longer for thorough verification.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-icc-gold mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
                <p>Once published, community members can view, comment, and contribute bounties to your report. Monitor engagement and respond to questions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips for Success */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Tips for Successful Reports</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Be Thorough</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Include as much relevant detail as possible. More information helps the community make informed decisions.
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Stay Factual</h4>
              <p className="text-green-700 dark:text-green-300">
                Stick to verifiable facts and avoid emotional language. Let the evidence speak for itself.
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Protect Privacy</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Never include personal information of victims or enable doxxing of any individual.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Report a Scammer?</h2>
          <p className="mb-6">Help protect the crypto community by reporting bad actors and sharing your evidence.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/new-report">Create Report</Link>
          </Button>
        </section>
      </div>
    </DocsContent>
  );
};

export default ReportsGuidePage;
