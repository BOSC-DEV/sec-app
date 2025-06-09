
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { AlertTriangle, Scale, Globe, Shield, Users, FileText } from 'lucide-react';

const LegalConsiderationsPage = () => {
  return (
    <DocsContent 
      title="Legal Considerations" 
      description="Important legal information and considerations for using the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Legal Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Scale className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform operates in a complex legal environment involving 
              cryptocurrency, data protection, and user-generated content. This page 
              outlines important legal considerations for platform operators and users.
            </p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
            <p className="text-red-800 dark:text-red-200">
              <strong>Disclaimer:</strong> This information is for educational purposes only 
              and does not constitute legal advice. Consult qualified legal professionals 
              for specific legal guidance.
            </p>
          </div>
        </section>

        {/* Jurisdictional Considerations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">1. Jurisdictional Considerations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Globe className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Global Platform Challenges</h3>
              <ul className="space-y-2 text-sm">
                <li>• Multiple legal jurisdictions apply</li>
                <li>• Varying cryptocurrency regulations</li>
                <li>• Different data protection laws</li>
                <li>• Cross-border enforcement issues</li>
                <li>• Conflicting legal requirements</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compliance Strategy</h3>
              <ul className="space-y-2 text-sm">
                <li>• Follow highest common standards</li>
                <li>• Implement robust privacy protections</li>
                <li>• Maintain detailed records</li>
                <li>• Engage local legal counsel</li>
                <li>• Monitor regulatory changes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Defamation and Liability */}
        <section>
          <h2 className="text-2xl font-bold mb-6">2. Defamation and Content Liability</h2>
          <div className="space-y-6">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Key Risks</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• False accusations against individuals</li>
                <li>• Defamatory statements in comments</li>
                <li>• Unverified claims without evidence</li>
                <li>• Malicious reporting by bad actors</li>
                <li>• Platform liability for user content</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Mitigation Strategies</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Require evidence for all reports</li>
                <li>• Implement content moderation</li>
                <li>• Provide dispute resolution mechanisms</li>
                <li>• Maintain safe harbor protections</li>
                <li>• Clear community guidelines</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cryptocurrency Regulations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">3. Cryptocurrency and Token Regulations</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Regulatory Landscape</h3>
            <p>
              Cryptocurrency regulations vary significantly by jurisdiction and continue 
              to evolve. Key considerations include:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Token Classification</h4>
                <p className="text-sm">Whether SEC tokens constitute securities, utilities, or commodities</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">AML/KYC Requirements</h4>
                <p className="text-sm">Anti-money laundering and know-your-customer obligations</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <h4 className="font-semibold mb-2">Tax Implications</h4>
                <p className="text-sm">Tax reporting requirements for token transactions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection Laws */}
        <section>
          <h2 className="text-2xl font-bold mb-6">4. Data Protection and Privacy Laws</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">GDPR Compliance (EU)</h3>
              <ul className="space-y-2 text-sm">
                <li>• Right to be forgotten</li>
                <li>• Data portability requirements</li>
                <li>• Consent mechanisms</li>
                <li>• Data breach notifications</li>
                <li>• Privacy by design principles</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Other Privacy Laws</h3>
              <ul className="space-y-2 text-sm">
                <li>• CCPA (California)</li>
                <li>• PIPEDA (Canada)</li>
                <li>• LGPD (Brazil)</li>
                <li>• Various national laws</li>
                <li>• Sector-specific regulations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Platform Liability */}
        <section>
          <h2 className="text-2xl font-bold mb-6">5. Platform Liability Protection</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Safe Harbor Provisions</h3>
            <p>
              Various jurisdictions provide liability protections for platforms that 
              host user-generated content, subject to certain conditions:
            </p>
            
            <div className="bg-muted rounded-lg p-6">
              <h4 className="font-semibold mb-3">Key Requirements</h4>
              <ul className="space-y-2">
                <li>• No knowledge of illegal content</li>
                <li>• Prompt removal upon notice</li>
                <li>• Good faith cooperation with authorities</li>
                <li>• Reasonable content moderation efforts</li>
                <li>• Clear terms of service</li>
                <li>• Proper user notification procedures</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold mb-6">6. Intellectual Property Considerations</h2>
          <div className="space-y-6">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Copyright Issues</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• User-uploaded images and documents</li>
                <li>• DMCA takedown procedures</li>
                <li>• Fair use considerations</li>
                <li>• Attribution requirements</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Trademark Concerns</h4>
              <ul className="mt-2 space-y-1 text-purple-700 dark:text-purple-300">
                <li>• Use of company names in reports</li>
                <li>• Logo and brand mark usage</li>
                <li>• Domain name disputes</li>
                <li>• Platform branding protection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Law Enforcement Cooperation */}
        <section>
          <h2 className="text-2xl font-bold mb-6">7. Law Enforcement Cooperation</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Cooperation Framework</h3>
            <p className="mb-4">
              The platform maintains procedures for cooperating with legitimate 
              law enforcement requests while protecting user privacy:
            </p>
            <ul className="space-y-2">
              <li>• Valid legal process requirements</li>
              <li>• User notification policies</li>
              <li>• Data preservation procedures</li>
              <li>• Emergency disclosure protocols</li>
              <li>• Transparency reporting</li>
            </ul>
          </div>
        </section>

        {/* International Sanctions */}
        <section>
          <h2 className="text-2xl font-bold mb-6">8. International Sanctions and Restrictions</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Compliance Requirements</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• OFAC sanctions list screening</li>
                <li>• EU sanctions compliance</li>
                <li>• UN Security Council restrictions</li>
                <li>• Export control regulations</li>
                <li>• Country-specific restrictions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section>
          <h2 className="text-2xl font-bold mb-6">9. Legal Risk Management</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Preventive Measures</h3>
              <ul className="space-y-2 text-sm">
                <li>• Regular legal compliance audits</li>
                <li>• Staff training on legal requirements</li>
                <li>• Clear policies and procedures</li>
                <li>• Insurance coverage evaluation</li>
                <li>• Incident response planning</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Monitoring Activities</h3>
              <ul className="space-y-2 text-sm">
                <li>• Regulatory change tracking</li>
                <li>• Legal threat assessment</li>
                <li>• User complaint analysis</li>
                <li>• Content moderation metrics</li>
                <li>• Compliance reporting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section>
          <h2 className="text-2xl font-bold mb-6">10. Dispute Resolution</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Multi-Tiered Approach</h3>
            <p>
              The platform implements a structured approach to resolving disputes:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded">
                <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold">Internal Resolution</h4>
                  <p className="text-sm">Platform moderation and community guidelines enforcement</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border rounded">
                <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold">Mediation</h4>
                  <p className="text-sm">Third-party mediation for complex disputes</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border rounded">
                <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold">Legal Process</h4>
                  <p className="text-sm">Court proceedings when necessary</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Advice */}
        <section>
          <h2 className="text-2xl font-bold mb-6">11. Seeking Professional Legal Advice</h2>
          <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">When to Consult Lawyers</h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-300">
              <li>• Before launching in new jurisdictions</li>
              <li>• When facing legal challenges or threats</li>
              <li>• For complex regulatory compliance</li>
              <li>• During significant platform changes</li>
              <li>• For intellectual property protection</li>
              <li>• When handling law enforcement requests</li>
            </ul>
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-bold mb-6">12. Important Disclaimer</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <AlertTriangle className="h-6 w-6 text-red-600 mb-3" />
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Legal Disclaimer</h3>
            <p className="text-red-700 dark:text-red-300">
              This information is provided for educational purposes only and does not 
              constitute legal advice. Laws vary by jurisdiction and change frequently. 
              Always consult with qualified legal professionals who specialize in 
              cryptocurrency, technology, and relevant jurisdictional law before 
              making important legal decisions.
            </p>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default LegalConsiderationsPage;
