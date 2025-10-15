/**
 * Progressive Loading and Lazy Component System
 * iGFAP Stroke Triage Assistant - Phase 3 Advanced Features
 *
 * Provides intelligent component loading for optimal performance
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "../patterns/observer.js";
import { medicalPerformanceMonitor, PerformanceMetricType } from "../performance/medical-performance-monitor.js";

/**
 * Component loading priorities
 */
export const LoadPriority = {
  CRITICAL: "critical", // Load immediately
  HIGH: "high", // Load on interaction
  NORMAL: "normal", // Load on viewport
  LOW: "low", // Load on idle
};

/**
 * Component loading states
 */
export const LoadState = {
  PENDING: "pending",
  LOADING: "loading",
  LOADED: "loaded",
  ERROR: "error",
};

/**
 * Lazy component definition
 */
class LazyComponent {
  constructor(name, loader, options = {}) {
    this.name = name;
    this.loader = loader;
    this.priority = options.priority || LoadPriority.NORMAL;
    this.state = LoadState.PENDING;
    this.component = null;
    this.error = null;
    this.loadTime = null;
    this.dependencies = options.dependencies || [];
    this.retryCount = 0;
    this.maxRetries = options.maxRetries || 3;
    this.loadPromise = null;
  }

  /**
   * Load the component
   */
  async load() {
    if (this.state === LoadState.LOADED) {
      return this.component;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.USER_INTERACTION,
      `lazy_load_${this.name}`,
      { priority: this.priority },
    );

    this.state = LoadState.LOADING;
    this.loadPromise = this.executeLoad(metricId);

    return this.loadPromise;
  }

  /**
   * Execute component loading with error handling
   */
  async executeLoad(metricId) {
    try {
      const startTime = performance.now();

      // Load dependencies first
      await this.loadDependencies();

      // Load the component
      this.component = await this.loader();
      this.loadTime = performance.now() - startTime;
      this.state = LoadState.LOADED;

      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: true,
        loadTime: this.loadTime,
        retryCount: this.retryCount,
      });

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "lazy_component_loaded",
        component: this.name,
        loadTime: this.loadTime,
        priority: this.priority,
      });

      return this.component;
    } catch (error) {
      this.error = error;
      this.retryCount++;

      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: false,
        error: error.message,
        retryCount: this.retryCount,
      });

      if (this.retryCount < this.maxRetries) {
        // (`⚠️ Component ${this.name} load failed, retrying (${this.retryCount}/${this.maxRetries}):`, error);

        // Exponential backoff
        const delay = Math.min(1000 * 2 ** (this.retryCount - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));

        this.loadPromise = null;
        return this.load();
      }
      this.state = LoadState.ERROR;
      // (`❌ Component ${this.name} failed to load after ${this.maxRetries} attempts:`, error);

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "lazy_component_load_failed",
        component: this.name,
        error: error.message,
        retryCount: this.retryCount,
      });

      throw error;
    }
  }

  /**
   * Load component dependencies
   */
  async loadDependencies() {
    if (this.dependencies.length === 0) {
      return;
    }

    const dependencyPromises = this.dependencies.map((dep) => {
      if (typeof dep === "string") {
        // Load dependency by name
        return LazyLoader.load(dep);
      } if (typeof dep === "function") {
        // Load dependency function
        return dep();
      }
      // Assume it's a lazy component
      return dep.load();
    });

    await Promise.all(dependencyPromises);
  }

  /**
   * Get component status
   */
  getStatus() {
    return {
      name: this.name,
      state: this.state,
      priority: this.priority,
      loadTime: this.loadTime,
      error: this.error?.message,
      retryCount: this.retryCount,
    };
  }
}

/**
 * Progressive component loader with intelligent scheduling
 */
export class LazyLoader {
  constructor() {
    this.components = new Map();
    this.intersectionObserver = null;
    this.idleCallback = null;
    this.loadQueue = {
      [LoadPriority.CRITICAL]: [],
      [LoadPriority.HIGH]: [],
      [LoadPriority.NORMAL]: [],
      [LoadPriority.LOW]: [],
    };
    this.isProcessingQueue = false;

    this.initializeObservers();
  }

