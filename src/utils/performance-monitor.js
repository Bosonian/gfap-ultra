/**
 * Medical Performance Monitoring System
 * iGFAP Stroke Triage Assistant - Clinical Function Performance Tracking
 *
 * Critical for emergency medical scenarios where timing is crucial
 * Monitors medical calculation performance and alerts on delays
 */

export class MedicalPerformanceMonitor {
  constructor() {
    this.measurements = new Map();
    this.criticalThresholds = {
      // Emergency thresholds in milliseconds
      medical_calculation: 1000,
      api_request: 5000,
      validation: 500,
      rendering: 100,
      authentication: 2000,
    };

    this.performanceLog = [];
    this.isMonitoringEnabled = true;
  }

  /**
   * Measure execution time of critical medical functions
   * @param {string} functionName - Name of the medical function
   * @param {Function} fn - Function to measure
   * @param {string} category - Performance category
   * @returns {Promise<any>} - Function result with timing data
   */
  async measureClinicalFunction(functionName, fn, category = "medical_calculation") {
    if (!this.isMonitoringEnabled) {
      return await fn();
    }

    const measurementId = `${functionName}_${Date.now()}`;
    const startTime = performance.now();

    try {
      // Start performance mark
      performance.mark(`${measurementId}_start`);

      // Execute the medical function
      const result = await fn();

      // End performance mark
      performance.mark(`${measurementId}_end`);

      // Calculate duration
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Create performance measure
      performance.measure(measurementId, `${measurementId}_start`, `${measurementId}_end`);

      // Log performance data
      this.recordMeasurement(functionName, duration, category, true);

      // Check for critical delays
      this.checkCriticalThreshold(functionName, duration, category);

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Record failed execution
      this.recordMeasurement(functionName, duration, category, false, error);

      // Re-throw error for proper error handling
      throw error;
    } finally {
      // Clean up performance marks
      try {
        performance.clearMarks(`${measurementId}_start`);
        performance.clearMarks(`${measurementId}_end`);
        performance.clearMeasures(measurementId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Record performance measurement
   * @param {string} functionName - Function name
   * @param {number} duration - Execution time in ms
   * @param {string} category - Performance category
   * @param {boolean} success - Whether execution succeeded
   * @param {Error} error - Error if execution failed
   */
  recordMeasurement(functionName, duration, category, success = true, error = null) {
    const measurement = {
      functionName,
      duration,
      category,
      success,
      error: error?.message || null,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
    };

    // Store in memory for analysis
    if (!this.measurements.has(functionName)) {
      this.measurements.set(functionName, []);
    }
    this.measurements.get(functionName).push(measurement);

    // Add to performance log
    this.performanceLog.push(measurement);

    // Limit memory usage - keep only last 1000 measurements
    if (this.performanceLog.length > 1000) {
      this.performanceLog.shift();
    }

    // Keep only last 100 measurements per function
    const functionMeasurements = this.measurements.get(functionName);
    if (functionMeasurements.length > 100) {
      functionMeasurements.shift();
    }
  }

  /**
   * Check if function exceeded critical medical timing thresholds
   * @param {string} functionName - Function name
   * @param {number} duration - Execution time in ms
   * @param {string} category - Performance category
   */
  checkCriticalThreshold(functionName, duration, category) {
    const threshold = this.criticalThresholds[category] || 1000;

    if (duration > threshold) {
      const warningMessage = `⚠️ CRITICAL MEDICAL DELAY: ${functionName} took ${duration.toFixed(1)}ms (threshold: ${threshold}ms)`;

      // Log critical warning without exposing to console (PHI protection)
      this.logCriticalDelay(functionName, duration, threshold, category);

      // For development/testing - can be removed in production
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        // (warningMessage);
      }
    }
  }

  /**
   * Log critical delays for clinical review
   * @param {string} functionName - Function name
   * @param {number} duration - Actual duration
   * @param {number} threshold - Expected threshold
   * @param {string} category - Performance category
   */
  logCriticalDelay(functionName, duration, threshold, category) {
    const delayRecord = {
      type: "CRITICAL_DELAY",
      functionName,
      duration,
      threshold,
      category,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100), // Limited info only
      severity: duration > threshold * 2 ? "HIGH" : "MEDIUM",
    };

    // Store for clinical review
    this.performanceLog.push(delayRecord);
  }

  /**
   * Get performance statistics for medical functions
   * @param {string} functionName - Optional function name filter
   * @returns {Object} Performance statistics
   */
  getPerformanceStats(functionName = null) {
    let measurements = this.performanceLog;

    if (functionName) {
      measurements = measurements.filter(m => m.functionName === functionName);
    }

    if (measurements.length === 0) {
      return {
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        successRate: 0,
      };
    }

    const validMeasurements = measurements.filter(m => typeof m.duration === "number");
    const durations = validMeasurements.map(m => m.duration);
    const successfulMeasurements = validMeasurements.filter(m => m.success);

    return {
      count: validMeasurements.length,
      average: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      successRate: (successfulMeasurements.length / validMeasurements.length) * 100,
      criticalDelays: measurements.filter(m => m.type === "CRITICAL_DELAY").length,
    };
  }

  /**
   * Get performance report for clinical review
   * @returns {Object} Clinical performance report
   */
  getClinicalPerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      totalMeasurements: this.performanceLog.length,
      categories: {},
    };

    // Group by category
    Object.keys(this.criticalThresholds).forEach(category => {
      const categoryMeasurements = this.performanceLog.filter(m => m.category === category);
      report.categories[category] = this.getPerformanceStats();
      report.categories[category].measurements = categoryMeasurements.length;
    });

    // Critical delays summary
    const criticalDelays = this.performanceLog.filter(m => m.type === "CRITICAL_DELAY");
    report.criticalDelays = {
      total: criticalDelays.length,
      high: criticalDelays.filter(d => d.severity === "HIGH").length,
      medium: criticalDelays.filter(d => d.severity === "MEDIUM").length,
      functions: [...new Set(criticalDelays.map(d => d.functionName))],
    };

    return report;
  }

  /**
   * Clear performance data (for privacy compliance)
   */
  clearPerformanceData() {
    this.measurements.clear();
    this.performanceLog = [];
  }

  /**
   * Enable/disable performance monitoring
   * @param {boolean} enabled - Whether to enable monitoring
   */
  setMonitoringEnabled(enabled) {
    this.isMonitoringEnabled = enabled;
  }

  /**
   * Get current session ID for tracking
   * @returns {string} Session identifier
   */
  getSessionId() {
    if (!this._sessionId) {
      this._sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this._sessionId;
  }

  /**
   * Export performance data for clinical analysis (anonymized)
   * @returns {Object} Anonymized performance data
   */
  exportClinicalData() {
    return {
      timestamp: new Date().toISOString(),
      performanceStats: this.getClinicalPerformanceReport(),
      systemInfo: {
        userAgent: navigator.userAgent.substring(0, 100),
        platform: navigator.platform,
        language: navigator.language,
        onLine: navigator.onLine,
      },
    };
  }
}

// Export singleton instance for clinical use
export const medicalPerformanceMonitor = new MedicalPerformanceMonitor();

// Helper function for easy integration
export function measureMedicalFunction(functionName, fn, category = "medical_calculation") {
  return medicalPerformanceMonitor.measureClinicalFunction(functionName, fn, category);
}
