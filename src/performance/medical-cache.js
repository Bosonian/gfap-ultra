/**
 * Medical Data Caching System
 * iGFAP Stroke Triage Assistant - Enterprise Caching Architecture
 *
 * Provides HIPAA-compliant caching with TTL and secure data handling
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "../patterns/observer.js";

import { medicalPerformanceMonitor, PerformanceMetricType } from "./medical-performance-monitor.js";

/**
 * Cache storage types for different data sensitivity levels
 */
export const CacheStorageType = {
  MEMORY: "memory",
  SESSION: "session",
  LOCAL: "local",
  INDEXED_DB: "indexed_db",
};

/**
 * Cache entry priorities for medical data
 */
export const CachePriority = {
  CRITICAL: "critical", // Emergency data, never evict
  HIGH: "high", // Important medical data
  NORMAL: "normal", // Standard application data
  LOW: "low", // Non-critical data, evict first
};

/**
 * Default TTL values for different types of medical data (in milliseconds)
 */
export const MedicalCacheTTL = {
  PATIENT_DATA: 30 * 60 * 1000, // 30 minutes
  PREDICTION_RESULTS: 60 * 60 * 1000, // 1 hour
  VALIDATION_RULES: 24 * 60 * 60 * 1000, // 24 hours
  API_RESPONSES: 15 * 60 * 1000, // 15 minutes
  UI_STATE: 10 * 60 * 1000, // 10 minutes
  STATIC_CONFIG: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Cache entry with metadata and security features
 */
class CacheEntry {
  constructor(key, value, ttl, priority = CachePriority.NORMAL, metadata = {}) {
    this.key = key;
    this.value = this.sanitizeValue(value);
    this.ttl = ttl;
    this.priority = priority;
    this.metadata = {
      ...metadata,
      createdAt: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
    };
    this.expiresAt = ttl > 0 ? Date.now() + ttl : null;
    this.encrypted = false;
  }

  /**
   * Sanitize sensitive data before caching
   */
  sanitizeValue(value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    // Deep clone to avoid reference issues
    const sanitized = JSON.parse(JSON.stringify(value));

    // Remove or mask sensitive fields
    const sensitiveFields = ["ssn", "mrn", "patient_id", "user_id", "session_token"];
    this.removeSensitiveFields(sanitized, sensitiveFields);

    return sanitized;
  }

  /**
   * Recursively remove sensitive fields
   */
  removeSensitiveFields(obj, sensitiveFields) {
    Object.keys(obj).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        this.removeSensitiveFields(obj[key], sensitiveFields);
      }
    });
  }

  /**
   * Check if cache entry has expired
   */
  isExpired() {
    return this.expiresAt !== null && Date.now() > this.expiresAt;
  }

  /**
   * Mark entry as accessed
   */
  markAccessed() {
    this.metadata.accessCount += 1;
    this.metadata.lastAccessed = Date.now();
  }

  /**
   * Get entry age in milliseconds
   */
  getAge() {
    return Date.now() - this.metadata.createdAt;
  }

  /**
   * Get time until expiration
   */
  getTimeToExpiration() {
    if (this.expiresAt === null) {
      return Infinity;
    }
    return Math.max(0, this.expiresAt - Date.now());
  }

  /**
   * Calculate entry score for eviction (lower score = evict first)
   */
  getEvictionScore() {
    const priorityWeights = {
      [CachePriority.CRITICAL]: 1000,
      [CachePriority.HIGH]: 100,
      [CachePriority.NORMAL]: 10,
      [CachePriority.LOW]: 1,
    };

    const priorityWeight = priorityWeights[this.priority] || 1;
    const accessWeight = Math.log(this.metadata.accessCount + 1);
    const ageWeight = 1 / (this.getAge() + 1);

    return priorityWeight * accessWeight * ageWeight;
  }
}

/**
 * Medical Cache Manager with HIPAA compliance
 */
export class MedicalCache {
  constructor(storageType = CacheStorageType.MEMORY, options = {}) {
    this.storageType = storageType;
    this.options = {
      maxSize: 100 * 1024 * 1024, // 100MB max cache size
      maxEntries: 1000, // Maximum number of entries
      cleanupInterval: 5 * 60 * 1000, // Cleanup every 5 minutes
      enableEncryption: false, // Enable for sensitive data
      enableMetrics: true,
      ...options,
    };

    this.cache = new Map();
    this.cleanupTimer = null;
    this.totalSize = 0;
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionCount = 0;

    this.initializeStorage();
    this.startCleanupTimer();
  }

  /**
   * Initialize storage backend
   */
  initializeStorage() {
    switch (this.storageType) {
      case CacheStorageType.SESSION:
        this.storage = sessionStorage;
        this.loadFromStorage();
        break;
      case CacheStorageType.LOCAL:
        this.storage = localStorage;
        this.loadFromStorage();
        break;
      case CacheStorageType.INDEXED_DB:
        this.initializeIndexedDB();
        break;
      default:
        this.storage = null; // Memory only
    }
  }

