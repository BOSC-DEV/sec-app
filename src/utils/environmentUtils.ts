
// Environment detection and utilities

/**
 * Different environments the application can run in
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test'
}

/**
 * Get the current environment
 */
export const getEnvironment = (): Environment => {
  // Check window location for environment indicators
  const hostname = window.location.hostname;
  
  if (process.env.NODE_ENV === 'test') {
    return Environment.TEST;
  } else if (process.env.NODE_ENV === 'development' || hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return Environment.DEVELOPMENT;
  } else if (hostname.includes('staging') || hostname.includes('dev.') || hostname.includes('test.')) {
    return Environment.STAGING;
  } else {
    return Environment.PRODUCTION;
  }
};

/**
 * Check if the app is running in production
 */
export const isProduction = (): boolean => {
  return getEnvironment() === Environment.PRODUCTION;
};

/**
 * Check if the app is running in development
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === Environment.DEVELOPMENT;
};

/**
 * Check if the app is running in staging
 */
export const isStaging = (): boolean => {
  return getEnvironment() === Environment.STAGING;
};

/**
 * Check if the app is running in test mode
 */
export const isTest = (): boolean => {
  return getEnvironment() === Environment.TEST;
};

/**
 * Feature flags can be managed here
 */
export const featureFlags = {
  enableExperimentalFeatures: !isProduction(),
  enableDetailedErrorLogging: !isProduction(),
  enablePerformanceMonitoring: isProduction() || isStaging(),
  enableChatArchiving: true,
  enableBountySystem: true
};

/**
 * Application configuration based on environment
 */
export const getConfig = () => {
  const env = getEnvironment();
  
  const commonConfig = {
    appName: 'ICCScamWatch',
    copyrightYear: new Date().getFullYear(),
    maxUploadSizeMB: 5,
    paginationPageSize: 10,
    toastDurationMs: 5000,
    sessionTimeout: 60 * 60 * 1000, // 1 hour
  };
  
  const envSpecificConfig = {
    [Environment.DEVELOPMENT]: {
      apiTimeoutMs: 10000,
      logLevel: 'debug',
      analyticsEnabled: false,
    },
    [Environment.STAGING]: {
      apiTimeoutMs: 15000,
      logLevel: 'info',
      analyticsEnabled: true,
    },
    [Environment.PRODUCTION]: {
      apiTimeoutMs: 20000,
      logLevel: 'warn',
      analyticsEnabled: true,
    },
    [Environment.TEST]: {
      apiTimeoutMs: 5000,
      logLevel: 'error',
      analyticsEnabled: false,
    }
  };
  
  return {
    ...commonConfig,
    ...envSpecificConfig[env],
    environment: env
  };
};

export default {
  getEnvironment,
  isProduction,
  isDevelopment,
  isStaging,
  isTest,
  featureFlags,
  getConfig
};
