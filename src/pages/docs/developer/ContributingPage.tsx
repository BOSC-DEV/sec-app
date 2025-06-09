
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { GitBranch, Code, Users, Bug, Lightbulb, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContributingPage = () => {
  return (
    <DocsContent 
      title="Contributing to SEC" 
      description="Learn how to contribute to the SEC platform development and help improve the crypto security ecosystem"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Contributing Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Users className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              The SEC platform thrives on community contributions. Whether you're a developer, 
              designer, security researcher, or documentation writer, there are many ways to 
              help improve the platform and make crypto safer for everyone.
            </p>
          </div>
        </section>

        {/* Ways to Contribute */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Ways to Contribute</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Code className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Code Contributions</h3>
              <ul className="space-y-2 text-sm">
                <li>• Feature development and enhancements</li>
                <li>• Bug fixes and performance improvements</li>
                <li>• UI/UX improvements</li>
                <li>• Testing and quality assurance</li>
                <li>• Security audits and fixes</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Lightbulb className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Non-Code Contributions</h3>
              <ul className="space-y-2 text-sm">
                <li>• Documentation improvements</li>
                <li>• Design and user experience</li>
                <li>• Community moderation</li>
                <li>• Translation and localization</li>
                <li>• Beta testing and feedback</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Join Our Community</h3>
                <p>Connect with other contributors through our Discord server and GitHub discussions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fork the Repository</h3>
                <p>Create your own fork of the SEC platform repository on GitHub to start making changes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Up Development Environment</h3>
                <p>Follow our development setup guide to get the platform running locally on your machine.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Development Setup */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Development Environment Setup</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
            <ul className="space-y-2 mb-6">
              <li>• Node.js 18+ and npm/yarn</li>
              <li>• Git for version control</li>
              <li>• Code editor (VS Code recommended)</li>
              <li>• Phantom wallet for testing</li>
            </ul>
            
            <h4 className="font-semibold mb-3">Installation Steps</h4>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              {`# Clone your fork
git clone https://github.com/your-username/sec-platform.git
cd sec-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev`}
            </div>
          </div>
        </section>

        {/* Contribution Workflow */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Contribution Workflow</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <GitBranch className="h-8 w-8 text-icc-gold mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Branch Strategy</h3>
                <p>Create feature branches from the main branch for all contributions.</p>
                <div className="mt-2 bg-black text-green-400 p-2 rounded font-mono text-sm">
                  git checkout -b feature/your-feature-name
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <Code className="h-8 w-8 text-icc-gold mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Code Quality</h3>
                <p>Follow our coding standards and ensure all tests pass before submitting.</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Run eslint and prettier</li>
                  <li>• Write tests for new features</li>
                  <li>• Update documentation as needed</li>
                  <li>• Follow TypeScript best practices</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pull Request Guidelines */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Pull Request Guidelines</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Good PR Practices</h4>
              <ul className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                <li>• Write clear, descriptive PR titles</li>
                <li>• Include detailed description of changes</li>
                <li>• Link to related issues or discussions</li>
                <li>• Keep PRs focused and reasonably sized</li>
                <li>• Update tests and documentation</li>
                <li>• Respond promptly to review feedback</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">PR Template</h4>
              <div className="mt-2 bg-black text-green-400 p-3 rounded font-mono text-sm">
                {`## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tests pass locally
- [ ] Added/updated tests
- [ ] Manual testing completed

## Screenshots (if applicable)`}
              </div>
            </div>
          </div>
        </section>

        {/* Issue Reporting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Reporting Issues</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Bug className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Bug Reports</h3>
              <ul className="space-y-2 text-sm">
                <li>• Clear description of the issue</li>
                <li>• Steps to reproduce</li>
                <li>• Expected vs actual behavior</li>
                <li>• Screenshots or videos if applicable</li>
                <li>• Browser and device information</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Lightbulb className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">Feature Requests</h3>
              <ul className="space-y-2 text-sm">
                <li>• Detailed description of proposed feature</li>
                <li>• Use case and benefits</li>
                <li>• Potential implementation approach</li>
                <li>• Impact on existing functionality</li>
                <li>• Alternative solutions considered</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Code Style Guidelines */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Code Style Guidelines</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">TypeScript/React</h4>
              <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                <li>• Use functional components with hooks</li>
                <li>• Proper TypeScript types for all functions</li>
                <li>• Component props should be well-typed interfaces</li>
                <li>• Use meaningful variable and function names</li>
                <li>• Follow React best practices and patterns</li>
              </ul>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Styling & Design</h4>
              <ul className="mt-2 space-y-1 text-purple-700 dark:text-purple-300 text-sm">
                <li>• Use Tailwind CSS classes exclusively</li>
                <li>• Follow the existing design system</li>
                <li>• Ensure responsive design for all screen sizes</li>
                <li>• Maintain accessibility standards (WCAG 2.1)</li>
                <li>• Use semantic HTML elements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Considerations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security Considerations</h2>
          <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-400 p-6">
            <Shield className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">Security Best Practices</h3>
            <ul className="space-y-2 text-red-700 dark:text-red-300">
              <li>• Never commit sensitive data or API keys</li>
              <li>• Validate all user inputs</li>
              <li>• Use proper authentication and authorization</li>
              <li>• Follow OWASP security guidelines</li>
              <li>• Report security vulnerabilities privately</li>
              <li>• Test for common security issues</li>
            </ul>
          </div>
        </section>

        {/* Community Standards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Standards</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Code of Conduct</h3>
            <ul className="space-y-2">
              <li>• Be respectful and professional in all interactions</li>
              <li>• Welcome newcomers and help them get started</li>
              <li>• Provide constructive feedback during code reviews</li>
              <li>• Focus on the technical merits of contributions</li>
              <li>• Respect different perspectives and experiences</li>
              <li>• Report violations of community standards</li>
            </ul>
          </div>
        </section>

        {/* Recognition */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Contributor Recognition</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Contributors List</h3>
              <p className="text-sm">All contributors are recognized in our repository</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Special Badges</h3>
              <p className="text-sm">Active contributors may receive special platform badges</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Lightbulb className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Feature Credits</h3>
              <p className="text-sm">Major contributions are credited in release notes</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="mb-6">Join our community of developers working to make crypto safer for everyone.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="gold" asChild>
              <a href="https://github.com/BOSC-DEV/sec-platform" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://discord.gg/sec" target="_blank" rel="noopener noreferrer">
                Join Discord
              </a>
            </Button>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default ContributingPage;
