import { store } from './state/store.js';
import { render } from './ui/render.js';
import { APP_CONFIG } from './config.js';
import { i18n, t } from './localization/i18n.js';
import { warmUpFunctions } from './api/client.js';
import { setResearchMode, isResearchModeEnabled } from './research/data-logger.js';
import { authManager } from './auth/authentication.js';

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

    // Check authentication before proceeding
    if (!authManager.isValidSession()) {
      store.navigate('login');
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

    // Warm up Cloud Functions in background
    warmUpFunctions();

    // Initial render
    render(this.container);
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
        store.navigate('welcome');
        render(this.container);
      });
    }

    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.addEventListener('click', (e) => {
        const currentLang = e.currentTarget.dataset.lang || 'en';
        const newLang = currentLang === 'en' ? 'de' : 'en';
        i18n.setLanguage(newLang);
        e.currentTarget.dataset.lang = newLang;
        e.currentTarget.textContent = newLang === 'en' ? '🇬🇧' : '🇩🇪';
      });
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

    // Research mode toggle
    const researchToggle = document.getElementById('researchModeToggle');
    if (researchToggle) {
      researchToggle.addEventListener('click', () => {
        const newState = !isResearchModeEnabled();
        setResearchMode(newState);
        researchToggle.classList.toggle('active', newState);

        // Re-render if on results screen
        const state = store.getState();
        if (state.currentScreen === 'results') {
          render(this.container);
        }
      });
    }

    // Prevent double-tap zoom on mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });

    // Handle viewport resize
    this.handleViewportResize();
  }

  handleViewportResize() {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Update CSS variable for viewport height (handles mobile browser UI)
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize(); // Initial call
  }

  setupHelpModal() {
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const modalClose = helpModal?.querySelector('.modal-close');

    if (helpButton && helpModal) {
      helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        helpModal.setAttribute('aria-hidden', 'false');
      });

      modalClose?.addEventListener('click', () => {
        helpModal.style.display = 'none';
        helpModal.setAttribute('aria-hidden', 'true');
      });

      // Close on outside click
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
          helpModal.style.display = 'none';
          helpModal.setAttribute('aria-hidden', 'true');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpModal.style.display === 'flex') {
          helpModal.style.display = 'none';
          helpModal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  setupFooterLinks() {
    const privacyLink = document.getElementById('privacyLink');
    const disclaimerLink = document.getElementById('disclaimerLink');
    const versionLink = document.getElementById('versionLink');

    privacyLink?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Privacy Policy: This application stores data locally on your device. No personal information is transmitted to external servers without explicit consent.');
    });

    disclaimerLink?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols. Not a replacement for physician assessment.');
    });

    versionLink?.addEventListener('click', (e) => {
      e.preventDefault();
      alert(`Version: ${APP_CONFIG.VERSION}\nBuild: ${APP_CONFIG.BUILD_DATE}\nEnvironment: ${APP_CONFIG.ENVIRONMENT}`);
    });
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      darkModeToggle.setAttribute(
        'aria-label',
        savedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      );
    }
  }

  toggleDarkMode() {
    const currentTheme = document.body.dataset.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      darkModeToggle.setAttribute(
        'aria-label',
        newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      );
    }
  }

  initializeResearchMode() {
    const researchToggle = document.getElementById('researchModeToggle');
    if (researchToggle) {
      const isEnabled = isResearchModeEnabled();
      researchToggle.classList.toggle('active', isEnabled);

      // Show/hide based on current screen
      const state = store.getState();
      if (state.currentScreen === 'results' || state.currentScreen === 'comparison') {
        researchToggle.style.display = 'block';
      } else {
        researchToggle.style.display = 'none';
      }
    }
  }

  updateUILanguage() {
    // Update help modal content
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = t('help.title');
    }

    // Update any other static UI elements that need translation
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.setAttribute('aria-label', t('navigation.back'));
      backButton.setAttribute('title', t('navigation.back'));
    }

    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
      homeButton.setAttribute('aria-label', t('navigation.home'));
      homeButton.setAttribute('title', t('navigation.home'));
    }
  }

  startAutoSave() {
    // Auto-save state every 30 seconds if there are changes
    setInterval(() => {
      const state = store.getState();
      if (state.isDirty) {
        store.saveState();
      }
    }, 30000);
  }

  setupSessionTimeout() {
    let timeoutId;
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (authManager.isValidSession()) {
          authManager.clearSession();
          store.navigate('login');
          alert('Your session has expired. Please log in again.');
        }
      }, TIMEOUT_DURATION);
    };

    // Reset timeout on user activity
    ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach((event) => {
      document.addEventListener(event, resetTimeout, { passive: true });
    });

    resetTimeout(); // Initialize timeout
  }

  setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Initialize app when DOM is ready
const app = new App();
app.init();

// Cleanup on unload
window.addEventListener('unload', () => {
  app.destroy();
});

// Handle errors globally
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // You could send this to a logging service in production
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // You could send this to a logging service in production
});
