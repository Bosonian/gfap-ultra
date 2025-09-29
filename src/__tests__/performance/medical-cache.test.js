/**
 * Medical Cache System Test Suite
 * HIPAA-Compliant Caching with Medical Data Handling
 */

import {
  MedicalCache,
  CacheStorageType,
  CachePriority,
  MedicalCacheTTL,
  MedicalCacheFactory,
} from '../../performance/medical-cache.js';

// Mock the observer and performance monitor
jest.mock('../../patterns/observer.js', () => ({
  medicalEventObserver: {
    publish: jest.fn(),
  },
  MEDICAL_EVENTS: {
    AUDIT_EVENT: 'audit_event',
  },
}));

jest.mock('../../performance/medical-performance-monitor.js', () => ({
  medicalPerformanceMonitor: {
    startMeasurement: jest.fn(() => 'test-metric-id'),
    endMeasurement: jest.fn(),
  },
  PerformanceMetricType: {
    CACHE: 'cache',
  },
}));

describe('MedicalCache', () => {
  let cache;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new MedicalCache(CacheStorageType.MEMORY, {
      maxSize: 1024 * 1024, // 1MB
      maxEntries: 100,
      cleanupInterval: 1000,
    });
  });

  afterEach(() => {
    if (cache) {
      cache.dispose();
    }
  });

  describe('Initialization', () => {
    test('should initialize with default options', () => {
      const defaultCache = new MedicalCache();

      expect(defaultCache.storageType).toBe(CacheStorageType.MEMORY);
      expect(defaultCache.options.maxSize).toBe(100 * 1024 * 1024);
      expect(defaultCache.options.maxEntries).toBe(1000);
    });

    test('should start cleanup timer on initialization', () => {
      expect(cache.cleanupTimer).toBeDefined();
    });
  });

  describe('Data Sanitization', () => {
    test('should sanitize sensitive fields in cached data', () => {
      const sensitiveData = {
        gfap_value: 100,
        patient_id: '12345',
        ssn: '123-45-6789',
        mrn: 'MRN123',
        user_id: 'user123',
        session_token: 'token123',
        regularField: 'normal data',
      };

      cache.set('test-key', sensitiveData, 60000);
      const retrieved = cache.get('test-key');

      expect(retrieved.gfap_value).toBe(100);
      expect(retrieved.regularField).toBe('normal data');
      expect(retrieved.patient_id).toBe('[REDACTED]');
      expect(retrieved.ssn).toBe('[REDACTED]');
      expect(retrieved.mrn).toBe('[REDACTED]');
      expect(retrieved.user_id).toBe('[REDACTED]');
      expect(retrieved.session_token).toBe('[REDACTED]');
    });

    test('should handle nested objects with sensitive data', () => {
      const nestedData = {
        medical: {
          gfap_value: 200,
          patient_id: 'nested123',
        },
        analysis: {
          result: 'positive',
          user_id: 'analyst123',
        },
      };

      cache.set('nested-key', nestedData, 60000);
      const retrieved = cache.get('nested-key');

      expect(retrieved.medical.gfap_value).toBe(200);
      expect(retrieved.medical.patient_id).toBe('[REDACTED]');
      expect(retrieved.analysis.result).toBe('positive');
      expect(retrieved.analysis.user_id).toBe('[REDACTED]');
    });
  });

  describe('Cache Operations', () => {
    test('should store and retrieve values', () => {
      const testData = { gfap: 150, age: 65 };

      const success = cache.set('test-key', testData, 60000);
      expect(success).toBe(true);

      const retrieved = cache.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    test('should return null for non-existent keys', () => {
      const result = cache.get('non-existent-key');
      expect(result).toBeNull();
    });

    test('should handle TTL expiration', () => {
      cache.set('expiring-key', { data: 'test' }, 1); // 1ms TTL

      // Immediately should be available
      expect(cache.get('expiring-key')).not.toBeNull();

      // Wait for expiration
      setTimeout(() => {
        expect(cache.get('expiring-key')).toBeNull();
      }, 10);
    });

    test('should delete entries', () => {
      cache.set('delete-key', { data: 'test' }, 60000);
      expect(cache.has('delete-key')).toBe(true);

      const deleted = cache.delete('delete-key');
      expect(deleted).toBe(true);
      expect(cache.has('delete-key')).toBe(false);
    });

    test('should clear all entries', () => {
      cache.set('key1', { data: 'test1' }, 60000);
      cache.set('key2', { data: 'test2' }, 60000);

      expect(cache.cache.size).toBe(2);

      cache.clear();

      expect(cache.cache.size).toBe(0);
      expect(cache.totalSize).toBe(0);
    });
  });

  describe('Priority-Based Eviction', () => {
    test('should preserve critical priority items during eviction', () => {
      // Fill cache with low priority items
      for (let i = 0; i < 10; i++) {
        cache.set(`low-${i}`, { data: `test-${i}` }, 60000, CachePriority.LOW);
      }

      // Add critical item
      cache.set('critical-item', { important: 'data' }, 60000, CachePriority.CRITICAL);

      // Force eviction by adding more items
      cache.ensureCapacity();

      // Critical item should still exist
      expect(cache.get('critical-item')).not.toBeNull();
    });

    test('should evict least important items first', () => {
      const cache = new MedicalCache(CacheStorageType.MEMORY, {
        maxEntries: 3,
      });

      // Add items with different priorities
      cache.set('low1', { data: 'low1' }, 60000, CachePriority.LOW);
      cache.set('normal1', { data: 'normal1' }, 60000, CachePriority.NORMAL);
      cache.set('high1', { data: 'high1' }, 60000, CachePriority.HIGH);

      // Add one more to trigger eviction
      cache.set('low2', { data: 'low2' }, 60000, CachePriority.LOW);

      // Low priority item should be evicted first
      expect(cache.get('low1')).toBeNull();
      expect(cache.get('normal1')).not.toBeNull();
      expect(cache.get('high1')).not.toBeNull();
      expect(cache.get('low2')).not.toBeNull();

      cache.dispose();
    });
  });

  describe('Memory Management', () => {
    test('should track cache size', () => {
      const initialSize = cache.totalSize;

      cache.set('size-test', { large: 'x'.repeat(1000) }, 60000);

      expect(cache.totalSize).toBeGreaterThan(initialSize);
    });

    test('should enforce size limits', () => {
      const smallCache = new MedicalCache(CacheStorageType.MEMORY, {
        maxSize: 100, // Very small cache
        maxEntries: 10,
      });

      // Try to add large data
      const largeData = { data: 'x'.repeat(1000) };
      smallCache.set('large1', largeData, 60000);
      smallCache.set('large2', largeData, 60000);

      // Should trigger eviction
      expect(smallCache.cache.size).toBeLessThanOrEqual(1);

      smallCache.dispose();
    });
  });

  describe('Cache Statistics', () => {
    test('should track hit/miss rates', () => {
      cache.set('hit-test', { data: 'test' }, 60000);

      // Generate hits and misses
      cache.get('hit-test'); // hit
      cache.get('hit-test'); // hit
      cache.get('miss-test'); // miss
      cache.get('miss-test'); // miss

      const stats = cache.getStats();

      expect(stats.hitCount).toBe(2);
      expect(stats.missCount).toBe(2);
      expect(stats.hitRate).toBe('50.00%');
    });

    test('should provide comprehensive statistics', () => {
      cache.set('stats-test', { data: 'test' }, 60000);

      const stats = cache.getStats();

      expect(stats).toHaveProperty('entries');
      expect(stats).toHaveProperty('totalSize');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('hitCount');
      expect(stats).toHaveProperty('missCount');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('evictionCount');
      expect(stats).toHaveProperty('storageType');
      expect(stats).toHaveProperty('utilizationPercent');
    });
  });

  describe('Entry Information', () => {
    test('should provide detailed entry information', () => {
      cache.set('info-test', { data: 'test' }, 60000, CachePriority.HIGH, {
        source: 'test',
      });

      const info = cache.getEntryInfo('info-test');

      expect(info).toHaveProperty('key');
      expect(info).toHaveProperty('size');
      expect(info).toHaveProperty('priority');
      expect(info).toHaveProperty('ttl');
      expect(info).toHaveProperty('age');
      expect(info).toHaveProperty('timeToExpiration');
      expect(info).toHaveProperty('accessCount');
      expect(info).toHaveProperty('lastAccessed');
      expect(info).toHaveProperty('isExpired');
      expect(info).toHaveProperty('evictionScore');

      expect(info.priority).toBe(CachePriority.HIGH);
      expect(info.isExpired).toBe(false);
    });

    test('should return null for non-existent entries', () => {
      const info = cache.getEntryInfo('non-existent');
      expect(info).toBeNull();
    });
  });

  describe('Cleanup Operations', () => {
    test('should clean up expired entries', () => {
      // Add entries with short TTL
      cache.set('expire1', { data: 'test1' }, 1);
      cache.set('expire2', { data: 'test2' }, 1);
      cache.set('persist', { data: 'test3' }, 60000);

      expect(cache.cache.size).toBe(3);

      // Wait for expiration and cleanup
      setTimeout(() => {
        const cleanedCount = cache.cleanup();

        expect(cleanedCount).toBe(2);
        expect(cache.cache.size).toBe(1);
        expect(cache.get('persist')).not.toBeNull();
      }, 10);
    });
  });
});

