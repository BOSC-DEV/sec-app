import { Connection, PublicKey } from '@solana/web3.js';

interface CachedBalance {
  solBalance: number;
  secBalance: number;
  timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_KEY_PREFIX = 'balance_cache_';

/**
 * Get balance cache key for a wallet address
 */
const getCacheKey = (walletAddress: string): string => {
  return `${CACHE_KEY_PREFIX}${walletAddress}`;
};

/**
 * Get cached balance if available and not expired
 */
export const getCachedBalance = (walletAddress: string): CachedBalance | null => {
  try {
    const cacheKey = getCacheKey(walletAddress);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data: CachedBalance = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired (older than 1 hour)
    if (now - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    console.log(`Using cached balance for ${walletAddress} (age: ${Math.round((now - data.timestamp) / 1000 / 60)}m)`);
    return data;
  } catch (error) {
    console.error('Error reading balance cache:', error);
    return null;
  }
};

/**
 * Save balance to cache
 */
export const setCachedBalance = (
  walletAddress: string,
  solBalance: number,
  secBalance: number
): void => {
  try {
    const cacheKey = getCacheKey(walletAddress);
    const data: CachedBalance = {
      solBalance,
      secBalance,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`Cached balance for ${walletAddress}`);
  } catch (error) {
    console.error('Error saving balance cache:', error);
  }
};

/**
 * Clear balance cache for a specific wallet
 */
export const clearBalanceCache = (walletAddress: string): void => {
  try {
    const cacheKey = getCacheKey(walletAddress);
    localStorage.removeItem(cacheKey);
    console.log(`Cleared balance cache for ${walletAddress}`);
  } catch (error) {
    console.error('Error clearing balance cache:', error);
  }
};

/**
 * Clear all balance caches
 */
export const clearAllBalanceCaches = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cleared all balance caches');
  } catch (error) {
    console.error('Error clearing all balance caches:', error);
  }
};

/**
 * Fetch balance with caching support
 * Returns cached data if available, otherwise fetches fresh data
 */
export const fetchBalanceWithCache = async (
  connection: Connection,
  fallbackConnection: Connection,
  walletAddress: string,
  secTokenAccount: PublicKey | null
): Promise<{ solBalance: number; secBalance: number; fromCache: boolean }> => {
  // Check cache first
  const cached = getCachedBalance(walletAddress);
  if (cached) {
    return {
      solBalance: cached.solBalance,
      secBalance: cached.secBalance,
      fromCache: true,
    };
  }
  
  // Fetch fresh data
  console.log(`Fetching fresh balance for ${walletAddress}`);
  const publicKey = new PublicKey(walletAddress);
  
  let solBalance = 0;
  let secBalance = 0;
  
  try {
    // Try primary connection
    solBalance = await connection.getBalance(publicKey, 'confirmed');
    
    if (secTokenAccount) {
      const tokenAccountInfo = await connection.getAccountInfo(secTokenAccount, 'confirmed');
      if (tokenAccountInfo) {
        const data = Buffer.from(tokenAccountInfo.data);
        secBalance = Number(data.readBigUInt64LE(64)) / 1_000_000;
      }
    }
  } catch (error) {
    console.error('Primary connection failed, trying fallback:', error);
    
    // Try fallback connection
    try {
      solBalance = await fallbackConnection.getBalance(publicKey, 'confirmed');
      
      if (secTokenAccount) {
        const tokenAccountInfo = await fallbackConnection.getAccountInfo(secTokenAccount, 'confirmed');
        if (tokenAccountInfo) {
          const data = Buffer.from(tokenAccountInfo.data);
          secBalance = Number(data.readBigUInt64LE(64)) / 1_000_000;
        }
      }
    } catch (fallbackError) {
      console.error('Fallback connection also failed:', fallbackError);
      throw fallbackError;
    }
  }
  
  // Cache the results
  setCachedBalance(walletAddress, solBalance, secBalance);
  
  return {
    solBalance,
    secBalance,
    fromCache: false,
  };
};
