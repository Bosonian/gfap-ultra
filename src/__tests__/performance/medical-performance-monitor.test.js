/**
 * Medical Performance Monitor Test Suite
 * Enterprise-Grade Performance Monitoring and SLA Tracking
 */

import {
  medicalPerformanceMonitor,
  PerformanceMetricType,
  PerformanceThreshold,
  PerformanceAlert,
  MedicalPerformanceReport,
} from '../../performance/medical-performance-monitor.js';

// Mock Performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

describe('MedicalPerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    medicalPerformanceMonitor.reset();
    medicalPerformanceMonitor.start();
  });

  afterEach(() => {
    medicalPerformanceMonitor.stop();
  });

  describe('Initialization and Lifecycle', () => {
    test('should initialize with default configuration', () => {
      expect(medicalPerformanceMonitor.isMonitoring).toBe(true);
      expect(medicalPerformanceMonitor.startTime).toBeDefined();
    });

    test('should start monitoring', () => {
      medicalPerformanceMonitor.stop();
      expect(medicalPerformanceMonitor.isMonitoring).toBe(false);

      medicalPerformanceMonitor.start();
      expect(medicalPerformanceMonitor.isMonitoring).toBe(true);
    });

    test('should stop monitoring', () => {
      expect(medicalPerformanceMonitor.isMonitoring).toBe(true);

      medicalPerformanceMonitor.stop();
      expect(medicalPerformanceMonitor.isMonitoring).toBe(false);
    });

    test('should reset metrics', () => {
      // Add some metrics first
      medicalPerformanceMonitor.startMeasurement('test', PerformanceMetricType.API_CALL);
      medicalPerformanceMonitor.endMeasurement('test');

      expect(medicalPerformanceMonitor.metrics.size).toBeGreaterThan(0);

      medicalPerformanceMonitor.reset();
      expect(medicalPerformanceMonitor.metrics.size).toBe(0);
    });
  });

  describe('Performance Measurement', () => {
    test('should start measurement with correct metadata', () => {
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'api-call-test',
        PerformanceMetricType.API_CALL,
        { endpoint: '/predict', method: 'POST' },
      );

      expect(metricId).toBeDefined();
      expect(typeof metricId).toBe('string');

      const metric = medicalPerformanceMonitor.metrics.get(metricId);
      expect(metric).toBeDefined();
      expect(metric.name).toBe('api-call-test');
      expect(metric.type).toBe(PerformanceMetricType.API_CALL);
      expect(metric.metadata.endpoint).toBe('/predict');
      expect(metric.startTime).toBeDefined();
      expect(metric.endTime).toBeNull();
    });

    test('should end measurement and calculate duration', () => {
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'duration-test',
        PerformanceMetricType.PREDICTION,
      );

      // Mock some time passing
      const startTime = performance.now();
      performance.now.mockReturnValue(startTime + 1000); // 1 second later

      const result = medicalPerformanceMonitor.endMeasurement(metricId);

      expect(result).toBeDefined();
      expect(result.duration).toBe(1000);
      expect(result.endTime).toBeDefined();
    });

    test('should handle non-existent measurement IDs', () => {
      const result = medicalPerformanceMonitor.endMeasurement('non-existent-id');
      expect(result).toBeNull();
    });

    test('should generate unique measurement IDs', () => {
      const id1 = medicalPerformanceMonitor.startMeasurement('test1', PerformanceMetricType.API_CALL);
      const id2 = medicalPerformanceMonitor.startMeasurement('test2', PerformanceMetricType.API_CALL);

      expect(id1).not.toBe(id2);
    });
  });

  describe('Metric Type Validation', () => {
    test('should accept valid metric types', () => {
      const validTypes = [
        PerformanceMetricType.API_CALL,
        PerformanceMetricType.PREDICTION,
        PerformanceMetricType.VALIDATION,
        PerformanceMetricType.CACHE,
        PerformanceMetricType.RENDERING,
      ];

      validTypes.forEach(type => {
        expect(() => {
          medicalPerformanceMonitor.startMeasurement('test', type);
        }).not.toThrow();
      });
    });

    test('should reject invalid metric types', () => {
      expect(() => {
        medicalPerformanceMonitor.startMeasurement('test', 'INVALID_TYPE');
      }).toThrow();
    });
  });

  describe('Performance Thresholds', () => {
    test('should check API call thresholds', () => {
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'slow-api-call',
        PerformanceMetricType.API_CALL,
      );

      // Mock slow response (6 seconds)
      performance.now.mockReturnValue(performance.now() + 6000);
      const result = medicalPerformanceMonitor.endMeasurement(metricId);

      expect(result.thresholdViolation).toBe(true);
      expect(result.violatedThreshold).toBe('API_CALL');
    });

    test('should check prediction thresholds', () => {
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'slow-prediction',
        PerformanceMetricType.PREDICTION,
      );

      // Mock slow prediction (3.5 seconds)
      performance.now.mockReturnValue(performance.now() + 3500);
      const result = medicalPerformanceMonitor.endMeasurement(metricId);

      expect(result.thresholdViolation).toBe(true);
      expect(result.violatedThreshold).toBe('PREDICTION');
    });

    test('should not violate thresholds for fast operations', () => {
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'fast-api-call',
        PerformanceMetricType.API_CALL,
      );

      // Mock fast response (1 second)
      performance.now.mockReturnValue(performance.now() + 1000);
      const result = medicalPerformanceMonitor.endMeasurement(metricId);

      expect(result.thresholdViolation).toBe(false);
      expect(result.violatedThreshold).toBeNull();
    });
  });

  describe('Performance Alerts', () => {
    test('should generate alerts for threshold violations', () => {
      const originalAlertCallback = medicalPerformanceMonitor.alertCallback;
      const mockAlertCallback = jest.fn();
      medicalPerformanceMonitor.setAlertCallback(mockAlertCallback);

      const metricId = medicalPerformanceMonitor.startMeasurement(
        'slow-operation',
        PerformanceMetricType.API_CALL,
      );

      performance.now.mockReturnValue(performance.now() + 6000);
      medicalPerformanceMonitor.endMeasurement(metricId);

      expect(mockAlertCallback).toHaveBeenCalled();
      const alertCall = mockAlertCallback.mock.calls[0][0];
      expect(alertCall.type).toBe('THRESHOLD_VIOLATION');
      expect(alertCall.severity).toBe('HIGH');

      medicalPerformanceMonitor.setAlertCallback(originalAlertCallback);
    });

    test('should track alert history', () => {
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'alert-test',
        PerformanceMetricType.API_CALL,
      );

      performance.now.mockReturnValue(performance.now() + 6000);
      medicalPerformanceMonitor.endMeasurement(metricId);

      const alerts = medicalPerformanceMonitor.getAlerts();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].type).toBe('THRESHOLD_VIOLATION');
    });
  });

  describe('Performance Statistics', () => {
    test('should calculate comprehensive statistics', () => {
      // Create multiple measurements
      const measurements = [];
      for (let i = 0; i < 5; i++) {
        const metricId = medicalPerformanceMonitor.startMeasurement(
          `test-${i}`,
          PerformanceMetricType.API_CALL,
        );

        performance.now.mockReturnValue(performance.now() + (i + 1) * 1000);
        medicalPerformanceMonitor.endMeasurement(metricId);
        measurements.push(metricId);
      }

      const stats = medicalPerformanceMonitor.getStatistics();

      expect(stats.totalMeasurements).toBe(5);
      expect(stats.completedMeasurements).toBe(5);
      expect(stats.averageDuration).toBeDefined();
      expect(stats.medianDuration).toBeDefined();
      expect(stats.minDuration).toBeDefined();
      expect(stats.maxDuration).toBeDefined();
    });

    test('should calculate statistics by metric type', () => {
      // Create API call measurement
      const apiMetricId = medicalPerformanceMonitor.startMeasurement(
        'api-test',
        PerformanceMetricType.API_CALL,
      );
      performance.now.mockReturnValue(performance.now() + 2000);
      medicalPerformanceMonitor.endMeasurement(apiMetricId);

      // Create prediction measurement
      const predMetricId = medicalPerformanceMonitor.startMeasurement(
        'pred-test',
        PerformanceMetricType.PREDICTION,
      );
      performance.now.mockReturnValue(performance.now() + 3000);
      medicalPerformanceMonitor.endMeasurement(predMetricId);

      const stats = medicalPerformanceMonitor.getStatisticsByType();

      expect(stats.API_CALL).toBeDefined();
      expect(stats.PREDICTION).toBeDefined();
      expect(stats.API_CALL.count).toBe(1);
      expect(stats.PREDICTION.count).toBe(1);
    });

    test('should track SLA compliance', () => {
      // Create measurements that meet SLA
      const fastMetricId = medicalPerformanceMonitor.startMeasurement(
        'fast-api',
        PerformanceMetricType.API_CALL,
      );
      performance.now.mockReturnValue(performance.now() + 1000);
      medicalPerformanceMonitor.endMeasurement(fastMetricId);

      // Create measurements that violate SLA
      const slowMetricId = medicalPerformanceMonitor.startMeasurement(
        'slow-api',
        PerformanceMetricType.API_CALL,
      );
      performance.now.mockReturnValue(performance.now() + 6000);
      medicalPerformanceMonitor.endMeasurement(slowMetricId);

      const slaReport = medicalPerformanceMonitor.getSLACompliance();

      expect(slaReport.totalRequests).toBe(2);
      expect(slaReport.compliantRequests).toBe(1);
      expect(slaReport.compliancePercentage).toBe(50);
      expect(slaReport.violations).toBe(1);
    });
  });

  describe('Performance Reporting', () => {
    test('should generate comprehensive performance report', () => {
      // Create sample data
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'report-test',
        PerformanceMetricType.API_CALL,
        { endpoint: '/predict' },
      );
      performance.now.mockReturnValue(performance.now() + 2000);
      medicalPerformanceMonitor.endMeasurement(metricId);

      const report = medicalPerformanceMonitor.generateReport();

      expect(report).toBeInstanceOf(MedicalPerformanceReport);
      expect(report.summary).toBeDefined();
      expect(report.statistics).toBeDefined();
      expect(report.slaCompliance).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.alerts).toBeDefined();
    });

    test('should include performance recommendations', () => {
      // Create slow API call to trigger recommendations
      const metricId = medicalPerformanceMonitor.startMeasurement(
        'slow-recommendation-test',
        PerformanceMetricType.API_CALL,
      );
      performance.now.mockReturnValue(performance.now() + 6000);
      medicalPerformanceMonitor.endMeasurement(metricId);

      const report = medicalPerformanceMonitor.generateReport();

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations[0]).toContain('API response');
    });
  });

  describe('Memory and Resource Management', () => {
    test('should cleanup old metrics', () => {
      // Create many metrics to trigger cleanup
      for (let i = 0; i < 1100; i++) {
        const metricId = medicalPerformanceMonitor.startMeasurement(
          `cleanup-test-${i}`,
          PerformanceMetricType.CACHE,
        );
        medicalPerformanceMonitor.endMeasurement(metricId);
      }

      const initialSize = medicalPerformanceMonitor.metrics.size;
      medicalPerformanceMonitor.cleanup();
      const finalSize = medicalPerformanceMonitor.metrics.size;

      expect(finalSize).toBeLessThan(initialSize);
      expect(finalSize).toBeLessThanOrEqual(1000); // Max size limit
    });

    test('should provide memory usage statistics', () => {
      const memoryStats = medicalPerformanceMonitor.getMemoryUsage();

      expect(memoryStats).toHaveProperty('metricsCount');
      expect(memoryStats).toHaveProperty('estimatedMemoryUsage');
      expect(memoryStats).toHaveProperty('averageMetricSize');
    });
  });

  describe('Configuration and Customization', () => {
    test('should update configuration', () => {
      const newConfig = {
        thresholds: {
          API_CALL: 3000, // 3 seconds
          PREDICTION: 2000, // 2 seconds
        },
        maxMetrics: 500,
      };

      medicalPerformanceMonitor.updateConfiguration(newConfig);
      const config = medicalPerformanceMonitor.getConfiguration();

      expect(config.thresholds.API_CALL).toBe(3000);
      expect(config.maxMetrics).toBe(500);
    });

    test('should validate configuration updates', () => {
      const invalidConfig = {
        thresholds: {
          API_CALL: -1000, // Invalid negative threshold
        },
      };

      expect(() => {
        medicalPerformanceMonitor.updateConfiguration(invalidConfig);
      }).toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle measurement errors gracefully', () => {
      // Mock performance.now to throw error
      performance.now.mockImplementation(() => {
        throw new Error('Performance API error');
      });

      expect(() => {
        medicalPerformanceMonitor.startMeasurement('error-test', PerformanceMetricType.API_CALL);
      }).not.toThrow();

      // Restore performance.now
      performance.now.mockImplementation(() => Date.now());
    });

    test('should handle invalid measurement data', () => {
      const result = medicalPerformanceMonitor.endMeasurement(null);
      expect(result).toBeNull();

      const result2 = medicalPerformanceMonitor.endMeasurement('');
      expect(result2).toBeNull();
    });
  });

  describe('Integration with Medical Workflows', () => {
    test('should track complete medical prediction workflow', () => {
      const workflowId = 'medical-workflow-123';

      // Start validation
      const validationId = medicalPerformanceMonitor.startMeasurement(
        `${workflowId}-validation`,
        PerformanceMetricType.VALIDATION,
        { patientId: 'P123', module: 'coma' },
      );
      performance.now.mockReturnValue(performance.now() + 100);
      medicalPerformanceMonitor.endMeasurement(validationId);

      // Start API call
      const apiId = medicalPerformanceMonitor.startMeasurement(
        `${workflowId}-api`,
        PerformanceMetricType.API_CALL,
        { endpoint: '/predict_coma_ich' },
      );
      performance.now.mockReturnValue(performance.now() + 2000);
      medicalPerformanceMonitor.endMeasurement(apiId);

      // Start prediction processing
      const predictionId = medicalPerformanceMonitor.startMeasurement(
        `${workflowId}-prediction`,
        PerformanceMetricType.PREDICTION,
        { algorithm: 'coma_ich_model' },
      );
      performance.now.mockReturnValue(performance.now() + 1500);
      medicalPerformanceMonitor.endMeasurement(predictionId);

      const workflowMetrics = medicalPerformanceMonitor.getMetricsByPrefix(workflowId);
      expect(workflowMetrics.length).toBe(3);

      const totalDuration = workflowMetrics.reduce((sum, metric) => sum + metric.duration, 0);
      expect(totalDuration).toBe(3600); // 100 + 2000 + 1500
    });
  });
});

