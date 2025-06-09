
import React from 'react';
import DocsContent from '@/components/docs/DocsContent';
import { Code, Palette, Smartphone, Zap, Package, Settings } from 'lucide-react';

const FrontendPage = () => {
  return (
    <DocsContent 
      title="Frontend Technology Stack" 
      description="Deep dive into the frontend technologies, patterns, and best practices used in the SEC platform"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Frontend Overview</h2>
          <div className="bg-gradient-to-r from-icc-blue to-icc-blue-light rounded-lg p-8 text-white mb-6">
            <Code className="h-12 w-12 mb-4" />
            <p className="text-xl leading-relaxed">
              Our frontend is built with modern React patterns, TypeScript for type safety, 
              and a comprehensive design system that ensures consistency and maintainability 
              across the entire platform.
            </p>
          </div>
        </section>

        {/* Core Technologies */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core Technologies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <Package className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">React 18</h3>
              <p className="mb-4">
                Latest React with concurrent features, automatic batching, and improved performance.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Functional components with hooks</li>
                <li>• Context API for global state</li>
                <li>• Suspense for code splitting</li>
                <li>• Error boundaries for resilience</li>
              </ul>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <Settings className="h-8 w-8 text-icc-gold mb-4" />
              <h3 className="text-xl font-semibold mb-3">TypeScript</h3>
              <p className="mb-4">
                Full TypeScript implementation for type safety and better developer experience.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Strict type checking</li>
                <li>• Interface definitions</li>
                <li>• Compile-time error detection</li>
                <li>• Enhanced IDE support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Build & Development */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Build & Development Tools</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">V</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Vite</h3>
                <p>Lightning-fast development server with hot module replacement and optimized production builds.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">E</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">ESLint & Prettier</h3>
                <p>Code quality tools ensuring consistent formatting and catching potential issues early.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 border rounded-lg">
              <div className="bg-icc-gold text-icc-blue-dark rounded-full w-8 h-8 flex items-center justify-center font-bold">T</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Testing</h3>
                <p>Comprehensive testing setup with Vitest for unit tests and React Testing Library for component testing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Styling & Design */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Styling & Design System</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg text-center">
              <Palette className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-sm">Utility-first CSS framework for rapid UI development</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Package className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Shadcn/ui</h3>
              <p className="text-sm">High-quality, accessible component library</p>
            </div>
            <div className="p-6 bg-muted rounded-lg text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-3 text-icc-gold" />
              <h3 className="font-semibold mb-2">Responsive Design</h3>
              <p className="text-sm">Mobile-first approach with consistent layouts</p>
            </div>
          </div>
        </section>

        {/* State Management */}
        <section>
          <h2 className="text-2xl font-bold mb-6">State Management</h2>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">TanStack Query (React Query)</h3>
            <p className="mb-4">
              Powerful data fetching and state management library that handles caching, 
              synchronization, and background updates automatically.
            </p>
            <ul className="space-y-2">
              <li>• Intelligent caching strategies</li>
              <li>• Background refetching</li>
              <li>• Optimistic updates</li>
              <li>• Error handling and retry logic</li>
              <li>• Real-time data synchronization</li>
            </ul>
          </div>
        </section>

        {/* Performance Optimizations */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Performance Optimizations</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Code Splitting</h4>
              <p className="text-green-700 dark:text-green-300">
                React.lazy() and Suspense for loading components only when needed
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Image Optimization</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Lazy loading, responsive images, and WebP format support
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Bundle Optimization</h4>
              <p className="text-purple-700 dark:text-purple-300">
                Tree shaking, minification, and compression for optimal bundle sizes
              </p>
            </div>
          </div>
        </section>

        {/* Component Architecture */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Component Architecture</h2>
          <div className="grid gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Design Patterns</h3>
              <ul className="space-y-2">
                <li>• Atomic design methodology</li>
                <li>• Compound components for complex UI</li>
                <li>• Render props and custom hooks</li>
                <li>• Context providers for shared state</li>
                <li>• Error boundaries for graceful failures</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Accessibility & Standards</h2>
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">WCAG 2.1 Compliance</h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Semantic HTML structure</li>
              <li>• Keyboard navigation support</li>
              <li>• Screen reader compatibility</li>
              <li>• Color contrast compliance</li>
              <li>• Focus management</li>
              <li>• ARIA labels and descriptions</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsContent>
  );
};

export default FrontendPage;