describe('MedicalCacheFactory', () => {
  afterEach(() => {
    MedicalCacheFactory.disposeAllCaches();
  });

  test('should create singleton cache instances', () => {
    const cache1 = MedicalCacheFactory.getPatientDataCache();
    const cache2 = MedicalCacheFactory.getPatientDataCache();

    expect(cache1).toBe(cache2);
  });

  test('should create different cache types', () => {
    const patientCache = MedicalCacheFactory.getPatientDataCache();
    const predictionCache = MedicalCacheFactory.getPredictionCache();
    const validationCache = MedicalCacheFactory.getValidationCache();
    const apiCache = MedicalCacheFactory.getApiCache();

    expect(patientCache).not.toBe(predictionCache);
    expect(predictionCache).not.toBe(validationCache);
    expect(validationCache).not.toBe(apiCache);
  });

  test('should clear all caches', () => {
    const patientCache = MedicalCacheFactory.getPatientDataCache();
    const predictionCache = MedicalCacheFactory.getPredictionCache();

    patientCache.set('test1', { data: 'test1' }, 60000);
    predictionCache.set('test2', { data: 'test2' }, 60000);

    expect(patientCache.cache.size).toBe(1);
    expect(predictionCache.cache.size).toBe(1);

    MedicalCacheFactory.clearAllCaches();

    expect(patientCache.cache.size).toBe(0);
    expect(predictionCache.cache.size).toBe(0);
  });

  test('should dispose all caches', () => {
    MedicalCacheFactory.getPatientDataCache();
    MedicalCacheFactory.getPredictionCache();

    expect(MedicalCacheFactory.patientDataCache).not.toBeNull();
    expect(MedicalCacheFactory.predictionCache).not.toBeNull();

    MedicalCacheFactory.disposeAllCaches();

    expect(MedicalCacheFactory.patientDataCache).toBeNull();
    expect(MedicalCacheFactory.predictionCache).toBeNull();
  });
});

describe('Cache Entry', () => {
  test('should calculate eviction scores correctly', () => {
    const cache = new MedicalCache();

    // Add entries with different access patterns
    cache.set('high-access', { data: 'test' }, 60000, CachePriority.HIGH);
    cache.set('low-access', { data: 'test' }, 60000, CachePriority.LOW);

    // Access high-access item multiple times
    for (let i = 0; i < 10; i++) {
      cache.get('high-access');
    }

    // Access low-access item once
    cache.get('low-access');

    const highInfo = cache.getEntryInfo('high-access');
    const lowInfo = cache.getEntryInfo('low-access');

    expect(highInfo.evictionScore).toBeGreaterThan(lowInfo.evictionScore);

    cache.dispose();
  });

  test('should track access patterns', () => {
    const cache = new MedicalCache();

    cache.set('access-test', { data: 'test' }, 60000);

    // Initial access count should be 0
    let info = cache.getEntryInfo('access-test');
    expect(info.accessCount).toBe(0);

    // Access the item
    cache.get('access-test');
    cache.get('access-test');

    info = cache.getEntryInfo('access-test');
    expect(info.accessCount).toBe(2);

    cache.dispose();
  });
});
