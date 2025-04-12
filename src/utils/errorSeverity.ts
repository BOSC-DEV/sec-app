
// Defined in a separate file to avoid circular dependencies
export enum ErrorSeverity {
  LOW = 'low',      // Minor UI glitches, non-critical features
  MEDIUM = 'medium', // Important but not critical features
  HIGH = 'high',     // Critical path features, authentication
  CRITICAL = 'critical' // Application-breaking errors
}
