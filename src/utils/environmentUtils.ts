
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
  // Always default to production for released app
  return Environment.PRODUCTION;
};

/**
 * Check if the app is running in production
 */
export const isProduction = (): boolean => {
  return true; // Always return true for released app
};

/**
 * Check if the app is running in development
 */
export const isDevelopment = (): boolean => {
  return false; // Always return false for released app
};

/**
 * Check if the app is running in staging
 */
export const isStaging = (): boolean => {
  return false; // Always return false for released app
};

/**
 * Check if the app is running in test mode
 */
export const isTest = (): boolean => {
  return false; // Always return false for released app
};

/**
 * Feature flags can be managed here
 */
export const featureFlags = {
  enableExperimentalFeatures: false,
  enableDetailedErrorLogging: false,
  enablePerformanceMonitoring: true,
  enableChatArchiving: true,
  enableBountySystem: true
};

/**
 * Application configuration based on environment
 */
export const getConfig = () => {
  const commonConfig = {
    appName: 'ICCScamWatch',
    copyrightYear: new Date().getFullYear(),
    maxUploadSizeMB: 5,
    paginationPageSize: 10,
    toastDurationMs: 5000,
    sessionTimeout: 60 * 60 * 1000, // 1 hour
    apiTimeoutMs: 20000,
    logLevel: 'warn',
    analyticsEnabled: true,
    environment: Environment.PRODUCTION
  };

  return commonConfig;
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
