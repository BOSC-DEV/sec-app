
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string; 
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
  author?: string;
  noIndex?: boolean;
  schema?: Record<string, any>;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "Tracking and exposing digital & cryptocurrency scammers worldwide",
  canonical,
  ogImage = "/lovable-uploads/3f23090d-4e36-43fc-b230-a8f898d7edd2.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  keywords = ["scams", "crypto scams", "scammer database", "fraud prevention", "scammer tracking"],
  author = "Scams and E-Crimes Commission",
  noIndex = false,
  schema,
  children
}) => {
  const siteTitle = title 
    ? `${title} | Scams and E-Crimes Commission` 
    : "Scams and E-Crimes Commission";
    
  // Get current URL safely for both server and client environments
  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };
  
  const currentUrl = getUrl();
  
  const absoluteCanonical = canonical ? 
    (canonical.startsWith('http') ? canonical : `${typeof window !== 'undefined' ? window.location.origin : ''}${canonical}`) : 
    currentUrl;
    
  const absoluteOgImage = ogImage ? 
    (ogImage.startsWith('http') ? ogImage : `${typeof window !== 'undefined' ? window.location.origin : ''}${ogImage}`) : 
    `${typeof window !== 'undefined' ? window.location.origin : ''}/lovable-uploads/3f23090d-4e36-43fc-b230-a8f898d7edd2.png`;

  // Create structured data for schema.org
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Scams and E-Crimes Commission",
    url: typeof window !== 'undefined' ? window.location.origin : '',
    description,
    ...(schema || {})
  };

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteCanonical} />
      <meta name="author" content={author} />
      <meta name="keywords" content={keywords.join(", ")} />
      
      {/* Robots directives */}
      {noIndex ? 
        <meta name="robots" content="noindex, nofollow" /> :
        <meta name="robots" content="index, follow" />
      }

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:url" content={absoluteCanonical} />
      <meta property="og:site_name" content="Scams and E-Crimes Commission" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      
      {/* Mobile optimizations */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#13294B" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(defaultSchema)}
      </script>
      
      {/* Additional child elements */}
      {children}
    </Helmet>
  );
};

export default SEO;
