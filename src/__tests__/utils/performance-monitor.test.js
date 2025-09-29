// Medical Performance Monitoring Tests
// Critical for emergency timing validation

import { MedicalPerformanceMonitor, measureMedicalFunction } from '../../utils/performance-monitor.js';

describe('Medical Performance Monitoring', () => {
  let monitor;

  beforeEach(() => {
    monitor = new MedicalPerformanceMonitor();
    jest.clearAllMocks();
  });

  describe('Performance Measurement', () => {
    test('should measure function execution time', async () => {
      const testFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return 'test result';
      };

      const result = await monitor.measureClinicalFunction('testFunction', testFunction);

      expect(result).toBe('test result');
      const stats = monitor.getPerformanceStats('testFunction');
      expect(stats.count).toBe(1);
      expect(stats.average).toBeGreaterThan(40);
      expect(stats.average).toBeLessThan(100);
    });

    test('should handle function errors gracefully', async () => {
      const errorFunction = async () => {
        throw new Error('Test medical error');
      };

      await expect(
        monitor.measureClinicalFunction('errorFunction', errorFunction),
      ).rejects.toThrow('Test medical error');

      const stats = monitor.getPerformanceStats('errorFunction');
      expect(stats.count).toBe(1);
      expect(stats.successRate).toBe(0);
    });

    test('should categorize performance measurements', async () => {
      const quickFunction = async () => 'quick';
      const slowFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'slow';
      };

      await monitor.measureClinicalFunction('quickTest', quickFunction, 'validation');
      await monitor.measureClinicalFunction('slowTest', slowFunction, 'api_request');

      const quickStats = monitor.getPerformanceStats('quickTest');
      const slowStats = monitor.getPerformanceStats('slowTest');

      expect(quickStats.count).toBe(1);
      expect(slowStats.count).toBe(1);
    });
  });

  describe('Critical Threshold Detection', () => {
    test('should detect critical delays in medical functions', async () => {
      const slowMedicalFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Exceeds 1000ms threshold
        return 'delayed result';
      };

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await monitor.measureClinicalFunction('slowMedical', slowMedicalFunction, 'medical_calculation');

      const report = monitor.getClinicalPerformanceReport();
      expect(report.criticalDelays.total).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    test('should use different thresholds for different categories', async () => {
      const authFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 600)); // Within 2000ms auth threshold
        return 'auth success';
      };

      const validationFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 600)); // Exceeds 500ms validation threshold
        return 'validation success';
      };

      await monitor.measureClinicalFunction('authTest', authFunction, 'authentication');
      await monitor.measureClinicalFunction('validationTest', validationFunction, 'validation');

      const report = monitor.getClinicalPerformanceReport();
      // Validation should trigger critical delay, auth should not
      expect(report.criticalDelays.total).toBeGreaterThan(0);
    });
  });

  describe('Performance Statistics', () => {
    test('should calculate accurate performance statistics', async () => {
      const measurements = [50, 100, 150];

      for (let i = 0; i < measurements.length; i++) {
        const testFunc = async () => {
          await new Promise((resolve) => setTimeout(resolve, measurements[i]));
          return `result ${i}`;
        };
        await monitor.measureClinicalFunction('statTest', testFunc);
      }

      const stats = monitor.getPerformanceStats('statTest');

      expect(stats.count).toBe(3);
      expect(stats.min).toBeGreaterThan(40);
      expect(stats.max).toBeGreaterThan(140);
      expect(stats.successRate).toBe(100);
    });

    test('should handle empty statistics gracefully', () => {
      const stats = monitor.getPerformanceStats('nonexistent');

      expect(stats).toEqual({
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        successRate: 0,
      });
    });
  });

  describe('Clinical Reporting', () => {
    test('should generate clinical performance report', async () => {
      const medicalFunc = async () => 'medical result';
      await monitor.measureClinicalFunction('medicalTest', medicalFunc, 'medical_calculation');

      const report = monitor.getClinicalPerformanceReport();

      expect(report.timestamp).toBeDefined();
      expect(report.sessionId).toBeDefined();
      expect(report.totalMeasurements).toBeGreaterThan(0);
      expect(report.categories).toBeDefined();
      expect(report.criticalDelays).toBeDefined();
    });

    test('should export anonymized clinical data', async () => {
      const testFunc = async () => 'test data';
      await monitor.measureClinicalFunction('exportTest', testFunc);

      const exportData = monitor.exportClinicalData();

      expect(exportData.timestamp).toBeDefined();
      expect(exportData.performanceStats).toBeDefined();
      expect(exportData.systemInfo).toBeDefined();
      expect(exportData.systemInfo.userAgent).toBeDefined();
      expect(exportData.systemInfo.platform).toBeDefined();
    });
  });

  describe('Memory Management', () => {
    test('should limit performance log size', async () => {
      // Simulate many measurements to test memory limits
      for (let i = 0; i < 1100; i++) {
        const quickFunc = () => `result ${i}`;
        await monitor.measureClinicalFunction(`test${i}`, quickFunc);
      }

      expect(monitor.performanceLog.length).toBeLessThanOrEqual(1000);
    });

    test('should clear performance data for privacy', async () => {
      const testFunc = async () => 'test';
      await monitor.measureClinicalFunction('clearTest', testFunc);

      expect(monitor.getPerformanceStats('clearTest').count).toBe(1);

      monitor.clearPerformanceData();

      expect(monitor.getPerformanceStats('clearTest').count).toBe(0);
    });
  });

  describe('Integration Helper', () => {
    test('should work with helper function', async () => {
      const testFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'helper result';
      };

      const result = await measureMedicalFunction('helperTest', testFunction, 'validation');

      expect(result).toBe('helper result');
    });
  });

  describe('Monitoring Control', () => {
    test('should enable/disable monitoring', async () => {
      monitor.setMonitoringEnabled(false);

      const testFunc = async () => 'disabled monitoring';
      const result = await monitor.measureClinicalFunction('disabledTest', testFunc);

      expect(result).toBe('disabled monitoring');
      // Should not record measurements when disabled
      const stats = monitor.getPerformanceStats('disabledTest');
      expect(stats.count).toBe(0);
    });

    test('should maintain consistent session ID', () => {
      const sessionId1 = monitor.getSessionId();
      const sessionId2 = monitor.getSessionId();

      expect(sessionId1).toBe(sessionId2);
      expect(sessionId1).toMatch(/^session_\d+_[a-z0-9]+$/);
    });
  });

  describe('Medical Safety Edge Cases', () => {
    test('should handle performance API errors gracefully', async () => {
      // Mock performance API failure
      const originalMark = performance.mark;
      performance.mark = jest.fn().mockImplementation(() => {
        throw new Error('Performance API error');
      });

      const testFunc = async () => 'robust result';

      // Should not throw despite performance API errors
      const result = await monitor.measureClinicalFunction('robustTest', testFunc);

      expect(result).toBe('robust result');

      // Restore original function
      performance.mark = originalMark;
    });

    test('should handle rapid successive measurements', async () => {
      const promises = [];

      for (let i = 0; i < 50; i++) {
        const quickFunc = async () => `rapid ${i}`;
        promises.push(monitor.measureClinicalFunction(`rapid${i}`, quickFunc));
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(50);
      expect(monitor.performanceLog.length).toBeGreaterThan(0);
    });

    test('should provide meaningful error context', async () => {
      const medicalErrorFunc = async () => {
        throw new Error('Critical medical calculation failed');
      };

      await expect(
        monitor.measureClinicalFunction('criticalCalc', medicalErrorFunc),
      ).rejects.toThrow('Critical medical calculation failed');

      const stats = monitor.getPerformanceStats('criticalCalc');
      expect(stats.successRate).toBe(0);
    });
  });
});
