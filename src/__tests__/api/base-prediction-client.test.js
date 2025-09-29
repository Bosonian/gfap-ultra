/**
 * BasePredictionClient Test Suite
 * Enterprise API Client with Caching and Performance Monitoring
 */

import { BasePredictionClient, MedicalAPIError } from '../../api/base-prediction-client.js';
import { MedicalCacheFactory } from '../../performance/medical-cache.js';

// Mock the performance monitor
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
    CACHE: 'cache',
  },
}));

// Mock the medical cache
jest.mock('../../performance/medical-cache.js', () => ({
  MedicalCacheFactory: {
    getApiCache: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(() => ({
        entries: 0,
        hitRate: '0%',
        totalSize: 0,
      })),
      cleanup: jest.fn(),
    })),
    getPredictionCache: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(() => ({
        entries: 0,
        hitRate: '0%',
        totalSize: 0,
      })),
      getEntryInfo: jest.fn(),
    })),
    getValidationCache: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(() => ({
        entries: 0,
        hitRate: '0%',
        totalSize: 0,
      })),
    })),
  },
  CachePriority: {
    HIGH: 'high',
    NORMAL: 'normal',
  },
  MedicalCacheTTL: {
    PREDICTION_RESULTS: 3600000,
  },
}));

describe('BasePredictionClient', () => {
  let client;
  let mockApiCache;
  let mockPredictionCache;
  let mockValidationCache;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mock instances
    mockApiCache = {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(() => ({ entries: 0, hitRate: '0%', totalSize: 0 })),
      cleanup: jest.fn(),
    };

    mockPredictionCache = {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(() => ({ entries: 0, hitRate: '0%', totalSize: 0 })),
      getEntryInfo: jest.fn(),
    };

    mockValidationCache = {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(() => ({ entries: 0, hitRate: '0%', totalSize: 0 })),
    };

    // Update factory mocks
    MedicalCacheFactory.getApiCache.mockReturnValue(mockApiCache);
    MedicalCacheFactory.getPredictionCache.mockReturnValue(mockPredictionCache);
    MedicalCacheFactory.getValidationCache.mockReturnValue(mockValidationCache);

    client = new BasePredictionClient();

    // Mock online status
    Object.defineProperty(client, 'isOnline', {
      value: true,
      writable: true,
    });
  });

  describe('Initialization', () => {
    test('should initialize with performance monitoring', () => {
      expect(client.requestId).toBe(0);
      expect(client.activeRequests).toBeInstanceOf(Map);
      expect(client.apiCache).toBe(mockApiCache);
      expect(client.predictionCache).toBe(mockPredictionCache);
      expect(client.validationCache).toBe(mockValidationCache);
    });

    test('should setup offline handlers', () => {
      const addEventListener = jest.spyOn(window, 'addEventListener');
      new BasePredictionClient();

      expect(addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });

  describe('Cache Key Generation', () => {
    test('should generate consistent cache keys', () => {
      const payload1 = { gfap_value: 100, age_years: 65 };
      const payload2 = { age_years: 65, gfap_value: 100 };

      const key1 = client.generateCacheKey('coma_ich', payload1);
      const key2 = client.generateCacheKey('coma_ich', payload2);

      expect(key1).toBe(key2);
      expect(key1).toMatch(/^coma_ich_\d+$/);
    });

    test('should generate different keys for different payloads', () => {
      const payload1 = { gfap_value: 100, age_years: 65 };
      const payload2 = { gfap_value: 200, age_years: 65 };

      const key1 = client.generateCacheKey('coma_ich', payload1);
      const key2 = client.generateCacheKey('coma_ich', payload2);

      expect(key1).not.toBe(key2);
    });
  });

  describe('Medical Validation', () => {
    test('should validate medical parameter ranges', () => {
      const validPayload = {
        age_years: 65,
        gfap_value: 100,
        systolic_bp: 140,
        diastolic_bp: 90,
        fast_ed_score: 4,
        gcs: 15,
      };

      expect(() => client.validateMedicalRanges(validPayload)).not.toThrow();
    });

    test('should reject invalid GFAP values', () => {
      const invalidPayload = { gfap_value: -1 };

      expect(() => client.validateMedicalRanges(invalidPayload))
        .toThrow(MedicalAPIError);
    });

    test('should reject invalid age values', () => {
      const invalidPayload = { age_years: 150 };

      expect(() => client.validateMedicalRanges(invalidPayload))
        .toThrow(MedicalAPIError);
    });

    test('should reject invalid blood pressure values', () => {
      const invalidPayload = { systolic_bp: 400 };

      expect(() => client.validateMedicalRanges(invalidPayload))
        .toThrow(MedicalAPIError);
    });
  });

  describe('Boolean Normalization', () => {
    test('should normalize boolean values correctly', () => {
      const payload = {
        armparese: true,
        speechdeficit: false,
        gaze: 'on',
        agitation: 'true',
        other: 'false',
        number: 42,
      };

      const normalized = client.normalizeBooleans(payload);

      expect(normalized.armparese).toBe(1);
      expect(normalized.speechdeficit).toBe(0);
      expect(normalized.gaze).toBe(1);
      expect(normalized.agitation).toBe(1);
      expect(normalized.other).toBe(0);
      expect(normalized.number).toBe(42);
    });
  });

  describe('Caching Functionality', () => {
    test('should return cached prediction if available', async () => {
      const cachedResult = {
        probability: 0.75,
        confidence: 0.8,
        fromCache: false,
      };

      mockPredictionCache.get.mockReturnValue(cachedResult);

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };
      const result = await client.predict('coma_ich', payload);

      expect(result).toEqual({
        ...cachedResult,
        fromCache: true,
        timestamp: expect.any(String),
      });
      expect(mockPredictionCache.get).toHaveBeenCalled();
    });

    test('should cache prediction results', async () => {
      // Mock no cached result initially
      mockPredictionCache.get.mockReturnValue(null);

      // Mock successful API response
      const apiResponse = {
        probability: 0.65,
        confidence: 0.8,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(apiResponse),
        headers: new Map([['content-type', 'application/json']]),
      });

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };
      await client.predict('coma_ich', payload);

      expect(mockPredictionCache.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          probability: 0.65,
          confidence: 0.8,
        }),
        expect.any(Number),
        expect.any(String),
        expect.any(Object)
      );
    });

    test('should bypass cache when requested', async () => {
      mockPredictionCache.get.mockReturnValue({ probability: 0.5 });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ probability: 0.8 }),
        headers: new Map([['content-type', 'application/json']]),
      });

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };
      const result = await client.predict('coma_ich', payload, { bypassCache: true });

      expect(result.probability).toBe(0.8);
      expect(result.fromCache).toBeUndefined();
    });
  });

  describe('Offline Mode', () => {
    test('should return cached result in offline mode', async () => {
      client.isOnline = false;

      const cachedResult = { probability: 0.6, confidence: 0.7 };
      mockPredictionCache.get.mockReturnValue(cachedResult);

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };
      const result = await client.predict('coma_ich', payload);

      expect(result).toEqual({
        ...cachedResult,
        fromCache: true,
        offlineMode: true,
        warning: 'Result from cache due to offline mode',
        timestamp: expect.any(String),
      });
    });

    test('should throw error if no cached result available offline', async () => {
      client.isOnline = false;
      mockPredictionCache.get.mockReturnValue(null);

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };

      await expect(client.predict('coma_ich', payload))
        .rejects.toThrow(MedicalAPIError);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      mockPredictionCache.get.mockReturnValue(null);

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };

      await expect(client.predict('coma_ich', payload))
        .rejects.toThrow(MedicalAPIError);
    });

    test('should handle HTTP errors', async () => {
      mockPredictionCache.get.mockReturnValue(null);

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Server error' }),
        headers: new Map(),
      });

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };

      await expect(client.predict('coma_ich', payload))
        .rejects.toThrow(MedicalAPIError);
    });

    test('should handle request timeout', async () => {
      mockPredictionCache.get.mockReturnValue(null);

      // Mock AbortError
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      global.fetch.mockRejectedValueOnce(abortError);

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };

      await expect(client.predict('coma_ich', payload))
        .rejects.toThrow('Request timeout');
    });
  });

  describe('Mock API Mode', () => {
    test('should use mock API in development', async () => {
      // Mock localhost environment
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
      });

      global.localStorage.getItem.mockReturnValue(null); // mock enabled

      const payload = { gfap_value: 100, age_years: 65, gcs: 15 };
      const result = await client.predict('coma_ich', payload);

      expect(result.mockResponse).toBe(true);
      expect(result.probability).toBeGreaterThan(0);
    });
  });

  describe('Performance Reporting', () => {
    test('should generate comprehensive performance report', () => {
      const report = client.getPerformanceReport();

      expect(report).toHaveProperty('apiClientStats');
      expect(report).toHaveProperty('cachePerformance');
      expect(report.apiClientStats).toHaveProperty('isOnline');
      expect(report.cachePerformance).toHaveProperty('apiCache');
      expect(report.cachePerformance).toHaveProperty('predictionCache');
      expect(report.cachePerformance).toHaveProperty('validationCache');
    });

    test('should clear all caches', () => {
      client.clearAllCaches();

      expect(mockApiCache.clear).toHaveBeenCalled();
      expect(mockPredictionCache.clear).toHaveBeenCalled();
      expect(mockValidationCache.clear).toHaveBeenCalled();
    });

    test('should get cache entry information', () => {
      const payload = { gfap_value: 100, age_years: 65 };

      client.getCacheEntryInfo('coma_ich', payload);

      expect(mockPredictionCache.getEntryInfo).toHaveBeenCalledWith(
        expect.stringMatching(/^coma_ich_\d+$/)
      );
    });
  });

  describe('Request Statistics', () => {
    test('should track active requests', () => {
      const stats = client.getRequestStats();

      expect(stats).toHaveProperty('activeRequests');
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('activeRequestDetails');
      expect(Array.isArray(stats.activeRequestDetails)).toBe(true);
    });
  });
});