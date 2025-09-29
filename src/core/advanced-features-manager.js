/**
 * Advanced Features Management System
 * iGFAP Stroke Triage Assistant - Phase 3 & 4 Feature Coordination
 *
 * Handles initialization and management of advanced features
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { safeAsync, ERROR_CATEGORIES, ERROR_SEVERITY } from '../utils/error-handler.js';

// Phase 3: Advanced offline capabilities
import { medicalSWManager } from '../workers/sw-manager.js';
import { medicalPerformanceMonitor } from '../performance/medical-performance-monitor.js';
import { medicalSyncManager } from '../sync/medical-sync-manager.js';
import { lazyLoader } from '../components/lazy-loader.js';

// Phase 4: Medical Intelligence & Analytics - Selected Features
import { clinicalReportingSystem } from '../analytics/clinical-reporting.js';
import { qualityMetricsTracker } from '../analytics/quality-metrics.js';
import { clinicalAuditTrail } from '../analytics/audit-trail.js';

/**
 * Manages advanced features initialization and coordination
 */
export class AdvancedFeaturesManager {
  constructor() {
    this.isInitialized = false;
    this.phase3Status = {
      serviceWorker: false,
      performanceMonitor: false,
      syncManager: false,
      lazyLoader: false
    };
    this.phase4Status = {
      reportingSystem: false,
      qualityMetrics: false,
      auditTrail: false
    };
  }

  /**
   * Initialize all advanced features
   */
  async initialize() {
    return safeAsync(
      async () => {
        // Initialize Phase 3 features
        await this.initializePhase3Features();

        // Initialize Phase 4 features
        await this.initializePhase4Features();

        this.isInitialized = true;
        return true;
      },
      (error) => {
        // Advanced features failure doesn't block core functionality
        return false;
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        severity: ERROR_SEVERITY.MEDIUM,
        timeout: 60000, // Allow more time for advanced features
        context: {
          operation: 'initialize_advanced_features'
        }
      }
    );
  }

