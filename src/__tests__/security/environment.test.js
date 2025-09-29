/**
 * Environment Configuration Test Suite
 * Secure Environment Variable Management Testing
 */

import {
  EnvironmentConfig,
  EnvironmentValidationError,
  SecurityLevel,
  ConfigurationManager,
} from '../../security/environment.js';

// Mock environment variables
const mockEnv = {
  NODE_ENV: 'test',
  VITE_APP_ENVIRONMENT: 'test',
  VITE_RESEARCH_PASSWORD_HASH: 'test_hash_123',
  VITE_GCP_PROJECT_ID: 'test-project',
  VITE_API_BASE_URL: 'https://test-api.example.com',
  VITE_GEOCODING_API_KEY: 'test_geocoding_key',
  VITE_SECURITY_LEVEL: 'HIGH',
  VITE_ENABLE_AUDIT_LOGGING: 'true',
  VITE_SESSION_TIMEOUT: '3600000',
  VITE_MAX_LOGIN_ATTEMPTS: '5',
  VITE_RATE_LIMIT_WINDOW: '900000',
  VITE_ENCRYPTION_KEY: 'test_encryption_key_32_chars_long',
  VITE_HIPAA_COMPLIANCE: 'true',
  VITE_DATA_RETENTION_DAYS: '2555',
  VITE_ENABLE_PERFORMANCE_MONITORING: 'true',
  VITE_CACHE_TTL: '3600000',
  VITE_OFFLINE_SUPPORT: 'true',
};

// Mock import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
  writable: true,
});

