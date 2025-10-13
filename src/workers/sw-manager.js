/**
 * Service Worker Manager for Medical Application
 * iGFAP Stroke Triage Assistant - Phase 3 Advanced Features
 *
 * Manages service worker lifecycle and offline capabilities
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "../patterns/observer.js";
import {
  medicalPerformanceMonitor,
  PerformanceMetricType,
} from "../performance/medical-performance-monitor.js";
import { safeSetInnerHTML } from "../security/html-sanitizer.js";

// Bulletproof error handling utilities
import {
  safeAsync,
  MedicalError,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  MEDICAL_ERROR_CODES,
} from "../utils/error-handler.js";

/**
 * Service Worker Manager Class
 */
export class MedicalServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    this.isUpdateCheckEnabled = true;
    this.retryCount = 0;
    this.maxRetries = 3;

    // Initialize event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize service worker registration with bulletproof error handling
   */
  async initialize() {
    return safeAsync(
      async () => {
        if (!("serviceWorker" in navigator)) {
          throw new MedicalError(
            "Service Worker not supported in this browser",
            "SW_NOT_SUPPORTED",
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.MEDIUM
          ).withContext({ userAgent: navigator.userAgent });
        }

        const metricId = medicalPerformanceMonitor.startMeasurement(
          PerformanceMetricType.USER_INTERACTION,
          "service_worker_registration"
        );

        try {
          // Register service worker with timeout
          const registrationPromise = navigator.serviceWorker.register(
            "/0925/src/workers/medical-service-worker.js",
            {
              scope: "/0925/",
              updateViaCache: "none",
            }
          );

          this.registration = await Promise.race([
            registrationPromise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Service Worker registration timeout")), 30000)
            ),
          ]);

          if (!this.registration) {
            throw new MedicalError(
              "Service Worker registration returned null",
              "SW_REGISTRATION_NULL",
              ERROR_CATEGORIES.STORAGE,
              ERROR_SEVERITY.HIGH
            );
          }

          // ('🏥 Medical Service Worker registered successfully');

          // Setup components with error handling
          await Promise.allSettled([
            safeAsync(() => this.setupUpdateDetection(), null, {
              operation: "setup_update_detection",
            }),
            safeAsync(() => this.setupMessageHandler(), null, {
              operation: "setup_message_handler",
            }),
            safeAsync(() => this.checkForUpdates(), null, { operation: "initial_update_check" }),
          ]);

          medicalPerformanceMonitor.endMeasurement(metricId, { success: true });

          medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
            action: "sw_registered",
            scope: this.registration.scope,
          });

          return true;
        } catch (error) {
          medicalPerformanceMonitor.endMeasurement(metricId, {
            success: false,
            error: error.message,
          });

          throw error;
        }
      },
      error => {
        console.error("Service Worker initialization failed:", error.message);

        medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
          action: "sw_registration_failed",
          error: error.message,
          context: error.context || {},
        });

        return false;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        severity: ERROR_SEVERITY.MEDIUM,
        timeout: 35000,
        context: {
          operation: "service_worker_initialization",
        },
      }
    );
  }

  /**
   * Setup event listeners for online/offline detection
   */
  setupEventListeners() {
    // Online/offline detection
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.handleOnlineStatusChange(false);
    });

    // Page visibility for update checks
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isUpdateCheckEnabled) {
        this.checkForUpdates();
      }
    });

    // Periodic update checks
    setInterval(
      () => {
        if (this.isUpdateCheckEnabled && this.isOnline) {
          this.checkForUpdates();
        }
      },
      5 * 60 * 1000
    ); // Check every 5 minutes
  }

  /**
   * Setup service worker update detection
   */
  setupUpdateDetection() {
    if (!this.registration) {
      return;
    }

    // Listen for new service worker installing
    this.registration.addEventListener("updatefound", () => {
      const newWorker = this.registration.installing;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          // New update available
          this.updateAvailable = true;
          this.notifyUpdateAvailable();
        }
      });
    });

    // Listen for service worker taking control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }

  /**
   * Setup message handler for service worker communication
   */
  setupMessageHandler() {
    navigator.serviceWorker.addEventListener("message", event => {
      const { type, data } = event.data;

      switch (type) {
        case "SW_INSTALLED":
          this.handleServiceWorkerInstalled(data);
          break;

        case "SW_ACTIVATED":
          this.handleServiceWorkerActivated(data);
          break;

        case "SW_INSTALL_ERROR":
          this.handleServiceWorkerError(data);
          break;

        case "MEDICAL_DATA_SYNCED":
          this.handleMedicalDataSynced(data);
          break;

        default:
        // ('Unknown service worker message:', type, data);
      }
    });
  }

  /**
   * Handle online/offline status changes with error handling
   */
  handleOnlineStatusChange(isOnline) {
    safeAsync(
      async () => {
        // (`🌐 Network status: ${isOnline ? 'Online' : 'Offline'}`);

        medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
          action: "network_status_changed",
          isOnline,
          timestamp: new Date().toISOString(),
        });

        // Show user notification with error handling
        await safeAsync(() => this.showNetworkStatusNotification(isOnline), null, {
          operation: "show_network_notification",
        });

        // Trigger background sync when coming back online
        if (isOnline && "serviceWorker" in navigator && navigator.serviceWorker.controller) {
          await safeAsync(
            async () => {
              const registration = await navigator.serviceWorker.ready;
              if ("sync" in registration) {
                return registration.sync.register("medical-data-sync");
              }
            },
            error => {
              console.warn("Background sync registration failed:", error.message);
            },
            {
              operation: "background_sync_registration",
              timeout: 5000,
            }
          );
        }
      },
      error => {
        console.error("Error handling network status change:", error.message);
      },
      {
        operation: "handle_network_status_change",
        isOnline,
      }
    );
  }

  /**
   * Show network status notification to user with comprehensive error handling
   */
  showNetworkStatusNotification(isOnline) {
    return safeAsync(
      async () => {
        if (!document || !document.body) {
          throw new MedicalError(
            "Document not available for notification",
            "DOCUMENT_UNAVAILABLE",
            ERROR_CATEGORIES.RENDERING,
            ERROR_SEVERITY.LOW
          );
        }

        const notification = document.createElement("div");
        if (!notification) {
          throw new MedicalError(
            "Failed to create notification element",
            "ELEMENT_CREATION_FAILED",
            ERROR_CATEGORIES.RENDERING,
            ERROR_SEVERITY.LOW
          );
        }

        notification.className = `network-notification ${isOnline ? "online" : "offline"}`;

        try {
          safeSetInnerHTML(
            notification,
            `
            <div class="notification-content">
              <span class="notification-icon">${isOnline ? "🌐" : "📴"}</span>
              <span class="notification-text">
                ${isOnline ? "Connection restored" : "Working offline"}
              </span>
            </div>
          `
          );
        } catch (htmlError) {
          console.warn(
            "Network notification sanitization failed, using fallback:",
            htmlError.message
          );
          notification.textContent = isOnline ? "🌐 Connection restored" : "📴 Working offline";
        }

        // Check if body is still available before appending
        if (!document.body) {
          throw new MedicalError(
            "Document body not available when appending notification",
            "BODY_UNAVAILABLE",
            ERROR_CATEGORIES.RENDERING,
            ERROR_SEVERITY.LOW
          );
        }

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds with error handling
        setTimeout(() => {
          safeAsync(
            () => {
              if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            },
            null,
            { operation: "remove_notification" }
          );
        }, 3000);

        return notification;
      },
      error => {
        console.warn("Failed to show network status notification:", error.message);
        // Try simple fallback notification
        try {
          if (console && console.info) {
            console.info(`Network status: ${isOnline ? "Online" : "Offline"}`);
          }
        } catch (fallbackError) {
          // Even console failed, nothing more we can do
        }
        return null;
      },
      {
        operation: "show_network_notification",
        isOnline,
      }
    );
  }

  /**
   * Check for service worker updates with bulletproof error handling
   */
  async checkForUpdates() {
    return safeAsync(
      async () => {
        if (!this.registration) {
          throw new MedicalError(
            "No service worker registration available for update check",
            "NO_REGISTRATION",
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.LOW
          );
        }

        // Add timeout to update check
        const updatePromise = this.registration.update();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Update check timeout")), 10000)
        );

        await Promise.race([updatePromise, timeoutPromise]);

        // Reset retry count on successful update check
        this.retryCount = 0;

        return true;
      },
      error => {
        console.warn("Update check failed:", error.message);

        this.retryCount++;
        if (this.retryCount < this.maxRetries) {
          // Exponential backoff for retries
          const retryDelay = Math.min(5000 * 2 ** (this.retryCount - 1), 30000);

          setTimeout(() => {
            safeAsync(() => this.checkForUpdates(), null, {
              operation: "retry_update_check",
              retryCount: this.retryCount,
            });
          }, retryDelay);
        } else {
          console.error(`Update check failed after ${this.maxRetries} retries`);
          medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
            action: "sw_update_check_failed",
            retryCount: this.retryCount,
            error: error.message,
          });
        }

        return false;
      },
      {
        operation: "service_worker_update_check",
        retryCount: this.retryCount,
      }
    );
  }

  /**
   * Apply available update
   */
  async applyUpdate() {
    if (!this.updateAvailable || !this.registration) {
      return;
    }

    try {
      // Send message to service worker to skip waiting
      if (this.registration.waiting) {
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "sw_update_applied",
      });
    } catch (error) {
      // ('Failed to apply update:', error);
    }
  }

  /**
   * Notify user of available update
   */
  notifyUpdateAvailable() {
    // ('📱 App update available');

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "sw_update_available",
    });

    // Show update notification
    this.showUpdateNotification();
  }

  /**
   * Show update notification to user
   */
  showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "update-notification";
    try {
      safeSetInnerHTML(
        notification,
        `
        <div class="notification-content">
          <span class="notification-icon">🔄</span>
          <span class="notification-text">App update available</span>
          <button class="update-button" onclick="medicalSWManager.applyUpdate()">
            Update Now
          </button>
        </div>
      `
      );
    } catch (error) {
      console.error("Update notification sanitization failed:", error);
      // Safe fallback using textContent only
      notification.textContent = "🔄 App update available. Please refresh to update.";
    }

    document.body.appendChild(notification);
  }

  /**
   * Get cache status with timeout and error handling
   */
  async getCacheStatus() {
    return safeAsync(
      async () => {
        if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
          throw new MedicalError(
            "Service worker controller not available",
            "NO_SW_CONTROLLER",
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.LOW
          );
        }

        return new Promise((resolve, reject) => {
          const channel = new MessageChannel();
          const timeout = setTimeout(() => {
            reject(new Error("Cache status request timeout"));
          }, 5000);

          channel.port1.onmessage = event => {
            clearTimeout(timeout);
            try {
              // Validate response structure
              if (!event.data || typeof event.data !== "object") {
                throw new Error("Invalid cache status response format");
              }
              resolve(event.data);
            } catch (error) {
              reject(error);
            }
          };

          channel.port1.onerror = error => {
            clearTimeout(timeout);
            reject(new Error(`Message channel error: ${error.message || "Unknown error"}`));
          };

          try {
            navigator.serviceWorker.controller.postMessage({ type: "GET_CACHE_STATUS" }, [
              channel.port2,
            ]);
          } catch (postError) {
            clearTimeout(timeout);
            reject(new Error(`Failed to send cache status request: ${postError.message}`));
          }
        });
      },
      error => {
        console.warn("Failed to get cache status:", error.message);
        return {
          error: true,
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      },
      {
        operation: "get_cache_status",
      }
    );
  }

  /**
   * Clear all caches
   */
  async clearCaches() {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: "CLEAR_CACHE",
    });

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "sw_caches_cleared",
    });
  }

  /**
   * Prefetch resources for offline use
   */
  async prefetchResources(resources) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: "PREFETCH_RESOURCES",
      data: { resources },
    });
  }

  /**
   * Handle service worker installed event
   */
  handleServiceWorkerInstalled(data) {
    // ('✅ Service Worker installed:', data);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "sw_installed",
      cacheVersion: data.cacheVersion,
      criticalResourcesCount: data.criticalResourcesCount,
    });
  }

  /**
   * Handle service worker activated event
   */
  handleServiceWorkerActivated(data) {
    // ('🚀 Service Worker activated:', data);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "sw_activated",
      cacheVersion: data.cacheVersion,
      cleanedCaches: data.cleanedCaches,
    });
  }

  /**
   * Handle service worker error
   */
  handleServiceWorkerError(data) {
    // ('❌ Service Worker error:', data);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "sw_error",
      error: data.error,
    });
  }

  /**
   * Handle medical data sync completion
   */
  handleMedicalDataSynced(data) {
    // ('🔄 Medical data synced:', data);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "medical_data_synced",
      timestamp: data.timestamp,
    });
  }

  /**
   * Get offline capabilities status
   */
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      serviceWorkerActive: !!navigator.serviceWorker.controller,
      updateAvailable: this.updateAvailable,
      cacheStatus: this.registration ? "available" : "unavailable",
    };
  }

  /**
   * Enable/disable automatic update checks
   */
  setUpdateCheckEnabled(enabled) {
    this.isUpdateCheckEnabled = enabled;

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "sw_update_check_toggled",
      enabled,
    });
  }
}