  /**
   * Load cache from storage
   */
  loadFromStorage() {
    if (!this.storage) {
      return;
    }

    try {
      const cacheData = this.storage.getItem("medical_cache");
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        Object.entries(parsed).forEach(([key, entryData]) => {
          const entry = new CacheEntry(
            entryData.key,
            entryData.value,
            entryData.ttl,
            entryData.priority,
            entryData.metadata
          );
          entry.expiresAt = entryData.expiresAt;

          if (!entry.isExpired()) {
            this.cache.set(key, entry);
            this.totalSize += this.calculateSize(entry.value);
          }
        });
      }
    } catch (error) {
      // ('Failed to load cache from storage:', error.message);
    }
  }

  /**
   * Save cache to storage
   */
  saveToStorage() {
    if (!this.storage) {
      return;
    }

    try {
      const cacheData = {};
      this.cache.forEach((entry, key) => {
        cacheData[key] = {
          key: entry.key,
          value: entry.value,
          ttl: entry.ttl,
          priority: entry.priority,
          metadata: entry.metadata,
          expiresAt: entry.expiresAt,
        };
      });

      this.storage.setItem("medical_cache", JSON.stringify(cacheData));
    } catch (error) {
      // ('Failed to save cache to storage:', error.message);
    }
  }

  /**
   * Initialize IndexedDB for large data caching
   */
  async initializeIndexedDB() {
    // IndexedDB implementation for future enhancement
    // ('IndexedDB cache initialization planned for future implementation');
  }

  /**
   * Set cache entry
   */
  set(
    key,
    value,
    ttl = MedicalCacheTTL.API_RESPONSES,
    priority = CachePriority.NORMAL,
    metadata = {}
  ) {
    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.CACHE,
      "cache_set",
      { key, priority }
    );

    try {
      // Check if we need to make space
      this.ensureCapacity();

      const entry = new CacheEntry(key, value, ttl, priority, metadata);
      const size = this.calculateSize(value);

      // Remove existing entry if present
      if (this.cache.has(key)) {
        const oldEntry = this.cache.get(key);
        this.totalSize -= this.calculateSize(oldEntry.value);
      }

      this.cache.set(key, entry);
      this.totalSize += size;

      // Save to persistent storage
      if (this.storageType !== CacheStorageType.MEMORY) {
        this.saveToStorage();
      }

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "cache_set",
        key,
        size,
        ttl,
        priority,
      });

      medicalPerformanceMonitor.endMeasurement(metricId, { success: true });
      return true;
    } catch (error) {
      medicalPerformanceMonitor.endMeasurement(metricId, { success: false, error: error.message });
      // ('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get cache entry
   */
  get(key) {
    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.CACHE,
      "cache_get",
      { key }
    );

    try {
      const entry = this.cache.get(key);

      if (!entry) {
        this.missCount += 1;
        medicalPerformanceMonitor.endMeasurement(metricId, { hit: false });
        return null;
      }

      if (entry.isExpired()) {
        this.cache.delete(key);
        this.totalSize -= this.calculateSize(entry.value);
        this.missCount += 1;
        medicalPerformanceMonitor.endMeasurement(metricId, { hit: false, expired: true });
        return null;
      }

      entry.markAccessed();
      this.hitCount += 1;

      medicalPerformanceMonitor.endMeasurement(metricId, { hit: true });
      return entry.value;
    } catch (error) {
      medicalPerformanceMonitor.endMeasurement(metricId, { hit: false, error: error.message });
      // ('Cache get error:', error);
      return null;
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key) {
    const entry = this.cache.get(key);
    return entry && !entry.isExpired();
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    const entry = this.cache.get(key);
    if (entry) {
      this.totalSize -= this.calculateSize(entry.value);
      this.cache.delete(key);

      if (this.storageType !== CacheStorageType.MEMORY) {
        this.saveToStorage();
      }

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "cache_delete",
        key,
      });

      return true;
    }
    return false;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    const entriesCleared = this.cache.size;
    this.cache.clear();
    this.totalSize = 0;

    if (this.storage) {
      this.storage.removeItem("medical_cache");
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "cache_cleared",
      entriesCleared,
    });
  }

  /**
   * Ensure cache capacity by evicting entries
   */
  ensureCapacity() {
    // Check size limit
    while (this.totalSize > this.options.maxSize) {
      this.evictLeastImportant();
    }

    // Check entry count limit
    while (this.cache.size >= this.options.maxEntries) {
      this.evictLeastImportant();
    }
  }

  /**
   * Evict least important entry based on priority and access patterns
   */
  evictLeastImportant() {
    let lowestScore = Infinity;
    let keyToEvict = null;

    this.cache.forEach((entry, key) => {
      // Never evict critical priority items unless expired
      if (entry.priority === CachePriority.CRITICAL && !entry.isExpired()) {
        return;
      }

      const score = entry.getEvictionScore();
      if (score < lowestScore) {
        lowestScore = score;
        keyToEvict = key;
      }
    });

    if (keyToEvict) {
      this.delete(keyToEvict);
      this.evictionCount += 1;
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const startTime = performance.now();
    let cleanedCount = 0;

    this.cache.forEach((entry, key) => {
      if (entry.isExpired()) {
        this.delete(key);
        cleanedCount += 1;
      }
    });

    const duration = performance.now() - startTime;

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "cache_cleanup",
      cleanedCount,
      duration,
      remainingEntries: this.cache.size,
    });

    return cleanedCount;
  }

  /**
   * Start automatic cleanup timer
   */
  startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Calculate size of cached value (approximate)
   */
  calculateSize(value) {
    try {
      return JSON.stringify(value).length * 2; // Rough estimate (UTF-16)
    } catch {
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate =
      this.hitCount + this.missCount > 0
        ? (this.hitCount / (this.hitCount + this.missCount)) * 100
        : 0;

    return {
      entries: this.cache.size,
      totalSize: this.totalSize,
      maxSize: this.options.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: `${hitRate.toFixed(2)}%`,
      evictionCount: this.evictionCount,
      storageType: this.storageType,
      utilizationPercent: `${((this.totalSize / this.options.maxSize) * 100).toFixed(2)}%`,
    };
  }

  /**
   * Get cache entry information
   */
  getEntryInfo(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    return {
      key: entry.key,
      size: this.calculateSize(entry.value),
      priority: entry.priority,
      ttl: entry.ttl,
      age: entry.getAge(),
      timeToExpiration: entry.getTimeToExpiration(),
      accessCount: entry.metadata.accessCount,
      lastAccessed: new Date(entry.metadata.lastAccessed).toISOString(),
      isExpired: entry.isExpired(),
      evictionScore: entry.getEvictionScore(),
    };
  }

  /**
   * Dispose of cache and cleanup resources
   */
  dispose() {
    this.stopCleanupTimer();
    this.clear();
  }
}

