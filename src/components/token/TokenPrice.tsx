
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  fetchTokenPrice, 
  formatTokenPrice, 
  formatPercentChange, 
  SEC_TOKEN_ADDRESS,
  FALLBACK_TOKEN_ADDRESS
} from '@/services/birdeyeService';
import { handleError, ErrorSeverity } from '@/utils/errorHandling';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenPriceProps {
  tokenAddress?: string;
  refreshInterval?: number; // in milliseconds
}

const TokenPrice: React.FC<TokenPriceProps> = ({
  tokenAddress = SEC_TOKEN_ADDRESS,
  refreshInterval = 60000, // Default: refresh every minute
}) => {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchData = async () => {
    try {
      const priceData = await fetchTokenPrice(tokenAddress);
      
      if (priceData) {
        setPrice(priceData.price);
        setPriceChange24h(priceData.priceChange24h);
        setUsingFallback(!!priceData.usedFallbackToken);
        setError(null);
      } else {
        setError('Failed to fetch price data');
      }
    } catch (error) {
      handleError(error, {
        fallbackMessage: 'Failed to fetch price data',
        severity: ErrorSeverity.MEDIUM,
        context: 'TOKEN_PRICE_COMPONENT',
        silent: true,
      });
      setError('Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up interval for refreshing data
    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [tokenAddress, refreshInterval]);

  const getBirdeyeUrl = () => {
    // If we're using the fallback, link to the fallback token
    const address = usingFallback ? FALLBACK_TOKEN_ADDRESS : tokenAddress;
    return `https://birdeye.so/token/${address}?chain=solana`;
  };

  return (
    <Card className="w-full dark:border-gray-700">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              SEC Token Price
            </div>
            {usingFallback && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2 text-amber-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Using SOL price as a fallback. SEC token not found on Birdeye.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <a 
            href={getBirdeyeUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            Birdeye <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
        
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-28 dark:bg-gray-700" />
            <Skeleton className="h-4 w-16 dark:bg-gray-700" />
          </div>
        ) : error ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Unavailable
          </div>
        ) : (
          <div>
            <div className="text-2xl font-mono font-bold">
              ${formatTokenPrice(price)}
              {usingFallback && <span className="text-xs ml-1 text-amber-500 font-normal">(SOL)</span>}
            </div>
            <div className={`flex items-center text-sm ${priceChange24h && priceChange24h >= 0 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-red-500 dark:text-red-400'}`}>
              {priceChange24h !== null && (
                priceChange24h >= 0 
                  ? <ArrowUpIcon className="h-3 w-3 mr-1" /> 
                  : <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              <span>{formatPercentChange(priceChange24h)}</span>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(24h)</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenPrice;
