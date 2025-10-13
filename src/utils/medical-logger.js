/**
 * Professional Medical Logging System
 * iGFAP Stroke Triage Assistant - Enterprise-Grade Logging
 *
 * Provides structured, secure logging for medical applications with:
 * - HIPAA compliance (no PHI in logs)
 * - Structured JSON logging
 * - Performance monitoring
 * - Error tracking
 * - Audit trail capabilities
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { safeAsync, ERROR_CATEGORIES } from './error-handler.js';

/**
 * @typedef {Object} LogEntry
 * @property {string} timestamp - ISO timestamp
 * @property {string} level - Log level
 * @property {string} category - Log category
 * @property {string} message - Log message
 * @property {Object} [context] - Additional context (sanitized)
 * @property {string} [sessionId] - Session identifier
 * @property {string} [userId] - User identifier (anonymized)
 * @property {Object} [performance] - Performance metrics
 * @property {string} [stackTrace] - Stack trace for errors
 */

/**
 * Log levels with priority ordering
 */
export const LOG_LEVELS = {
  DEBUG: { level: 0, name: 'DEBUG', color: '#6366f1' },
  INFO: { level: 1, name: 'INFO', color: '#10b981' },
  WARN: { level: 2, name: 'WARN', color: '#f59e0b' },
  ERROR: { level: 3, name: 'ERROR', color: '#ef4444' },
  CRITICAL: { level: 4, name: 'CRITICAL', color: '#dc2626' },
};

/**
 * Log categories for medical application
 */
export const LOG_CATEGORIES = {
  AUTHENTICATION: 'AUTH',
  MEDICAL_CALCULATION: 'MEDICAL',
  NETWORK: 'NETWORK',
  PERFORMANCE: 'PERF',
  SECURITY: 'SECURITY',
  USER_INTERACTION: 'UI',
  DATA_VALIDATION: 'VALIDATION',
  AUDIT: 'AUDIT',
  SYSTEM: 'SYSTEM',
  ERROR: 'ERROR',
};

/**
 * Professional Medical Logger Class
 */
export class MedicalLogger {
  constructor() {
    this.logLevel = this.getLogLevel();
    this.sessionId = this.generateSessionId();
    this.logBuffer = [];
    this.maxBufferSize = 1000;
    this.isProduction =
      window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    this.enableConsole = !this.isProduction;
    this.enableStorage = true;
    this.enableNetwork = false; // Would send to logging service in production

    this.setupErrorHandlers();
    this.startPeriodicFlush();
  }

  /**
   * Get configured log level from environment or localStorage
   */
  getLogLevel() {
    try {
      const stored = localStorage.getItem('medicalLogLevel');
      if (stored && LOG_LEVELS[stored.toUpperCase()]) {
        return LOG_LEVELS[stored.toUpperCase()].level;
      }
    } catch (error) {
      // localStorage not available
    }

    // Default to INFO in production, DEBUG in development
    return this.isProduction ? LOG_LEVELS.INFO.level : LOG_LEVELS.DEBUG.level;
  }

