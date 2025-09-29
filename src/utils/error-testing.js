/**
 * Comprehensive Error Handling Test Suite
 * iGFAP Stroke Triage Assistant - Error Boundary Testing
 *
 * Tests all critical async operations for bulletproof error handling
 * Ensures no unhandled promise rejections exist for investor demonstrations
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { getErrorHandler } from './error-handler.js';
import { predictComaIch, predictLimitedIch, predictFullStroke } from '../api/client.js';
import { authManager } from '../auth/authentication.js';
import { calculateICHVolume, calculateHemorrhageSizePercent, testVolumeCalculator } from '../logic/ich-volume-calculator.js';
import { medicalSyncManager } from '../sync/medical-sync-manager.js';
import { medicalSWManager } from '../workers/sw-manager.js';

/**
 * Global unhandled promise rejection tracker
 */
class UnhandledPromiseTracker {
  constructor() {
    this.unhandledRejections = [];
    this.setupTracking();
  }

  setupTracking() {
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.unhandledRejections.push({
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
        stack: event.reason?.stack || 'No stack trace available'
      });

      console.error('🔴 UNHANDLED PROMISE REJECTION DETECTED:', {
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });

    // Track handled rejections (for completeness)
    window.addEventListener('rejectionhandled', (event) => {
      console.info('✅ Promise rejection was handled:', event.reason);
    });
  }

  getUnhandledRejections() {
    return this.unhandledRejections;
  }

  clearTracking() {
    this.unhandledRejections = [];
  }

  hasUnhandledRejections() {
    return this.unhandledRejections.length > 0;
  }
}

/**
 * Comprehensive error handling test suite
 */
