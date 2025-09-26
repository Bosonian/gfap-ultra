/**
 * Authentication System for iGFAP Stroke Triage Assistant
 * Research Preview Access Control
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepakgmail.com>
 */

export class AuthenticationManager {
  constructor() {
    this.isAuthenticated = false;
    this.sessionTimeout = 4 * 60 * 60 * 1000; // 4 hours for research sessions
    this.lastActivity = Date.now();
    this.setupActivityTracking();
  }

  /**
   * Authenticate user with research access password
   * @param {string} password - Research access password
   * @returns {boolean} - Authentication success
   */
  async authenticate(hashedInput) {
    // Secure password verification for research preview
    const validHash = 'c15277c5a181570617a465554a4a59a4a85c6c6df6f1b32a8a827c0089b4931a';

    if (hashedInput === validHash) {
      this.isAuthenticated = true;
      this.lastActivity = Date.now();
      this.storeAuthSession();
      return true;
    }

    // Rate limiting - delay on failed attempts
    await this.delayFailedAttempt();
    return false;
  }

  /**
   * Check if current session is valid
   * @returns {boolean} - Session validity
   */
  isValidSession() {
    if (!this.isAuthenticated) {
      return this.checkStoredSession();
    }

    const timeSinceActivity = Date.now() - this.lastActivity;
    if (timeSinceActivity > this.sessionTimeout) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Update activity timestamp
   */
  updateActivity() {
    this.lastActivity = Date.now();
    this.storeAuthSession();
  }

  /**
   * Logout and clear session
   */
  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('auth_session');
    sessionStorage.removeItem('auth_timestamp');
  }

  /**
   * Simple hash function for password verification
   * Note: For production medical device, use proper bcrypt/PBKDF2
   * @param {string} input - Password to hash
   * @returns {string} - Hashed password
   */
  async hashPassword(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Store authenticated session
   */
  storeAuthSession() {
    if (this.isAuthenticated) {
      sessionStorage.setItem('auth_session', 'verified');
      sessionStorage.setItem('auth_timestamp', this.lastActivity.toString());
    }
  }

  /**
   * Check for existing valid session
   * @returns {boolean} - Stored session validity
   */
  checkStoredSession() {
    const session = sessionStorage.getItem('auth_session');
    const timestamp = sessionStorage.getItem('auth_timestamp');

    if (session === 'verified' && timestamp) {
      const lastActivity = parseInt(timestamp);
      const timeSinceActivity = Date.now() - lastActivity;

      if (timeSinceActivity < this.sessionTimeout) {
        this.isAuthenticated = true;
        this.lastActivity = lastActivity;
        return true;
      }
    }

    this.logout();
    return false;
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

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
  }

  /**
   * Rate limiting for failed authentication attempts
   */
  async delayFailedAttempt() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000); // 1 second delay
    });
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
      lastActivity: new Date(this.lastActivity).toLocaleTimeString()
    };
  }
}

// Export singleton instance
export const authManager = new AuthenticationManager();