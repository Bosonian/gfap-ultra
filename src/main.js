import { store } from './state/store.js';
import { render } from './ui/render.js';
import { APP_CONFIG } from './config.js';
import { i18n, t } from './localization/i18n.js';
import { warmUpFunctions } from './api/client.js';
import { setResearchMode, isResearchModeEnabled } from './research/data-logger.js';

class App {
  constructor() {
    this.container = null;
    this.unsubscribe = null;
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
      return;
    }

    this.container = document.getElementById('appContainer');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      render(this.container);
      // Update research button visibility after each render
      setTimeout(() => this.initializeResearchMode(), 200);
    });

    // Subscribe to language changes
    window.addEventListener('languageChanged', () => {
      this.updateUILanguage();
      render(this.container);
    });

    // Setup global event listeners
    this.setupGlobalEventListeners();

    // Initialize theme
    this.initializeTheme();
    
    // Initialize research mode
    this.initializeResearchMode();
    
    // Initialize language
    this.updateUILanguage();

    // Start auto-save
    this.startAutoSave();

    // Setup session timeout
    this.setupSessionTimeout();

    // Set current year in footer
    this.setCurrentYear();

    // Register PWA Service Worker with forced update
    this.registerServiceWorker();
    
    // Warm up Cloud Functions in background
    warmUpFunctions();

    // Initial render
    render(this.container);

    console.log('iGFAP Stroke Triage Assistant initialized');
  }

  setupGlobalEventListeners() {
    // Navigation buttons
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.addEventListener('click', () => {
        store.goBack();
        render(this.container);
      });
    }
    
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        store.goHome();
        render(this.container);
      });
    }

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.addEventListener('click', () => this.toggleLanguage());
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }

    // Research mode toggle
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      researchModeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleResearchMode();
      });
    }

    // Help modal
    this.setupHelpModal();

    // Footer links
    this.setupFooterLinks();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const helpModal = document.getElementById('helpModal');
        if (helpModal && helpModal.classList.contains('show')) {
          helpModal.classList.remove('show');
          helpModal.style.display = 'none';
          helpModal.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // Before unload warning
    window.addEventListener('beforeunload', (e) => {
      if (store.hasUnsavedData()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved data. Are you sure you want to leave?';
      }
    });
  }

  setupHelpModal() {
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const modalClose = helpModal?.querySelector('.modal-close');

    if (helpButton && helpModal) {
      // Ensure modal starts hidden
      helpModal.classList.remove('show');
      helpModal.style.display = 'none';
      helpModal.setAttribute('aria-hidden', 'true');

      helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        helpModal.classList.add('show');
        helpModal.setAttribute('aria-hidden', 'false');
      });
      
      const closeModal = () => {
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
        helpModal.setAttribute('aria-hidden', 'true');
      };
      
      modalClose?.addEventListener('click', closeModal);
      
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
          closeModal();
        }
      });
    }
  }

  setupFooterLinks() {
    document.getElementById('privacyLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showPrivacyPolicy();
    });
    
    document.getElementById('disclaimerLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showDisclaimer();
    });
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
      if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
  }

  toggleLanguage() {
    i18n.toggleLanguage();
    this.updateUILanguage();
    
    // Update flag icon
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      const currentLang = i18n.getCurrentLanguage();
      languageToggle.textContent = currentLang === 'en' ? '🇬🇧' : '🇩🇪';
      languageToggle.dataset.lang = currentLang;
    }
  }

  updateUILanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = i18n.getCurrentLanguage();
    
    // Update header text
    const headerTitle = document.querySelector('.app-header h1');
    if (headerTitle) {
      headerTitle.textContent = t('appTitle');
    }
    
    const emergencyBadge = document.querySelector('.emergency-badge');
    if (emergencyBadge) {
      emergencyBadge.textContent = t('emergencyBadge');
    }
    
    // Update button tooltips
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.title = t('languageToggle');
      languageToggle.setAttribute('aria-label', t('languageToggle'));
    }
    
    const helpButton = document.getElementById('helpButton');
    if (helpButton) {
      helpButton.title = t('helpButton');
      helpButton.setAttribute('aria-label', t('helpButton'));
    }
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.title = t('darkModeButton');
      darkModeToggle.setAttribute('aria-label', t('darkModeButton'));
    }
    
    // Update help modal
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = t('helpTitle');
    }
    
    // Note: Stroke center map initialization is handled in render.js
  }

  toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (darkModeToggle) {
      darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  initializeResearchMode() {
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      // Check if we're on results screen with stroke module
      const currentModule = this.getCurrentModuleFromResults();
      const shouldShow = currentModule === 'limited' || currentModule === 'full';
      
      researchModeToggle.style.display = shouldShow ? 'flex' : 'none';
      researchModeToggle.style.opacity = shouldShow ? '1' : '0.5';
      
      console.log(`🔬 Research button visibility: ${shouldShow ? 'VISIBLE' : 'HIDDEN'} (module: ${currentModule})`);
    }
  }

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

  toggleResearchMode() {
    // Simply toggle the research panel visibility without affecting app state
    const researchPanel = document.getElementById('researchPanel');
    if (!researchPanel) {
      console.warn('🔬 Research panel not found - likely not on results screen');
      return;
    }
    
    const isVisible = researchPanel.style.display !== 'none';
    researchPanel.style.display = isVisible ? 'none' : 'block';
    
    // Update button visual state
    const researchModeToggle = document.getElementById('researchModeToggle');
    if (researchModeToggle) {
      researchModeToggle.style.background = isVisible ? 
        'rgba(255, 255, 255, 0.1)' : 'rgba(0, 102, 204, 0.2)';
    }
    
    console.log(`🔬 Research panel ${isVisible ? 'HIDDEN' : 'SHOWN'}`);
    
    // DO NOT trigger any navigation or state changes
    return false;
  }

  showResearchActivationMessage() {
    const message = document.createElement('div');
    message.className = 'research-activation-toast';
    message.innerHTML = `
      <div class="toast-content">
        🔬 <strong>Research Mode Activated</strong><br>
        <small>Model comparison features enabled</small>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 3000);
  }

  startAutoSave() {
    setInterval(() => {
      this.saveCurrentFormData();
    }, APP_CONFIG.autoSaveInterval);
  }

  saveCurrentFormData() {
    const forms = this.container.querySelectorAll('form[data-module]');
    forms.forEach(form => {
      const formData = new FormData(form);
      const module = form.dataset.module;
      if (module) {
        const data = {};
        formData.forEach((value, key) => {
          const element = form.elements[key];
          if (element && element.type === 'checkbox') {
            data[key] = element.checked;
          } else {
            data[key] = value;
          }
        });
        
        // Only save if data has actually changed to prevent unnecessary re-renders
        const currentData = store.getFormData(module);
        const hasChanges = JSON.stringify(currentData) !== JSON.stringify(data);
        if (hasChanges) {
          store.setFormData(module, data);
        }
      }
    });
  }

  setupSessionTimeout() {
    setTimeout(() => {
      if (confirm('Your session has been idle for 30 minutes. Would you like to continue?')) {
        this.setupSessionTimeout();
      } else {
        store.reset();
      }
    }, APP_CONFIG.sessionTimeout);
  }

  setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  showPrivacyPolicy() {
    alert('Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.');
  }

  showDisclaimer() {
    alert('Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.');
  }

  async registerServiceWorker() {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/0825/sw.js', {
        scope: '/0825/'
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('New service worker found');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker installed, update available');
            // Could show update notification here
            this.showUpdateNotification();
          }
        });
      });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from service worker:', event.data);
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  showUpdateNotification() {
    // Create modal dialog for update notification
    const modal = document.createElement('div');
    modal.className = 'modal show update-modal';
    modal.style.cssText = `
      display: flex;
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
      align-items: center;
      justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
      background-color: var(--container-bg);
      padding: 30px;
      border-radius: 16px;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: slideUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 3rem; margin-bottom: 16px;">🔄</div>
        <h3 style="margin: 0 0 12px 0; color: var(--text-color);">Update Available</h3>
        <p style="color: var(--text-secondary); margin: 0 0 24px 0; line-height: 1.5;">
          A new version with improvements is ready to install.
        </p>
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="updateNow" class="primary" style="flex: 1; max-width: 140px;">
          Refresh Now
        </button>
        <button id="updateLater" class="secondary" style="flex: 1; max-width: 140px;">
          Later
        </button>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Handle buttons
    const updateNow = modal.querySelector('#updateNow');
    const updateLater = modal.querySelector('#updateLater');
    
    updateNow.addEventListener('click', () => {
      window.location.reload();
    });
    
    updateLater.addEventListener('click', () => {
      modal.remove();
      // Show again in 5 minutes
      setTimeout(() => this.showUpdateNotification(), 5 * 60 * 1000);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        updateLater.click();
      }
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Initialize the application
const app = new App();
app.init();

// Export for potential testing or debugging
export default app;