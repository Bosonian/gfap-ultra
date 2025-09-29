/**
 * Session Management System
 * iGFAP Stroke Triage Assistant - Session & Data Persistence
 *
 * Handles session management, auto-save, and data persistence
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { store } from '../state/store.js';
import { APP_CONFIG } from '../config.js';
import { authManager } from '../auth/authentication.js';
import { safeAsync, ERROR_CATEGORIES, ERROR_SEVERITY } from '../utils/error-handler.js';
import { secureStore, secureRetrieve, secureRemove } from '../security/data-encryption.js';
import { medicalLogger, LOG_CATEGORIES } from '../utils/medical-logger.js';

/**
 * Manages session lifecycle and data persistence
 */
export class SessionManager {
  constructor() {
    this.autoSaveInterval = null;
    this.sessionCheckInterval = null;
    this.isInitialized = false;
    this.lastAutoSave = 0;
  }

  /**
   * Initialize session management
   */
  initialize() {
    this.validateStoredSession();
    this.startAutoSave();
    this.setupSessionTimeout();
    this.setupSessionValidation();
    this.isInitialized = true;
  }

  /**
   * Validate stored session data
   */
  async validateStoredSession() {
    return safeAsync(
      async () => {
        if (!authManager.isValidSession()) {
          // Session invalid - clear any stored data
          this.clearSessionData();
          return false;
        }

        // Session valid - restore any saved form data
        this.restoreFormData();
        return true;
      },
      (error) => {
        // Session validation failed - clear data for safety
        this.clearSessionData();
        return false;
      },
      {
        category: ERROR_CATEGORIES.AUTHENTICATION,
        severity: ERROR_SEVERITY.MEDIUM,
        context: { operation: 'validate_stored_session' },
      },
    );
  }