describe('EnvironmentConfig', () => {
  let config;

  beforeEach(() => {
    // Reset the singleton instance
    EnvironmentConfig.instance = null;
    config = EnvironmentConfig.getInstance();
  });

  describe('Singleton Pattern', () => {
    test('should maintain singleton instance', () => {
      const config1 = EnvironmentConfig.getInstance();
      const config2 = EnvironmentConfig.getInstance();

      expect(config1).toBe(config2);
    });

    test('should initialize configuration on first access', () => {
      expect(config.environment).toBe('test');
      expect(config.gcpProjectId).toBe('test-project');
    });
  });

  describe('Environment Detection', () => {
    test('should detect test environment', () => {
      expect(config.environment).toBe('test');
      expect(config.isProduction()).toBe(false);
      expect(config.isDevelopment()).toBe(false);
      expect(config.isTest()).toBe(true);
    });

    test('should handle production environment', () => {
      // Temporarily change environment
      const originalEnv = import.meta.env.VITE_APP_ENVIRONMENT;
      import.meta.env.VITE_APP_ENVIRONMENT = 'production';

      const prodConfig = new EnvironmentConfig();
      expect(prodConfig.environment).toBe('production');
      expect(prodConfig.isProduction()).toBe(true);

      // Restore
      import.meta.env.VITE_APP_ENVIRONMENT = originalEnv;
    });

    test('should handle development environment', () => {
      const originalEnv = import.meta.env.VITE_APP_ENVIRONMENT;
      import.meta.env.VITE_APP_ENVIRONMENT = 'development';

      const devConfig = new EnvironmentConfig();
      expect(devConfig.environment).toBe('development');
      expect(devConfig.isDevelopment()).toBe(true);

      import.meta.env.VITE_APP_ENVIRONMENT = originalEnv;
    });
  });

  describe('Configuration Access', () => {
    test('should provide research password hash', () => {
      const passwordHash = config.getResearchPassword();
      expect(passwordHash).toBe('test_hash_123');
    });

    test('should provide API configuration', () => {
      const apiConfig = config.getApiConfig();

      expect(apiConfig).toEqual({
        baseUrl: 'https://test-api.example.com',
        projectId: 'test-project',
        timeout: 30000,
        retries: 3,
      });
    });

    test('should provide geocoding API key', () => {
      const apiKey = config.getApiKey('geocoding');
      expect(apiKey).toBe('test_geocoding_key');
    });

    test('should handle missing API keys gracefully', () => {
      const missingKey = config.getApiKey('nonexistent');
      expect(missingKey).toBeNull();
    });

    test('should provide security configuration', () => {
      const securityConfig = config.getSecurityConfig();

      expect(securityConfig).toEqual({
        level: SecurityLevel.HIGH,
        auditLogging: true,
        sessionTimeout: 3600000,
        maxLoginAttempts: 5,
        rateLimitWindow: 900000,
        encryptionKey: 'test_encryption_key_32_chars_long',
      });
    });

    test('should provide medical compliance configuration', () => {
      const medicalConfig = config.getMedicalConfig();

      expect(medicalConfig).toEqual({
        hipaaCompliance: true,
        dataRetentionDays: 2555,
        auditRequired: true,
        encryptionRequired: true,
      });
    });

    test('should provide performance configuration', () => {
      const perfConfig = config.getPerformanceConfig();

      expect(perfConfig).toEqual({
        monitoring: true,
        cacheTTL: 3600000,
        offlineSupport: true,
        performanceTracking: true,
      });
    });
  });

  describe('Configuration Validation', () => {
    test('should validate complete configuration', () => {
      expect(() => config.validateConfig()).not.toThrow();
    });

    test('should validate required fields', () => {
      const requiredFields = config.getRequiredFields();

      expect(requiredFields).toContain('VITE_APP_ENVIRONMENT');
      expect(requiredFields).toContain('VITE_GCP_PROJECT_ID');
      expect(requiredFields).toContain('VITE_API_BASE_URL');
    });

    test('should validate security level', () => {
      expect(() => config.validateSecurityLevel('HIGH')).not.toThrow();
      expect(() => config.validateSecurityLevel('MEDIUM')).not.toThrow();
      expect(() => config.validateSecurityLevel('LOW')).not.toThrow();

      expect(() => config.validateSecurityLevel('INVALID'))
        .toThrow(EnvironmentValidationError);
    });

    test('should validate encryption key length', () => {
      const validKey = 'a'.repeat(32);
      const shortKey = 'a'.repeat(15);

      expect(() => config.validateEncryptionKey(validKey)).not.toThrow();
      expect(() => config.validateEncryptionKey(shortKey))
        .toThrow(EnvironmentValidationError);
    });

    test('should validate numeric configurations', () => {
      expect(() => config.validateNumericConfig('3600000', 'sessionTimeout')).not.toThrow();
      expect(() => config.validateNumericConfig('invalid', 'sessionTimeout'))
        .toThrow(EnvironmentValidationError);
    });

    test('should validate URL configurations', () => {
      expect(() => config.validateUrlConfig('https://api.example.com')).not.toThrow();
      expect(() => config.validateUrlConfig('invalid-url'))
        .toThrow(EnvironmentValidationError);
    });
  });

  describe('Security Level Handling', () => {
    test('should parse security levels correctly', () => {
      expect(config.parseSecurityLevel('HIGH')).toBe(SecurityLevel.HIGH);
      expect(config.parseSecurityLevel('MEDIUM')).toBe(SecurityLevel.MEDIUM);
      expect(config.parseSecurityLevel('LOW')).toBe(SecurityLevel.LOW);
      expect(config.parseSecurityLevel('')).toBe(SecurityLevel.MEDIUM); // default
    });

    test('should provide security level requirements', () => {
      const highSecReqs = config.getSecurityRequirements(SecurityLevel.HIGH);

      expect(highSecReqs.auditLogging).toBe(true);
      expect(highSecReqs.encryptionRequired).toBe(true);
      expect(highSecReqs.sessionTimeout).toBeLessThanOrEqual(3600000);
      expect(highSecReqs.maxLoginAttempts).toBeLessThanOrEqual(5);
    });
  });

  describe('Boolean Configuration Parsing', () => {
    test('should parse boolean strings correctly', () => {
      expect(config.parseBoolean('true')).toBe(true);
      expect(config.parseBoolean('false')).toBe(false);
      expect(config.parseBoolean('1')).toBe(true);
      expect(config.parseBoolean('0')).toBe(false);
      expect(config.parseBoolean('yes')).toBe(true);
      expect(config.parseBoolean('no')).toBe(false);
      expect(config.parseBoolean('')).toBe(false); // default
      expect(config.parseBoolean('invalid')).toBe(false); // default
    });
  });

  describe('Configuration Sanitization', () => {
    test('should sanitize sensitive configuration for logging', () => {
      const sanitized = config.getSanitizedConfig();

      expect(sanitized.researchPasswordHash).toBe('[REDACTED]');
      expect(sanitized.encryptionKey).toBe('[REDACTED]');
      expect(sanitized.apiKeys).toEqual({ geocoding: '[REDACTED]' });
      expect(sanitized.environment).toBe('test'); // Non-sensitive data preserved
    });
  });

  describe('Configuration Caching', () => {
    test('should cache configuration values', () => {
      const apiConfig1 = config.getApiConfig();
      const apiConfig2 = config.getApiConfig();

      expect(apiConfig1).toBe(apiConfig2); // Same object reference
    });

    test('should invalidate cache when needed', () => {
      const initialConfig = config.getApiConfig();

      config.invalidateCache();

      const newConfig = config.getApiConfig();
      expect(newConfig).toEqual(initialConfig); // Same values
      expect(newConfig).not.toBe(initialConfig); // Different object reference
    });
  });
});

