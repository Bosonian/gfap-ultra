/**
 * API Warm-up Service
 * Prevents cold start delays by warming up Cloud Functions on app initialization
 */

import { medicalLogger } from '../utils/medical-logger.js';

// Cloud Function endpoints that need warming up
const API_ENDPOINTS = {
  authentication: 'https://europe-west3-igfap-452720.cloudfunctions.net/authenticate-research-access',
  comaIch: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich',
  limitedIch: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich',
  fullStroke: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke',
  lvo: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_lvo'
};

// Lightweight test payloads to warm up APIs
const WARMUP_PAYLOADS = {
  authentication: {
    action: 'validate_session',
    session_token: 'warmup-test-token'
  },
  comaIch: {
    gfap_value: 100
  },
  limitedIch: {
    age_years: 65,
    systolic_bp: 140,
    diastolic_bp: 80,
    gfap_value: 100,
    vigilanzminderung: 0
  },
  fullStroke: {
    age_years: 65,
    systolic_bp: 140,
    diastolic_bp: 80,
    gfap_value: 100,
    fast_ed_score: 4,
    headache: 0,
    vigilanzminderung: 0,
    armparese: 0,
    beinparese: 0,
    eye_deviation: 0,
    atrial_fibrillation: 0,
    anticoagulated_noak: 0,
    antiplatelets: 0
  },
  lvo: {
    gfap_value: 100,
    fast_ed_score: 4
  }
};

class APIWarmupService {
  constructor() {
    this.warmupAttempts = 0;
    this.successfulWarmups = 0;
    this.warmupResults = {};
    this.isWarming = false;
  }

  /**
   * Start warming up all APIs
   * @param {boolean} background - Whether to run in background (default: true)
   * @returns {Promise<Object>} Results of warmup attempts
   */
  async warmupAllAPIs(background = true) {
    if (this.isWarming) {
      medicalLogger.info('API warmup already in progress', { category: 'WARMUP' });
      return this.warmupResults;
    }

    this.isWarming = true;
    this.warmupAttempts = 0;
    this.successfulWarmups = 0;
    this.warmupResults = {};

    medicalLogger.info('Starting API warmup process', {
      category: 'WARMUP',
      endpoints: Object.keys(API_ENDPOINTS).length
    });

    const warmupPromises = Object.entries(API_ENDPOINTS).map(async ([name, url]) => {
      try {
        const result = await this.warmupSingleAPI(name, url, WARMUP_PAYLOADS[name]);
        this.warmupResults[name] = result;
        if (result.success) {
          this.successfulWarmups++;
        }
        return result;
      } catch (error) {
        const errorResult = {
          success: false,
          error: error.message,
          duration: 0,
          timestamp: new Date().toISOString()
        };
        this.warmupResults[name] = errorResult;
        return errorResult;
      }
    });

    if (background) {
      // Don't await in background mode - let it run asynchronously
      Promise.all(warmupPromises).then(() => {
        this.completeWarmup();
      }).catch((error) => {
        medicalLogger.error('Background API warmup failed', {
          category: 'WARMUP',
          error: error.message
        });
        this.isWarming = false;
      });

      return { status: 'warming', message: 'APIs warming up in background' };
    } else {
      // Wait for all warmups to complete
      await Promise.all(warmupPromises);
      this.completeWarmup();
      return this.warmupResults;
    }
  }

