/**
 * Medical Performance Monitoring System
 * iGFAP Stroke Triage Assistant - Enterprise Performance Architecture
 *
 * Provides comprehensive performance monitoring for medical software compliance
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "../patterns/observer.js";

/**
 * Performance metric types for medical applications
 */
export const PerformanceMetricType = {
  API_CALL: "api_call",
  VALIDATION: "validation",
  PREDICTION: "prediction",
  RENDER: "render",
  USER_INTERACTION: "user_interaction",
  MEMORY: "memory",
  NETWORK: "network",
  CACHE: "cache",
};

/**
 * Performance thresholds for medical critical operations
 */
export const MedicalPerformanceThresholds = {
  CRITICAL_API_RESPONSE: 3000, // 3 seconds max for critical medical APIs
  VALIDATION_RESPONSE: 100, // 100ms max for form validation
  PREDICTION_RESPONSE: 5000, // 5 seconds max for ML predictions
  UI_RENDER: 16, // 16ms for 60fps smooth UI
  USER_INTERACTION: 100, // 100ms max for immediate feedback
  MEMORY_LEAK_THRESHOLD: 50 * 1024 * 1024, // 50MB memory increase
};

/**
 * Performance metric data structure
 */
class PerformanceMetric {
  constructor(type, name, startTime = performance.now()) {
    this.type = type;
    this.name = name;
    this.startTime = startTime;
    this.endTime = null;
    this.duration = null;
    this.metadata = {};
    this.id = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Mark the end of the performance measurement
   */
  end() {
    this.endTime = performance.now();
    this.duration = this.endTime - this.startTime;
    return this;
  }

  /**
   * Add metadata to the metric
   */
  addMetadata(key, value) {
    this.metadata[key] = value;
    return this;
  }

  /**
   * Check if metric exceeds threshold
   */
  exceedsThreshold() {
    const threshold = MedicalPerformanceThresholds[this.getThresholdKey()];
    return threshold && this.duration > threshold;
  }

  /**
   * Get the appropriate threshold key for this metric
   */
  getThresholdKey() {
    switch (this.type) {
    case PerformanceMetricType.API_CALL:
      return this.metadata.critical ? "CRITICAL_API_RESPONSE" : "PREDICTION_RESPONSE";
    case PerformanceMetricType.VALIDATION:
      return "VALIDATION_RESPONSE";
    case PerformanceMetricType.PREDICTION:
      return "PREDICTION_RESPONSE";
    case PerformanceMetricType.RENDER:
      return "UI_RENDER";
    case PerformanceMetricType.USER_INTERACTION:
      return "USER_INTERACTION";
    default:
      return null;
    }
  }

  /**
   * Get performance grade based on thresholds
   */
  getPerformanceGrade() {
    const threshold = MedicalPerformanceThresholds[this.getThresholdKey()];
    if (!threshold) {
      return "N/A";
    }

    const ratio = this.duration / threshold;
    if (ratio <= 0.5) {
      return "EXCELLENT";
    }
    if (ratio <= 0.75) {
      return "GOOD";
    }
    if (ratio <= 1.0) {
      return "ACCEPTABLE";
    }
    if (ratio <= 1.5) {
      return "WARNING";
    }
    return "CRITICAL";
  }
}

/**
 * Medical Performance Monitor for enterprise-grade monitoring
 */
export class MedicalPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.activeMetrics = new Map();
    this.memoryBaseline = null;
    this.performanceObserver = null;
    this.isMonitoring = false;
    this.reportingInterval = null;
    this.config = {
      reportingIntervalMs: 30000, // Report every 30 seconds
      maxMetricsRetention: 1000, // Keep last 1000 metrics
      enableMemoryMonitoring: true,
      enableNetworkMonitoring: true,
      enableUserTimingAPI: true,
    };
  }

  /**
   * Start performance monitoring
   */
  start() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.memoryBaseline = this.getMemoryUsage();

    // Initialize Performance Observer API if available
    if (window.PerformanceObserver) {
      this.initializePerformanceObserver();
    }

    // Start periodic reporting
    this.reportingInterval = setInterval(() => {
      this.generatePerformanceReport();
    }, this.config.reportingIntervalMs);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "performance_monitoring_started",
      memoryBaseline: this.memoryBaseline,
    });
  }

  /**
   * Stop performance monitoring
   */
  stop() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
      this.reportingInterval = null;
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "performance_monitoring_stopped",
      totalMetrics: this.metrics.size,
    });
  }

  /**
   * Initialize Performance Observer for automatic metric collection
   */
  initializePerformanceObserver() {
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordPerformanceEntry(entry);
        });
      });

      // Observe different types of performance entries
      this.performanceObserver.observe({ entryTypes: ["measure", "navigation", "resource"] });
    } catch (error) {
      // ('Performance Observer not supported:', error.message);
    }
  }

  /**
   * Record performance entry from Performance Observer
   */
  recordPerformanceEntry(entry) {
    let metricType = PerformanceMetricType.NETWORK;
    let { name } = entry;

    // Categorize based on entry type
    switch (entry.entryType) {
    case "navigation":
      metricType = PerformanceMetricType.RENDER;
      name = "page_load";
      break;
    case "resource":
      metricType = entry.name.includes("/api/") ? PerformanceMetricType.API_CALL : PerformanceMetricType.NETWORK;
      break;
    case "measure":
      metricType = this.categorizeUserMeasure(entry.name);
      break;
    }

    const metric = new PerformanceMetric(metricType, name, entry.startTime);
    metric.end();
    metric.duration = entry.duration;
    metric.addMetadata("entryType", entry.entryType);

    this.storeMetric(metric);
  }

  /**
   * Categorize user-defined measures
   */
  categorizeUserMeasure(name) {
    if (name.includes("validation")) {
      return PerformanceMetricType.VALIDATION;
    }
    if (name.includes("prediction")) {
      return PerformanceMetricType.PREDICTION;
    }
    if (name.includes("render")) {
      return PerformanceMetricType.RENDER;
    }
    if (name.includes("api")) {
      return PerformanceMetricType.API_CALL;
    }
    return PerformanceMetricType.USER_INTERACTION;
  }

  /**
   * Start measuring a performance metric
   */
  startMeasurement(type, name, metadata = {}) {
    const metric = new PerformanceMetric(type, name);

    // Add initial metadata
    Object.entries(metadata).forEach(([key, value]) => {
      metric.addMetadata(key, value);
    });

    this.activeMetrics.set(metric.id, metric);

    // Also use User Timing API if enabled and available
    if (this.config.enableUserTimingAPI && performance.mark) {
      performance.mark(`${name}_start`);
    }

    return metric.id;
  }

  /**
   * End measuring a performance metric
   */
  endMeasurement(metricId, additionalMetadata = {}) {
    const metric = this.activeMetrics.get(metricId);
    if (!metric) {
      // (`Performance metric ${metricId} not found`);
      return null;
    }

    metric.end();

    // Add additional metadata
    Object.entries(additionalMetadata).forEach(([key, value]) => {
      metric.addMetadata(key, value);
    });

    // Use User Timing API if enabled
    if (this.config.enableUserTimingAPI && performance.mark && performance.measure) {
      try {
        performance.mark(`${metric.name}_end`);
        performance.measure(metric.name, `${metric.name}_start`, `${metric.name}_end`);
      } catch (error) {
        // ('Error creating performance measure:', error.message);
      }
    }

    this.activeMetrics.delete(metricId);
    this.storeMetric(metric);

    // Check for performance violations
    if (metric.exceedsThreshold()) {
      this.handlePerformanceViolation(metric);
    }

    return metric;
  }

  /**
   * Store metric with retention limits
   */
  storeMetric(metric) {
    this.metrics.set(metric.id, metric);

    // Implement retention policy
    if (this.metrics.size > this.config.maxMetricsRetention) {
      const oldestKey = this.metrics.keys().next().value;
      this.metrics.delete(oldestKey);
    }

    // Publish metric event
    medicalEventObserver.publish(MEDICAL_EVENTS.PERFORMANCE_METRIC, {
      metric: {
        id: metric.id,
        type: metric.type,
        name: metric.name,
        duration: metric.duration,
        grade: metric.getPerformanceGrade(),
        exceedsThreshold: metric.exceedsThreshold(),
      },
    });
  }

  /**
   * Handle performance violations
   */
  handlePerformanceViolation(metric) {
    const violation = {
      metricId: metric.id,
      type: metric.type,
      name: metric.name,
      duration: metric.duration,
      threshold: MedicalPerformanceThresholds[metric.getThresholdKey()],
      grade: metric.getPerformanceGrade(),
      metadata: metric.metadata,
    };

    medicalEventObserver.publish(MEDICAL_EVENTS.PERFORMANCE_VIOLATION, violation);

    // Log critical violations
    if (metric.getPerformanceGrade() === "CRITICAL") {
      // ('CRITICAL PERFORMANCE VIOLATION:', violation);
    }
  }

  /**
   * Get current memory usage
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };
    }
    return null;
  }

  /**
   * Check for memory leaks
   */
  checkMemoryLeaks() {
    if (!this.config.enableMemoryMonitoring || !this.memoryBaseline) {
      return null;
    }

    const currentMemory = this.getMemoryUsage();
    if (!currentMemory) {
      return null;
    }

    const memoryIncrease = currentMemory.usedJSHeapSize - this.memoryBaseline.usedJSHeapSize;
    const isLeak = memoryIncrease > MedicalPerformanceThresholds.MEMORY_LEAK_THRESHOLD;

    if (isLeak) {
      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "memory_leak_detected",
        memoryIncrease,
        baseline: this.memoryBaseline.usedJSHeapSize,
        current: currentMemory.usedJSHeapSize,
      });
    }

    return {
      memoryIncrease,
      isLeak,
      baseline: this.memoryBaseline,
      current: currentMemory,
    };
  }

  /**
   * Generate comprehensive performance report
   */
  generatePerformanceReport() {
    const metrics = Array.from(this.metrics.values());
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);

    // Filter metrics from last hour
    const recentMetrics = metrics.filter((m) => new Date(m.timestamp).getTime() > lastHour);

    // Group by type
    const metricsByType = recentMetrics.reduce((acc, metric) => {
      if (!acc[metric.type]) {
        acc[metric.type] = [];
      }
      acc[metric.type].push(metric);
      return acc;
    }, {});

    // Calculate statistics
    const report = {
      timestamp: new Date().toISOString(),
      timeframe: "last_hour",
      totalMetrics: recentMetrics.length,
      memoryStatus: this.checkMemoryLeaks(),
      metricsByType: {},
      violations: recentMetrics.filter((m) => m.exceedsThreshold()).length,
      topSlowOperations: this.getTopSlowOperations(recentMetrics),
    };

    // Calculate statistics for each type
    Object.entries(metricsByType).forEach(([type, typeMetrics]) => {
      const durations = typeMetrics.map((m) => m.duration);
      const grades = typeMetrics.map((m) => m.getPerformanceGrade());

      report.metricsByType[type] = {
        count: typeMetrics.length,
        averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
        medianDuration: this.calculateMedian(durations),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        violations: typeMetrics.filter((m) => m.exceedsThreshold()).length,
        gradeDistribution: this.calculateGradeDistribution(grades),
      };
    });

    medicalEventObserver.publish(MEDICAL_EVENTS.PERFORMANCE_REPORT, report);

    return report;
  }

  /**
   * Calculate median value
   */
  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Calculate grade distribution
   */
  calculateGradeDistribution(grades) {
    return grades.reduce((acc, grade) => {
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Get top slow operations
   */
  getTopSlowOperations(metrics, limit = 10) {
    return metrics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
      .map((m) => ({
        name: m.name,
        type: m.type,
        duration: m.duration,
        grade: m.getPerformanceGrade(),
        timestamp: m.timestamp,
      }));
  }

  /**
   * Get performance statistics for specific type
   */
  getTypeStatistics(type, timeframeMs = 60 * 60 * 1000) {
    const now = Date.now();
    const cutoff = now - timeframeMs;

    const typeMetrics = Array.from(this.metrics.values())
      .filter((m) => m.type === type && new Date(m.timestamp).getTime() > cutoff);

    if (typeMetrics.length === 0) {
      return null;
    }

    const durations = typeMetrics.map((m) => m.duration);
    return {
      type,
      count: typeMetrics.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      medianDuration: this.calculateMedian(durations),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      violations: typeMetrics.filter((m) => m.exceedsThreshold()).length,
    };
  }

  /**
   * Clear all metrics (privacy compliance)
   */
  clearMetrics() {
    this.metrics.clear();
    this.activeMetrics.clear();

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "performance_metrics_cleared",
    });
  }

  /**
   * Get monitor configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Update monitor configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Restart reporting interval if changed
    if (newConfig.reportingIntervalMs && this.reportingInterval) {
      clearInterval(this.reportingInterval);
      this.reportingInterval = setInterval(() => {
        this.generatePerformanceReport();
      }, this.config.reportingIntervalMs);
    }
  }
}

// Export singleton instance
export const medicalPerformanceMonitor = new MedicalPerformanceMonitor();
