/**
 * Main Application Entry Point - Clean Modular Architecture
 * iGFAP Stroke Triage Assistant - Production Ready
 *
 * Uses the new modular app-controller.js system for better maintainability
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import "./index.css";
import { createApp } from "./core/app-controller.js";
import { store } from "./state/store.js";
import { render } from "./ui/render.js";
import { safeAsync, ERROR_CATEGORIES, ERROR_SEVERITY } from "./utils/error-handler.js";
import { initializeAPIWarmup } from "./core/api-warmup.js";
import { initializeKioskHandlers } from "./handlers/kiosk-handlers.js";
import { initializeShareHandlers } from "./handlers/share-handlers.js";
import { detectKioskMode, loadKioskCase } from "./logic/kiosk-loader.js";
import { detectSharedLink, loadSharedCase } from "./services/case-share-link.js";

/**
 * Application instance
 */
let app = null;

/**
 * Initialize the iGFAP Stroke Triage Assistant
 */
async function initializeApplication() {
  return safeAsync(
    async () => {
      // Create and initialize the main application
      app = await createApp();

      // Start API warmup in background to prevent cold starts
      setTimeout(() => {
        initializeAPIWarmup({ background: true, criticalOnly: false })
          .then(result => {
            console.info("[Main] API warmup started:", result.status || "completed");
          })
          .catch(error => {
            console.warn("[Main] API warmup failed:", error.message);
          });
      }, 2000); // Start warmup 2 seconds after app initialization

      // Log successful initialization
      const status = app.getStatus();
      const startupEvent = new CustomEvent("appInitialized", {
        detail: {
          timestamp: new Date().toISOString(),
          status,
          version: "2.1.0",
          build: "production",
        },
      });
      document.dispatchEvent(startupEvent);
      document.querySelectorAll(".bar-fill").forEach(el => {
        const targetWidth = el.getAttribute("data-width");
        el.style.width = `${targetWidth}%`;
      });
      return app;
    },
    error => {
      // Critical initialization failure
      handleInitializationFailure(error);
      throw error;
    },
    {
      category: ERROR_CATEGORIES.RENDERING,
      severity: ERROR_SEVERITY.CRITICAL,
      timeout: 30000,
      context: {
        operation: "application_initialization",
        version: "2.1.0",
      },
    }
  );
}

/**
 * Handle initialization failure gracefully
 * @param {Error} error - Initialization error
 */
