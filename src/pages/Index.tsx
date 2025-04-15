import React, { useState } from 'react';
import Hero from '@/components/common/Hero';
import ScammerCard from '@/components/common/ScammerCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getTopScammers } from '@/services/scammerService';
import { getStatistics } from '@/services/statisticsService';
import { Shield, AlertTriangle, ExternalLink, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatNumber } from '@/lib/utils';
import DisclaimerDialog from '@/components/common/DisclaimerDialog';
import CurrencyIcon from '@/components/common/CurrencyIcon';
const Index = () => {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const {
    data: topScammers = [],
    isLoading: isLoadingScammers,
    error: scammersError
  } = useQuery({
    queryKey: ['topScammers'],
    queryFn: () => getTopScammers(3)
  });
  const {
    data: statistics = {
      totalBounty: 0,
      scammersCount: 0,
      reportersCount: 0,
      usersCount: 0
    },
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: ['statistics'],
    queryFn: getStatistics
  });
  if (scammersError) {
    console.error('Failed to load top scammers', scammersError);
  }
  if (statsError) {
    console.error('Failed to load statistics', statsError);
  }
  return <div>
      <Hero />

      <section className="icc-section bg-white dark:bg-gray-900">
        <div className="icc-container">
          <div className="text-center mb-12">
            <h2 className="icc-title">The Most Wanted</h2>
            <p className="max-w-2xl mx-auto text-icc-gray dark:text-gray-300"></p>
          </div>

          {isLoadingScammers ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(index => <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 aspect-square mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topScammers.map((scammer, index) => <ScammerCard key={scammer.id} scammer={scammer} rank={index} />)}
            </div>}

          <div className="text-center mt-10">
            <Button asChild className="icc-btn-primary py-6 px-8 dark:text-white dark:hover:text-gray-200">
              <Link to="/most-wanted">View All Reports</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="icc-section bg-gray-50 dark:bg-gray-800">
        <div className="icc-container">
          <div className="text-center mb-12">
            <h2 className="icc-title">How It Works</h2>
            <p className="max-w-2xl mx-auto text-icc-gray dark:text-gray-300">Our platform leverages collective intelligence to identify and track digital crimes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="bg-icc-blue-light dark:bg-icc-blue inline-flex p-4 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-icc-blue dark:text-white mb-3">Report</h3>
              <p className="text-icc-gray dark:text-gray-400">
                Community members report suspected scammers with evidence and details of fraudulent activities.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="bg-icc-blue-light dark:bg-icc-blue inline-flex p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-icc-blue dark:text-white mb-3">Verify</h3>
              <p className="text-icc-gray dark:text-gray-400">
                The community verifies reports through consensus and additional evidence from multiple sources.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="bg-icc-blue-light dark:bg-icc-blue inline-flex p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-icc-blue dark:text-white mb-3">Incentivize</h3>
              <p className="text-icc-gray dark:text-gray-400">Bounties are placed on confirmed scammers, incentivizing the community to serve social justice.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-icc-red dark:bg-icc-red-dark text-white py-10">
        <div className="icc-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-start md:items-center mb-4 md:mb-0">
              <AlertTriangle className="h-10 w-10 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Responsible Reporting</h3>
                <p className="text-gray-100 max-w-2xl">This platform is for informational purposes only. Always verify and follow all legal channels for reporting crimes.</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setDisclaimerOpen(true)} className="border-white text-white hover:text-white dark:border-gray-300 dark:text-gray-200 bg-slate-900 hover:bg-slate-800">
              Read Disclaimer
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="icc-section bg-slate-800">
        <div className="icc-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoadingStats ? <>
                {[1, 2, 3, 4].map((_, index) => <div key={index} className="text-center p-6">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse mx-auto w-3/4"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mx-auto animate-pulse"></div>
                  </div>)}
              </> : <>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-icc-blue dark:text-white mb-2 flex items-center justify-center">
                    <CurrencyIcon size="lg" className="mr-1" />{formatNumber(statistics.totalBounty)}
                  </div>
                  <div className="text-sm text-icc-gray dark:text-gray-400">Total Bounties</div>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-icc-blue dark:text-white mb-2">{formatNumber(statistics.scammersCount)}</div>
                  <div className="text-sm text-icc-gray dark:text-gray-400">Total Reports</div>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-icc-blue dark:text-white mb-2">{formatNumber(statistics.reportersCount)}</div>
                  <div className="text-sm text-icc-gray dark:text-gray-400">Active Hunters</div>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-icc-blue dark:text-white mb-2">{formatNumber(statistics.usersCount)}</div>
                  <div className="text-sm text-icc-gray dark:text-gray-400">Total Users</div>
                </div>
              </>}
          </div>
        </div>
      </section>

      <DisclaimerDialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen} />
    </div>;
};
export default Index;