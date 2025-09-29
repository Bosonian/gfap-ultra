/**
 * Medical Prediction Integration Tests
 * End-to-End Testing of Medical Prediction Workflows
 */

import { BasePredictionClient } from '../../api/base-prediction-client.js';
import { MedicalCacheFactory } from '../../performance/medical-cache.js';
import { validateMedicalInput } from '../../logic/validate.js';

// Mock external dependencies
jest.mock('../../performance/medical-performance-monitor.js', () => ({
  medicalPerformanceMonitor: {
    isMonitoring: false,
    start: jest.fn(),
    startMeasurement: jest.fn(() => 'test-metric-id'),
    endMeasurement: jest.fn(),
  },
  PerformanceMetricType: {
    VALIDATION: 'validation',
    API_CALL: 'api_call',
    PREDICTION: 'prediction',
  },
}));

jest.mock('../../patterns/observer.js', () => ({
  medicalEventObserver: {
    publish: jest.fn(),
  },
  MEDICAL_EVENTS: {
    AUDIT_EVENT: 'audit_event',
  },
}));

describe('Medical Prediction Integration Tests', () => {
  let predictionClient;

  beforeEach(() => {
    jest.clearAllMocks();
    predictionClient = new BasePredictionClient();

    // Mock online status
    Object.defineProperty(predictionClient, 'isOnline', {
      value: true,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up caches
    MedicalCacheFactory.clearAllCaches();
  });

  describe('Complete Medical Workflow Tests', () => {
    describe('Coma Module Workflow', () => {
      test('should handle complete coma prediction workflow', async () => {
        // Setup test data
        const patientData = {
          age_years: 75,
          gcs: 6,
          gfap_value: 250.5,
        };

        // Mock API response
        const mockResponse = {
          probability: 0.78,
          confidence: 0.85,
          drivers: ['Low GCS', 'Elevated GFAP'],
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
          headers: new Map([['content-type', 'application/json']]),
        });

        // Step 1: Validate input
        const validation = validateMedicalInput(patientData, 'coma');
        expect(validation.isValid).toBe(true);

        // Step 2: Make prediction
        const result = await predictionClient.predict('coma_ich', patientData);

        // Step 3: Verify result structure
        expect(result).toMatchObject({
          probability: expect.any(Number),
          confidence: expect.any(Number),
          module: 'Coma',
          timestamp: expect.any(String),
        });

        expect(result.probability).toBe(0.78);
        expect(result.confidence).toBe(0.85);

        // Step 4: Verify caching
        const cachedResult = await predictionClient.predict('coma_ich', patientData);
        expect(cachedResult.fromCache).toBe(true);
      });

      test('should handle invalid coma input gracefully', async () => {
        const invalidData = {
          age_years: -5, // Invalid age
          gcs: 20, // Invalid GCS
          gfap_value: -100, // Invalid GFAP
        };

        await expect(predictionClient.predict('coma_ich', invalidData))
          .rejects.toThrow('Medical parameter validation failed');
      });
    });

    describe('Limited Data Module Workflow', () => {
      test('should handle limited data prediction workflow', async () => {
        const patientData = {
          age_years: 68,
          systolic_bp: 165,
          diastolic_bp: 95,
          gfap_value: 180.0,
          vigilanzminderung: true,
        };

        const mockResponse = {
          probability: 0.42,
          confidence: 0.72,
          drivers: ['Moderate GFAP', 'Hypertension'],
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
          headers: new Map([['content-type', 'application/json']]),
        });

        const result = await predictionClient.predict('limited_ich', patientData);

        expect(result).toMatchObject({
          probability: 0.42,
          confidence: 0.72,
          module: 'Limited Data',
        });

        // Verify boolean normalization
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('"vigilanzminderung":1'),
          })
        );
      });
    });

    describe('Full Stroke Module Workflow', () => {
      test('should handle full stroke prediction workflow', async () => {
        const patientData = {
          age_years: 72,
          systolic_bp: 170,
          diastolic_bp: 100,
          gfap_value: 400.0,
          fast_ed_score: 6,
          headache: false,
          vigilanzminderung: true,
          armparese: true,
          beinparese: false,
          eye_deviation: true,
          atrial_fibrillation: false,
          anticoagulated_noak: false,
          antiplatelets: true,
        };

        const mockResponse = {
          probability: 0.89,
          confidence: 0.94,
          drivers: ['High FAST-ED', 'Elevated GFAP', 'Neurological deficits'],
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
          headers: new Map([['content-type', 'application/json']]),
        });

        const result = await predictionClient.predict('full_stroke', patientData);

        expect(result).toMatchObject({
          probability: 0.89,
          confidence: 0.94,
          module: 'Full Stroke',
        });

        // Verify all 13 clinical variables are processed
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringMatching(/headache.*vigilanzminderung.*armparese/),
          })
        );
      });
    });

    describe('LVO Prediction Workflow', () => {
      test('should handle LVO prediction workflow', async () => {
        const patientData = {
          gfap_value: 320.5,
          fast_ed_score: 7,
        };

        const mockResponse = {
          lvo_probability: 0.76,
          confidence: 0.81,
          interpretation: 'High probability of large vessel occlusion',
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
          headers: new Map([['content-type', 'application/json']]),
        });

        const result = await predictionClient.predict('lvo', patientData);

        expect(result).toMatchObject({
          probability: 0.76,
          confidence: 0.81,
          module: 'LVO',
        });

        // Verify proper data type conversion
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('"gfap_value":320.5'),
          })
        );
      });
    });
  });

  describe('Caching Integration Tests', () => {
    test('should maintain cache consistency across predictions', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      const mockResponse = {
        probability: 0.55,
        confidence: 0.78,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Map([['content-type', 'application/json']]),
      });

      // First prediction - should call API
      const result1 = await predictionClient.predict('coma_ich', patientData);
      expect(result1.fromCache).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second prediction - should use cache
      const result2 = await predictionClient.predict('coma_ich', patientData);
      expect(result2.fromCache).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(1); // No additional API call

      // Results should be equivalent (except cache flag)
      expect(result2.probability).toBe(result1.probability);
      expect(result2.confidence).toBe(result1.confidence);
    });

    test('should handle cache bypass option', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      const mockResponse = {
        probability: 0.55,
        confidence: 0.78,
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Map([['content-type', 'application/json']]),
      });

      // First prediction
      await predictionClient.predict('coma_ich', patientData);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second prediction with cache bypass
      const result = await predictionClient.predict('coma_ich', patientData, {
        bypassCache: true,
      });

      expect(result.fromCache).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledTimes(2); // API called again
    });
  });

  describe('Offline Mode Integration Tests', () => {
    test('should handle offline mode gracefully', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      const mockResponse = {
        probability: 0.55,
        confidence: 0.78,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Map([['content-type', 'application/json']]),
      });

      // First prediction while online - cache result
      await predictionClient.predict('coma_ich', patientData);

      // Simulate going offline
      predictionClient.isOnline = false;

      // Prediction while offline - should return cached result
      const offlineResult = await predictionClient.predict('coma_ich', patientData);

      expect(offlineResult.fromCache).toBe(true);
      expect(offlineResult.offlineMode).toBe(true);
      expect(offlineResult.warning).toContain('offline mode');
      expect(offlineResult.probability).toBe(0.55);
    });

    test('should throw error when offline with no cache', async () => {
      predictionClient.isOnline = false;

      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Offline mode: No cached result available');
    });
  });

  describe('Error Handling Integration Tests', () => {
    test('should handle API errors gracefully', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Database connection failed' }),
        headers: new Map(),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Database connection failed');
    });

    test('should handle network timeouts', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';
      global.fetch.mockRejectedValueOnce(timeoutError);

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Request timeout');
    });

    test('should handle malformed API responses', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
        headers: new Map([['content-type', 'application/json']]),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Invalid JSON');
    });
  });

  describe('Performance Integration Tests', () => {
    test('should generate performance reports', () => {
      const report = predictionClient.getPerformanceReport();

      expect(report).toHaveProperty('apiClientStats');
      expect(report).toHaveProperty('cachePerformance');
      expect(report.apiClientStats).toHaveProperty('isOnline');
      expect(report.apiClientStats).toHaveProperty('totalRequests');
      expect(report.cachePerformance).toHaveProperty('predictionCache');
    });

    test('should track request statistics', () => {
      const stats = predictionClient.getRequestStats();

      expect(stats).toHaveProperty('activeRequests');
      expect(stats).toHaveProperty('totalRequests');
      expect(Array.isArray(stats.activeRequestDetails)).toBe(true);
    });
  });

  describe('Mock API Integration Tests', () => {
    test('should use mock API in localhost environment', async () => {
      // Mock localhost environment
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
      });

      global.localStorage.getItem.mockReturnValue(null); // Mock API enabled

      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 150,
      };

      const result = await predictionClient.predict('coma_ich', patientData);

      expect(result.mockResponse).toBe(true);
      expect(result.probability).toBeGreaterThan(0);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});