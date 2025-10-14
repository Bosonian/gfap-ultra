/**
 * Secure Authentication Test Suite
 * Enterprise-Grade Authentication with BCrypt and JWT Testing
 */

import {
  SecureAuthenticationManager,
  AuthResult,
  TokenValidationResult,
  AuthenticationError,
  RateLimitError,
} from "../../security/secure-auth.js";

// Mock bcryptjs for browser environment
jest.mock("bcryptjs", () => ({
  hash: jest.fn((password, saltRounds) => Promise.resolve(`hashed_${password}_${saltRounds}`)),
  compare: jest.fn((password, hash) => Promise.resolve(hash === `hashed_${password}_10`)),
  genSalt: jest.fn(() => Promise.resolve("salt")),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn((payload, secret, options) => `jwt.${Buffer.from(JSON.stringify(payload)).toString("base64")}.signature`),
  verify: jest.fn((token, secret) => {
    if (token.startsWith("invalid")) {
      throw new Error("Invalid token");
    }
    if (token.startsWith("expired")) {
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";
      throw error;
    }
    const payloadB64 = token.split(".")[1];
    return JSON.parse(Buffer.from(payloadB64, "base64").toString());
  }),
  decode: jest.fn((token) => {
    const payloadB64 = token.split(".")[1];
    return JSON.parse(Buffer.from(payloadB64, "base64").toString());
  }),
}));

