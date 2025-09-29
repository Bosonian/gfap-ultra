/**
 * Quality Metrics Tracking System
 * iGFAP Stroke Triage Assistant - Phase 4 Medical Intelligence
 *
 * Comprehensive quality metrics and performance tracking for clinical outcomes
 */

import { medicalEventObserver, MEDICAL_EVENTS } from '../patterns/observer.js';
import { medicalPerformanceMonitor, PerformanceMetricType } from '../performance/medical-performance-monitor.js';
import { predictionCache } from '../performance/medical-cache.js';

/**
 * Quality metric categories
 */
export const QualityCategories = {
  PROCESS: 'process',
  OUTCOME: 'outcome',
  STRUCTURE: 'structure',
  SAFETY: 'safety',
  EFFICIENCY: 'efficiency',
  PATIENT_EXPERIENCE: 'patient_experience',
};

/**
 * Clinical quality indicators
 */
export const ClinicalIndicators = {
  DOOR_TO_NEEDLE_TIME: 'door_to_needle_time',
  DOOR_TO_IMAGING_TIME: 'door_to_imaging_time',
  IMAGING_TO_DECISION_TIME: 'imaging_to_decision_time',
  MORTALITY_RATE_30D: 'mortality_rate_30d',
  FUNCTIONAL_INDEPENDENCE_90D: 'functional_independence_90d',
  HEMORRHAGIC_TRANSFORMATION_RATE: 'hemorrhagic_transformation_rate',
  THROMBOLYSIS_RATE: 'thrombolysis_rate',
  MECHANICAL_THROMBECTOMY_RATE: 'mechanical_thrombectomy_rate',
  PREDICTION_ACCURACY: 'prediction_accuracy',
  MODEL_CALIBRATION: 'model_calibration',
  ALERT_APPROPRIATENESS: 'alert_appropriateness',
  GUIDELINE_ADHERENCE: 'guideline_adherence',
};

/**
 * Benchmarking standards
 */
export const QualityBenchmarks = {
  [ClinicalIndicators.DOOR_TO_NEEDLE_TIME]: {
    target: 60, // minutes
    excellent: 45,
    good: 60,
    acceptable: 90,
    unit: 'minutes',
  },
  [ClinicalIndicators.DOOR_TO_IMAGING_TIME]: {
    target: 25, // minutes
    excellent: 20,
    good: 25,
    acceptable: 45,
    unit: 'minutes',
  },
  [ClinicalIndicators.MORTALITY_RATE_30D]: {
    target: 15, // percentage
    excellent: 10,
    good: 15,
    acceptable: 20,
    unit: 'percentage',
  },
  [ClinicalIndicators.FUNCTIONAL_INDEPENDENCE_90D]: {
    target: 50, // percentage
    excellent: 60,
    good: 50,
    acceptable: 40,
    unit: 'percentage',
  },
  [ClinicalIndicators.THROMBOLYSIS_RATE]: {
    target: 15, // percentage of eligible patients
    excellent: 20,
    good: 15,
    acceptable: 10,
    unit: 'percentage',
  },
  [ClinicalIndicators.PREDICTION_ACCURACY]: {
    target: 85, // percentage
    excellent: 90,
    good: 85,
    acceptable: 80,
    unit: 'percentage',
  },
};

/**
 * Quality metric data structure
 */
class QualityMetric {
  constructor(indicator, category, value, timestamp, metadata = {}) {
    this.indicator = indicator;
    this.category = category;
    this.value = value;
    this.timestamp = timestamp;
    this.metadata = metadata;
    this.benchmark = QualityBenchmarks[indicator];
    this.performance = this.calculatePerformance();
  }