function handleInitializationFailure(error) {
  // Create emergency fallback UI
  const container = document.getElementById("appContainer");
  if (container) {
    container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        padding: 20px;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          <h2 style="color: #856404; margin: 0 0 16px 0;">
            ⚠️ Application Initialization Failed
          </h2>
          <p style="color: #856404; margin: 0 0 16px 0; line-height: 1.5;">
            The medical triage system could not start properly.
            This may be due to a network issue or browser compatibility problem.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              background: #007bff;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              margin-right: 12px;
            "
          >
            🔄 Reload Application
          </button>
          <button
            onclick="window.open('mailto:bosdeepak@gmail.com?subject=iGFAP App Error', '_blank')"
            style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
            "
          >
            📧 Report Issue
          </button>
        </div>
        <small style="color: #6c757d; margin-top: 20px;">
          Error: ${error.message || "Unknown initialization error"}
        </small>
      </div>
    `;
  }

  // Log error for debugging
  const errorEvent = new CustomEvent("appInitializationFailed", {
    detail: {
      error: error.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100),
    },
  });
  document.dispatchEvent(errorEvent);
}

/**
 * Cleanup on page unload
 */
function handlePageUnload() {
  if (app) {
    try {
      app.destroy();
    } catch (error) {
      // Cleanup error - continue with unload
    }
  }
}

/**
 * Setup global error handlers
 */
function setupGlobalErrorHandlers() {
  // Handle page visibility changes (mobile apps, tab switching)
  document.addEventListener("visibilitychange", () => {
    if (app && document.visibilityState === "visible") {
      // App became visible - validate session
      const status = app.getStatus();
      if (!status.isAuthenticated) {
        window.location.reload();
      }
    }
  });

  // Handle page unload
  window.addEventListener("beforeunload", handlePageUnload);
  window.addEventListener("unload", handlePageUnload);
}

/**
 * Main application startup
 */
async function main() {
  try {
    // In local preview, make sure no service worker is controlling (avoids stale assets)
    try {
      const isLocalPreview =
        ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname) &&
        !(import.meta && import.meta.env && import.meta.env.DEV);
      if (isLocalPreview && "serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          try {
            await reg.unregister();
          } catch {
            console.warn("[Main] Failed to unregister service worker:", reg);
          }
        }
        // Also clear any pending beforeinstallprompt side-effects
        window.addEventListener("beforeinstallprompt", e => {
          e.preventDefault();
        });
      }
    } catch {
      console.warn("[Main] Service worker cleanup failed");
    }

    // Setup global error handling
    setupGlobalErrorHandlers();

    // Initialize the application
    await initializeApplication();

    // Check for shared link and load case data if needed
    const sharedInfo = detectSharedLink();
    if (sharedInfo.isShared && sharedInfo.caseId) {
      console.log("[Main] Shared link detected - loading case:", sharedInfo.caseId);
      try {
        const caseData = await loadSharedCase(sharedInfo.caseId);

        // Populate store with loaded case data
        if (caseData.results) {
          store.setState({ results: caseData.results });
        }
        if (caseData.formData) {
          store.setState({ formData: caseData.formData });
        }

        // Navigate to results screen
        store.navigate("results");

        // Re-render to show the loaded case
        const container = document.getElementById("appContainer");
        if (container) {
          render(container);
        }

        console.log("[Main] Shared case loaded successfully");
      } catch (error) {
        console.error("[Main] Failed to load shared case:", error);
        // Show error message
        const container = document.getElementById("appContainer");
        if (container) {
          container.innerHTML = `
            <div class="container" style="text-align: center; padding: 40px;">
              <h2>⚠️ Case Not Found</h2>
              <p>The requested shared case could not be loaded. It may have expired or been deleted.</p>
              <button onclick="window.location.href='https://igfap.eu/0825/'" class="primary">
                🏠 Return to App
              </button>
            </div>
          `;
        }
        return; // Don't continue with normal initialization
      }
    }

    // Check for kiosk mode and load case data if needed
    const kioskMode = detectKioskMode();
    if (kioskMode.isKioskMode) {
      console.log("[Main] Kiosk mode detected - loading case:", kioskMode.caseId);
      try {
        await loadKioskCase(kioskMode.caseId);
        // Re-render to show the loaded case
        const container = document.getElementById("appContainer");
        if (container) {
          render(container);
        }
      } catch (error) {
        console.error("[Main] Failed to load kiosk case:", error);
        // Show error message
        const container = document.getElementById("appContainer");
        if (container) {
          container.innerHTML = `
            <div class="container" style="text-align: center; padding: 40px;">
              <h2>⚠️ Case Not Found</h2>
              <p>The requested case could not be loaded.</p>
              <button onclick="window.location.href='https://igfap.eu/kiosk/'" class="primary">
                🏠 Return to Case List
              </button>
            </div>
          `;
        }
        return; // Don't continue with normal initialization
      }
    }

    // Initialize kiosk integration handlers
    initializeKioskHandlers();

    // Initialize share link handlers
    initializeShareHandlers();

    // Application started successfully
    const event = new CustomEvent("appReady", {
      detail: {
        timestamp: new Date().toISOString(),
        version: "2.1.0",
      },
    });
    document.dispatchEvent(event);
  } catch (error) {
    // Main initialization failed - already handled by handleInitializationFailure
  }
}

/**
 * Start the application when DOM is ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}

/**
 * Export for debugging and testing
 */
if (typeof window !== "undefined") {
  window.iGFAPApp = {
    getApp: () => app,
    getStatus: () => app?.getStatus() || { error: "App not initialized" },
    restart: async () => {
      if (app) {
        app.destroy();
      }
      return initializeApplication();
    },
    // Debug helpers
    getCurrentScreen: () => {
      try {
        return store.getState().currentScreen;
      } catch {
        return "unknown";
      }
    },
    forceResults: () => {
      try {
        store.navigate("results");
        const container = document.getElementById("appContainer");
        if (container) {
          render(container);
        }
        return true;
      } catch {
        return false;
      }
    },
  };
}

/**
 * Export for module systems
 */
export { app, initializeApplication, handleInitializationFailure };
