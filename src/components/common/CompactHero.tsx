
import React from 'react';

interface CompactHeroProps {
  title: string;
  subtitle?: string;
}

const CompactHero: React.FC<CompactHeroProps> = ({
  title,
  subtitle
}) => {
  return (
    <div className="relative bg-[#1A1F2C] text-white">
      <div className="absolute inset-0 bg-[url('/images/cyber-pattern.png')] opacity-10"></div>
      <div className="icc-container py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto">
              {subtitle.replace(/\.$/, '')}
            </p>
          )}
        </div>
      </div>
      <div className="h-4 bg-gradient-to-r from-icc-gold-dark via-icc-gold to-icc-gold-dark"></div>
    </div>
  );
};

export default CompactHero;