  /**
   * Initialize viewport and idle observers
   */
  initializeObservers() {
    // Intersection Observer for viewport-based loading
    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => this.handleIntersectionChanges(entries),
        {
          rootMargin: "50px",
          threshold: 0.1,
        },
      );
    }

    // Idle callback for low-priority loading
    this.scheduleIdleLoading();
  }

  /**
   * Register a lazy component
   */
  register(name, loader, options = {}) {
    const component = new LazyComponent(name, loader, options);
    this.components.set(name, component);

    // Add to appropriate load queue
    this.loadQueue[component.priority].push(component);

    // Start loading critical components immediately
    if (component.priority === LoadPriority.CRITICAL) {
      this.processLoadQueue();
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "lazy_component_registered",
      component: name,
      priority: component.priority,
    });

    return component;
  }

  /**
   * Load a component by name
   */
  async load(name) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' not registered`);
    }

    return component.load();
  }

  /**
   * Preload components based on priority
   */
  async preload(priority = LoadPriority.HIGH) {
    const priorities = [LoadPriority.CRITICAL, LoadPriority.HIGH, LoadPriority.NORMAL, LoadPriority.LOW];
    const targetPriorities = priorities.slice(0, priorities.indexOf(priority) + 1);

    const preloadPromises = [];

    targetPriorities.forEach((pri) => {
      this.loadQueue[pri].forEach((component) => {
        if (component.state === LoadState.PENDING) {
          preloadPromises.push(component.load());
        }
      });
    });

    await Promise.allSettled(preloadPromises);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "lazy_components_preloaded",
      priority,
      count: preloadPromises.length,
    });
  }

  /**
   * Observe element for viewport-based loading
   */
  observeElement(element, componentName) {
    if (!this.intersectionObserver) {
      return;
    }

    element.dataset.lazyComponent = componentName;
    this.intersectionObserver.observe(element);
  }

  /**
   * Handle intersection observer changes
   */
  handleIntersectionChanges(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const componentName = entry.target.dataset.lazyComponent;
        if (componentName) {
          this.load(componentName).catch((error) => {
            // (`Failed to load component ${componentName}:`, error);
          });

          // Stop observing once loaded
          this.intersectionObserver.unobserve(entry.target);
        }
      }
    });
  }

  /**
   * Process load queue based on priority
   */
  async processLoadQueue() {
    if (this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      // Process critical components first
      await this.processQueueByPriority(LoadPriority.CRITICAL);

      // Process high priority components
      await this.processQueueByPriority(LoadPriority.HIGH);
    } catch (error) {
      // ('Error processing load queue:', error);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Process components of specific priority
   */
  async processQueueByPriority(priority) {
    const queue = this.loadQueue[priority];
    const pendingComponents = queue.filter((comp) => comp.state === LoadState.PENDING);

    if (pendingComponents.length === 0) {
      return;
    }

    const loadPromises = pendingComponents.map((component) => component.load().catch((error) =>
      // (`Component ${component.name} failed to load:`, error);
      null));

    await Promise.allSettled(loadPromises);
  }

  /**
   * Schedule idle loading for low-priority components
   */
  scheduleIdleLoading() {
    const scheduleNext = () => {
      if ("requestIdleCallback" in window) {
        this.idleCallback = requestIdleCallback((deadline) => {
          this.processIdleQueue(deadline);
          scheduleNext();
        }, { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          this.processIdleQueue({ timeRemaining: () => 50 });
          scheduleNext();
        }, 100);
      }
    };

    scheduleNext();
  }

  /**
   * Process low-priority components during idle time
   */
  async processIdleQueue(deadline) {
    const normalQueue = this.loadQueue[LoadPriority.NORMAL];
    const lowQueue = this.loadQueue[LoadPriority.LOW];

    // Process normal priority first, then low priority
    const pendingComponents = [
      ...normalQueue.filter((comp) => comp.state === LoadState.PENDING),
      ...lowQueue.filter((comp) => comp.state === LoadState.PENDING),
    ];

    for (const component of pendingComponents) {
      if (deadline.timeRemaining() > 10) { // Need at least 10ms
        try {
          await component.load();
        } catch (error) {
          // (`Idle loading failed for ${component.name}:`, error);
        }
      } else {
        break; // No more time available
      }
    }
  }

  /**
   * Get loader statistics
   */
  getStats() {
    const stats = {
      total: this.components.size,
      byState: {
        pending: 0, loading: 0, loaded: 0, error: 0,
      },
      byPriority: {
        critical: 0, high: 0, normal: 0, low: 0,
      },
      totalLoadTime: 0,
      averageLoadTime: 0,
    };

    let totalLoadTime = 0;
    let loadedCount = 0;

    this.components.forEach((component) => {
      stats.byState[component.state]++;
      stats.byPriority[component.priority]++;

      if (component.loadTime) {
        totalLoadTime += component.loadTime;
        loadedCount++;
      }
    });

    stats.totalLoadTime = totalLoadTime;
    stats.averageLoadTime = loadedCount > 0 ? totalLoadTime / loadedCount : 0;

    return stats;
  }

  /**
   * Force reload a component
   */
  async reload(name) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' not registered`);
    }

    // Reset component state
    component.state = LoadState.PENDING;
    component.component = null;
    component.error = null;
    component.loadTime = null;
    component.retryCount = 0;
    component.loadPromise = null;

    return component.load();
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.idleCallback) {
      cancelIdleCallback(this.idleCallback);
    }

    this.components.clear();
    Object.values(this.loadQueue).forEach((queue) => queue.length = 0);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "lazy_loader_disposed",
    });
  }
}

