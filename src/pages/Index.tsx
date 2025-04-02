
import React, { useEffect, useState } from 'react';
import Hero from '@/components/common/Hero';
import ScammerCard, { ScammerData } from '@/components/common/ScammerCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getTopScammers } from '@/services/mockData';
import { Shield, AlertTriangle, ExternalLink, DollarSign } from 'lucide-react';

const Index = () => {
  const [topScammers, setTopScammers] = useState<ScammerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopScammers = async () => {
      try {
        const data = await getTopScammers(3);
        setTopScammers(data);
      } catch (error) {
        console.error('Failed to load top scammers', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopScammers();
  }, []);

  return (
    <div>
      <Hero 
        title="International Cyber-crime Commission"
        subtitle="Tracking and exposing cryptocurrency scammers worldwide through decentralized community intelligence."
      />

      {/* Featured Scammers Section */}
      <section className="icc-section bg-white">
        <div className="icc-container">
          <div className="text-center mb-12">
            <h2 className="icc-title">Most Wanted Scammers</h2>
            <p className="max-w-2xl mx-auto text-icc-gray">
              These individuals are wanted for major cryptocurrency fraud schemes. 
              Help protect our community by sharing intelligence and contributing to bounties.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topScammers.map(scammer => (
                <ScammerCard key={scammer.id} scammer={scammer} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button asChild className="icc-btn-primary py-6 px-8">
              <Link to="/most-wanted">View All Scammers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="icc-section bg-gray-50">
        <div className="icc-container">
          <div className="text-center mb-12">
            <h2 className="icc-title">How It Works</h2>
            <p className="max-w-2xl mx-auto text-icc-gray">
              Our platform leverages collective intelligence to identify and track cryptocurrency fraud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-icc-blue-light inline-flex p-4 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-icc-blue mb-3">Report</h3>
              <p className="text-icc-gray">
                Community members report suspected scammers with evidence and details of fraudulent activities.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-icc-blue-light inline-flex p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-icc-blue mb-3">Verify</h3>
              <p className="text-icc-gray">
                The community verifies reports through consensus and additional evidence from multiple sources.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-icc-blue-light inline-flex p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-icc-blue mb-3">Incentivize</h3>
              <p className="text-icc-gray">
                Bounties are placed on confirmed scammers, incentivizing the community to provide additional information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="bg-icc-red text-white py-10">
        <div className="icc-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-start md:items-center mb-4 md:mb-0">
              <AlertTriangle className="h-10 w-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Responsible Reporting</h3>
                <p className="text-gray-100 max-w-2xl">
                  This platform is for informational purposes only. Always verify information and follow proper legal channels for reporting crimes.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/disclaimer">
                Read Disclaimer
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="icc-section bg-white">
        <div className="icc-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-icc-blue mb-2">$120M+</div>
              <div className="text-sm text-icc-gray">Scam Funds Tracked</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-icc-blue mb-2">450+</div>
              <div className="text-sm text-icc-gray">Scammers Identified</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-icc-blue mb-2">12K+</div>
              <div className="text-sm text-icc-gray">Community Members</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-icc-blue mb-2">$2.5M</div>
              <div className="text-sm text-icc-gray">Bounties Posted</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
