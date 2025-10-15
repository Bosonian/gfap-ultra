/**
 * Medical Module Architecture System
 * iGFAP Stroke Triage Assistant - Enterprise Architecture
 *
 * Provides modular architecture for medical application components
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "../patterns/observer.js";

import { medicalContainer, MEDICAL_SERVICES } from "./dependency-injection.js";

/**
 * Module lifecycle states
 */
export const ModuleState = {
  UNREGISTERED: "unregistered",
  REGISTERED: "registered",
  INITIALIZING: "initializing",
  INITIALIZED: "initialized",
  STARTING: "starting",
  STARTED: "started",
  STOPPING: "stopping",
  STOPPED: "stopped",
  ERROR: "error",
};

/**
 * Module metadata and configuration
 */
class ModuleMetadata {
  constructor(name, version, description, dependencies = [], exports = []) {
    this.name = name;
    this.version = version;
    this.description = description;
    this.dependencies = dependencies;
    this.exports = exports;
    this.state = ModuleState.UNREGISTERED;
    this.error = null;
    this.registeredAt = new Date().toISOString();
    this.startedAt = null;
  }
}

/**
 * Abstract base class for medical modules
 */
export class MedicalModule {
  constructor(metadata) {
    this.metadata = metadata;
    this.services = new Map();
    this.eventHandlers = new Map();
    this.disposed = false;
  }

  /**
   * Initialize the module (register services, setup dependencies)
   * @param {MedicalServiceContainer} container - DI container
   * @returns {Promise<void>}
   */
  async initialize(container) {
    if (this.metadata.state !== ModuleState.REGISTERED) {
      throw new Error(`Module ${this.metadata.name} must be registered before initialization`);
    }

    this.metadata.state = ModuleState.INITIALIZING;

    try {
      await this.onInitialize(container);
      this.metadata.state = ModuleState.INITIALIZED;

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "module_initialized",
        module: this.metadata.name,
        version: this.metadata.version,
      });
    } catch (error) {
      this.metadata.state = ModuleState.ERROR;
      this.metadata.error = error.message;
      throw error;
    }
  }

  /**
   * Start the module (begin active operations)
   * @returns {Promise<void>}
   */
  async start() {
    if (this.metadata.state !== ModuleState.INITIALIZED) {
      throw new Error(`Module ${this.metadata.name} must be initialized before starting`);
    }

    this.metadata.state = ModuleState.STARTING;

    try {
      await this.onStart();
      this.metadata.state = ModuleState.STARTED;
      this.metadata.startedAt = new Date().toISOString();

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "module_started",
        module: this.metadata.name,
      });
    } catch (error) {
      this.metadata.state = ModuleState.ERROR;
      this.metadata.error = error.message;
      throw error;
    }
  }

  /**
   * Stop the module (cleanup active operations)
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.metadata.state !== ModuleState.STARTED) {
      return; // Already stopped or not started
    }

    this.metadata.state = ModuleState.STOPPING;

    try {
      await this.onStop();
      this.metadata.state = ModuleState.STOPPED;

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "module_stopped",
        module: this.metadata.name,
      });
    } catch (error) {
      this.metadata.state = ModuleState.ERROR;
      this.metadata.error = error.message;
      throw error;
    }
  }

  /**
   * Dispose the module (cleanup resources)
   * @returns {Promise<void>}
   */
  async dispose() {
    if (this.disposed) {
      return;
    }

    if (this.metadata.state === ModuleState.STARTED) {
      await this.stop();
    }

    // Remove event handlers
    this.eventHandlers.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        // (`Error unsubscribing event handler: ${error.message}`);
      }
    });
    this.eventHandlers.clear();

    // Dispose services
    this.services.forEach((service) => {
      if (service && typeof service.dispose === "function") {
        try {
          service.dispose();
        } catch (error) {
          // (`Error disposing service: ${error.message}`);
        }
      }
    });
    this.services.clear();

    await this.onDispose();

    this.disposed = true;

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "module_disposed",
      module: this.metadata.name,
    });
  }

  /**
   * Subscribe to medical events
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} handler - Event handler function
   */
  subscribeToEvent(eventType, handler) {
    const unsubscribe = medicalEventObserver.subscribe(eventType, handler, {
      medicalContext: this.metadata.name,
    });
    this.eventHandlers.set(`${eventType}_${Date.now()}`, unsubscribe);
  }

  /**
   * Publish medical events
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  publishEvent(eventType, data) {
    medicalEventObserver.publish(eventType, data, {
      source: this.metadata.name,
    });
  }

  /**
   * Register a service with the module
   * @param {string} key - Service key
   * @param {any} service - Service instance
   */
  registerService(key, service) {
    this.services.set(key, service);
  }

  /**
   * Get a service from the module
   * @param {string} key - Service key
   * @returns {any} Service instance
   */
  getService(key) {
    return this.services.get(key);
  }

  /**
   * Check if module is healthy
   * @returns {Object} Health check result
   */
  getHealthStatus() {
    return {
      module: this.metadata.name,
      state: this.metadata.state,
      healthy: this.metadata.state === ModuleState.STARTED && !this.metadata.error,
      error: this.metadata.error,
      uptime: this.getUptime(),
      services: this.services.size,
      eventHandlers: this.eventHandlers.size,
    };
  }

  /**
   * Get module uptime in milliseconds
   * @returns {number} Uptime in milliseconds
   */
  getUptime() {
    if (!this.metadata.startedAt) {
      return 0;
    }
    return Date.now() - new Date(this.metadata.startedAt).getTime();
  }

  // Abstract methods to be implemented by concrete modules
  async onInitialize(container) {
    // Override in concrete modules
  }

  async onStart() {
    // Override in concrete modules
  }

  async onStop() {
    // Override in concrete modules
  }

  async onDispose() {
    // Override in concrete modules
  }
}

