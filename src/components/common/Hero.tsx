
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Shield, Search } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  showCta?: boolean;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, showCta = true }) => {
  return (
    <div className="relative bg-icc-blue text-white">
      <div className="absolute inset-0 bg-[url('/images/cyber-pattern.png')] opacity-10"></div>
      <div className="icc-container py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-icc-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {showCta && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button asChild className="bg-icc-gold hover:bg-icc-gold-light text-icc-blue-dark text-lg py-6 px-8">
                <Link to="/most-wanted">
                  <Search className="mr-2 h-5 w-5" />
                  View Scammers
                </Link>
              </Button>
              <Button asChild className="bg-icc-blue-dark border-2 border-white hover:bg-icc-blue-light hover:text-white text-white text-lg py-6 px-8 font-medium shadow-md">
                <Link to="/report">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Report a Scammer
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-4 bg-gradient-to-r from-icc-gold-dark via-icc-gold to-icc-gold-dark"></div>
    </div>
  );
};

export default Hero;
