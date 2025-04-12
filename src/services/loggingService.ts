
import { supabase } from '@/integrations/supabase/client';
import { ErrorSeverity } from '@/utils/errorSeverity';
import analyticsService from './analyticsService';

// Define log levels 
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, any>;
  sessionId?: string;
  userId?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Map ErrorSeverity to LogLevel
const severityToLogLevel = {
  [ErrorSeverity.LOW]: LogLevel.INFO,
  [ErrorSeverity.MEDIUM]: LogLevel.WARN,
  [ErrorSeverity.HIGH]: LogLevel.ERROR,
  [ErrorSeverity.CRITICAL]: LogLevel.CRITICAL
};

// Keep logs in memory for development debugging
const inMemoryLogs: LogEntry[] = [];
const MAX_IN_MEMORY_LOGS = 100;

// Get session ID for correlation
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Get current user ID if available
const getUserId = (): string | undefined => {
  // Get current user synchronously
  const user = supabase.auth.getUser();
  return user?.data?.user?.id;
};

// Only log to Supabase in production
const shouldLogToSupabase = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Create a log entry
const createLogEntry = (
  level: LogLevel,
  message: string,
  context?: string,
  data?: Record<string, any>,
  error?: Error
): LogEntry => {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    sessionId: getSessionId(),
    userId: getUserId(),
  };

  if (data) {
    logEntry.data = data;
  }

  if (error) {
    logEntry.error = {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  return logEntry;
};

// Log to console
const logToConsole = (entry: LogEntry): void => {
  const { level, message, context, data, error } = entry;
  const timestamp = new Date(entry.timestamp).toLocaleTimeString();
  const contextInfo = context ? `[${context}]` : '';
  const consoleMsg = `${timestamp} ${level.toUpperCase()} ${contextInfo} ${message}`;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(consoleMsg, data || '', error || '');
      break;
    case LogLevel.INFO:
      console.info(consoleMsg, data || '', error || '');
      break;
    case LogLevel.WARN:
      console.warn(consoleMsg, data || '', error || '');
      break;
    case LogLevel.ERROR:
    case LogLevel.CRITICAL:
      console.error(consoleMsg, data || '', error || '');
      break;
  }
};

// Add to in-memory logs for development
const addToInMemoryLogs = (entry: LogEntry): void => {
  inMemoryLogs.unshift(entry);
  
  // Keep the array at a reasonable size
  if (inMemoryLogs.length > MAX_IN_MEMORY_LOGS) {
    inMemoryLogs.pop();
  }
};

// Log to Supabase in production
const logToSupabase = async (entry: LogEntry): Promise<void> => {
  if (!shouldLogToSupabase()) return;

  try {
    const { error } = await supabase
      .from('application_logs')
      .insert([{
        timestamp: entry.timestamp,
        level: entry.level,
        message: entry.message,
        context: entry.context,
        session_id: entry.sessionId,
        user_id: entry.userId,
        data: entry.data ? JSON.stringify(entry.data) : null,
        error: entry.error ? JSON.stringify(entry.error) : null
      }]);

    if (error) {
      console.error('Failed to send log to Supabase:', error);
    }
  } catch (err) {
    console.error('Error sending log to Supabase:', err);
  }
};

// Main logging functions
export const log = {
  debug: (message: string, context?: string, data?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.DEBUG, message, context, data);
    logToConsole(entry);
    addToInMemoryLogs(entry);
    
    // Debug logs aren't sent to Supabase to reduce noise
  },

  info: (message: string, context?: string, data?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.INFO, message, context, data);
    logToConsole(entry);
    addToInMemoryLogs(entry);
    logToSupabase(entry);
  },

  warn: (message: string, context?: string, data?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.WARN, message, context, data);
    logToConsole(entry);
    addToInMemoryLogs(entry);
    logToSupabase(entry);
  },

  error: (message: string, error: Error, context?: string, data?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.ERROR, message, context, data, error);
    logToConsole(entry);
    addToInMemoryLogs(entry);
    logToSupabase(entry);
    
    // Send to analytics for error tracking
    analyticsService.trackError(error, context);
  },

  critical: (message: string, error: Error, context?: string, data?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.CRITICAL, message, context, data, error);
    logToConsole(entry);
    addToInMemoryLogs(entry);
    logToSupabase(entry);
    
    // Send critical errors to analytics as high priority
    analyticsService.trackError(error, `CRITICAL: ${context || ''}`);
  },

  // Convert from ErrorSeverity to appropriate log level
  fromSeverity: (
    severity: ErrorSeverity, 
    message: string, 
    error: Error, 
    context?: string,
    data?: Record<string, any>
  ) => {
    const logLevel = severityToLogLevel[severity] || LogLevel.ERROR;
    
    const entry = createLogEntry(logLevel, message, context, data, error);
    logToConsole(entry);
    addToInMemoryLogs(entry);
    logToSupabase(entry);
    
    // Track in analytics
    analyticsService.trackError(error, context);
  },

  // Get in-memory logs (for debugging tools)
  getInMemoryLogs: () => [...inMemoryLogs]
};

export default log;