describe('PerformanceMetricType', () => {
  test('should define all required metric types', () => {
    expect(PerformanceMetricType.API_CALL).toBe('api_call');
    expect(PerformanceMetricType.PREDICTION).toBe('prediction');
    expect(PerformanceMetricType.VALIDATION).toBe('validation');
    expect(PerformanceMetricType.CACHE).toBe('cache');
    expect(PerformanceMetricType.RENDERING).toBe('rendering');
  });
});

describe('PerformanceThreshold', () => {
  test('should define medical-grade thresholds', () => {
    expect(PerformanceThreshold.API_CALL).toBe(5000); // 5 seconds
    expect(PerformanceThreshold.PREDICTION).toBe(3000); // 3 seconds
    expect(PerformanceThreshold.VALIDATION).toBe(1000); // 1 second
    expect(PerformanceThreshold.CACHE).toBe(100); // 100ms
    expect(PerformanceThreshold.RENDERING).toBe(2000); // 2 seconds
  });
});

describe('MedicalPerformanceReport', () => {
  test('should create comprehensive report', () => {
    const reportData = {
      summary: { totalMeasurements: 10, averageDuration: 1500 },
      statistics: { API_CALL: { count: 5, average: 2000 } },
      slaCompliance: { compliancePercentage: 95 },
      recommendations: ['Optimize API calls'],
      alerts: [],
    };

    const report = new MedicalPerformanceReport(reportData);

    expect(report.summary).toEqual(reportData.summary);
    expect(report.statistics).toEqual(reportData.statistics);
    expect(report.slaCompliance).toEqual(reportData.slaCompliance);
    expect(report.recommendations).toEqual(reportData.recommendations);
  });

  test('should format report for export', () => {
    const reportData = {
      summary: { totalMeasurements: 5 },
      statistics: {},
      slaCompliance: { compliancePercentage: 100 },
      recommendations: [],
      alerts: [],
    };

    const report = new MedicalPerformanceReport(reportData);
    const formatted = report.formatForExport();

    expect(formatted).toHaveProperty('generatedAt');
    expect(formatted).toHaveProperty('summary');
    expect(formatted).toHaveProperty('slaCompliance');
  });
});