  /**
   * Warm up a single API endpoint
   * @param {string} name - API name
   * @param {string} url - API URL
   * @param {Object} payload - Test payload
   * @returns {Promise<Object>} Warmup result
   */
  async warmupSingleAPI(name, url, payload) {
    const startTime = Date.now();
    this.warmupAttempts++;

    try {
      medicalLogger.info(`Warming up ${name} API`, { category: 'WARMUP', url });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'iGFAP-Warmup/2.1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const duration = Date.now() - startTime;

      // We expect most warmup calls to return errors (since they're test data)
      // The important thing is that the function responds, not that it succeeds
      const result = {
        success: true,
        status: response.status,
        duration,
        message: `${name} API warmed up`,
        timestamp: new Date().toISOString()
      };

      medicalLogger.info(`Successfully warmed up ${name} API`, {
        category: 'WARMUP',
        duration,
        status: response.status
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;

      // Network errors are expected for CORS issues, but the function still gets warmed up
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        medicalLogger.info(`${name} API warmup encountered CORS (expected), function still warmed`, {
          category: 'WARMUP',
          duration
        });

        return {
          success: true, // Consider CORS as successful warmup
          status: 'cors-blocked',
          duration,
          message: `${name} API warmed (CORS blocked but function activated)`,
          timestamp: new Date().toISOString()
        };
      }

      medicalLogger.warn(`Failed to warm up ${name} API`, {
        category: 'WARMUP',
        error: error.message,
        duration
      });

      return {
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Complete the warmup process and log results
   */
  completeWarmup() {
    this.isWarming = false;

    const summary = {
      total: this.warmupAttempts,
      successful: this.successfulWarmups,
      failed: this.warmupAttempts - this.successfulWarmups,
      results: this.warmupResults
    };

    medicalLogger.info('API warmup process completed', {
      category: 'WARMUP',
      summary
    });

    // Dispatch custom event for UI feedback
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-warmup-complete', {
        detail: summary
      }));
    }
  }

  /**
   * Get current warmup status
   * @returns {Object} Current status and results
   */
  getWarmupStatus() {
    return {
      isWarming: this.isWarming,
      attempts: this.warmupAttempts,
      successful: this.successfulWarmups,
      results: this.warmupResults
    };
  }

  /**
   * Quick warmup for critical APIs only (authentication, ICH prediction)
   * @returns {Promise<Object>} Results of critical API warmup
   */
  async warmupCriticalAPIs() {
    const criticalAPIs = ['authentication', 'comaIch', 'limitedIch'];

    medicalLogger.info('Starting critical API warmup', {
      category: 'WARMUP',
      apis: criticalAPIs
    });

    const results = {};

    for (const apiName of criticalAPIs) {
      if (API_ENDPOINTS[apiName]) {
        results[apiName] = await this.warmupSingleAPI(
          apiName,
          API_ENDPOINTS[apiName],
          WARMUP_PAYLOADS[apiName]
        );
      }
    }

    medicalLogger.info('Critical API warmup completed', {
      category: 'WARMUP',
      results
    });

    return results;
  }
}

// Create singleton instance
export const apiWarmupService = new APIWarmupService();

/**
 * Initialize API warmup on app startup
 * @param {Object} options - Warmup options
 * @param {boolean} options.background - Run in background (default: true)
 * @param {boolean} options.criticalOnly - Only warm critical APIs (default: false)
 * @returns {Promise<Object>} Warmup results
 */
export async function initializeAPIWarmup(options = {}) {
  const { background = true, criticalOnly = false } = options;

  try {
    if (criticalOnly) {
      return await apiWarmupService.warmupCriticalAPIs();
    } else {
      return await apiWarmupService.warmupAllAPIs(background);
    }
  } catch (error) {
    medicalLogger.error('API warmup initialization failed', {
      category: 'WARMUP',
      error: error.message
    });
    return { error: error.message };
  }
}

/**
 * Warm up APIs before making actual requests (for better UX)
 * @param {Array<string>} apiNames - Names of APIs to warm up
 * @returns {Promise<Object>} Warmup results
 */
export async function warmupSpecificAPIs(apiNames) {
  const results = {};

  for (const apiName of apiNames) {
    if (API_ENDPOINTS[apiName]) {
      results[apiName] = await apiWarmupService.warmupSingleAPI(
        apiName,
        API_ENDPOINTS[apiName],
        WARMUP_PAYLOADS[apiName]
      );
    } else {
      results[apiName] = {
        success: false,
        error: `Unknown API: ${apiName}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  return results;
}

// Auto-start warmup when module loads (background mode)
if (typeof window !== 'undefined') {
  // Only in browser environment
  setTimeout(() => {
    initializeAPIWarmup({ background: true, criticalOnly: false });
  }, 1000); // Start warmup 1 second after page load
}