  /**
   * Calculate performance against benchmark
   */
  calculatePerformance() {
    if (!this.benchmark) {
      return { level: 'unknown', score: null };
    }

    const { excellent, good, acceptable } = this.benchmark;

    // For metrics where lower is better (e.g., time metrics)
    const isLowerBetter = this.indicator.includes('time') || this.indicator.includes('mortality');

    let level; let
      score;

    if (isLowerBetter) {
      if (this.value <= excellent) {
        level = 'excellent';
        score = 100;
      } else if (this.value <= good) {
        level = 'good';
        score = 85;
      } else if (this.value <= acceptable) {
        level = 'acceptable';
        score = 70;
      } else {
        level = 'needs_improvement';
        score = Math.max(0, 50 - ((this.value - acceptable) / acceptable) * 25);
      }
    } else {
      // For metrics where higher is better (e.g., rates, accuracy)
      if (this.value >= excellent) {
        level = 'excellent';
        score = 100;
      } else if (this.value >= good) {
        level = 'good';
        score = 85;
      } else if (this.value >= acceptable) {
        level = 'acceptable';
        score = 70;
      } else {
        level = 'needs_improvement';
        score = Math.max(0, (this.value / acceptable) * 70);
      }
    }

    return { level, score: Math.round(score) };
  }

  /**
   * Get performance status
   */
  getStatus() {
    return {
      indicator: this.indicator,
      value: this.value,
      benchmark: this.benchmark,
      performance: this.performance,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Quality metrics aggregator
 */
class QualityAggregator {
  constructor() {
    this.metrics = [];
    this.aggregations = new Map();
    this.trends = new Map();
  }

  /**
   * Add metric to aggregation
   */
  addMetric(metric) {
    this.metrics.push(metric);
    this.updateAggregations(metric);
    this.updateTrends(metric);
  }

  /**
   * Update aggregations for metric
   */
  updateAggregations(metric) {
    const key = metric.indicator;

    if (!this.aggregations.has(key)) {
      this.aggregations.set(key, {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        values: [],
      });
    }

    const agg = this.aggregations.get(key);
    agg.count++;
    agg.sum += metric.value;
    agg.min = Math.min(agg.min, metric.value);
    agg.max = Math.max(agg.max, metric.value);
    agg.values.push({ value: metric.value, timestamp: metric.timestamp });

    // Keep only last 100 values for performance
    if (agg.values.length > 100) {
      agg.values.shift();
    }
  }

  /**
   * Update trends for metric
   */
  updateTrends(metric) {
    const key = metric.indicator;
    const now = new Date();
    const timeKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (!this.trends.has(key)) {
      this.trends.set(key, new Map());
    }

    const metricTrends = this.trends.get(key);

    if (!metricTrends.has(timeKey)) {
      metricTrends.set(timeKey, {
        date: timeKey,
        values: [],
        average: 0,
        count: 0,
      });
    }

    const dayTrend = metricTrends.get(timeKey);
    dayTrend.values.push(metric.value);
    dayTrend.count++;
    dayTrend.average = dayTrend.values.reduce((sum, val) => sum + val, 0) / dayTrend.count;
  }

  /**
   * Get aggregated statistics
   */
  getAggregatedStats(indicator) {
    const agg = this.aggregations.get(indicator);
    if (!agg) {
      return null;
    }

    return {
      indicator,
      count: agg.count,
      average: agg.sum / agg.count,
      min: agg.min,
      max: agg.max,
      median: this.calculateMedian(agg.values.map((v) => v.value)),
      standardDeviation: this.calculateStandardDeviation(agg.values.map((v) => v.value)),
    };
  }

  /**
   * Get trend data
   */
  getTrendData(indicator, days = 30) {
    const metricTrends = this.trends.get(indicator);
    if (!metricTrends) {
      return null;
    }

    const now = new Date();
    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const timeKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      if (metricTrends.has(timeKey)) {
        trends.push(metricTrends.get(timeKey));
      } else {
        trends.push({
          date: timeKey,
          values: [],
          average: null,
          count: 0,
        });
      }
    }

    return trends;
  }

  /**
   * Calculate median
   */
  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Calculate standard deviation
   */
  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => (val - mean) ** 2);
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(avgSquaredDiff);
  }
}

/**
 * Quality dashboard generator
 */
class QualityDashboard {
  constructor(aggregator) {
    this.aggregator = aggregator;
  }