describe("SecureAuthenticationManager", () => {
  let authManager;
  let mockAuditLogger;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock audit logger
    mockAuditLogger = {
      logSecurityEvent: jest.fn(),
      logAuthenticationAttempt: jest.fn(),
      logRateLimitEvent: jest.fn(),
    };

    authManager = new SecureAuthenticationManager({
      auditLogger: mockAuditLogger,
      maxLoginAttempts: 3,
      lockoutDuration: 300000, // 5 minutes
      tokenExpiry: "24h",
      refreshTokenExpiry: "7d",
    });

    // Reset rate limiting
    authManager.loginAttempts.clear();
    authManager.lockedAccounts.clear();
  });

  describe("Initialization", () => {
    test("should initialize with default configuration", () => {
      const defaultAuth = new SecureAuthenticationManager();

      expect(defaultAuth.config.maxLoginAttempts).toBe(5);
      expect(defaultAuth.config.lockoutDuration).toBe(900000); // 15 minutes
      expect(defaultAuth.config.tokenExpiry).toBe("1h");
    });

    test("should initialize with custom configuration", () => {
      expect(authManager.config.maxLoginAttempts).toBe(3);
      expect(authManager.config.lockoutDuration).toBe(300000);
      expect(authManager.config.tokenExpiry).toBe("24h");
    });
  });

  describe("Password Hashing", () => {
    test("should hash passwords securely", async () => {
      const password = "SecurePassword123!";
      const hashedPassword = await authManager.hashPassword(password);

      expect(hashedPassword).toBe("hashed_SecurePassword123!_10");
      expect(hashedPassword).not.toBe(password);
    });

    test("should verify passwords correctly", async () => {
      const password = "SecurePassword123!";
      const correctHash = "hashed_SecurePassword123!_10";
      const incorrectHash = "hashed_WrongPassword_10";

      const correctResult = await authManager.verifyPassword(password, correctHash);
      const incorrectResult = await authManager.verifyPassword(password, incorrectHash);

      expect(correctResult).toBe(true);
      expect(incorrectResult).toBe(false);
    });
  });

  describe("Token Management", () => {
    test("should generate JWT tokens", () => {
      const user = { userId: "user123", role: "physician", department: "neurology" };
      const token = authManager.generateToken(user);

      expect(token).toMatch(/^jwt\./);
      expect(token).toContain(Buffer.from(JSON.stringify({
        userId: "user123",
        role: "physician",
        department: "neurology",
      })).toString("base64"));
    });

    test("should validate JWT tokens", () => {
      const user = { userId: "user123", role: "physician" };
      const token = authManager.generateToken(user);

      const result = authManager.validateToken(token);

      expect(result.isValid).toBe(true);
      expect(result.payload.userId).toBe("user123");
      expect(result.payload.role).toBe("physician");
      expect(result.error).toBeNull();
    });

    test("should handle invalid tokens", () => {
      const invalidToken = "invalid.token.here";
      const result = authManager.validateToken(invalidToken);

      expect(result.isValid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBe("Invalid token");
    });

    test("should handle expired tokens", () => {
      const expiredToken = "expired.token.here";
      const result = authManager.validateToken(expiredToken);

      expect(result.isValid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBe("Token expired");
    });

    test("should generate refresh tokens", () => {
      const user = { userId: "user123", role: "physician" };
      const refreshToken = authManager.generateRefreshToken(user);

      expect(refreshToken).toMatch(/^jwt\./);
      expect(refreshToken).toContain("refresh");
    });
  });

  describe("Rate Limiting", () => {
    test("should allow login attempts within limit", async () => {
      const username = "testuser";

      // First two attempts should be allowed
      expect(authManager.isAccountLocked(username)).toBe(false);
      authManager.recordFailedAttempt(username);
      expect(authManager.isAccountLocked(username)).toBe(false);
      authManager.recordFailedAttempt(username);
      expect(authManager.isAccountLocked(username)).toBe(false);
    });

    test("should lock account after max failed attempts", () => {
      const username = "testuser";

      // Record max failed attempts
      for (let i = 0; i < 3; i++) {
        authManager.recordFailedAttempt(username);
      }

      expect(authManager.isAccountLocked(username)).toBe(true);
      expect(mockAuditLogger.logRateLimitEvent).toHaveBeenCalledWith(
        username,
        "Account locked due to excessive failed login attempts",
      );
    });

    test("should reset failed attempts after successful login", () => {
      const username = "testuser";

      // Record some failed attempts
      authManager.recordFailedAttempt(username);
      authManager.recordFailedAttempt(username);
      expect(authManager.loginAttempts.get(username)).toBe(2);

      // Reset after successful login
      authManager.resetFailedAttempts(username);
      expect(authManager.loginAttempts.get(username)).toBe(0);
    });

    test("should unlock account after lockout duration", () => {
      const username = "testuser";

      // Lock the account
      for (let i = 0; i < 3; i++) {
        authManager.recordFailedAttempt(username);
      }
      expect(authManager.isAccountLocked(username)).toBe(true);

      // Manually set lockout time to past
      const pastTime = Date.now() - authManager.config.lockoutDuration - 1000;
      authManager.lockedAccounts.set(username, pastTime);

      expect(authManager.isAccountLocked(username)).toBe(false);
    });
  });

  describe("Authentication Flow", () => {
    test("should authenticate valid credentials", async () => {
      const credentials = {
        username: "physician1",
        password: "SecurePassword123!",
      };

      // Mock user lookup
      const mockUser = {
        userId: "physician1",
        role: "physician",
        passwordHash: "hashed_SecurePassword123!_10",
        department: "neurology",
      };

      authManager.getUserByUsername = jest.fn().mockResolvedValue(mockUser);

      const result = await authManager.authenticate(credentials);

      expect(result.success).toBe(true);
      expect(result.user.userId).toBe("physician1");
      expect(result.token).toMatch(/^jwt\./);
      expect(result.refreshToken).toMatch(/^jwt\./);
      expect(mockAuditLogger.logAuthenticationAttempt).toHaveBeenCalledWith(
        "physician1",
        true,
        expect.any(String),
      );
    });

    test("should reject invalid credentials", async () => {
      const credentials = {
        username: "physician1",
        password: "WrongPassword",
      };

      const mockUser = {
        userId: "physician1",
        passwordHash: "hashed_SecurePassword123!_10",
      };

      authManager.getUserByUsername = jest.fn().mockResolvedValue(mockUser);

      const result = await authManager.authenticate(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid credentials");
      expect(result.token).toBeNull();
      expect(mockAuditLogger.logAuthenticationAttempt).toHaveBeenCalledWith(
        "physician1",
        false,
        "Invalid password",
      );
    });

    test("should reject authentication for locked accounts", async () => {
      const credentials = {
        username: "lockeduser",
        password: "SecurePassword123!",
      };

      // Lock the account first
      for (let i = 0; i < 3; i++) {
        authManager.recordFailedAttempt("lockeduser");
      }

      await expect(authManager.authenticate(credentials))
        .rejects.toThrow(RateLimitError);
    });

    test("should reject authentication for non-existent users", async () => {
      const credentials = {
        username: "nonexistent",
        password: "SecurePassword123!",
      };

      authManager.getUserByUsername = jest.fn().mockResolvedValue(null);

      const result = await authManager.authenticate(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid credentials");
    });
  });

  describe("Token Refresh", () => {
    test("should refresh valid tokens", async () => {
      const user = { userId: "user123", role: "physician" };
      const refreshToken = authManager.generateRefreshToken(user);

      const result = await authManager.refreshToken(refreshToken);

      expect(result.success).toBe(true);
      expect(result.token).toMatch(/^jwt\./);
      expect(result.refreshToken).toMatch(/^jwt\./);
    });

    test("should reject invalid refresh tokens", async () => {
      const invalidRefreshToken = "invalid.refresh.token";

      const result = await authManager.refreshToken(invalidRefreshToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid refresh token");
    });
  });

  describe("Session Management", () => {
    test("should create secure sessions", () => {
      const user = { userId: "user123", role: "physician" };
      const sessionData = {
        ipAddress: "192.168.1.1",
        userAgent: "Medical App v2.1.0",
        permissions: ["read_patients", "create_assessments"],
      };

      const session = authManager.createSession(user, sessionData);

      expect(session.sessionId).toBeDefined();
      expect(session.userId).toBe("user123");
      expect(session.ipAddress).toBe("192.168.1.1");
      expect(session.permissions).toEqual(["read_patients", "create_assessments"]);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.lastActivity).toBeInstanceOf(Date);
    });

    test("should validate active sessions", () => {
      const user = { userId: "user123", role: "physician" };
      const session = authManager.createSession(user, {});

      const isValid = authManager.validateSession(session.sessionId);
      expect(isValid).toBe(true);

      const invalidResult = authManager.validateSession("invalid-session-id");
      expect(invalidResult).toBe(false);
    });

    test("should revoke sessions", () => {
      const user = { userId: "user123", role: "physician" };
      const session = authManager.createSession(user, {});

      expect(authManager.validateSession(session.sessionId)).toBe(true);

      authManager.revokeSession(session.sessionId);
      expect(authManager.validateSession(session.sessionId)).toBe(false);
    });
  });

  describe("Permission Management", () => {
    test("should check user permissions", () => {
      const user = {
        userId: "physician1",
        role: "physician",
        permissions: ["read_patients", "create_assessments", "modify_treatments"],
      };

      expect(authManager.hasPermission(user, "read_patients")).toBe(true);
      expect(authManager.hasPermission(user, "delete_patients")).toBe(false);
    });

    test("should check role-based permissions", () => {
      const physician = { role: "physician" };
      const nurse = { role: "nurse" };
      const admin = { role: "admin" };

      expect(authManager.hasRolePermission(physician, "create_assessments")).toBe(true);
      expect(authManager.hasRolePermission(nurse, "create_assessments")).toBe(true);
      expect(authManager.hasRolePermission(nurse, "modify_treatments")).toBe(false);
      expect(authManager.hasRolePermission(admin, "manage_users")).toBe(true);
    });
  });

  describe("Audit Logging", () => {
    test("should log security events", () => {
      const event = {
        type: "AUTHENTICATION_SUCCESS",
        userId: "physician1",
        ipAddress: "192.168.1.1",
        details: "Successful login",
      };

      authManager.logSecurityEvent(event);

      expect(mockAuditLogger.logSecurityEvent).toHaveBeenCalledWith(
        event.type,
        event.userId,
        event.ipAddress,
        event.details,
      );
    });

    test("should log password changes", () => {
      authManager.logPasswordChange("physician1", "192.168.1.1");

      expect(mockAuditLogger.logSecurityEvent).toHaveBeenCalledWith(
        "PASSWORD_CHANGE",
        "physician1",
        "192.168.1.1",
        "Password changed successfully",
      );
    });
  });

  describe("Error Handling", () => {
    test("should handle authentication errors gracefully", async () => {
      const credentials = { username: "user", password: "pass" };

      authManager.getUserByUsername = jest.fn().mockRejectedValue(new Error("Database error"));

      const result = await authManager.authenticate(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Authentication service unavailable");
    });

    test("should throw AuthenticationError for critical failures", async () => {
      const credentials = { username: "", password: "" };

      await expect(authManager.authenticate(credentials))
        .rejects.toThrow(AuthenticationError);
    });
  });

  describe("AuthResult Class", () => {
    test("should create successful auth result", () => {
      const user = { userId: "user123" };
      const result = AuthResult.success(user, "token123", "refresh123");

      expect(result.success).toBe(true);
      expect(result.user).toBe(user);
      expect(result.token).toBe("token123");
      expect(result.refreshToken).toBe("refresh123");
      expect(result.error).toBeNull();
    });

    test("should create failed auth result", () => {
      const result = AuthResult.failure("Invalid credentials");

      expect(result.success).toBe(false);
      expect(result.user).toBeNull();
      expect(result.token).toBeNull();
      expect(result.refreshToken).toBeNull();
      expect(result.error).toBe("Invalid credentials");
    });
  });

  describe("TokenValidationResult Class", () => {
    test("should create valid token result", () => {
      const payload = { userId: "user123" };
      const result = TokenValidationResult.valid(payload);

      expect(result.isValid).toBe(true);
      expect(result.payload).toBe(payload);
      expect(result.error).toBeNull();
    });

    test("should create invalid token result", () => {
      const result = TokenValidationResult.invalid("Token expired");

      expect(result.isValid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBe("Token expired");
    });
  });
});