  /**
   * Generate unique session identifier
   */
  generateSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `sess_${timestamp}_${random}`;
  }

  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    // Capture unhandled errors
    window.addEventListener('error', event => {
      try {
        this.critical('Unhandled JavaScript Error', {
          category: LOG_CATEGORIES.ERROR,
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        });
      } catch (loggingError) {
        // Fallback to console if logging fails
        console.error('Logging failed:', loggingError);
        console.error('Original error:', event.error);
      }
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      try {
        this.critical('Unhandled Promise Rejection', {
          category: LOG_CATEGORIES.ERROR,
          reason: event.reason?.message || String(event.reason) || 'Unknown rejection',
          stack: event.reason?.stack,
        });
      } catch (loggingError) {
        // Fallback to console if logging fails
        console.error('Logging failed:', loggingError);
        console.error('Original rejection:', event.reason);
      }
    });
  }

  /**
   * Create structured log entry
   */
  createLogEntry(level, message, context = {}) {
    // Ensure context is always an object
    const safeContext = context && typeof context === 'object' ? context : {};

    const entry = {
      timestamp: new Date().toISOString(),
      level: LOG_LEVELS[level]?.name || level,
      category: safeContext.category || LOG_CATEGORIES.SYSTEM,
      message: this.sanitizeMessage(message),
      sessionId: this.sessionId,
      context: this.sanitizeContext(safeContext),
      performance: this.getPerformanceMetrics(),
    };

    // Add stack trace for errors
    if (level === 'ERROR' || level === 'CRITICAL') {
      entry.stackTrace = new Error().stack;
    }

    // Add user ID if available (anonymized)
    const userId = this.getAnonymizedUserId();
    if (userId) {
      entry.userId = userId;
    }

    return entry;
  }

  /**
   * Sanitize message to remove PHI
   */
  sanitizeMessage(message) {
    if (typeof message !== 'string') {
      message = String(message);
    }

    // Remove potential PHI patterns
    const sanitized = message
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****') // SSN
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***@***.***') // Email
      .replace(/\b\d{10,}\b/g, '**********') // Phone numbers
      .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[NAME]'); // Names

    return sanitized;
  }

  /**
   * Sanitize context object to remove PHI
   */
  sanitizeContext(context) {
    // Handle null or non-object inputs
    if (!context || typeof context !== 'object') {
      return {};
    }

    const sanitized = { ...context };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'sessionToken',
      'authToken',
      'patientName',
      'firstName',
      'lastName',
      'fullName',
      'email',
      'phone',
      'ssn',
      'mrn',
      'dob',
      'dateOfBirth',
    ];

    const removeSensitiveData = obj => {
      if (!obj || typeof obj !== 'object') {
        return obj;
      }

      const cleaned = Array.isArray(obj) ? [] : {};

      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          cleaned[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          cleaned[key] = removeSensitiveData(value);
        } else {
          cleaned[key] = value;
        }
      }

      return cleaned;
    };

    return removeSensitiveData(sanitized);
  }

  /**
   * Get anonymized user ID
   */
  getAnonymizedUserId() {
    try {
      // Use a hash of session info, not actual user data
      const sessionData = sessionStorage.getItem('session_hash');
      if (sessionData) {
        return `user_${sessionData.substring(0, 8)}`;
      }
    } catch (error) {
      // Session storage not available
    }
    return null;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    try {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          memoryUsed: performance.memory?.usedJSHeapSize || 0,
          loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          domReady:
            navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
        };
      }
    } catch (error) {
      // Performance API not available
    }
    return null;
  }

  /**
   * Log message at specified level
   */
  log(level, message, context = {}) {
    return safeAsync(
      async () => {
        // Validate inputs
        if (!level || !message) {
          return; // Skip logging if no level or message
        }

        const levelInfo = LOG_LEVELS[level.toUpperCase()];
        if (!levelInfo || levelInfo.level < this.logLevel) {
          return; // Below configured log level
        }

        const entry = this.createLogEntry(level.toUpperCase(), message, context);

        // Add to buffer
        this.addToBuffer(entry);

        // Console output in development
        if (this.enableConsole) {
          this.outputToConsole(entry);
        }

        // Store locally
        if (this.enableStorage) {
          this.storeEntry(entry);
        }

        // Send to logging service (production)
        if (this.enableNetwork) {
          await this.sendToLoggingService(entry);
        }
      },
      {
        category: ERROR_CATEGORIES.SYSTEM,
        context: { operation: 'logging', level, message: message.substring(0, 100) },
      }
    );
  }

  /**
   * Add entry to buffer
   */
  addToBuffer(entry) {
    this.logBuffer.push(entry);

    // Maintain buffer size
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
  }

  /**
   * Output to browser console with styling
   */
  outputToConsole(entry) {
    const levelInfo = LOG_LEVELS[entry.level];
    const color = levelInfo?.color || '#666666';

    const style = `color: ${color}; font-weight: bold;`;
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();

    const consoleMethod =
      entry.level === 'ERROR' || entry.level === 'CRITICAL'
        ? 'error'
        : entry.level === 'WARN'
          ? 'warn'
          : 'log';

    console.groupCollapsed(
      `%c[${entry.level}] ${timestamp} [${entry.category}] ${entry.message}`,
      style
    );

    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log('Context:', entry.context);
    }

    if (entry.performance) {
      console.log('Performance:', entry.performance);
    }

    if (entry.stackTrace && (entry.level === 'ERROR' || entry.level === 'CRITICAL')) {
      console.log('Stack Trace:', entry.stackTrace);
    }

    console.groupEnd();
  }

  /**
   * Store entry locally
   */
  storeEntry(entry) {
    try {
      const key = `medicalLog_${entry.timestamp}`;
      const serialized = JSON.stringify(entry);

      // Use sessionStorage for temporary storage
      sessionStorage.setItem(key, serialized);

      // Clean old entries (keep last 100)
      this.cleanOldEntries();
    } catch (error) {
      // Storage failed - continue silently
    }
  }

  /**
   * Clean old log entries from storage
   */
  cleanOldEntries() {
    try {
      const keys = Object.keys(sessionStorage)
        .filter(key => key.startsWith('medicalLog_'))
        .sort()
        .reverse();

      // Keep only the last 100 entries
      if (keys.length > 100) {
        keys.slice(100).forEach(key => {
          sessionStorage.removeItem(key);
        });
      }
    } catch (error) {
      // Cleanup failed - continue silently
    }
  }

  /**
   * Send to remote logging service
   */
  async sendToLoggingService(entry) {
    // In production, this would send to a logging service like:
    // - Google Cloud Logging
    // - AWS CloudWatch
    // - Elastic Stack
    // - Splunk

    // For now, just return - would implement actual service call
    return Promise.resolve();
  }

  /**
   * Start periodic buffer flush
   */
  startPeriodicFlush() {
    setInterval(() => {
      this.flushBuffer();
    }, 30000); // Flush every 30 seconds
  }

  /**
   * Flush log buffer
   */
  flushBuffer() {
    if (this.logBuffer.length === 0) {
      return;
    }

    // In production, this would batch-send logs to service
    this.info('Log buffer flushed', {
      category: LOG_CATEGORIES.SYSTEM,
      entriesCount: this.logBuffer.length,
    });
  }

  /**
   * Convenience methods for different log levels
   */
  debug(message, context = {}) {
    return this.log('DEBUG', message, context);
  }

  info(message, context = {}) {
    return this.log('INFO', message, context);
  }

  warn(message, context = {}) {
    return this.log('WARN', message, context);
  }

  error(message, context = {}) {
    return this.log('ERROR', message, context);
  }

  critical(message, context = {}) {
    return this.log('CRITICAL', message, context);
  }

  /**
   * Specialized medical logging methods
   */
  medicalCalculation(operation, result, context = {}) {
    return this.info(`Medical calculation: ${operation}`, {
      category: LOG_CATEGORIES.MEDICAL_CALCULATION,
      operation,
      success: !context.error,
      ...context,
    });
  }

  authentication(action, success, context = {}) {
    return this.info(`Authentication: ${action}`, {
      category: LOG_CATEGORIES.AUTHENTICATION,
      action,
      success,
      ...context,
    });
  }

  userInteraction(action, context = {}) {
    return this.debug(`User interaction: ${action}`, {
      category: LOG_CATEGORIES.USER_INTERACTION,
      action,
      ...context,
    });
  }

  networkRequest(url, method, status, context = {}) {
    const level = status >= 400 ? 'ERROR' : status >= 300 ? 'WARN' : 'DEBUG';
    return this.log(level, `Network request: ${method} ${url}`, {
      category: LOG_CATEGORIES.NETWORK,
      method,
      url: this.sanitizeUrl(url),
      status,
      ...context,
    });
  }

  performance(metric, value, context = {}) {
    return this.debug(`Performance metric: ${metric} = ${value}`, {
      category: LOG_CATEGORIES.PERFORMANCE,
      metric,
      value,
      ...context,
    });
  }

  auditTrail(event, context = {}) {
    return this.info(`Audit: ${event}`, {
      category: LOG_CATEGORIES.AUDIT,
      event,
      ...context,
    });
  }

  /**
   * Sanitize URL to remove sensitive parameters
   */
  sanitizeUrl(url) {
    try {
      const urlObj = new URL(url);
      const sensitiveParams = ['token', 'auth', 'key', 'secret'];

      sensitiveParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '[REDACTED]');
        }
      });

      return urlObj.toString();
    } catch (error) {
      return url;
    }
  }

  /**
   * Get all logs from buffer and storage
   */
  getLogs(filters = {}) {
    const allLogs = [...this.logBuffer];

    // Add logs from storage
    try {
      const keys = Object.keys(sessionStorage)
        .filter(key => key.startsWith('medicalLog_'))
        .sort();

      keys.forEach(key => {
        try {
          const entry = JSON.parse(sessionStorage.getItem(key));
          if (entry && !allLogs.find(log => log.timestamp === entry.timestamp)) {
            allLogs.push(entry);
          }
        } catch (error) {
          // Skip corrupted entries
        }
      });
    } catch (error) {
      // Storage access failed
    }

    // Apply filters
    let filtered = allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (filters.level) {
      const minLevel = LOG_LEVELS[filters.level.toUpperCase()]?.level || 0;
      filtered = filtered.filter(log => {
        const logLevel = LOG_LEVELS[log.level]?.level || 0;
        return logLevel >= minLevel;
      });
    }

    if (filters.category) {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.since) {
      const sinceDate = new Date(filters.since);
      filtered = filtered.filter(log => new Date(log.timestamp) >= sinceDate);
    }

    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Export logs for debugging or compliance
   */
  exportLogs(format = 'json') {
    const logs = this.getLogs();

    if (format === 'csv') {
      return this.logsToCSV(logs);
    }

    return JSON.stringify(logs, null, 2);
  }

  /**
   * Convert logs to CSV format
   */
  logsToCSV(logs) {
    if (logs.length === 0) {
      return '';
    }

    const headers = ['timestamp', 'level', 'category', 'message', 'sessionId'];
    const rows = logs.map(log => [
      log.timestamp,
      log.level,
      log.category,
      `"${log.message.replace(/"/g, '""')}"`,
      log.sessionId,
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logBuffer = [];

    try {
      const keys = Object.keys(sessionStorage).filter(key => key.startsWith('medicalLog_'));

      keys.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      // Storage cleanup failed
    }

    this.info('Log storage cleared', {
      category: LOG_CATEGORIES.SYSTEM,
    });
  }
}

// Create global logger instance
export const medicalLogger = new MedicalLogger();

// Export convenience functions
export const {
  debug,
  info,
  warn,
  error,
  critical,
  medicalCalculation,
  authentication,
  userInteraction,
  networkRequest,
  performance,
  auditTrail,
} = medicalLogger;
