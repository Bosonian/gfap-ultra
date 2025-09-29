/**
 * Secure Authentication System for iGFAP Stroke Triage Assistant
 * Enterprise-grade authentication using Google Cloud Functions
 *
 * @typedef {import('../types/medical-types.js').SessionInfo} SessionInfo
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { API_URLS, DEV_CONFIG } from '../config.js';
import { getResearchPassword, isDevelopment, getSecurityConfig } from '../security/environment.js';

// Bulletproof error handling utilities
import {
  safeAsync,
  safeAuthOperation,
  MedicalError,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  MEDICAL_ERROR_CODES,
} from '../utils/error-handler.js';

// Type safety utilities
import { TypeChecker } from '../types/medical-types.js';

// Professional logging
import { medicalLogger, LOG_CATEGORIES } from '../utils/medical-logger.js';

// Encrypted storage
import { secureStore, secureRetrieve, secureRemove } from '../security/data-encryption.js';

export class AuthenticationManager {
  constructor() {
    this.isAuthenticated = false;
    this.sessionToken = null;
    this.sessionExpiry = null;
    this.lastActivity = Date.now();
    this.setupActivityTracking();
  }

  /**
   * Authenticate user with research access password via secure Cloud Function
   * @param {string} password - Research access password
   * @returns {Promise<{success: boolean, message: string, sessionInfo?: SessionInfo}>} - Authentication result with success status and message
   */
  async authenticate(password) {
    return safeAuthOperation(
      async () => {
        medicalLogger.info('Authentication attempt started', {
          category: LOG_CATEGORIES.AUTHENTICATION,
          hasPassword: !!password && password.length > 0,
          isDevelopment: DEV_CONFIG.isDevelopment,
        });

        // Type safety validation
        TypeChecker.ensureType(password, 'string', 'authentication password');

        if (!password || password.trim().length === 0) {
          medicalLogger.warn('Authentication failed: empty password', {
            category: LOG_CATEGORIES.AUTHENTICATION,
          });
          throw new MedicalError(
            'Password is required',
            'EMPTY_PASSWORD',
            ERROR_CATEGORIES.VALIDATION,
            ERROR_SEVERITY.MEDIUM,
          );
        }

        // Local preview (localhost, vite preview): authenticate locally to avoid CORS
        const isLocalPreview = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname) && !(import.meta && import.meta.env && import.meta.env.DEV);
        if (isLocalPreview || DEV_CONFIG.isDevelopment) {
          medicalLogger.info('Development mode authentication path', {
            category: LOG_CATEGORIES.AUTHENTICATION,
          });

          // SECURITY: Use environment-based research password
          const expectedPassword = getResearchPassword();
          if (password.trim() !== expectedPassword) {
            await this.delayFailedAttempt();
            return {
              success: false,
              message: 'Invalid credentials',
              errorCode: 'INVALID_CREDENTIALS',
            };
          }

          await new Promise((resolve) => setTimeout(resolve, 300)); // small UX delay

          this.isAuthenticated = true;
          this.sessionToken = DEV_CONFIG.mockAuthResponse.session_token;
          this.sessionExpiry = new Date(DEV_CONFIG.mockAuthResponse.expires_at);
          this.lastActivity = Date.now();

          // Store session
          try {
            this.storeSecureSession();
          } catch (storageError) {
            console.warn('Session storage failed:', storageError.message);
          }

          return {
            success: true,
            message: 'Authentication successful',
            sessionDuration: DEV_CONFIG.mockAuthResponse.session_duration,
          };
        }

        // This branch is now unreachable due to isLocalPreview handling above; keep as guard
        const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
        const preferMock = localStorage.getItem('use_mock_api') !== 'false';
        if (isLocalHost && preferMock && !(import.meta && import.meta.env && import.meta.env.DEV)) {
          if (password.trim() !== getResearchPassword()) {
            await this.delayFailedAttempt();
            return {
              success: false,
              message: 'Invalid credentials',
              errorCode: 'INVALID_CREDENTIALS',
            };
          }

          // Simulate minimal delay for UX
          await new Promise((resolve) => setTimeout(resolve, 200));

          this.isAuthenticated = true;
          this.sessionToken = `local-preview-token-${Date.now()}`;
          this.sessionExpiry = new Date(Date.now() + 30 * 60 * 1000);
          this.lastActivity = Date.now();

          try {
            this.storeSecureSession();
          } catch {}

          return {
            success: true,
            message: 'Authentication successful',
            sessionDuration: 1800,
          };
        }

        medicalLogger.debug('Sending authentication request', {
          category: LOG_CATEGORIES.AUTHENTICATION,
          url: API_URLS.AUTHENTICATE,
        });

        const response = await fetch(API_URLS.AUTHENTICATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'login',
            password: password.trim(),
          }),
        });

        if (!response.ok) {
          let errorMessage = 'Authentication failed';
          let errorCode = 'AUTH_FAILED';

          if (response.status === 429) {
            errorMessage = 'Too many authentication attempts. Please wait and try again.';
            errorCode = 'RATE_LIMITED';
          } else if (response.status >= 500) {
            errorMessage = 'Authentication service temporarily unavailable';
            errorCode = 'SERVICE_ERROR';
          }

          throw new MedicalError(
            errorMessage,
            errorCode,
            ERROR_CATEGORIES.AUTHENTICATION,
            response.status >= 500 ? ERROR_SEVERITY.HIGH : ERROR_SEVERITY.MEDIUM,
          ).withContext({ statusCode: response.status, url: API_URLS.AUTHENTICATE });
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
          throw new MedicalError(
            'Invalid response from authentication service',
            'INVALID_RESPONSE',
            ERROR_CATEGORIES.AUTHENTICATION,
            ERROR_SEVERITY.HIGH,
          );
        }

        if (data.success) {
          this.isAuthenticated = true;
          this.sessionToken = data.session_token;
          this.sessionExpiry = data.expires_at ? new Date(data.expires_at) : null;
          this.lastActivity = Date.now();

          // Safely store session
          try {
            this.storeSecureSession();
          } catch (storageError) {
            // Continue with authentication even if storage fails
            console.warn('Session storage failed:', storageError.message);
          }

          return {
            success: true,
            message: 'Authentication successful',
            sessionDuration: data.session_duration,
          };
        }
        // Handle authentication failure
        await this.delayFailedAttempt();

        throw new MedicalError(
          data.message || 'Invalid credentials',
          'INVALID_CREDENTIALS',
          ERROR_CATEGORIES.AUTHENTICATION,
          ERROR_SEVERITY.MEDIUM,
        ).withContext({
          remainingAttempts: data.rate_limit_remaining,
          statusCode: response.status,
        });
      },
      {
        timeout: 15000,
        fallback: (error) => ({
          success: false,
          message: error instanceof MedicalError ? error.getUserMessage() : 'Authentication service unavailable. Please try again.',
          errorCode: error.code || 'NETWORK_ERROR',
          details: error.message,
          remainingAttempts: error.context?.remainingAttempts,
        }),
        context: {
          operation: 'user_authentication',
          endpoint: 'authenticate',
        },
      },
    );
  }

  /**
   * Check if current session is valid
   * @returns {boolean} - Session validity
   */
  isValidSession() {
    if (!this.isAuthenticated) {
      return this.checkStoredSession();
    }

    // Check session expiry
    if (this.sessionExpiry && new Date() > this.sessionExpiry) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Validate session token with server
   * @returns {boolean} - Server-side session validity
   */
  async validateSessionWithServer() {
    if (!this.sessionToken) {
      return false;
    }

    return safeAuthOperation(
      async () => {
        // Skip remote validation on local preview to avoid CORS noise
        const isLocalPreview = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname) && !(import.meta && import.meta.env && import.meta.env.DEV);
        if (isLocalPreview) {
          this.updateActivity();
          return true;
        }

        const response = await fetch(API_URLS.AUTHENTICATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'validate_session',
            session_token: this.sessionToken,
          }),
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Session expired or invalid
            this.logout();
            return false;
          }

          throw new MedicalError(
            'Session validation service error',
            'VALIDATION_ERROR',
            ERROR_CATEGORIES.AUTHENTICATION,
            ERROR_SEVERITY.MEDIUM,
          ).withContext({ statusCode: response.status });
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
          throw new MedicalError(
            'Invalid response from session validation service',
            'INVALID_RESPONSE',
            ERROR_CATEGORIES.AUTHENTICATION,
            ERROR_SEVERITY.MEDIUM,
          );
        }

        if (data.success) {
          this.updateActivity();
          return true;
        }
        this.logout();
        return false;
      },
      {
        timeout: 10000,
        fallback: (error) => {
          // On network errors, allow local session to continue
          // This prevents logout during temporary network issues
          console.warn('Session validation failed, continuing with local session:', error.message);
          return this.isValidSession();
        },
        context: {
          operation: 'session_validation',
          endpoint: 'validate_session',
        },
      },
    );
  }

  /**
   * Update activity timestamp
   */
  updateActivity() {
    this.lastActivity = Date.now();
    this.storeAuthSession();
  }

  /**
   * Logout and clear session securely
   */
  async logout() {
    medicalLogger.info('User logout initiated', {
      category: LOG_CATEGORIES.AUTHENTICATION,
    });

    this.isAuthenticated = false;
    this.sessionToken = null;
    this.sessionExpiry = null;

    // Clear all encrypted session storage securely
    try {
      await secureRemove('auth_session', true);
      await secureRemove('auth_timestamp', true);
      await secureRemove('session_token', true);
      await secureRemove('session_expiry', true);

      // Clear legacy unencrypted data
      sessionStorage.removeItem('auth_session');
      sessionStorage.removeItem('auth_timestamp');
      sessionStorage.removeItem('session_token');
      sessionStorage.removeItem('session_expiry');

      medicalLogger.info('Session data cleared during logout', {
        category: LOG_CATEGORIES.SECURITY,
      });
    } catch (error) {
      medicalLogger.warn('Failed to clear some session data during logout', {
        category: LOG_CATEGORIES.SECURITY,
        error: error.message,
      });
    }
  }

  /**
   * Simple hash function for password verification
   * Note: For production medical device, use proper bcrypt/PBKDF2
   * @param {string} input - Password to hash
   * @returns {string} - Hashed password
   */
  async hashPassword(input) {
    return safeAsync(
      async () => {
        if (!input || typeof input !== 'string') {
          throw new MedicalError(
            'Invalid input for password hashing',
            'INVALID_INPUT',
            ERROR_CATEGORIES.VALIDATION,
            ERROR_SEVERITY.MEDIUM,
          );
        }

        if (!crypto || !crypto.subtle) {
          throw new MedicalError(
            'Crypto API not available',
            'CRYPTO_UNAVAILABLE',
            ERROR_CATEGORIES.SECURITY,
            ERROR_SEVERITY.HIGH,
          );
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
      },
      {
        category: ERROR_CATEGORIES.SECURITY,
        severity: ERROR_SEVERITY.HIGH,
        timeout: 5000,
        fallback: () => {
          // Simple fallback hash for non-critical use
          let hash = 0;
          for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash &= hash; // Convert to 32-bit integer
          }
          return Math.abs(hash).toString(16);
        },
        context: {
          operation: 'password_hashing',
          inputLength: input ? input.length : 0,
        },
      },
    );
  }

  /**
   * Store authenticated session securely
   */
  storeSecureSession() {
    return safeAsync(
      async () => {
        if (!this.isAuthenticated || !this.sessionToken) {
          throw new MedicalError(
            'Cannot store session: not authenticated',
            'NOT_AUTHENTICATED',
            ERROR_CATEGORIES.AUTHENTICATION,
            ERROR_SEVERITY.LOW,
          );
        }

        if (typeof sessionStorage === 'undefined') {
          throw new MedicalError(
            'Session storage not available',
            'STORAGE_UNAVAILABLE',
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.MEDIUM,
          );
        }

        // Store session data securely
        sessionStorage.setItem('auth_session', 'verified');
        sessionStorage.setItem('auth_timestamp', this.lastActivity.toString());
        sessionStorage.setItem('session_token', this.sessionToken);
        if (this.sessionExpiry) {
          sessionStorage.setItem('session_expiry', this.sessionExpiry.toISOString());
        }

        return true;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        severity: ERROR_SEVERITY.LOW,
        timeout: 1000,
        fallback: (error) => {
          console.warn('Failed to store session:', error.message);
          return false;
        },
        context: {
          operation: 'store_session',
          hasToken: !!this.sessionToken,
          hasExpiry: !!this.sessionExpiry,
        },
      },
    );
  }

  /**
   * Legacy method for compatibility
   */
  storeAuthSession() {
    this.storeSecureSession();
  }

  /**
   * Check for existing valid session
   * @returns {boolean} - Stored session validity
   */
  checkStoredSession() {
    try {
      return safeAsync(
        async () => {
          if (typeof sessionStorage === 'undefined') {
            throw new MedicalError(
              'Session storage not available',
              'STORAGE_UNAVAILABLE',
              ERROR_CATEGORIES.STORAGE,
              ERROR_SEVERITY.LOW,
            );
          }

          const session = await secureRetrieve('auth_session', true);
          const timestamp = await secureRetrieve('auth_timestamp', true);
          const storedToken = await secureRetrieve('session_token', true);
          const storedExpiry = await secureRetrieve('session_expiry', true);

          if (session === 'verified' && timestamp && storedToken) {
            // Check if session has expired
            if (storedExpiry) {
              const expiryDate = new Date(storedExpiry);
              if (new Date() > expiryDate) {
                this.logout();
                return false;
              }
              this.sessionExpiry = expiryDate;
            }

            // Validate timestamp is a valid number
            const timestampNum = parseInt(timestamp);
            if (isNaN(timestampNum)) {
              throw new MedicalError(
                'Invalid session timestamp',
                'INVALID_SESSION_DATA',
                ERROR_CATEGORIES.STORAGE,
                ERROR_SEVERITY.MEDIUM,
              );
            }

            this.isAuthenticated = true;
            this.sessionToken = storedToken;
            this.lastActivity = timestampNum;
            return true;
          }

          this.logout();
          return false;
        },
        {
          category: ERROR_CATEGORIES.STORAGE,
          severity: ERROR_SEVERITY.LOW,
          timeout: 1000,
          fallback: (error) => {
            console.warn('Failed to check stored session:', error.message);
            this.logout();
            return false;
          },
          context: {
            operation: 'check_stored_session',
          },
        },
      );
    } catch (error) {
      this.logout();
      return false;
    }
  }

  /**
   * Setup activity tracking for session management
   */
  setupActivityTracking() {
    // Track user interactions to maintain session
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const updateActivity = () => {
      if (this.isAuthenticated) {
        this.updateActivity();
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
  }

  /**
   * Rate limiting for failed authentication attempts
   */
  async delayFailedAttempt() {
    return safeAsync(
      async () => new Promise((resolve) => {
        setTimeout(resolve, 1000); // 1 second delay
      }),
      {
        category: ERROR_CATEGORIES.AUTHENTICATION,
        severity: ERROR_SEVERITY.LOW,
        timeout: 2000,
        fallback: () =>
          // If delay fails, continue without delay
          Promise.resolve(),
        context: {
          operation: 'auth_delay',
        },
      },
    );
  }

  /**
   * Get session status for UI
   * @returns {object} - Session information
   */
  getSessionInfo() {
    if (!this.isAuthenticated) {
      return { authenticated: false };
    }

    const timeRemaining = this.sessionTimeout - (Date.now() - this.lastActivity);
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    return {
      authenticated: true,
      timeRemaining: `${hoursRemaining}h ${minutesRemaining}m`,
      lastActivity: new Date(this.lastActivity).toLocaleTimeString(),
    };
  }
}

// Export singleton instance
export const authManager = new AuthenticationManager();