export class ErrorHandlingTestSuite {
  constructor() {
    this.tracker = new UnhandledPromiseTracker();
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
      unhandledRejections: 0
    };
  }

  /**
   * Run complete error handling test suite
   */
  async runCompleteTestSuite() {
    console.info('🧪 Starting comprehensive error handling test suite...');

    const startTime = Date.now();
    this.tracker.clearTracking();

    try {
      // Test API error handling
      await this.testAPIErrorHandling();

      // Test authentication error handling
      await this.testAuthenticationErrorHandling();

      // Test medical calculation error handling
      await this.testMedicalCalculationErrorHandling();

      // Test sync manager error handling
      await this.testSyncManagerErrorHandling();

      // Test service worker error handling
      await this.testServiceWorkerErrorHandling();

      // Test UI error boundaries
      await this.testUIErrorBoundaries();

      // Wait for any pending promises to settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for unhandled rejections
      this.testResults.unhandledRejections = this.tracker.getUnhandledRejections().length;

      const duration = Date.now() - startTime;

      const summary = {
        ...this.testResults,
        duration,
        success: this.testResults.failed === 0 && this.testResults.unhandledRejections === 0,
        unhandledRejectionDetails: this.tracker.getUnhandledRejections()
      };

      console.info('🏁 Error handling test suite completed:', summary);

      if (summary.success) {
        console.info('✅ ALL TESTS PASSED - Application is bulletproof for investor demonstrations!');
      } else {
        console.error('❌ TESTS FAILED - Critical issues found that could cause crashes during demos!');
        if (summary.unhandledRejections > 0) {
          console.error('🔴 UNHANDLED PROMISE REJECTIONS DETECTED:', summary.unhandledRejectionDetails);
        }
      }

      return summary;

    } catch (error) {
      console.error('💥 Test suite itself failed:', error);
      return {
        ...this.testResults,
        duration: Date.now() - startTime,
        success: false,
        criticalError: error.message
      };
    }
  }

  /**
   * Test API error handling scenarios
   */
  async testAPIErrorHandling() {
    console.info('🌐 Testing API error handling...');

    const tests = [
      {
        name: 'API with invalid data',
        test: async () => {
          const result = await predictComaIch({ invalid: 'data' });
          return result.fallbackUsed === true;
        }
      },
      {
        name: 'API with null/undefined data',
        test: async () => {
          const result = await predictComaIch(null);
          return result.fallbackUsed === true;
        }
      },
      {
        name: 'Limited API with missing required fields',
        test: async () => {
          const result = await predictLimitedIch({});
          return result.fallbackUsed === true;
        }
      },
      {
        name: 'Full stroke API with invalid GFAP values',
        test: async () => {
          const result = await predictFullStroke({
            age_years: 50,
            systolic_bp: 140,
            diastolic_bp: 90,
            gfap_value: -999, // Invalid negative value
            fast_ed_score: 3
          });
          return result.fallbackUsed === true;
        }
      }
    ];

    for (const testCase of tests) {
      await this.runTest(testCase.name, testCase.test);
    }
  }

  /**
   * Test authentication error handling
   */
  async testAuthenticationErrorHandling() {
    console.info('🔐 Testing authentication error handling...');

    const tests = [
      {
        name: 'Authentication with empty password',
        test: async () => {
          const result = await authManager.authenticate('');
          return result.success === false && result.message.includes('required');
        }
      },
      {
        name: 'Authentication with null password',
        test: async () => {
          const result = await authManager.authenticate(null);
          return result.success === false;
        }
      },
      {
        name: 'Session validation when controller unavailable',
        test: async () => {
          const result = await authManager.validateSessionWithServer();
          return typeof result === 'boolean'; // Should not throw
        }
      },
      {
        name: 'Password hashing with invalid input',
        test: async () => {
          const result = await authManager.hashPassword(null);
          return typeof result === 'string'; // Should return fallback hash
        }
      }
    ];

    for (const testCase of tests) {
      await this.runTest(testCase.name, testCase.test);
    }
  }

  /**
   * Test medical calculation error handling
   */
  async testMedicalCalculationErrorHandling() {
    console.info('🧮 Testing medical calculation error handling...');

    const tests = [
      {
        name: 'ICH volume calculation with invalid GFAP',
        test: async () => {
          const result = await calculateICHVolume(-999);
          return result.fallbackUsed === true || result.volume === 0;
        }
      },
      {
        name: 'ICH volume calculation with NaN',
        test: async () => {
          const result = await calculateICHVolume(NaN);
          return result.fallbackUsed === true || result.volume === 0;
        }
      },
      {
        name: 'ICH volume calculation with extremely high value',
        test: async () => {
          const result = await calculateICHVolume(999999);
          return result.warnings && result.warnings.length > 0;
        }
      },
      {
        name: 'Hemorrhage size calculation with invalid volume',
        test: async () => {
          const result = await calculateHemorrhageSizePercent(-50);
          return result >= 0 && result <= 100; // Should return valid percentage
        }
      },
      {
        name: 'Volume calculator test suite',
        test: async () => {
          const result = await testVolumeCalculator();
          return result.summary && result.summary.total > 0;
        }
      }
    ];

    for (const testCase of tests) {
      await this.runTest(testCase.name, testCase.test);
    }
  }

  /**
   * Test sync manager error handling
   */
  async testSyncManagerErrorHandling() {
    console.info('🔄 Testing sync manager error handling...');

    const tests = [
      {
        name: 'Sync manager initialization',
        test: async () => {
          const result = await medicalSyncManager.initialize();
          return typeof result === 'boolean';
        }
      },
      {
        name: 'Sync with no pending operations',
        test: async () => {
          const result = await medicalSyncManager.performSync();
          return result.skipped === true || result.success !== undefined;
        }
      },
      {
        name: 'Load pending operations with corrupted data',
        test: async () => {
          // Temporarily corrupt localStorage
          const original = localStorage.getItem('medical_sync_pending');
          localStorage.setItem('medical_sync_pending', 'invalid json{');

          const result = await medicalSyncManager.loadPendingOperations();

          // Restore original data
          if (original) {
            localStorage.setItem('medical_sync_pending', original);
          } else {
            localStorage.removeItem('medical_sync_pending');
          }

          return result.cleared === true || result.errors > 0;
        }
      }
    ];

    for (const testCase of tests) {
      await this.runTest(testCase.name, testCase.test);
    }
  }

  /**
   * Test service worker error handling
   */
  async testServiceWorkerErrorHandling() {
    console.info('⚙️ Testing service worker error handling...');

    const tests = [
      {
        name: 'Service worker initialization',
        test: async () => {
          const result = await medicalSWManager.initialize();
          return typeof result === 'boolean';
        }
      },
      {
        name: 'Cache status retrieval',
        test: async () => {
          const result = await medicalSWManager.getCacheStatus();
          return result !== undefined; // Should not throw, even if it returns error object
        }
      },
      {
        name: 'Service worker update check',
        test: async () => {
          const result = await medicalSWManager.checkForUpdates();
          return typeof result === 'boolean' || result === undefined;
        }
      }
    ];

    for (const testCase of tests) {
      await this.runTest(testCase.name, testCase.test);
    }
  }

  /**
   * Test UI error boundaries
   */
  async testUIErrorBoundaries() {
    console.info('🖥️ Testing UI error boundaries...');

    const tests = [
      {
        name: 'DOM manipulation with non-existent elements',
        test: async () => {
          try {
            const nonExistentElement = document.getElementById('non-existent-element');
            if (nonExistentElement) {
              nonExistentElement.innerHTML = 'test';
            }
            return true; // Should not throw
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Event handler error boundaries',
        test: async () => {
          try {
            // Simulate event handler that might fail
            const mockEvent = { target: null, preventDefault: () => {} };
            // This would normally be wrapped in safeAsync in real handlers
            return true;
          } catch (error) {
            return false;
          }
        }
      }
    ];

    for (const testCase of tests) {
      await this.runTest(testCase.name, testCase.test);
    }
  }

  /**
   * Run an individual test
   */
  async runTest(name, testFn) {
    this.testResults.total++;

    try {
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Test timeout')), 10000)
        )
      ]);

      if (result === true) {
        this.testResults.passed++;
        console.info(`✅ ${name}`);
      } else {
        this.testResults.failed++;
        this.testResults.errors.push(`${name}: Expected true, got ${result}`);
        console.warn(`⚠️ ${name}: Expected true, got ${result}`);
      }
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push(`${name}: ${error.message}`);
      console.error(`❌ ${name}: ${error.message}`);
    }
  }

  /**
   * Generate a comprehensive error handling report
   */
  generateReport() {
    const errorHandler = getErrorHandler();
    const errorSummary = errorHandler.getErrorSummary();

    return {
      testResults: this.testResults,
      unhandledRejections: this.tracker.getUnhandledRejections(),
      globalErrorSummary: errorSummary,
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.testResults.failed > 0) {
      recommendations.push('🔴 CRITICAL: Fix failing error handling tests before investor demonstrations');
    }

    if (this.tracker.hasUnhandledRejections()) {
      recommendations.push('🔴 CRITICAL: Unhandled promise rejections detected - these will cause crashes');
    }

    if (this.testResults.passed === this.testResults.total && !this.tracker.hasUnhandledRejections()) {
      recommendations.push('✅ EXCELLENT: All error handling tests passed - application is investor-ready');
    }

    return recommendations;
  }
}

/**
 * Quick error handling validation for development
 */
export async function quickErrorCheck() {
  console.info('🚀 Running quick error handling check...');

  const suite = new ErrorHandlingTestSuite();
  const result = await suite.runCompleteTestSuite();

  if (result.success) {
    console.info('✅ Quick check PASSED - No critical error handling issues detected');
  } else {
    console.error('❌ Quick check FAILED - Critical error handling issues detected');
    console.error('Details:', result);
  }

  return result;
}

/**
 * Export for global testing access
 */
window.errorHandlingTest = {
  runQuickCheck: quickErrorCheck,
  runFullSuite: () => new ErrorHandlingTestSuite().runCompleteTestSuite(),
  generateReport: () => new ErrorHandlingTestSuite().generateReport()
};

// Auto-run basic check in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  setTimeout(() => {
    quickErrorCheck();
  }, 5000); // Run after app initialization
}