describe('ConfigurationManager', () => {
  let configManager;

  beforeEach(() => {
    configManager = new ConfigurationManager();
  });

  describe('Configuration Loading', () => {
    test('should load configuration from environment', () => {
      const loadedConfig = configManager.loadConfiguration();

      expect(loadedConfig).toHaveProperty('environment');
      expect(loadedConfig).toHaveProperty('security');
      expect(loadedConfig).toHaveProperty('medical');
      expect(loadedConfig).toHaveProperty('performance');
    });

    test('should validate loaded configuration', () => {
      expect(() => configManager.validateLoadedConfiguration()).not.toThrow();
    });
  });

  describe('Configuration Updates', () => {
    test('should update configuration values', () => {
      const updates = {
        sessionTimeout: 7200000,
        maxLoginAttempts: 3,
      };

      configManager.updateConfiguration(updates);
      const securityConfig = configManager.getSecurityConfig();

      expect(securityConfig.sessionTimeout).toBe(7200000);
      expect(securityConfig.maxLoginAttempts).toBe(3);
    });

    test('should validate configuration updates', () => {
      const invalidUpdates = {
        sessionTimeout: 'invalid',
      };

      expect(() => configManager.updateConfiguration(invalidUpdates))
        .toThrow(EnvironmentValidationError);
    });
  });

  describe('Environment-Specific Configurations', () => {
    test('should provide development-specific configuration', () => {
      const devConfig = configManager.getDevelopmentConfig();

      expect(devConfig.debugging).toBe(true);
      expect(devConfig.verboseLogging).toBe(true);
      expect(devConfig.hotReload).toBe(true);
    });

    test('should provide production-specific configuration', () => {
      const prodConfig = configManager.getProductionConfig();

      expect(prodConfig.debugging).toBe(false);
      expect(prodConfig.minification).toBe(true);
      expect(prodConfig.errorReporting).toBe(true);
    });
  });

  describe('Configuration Export/Import', () => {
    test('should export configuration safely', () => {
      const exported = configManager.exportConfiguration();

      expect(exported).not.toHaveProperty('encryptionKey');
      expect(exported).not.toHaveProperty('researchPasswordHash');
      expect(exported).toHaveProperty('environment');
      expect(exported).toHaveProperty('security');
    });

    test('should import configuration with validation', () => {
      const configToImport = {
        security: {
          level: 'HIGH',
          sessionTimeout: 3600000,
        },
      };

      expect(() => configManager.importConfiguration(configToImport)).not.toThrow();
    });
  });
});

describe('EnvironmentValidationError', () => {
  test('should create validation error with message', () => {
    const error = new EnvironmentValidationError('Invalid configuration', 'ENCRYPTION_KEY');

    expect(error.message).toBe('Invalid configuration');
    expect(error.field).toBe('ENCRYPTION_KEY');
    expect(error.name).toBe('EnvironmentValidationError');
  });

  test('should be instance of Error', () => {
    const error = new EnvironmentValidationError('Test error');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('SecurityLevel Enum', () => {
  test('should define security levels', () => {
    expect(SecurityLevel.LOW).toBe('LOW');
    expect(SecurityLevel.MEDIUM).toBe('MEDIUM');
    expect(SecurityLevel.HIGH).toBe('HIGH');
  });

  test('should be used in configuration', () => {
    const config = EnvironmentConfig.getInstance();
    const securityConfig = config.getSecurityConfig();

    expect(Object.values(SecurityLevel)).toContain(securityConfig.level);
  });
});
