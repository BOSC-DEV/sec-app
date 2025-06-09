
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Shield, Lock, Eye, Server, AlertTriangle, Key } from 'lucide-react';

const SecurityPage = () => {
  return (
    <DocsContent 
      title="Security Features" 
      description="Comprehensive security measures and protocols protecting the SEC platform and user data"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Security Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Shield className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Security is paramount in the SEC platform. We implement multiple layers of 
              protection including database-level security, encrypted communications, 
              secure authentication, and comprehensive monitoring to ensure user safety 
              and data integrity.
            </p>
          </div>
        </section>

        {/* Authentication Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Authentication & Access Control</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Key className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Wallet-Based Authentication</h3>
              <p className="mb-4">
                Secure Web3 authentication using Phantom wallet signatures.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Cryptographic signature verification</li>
                <li>• No password storage required</li>
                <li>• Message signing for authentication</li>
                <li>• Session management with JWT tokens</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Lock className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Session Security</h3>
              <p className="mb-4">
                Secure session management with automatic token refresh.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• JWT token with expiration</li>
                <li>• Secure HTTP-only cookies</li>
                <li>• Automatic session refresh</li>
                <li>• Session invalidation on logout</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Database Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Database Security</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Row Level Security (RLS)</h3>
                <p>PostgreSQL RLS policies ensure users can only access data they're authorized to see.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• User-specific data isolation</li>
                  <li>• Role-based access control</li>
                  <li>• Policy enforcement at database level</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Encryption</h3>
                <p>All data is encrypted in transit and at rest using industry-standard encryption.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• AES-256 encryption at rest</li>
                  <li>• Encrypted database backups</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Input Validation</h3>
                <p>Comprehensive validation prevents SQL injection and other database attacks.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Parameterized queries</li>
                  <li>• Input sanitization</li>
                  <li>• Type checking and validation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Application Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Application Security</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Server className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">HTTPS Enforcement</h3>
              <p className="text-sm">All communications encrypted with TLS certificates</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Eye className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Content Security Policy</h3>
              <p className="text-sm">CSP headers prevent XSS and code injection attacks</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Rate Limiting</h3>
              <p className="text-sm">API rate limiting prevents abuse and DDoS attacks</p>
            </div>
          </div>
        </section>

        {/* Privacy Protection */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Privacy Protection</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Data Minimization</h4>
              <p className="text-blue-700 dark:text-blue-300">
                We collect only necessary data and implement automatic data retention policies
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">IP Address Hashing</h4>
              <p className="text-green-700 dark:text-green-300">
                IP addresses are hashed for analytics while preserving user anonymity
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">User Control</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Users have full control over their profiles and can delete their data
              </p>
            </div>
          </div>
        </section>

        {/* File Upload Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">File Upload Security</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Secure File Handling</h3>
            <p className="mb-4">
              All file uploads are processed through secure channels with comprehensive validation.
            </p>
            <ul className="space-y-2">
              <li>• File type validation and filtering</li>
              <li>• Maximum file size enforcement</li>
              <li>• Virus scanning for uploaded files</li>
              <li>• Secure file storage with access controls</li>
              <li>• Image processing and optimization</li>
              <li>• Automatic malware detection</li>
            </ul>
          </div>
        </section>

        {/* Monitoring & Incident Response */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Monitoring & Incident Response</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <AlertTriangle className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Security Monitoring</h3>
              <ul className="space-y-2 text-sm">
                <li>• Real-time threat detection</li>
                <li>• Automated security alerts</li>
                <li>• Access log monitoring</li>
                <li>• Anomaly detection systems</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Shield className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Incident Response</h3>
              <ul className="space-y-2 text-sm">
                <li>• 24/7 security monitoring</li>
                <li>• Rapid incident response team</li>
                <li>• Automated threat mitigation</li>
                <li>• Post-incident analysis and reporting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Compliance & Standards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Compliance & Standards</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Security Standards</h4>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• OWASP Top 10 compliance</li>
                <li>• SOC 2 Type II controls</li>
                <li>• ISO 27001 security practices</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Data Protection</h4>
              <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                <li>• GDPR compliance for EU users</li>
                <li>• CCPA compliance for California residents</li>
                <li>• Regular privacy impact assessments</li>
                <li>• Data breach notification procedures</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security Best Practices for Users</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">User Security Guidelines</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Keep your Phantom wallet secure and up to date</li>
              <li>• Never share your private keys or seed phrases</li>
              <li>• Verify URLs before connecting your wallet</li>
              <li>• Report suspicious activities immediately</li>
              <li>• Use strong, unique passwords for related accounts</li>
              <li>• Enable two-factor authentication where available</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default SecurityPage;
