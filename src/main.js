import { store } from './state/store.js';
import { render } from './ui/render.js';
import { APP_CONFIG } from './config.js';
import { i18n, t } from './localization/i18n.js';

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
    
    // Initialize language
    this.updateUILanguage();

    // Start auto-save
    this.startAutoSave();

    // Setup session timeout
    this.setupSessionTimeout();

    // Set current year in footer
    this.setCurrentYear();

    // Register PWA Service Worker
    this.registerServiceWorker();

    // Initial render
    render(this.container);

    console.log('Stroke Triage Assistant initialized');
  }

  setupGlobalEventListeners() {
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
      helpButton.addEventListener('click', () => {
        helpModal.classList.add('show');
        helpModal.setAttribute('aria-hidden', 'false');
      });
      
      modalClose?.addEventListener('click', () => {
        helpModal.classList.remove('show');
        helpModal.setAttribute('aria-hidden', 'true');
      });
      
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
          helpModal.classList.remove('show');
          helpModal.setAttribute('aria-hidden', 'true');
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
    // Show a subtle notification that an update is available
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      font-size: 0.9rem;
      max-width: 300px;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    notification.textContent = 'App update available - Tap to refresh';
    
    notification.addEventListener('click', () => {
      window.location.reload();
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
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