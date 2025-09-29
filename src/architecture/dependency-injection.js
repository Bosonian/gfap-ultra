/**
 * Dependency Injection Container for Medical Software Architecture
 * iGFAP Stroke Triage Assistant - Enterprise Architecture
 *
 * Provides type-safe dependency management for medical application components
 */

/**
 * Service lifetime types
 */
export const ServiceLifetime = {
  SINGLETON: 'singleton',
  TRANSIENT: 'transient',
  SCOPED: 'scoped',
};

/**
 * Service registration metadata
 */
class ServiceRegistration {
  constructor(key, factory, lifetime = ServiceLifetime.SINGLETON, dependencies = []) {
    this.key = key;
    this.factory = factory;
    this.lifetime = lifetime;
    this.dependencies = dependencies;
    this.instance = null;
    this.metadata = {
      registeredAt: new Date().toISOString(),
      resolveCount: 0,
    };
  }
}

/**
 * Dependency Injection Container for Medical Services
 */
export class MedicalServiceContainer {
  constructor() {
    this.services = new Map();
    this.scopes = new Map();
    this.currentScope = null;
    this.resolutionStack = [];
    this.interceptors = [];
  }

  /**
   * Register a service with the container
   * @param {string} key - Service key/identifier
   * @param {Function} factory - Factory function to create service
   * @param {string} lifetime - Service lifetime
   * @param {Array} dependencies - Dependencies required by this service
   */
  register(key, factory, lifetime = ServiceLifetime.SINGLETON, dependencies = []) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory for service '${key}' must be a function`);
    }

    const registration = new ServiceRegistration(key, factory, lifetime, dependencies);
    this.services.set(key, registration);

    return this;
  }

  /**
   * Register a singleton service
   * @param {string} key - Service key
   * @param {Function} factory - Factory function
   * @param {Array} dependencies - Dependencies
   */
  registerSingleton(key, factory, dependencies = []) {
    return this.register(key, factory, ServiceLifetime.SINGLETON, dependencies);
  }

  /**
   * Register a transient service
   * @param {string} key - Service key
   * @param {Function} factory - Factory function
   * @param {Array} dependencies - Dependencies
   */
  registerTransient(key, factory, dependencies = []) {
    return this.register(key, factory, ServiceLifetime.TRANSIENT, dependencies);
  }

  /**
   * Register a scoped service
   * @param {string} key - Service key
   * @param {Function} factory - Factory function
   * @param {Array} dependencies - Dependencies
   */
  registerScoped(key, factory, dependencies = []) {
    return this.register(key, factory, ServiceLifetime.SCOPED, dependencies);
  }

  /**
   * Register an instance as a singleton
   * @param {string} key - Service key
   * @param {any} instance - Service instance
   */
  registerInstance(key, instance) {
    const factory = () => instance;
    const registration = new ServiceRegistration(key, factory, ServiceLifetime.SINGLETON);
    registration.instance = instance;
    this.services.set(key, registration);

    return this;
  }

  /**
   * Resolve a service from the container
   * @param {string} key - Service key to resolve
   * @returns {any} Resolved service instance
   */
  resolve(key) {
    // Check for circular dependencies
    if (this.resolutionStack.includes(key)) {
      const cycle = [...this.resolutionStack, key].join(' -> ');
      throw new Error(`Circular dependency detected: ${cycle}`);
    }

    const registration = this.services.get(key);
    if (!registration) {
      throw new Error(`Service '${key}' is not registered`);
    }

    this.resolutionStack.push(key);

    try {
      const instance = this.createInstance(registration);

      // Apply interceptors
      const interceptedInstance = this.applyInterceptors(key, instance);

      registration.metadata.resolveCount += 1;

      return interceptedInstance;
    } finally {
      this.resolutionStack.pop();
    }
  }

  /**
   * Create service instance based on lifetime
   * @param {ServiceRegistration} registration - Service registration
   * @returns {any} Service instance
   */
  createInstance(registration) {
    switch (registration.lifetime) {
      case ServiceLifetime.SINGLETON:
        if (!registration.instance) {
          registration.instance = this.instantiate(registration);
        }
        return registration.instance;

      case ServiceLifetime.TRANSIENT:
        return this.instantiate(registration);

      case ServiceLifetime.SCOPED:
        if (!this.currentScope) {
          throw new Error('No active scope for scoped service resolution');
        }
        const scopeKey = `${this.currentScope}_${registration.key}`;
        if (!this.scopes.has(scopeKey)) {
          this.scopes.set(scopeKey, this.instantiate(registration));
        }
        return this.scopes.get(scopeKey);

      default:
        throw new Error(`Unknown service lifetime: ${registration.lifetime}`);
    }
  }

  /**
   * Instantiate service with dependency injection
   * @param {ServiceRegistration} registration - Service registration
   * @returns {any} Service instance
   */
  instantiate(registration) {
    // Resolve dependencies
    const resolvedDependencies = registration.dependencies.map((dep) => this.resolve(dep));

    // Create instance with resolved dependencies
    return registration.factory(...resolvedDependencies);
  }

  /**
   * Apply interceptors to service instance
   * @param {string} key - Service key
   * @param {any} instance - Service instance
   * @returns {any} Intercepted instance
   */
  applyInterceptors(key, instance) {
    return this.interceptors.reduce((current, interceptor) => interceptor(key, current), instance);
  }

  /**
   * Add service interceptor for cross-cutting concerns
   * @param {Function} interceptor - Interceptor function
   */
  addInterceptor(interceptor) {
    if (typeof interceptor !== 'function') {
      throw new Error('Interceptor must be a function');
    }
    this.interceptors.push(interceptor);
  }

  /**
   * Create a new scope for scoped services
   * @param {string} scopeId - Scope identifier
   * @returns {Function} Dispose function
   */
  createScope(scopeId = `scope_${Date.now()}`) {
    if (this.currentScope) {
      throw new Error('Cannot create nested scopes');
    }

    this.currentScope = scopeId;

    // Return dispose function
    return () => {
      this.disposeScope();
    };
  }

  /**
   * Dispose current scope and cleanup scoped services
   */
  disposeScope() {
    if (!this.currentScope) {
      return;
    }

    // Cleanup scoped services
    const scopePrefix = `${this.currentScope}_`;
    const scopedKeys = Array.from(this.scopes.keys()).filter((key) => key.startsWith(scopePrefix));

    scopedKeys.forEach((key) => {
      const instance = this.scopes.get(key);
      if (instance && typeof instance.dispose === 'function') {
        try {
          instance.dispose();
        } catch (error) {
          //(`Error disposing scoped service: ${error.message}`);
        }
      }
      this.scopes.delete(key);
    });

    this.currentScope = null;
  }

  /**
   * Check if service is registered
   * @param {string} key - Service key
   * @returns {boolean} True if registered
   */
  isRegistered(key) {
    return this.services.has(key);
  }

  /**
   * Get service registration information
   * @param {string} key - Service key
   * @returns {Object} Registration info
   */
  getServiceInfo(key) {
    const registration = this.services.get(key);
    if (!registration) {
      return null;
    }

    return {
      key: registration.key,
      lifetime: registration.lifetime,
      dependencies: registration.dependencies,
      metadata: registration.metadata,
      hasInstance: registration.instance !== null,
    };
  }

  /**
   * Get container statistics
   * @returns {Object} Container statistics
   */
  getStats() {
    const stats = {
      totalServices: this.services.size,
      singletons: 0,
      transients: 0,
      scoped: 0,
      totalResolves: 0,
      activeScopes: this.scopes.size,
      currentScope: this.currentScope,
    };

    this.services.forEach((registration) => {
      switch (registration.lifetime) {
        case ServiceLifetime.SINGLETON:
          stats.singletons += 1;
          break;
        case ServiceLifetime.TRANSIENT:
          stats.transients += 1;
          break;
        case ServiceLifetime.SCOPED:
          stats.scoped += 1;
          break;
      }
      stats.totalResolves += registration.metadata.resolveCount;
    });

    return stats;
  }

  /**
   * Clear all registrations and instances
   */
  clear() {
    // Dispose scoped services
    this.disposeScope();

    // Dispose singleton services
    this.services.forEach((registration) => {
      if (registration.instance && typeof registration.instance.dispose === 'function') {
        try {
          registration.instance.dispose();
        } catch (error) {
          //(`Error disposing service: ${error.message}`);
        }
      }
    });

    this.services.clear();
    this.scopes.clear();
    this.interceptors = [];
    this.currentScope = null;
  }
}

/**
 * Service decorator for automatic registration
 * @param {string} key - Service key
 * @param {string} lifetime - Service lifetime
 * @param {Array} dependencies - Dependencies
 */
export function Service(key, lifetime = ServiceLifetime.SINGLETON, dependencies = []) {
  return function (target) {
    // Store metadata on the constructor
    target.serviceKey = key;
    target.serviceLifetime = lifetime;
    target.serviceDependencies = dependencies;

    // Return enhanced constructor
    return target;
  };
}

/**
 * Inject decorator for marking constructor parameters
 * @param {string} serviceKey - Service key to inject
 */
export function Inject(serviceKey) {
  return function (target, propertyKey, parameterIndex) {
    const existingInjects = Reflect.getMetadata('design:injects', target) || [];
    existingInjects[parameterIndex] = serviceKey;
    Reflect.defineMetadata('design:injects', existingInjects, target);
  };
}

// Medical service keys constants
export const MEDICAL_SERVICES = {
  // Core services
  EVENT_OBSERVER: 'medical.event.observer',
  PERFORMANCE_MONITOR: 'medical.performance.monitor',
  VALIDATION_FACTORY: 'medical.validation.factory',
  PREDICTION_CONTEXT: 'medical.prediction.context',
  COMMAND_INVOKER: 'medical.command.invoker',

  // Data services
  STORE: 'medical.store',
  AUTH_MANAGER: 'medical.auth.manager',
  API_CLIENT: 'medical.api.client',

  // UI services
  RENDERER: 'medical.ui.renderer',
  ROUTER: 'medical.router',
  I18N: 'medical.i18n',

  // Infrastructure
  LOGGER: 'medical.logger',
  CACHE: 'medical.cache',
  SECURITY: 'medical.security',
};

// Export singleton container instance
export const medicalContainer = new MedicalServiceContainer();