  /**
   * Generate dashboard data
   */
  generateDashboard() {
    const indicators = Object.values(ClinicalIndicators);
    const dashboard = {
      overview: this.generateOverview(),
      indicators: [],
      trends: [],
      alerts: [],
    };

    // Generate indicator summaries
    indicators.forEach((indicator) => {
      const stats = this.aggregator.getAggregatedStats(indicator);
      const trends = this.aggregator.getTrendData(indicator, 7); // Last 7 days

      if (stats) {
        const indicatorData = {
          indicator,
          name: this.getIndicatorName(indicator),
          category: this.getIndicatorCategory(indicator),
          current: stats.average,
          benchmark: QualityBenchmarks[indicator],
          performance: this.calculateIndicatorPerformance(stats.average, indicator),
          trend: this.calculateTrendDirection(trends),
          stats,
        };

        dashboard.indicators.push(indicatorData);

        // Check for quality alerts
        const alert = this.checkQualityAlert(indicatorData);
        if (alert) {
          dashboard.alerts.push(alert);
        }
      }
    });

    // Generate trend summaries
    dashboard.trends = this.generateTrendSummaries();

    return dashboard;
  }

  /**
   * Generate overview metrics
   */
  generateOverview() {
    const allMetrics = this.aggregator.metrics;
    const last24Hours = allMetrics.filter((m) => new Date(m.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));

    const performanceScores = allMetrics
      .filter((m) => m.performance.score !== null)
      .map((m) => m.performance.score);

    const avgPerformance = performanceScores.length > 0
      ? performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length
      : 0;

    return {
      totalMetrics: allMetrics.length,
      metricsLast24h: last24Hours.length,
      averagePerformance: Math.round(avgPerformance),
      qualityLevel: this.getQualityLevel(avgPerformance),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get indicator name
   */
  getIndicatorName(indicator) {
    const names = {
      [ClinicalIndicators.DOOR_TO_NEEDLE_TIME]: 'Door-to-Needle Time',
      [ClinicalIndicators.DOOR_TO_IMAGING_TIME]: 'Door-to-Imaging Time',
      [ClinicalIndicators.IMAGING_TO_DECISION_TIME]: 'Imaging-to-Decision Time',
      [ClinicalIndicators.MORTALITY_RATE_30D]: '30-Day Mortality Rate',
      [ClinicalIndicators.FUNCTIONAL_INDEPENDENCE_90D]: '90-Day Functional Independence',
      [ClinicalIndicators.HEMORRHAGIC_TRANSFORMATION_RATE]: 'Hemorrhagic Transformation Rate',
      [ClinicalIndicators.THROMBOLYSIS_RATE]: 'Thrombolysis Rate',
      [ClinicalIndicators.MECHANICAL_THROMBECTOMY_RATE]: 'Mechanical Thrombectomy Rate',
      [ClinicalIndicators.PREDICTION_ACCURACY]: 'Prediction Accuracy',
      [ClinicalIndicators.MODEL_CALIBRATION]: 'Model Calibration',
      [ClinicalIndicators.ALERT_APPROPRIATENESS]: 'Alert Appropriateness',
      [ClinicalIndicators.GUIDELINE_ADHERENCE]: 'Guideline Adherence',
    };

    return names[indicator] || indicator.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Get indicator category
   */
  getIndicatorCategory(indicator) {
    const categories = {
      [ClinicalIndicators.DOOR_TO_NEEDLE_TIME]: QualityCategories.PROCESS,
      [ClinicalIndicators.DOOR_TO_IMAGING_TIME]: QualityCategories.PROCESS,
      [ClinicalIndicators.IMAGING_TO_DECISION_TIME]: QualityCategories.EFFICIENCY,
      [ClinicalIndicators.MORTALITY_RATE_30D]: QualityCategories.OUTCOME,
      [ClinicalIndicators.FUNCTIONAL_INDEPENDENCE_90D]: QualityCategories.OUTCOME,
      [ClinicalIndicators.HEMORRHAGIC_TRANSFORMATION_RATE]: QualityCategories.SAFETY,
      [ClinicalIndicators.THROMBOLYSIS_RATE]: QualityCategories.PROCESS,
      [ClinicalIndicators.MECHANICAL_THROMBECTOMY_RATE]: QualityCategories.PROCESS,
      [ClinicalIndicators.PREDICTION_ACCURACY]: QualityCategories.EFFICIENCY,
      [ClinicalIndicators.MODEL_CALIBRATION]: QualityCategories.EFFICIENCY,
      [ClinicalIndicators.ALERT_APPROPRIATENESS]: QualityCategories.EFFICIENCY,
      [ClinicalIndicators.GUIDELINE_ADHERENCE]: QualityCategories.PROCESS,
    };

    return categories[indicator] || QualityCategories.PROCESS;
  }

  /**
   * Calculate indicator performance
   */
  calculateIndicatorPerformance(value, indicator) {
    const metric = new QualityMetric(indicator, null, value, new Date().toISOString());
    return metric.performance;
  }

  /**
   * Calculate trend direction
   */
  calculateTrendDirection(trends) {
    if (!trends || trends.length < 2) {
      return { direction: 'stable', change: 0 };
    }

    const validTrends = trends.filter((t) => t.average !== null);
    if (validTrends.length < 2) {
      return { direction: 'stable', change: 0 };
    }

    const recent = validTrends[validTrends.length - 1].average;
    const previous = validTrends[validTrends.length - 2].average;
    const change = ((recent - previous) / previous) * 100;

    let direction;
    if (Math.abs(change) < 5) {
      direction = 'stable';
    } else if (change > 0) {
      direction = 'improving';
    } else {
      direction = 'declining';
    }

    return { direction, change: Math.round(change * 10) / 10 };
  }

  /**
   * Check for quality alerts
   */
  checkQualityAlert(indicatorData) {
    const { performance, trend, indicator } = indicatorData;

    // Performance-based alerts
    if (performance.level === 'needs_improvement') {
      return {
        type: 'performance',
        severity: 'high',
        indicator,
        message: `${indicatorData.name} performance is below acceptable threshold`,
        recommendation: 'Review processes and implement improvement measures',
      };
    }

    // Trend-based alerts
    if (trend.direction === 'declining' && Math.abs(trend.change) > 15) {
      return {
        type: 'trend',
        severity: 'medium',
        indicator,
        message: `${indicatorData.name} showing declining trend (${trend.change}%)`,
        recommendation: 'Monitor closely and identify contributing factors',
      };
    }

    return null;
  }

  /**
   * Generate trend summaries
   */
  generateTrendSummaries() {
    const summaries = [];
    const indicators = Object.values(ClinicalIndicators);

    indicators.forEach((indicator) => {
      const trends = this.aggregator.getTrendData(indicator, 30);
      if (trends) {
        const summary = this.analyzeTrend(indicator, trends);
        if (summary) {
          summaries.push(summary);
        }
      }
    });

    return summaries.sort((a, b) => b.significance - a.significance);
  }

  /**
   * Analyze trend for significance
   */
  analyzeTrend(indicator, trends) {
    const validTrends = trends.filter((t) => t.average !== null);
    if (validTrends.length < 7) {
      return null;
    }

    // Calculate linear regression for trend analysis
    const points = validTrends.map((t, i) => ({ x: i, y: t.average }));
    const regression = this.calculateLinearRegression(points);

    const significance = Math.abs(regression.slope) * validTrends.length;

    return {
      indicator,
      name: this.getIndicatorName(indicator),
      slope: regression.slope,
      correlation: regression.correlation,
      significance,
      trend: regression.slope > 0 ? 'improving' : regression.slope < 0 ? 'declining' : 'stable',
      dataPoints: validTrends.length,
    };
  }

  /**
   * Calculate linear regression
   */
  calculateLinearRegression(points) {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate correlation coefficient
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    const correlation = denominator !== 0 ? numerator / denominator : 0;

    return { slope, intercept, correlation };
  }

  /**
   * Get quality level
   */
  getQualityLevel(score) {
    if (score >= 90) {
      return 'excellent';
    }
    if (score >= 85) {
      return 'good';
    }
    if (score >= 70) {
      return 'acceptable';
    }
    return 'needs_improvement';
  }
}

/**
 * Quality Metrics Tracking System
 */
export class QualityMetricsTracker {
  constructor() {
    this.aggregator = new QualityAggregator();
    this.dashboard = new QualityDashboard(this.aggregator);
    this.collectors = new Map();
    this.isActive = false;
    this.updateInterval = null;
  }

  /**
   * Initialize quality metrics tracking
   */
  async initialize() {
    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.SYSTEM_STARTUP,
      'quality_metrics_init',
    );

    try {
      // Register metric collectors
      this.registerMetricCollectors();

      // Setup event listeners
      this.setupEventListeners();

      // Start periodic collection
      this.startPeriodicCollection();

      this.isActive = true;

      medicalPerformanceMonitor.endMeasurement(metricId, { success: true });

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: 'quality_metrics_tracker_initialized',
        collectors: Array.from(this.collectors.keys()),
      });
    } catch (error) {
      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: false,
        error: error.message,
      });