/**
 * Install-time prompts for offline support
 */
export class OfflineInstallPrompt {
  constructor(swManager) {
    this.swManager = swManager;
    this.installPromptEvent = null;
    this.isInstallable = false;

    this.setupInstallPrompt();
  }

  /**
   * Setup PWA install prompt handling
   */
  setupInstallPrompt() {
    // Listen for install prompt
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      this.installPromptEvent = event;
      this.isInstallable = true;

      // ('📱 PWA install prompt available');

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "pwa_install_prompt_available",
      });

      // Show install banner after a delay
      setTimeout(() => {
        this.showInstallBanner();
      }, 2000);
    });

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      // ('📱 PWA installed successfully');

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "pwa_installed",
      });

      this.hideInstallBanner();
    });
  }

  /**
   * Show PWA install banner
   */
  showInstallBanner() {
    if (!this.isInstallable) {
      return;
    }

    const banner = document.createElement("div");
    banner.id = "install-banner";
    banner.className = "install-banner";

    // Create banner content manually to avoid HTML sanitization issues
    const bannerContent = document.createElement("div");
    bannerContent.className = "banner-content";

    const bannerText = document.createElement("div");
    bannerText.className = "banner-text";

    const title = document.createElement("strong");
    title.textContent = "Install Stroke Triage Assistant";

    const description = document.createElement("p");
    description.textContent = "Get offline access and faster performance";

    bannerText.appendChild(title);
    bannerText.appendChild(description);

    const bannerActions = document.createElement("div");
    bannerActions.className = "banner-actions";

    const installButton = document.createElement("button");
    installButton.className = "install-button";
    installButton.textContent = "Install";
    installButton.addEventListener("click", () => {
      this.promptInstall();
    });

    const dismissButton = document.createElement("button");
    dismissButton.className = "dismiss-button";
    dismissButton.textContent = "×";
    dismissButton.addEventListener("click", () => {
      this.hideInstallBanner();
    });

    bannerActions.appendChild(installButton);
    bannerActions.appendChild(dismissButton);

    bannerContent.appendChild(bannerText);
    bannerContent.appendChild(bannerActions);
    banner.appendChild(bannerContent);

    document.body.appendChild(banner);
  }

  /**
   * Hide install banner
   */
  hideInstallBanner() {
    const banner = document.getElementById("install-banner");
    if (banner) {
      banner.remove();
    }
  }

  /**
   * Prompt user to install PWA
   */
  async promptInstall() {
    if (!this.installPromptEvent) {
      return;
    }

    try {
      const result = await this.installPromptEvent.prompt();

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "pwa_install_prompted",
        outcome: result.outcome,
      });

      // Clear the install prompt
      this.installPromptEvent = null;
      this.isInstallable = false;

      // Hide banner
      this.hideInstallBanner();
    } catch (error) {
      // ('Install prompt failed:', error);
    }
  }
}

// Export singleton instances
export const medicalSWManager = new MedicalServiceWorkerManager();
export const offlineInstallPrompt = new OfflineInstallPrompt(medicalSWManager);

// Make available globally for inline event handlers
window.medicalSWManager = medicalSWManager;
window.offlineInstallPrompt = offlineInstallPrompt;
