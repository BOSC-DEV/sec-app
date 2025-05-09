
import { Connection, Commitment } from '@solana/web3.js';
import { TRANSACTION_TIMEOUT } from './types';

const QUICKNODE_RPC_URL = 'https://old-hidden-sea.solana-mainnet.quiknode.pro/8451b71239184be1451907adce1e53d217c53cb4/';
const QUICKNODE_WS_URL = 'wss://old-hidden-sea.solana-mainnet.quiknode.pro/8451b71239184be1451907adce1e53d217c53cb4/';
const FALLBACK_RPC_URL = 'https://api.mainnet-beta.solana.com';

const connectionConfig = {
  commitment: 'confirmed' as Commitment,
  confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT,
  wsEndpoint: QUICKNODE_WS_URL,
  disableRetryOnRateLimit: false,
  httpHeaders: {
    'Content-Type': 'application/json',
  }
};

const connection = new Connection(QUICKNODE_RPC_URL, connectionConfig);
let fallbackConnection: Connection | null = null;

export const getConnection = (): Connection => {
  return connection;
};

export const getFallbackConnection = (): Connection => {
  if (!fallbackConnection) {
    console.log('Initializing fallback Solana connection');
    fallbackConnection = new Connection(FALLBACK_RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: TRANSACTION_TIMEOUT
    });
  }
  return fallbackConnection;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const confirmTransactionWithRetry = async (
  connection: Connection,
  signature: string,
  blockhash: string,
  lastValidBlockHeight: number
): Promise<boolean> => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Confirming transaction, attempt ${attempt + 1}/${MAX_RETRIES}`);
      
      const confirmationResult = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');
      
      if (confirmationResult.value.err) {
        console.warn(`Transaction confirmation returned error on attempt ${attempt + 1}:`, confirmationResult.value.err);
        
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY);
          continue;
        }
        
        throw new Error(`Transaction failed: ${JSON.stringify(confirmationResult.value.err)}`);
      }
      
      console.log("Transaction confirmed successfully:", signature);
      return true;
    } catch (error) {
      console.error(`Error confirming transaction on attempt ${attempt + 1}:`, error);
      
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY);
      } else {
        throw error;
      }
    }
  }
  
  throw new Error(`Failed to confirm transaction after ${MAX_RETRIES} attempts`);
};