/**
 * Medical module registry and orchestrator
 */
export class MedicalModuleRegistry {
  constructor(container = medicalContainer) {
    this.container = container;
    this.modules = new Map();
    this.dependencyGraph = new Map();
    this.startupOrder = [];
  }

  /**
   * Register a medical module
   * @param {MedicalModule} module - Module to register
   */
  registerModule(module) {
    if (!(module instanceof MedicalModule)) {
      throw new Error("Module must extend MedicalModule");
    }

    const { name } = module.metadata;
    if (this.modules.has(name)) {
      throw new Error(`Module ${name} is already registered`);
    }

    module.metadata.state = ModuleState.REGISTERED;
    this.modules.set(name, module);

    // Build dependency graph
    this.dependencyGraph.set(name, module.metadata.dependencies);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "module_registered",
      module: name,
      version: module.metadata.version,
    });
  }

  /**
   * Initialize all registered modules in dependency order
   * @returns {Promise<void>}
   */
  async initializeAll() {
    const initOrder = this.resolveDependencyOrder();

    for (const moduleName of initOrder) {
      const module = this.modules.get(moduleName);
      if (module.metadata.state === ModuleState.REGISTERED) {
        await module.initialize(this.container);
      }
    }
  }

  /**
   * Start all initialized modules
   * @returns {Promise<void>}
   */
  async startAll() {
    const startOrder = this.resolveDependencyOrder();
    this.startupOrder = [...startOrder];

    for (const moduleName of startOrder) {
      const module = this.modules.get(moduleName);
      if (module.metadata.state === ModuleState.INITIALIZED) {
        await module.start();
      }
    }
  }

  /**
   * Stop all running modules in reverse order
   * @returns {Promise<void>}
   */
  async stopAll() {
    const stopOrder = [...this.startupOrder].reverse();

    for (const moduleName of stopOrder) {
      const module = this.modules.get(moduleName);
      if (module.metadata.state === ModuleState.STARTED) {
        await module.stop();
      }
    }
  }

  /**
   * Dispose all modules
   * @returns {Promise<void>}
   */
  async disposeAll() {
    const disposeOrder = [...this.startupOrder].reverse();

    for (const moduleName of disposeOrder) {
      const module = this.modules.get(moduleName);
      await module.dispose();
    }

    this.modules.clear();
    this.dependencyGraph.clear();
    this.startupOrder = [];
  }

  /**
   * Get a specific module
   * @param {string} name - Module name
   * @returns {MedicalModule} Module instance
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * Check if module is registered
   * @param {string} name - Module name
   * @returns {boolean} True if registered
   */
  hasModule(name) {
    return this.modules.has(name);
  }

  /**
   * Get health status of all modules
   * @returns {Object} Health status summary
   */
  getHealthStatus() {
    const moduleHealth = Array.from(this.modules.values()).map((module) => module.getHealthStatus());

    const summary = {
      totalModules: this.modules.size,
      healthyModules: moduleHealth.filter((health) => health.healthy).length,
      unhealthyModules: moduleHealth.filter((health) => !health.healthy).length,
      modules: moduleHealth,
    };

    return summary;
  }

  /**
   * Resolve dependency order using topological sort
   * @returns {Array<string>} Module names in dependency order
   */
  resolveDependencyOrder() {
    const visited = new Set();
    const visiting = new Set();
    const order = [];

    const visit = (moduleName) => {
      if (visiting.has(moduleName)) {
        throw new Error(`Circular dependency detected involving module: ${moduleName}`);
      }

      if (visited.has(moduleName)) {
        return;
      }

      visiting.add(moduleName);

      const dependencies = this.dependencyGraph.get(moduleName) || [];
      for (const dep of dependencies) {
        if (!this.modules.has(dep)) {
          throw new Error(`Module ${moduleName} depends on unregistered module: ${dep}`);
        }
        visit(dep);
      }

      visiting.delete(moduleName);
      visited.add(moduleName);
      order.push(moduleName);
    };

    for (const moduleName of this.modules.keys()) {
      visit(moduleName);
    }

    return order;
  }

  /**
   * Get module registry statistics
   * @returns {Object} Registry statistics
   */
  getStats() {
    const stateCount = {};
    this.modules.forEach((module) => {
      const { state } = module.metadata;
      stateCount[state] = (stateCount[state] || 0) + 1;
    });

    return {
      totalModules: this.modules.size,
      stateDistribution: stateCount,
      dependencyGraph: Object.fromEntries(this.dependencyGraph),
      startupOrder: this.startupOrder,
    };
  }
}

// Export singleton registry
export const medicalModuleRegistry = new MedicalModuleRegistry();