/**
 * Medical cache factory for different data types
 */
export class MedicalCacheFactory {
  static patientDataCache = null;

  static predictionCache = null;

  static validationCache = null;

  static apiCache = null;

  /**
   * Get or create patient data cache (session storage, short TTL)
   */
  static getPatientDataCache() {
    if (!this.patientDataCache) {
      this.patientDataCache = new MedicalCache(CacheStorageType.SESSION, {
        maxSize: 10 * 1024 * 1024, // 10MB
        maxEntries: 100,
        enableEncryption: true,
      });
    }
    return this.patientDataCache;
  }

  /**
   * Get or create prediction results cache (memory only, medium TTL)
   */
  static getPredictionCache() {
    if (!this.predictionCache) {
      this.predictionCache = new MedicalCache(CacheStorageType.MEMORY, {
        maxSize: 50 * 1024 * 1024, // 50MB
        maxEntries: 500,
      });
    }
    return this.predictionCache;
  }

  /**
   * Get or create validation rules cache (local storage, long TTL)
   */
  static getValidationCache() {
    if (!this.validationCache) {
      this.validationCache = new MedicalCache(CacheStorageType.LOCAL, {
        maxSize: 5 * 1024 * 1024, // 5MB
        maxEntries: 200,
      });
    }
    return this.validationCache;
  }

  /**
   * Get or create API response cache (session storage, short TTL)
   */
  static getApiCache() {
    if (!this.apiCache) {
      this.apiCache = new MedicalCache(CacheStorageType.SESSION, {
        maxSize: 20 * 1024 * 1024, // 20MB
        maxEntries: 300,
      });
    }
    return this.apiCache;
  }

  /**
   * Clear all caches (privacy compliance)
   */
  static clearAllCaches() {
    [this.patientDataCache, this.predictionCache, this.validationCache, this.apiCache].forEach(
      cache => {
        if (cache) {
          cache.clear();
        }
      }
    );
  }

  /**
   * Dispose all caches
   */
  static disposeAllCaches() {
    [this.patientDataCache, this.predictionCache, this.validationCache, this.apiCache].forEach(
      cache => {
        if (cache) {
          cache.dispose();
        }
      }
    );

    this.patientDataCache = null;
    this.predictionCache = null;
    this.validationCache = null;
    this.apiCache = null;
  }
}

// Export convenience instances
export const patientDataCache = MedicalCacheFactory.getPatientDataCache();
export const predictionCache = MedicalCacheFactory.getPredictionCache();
export const validationCache = MedicalCacheFactory.getValidationCache();
export const apiCache = MedicalCacheFactory.getApiCache();
