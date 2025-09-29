// Authentication System Tests
// Critical for research access security

import { AuthenticationManager } from '../../auth/authentication.js';

describe('Authentication System', () => {
  let authManager;

  beforeEach(() => {
    authManager = new AuthenticationManager();
  });

  describe('Password Hashing', () => {
    test('should hash passwords using SHA-256', async () => {
      const password = 'testPassword123';
      const hash = await authManager.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA-256 produces 64 character hex string
    });

    test('should produce consistent hashes for same input', async () => {
      const password = 'Neuro25';
      const hash1 = await authManager.hashPassword(password);
      const hash2 = await authManager.hashPassword(password);

      expect(hash1).toBe(hash2);
    });

    test('should produce different hashes for different inputs', async () => {
      const hash1 = await authManager.hashPassword('password1');
      const hash2 = await authManager.hashPassword('password2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Authentication Process', () => {
    test('should authenticate with correct password', async () => {
      const correctPassword = 'Neuro25';

      const result = await authManager.authenticate(correctPassword);

      expect(result.success).toBe(true);
      expect(authManager.isAuthenticated).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const incorrectPassword = 'incorrect_password';
      const { DEV_CONFIG } = await import('../../config.js');
      DEV_CONFIG.isDevelopment = false;

      const result = await authManager.authenticate(incorrectPassword);

      expect(result.success).toBe(false);
      expect(authManager.isAuthenticated).toBe(false);
      DEV_CONFIG.isDevelopment = true;
    });

    test('should implement rate limiting on failed attempts', async () => {
      const { DEV_CONFIG } = await import('../../config.js');
      DEV_CONFIG.isDevelopment = false;
      const incorrectPassword = 'wrong_password';
      const startTime = Date.now();

      await authManager.authenticate(incorrectPassword);
      const endTime = Date.now();

      // Should have a delay of at least 1000ms
      expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
      DEV_CONFIG.isDevelopment = true;
    });
  });

  describe('Session Management', () => {
    test('should create valid session after authentication', async () => {
      const password = 'Neuro25';
      await authManager.authenticate(password);

      const isValid = await authManager.isValidSession();
      expect(isValid).toBe(true);
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith('auth_session', 'verified');
    });

    test('should expire session after timeout', async () => {
      // Mock shortened timeout for testing
      authManager.sessionTimeout = 100; // 100ms
      const password = 'Neuro25';
      await authManager.authenticate(password);

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 150));

      const isValid = await authManager.isValidSession();
      expect(isValid).toBe(false);
    });

    test('should restore valid session from storage', async () => {
      const currentTime = Date.now();
      global.sessionStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_session') return 'verified';
        if (key === 'auth_timestamp') return currentTime.toString();
        return null;
      });

      const isValid = await authManager.isValidSession();

      expect(isValid).toBe(true);
      expect(authManager.isAuthenticated).toBe(true);
    });

    test('should reject expired session from storage', async () => {
      const expiredTime = Date.now() - (5 * 60 * 60 * 1000); // 5 hours ago
      global.sessionStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_session') return 'verified';
        if (key === 'auth_timestamp') return expiredTime.toString();
        return null;
      });

      const isValid = await authManager.isValidSession();

      expect(isValid).toBe(false);
      expect(global.sessionStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('Activity Tracking', () => {
    test('should update activity timestamp', async () => {
      const password = 'Neuro25';
      await authManager.authenticate(password);

      const initialActivity = authManager.lastActivity;
      await new Promise((resolve) => setTimeout(resolve, 10));

      authManager.updateActivity();

      expect(authManager.lastActivity).toBeGreaterThan(initialActivity);
    });

    test('should provide session information', async () => {
      const password = 'Neuro25';
      await authManager.authenticate(password);

      const sessionInfo = authManager.getSessionInfo();

      expect(sessionInfo.authenticated).toBe(true);
      expect(sessionInfo.timeRemaining).toBeDefined();
      expect(sessionInfo.lastActivity).toBeDefined();
    });

    test('should return unauthenticated session info when not logged in', () => {
      const sessionInfo = authManager.getSessionInfo();

      expect(sessionInfo.authenticated).toBe(false);
      expect(sessionInfo.timeRemaining).toBeUndefined();
    });
  });

  describe('Logout Process', () => {
    test('should clear session on logout', async () => {
      const password = 'Neuro25';
      await authManager.authenticate(password);

      authManager.logout();

      expect(authManager.isAuthenticated).toBe(false);
      expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('auth_session');
      expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('auth_timestamp');
    });
  });

  describe('Security Measures', () => {
    test('should not store passwords in plain text', async () => {
      const password = 'Neuro25';
      await authManager.hashPassword(password);

      // Check that password is not stored anywhere in the object
      const authString = JSON.stringify(authManager);
      expect(authString).not.toContain(password);
    });

    test('should handle malformed session data safely', async () => {
      global.sessionStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_session') return 'verified';
        if (key === 'auth_timestamp') return 'invalid_timestamp';
        return null;
      });

      const isValid = await authManager.isValidSession();
      expect(isValid).toBe(false);
    });

    test('should validate session timeout boundary conditions', async () => {
      const now = Date.now();
      authManager.sessionTimeout = 3600000;
      global.sessionStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_session') return 'verified';
        if (key === 'auth_timestamp') return (now - authManager.sessionTimeout).toString();
        return null;
      });

      const isValid = await authManager.isValidSession();
      expect(isValid).toBe(false);
    });
  });

  describe('Research Environment Safety', () => {
    test('should handle concurrent authentication attempts', async () => {
      const password = 'Neuro25';

      // Simulate concurrent authentication
      const promises = [
        authManager.authenticate(password),
        authManager.authenticate(password),
        authManager.authenticate('wrong_password'),
      ];

      const results = await Promise.all(promises);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[2].success).toBe(false);
    });

    test('should maintain security during rapid successive calls', async () => {
      const wrongPassword = 'definitely_wrong';
      const { DEV_CONFIG } = await import('../../config.js');
      DEV_CONFIG.isDevelopment = false;

      // Multiple rapid failed attempts
      const promises = Array(5).fill().map(() => authManager.authenticate(wrongPassword));

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // All should fail
      expect(results.every((result) => result.success === false)).toBe(true);

      // Should have cumulative rate limiting delay
      expect(endTime - startTime).toBeGreaterThanOrEqual(5000);
      DEV_CONFIG.isDevelopment = true;
    });
  });
});
