/**
 * Secure Environment Configuration Manager
 * Provides secure access to environment variables with validation and fallbacks
 */

class EnvironmentConfig {
  constructor() {
    this.config = {};
    this.isInitialized = false;
    this.initializeConfig();
  }

  initializeConfig() {
    try {
      // Load environment variables (for Node.js environments)
      if (typeof process !== "undefined" && process.env) {
        this.config = { ...process.env };
      }

      // For client-side, use secure storage or runtime configuration
      if (typeof window !== "undefined") {
        this.loadClientConfig();
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize environment config:", error.message);
      this.loadDefaults();
    }
  }

  loadClientConfig() {
    // Client-side configuration with security considerations
    // Use runtime configuration instead of build-time injection for sensitive data
    const clientConfig = {
      // Default values that are safe to expose
      NODE_ENV: "production",
      DEBUG_MODE: false,
      MOCK_API_ENABLED: false,
      LOG_LEVEL: "info",

      // Session configuration (safe defaults)
      SESSION_TIMEOUT_HOURS: 4,
      BCRYPT_SALT_ROUNDS: 12,
      ENCRYPTION_KEY_LENGTH: 256,

      // Rate limiting
      MAX_AUTH_ATTEMPTS: 5,
      RATE_LIMIT_WINDOW_MS: 900000, // 15 minutes

      // Medical compliance
      ENABLE_DATA_ENCRYPTION: true,
      ENABLE_AUDIT_TRAIL: true,
      DATA_RETENTION_DAYS: 90,

      // GCP configuration (non-sensitive)
      GCP_PROJECT_ID: "igfap-452720",
      GCP_REGION: "europe-west3",
    };

    // Merge with any runtime configuration
    this.config = { ...this.config, ...clientConfig };
  }

  loadDefaults() {
    // Secure fallback configuration
    this.config = {
      NODE_ENV: "development",
      DEBUG_MODE: false,
      MOCK_API_ENABLED: true,
      LOG_LEVEL: "warn",
      SESSION_TIMEOUT_HOURS: 4,
      BCRYPT_SALT_ROUNDS: 12,
      MAX_AUTH_ATTEMPTS: 3,
      RATE_LIMIT_WINDOW_MS: 900000,
      ENABLE_DATA_ENCRYPTION: true,
      ENABLE_AUDIT_TRAIL: true,
      DATA_RETENTION_DAYS: 30,
      GCP_PROJECT_ID: "igfap-452720",
      GCP_REGION: "europe-west3",
    };
    this.isInitialized = true;
  }

  /**
   * Get environment variable with validation and fallback
   * @param {string} key - Environment variable key
   * @param {*} defaultValue - Default value if not found
   * @param {string} type - Expected type (string, number, boolean)
   * @returns {*} Environment variable value
   */
  get(key, defaultValue = null, type = "string") {
    if (!this.isInitialized) {
      this.initializeConfig();
    }

    let value = this.config[key];

    // Use default if value is not found
    if (value === undefined || value === null || value === "") {
      value = defaultValue;
    }

    // Type conversion and validation
    try {
      switch (type) {
        case "number":
          return value !== null ? Number(value) : defaultValue;
        case "boolean":
          if (typeof value === "boolean") {
            return value;
          }
          return value === "true" || value === "1" || value === "yes";
        case "array":
          if (Array.isArray(value)) {
            return value;
          }
          return typeof value === "string" ? value.split(",").map(s => s.trim()) : defaultValue;
        case "string":
        default:
          return value !== null ? String(value) : defaultValue;
      }
    } catch (error) {
      console.warn(`Failed to convert environment variable ${key} to ${type}:`, error.message);
      return defaultValue;
    }
  }

  /**
   * Get research password securely
   * @returns {string} Research password
   */
  getResearchPassword() {
    // In production, this should come from secure vault or environment
    // For development, use environment variable with secure fallback
    const password = this.get("RESEARCH_PASSWORD");

    // If not in environment, use secure default for research (documented in README)
    return password || "Neuro25";
  }

  /**
   * Get API key securely
   * @param {string} service - Service name (e.g., 'OPENROUTE')
   * @returns {string} API key or null if not configured
   */
  getApiKey(service) {
    const key = this.get(`${service.toUpperCase()}_API_KEY`);
    if (!key || key === "YOUR_API_KEY_HERE") {
      return null;
    }
    return key;
  }

  /**
   * Check if running in development mode
   * @returns {boolean} True if in development
   */
  isDevelopment() {
    return (
      this.get("NODE_ENV") === "development" ||
      (typeof window !== "undefined" &&
        ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname))
    );
  }

  /**
   * Check if running in production mode
   * @returns {boolean} True if in production
   */
  isProduction() {
    return this.get("NODE_ENV") === "production" && !this.isDevelopment();
  }