  /**
   * Start auto-save functionality
   */
  startAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      this.performAutoSave();
    }, APP_CONFIG.autoSaveInterval);
  }

  /**
   * Perform auto-save of current form data
   */
  async performAutoSave() {
    return safeAsync(
      async () => {
        const container = document.getElementById('appContainer');
        if (!container) {
          return false;
        }

        const forms = container.querySelectorAll('form[data-module]');
        let savedCount = 0;

        for (const form of forms) {
          try {
            const { module } = form.dataset;
            if (module) {
              const formData = this.extractFormData(form);
              const hasChanges = this.hasFormDataChanged(module, formData);

              if (hasChanges) {
                store.setFormData(module, formData);
                savedCount++;
              }
            }
          } catch (error) {
            // Continue with other forms if one fails
          }
        }

        this.lastAutoSave = Date.now();
        return savedCount > 0;
      },
      (error) =>
        // Auto-save failure is non-critical
        false,
      {
        category: ERROR_CATEGORIES.STORAGE,
        severity: ERROR_SEVERITY.LOW,
        context: { operation: 'auto_save' },
      },
    );
  }

  /**
   * Extract form data safely
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} - Form data object
   */
  extractFormData(form) {
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      const element = form.elements[key];
      if (element) {
        if (element.type === 'checkbox') {
          data[key] = element.checked;
        } else if (element.type === 'number') {
          const numValue = parseFloat(value);
          data[key] = isNaN(numValue) ? value : numValue;
        } else {
          data[key] = value;
        }
      }
    });

    return data;
  }

  /**
   * Check if form data has changed
   * @param {string} module - Module name
   * @param {Object} newData - New form data
   * @returns {boolean} - True if data has changed
   */
  hasFormDataChanged(module, newData) {
    try {
      const currentData = store.getFormData(module);
      return JSON.stringify(currentData) !== JSON.stringify(newData);
    } catch (error) {
      // If comparison fails, assume data has changed
      return true;
    }
  }

  /**
   * Restore saved form data
   */
  restoreFormData() {
    safeAsync(
      async () => {
        const container = document.getElementById('appContainer');
        if (!container) {
          return;
        }

        const forms = container.querySelectorAll('form[data-module]');

        forms.forEach((form) => {
          try {
            const { module } = form.dataset;
            if (module) {
              const savedData = store.getFormData(module);
              if (savedData && Object.keys(savedData).length > 0) {
                this.populateForm(form, savedData);
              }
            }
          } catch (error) {
            // Continue with other forms if one fails
          }
        });
      },
      (error) => {
        // Form restoration failure is non-critical
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'restore_form_data' },
      },
    );
  }

  /**
   * Populate form with saved data
   * @param {HTMLFormElement} form - Form to populate
   * @param {Object} data - Data to populate with
   */
  populateForm(form, data) {
    Object.entries(data).forEach(([key, value]) => {
      const element = form.elements[key];
      if (element) {
        try {
          if (element.type === 'checkbox') {
            element.checked = Boolean(value);
          } else if (element.type === 'radio') {
            if (element.value === value) {
              element.checked = true;
            }
          } else {
            element.value = value;
          }

          // Trigger input event for any listeners
          element.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (error) {
          // Skip this field if population fails
        }
      }
    });
  }

  /**
   * Setup session timeout monitoring
   */
  setupSessionTimeout() {
    // Setup session timeout warning
    setTimeout(() => {
      this.showSessionTimeoutWarning();
    }, APP_CONFIG.sessionTimeout - 60000); // Warn 1 minute before timeout
  }

  /**
   * Setup periodic session validation
   */
  setupSessionValidation() {
    // Check session validity every 5 minutes
    this.sessionCheckInterval = setInterval(() => {
      this.validateCurrentSession();
    }, 5 * 60 * 1000);
  }

  /**
   * Validate current session
   */
  async validateCurrentSession() {
    return safeAsync(
      async () => {
        if (!authManager.isValidSession()) {
          this.handleSessionExpiry();
          return false;
        }

        // Optionally validate with server
        const isValid = await authManager.validateSessionWithServer();
        if (!isValid) {
          this.handleSessionExpiry();
          return false;
        }

        return true;
      },
      (error) =>
        // Session validation failed - continue with local session
        authManager.isValidSession(),
      {
        category: ERROR_CATEGORIES.AUTHENTICATION,
        context: { operation: 'validate_current_session' },
      },
    );
  }

  /**
   * Show session timeout warning
   */
  showSessionTimeoutWarning() {
    safeAsync(
      async () => {
        const shouldContinue = confirm(
          'Your session will expire in 1 minute. Would you like to continue?',
        );

        if (shouldContinue) {
          // Extend session
          authManager.updateActivity();
          // Setup another timeout warning
          this.setupSessionTimeout();
        } else {
          // User chose to end session
          this.endSession();
        }
      },
      (error) => {
        // If warning fails, continue session
      },
      {
        category: ERROR_CATEGORIES.AUTHENTICATION,
        context: { operation: 'session_timeout_warning' },
      },
    );
  }

  /**
   * Handle session expiry
   */
  handleSessionExpiry() {
    this.clearSessionData();
    store.navigate('login');

    // Show expiry message
    this.showSessionExpiredMessage();
  }

  /**
   * Show session expired message
   */
  showSessionExpiredMessage() {
    // Create a temporary message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff9800;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    message.textContent = '⏰ Session expired. Please log in again.';

    document.body.appendChild(message);

    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 5000);
  }

  /**
   * End session manually
   */
  endSession() {
    authManager.logout();
    this.clearSessionData();
    store.reset();
    store.navigate('login');
  }

  /**
   * Clear all session data
   */
  async clearSessionData() {
    try {
      medicalLogger.info('Clearing session data', {
        category: LOG_CATEGORIES.SECURITY,
      });

      // Clear form data from store
      store.clearAllFormData();

      // Clear encrypted temporary data
      await secureRemove('temp_data', true); // Use sessionStorage
      await secureRemove('research_data', true);

      // Clear any legacy unencrypted data
      sessionStorage.removeItem('temp_data');
      sessionStorage.removeItem('research_data');

      medicalLogger.info('Session data cleared successfully', {
        category: LOG_CATEGORIES.SECURITY,
      });
    } catch (error) {
      medicalLogger.warn('Failed to clear some session data', {
        category: LOG_CATEGORIES.SECURITY,
        error: error.message,
      });
    }
  }

  /**
   * Force save current state
   */
  async forceSave() {
    return this.performAutoSave();
  }

  /**
   * Get session status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isAuthenticated: authManager.isValidSession(),
      lastAutoSave: this.lastAutoSave,
      autoSaveActive: !!this.autoSaveInterval,
      sessionCheckActive: !!this.sessionCheckInterval,
      sessionInfo: authManager.getSessionInfo?.() || {},
    };
  }

  /**
   * Cleanup when destroyed
   */
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }

    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }

    this.isInitialized = false;
  }
}
