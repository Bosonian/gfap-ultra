/**
 * Theme Management System
 * iGFAP Stroke Triage Assistant - Theme & Styling Coordination
 *
 * Handles theme switching, dark mode, and styling preferences
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { safeAsync, ERROR_CATEGORIES } from '../utils/error-handler.js';

/**
 * Manages application themes and styling
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.isInitialized = false;
    this.storageKey = 'theme';
  }

  /**
   * Initialize theme management
   */
  initialize() {
    this.loadSavedTheme();
    this.setupThemeDetection();
    this.isInitialized = true;
  }

  /**
   * Load saved theme from storage
   */
  async loadSavedTheme() {
    return safeAsync(
      async () => {
        const savedTheme = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Determine theme to use
        let themeToApply;
        if (savedTheme === 'dark' || savedTheme === 'light') {
          themeToApply = savedTheme;
        } else if (prefersDark) {
          themeToApply = 'dark';
        } else {
          themeToApply = 'light';
        }

        this.applyTheme(themeToApply);
        this.updateThemeButton();

        return themeToApply;
      },
      (error) => {
        // Fallback to light theme
        this.applyTheme('light');
        this.updateThemeButton();
        return 'light';
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'load_saved_theme' },
      },
    );
  }

  /**
   * Setup system theme detection
   */
  setupThemeDetection() {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const savedTheme = localStorage.getItem(this.storageKey);
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateThemeButton();
      }
    };

    // Use the newer addEventListener if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  /**
   * Apply theme to the application
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  applyTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'light';
    }

    this.currentTheme = theme;

    // Apply theme class to body
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);

    // Dispatch theme change event
    this.dispatchThemeChangeEvent(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   * @param {string} theme - Theme to set
   */
  setTheme(theme) {
    return safeAsync(
      async () => {
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateThemeButton();
        return theme;
      },
      (error) =>
        // Theme setting failed, keep current theme
        this.currentTheme,
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'set_theme', theme },
      },
    );
  }

  /**
   * Save theme preference to storage
   * @param {string} theme - Theme to save
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      // Storage failed - continue without saving
    }
  }

  /**
   * Update theme toggle button
   */
  updateThemeButton() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      const isDark = this.currentTheme === 'dark';
      darkModeToggle.textContent = isDark ? '☀️' : '🌙';

      // Update aria-label for accessibility
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      darkModeToggle.setAttribute('aria-label', label);
      darkModeToggle.title = label;
    }
  }

  /**
   * Update meta theme-color for mobile browsers
   * @param {string} theme - Current theme
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    // Set appropriate theme color
    const themeColors = {
      light: '#ffffff',
      dark: '#1a1a1a',
    };

    metaThemeColor.content = themeColors[theme] || themeColors.light;
  }

  /**
   * Dispatch theme change event
   * @param {string} theme - New theme
   */
  dispatchThemeChangeEvent(theme) {
    try {
      const event = new CustomEvent('themeChanged', {
        detail: {
          theme,
          timestamp: Date.now(),
        },
      });
      document.dispatchEvent(event);
    } catch (error) {
      // Event dispatch failed - continue silently
    }
  }

  /**
   * Get current theme
   * @returns {string} - Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   * @returns {boolean} - True if dark mode is active
   */
  isDarkMode() {
    return this.currentTheme === 'dark';
  }

  /**
   * Get system preferred theme
   * @returns {string} - System preferred theme
   */
  getSystemPreferredTheme() {
    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  }

  /**
   * Reset theme to system preference
   */
  resetToSystemTheme() {
    const systemTheme = this.getSystemPreferredTheme();
    this.setTheme(systemTheme);

    // Remove explicit preference so it follows system changes
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      // Storage operation failed - continue
    }
  }

  /**
   * Get theme status information
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      currentTheme: this.currentTheme,
      isDarkMode: this.isDarkMode(),
      systemPreferred: this.getSystemPreferredTheme(),
      hasExplicitPreference: !!localStorage.getItem(this.storageKey),
    };
  }

  /**
   * Cleanup when destroyed
   */
  destroy() {
    this.isInitialized = false;
  }
}