  /**
   * Get session configuration
   * @returns {Object} Session configuration
   */
  getSessionConfig() {
    return {
      timeoutHours: this.get("SESSION_TIMEOUT_HOURS", 4, "number"),
      secretKey: this.get("SESSION_SECRET_KEY") || this.generateSecretKey(),
      maxAuthAttempts: this.get("MAX_AUTH_ATTEMPTS", 5, "number"),
      rateLimitWindow: this.get("RATE_LIMIT_WINDOW_MS", 900000, "number"),
    };
  }

  /**
   * Get security configuration
   * @returns {Object} Security configuration
   */
  getSecurityConfig() {
    return {
      encryptionKeyLength: this.get("ENCRYPTION_KEY_LENGTH", 256, "number"),
      bcryptSaltRounds: this.get("BCRYPT_SALT_ROUNDS", 12, "number"),
      enableDataEncryption: this.get("ENABLE_DATA_ENCRYPTION", true, "boolean"),
      enableAuditTrail: this.get("ENABLE_AUDIT_TRAIL", true, "boolean"),
      dataRetentionDays: this.get("DATA_RETENTION_DAYS", 90, "number"),
    };
  }

  /**
   * Get GCP configuration
   * @returns {Object} GCP configuration
   */
  getGcpConfig() {
    return {
      projectId: this.get("GCP_PROJECT_ID", "igfap-452720"),
      region: this.get("GCP_REGION", "europe-west3"),
      baseUrl: `https://${this.get("GCP_REGION", "europe-west3")}-${this.get("GCP_PROJECT_ID", "igfap-452720")}.cloudfunctions.net`,
    };
  }

  /**
   * Generate a secure session secret key
   * @returns {string} Generated secret key
   */
  generateSecretKey() {
    try {
      if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
      }
    } catch (error) {
      console.warn("Failed to generate cryptographically secure key, using fallback");
    }

    // Fallback for environments without crypto.getRandomValues
    return `fallback-key-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  /**
   * Validate configuration integrity
   * @returns {Object} Validation results
   */
  validateConfig() {
    const issues = [];
    const warnings = [];

    // Check for required security settings
    if (!this.get("ENABLE_DATA_ENCRYPTION", true, "boolean")) {
      issues.push("Data encryption is disabled in production environment");
    }

    if (!this.get("ENABLE_AUDIT_TRAIL", true, "boolean")) {
      warnings.push("Audit trail is disabled - may affect compliance");
    }

    if (this.get("BCRYPT_SALT_ROUNDS", 12, "number") < 10) {
      issues.push("BCrypt salt rounds too low for production security");
    }

    if (this.isProduction() && this.get("DEBUG_MODE", false, "boolean")) {
      warnings.push("Debug mode enabled in production environment");
    }

    // Check for default/example values in production
    if (this.isProduction()) {
      const researchPassword = this.get("RESEARCH_PASSWORD");
      if (!researchPassword || researchPassword === "Neuro25") {
        warnings.push("Using default research password in production");
      }

      const sessionSecret = this.get("SESSION_SECRET_KEY");
      if (!sessionSecret || sessionSecret.includes("your-secure")) {
        issues.push("Default session secret in production environment");
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      configStatus: {
        encryption: this.get("ENABLE_DATA_ENCRYPTION", true, "boolean"),
        auditTrail: this.get("ENABLE_AUDIT_TRAIL", true, "boolean"),
        development: this.isDevelopment(),
        production: this.isProduction(),
      },
    };
  }

  /**
   * Get sanitized configuration for logging/debugging
   * @returns {Object} Safe configuration object (no secrets)
   */
  getSafeConfig() {
    const safeKeys = [
      "NODE_ENV",
      "DEBUG_MODE",
      "MOCK_API_ENABLED",
      "LOG_LEVEL",
      "SESSION_TIMEOUT_HOURS",
      "BCRYPT_SALT_ROUNDS",
      "ENCRYPTION_KEY_LENGTH",
      "MAX_AUTH_ATTEMPTS",
      "RATE_LIMIT_WINDOW_MS",
      "ENABLE_DATA_ENCRYPTION",
      "ENABLE_AUDIT_TRAIL",
      "DATA_RETENTION_DAYS",
      "GCP_PROJECT_ID",
      "GCP_REGION",
    ];

    const safeConfig = {};
    safeKeys.forEach(key => {
      safeConfig[key] = this.config[key];
    });

    return safeConfig;
  }
}

// Create singleton instance
const environmentConfig = new EnvironmentConfig();

// Export convenience functions
export const getEnv = (key, defaultValue, type) => environmentConfig.get(key, defaultValue, type);
export const getResearchPassword = () => environmentConfig.getResearchPassword();
export const getApiKey = service => environmentConfig.getApiKey(service);
export const isDevelopment = () => environmentConfig.isDevelopment();
export const isProduction = () => environmentConfig.isProduction();
export const getSessionConfig = () => environmentConfig.getSessionConfig();
export const getSecurityConfig = () => environmentConfig.getSecurityConfig();
export const getGcpConfig = () => environmentConfig.getGcpConfig();
export const validateConfig = () => environmentConfig.validateConfig();
export const getSafeConfig = () => environmentConfig.getSafeConfig();

// Export main class
export default environmentConfig;
