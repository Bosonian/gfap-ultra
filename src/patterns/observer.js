/**
 * Observer Pattern Implementation for Medical Event Management
 * iGFAP Stroke Triage Assistant - Enterprise Architecture
 *
 * Provides secure, type-safe event handling for medical applications
 */

export class MedicalEventObserver {
  constructor() {
    this.observers = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Subscribe to medical events with validation
   * @param {string} eventType - Medical event type
   * @param {Function} callback - Observer callback function
   * @param {Object} options - Observer options
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventType, callback, options = {}) {
    if (typeof callback !== 'function') {
      throw new Error('Observer callback must be a function');
    }

    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Set());
    }

    const observer = {
      callback,
      id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      priority: options.priority || 0,
      once: options.once || false,
      medicalContext: options.medicalContext || null,
    };

    this.observers.get(eventType).add(observer);

    // Return unsubscribe function
    return () => {
      const eventObservers = this.observers.get(eventType);
      if (eventObservers) {
        eventObservers.delete(observer);
        if (eventObservers.size === 0) {
          this.observers.delete(eventType);
        }
      }
    };
  }

  /**
   * Publish medical events with safety checks
   * @param {string} eventType - Medical event type
   * @param {Object} data - Event data
   * @param {Object} metadata - Event metadata
   */
  publish(eventType, data = {}, metadata = {}) {
    const eventObservers = this.observers.get(eventType);
    if (!eventObservers || eventObservers.size === 0) {
      return;
    }

    const event = {
      type: eventType,
      data: this.sanitizeEventData(data),
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'MedicalEventObserver',
        ...metadata,
      },
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Log event for medical audit trail
    this.logEvent(event);

    // Sort observers by priority (higher priority first)
    const sortedObservers = Array.from(eventObservers).sort((a, b) => b.priority - a.priority);

    // Notify observers with error handling
    sortedObservers.forEach((observer) => {
      try {
        observer.callback(event);

        // Remove one-time observers
        if (observer.once) {
          eventObservers.delete(observer);
        }
      } catch (error) {
        // (`Medical observer error for event ${eventType}:`, error);
        // Don't propagate observer errors to prevent cascade failures
      }
    });
  }

  /**
   * Sanitize event data to prevent sensitive information leakage
   * @param {Object} data - Raw event data
   * @returns {Object} Sanitized data
   */
  sanitizeEventData(data) {
    const sensitiveFields = ['password', 'ssn', 'medical_record_number', 'patient_id'];
    const sanitized = { ...data };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Log event for medical audit trail
   * @param {Object} event - Event to log
   */
  logEvent(event) {
    this.eventHistory.push({
      ...event,
      loggedAt: new Date().toISOString(),
    });

    // Maintain history size limit
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Get event history for audit purposes
   * @param {string} eventType - Optional event type filter
   * @returns {Array} Event history
   */
  getEventHistory(eventType = null) {
    if (eventType) {
      return this.eventHistory.filter((event) => event.type === eventType);
    }
    return [...this.eventHistory];
  }

  /**
   * Clear all observers and history (for privacy compliance)
   */
  clearAll() {
    this.observers.clear();
    this.eventHistory = [];
  }

  /**
   * Get observer statistics for monitoring
   * @returns {Object} Observer statistics
   */
  getStats() {
    const stats = {
      totalEventTypes: this.observers.size,
      totalObservers: 0,
      eventHistory: this.eventHistory.length,
      eventTypes: {},
    };

    this.observers.forEach((observers, eventType) => {
      stats.totalObservers += observers.size;
      stats.eventTypes[eventType] = observers.size;
    });

    return stats;
  }
}

// Medical event types constants
export const MEDICAL_EVENTS = {
  // Patient data events
  PATIENT_DATA_UPDATED: 'patient_data_updated',
  VALIDATION_ERROR: 'validation_error',
  VALIDATION_SUCCESS: 'validation_success',

  // Clinical workflow events
  TRIAGE_COMPLETED: 'triage_completed',
  ASSESSMENT_STARTED: 'assessment_started',
  RESULTS_GENERATED: 'results_generated',

  // System events
  PERFORMANCE_WARNING: 'performance_warning',
  SECURITY_EVENT: 'security_event',
  AUDIT_EVENT: 'audit_event',

  // User interaction events
  FORM_SUBMITTED: 'form_submitted',
  NAVIGATION_CHANGED: 'navigation_changed',
  SESSION_TIMEOUT: 'session_timeout',
};

// Export singleton instance
export const medicalEventObserver = new MedicalEventObserver();