/**
 * Medical component lazy loaders
 */
export class MedicalComponentLoader {
  constructor(lazyLoader) {
    this.lazyLoader = lazyLoader;
    this.registerMedicalComponents();
  }

  /**
   * Register all medical components (only for truly lazy-loaded modules)
   */
  registerMedicalComponents() {
    // Only register components that are NOT statically imported elsewhere
    // This prevents the build warnings about mixed static/dynamic imports

    // Advanced features chunk (only loaded when research mode is activated)
    this.lazyLoader.register(
      "advanced-analytics",
      () => import("../analytics/quality-metrics.js"),
      { priority: LoadPriority.LOW },
    );

    this.lazyLoader.register(
      "clinical-reporting",
      () => import("../analytics/clinical-reporting.js"),
      { priority: LoadPriority.LOW },
    );

    this.lazyLoader.register(
      "audit-trail",
      () => import("../analytics/audit-trail.js"),
      { priority: LoadPriority.LOW },
    );

    // Service workers and background features
    this.lazyLoader.register(
      "medical-service-worker",
      () => import("../workers/medical-service-worker.js"),
      { priority: LoadPriority.LOW },
    );

    this.lazyLoader.register(
      "sw-manager",
      () => import("../workers/sw-manager.js"),
      { priority: LoadPriority.LOW },
    );

    // Advanced architectural patterns (loaded only when needed)
    this.lazyLoader.register(
      "command-pattern",
      () => import("../patterns/command.js"),
      { priority: LoadPriority.NORMAL },
    );

    this.lazyLoader.register(
      "prediction-strategy",
      () => import("../patterns/prediction-strategy.js"),
      { priority: LoadPriority.NORMAL },
    );

    this.lazyLoader.register(
      "validation-factory",
      () => import("../patterns/validation-factory.js"),
      { priority: LoadPriority.NORMAL },
    );
  }

  /**
   * Load medical component by clinical priority
   */
  async loadByClinicalPriority(clinicalSituation) {
    switch (clinicalSituation) {
    case "emergency":
      // Load high-priority architectural patterns
      await this.lazyLoader.preload(LoadPriority.HIGH);
      break;

    case "routine":
      // Load normal priority patterns and command structures
      await this.lazyLoader.preload(LoadPriority.NORMAL);
      break;

    case "research":
      // Load research and analytics tools
      await this.lazyLoader.load("advanced-analytics");
      await this.lazyLoader.load("clinical-reporting");
      await this.lazyLoader.load("audit-trail");
      break;

    case "background":
      // Load service workers and background features
      await this.lazyLoader.load("medical-service-worker");
      await this.lazyLoader.load("sw-manager");
      break;

    default:
      await this.lazyLoader.preload(LoadPriority.NORMAL);
    }
  }

  /**
   * Preload components for specific medical module
   */
  async preloadForModule(moduleType) {
    // Since core components are now statically imported,
    // we only need to load advanced features
    const moduleComponents = {
      coma: ["command-pattern"],
      limited: ["prediction-strategy"],
      full: ["command-pattern", "prediction-strategy", "validation-factory"],
      research: ["advanced-analytics", "clinical-reporting", "audit-trail"],
    };

    const components = moduleComponents[moduleType] || [];
    const loadPromises = components.map((comp) => this.lazyLoader.load(comp));

    await Promise.allSettled(loadPromises);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "medical_components_preloaded",
      moduleType,
      components,
    });
  }

  /**
   * Load enterprise features for production deployment
   */
  async loadEnterpriseFeatures() {
    const enterpriseComponents = [
      "medical-service-worker",
      "sw-manager",
      "advanced-analytics",
      "clinical-reporting",
      "audit-trail",
    ];

    const loadPromises = enterpriseComponents.map((comp) => this.lazyLoader.load(comp).catch((error) => {
      console.warn(`Enterprise feature ${comp} failed to load:`, error);
      return null;
    }));

    const results = await Promise.allSettled(loadPromises);
    const loadedCount = results.filter((r) => r.status === "fulfilled" && r.value !== null).length;

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "enterprise_features_loaded",
      requested: enterpriseComponents.length,
      loaded: loadedCount,
    });

    return loadedCount;
  }
}

// Export singleton instances
export const lazyLoader = new LazyLoader();
export const medicalComponentLoader = new MedicalComponentLoader(lazyLoader);
