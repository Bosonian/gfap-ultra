/**
 * Main Application Controller
 * iGFAP Stroke Triage Assistant - Modular Architecture
 *
 * Handles core application lifecycle and coordination
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { store } from "../state/store.js";
import { render } from "../ui/render.js";
import { authManager } from "../auth/authentication.js";
import { warmUpFunctions } from "../api/client.js";
import { safeAsync, ERROR_CATEGORIES, ERROR_SEVERITY } from "../utils/error-handler.js";
import { medicalLogger, LOG_CATEGORIES } from "../utils/medical-logger.js";

import { UIManager } from "./ui-manager.js";
import { ThemeManager } from "./theme-manager.js";
import { SessionManager } from "./session-manager.js";
import { AdvancedFeaturesManager } from "./advanced-features-manager.js";

/**
 * Main application controller - coordinates all subsystems
 */
export class AppController {
  constructor() {
    this.container = null;
    this.unsubscribe = null;
    this.isInitialized = false;

    // Initialize managers
    this.uiManager = new UIManager();
    this.themeManager = new ThemeManager();
    this.sessionManager = new SessionManager();
    this.advancedFeaturesManager = new AdvancedFeaturesManager();
  }

  /**
   * Initialize the application
   * @returns {Promise<boolean>} - Initialization success
   */
  async init() {
    return safeAsync(
      async () => {
        medicalLogger.info("Application initialization started", {
          category: LOG_CATEGORIES.SYSTEM,
          version: "2.1.0",
          userAgent: navigator.userAgent.substring(0, 100),
        });

        // Wait for DOM to be ready
        if (document.readyState === "loading") {
          medicalLogger.debug("Waiting for DOM ready", { category: LOG_CATEGORIES.SYSTEM });
          return new Promise(resolve => {
            document.addEventListener("DOMContentLoaded", () => resolve(this.init()));
          });
        }

        // Find app container
        this.container = document.getElementById("appContainer");
        if (!this.container) {
          medicalLogger.critical("App container not found", {
            category: LOG_CATEGORIES.SYSTEM,
            containerId: "appContainer",
          });
          throw new Error("Critical initialization failure: App container not found");
        }

        medicalLogger.debug("App container found", { category: LOG_CATEGORIES.SYSTEM });

        // Check authentication before proceeding
        if (!authManager.isValidSession()) {
          medicalLogger.info("No valid session, redirecting to login", {
            category: LOG_CATEGORIES.AUTHENTICATION,
          });
          store.navigate("login");
        }

        // Initialize core systems
        medicalLogger.info("Initializing core features", { category: LOG_CATEGORIES.SYSTEM });
        await this.initializeCoreFeatures();

        // Advanced features disabled to prevent sync manager errors
        medicalLogger.info("Skipping advanced features initialization", {
          category: LOG_CATEGORIES.SYSTEM,
        });
        // this.initializeAdvancedFeatures();

        // Setup rendering system FIRST so navigation works
        this.setupRenderingSystem();

        // Initialize UI components
        medicalLogger.debug("Initializing UI manager", { category: LOG_CATEGORIES.SYSTEM });
        this.uiManager.initialize(this.container);

        // Initialize theme system
        medicalLogger.debug("Initializing theme manager", { category: LOG_CATEGORIES.SYSTEM });
        this.themeManager.initialize();

        // Setup session management
        medicalLogger.debug("Initializing session manager", { category: LOG_CATEGORIES.SYSTEM });
        this.sessionManager.initialize();

        // Warm up Cloud Functions in background (dev only)
        if (import.meta && import.meta.env && import.meta.env.DEV) {
          medicalLogger.info("Starting Cloud Functions warm-up (dev only)", {
            category: LOG_CATEGORIES.NETWORK,
          });
          warmUpFunctions();
        }

        // Initial render (store subscription is now active)
        render(this.container);

        this.isInitialized = true;
        medicalLogger.info("Application initialization completed successfully", {
          category: LOG_CATEGORIES.SYSTEM,
          initializationTime: performance.now(),
        });

        return true;
      },
      error => {
        medicalLogger.critical("Application initialization failed", {
          category: LOG_CATEGORIES.SYSTEM,
          error: error.message,
          stack: error.stack,
        });
        throw new Error(`App initialization failed: ${error.message}`);
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        severity: ERROR_SEVERITY.CRITICAL,
        timeout: 30000,
        context: {
          operation: "app_initialization",
        },
      }
    );
  }

  /**
   * Initialize core application features
   */
  async initializeCoreFeatures() {
    return safeAsync(
      async () => {
        // Core features that must be available immediately
        const coreInitTasks = [
          this.uiManager.preloadCriticalComponents(),
          this.themeManager.loadSavedTheme(),
          this.sessionManager.validateStoredSession(),
        ];

        const results = await Promise.allSettled(coreInitTasks);

        // Check if any critical feature failed
        const failures = results.filter(result => result.status === "rejected");
        if (failures.length > 0) {
          throw new Error(`${failures.length} core features failed to initialize`);
        }

        return true;
      },
      error =>
        // Continue with degraded functionality on core feature failure
        false,
      {
        category: ERROR_CATEGORIES.RENDERING,
        severity: ERROR_SEVERITY.HIGH,
        context: {
          operation: "core_features_init",
        },
      }
    );
  }

  /**
   * Initialize advanced features (non-blocking)
   */
  async initializeAdvancedFeatures() {
    // Run in background without blocking main app
    safeAsync(
      async () => {
        await this.advancedFeaturesManager.initialize();
        return true;
      },
      error =>
        // Advanced features failure doesn't block core functionality
        false,
      {
        category: ERROR_CATEGORIES.RENDERING,
        severity: ERROR_SEVERITY.MEDIUM,
        context: {
          operation: "advanced_features_init",
        },
      }
    );
  }

  /**
   * Setup the rendering system
   */
  setupRenderingSystem() {
    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      render(this.container);
      // Update research button visibility after each render
      setTimeout(() => this.uiManager.updateResearchMode(), 200);
    });

    // Subscribe to language changes
    window.addEventListener("languageChanged", () => {
      this.uiManager.updateLanguage();
      render(this.container);
    });
  }

  /**
   * Get application status
   * @returns {Object} - Application status information
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasContainer: !!this.container,
      isAuthenticated: authManager.isValidSession(),
      ui: this.uiManager.getStatus(),
      theme: this.themeManager.getStatus(),
      session: this.sessionManager.getStatus(),
      advancedFeatures: this.advancedFeaturesManager.getStatus(),
    };
  }

  /**
   * Cleanup when app is destroyed
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.uiManager.destroy();
    this.themeManager.destroy();
    this.sessionManager.destroy();
    this.advancedFeaturesManager.destroy();

    this.isInitialized = false;
  }
}

/**
 * Create and initialize the main application
 */
export async function createApp() {
  const app = new AppController();

  try {
    await app.init();
    return app;
  } catch (error) {
    throw new Error(`Failed to create application: ${error.message}`);
  }
}
