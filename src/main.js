import { store } from './state/store.js';
import { render } from './ui/render.js';
import { APP_CONFIG } from './config.js';

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

    // Setup global event listeners
    this.setupGlobalEventListeners();

    // Initialize theme
    this.initializeTheme();

    // Start auto-save
    this.startAutoSave();

    // Setup session timeout
    this.setupSessionTimeout();

    // Set current year in footer
    this.setCurrentYear();

    // Initial render
    render(this.container);

    console.log('Stroke Triage Assistant initialized');
  }

  setupGlobalEventListeners() {
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
        store.setFormData(module, data);
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