      // ('Quality metrics tracker initialization failed:', error);
      throw error;
    }
  }

  /**
   * Register metric collectors
   */
  registerMetricCollectors() {
    // Process time collectors
    this.collectors.set('door_to_needle_collector', {
      indicator: ClinicalIndicators.DOOR_TO_NEEDLE_TIME,
      category: QualityCategories.PROCESS,
      collect: this.collectDoorToNeedleTime.bind(this),
    });

    this.collectors.set('door_to_imaging_collector', {
      indicator: ClinicalIndicators.DOOR_TO_IMAGING_TIME,
      category: QualityCategories.PROCESS,
      collect: this.collectDoorToImagingTime.bind(this),
    });

    // Outcome collectors
    this.collectors.set('prediction_accuracy_collector', {
      indicator: ClinicalIndicators.PREDICTION_ACCURACY,
      category: QualityCategories.EFFICIENCY,
      collect: this.collectPredictionAccuracy.bind(this),
    });

    this.collectors.set('alert_appropriateness_collector', {
      indicator: ClinicalIndicators.ALERT_APPROPRIATENESS,
      category: QualityCategories.EFFICIENCY,
      collect: this.collectAlertAppropriateness.bind(this),
    });

    // Treatment rate collectors
    this.collectors.set('thrombolysis_rate_collector', {
      indicator: ClinicalIndicators.THROMBOLYSIS_RATE,
      category: QualityCategories.PROCESS,
      collect: this.collectThrombolysisRate.bind(this),
    });
  }

  /**
   * Setup event listeners for real-time collection
   */
  setupEventListeners() {
    // Listen for clinical events
    medicalEventObserver.subscribe(MEDICAL_EVENTS.CLINICAL_ALERT, (data) => {
      this.handleClinicalAlert(data);
    });

    medicalEventObserver.subscribe(MEDICAL_EVENTS.PREDICTION_GENERATED, (data) => {
      this.handlePredictionGenerated(data);
    });

    medicalEventObserver.subscribe(MEDICAL_EVENTS.TREATMENT_DELIVERED, (data) => {
      this.handleTreatmentDelivered(data);
    });

    medicalEventObserver.subscribe(MEDICAL_EVENTS.PATIENT_OUTCOME, (data) => {
      this.handlePatientOutcome(data);
    });
  }

  /**
   * Start periodic metric collection
   */
  startPeriodicCollection() {
    // Collect metrics every 15 minutes
    this.updateInterval = setInterval(() => {
      this.collectAllMetrics();
    }, 15 * 60 * 1000);

    // Initial collection
    this.collectAllMetrics();
  }

  /**
   * Collect all metrics from registered collectors
   */
  async collectAllMetrics() {
    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.DATA_PROCESSING,
      'collect_all_metrics',
    );

    try {
      const collectionPromises = Array.from(this.collectors.values()).map(async (collector) => {
        try {
          const value = await collector.collect();
          if (value !== null && value !== undefined) {
            const metric = new QualityMetric(
              collector.indicator,
              collector.category,
              value,
              new Date().toISOString(),
            );
            this.aggregator.addMetric(metric);
            return { indicator: collector.indicator, value, success: true };
          }
        } catch (error) {
          // (`Failed to collect metric ${collector.indicator}:`, error);
          return { indicator: collector.indicator, error: error.message, success: false };
        }
        return null;
      });

      const results = await Promise.allSettled(collectionPromises);
      const successful = results.filter((r) => r.status === 'fulfilled' && r.value?.success);

      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: true,
        metricsCollected: successful.length,
      });
    } catch (error) {
      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: false,
        error: error.message,
      });

      // ('Metric collection failed:', error);
    }
  }

  /**
   * Record custom metric
   */
  recordMetric(indicator, category, value, metadata = {}) {
    const metric = new QualityMetric(
      indicator,
      category,
      value,
      new Date().toISOString(),
      metadata,
    );

    this.aggregator.addMetric(metric);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'quality_metric_recorded',
      indicator,
      value,
      performance: metric.performance,
    });

    return metric;
  }

  /**
   * Get quality dashboard
   */
  getQualityDashboard() {
    return this.dashboard.generateDashboard();
  }

  /**
   * Get metric statistics
   */
  getMetricStatistics(indicator) {
    return this.aggregator.getAggregatedStats(indicator);
  }

  /**
   * Get trend data
   */
  getTrendData(indicator, days = 30) {
    return this.aggregator.getTrendData(indicator, days);
  }

  /**
   * Export quality report
   */
  exportQualityReport(format = 'json') {
    const dashboard = this.getQualityDashboard();
    const report = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      dashboard,
      detailedMetrics: this.getDetailedMetrics(),
    };

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.convertToCSV(report);
      default:
        return report;
    }
  }

  /**
   * Get detailed metrics
   */
  getDetailedMetrics() {
    const indicators = Object.values(ClinicalIndicators);
    const detailed = {};

    indicators.forEach((indicator) => {
      const stats = this.aggregator.getAggregatedStats(indicator);
      const trends = this.aggregator.getTrendData(indicator, 30);

      if (stats) {
        detailed[indicator] = {
          statistics: stats,
          trends,
          benchmark: QualityBenchmarks[indicator],
        };
      }
    });

    return detailed;
  }

  /**
   * Specific metric collectors
   */
  async collectDoorToNeedleTime() {
    // Simulate collecting door-to-needle times from system
    // In real implementation, this would query database or system logs
    return Math.random() * 40 + 30; // 30-70 minutes
  }

  async collectDoorToImagingTime() {
    // Simulate collecting door-to-imaging times
    return Math.random() * 20 + 15; // 15-35 minutes
  }

  async collectPredictionAccuracy() {
    // Simulate prediction accuracy from model validation
    return Math.random() * 20 + 80; // 80-100%
  }

  async collectAlertAppropriateness() {
    // Simulate alert appropriateness metric
    return Math.random() * 30 + 70; // 70-100%
  }

  async collectThrombolysisRate() {
    // Simulate thrombolysis rate
    return Math.random() * 15 + 10; // 10-25%
  }

  /**
   * Event handlers for real-time metrics
   */
  handleClinicalAlert(data) {
    // Increment alert count for appropriateness tracking
    const isAppropriate = this.assessAlertAppropriateness(data.alert);

    this.recordMetric(
      ClinicalIndicators.ALERT_APPROPRIATENESS,
      QualityCategories.EFFICIENCY,
      isAppropriate ? 100 : 0,
      { alertId: data.alert.id, alertType: data.alert.ruleId },
    );
  }

  handlePredictionGenerated(data) {
    // Track prediction generation for quality monitoring
    const confidence = data.predictions?.mortality?.confidence?.percent || 0;

    this.recordMetric(
      'prediction_confidence',
      QualityCategories.EFFICIENCY,
      confidence,
      { patientId: data.patientId },
    );
  }

  handleTreatmentDelivered(data) {
    // Track treatment delivery times and rates
    if (data.treatment === 'thrombolysis') {
      const { doorToNeedleTime } = data;
      if (doorToNeedleTime) {
        this.recordMetric(
          ClinicalIndicators.DOOR_TO_NEEDLE_TIME,
          QualityCategories.PROCESS,
          doorToNeedleTime,
          { patientId: data.patientId },
        );
      }
    }
  }

  handlePatientOutcome(data) {
    // Track patient outcomes for quality assessment
    if (data.outcome === 'mortality_30d') {
      this.recordMetric(
        ClinicalIndicators.MORTALITY_RATE_30D,
        QualityCategories.OUTCOME,
        data.value ? 100 : 0, // Convert boolean to percentage point
        { patientId: data.patientId },
      );
    }

    if (data.outcome === 'functional_independence_90d') {
      this.recordMetric(
        ClinicalIndicators.FUNCTIONAL_INDEPENDENCE_90D,
        QualityCategories.OUTCOME,
        data.value ? 100 : 0,
        { patientId: data.patientId },
      );
    }
  }

  /**
   * Assess alert appropriateness
   */
  assessAlertAppropriateness(alert) {
    // Simplified appropriateness assessment
    // In real implementation, this would be more sophisticated

    if (alert.severity?.level === 'critical') {
      return Math.random() > 0.1; // 90% appropriate for critical alerts
    } if (alert.severity?.level === 'high') {
      return Math.random() > 0.2; // 80% appropriate for high alerts
    }
    return Math.random() > 0.3; // 70% appropriate for other alerts
  }

  /**
   * Convert report to CSV format
   */
  convertToCSV(report) {
    const rows = [
      ['Indicator', 'Category', 'Current Value', 'Benchmark Target', 'Performance Level', 'Trend Direction'],
    ];

    report.dashboard.indicators.forEach((indicator) => {
      rows.push([
        indicator.name,
        indicator.category,
        indicator.current?.toFixed(2) || 'N/A',
        indicator.benchmark?.target || 'N/A',
        indicator.performance?.level || 'N/A',
        indicator.trend?.direction || 'N/A',
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  /**
   * Get quality trends summary
   */
  getQualityTrendsSummary(days = 30) {
    const summary = {
      period: `${days} days`,
      overallTrend: 'stable',
      improvingIndicators: [],
      decliningIndicators: [],
      stableIndicators: [],
    };

    const indicators = Object.values(ClinicalIndicators);

    indicators.forEach((indicator) => {
      const trends = this.aggregator.getTrendData(indicator, days);
      if (trends) {
        const trendDirection = this.dashboard.calculateTrendDirection(trends);

        const indicatorSummary = {
          indicator,
          name: this.dashboard.getIndicatorName(indicator),
          direction: trendDirection.direction,
          change: trendDirection.change,
        };

        if (trendDirection.direction === 'improving') {
          summary.improvingIndicators.push(indicatorSummary);
        } else if (trendDirection.direction === 'declining') {
          summary.decliningIndicators.push(indicatorSummary);
        } else {
          summary.stableIndicators.push(indicatorSummary);
        }
      }
    });

    // Determine overall trend
    if (summary.improvingIndicators.length > summary.decliningIndicators.length) {
      summary.overallTrend = 'improving';
    } else if (summary.decliningIndicators.length > summary.improvingIndicators.length) {
      summary.overallTrend = 'declining';
    }

    return summary;
  }

  /**
   * Stop quality metrics tracking
   */
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.isActive = false;

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'quality_metrics_tracker_stopped',
    });
  }

  /**
   * Dispose quality metrics tracker
   */
  dispose() {
    this.stop();
    this.collectors.clear();
    this.aggregator.metrics.length = 0;
    this.aggregator.aggregations.clear();
    this.aggregator.trends.clear();

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'quality_metrics_tracker_disposed',
    });
  }
}

// Export quality metrics tracker instance
export const qualityMetricsTracker = new QualityMetricsTracker();