  /**
   * Initialize Phase 3 Advanced Features
   */
  async initializePhase3Features() {
    return safeAsync(
      async () => {
        // Start performance monitoring first
        await this.initializePerformanceMonitor();

        // Initialize service worker (non-blocking)
        this.initializeServiceWorker();

        // Initialize sync manager
        await this.initializeSyncManager();

        // Initialize progressive loading
        await this.initializeProgressiveLoading();

        return true;
      },
      (error) => {
        // Phase 3 failure is non-critical
        return false;
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'initialize_phase3_features' }
      }
    );
  }

  /**
   * Initialize performance monitoring
   */
  async initializePerformanceMonitor() {
    return safeAsync(
      async () => {
        medicalPerformanceMonitor.start();
        this.phase3Status.performanceMonitor = true;
        return true;
      },
      (error) => {
        this.phase3Status.performanceMonitor = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'initialize_performance_monitor' }
      }
    );
  }

  /**
   * Initialize service worker
   */
  async initializeServiceWorker() {
    // Run in background without blocking
    safeAsync(
      async () => {
        const swInitialized = await medicalSWManager.initialize();
        this.phase3Status.serviceWorker = swInitialized;

        if (swInitialized) {
          // Prefetch critical medical resources
          await this.prefetchCriticalResources();
        }

        return swInitialized;
      },
      (error) => {
        this.phase3Status.serviceWorker = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.NETWORK,
        context: { operation: 'initialize_service_worker' }
      }
    );
  }

  /**
   * Initialize sync manager
   */
  async initializeSyncManager() {
    return safeAsync(
      async () => {
        const syncInitialized = await medicalSyncManager.initialize();
        this.phase3Status.syncManager = syncInitialized;
        return syncInitialized;
      },
      (error) => {
        this.phase3Status.syncManager = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.NETWORK,
        context: { operation: 'initialize_sync_manager' }
      }
    );
  }

  /**
   * Initialize progressive loading
   */
  async initializeProgressiveLoading() {
    return safeAsync(
      async () => {
        // Preload critical components immediately
        await lazyLoader.preload('critical');

        // Setup viewport-based loading for result visualizations
        setTimeout(() => this.setupViewportLoading(), 100);

        this.phase3Status.lazyLoader = true;
        return true;
      },
      (error) => {
        this.phase3Status.lazyLoader = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'initialize_progressive_loading' }
      }
    );
  }

  /**
   * Setup viewport-based loading
   */
  setupViewportLoading() {
    try {
      const brainVizElements = document.querySelectorAll('.brain-visualization-placeholder');
      brainVizElements.forEach((element) => {
        lazyLoader.observeElement(element, 'brain-visualization');
      });

      const mapElements = document.querySelectorAll('.stroke-center-map-placeholder');
      mapElements.forEach((element) => {
        lazyLoader.observeElement(element, 'stroke-center-map');
      });
    } catch (error) {
      // Viewport loading setup failed - continue without it
    }
  }

  /**
   * Prefetch critical resources for offline use
   */
  async prefetchCriticalResources() {
    return safeAsync(
      async () => {
        const criticalResources = [
          '/0925/src/logic/lvo-local-model.js',
          '/0925/src/logic/ich-volume-calculator.js',
          '/0925/src/patterns/prediction-strategy.js',
          '/0925/src/performance/medical-cache.js',
        ];

        await medicalSWManager.prefetchResources(criticalResources);
        return true;
      },
      (error) => {
        // Prefetch failure is non-critical
        return false;
      },
      {
        category: ERROR_CATEGORIES.NETWORK,
        context: { operation: 'prefetch_critical_resources' }
      }
    );
  }

  /**
   * Initialize Phase 4 Selected Features
   */
  async initializePhase4Features() {
    return safeAsync(
      async () => {
        // Initialize clinical audit trail first (for compliance)
        await this.initializeAuditTrail();

        // Start clinical reporting system
        await this.initializeReportingSystem();

        // Initialize quality metrics tracking
        await this.initializeQualityMetrics();

        // Setup integration event handlers
        this.setupPhase4EventHandlers();

        return true;
      },
      (error) => {
        // Phase 4 failure is non-critical
        return false;
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'initialize_phase4_features' }
      }
    );
  }

  /**
   * Initialize audit trail
   */
  async initializeAuditTrail() {
    return safeAsync(
      async () => {
        await clinicalAuditTrail.initialize();
        this.phase4Status.auditTrail = true;
        return true;
      },
      (error) => {
        this.phase4Status.auditTrail = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.MEDICAL,
        context: { operation: 'initialize_audit_trail' }
      }
    );
  }

  /**
   * Initialize reporting system
   */
  async initializeReportingSystem() {
    return safeAsync(
      async () => {
        clinicalReportingSystem.start();
        this.phase4Status.reportingSystem = true;
        return true;
      },
      (error) => {
        this.phase4Status.reportingSystem = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.MEDICAL,
        context: { operation: 'initialize_reporting_system' }
      }
    );
  }

  /**
   * Initialize quality metrics
   */
  async initializeQualityMetrics() {
    return safeAsync(
      async () => {
        await qualityMetricsTracker.initialize();
        this.phase4Status.qualityMetrics = true;
        return true;
      },
      (error) => {
        this.phase4Status.qualityMetrics = false;
        return false;
      },
      {
        category: ERROR_CATEGORIES.MEDICAL,
        context: { operation: 'initialize_quality_metrics' }
      }
    );
  }

  /**
   * Setup Phase 4 event handlers
   */
  setupPhase4EventHandlers() {
    // Listen for form submissions to trigger quality metrics and audit logging
    document.addEventListener('submit', async (event) => {
      const form = event.target;
      if (form.dataset.module) {
        await safeAsync(
          async () => {
            const formData = new FormData(form);
            const patientData = Object.fromEntries(formData.entries());

            // Log audit trail
            if (this.phase4Status.auditTrail) {
              clinicalAuditTrail.logEvent('data_entry', {
                module: form.dataset.module,
                timestamp: new Date().toISOString(),
                data_points: Object.keys(patientData).length
              });
            }

            // Record quality metrics
            if (this.phase4Status.qualityMetrics) {
              qualityMetricsTracker.recordMetric('form_completion', 'count', 1);
              qualityMetricsTracker.recordMetric('data_quality', 'completeness',
                Object.values(patientData).filter(v => v && v.trim()).length / Object.keys(patientData).length * 100
              );
            }

            return true;
          },
          (error) => {
            // Phase 4 event handling failed - continue silently
            return false;
          },
          {
            category: ERROR_CATEGORIES.MEDICAL,
            context: { operation: 'phase4_event_handling' }
          }
        );
      }
    });
  }

  /**
   * Get comprehensive status of all advanced features
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      phase3: {
        ...this.phase3Status,
        overall: Object.values(this.phase3Status).some(status => status)
      },
      phase4: {
        ...this.phase4Status,
        overall: Object.values(this.phase4Status).some(status => status)
      },
      systemStatus: this.getSystemStatus()
    };
  }

  /**
   * Get detailed system status
   */
  getSystemStatus() {
    return {
      serviceWorkerSupported: 'serviceWorker' in navigator,
      indexedDBSupported: 'indexedDB' in window,
      notificationSupported: 'Notification' in window,
      cacheSupported: 'caches' in window,
      webLockSupported: 'locks' in navigator,
      performanceSupported: 'performance' in window
    };
  }

  /**
   * Restart advanced features
   */
  async restart() {
    this.destroy();
    return this.initialize();
  }

  /**
   * Cleanup when destroyed
   */
  destroy() {
    // Cleanup Phase 3 features
    if (this.phase3Status.performanceMonitor) {
      try {
        medicalPerformanceMonitor.stop?.();
      } catch (error) {
        // Cleanup error - continue
      }
    }

    if (this.phase3Status.syncManager) {
      try {
        medicalSyncManager.destroy?.();
      } catch (error) {
        // Cleanup error - continue
      }
    }

    // Cleanup Phase 4 features
    if (this.phase4Status.reportingSystem) {
      try {
        clinicalReportingSystem.stop?.();
      } catch (error) {
        // Cleanup error - continue
      }
    }

    // Reset status
    this.phase3Status = {
      serviceWorker: false,
      performanceMonitor: false,
      syncManager: false,
      lazyLoader: false
    };

    this.phase4Status = {
      reportingSystem: false,
      qualityMetrics: false,
      auditTrail: false
    };

    this.isInitialized = false;
  }
}