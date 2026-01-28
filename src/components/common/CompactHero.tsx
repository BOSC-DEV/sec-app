import React from 'react';
import GoldLine from './GoldLine';

interface CompactHeroProps {
  title: string;
  subtitle?: string;
}

const CompactHero: React.FC<CompactHeroProps> = ({
  title,
  subtitle
}) => {
  return (
    <div className="relative bg-icc-blue dark:bg-icc-blue-dark text-white">
      <div className="absolute inset-0 bg-[url('/images/cyber-pattern.png')] opacity-10"></div>
      <div className="icc-container py-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-gothic font-bold text-white mb-3">
            {title}
          </h1>
          {subtitle && <p className="text-white opacity-80">{subtitle.replace(/\.$/, '')}</p>}
        </div>
      </div>
      <GoldLine />
    </div>
  );
};

export default CompactHero;
