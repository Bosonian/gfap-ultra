/**
 * UI Management System
 * iGFAP Stroke Triage Assistant - UI Coordination
 *
 * Handles all UI interactions, event listeners, and component management
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { store } from '../state/store.js';
import { i18n, t } from '../localization/i18n.js';
import { safeAsync, ERROR_CATEGORIES } from '../utils/error-handler.js';
import { safeSetInnerHTML } from '../security/html-sanitizer.js';
import { render } from '../ui/render.js';

/**
 * Manages all UI interactions and components
 */
export class UIManager {
  constructor() {
    this.container = null;
    this.eventListeners = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize UI management system
   * @param {HTMLElement} container - Main app container
   */
  initialize(container) {
    this.container = container;
    this.setupGlobalEventListeners();
    this.setupHelpModal();
    this.setupFooterLinks();
    this.initializeApiModeToggle();
    this.initializeResearchMode();
    this.setCurrentYear();
    this.isInitialized = true;
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    this.addEventListenerSafe('backButton', 'click', () => {
      store.goBack();
      render(this.container);
    });

    this.addEventListenerSafe('homeButton', 'click', () => {
      store.goHome();
      render(this.container);
    });

    this.addEventListenerSafe('languageToggle', 'click', () => {
      this.toggleLanguage();
    });

    this.addEventListenerSafe('darkModeToggle', 'click', () => {
      this.toggleDarkMode();
    });

    this.addEventListenerSafe('apiModeToggle', 'click', (e) => {
      e.preventDefault();
      this.toggleApiMode();
    });

    this.addEventListenerSafe('researchModeToggle', 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleResearchMode();
    });

    // Keyboard navigation
    this.addGlobalEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal('helpModal');
      }
    });

    // Before unload warning
    this.addGlobalEventListener('beforeunload', (e) => {
      if (store.hasUnsavedData()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved data. Are you sure you want to leave?';
      }
    });
  }

  /**
   * Initialize API mode toggle (Mock vs API)
   */
  initializeApiModeToggle() {
    const btn = document.getElementById('apiModeToggle');
    if (!btn) return;

    // Default to mock on localhost preview; API in other cases
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
    const stored = localStorage.getItem('use_mock_api');
    if (stored === null && isLocal && !(import.meta && import.meta.env && import.meta.env.DEV)) {
      localStorage.setItem('use_mock_api', 'true');
    }
    this.updateApiModeButton();
  }

  /** Toggle API mode and update UI */
  toggleApiMode() {
    const current = localStorage.getItem('use_mock_api');
    const next = current === 'true' ? 'false' : 'true';
    localStorage.setItem('use_mock_api', next);
    this.updateApiModeButton();

    // Announce change for a11y
    try {
      const sr = document.createElement('div');
      sr.className = 'sr-only';
      sr.setAttribute('role', 'status');
      sr.setAttribute('aria-live', 'polite');
      sr.textContent = next === 'true' ? 'Mock data enabled' : 'Live API enabled';
      document.body.appendChild(sr);
      setTimeout(() => sr.remove(), 1200);
    } catch {}
  }

  /** Update the button label/title for API mode */
  updateApiModeButton() {
    const btn = document.getElementById('apiModeToggle');
    if (!btn) return;
    const useMock = localStorage.getItem('use_mock_api') !== 'false';
    if (useMock) {
      btn.textContent = '🧪';
      btn.title = 'Mock data: ON (click to use API)';
      btn.setAttribute('aria-label', 'Mock data enabled');
    } else {
      btn.textContent = '☁️';
      btn.title = 'Live API: ON (click to use mock)';
      btn.setAttribute('aria-label', 'Live API enabled');
    }
  }

  /**
   * Safely add event listener to element
   * @param {string} elementId - Element ID
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  addEventListenerSafe(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      const wrappedHandler = (e) => {
        try {
          handler(e);
        } catch (error) {
          this.handleUIError(error, `${elementId}_${event}`);
        }
      };

      element.addEventListener(event, wrappedHandler);
      this.eventListeners.set(`${elementId}_${event}`, { element, handler: wrappedHandler });
    }
  }

  /**
   * Add global event listener
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  addGlobalEventListener(event, handler) {
    const wrappedHandler = (e) => {
      try {
        handler(e);
      } catch (error) {
        this.handleUIError(error, `global_${event}`);
      }
    };

    if (event === 'keydown' || event === 'beforeunload') {
      const target = event === 'beforeunload' ? window : document;
      target.addEventListener(event, wrappedHandler);
      this.eventListeners.set(`global_${event}`, { element: target, handler: wrappedHandler });
    }
  }

  /**
   * Setup help modal functionality
   */
  setupHelpModal() {
    safeAsync(
      async () => {
        const helpButton = document.getElementById('helpButton');
        const helpModal = document.getElementById('helpModal');
        const modalClose = helpModal?.querySelector('.modal-close');

        if (helpButton && helpModal) {
          // Ensure modal starts hidden
          this.closeModal('helpModal');

          this.addEventListenerSafe('helpButton', 'click', () => {
            this.openModal('helpModal');
          });

          if (modalClose) {
            modalClose.addEventListener('click', () => {
              this.closeModal('helpModal');
            });
          }

          helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
              this.closeModal('helpModal');
            }
          });
        }
      },
      (error) => {
        // Help modal setup is non-critical
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'help_modal_setup' }
      }
    );
  }

  /**
   * Setup footer links
   */
  setupFooterLinks() {
    this.addEventListenerSafe('privacyLink', 'click', (e) => {
      e.preventDefault();
      this.showPrivacyPolicy();
    });

    this.addEventListenerSafe('disclaimerLink', 'click', (e) => {
      e.preventDefault();
      this.showDisclaimer();
    });
  }

  /**
   * Toggle language
   */
  toggleLanguage() {
    safeAsync(
      async () => {
        i18n.toggleLanguage();
        this.updateLanguage();
      },
      (error) => {
        // Language toggle failure is non-critical
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'language_toggle' }
      }
    );
  }

  /**
   * Update UI language
   */
  updateLanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = i18n.getCurrentLanguage();

    // Update header elements
    this.updateElementText('.app-header h1', t('appTitle'));
    this.updateElementText('.emergency-badge', t('emergencyBadge'));

    // Update button tooltips and aria-labels
    this.updateButtonAttributes('languageToggle', t('languageToggle'));
    this.updateButtonAttributes('helpButton', t('helpButton'));
    this.updateButtonAttributes('darkModeToggle', t('darkModeButton'));

    // Update help modal
    this.updateElementText('#modalTitle', t('helpTitle'));

    // Update language toggle icon
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      const currentLang = i18n.getCurrentLanguage();
      languageToggle.textContent = currentLang === 'en' ? '🇬🇧' : '🇩🇪';
      languageToggle.dataset.lang = currentLang;
    }
  }

  /**
   * Update element text safely
   * @param {string} selector - Element selector
   * @param {string} text - New text content
   */
  updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (element && text) {
      element.textContent = text;
    }
  }

  /**
   * Update button attributes safely
   * @param {string} elementId - Button element ID
   * @param {string} text - Tooltip text
   */
  updateButtonAttributes(elementId, text) {
    const element = document.getElementById(elementId);
    if (element && text) {
      element.title = text;
      element.setAttribute('aria-label', text);
    }
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    if (darkModeToggle) {
      darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  /**
   * Research mode management
   */
  initializeResearchMode() {
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      this.updateResearchMode();
    }
  }

  /**
   * Update research mode visibility
   */
  updateResearchMode() {
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      const currentModule = this.getCurrentModuleFromResults();
      const shouldShow = currentModule === 'limited' || currentModule === 'full';

      researchModeToggle.style.display = shouldShow ? 'flex' : 'none';
      researchModeToggle.style.opacity = shouldShow ? '1' : '0.5';
    }
  }

  /**
   * Get current module from results
   */
  getCurrentModuleFromResults() {
    const state = store.getState();
    if (state.currentScreen !== 'results' || !state.results?.ich?.module) {
      return null;
    }

    const module = state.results.ich.module.toLowerCase();
    if (module.includes('coma')) return 'coma';
    if (module.includes('limited')) return 'limited';
    if (module.includes('full')) return 'full';
    return null;
  }

  /**
   * Toggle research mode
   */
  toggleResearchMode() {
    const researchPanel = document.getElementById('researchPanel');
    if (!researchPanel) {
      return;
    }

    const isVisible = researchPanel.style.display !== 'none';
    researchPanel.style.display = isVisible ? 'none' : 'block';

    // Update button visual state
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      researchModeToggle.style.background = isVisible
        ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 102, 204, 0.2)';
    }

    return false;
  }

  /**
   * Show research activation message
   */
  showResearchActivationMessage() {
    safeAsync(
      async () => {
        const message = document.createElement('div');
        message.className = 'research-activation-toast';

        try {
          safeSetInnerHTML(message, `
            <div class="toast-content">
              🔬 <strong>Research Mode Activated</strong><br>
              <small>Model comparison features enabled</small>
            </div>
          `);
        } catch (error) {
          message.textContent = '🔬 Research Mode Activated - Model comparison features enabled';
        }

        document.body.appendChild(message);

        setTimeout(() => {
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
        }, 3000);
      },
      (error) => {
        // Research message failure is non-critical
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'research_activation_message' }
      }
    );
  }

  /**
   * Open modal safely
   * @param {string} modalId - Modal element ID
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Close modal safely
   * @param {string} modalId - Modal element ID
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Show privacy policy
   */
  showPrivacyPolicy() {
    alert('Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.');
  }

  /**
   * Show disclaimer
   */
  showDisclaimer() {
    alert('Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.');
  }

  /**
   * Set current year in footer
   */
  setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Handle UI errors gracefully
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  handleUIError(error, context) {
    // Log error without crashing the UI
    try {
      const errorEvent = new CustomEvent('uiError', {
        detail: { error, context, timestamp: Date.now() }
      });
      document.dispatchEvent(errorEvent);
    } catch (e) {
      // Even error reporting failed - continue silently
    }
  }

  /**
   * Preload critical UI components
   */
  async preloadCriticalComponents() {
    return safeAsync(
      async () => {
        // Preload critical UI elements and validate they exist
        const criticalElements = [
          'appContainer',
          'helpModal',
          'languageToggle',
          'darkModeToggle'
        ];

        const missingElements = criticalElements.filter(id => !document.getElementById(id));

        if (missingElements.length > 0) {
          throw new Error(`Missing critical UI elements: ${missingElements.join(', ')}`);
        }

        return true;
      },
      (error) => {
        return false;
      },
      {
        category: ERROR_CATEGORIES.RENDERING,
        context: { operation: 'preload_critical_components' }
      }
    );
  }

  /**
   * Get UI manager status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasContainer: !!this.container,
      eventListenersCount: this.eventListeners.size,
      currentLanguage: i18n.getCurrentLanguage(),
      isDarkMode: document.body.classList.contains('dark-mode')
    };
  }

  /**
   * Cleanup when destroyed
   */
  destroy() {
    // Remove all event listeners
    this.eventListeners.forEach(({ element, handler }, key) => {
      const [, event] = key.split('_');
      if (element && handler) {
        element.removeEventListener(event, handler);
      }
    });

    this.eventListeners.clear();
    this.container = null;
    this.isInitialized = false;
  }
}
