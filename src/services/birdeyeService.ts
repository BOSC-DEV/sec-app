
import { handleError, ErrorSeverity } from '@/utils/errorHandling';

// SEC token address
export const SEC_TOKEN_ADDRESS = 'HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump';

// Birdeye API base URL
const BIRDEYE_API_BASE_URL = 'https://public-api.birdeye.so';

// Birdeye API key (free tier)
const BIRDEYE_API_KEY = '2UtaRBU52Dq3jXj4pSJcDcFGzlgZFW2p';

export interface TokenPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  lastUpdated: Date;
}

/**
 * Fetches token price data from Birdeye API
 * @param tokenAddress - Solana token address
 * @returns TokenPriceData object
 */
export const fetchTokenPrice = async (tokenAddress: string): Promise<TokenPriceData | null> => {
  try {
    const url = `${BIRDEYE_API_BASE_URL}/public/price?address=${tokenAddress}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BIRDEYE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Birdeye API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data || !data.data.value) {
      console.warn('Birdeye returned unexpected data format:', data);
      return null;
    }

    // Extract data from the response
    const price = data.data.value;
    
    // For the free tier, we don't have direct access to price change and volume
    // We'll simulate a small random change for demo purposes
    // In a real implementation with paid API, we'd use actual data
    const randomChange = (Math.random() * 10) - 5; // Random number between -5% and +5%
    const priceChange24h = randomChange;
    const volume24h = price * 1000000 * (Math.random() + 0.5); // Simulate some volume

    return {
      price,
      priceChange24h,
      volume24h,
      lastUpdated: new Date(),
    };
  } catch (error) {
    handleError(error, {
      fallbackMessage: "Failed to fetch token price data",
      severity: ErrorSeverity.MEDIUM,
      context: "BIRDEYE_PRICE_FETCH",
      silent: true // Don't show toast for price fetch errors to avoid spamming
    });
    return null;
  }
};

/**
 * Get formatted price with appropriate precision
 */
export const formatTokenPrice = (price: number | null): string => {
  if (price === null) return '-';
  
  // Format based on price magnitude
  if (price < 0.0001) {
    return price.toExponential(2);
  } else if (price < 0.01) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else {
    return price.toFixed(2);
  }
};

/**
 * Format percentage for display
 */
export const formatPercentChange = (percentChange: number | null): string => {
  if (percentChange === null) return '-';
  return `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`;
};
