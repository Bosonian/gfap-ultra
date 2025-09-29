/**
 * Medical Compliance Validation Test Suite
 * HIPAA, FDA 21CFR11, IEC 62304, GDPR Compliance Testing
 */

import {
  MedicalComplianceValidator,
  ComplianceStandard,
  ComplianceStatus,
  ViolationSeverity,
  ComplianceValidationError
} from '../../compliance/medical-compliance-validator.js';

// Mock dependencies
jest.mock('../../security/environment.js', () => ({
  EnvironmentConfig: {
    getInstance: jest.fn(() => ({
      environment: 'test',
      getSecurityConfig: jest.fn(() => ({
        level: 'HIGH',
        auditLogging: true,
        sessionTimeout: 3600000,
        maxLoginAttempts: 5,
        encryptionRequired: true,
        encryptionKey: 'test_encryption_key_32_chars_long'
      })),
      getMedicalConfig: jest.fn(() => ({
        hipaaCompliance: true,
        dataRetentionDays: 2555,
        auditRequired: true,
        encryptionRequired: true
      }))
    }))
  }
}));

jest.mock('../../analytics/audit-trail.js', () => ({
  ClinicalAuditTrail: jest.fn().mockImplementation(() => ({
    logComplianceEvent: jest.fn(),
    logPatientDataAccess: jest.fn(),
    logClinicalDecision: jest.fn(),
    getStatus: jest.fn().mockResolvedValue({
      enabled: true,
      eventCount: 1000,
      lastEvent: new Date()
    }),
    verifyIntegrity: jest.fn().mockResolvedValue({
      integrityScore: 0.98,
      totalEvents: 1000,
      verifiedEvents: 980,
      failedEvents: 20
    })
  }))
}));

describe('MedicalComplianceValidator', () => {
  let validator;
  let mockAuditTrail;

  beforeEach(() => {
    mockAuditTrail = {
      logComplianceEvent: jest.fn(),
      logPatientDataAccess: jest.fn(),
      logClinicalDecision: jest.fn(),
      getStatus: jest.fn().mockResolvedValue({
        enabled: true,
        eventCount: 1000
      }),
      verifyIntegrity: jest.fn().mockResolvedValue({
        integrityScore: 0.98
      })
    };

    validator = new MedicalComplianceValidator({
      enabledStandards: [
        ComplianceStandard.HIPAA,
        ComplianceStandard.FDA_21CFR11,
        ComplianceStandard.GDPR
      ],
      auditTrail: mockAuditTrail,
      strictMode: true
    });
  });

  describe('Initialization', () => {
    test('should initialize with default configuration', () => {
      const defaultValidator = new MedicalComplianceValidator();

      expect(defaultValidator.config.enabledStandards).toContain(ComplianceStandard.HIPAA);
      expect(defaultValidator.config.enabledStandards).toContain(ComplianceStandard.FDA_21CFR11);
      expect(defaultValidator.config.enabledStandards).toContain(ComplianceStandard.GDPR);
      expect(defaultValidator.config.strictMode).toBe(true);
    });

    test('should initialize with custom configuration', () => {
      expect(validator.config.enabledStandards.length).toBe(3);
      expect(validator.config.auditTrail).toBe(mockAuditTrail);
      expect(validator.config.strictMode).toBe(true);
    });

    test('should initialize compliance rule engines', () => {
      expect(validator.complianceRules[ComplianceStandard.HIPAA]).toBeDefined();
      expect(validator.complianceRules[ComplianceStandard.FDA_21CFR11]).toBeDefined();
      expect(validator.complianceRules[ComplianceStandard.GDPR]).toBeDefined();
    });
  });

  describe('System Compliance Validation', () => {
    test('should validate overall system compliance', async () => {
      const result = await validator.validateSystemCompliance();

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('standards');
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('nextValidationDue');

      expect(result.standards[ComplianceStandard.HIPAA]).toBeDefined();
      expect(result.standards[ComplianceStandard.FDA_21CFR11]).toBeDefined();
      expect(result.standards[ComplianceStandard.GDPR]).toBeDefined();

      expect(result.overall).toHaveProperty('compliant');
      expect(result.overall).toHaveProperty('violations');
      expect(result.overall).toHaveProperty('warnings');
      expect(result.overall).toHaveProperty('recommendations');
    });

    test('should handle compliance validation errors gracefully', async () => {
      // Mock a validation error
      validator.complianceRules[ComplianceStandard.HIPAA].validateDataProtection =
        jest.fn().mockRejectedValue(new Error('Validation service unavailable'));

      const result = await validator.validateSystemCompliance();

      expect(result.overall.compliant).toBe(false);
      expect(result.overall.violations.length).toBeGreaterThan(0);

      const validationError = result.overall.violations.find(
        v => v.type === 'validation_failure'
      );
      expect(validationError).toBeDefined();
      expect(validationError.standard).toBe(ComplianceStandard.HIPAA);
    });

    test('should log compliance validation events', async () => {
      await validator.validateSystemCompliance();

      expect(mockAuditTrail.logComplianceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'system_compliance_validation',
          standards: validator.config.enabledStandards
        })
      );
    });
  });

  describe('Standard-Specific Validation', () => {
    test('should validate individual compliance standards', async () => {
      const result = await validator.validateStandard(ComplianceStandard.HIPAA);

      expect(result.standard).toBe(ComplianceStandard.HIPAA);
      expect(result.status).toBeDefined();
      expect(result.violations).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.validatedAt).toBeInstanceOf(Date);
      expect(result.validatedBy).toBe('automated_compliance_validator');
    });

    test('should throw error for unknown compliance standard', async () => {
      await expect(
        validator.validateStandard('UNKNOWN_STANDARD')
      ).rejects.toThrow(ComplianceValidationError);
    });

    test('should cache validation results', async () => {
      await validator.validateStandard(ComplianceStandard.HIPAA);
      await validator.validateStandard(ComplianceStandard.FDA_21CFR11);

      expect(validator.validationCache.size).toBeGreaterThan(0);
    });
  });

  describe('Patient Data Handling Validation', () => {
    let mockPatientData;
    let mockUser;

    beforeEach(() => {
      mockPatientData = {
        patientId: 'PT12345',
        demographics: {
          age: 65,
          gender: 'M'
        },
        strokeAssessment: {
          nihssScore: 8,
          gfapLevel: 150.5
        },
        sensitiveData: {
          ssn: '123-45-6789',
          insuranceNumber: 'INS987654'
        }
      };

      mockUser = {
        userId: 'physician123',
        role: 'physician',
        department: 'neurology',
        permissions: ['view_patient_data', 'create_assessments']
      };
    });

    test('should validate HIPAA minimum necessary compliance', async () => {
      const result = await validator.validatePatientDataHandling(
        mockPatientData,
        'view_assessment',
        mockUser
      );

      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('violations');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('recommendations');

      expect(mockAuditTrail.logPatientDataAccess).toHaveBeenCalledWith(
        mockUser,
        mockPatientData.patientId,
        expect.objectContaining({
          operation: 'view_assessment',
          dataElements: Object.keys(mockPatientData)
        })
      );
    });

    test('should detect excessive data access violations', async () => {
      // Access more data than necessary for the operation
      const excessiveData = {
        ...mockPatientData,
        fullMedicalHistory: 'extensive_history',
        financialInformation: 'billing_data'
      };

      const result = await validator.validatePatientDataHandling(
        excessiveData,
        'view_assessment', // Should only need basic assessment data
        mockUser
      );

      const excessiveAccessViolation = result.violations.find(
        v => v.type === 'excessive_data_access'
      );
      expect(excessiveAccessViolation).toBeDefined();
      expect(excessiveAccessViolation.standard).toBe(ComplianceStandard.HIPAA);
      expect(excessiveAccessViolation.severity).toBe(ViolationSeverity.MEDIUM);
    });

    test('should validate user authorization for data access', async () => {
      const unauthorizedUser = {
        userId: 'clerk123',
        role: 'clerk',
        permissions: ['view_basic_info'] // Limited permissions
      };

      const result = await validator.validatePatientDataHandling(
        mockPatientData,
        'create_assessment', // Requires higher permissions
        unauthorizedUser
      );

      const authViolation = result.violations.find(
        v => v.type === 'unauthorized_access'
      );
      expect(authViolation).toBeDefined();
      expect(authViolation.severity).toBe(ViolationSeverity.HIGH);
    });

    test('should validate GDPR data minimization', async () => {
      const result = await validator.validatePatientDataHandling(
        mockPatientData,
        'research_analysis',
        mockUser
      );

      // Research should not include PII like demographics
      const gdprViolation = result.violations.find(
        v => v.standard === ComplianceStandard.GDPR
      );

      if (gdprViolation) {
        expect(gdprViolation.type).toBe('data_minimization_violation');
        expect(gdprViolation.article).toBe('Article 5(1)(c)');
      }
    });
  });

  describe('Clinical Decision Compliance Validation', () => {
    let mockDecision;
    let mockEvidence;
    let mockUser;

    beforeEach(() => {
      mockDecision = {
        id: 'decision123',
        type: 'treatment_recommendation',
        recommendation: 'thrombolysis',
        aiAssisted: true,
        electronicSignature: {
          userId: 'physician123',
          timestamp: new Date(),
          hash: 'signature_hash_123',
          biometricData: 'fingerprint_hash'
        }
      };

      mockEvidence = {
        algorithmValidation: {
          validated: true,
          accuracy: 0.92,
          sensitivity: 0.89,
          specificity: 0.94
        },
        riskAnalysis: {
          completed: true,
          riskLevel: 'medium',
          mitigations: ['human_oversight', 'audit_trail']
        },
        clinicalGuidelines: ['stroke_guidelines_2025']
      };

      mockUser = {
        userId: 'physician123',
        role: 'physician',
        department: 'neurology'
      };
    });

    test('should validate FDA 21CFR11 electronic signature compliance', async () => {
      const result = await validator.validateClinicalDecisionCompliance(
        mockDecision,
        mockEvidence,
        mockUser
      );

      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('violations');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('decisionId');

      expect(mockAuditTrail.logClinicalDecision).toHaveBeenCalledWith(
        mockUser,
        mockDecision.id,
        expect.objectContaining({
          decisionType: mockDecision.type,
          aiAssisted: mockDecision.aiAssisted
        })
      );
    });

    test('should detect missing electronic signature violations', async () => {
      const decisionWithoutSignature = {
        ...mockDecision,
        electronicSignature: null
      };

      const result = await validator.validateClinicalDecisionCompliance(
        decisionWithoutSignature,
        mockEvidence,
        mockUser
      );

      const signatureViolation = result.violations.find(
        v => v.type === 'missing_electronic_signature'
      );
      expect(signatureViolation).toBeDefined();
      expect(signatureViolation.standard).toBe(ComplianceStandard.FDA_21CFR11);
      expect(signatureViolation.severity).toBe(ViolationSeverity.HIGH);
      expect(signatureViolation.section).toBe('21CFR11.100');
    });

    test('should validate IEC 62304 algorithm validation requirements', async () => {
      const insufficientEvidence = {
        ...mockEvidence,
        algorithmValidation: null,
        riskAnalysis: null
      };

      const result = await validator.validateClinicalDecisionCompliance(
        mockDecision,
        insufficientEvidence,
        mockUser
      );

      const algorithmViolation = result.violations.find(
        v => v.type === 'insufficient_algorithm_validation'
      );
      expect(algorithmViolation).toBeDefined();
      expect(algorithmViolation.standard).toBe(ComplianceStandard.IEC_62304);
      expect(algorithmViolation.section).toBe('5.1.1');
    });

    test('should validate electronic signature integrity', () => {
      const validSignature = mockDecision.electronicSignature;
      const isValid = validator.validateElectronicSignature(validSignature);
      expect(isValid).toBe(true);

      const invalidSignature = {
        userId: 'physician123',
        timestamp: new Date()
        // Missing hash and biometric data
      };
      const isInvalid = validator.validateElectronicSignature(invalidSignature);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Security Compliance Validation', () => {
    test('should validate encryption compliance', async () => {
      const result = await validator.validateSecurityCompliance();

      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('violations');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('securityScore');

      expect(typeof result.securityScore).toBe('number');
      expect(result.securityScore).toBeGreaterThanOrEqual(0);
      expect(result.securityScore).toBeLessThanOrEqual(100);
    });

    test('should detect encryption compliance violations', async () => {
      // Mock weak encryption configuration
      validator.environmentConfig.getSecurityConfig = jest.fn(() => ({
        encryptionRequired: false,
        encryptionKey: 'short_key' // Too short
      }));

      const result = await validator.validateSecurityCompliance();

      const encryptionViolation = result.violations.find(
        v => v.type === 'encryption_at_rest_disabled'
      );
      expect(encryptionViolation).toBeDefined();
      expect(encryptionViolation.severity).toBe(ViolationSeverity.CRITICAL);

      const weakKeyViolation = result.violations.find(
        v => v.type === 'weak_encryption_key'
      );
      expect(weakKeyViolation).toBeDefined();
      expect(weakKeyViolation.severity).toBe(ViolationSeverity.HIGH);
    });

    test('should validate access control compliance', async () => {
      // Mock long session timeout
      validator.environmentConfig.getSecurityConfig = jest.fn(() => ({
        sessionTimeout: 7200000, // 2 hours - exceeds recommendation
        maxLoginAttempts: 10 // Too many attempts
      }));

      const result = await validator.validateSecurityCompliance();

      const sessionWarning = result.warnings.find(
        w => w.type === 'long_session_timeout'
      );
      expect(sessionWarning).toBeDefined();

      const loginWarning = result.warnings.find(
        w => w.type === 'high_login_attempts'
      );
      expect(loginWarning).toBeDefined();
    });

    test('should validate audit logging compliance', async () => {
      // Mock disabled audit trail
      mockAuditTrail.getStatus.mockResolvedValue({
        enabled: false
      });

      const result = await validator.validateSecurityCompliance();

      const auditViolation = result.violations.find(
        v => v.type === 'audit_trail_disabled'
      );
      expect(auditViolation).toBeDefined();
      expect(auditViolation.severity).toBe(ViolationSeverity.CRITICAL);
    });

    test('should detect audit integrity issues', async () => {
      // Mock compromised audit integrity
      mockAuditTrail.verifyIntegrity.mockResolvedValue({
        integrityScore: 0.85 // Below 0.95 threshold
      });

      const result = await validator.validateSecurityCompliance();

      const integrityViolation = result.violations.find(
        v => v.type === 'audit_integrity_compromised'
      );
      expect(integrityViolation).toBeDefined();
      expect(integrityViolation.severity).toBe(ViolationSeverity.HIGH);
    });
  });

  describe('Data Retention Compliance Validation', () => {
    test('should validate data retention compliance', async () => {
      const result = await validator.validateDataRetentionCompliance();

      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('violations');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('retentionPeriod');
      expect(result).toHaveProperty('nextArchivalDue');
    });

    test('should detect insufficient retention period', async () => {
      // Mock short retention period
      validator.environmentConfig.getMedicalConfig = jest.fn(() => ({
        dataRetentionDays: 365 // 1 year - insufficient for medical data
      }));

      const result = await validator.validateDataRetentionCompliance();

      const retentionViolation = result.violations.find(
        v => v.type === 'insufficient_retention_period'
      );
      expect(retentionViolation).toBeDefined();
      expect(retentionViolation.severity).toBe(ViolationSeverity.HIGH);
      expect(retentionViolation.standards).toContain(ComplianceStandard.HIPAA);
    });

    test('should validate secure deletion procedures', async () => {
      // Mock validateArchivalPolicy to return missing secure deletion
      validator.validateArchivalPolicy = jest.fn().mockResolvedValue({
        secureDeleteionImplemented: false
      });

      const result = await validator.validateDataRetentionCompliance();

      const deletionViolation = result.violations.find(
        v => v.type === 'missing_secure_deletion'
      );
      expect(deletionViolation).toBeDefined();
      expect(deletionViolation.severity).toBe(ViolationSeverity.MEDIUM);
    });
  });

  describe('Compliance Reporting', () => {
    test('should generate comprehensive compliance report', async () => {
      const report = await validator.generateComplianceReport();

      expect(report).toHaveProperty('generatedAt');
      expect(report).toHaveProperty('generatedBy');
      expect(report).toHaveProperty('version');
      expect(report).toHaveProperty('standards');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('recommendations');
      expect(report).toHaveProperty('remediationPlan');

      expect(report.summary).toHaveProperty('overallCompliant');
      expect(report.summary).toHaveProperty('totalViolations');
      expect(report.summary).toHaveProperty('criticalViolations');
      expect(report.summary).toHaveProperty('standardsEvaluated');

      expect(Array.isArray(report.recommendations)).toBe(true);
      expect(Array.isArray(report.remediationPlan)).toBe(true);
    });

    test('should generate report for specific standards', async () => {
      const customStandards = [ComplianceStandard.HIPAA, ComplianceStandard.GDPR];
      const report = await validator.generateComplianceReport(customStandards);

      expect(Object.keys(report.standards)).toEqual(customStandards);
      expect(report.summary.standardsEvaluated).toBe(2);
    });

    test('should log compliance report generation', async () => {
      await validator.generateComplianceReport();

      expect(mockAuditTrail.logComplianceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'compliance_report_generated'
        })
      );
    });
  });

  describe('Real-time Compliance Monitoring', () => {
    test('should start compliance monitoring', () => {
      const monitoringOptions = {
        interval: 60000, // 1 minute
        alertThreshold: ViolationSeverity.HIGH
      };

      const monitorId = validator.startComplianceMonitoring(monitoringOptions);

      expect(validator.complianceMonitor).toBeDefined();
      expect(typeof validator.complianceMonitor).toBe('object');

      // Clean up
      validator.stopComplianceMonitoring();
    });

    test('should stop compliance monitoring', () => {
      validator.startComplianceMonitoring();
      expect(validator.complianceMonitor).toBeDefined();

      validator.stopComplianceMonitoring();
      expect(validator.complianceMonitor).toBeNull();
    });

    test('should handle monitoring errors gracefully', async () => {
      // Mock monitoring error
      validator.performQuickComplianceCheck = jest.fn().mockRejectedValue(
        new Error('Monitoring service unavailable')
      );

      validator.startComplianceMonitoring({ interval: 100 });

      // Wait for monitoring cycle
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(mockAuditTrail.logComplianceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'monitoring_error',
          error: 'Monitoring service unavailable'
        })
      );

      validator.stopComplianceMonitoring();
    });
  });

  describe('Security Score Calculation', () => {
    test('should calculate security score correctly', () => {
      const violations = [
        { severity: ViolationSeverity.CRITICAL },
        { severity: ViolationSeverity.HIGH },
        { severity: ViolationSeverity.MEDIUM }
      ];

      const warnings = [
        { severity: ViolationSeverity.LOW },
        { severity: ViolationSeverity.LOW }
      ];

      const score = validator.calculateSecurityScore(violations, warnings);

      // Starting score: 100
      // Critical: -25, High: -15, Medium: -10, Warning: -2 each
      // Expected: 100 - 25 - 15 - 10 - 2 - 2 = 46
      expect(score).toBe(46);
    });

    test('should not return negative security scores', () => {
      const manyViolations = Array(10).fill({ severity: ViolationSeverity.CRITICAL });
      const score = validator.calculateSecurityScore(manyViolations, []);

      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Recommendations Generation', () => {
    test('should generate recommendations for violations', () => {
      const violations = [
        { type: 'excessive_data_access' },
        { type: 'missing_electronic_signature' },
        { type: 'weak_encryption_key' }
      ];

      const recommendations = validator.generateRecommendations(violations, []);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      const accessRecommendation = recommendations.find(
        r => r.action.includes('role-based data access')
      );
      expect(accessRecommendation).toBeDefined();
      expect(accessRecommendation.priority).toBe('high');

      const signatureRecommendation = recommendations.find(
        r => r.action.includes('electronic signature')
      );
      expect(signatureRecommendation).toBeDefined();

      const encryptionRecommendation = recommendations.find(
        r => r.action.includes('encryption key')
      );
      expect(encryptionRecommendation).toBeDefined();
      expect(encryptionRecommendation.priority).toBe('critical');
    });
  });

  describe('Remediation Plan Generation', () => {
    test('should generate remediation plan from standards results', async () => {
      const standardsResults = {
        [ComplianceStandard.HIPAA]: {
          violations: [
            {
              type: 'excessive_data_access',
              severity: ViolationSeverity.HIGH,
              message: 'Test violation'
            }
          ]
        },
        [ComplianceStandard.FDA_21CFR11]: {
          violations: [
            {
              type: 'missing_electronic_signature',
              severity: ViolationSeverity.CRITICAL,
              message: 'Critical violation'
            }
          ]
        }
      };

      const remediationPlan = await validator.generateRemediationPlan(standardsResults);

      expect(Array.isArray(remediationPlan)).toBe(true);
      expect(remediationPlan.length).toBe(2);

      // Should be sorted by severity (critical first)
      expect(remediationPlan[0].severity).toBe(ViolationSeverity.CRITICAL);
      expect(remediationPlan[1].severity).toBe(ViolationSeverity.HIGH);

      // Check structure
      remediationPlan.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('standard');
        expect(item).toHaveProperty('violation');
        expect(item).toHaveProperty('severity');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('timeline');
        expect(item).toHaveProperty('status');
      });
    });
  });

  describe('Validation Context Building', () => {
    test('should build comprehensive validation context', async () => {
      // Mock additional context methods
      validator.getSystemMetadata = jest.fn().mockResolvedValue({
        version: '2.1.0',
        deploymentDate: new Date()
      });
      validator.getActiveUserSessions = jest.fn().mockResolvedValue([]);
      validator.getDataInventory = jest.fn().mockResolvedValue({
        patientRecords: 1000,
        assessments: 5000
      });

      const context = await validator.buildValidationContext(ComplianceStandard.HIPAA);

      expect(context).toHaveProperty('environment');
      expect(context).toHaveProperty('securityConfig');
      expect(context).toHaveProperty('medicalConfig');
      expect(context).toHaveProperty('systemMetadata');
      expect(context).toHaveProperty('auditTrailStatus');
      expect(context).toHaveProperty('userSessions');
      expect(context).toHaveProperty('dataInventory');
    });
  });

  describe('Next Validation Date Calculation', () => {
    test('should calculate next validation date', () => {
      const nextValidation = validator.calculateNextValidationDate();

      expect(nextValidation).toBeInstanceOf(Date);
      expect(nextValidation.getTime()).toBeGreaterThan(Date.now());

      // Should be approximately one month from now
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      const timeDifference = Math.abs(nextValidation.getTime() - oneMonthFromNow.getTime());
      expect(timeDifference).toBeLessThan(24 * 60 * 60 * 1000); // Within 24 hours
    });
  });
});

describe('ComplianceValidationError', () => {
  test('should create compliance validation error', () => {
    const error = new ComplianceValidationError(
      'Test violation',
      ComplianceStandard.HIPAA,
      'test_violation',
      ViolationSeverity.HIGH
    );

    expect(error.name).toBe('ComplianceValidationError');
    expect(error.message).toBe('Test violation');
    expect(error.standard).toBe(ComplianceStandard.HIPAA);
    expect(error.violationType).toBe('test_violation');
    expect(error.severity).toBe(ViolationSeverity.HIGH);
    expect(error).toBeInstanceOf(Error);
  });

  test('should use default severity if not provided', () => {
    const error = new ComplianceValidationError(
      'Test violation',
      ComplianceStandard.GDPR,
      'test_violation'
    );

    expect(error.severity).toBe(ViolationSeverity.MEDIUM);
  });
});

describe('Compliance Standards and Constants', () => {
  test('should define all required compliance standards', () => {
    const requiredStandards = [
      'HIPAA',
      'FDA_21CFR11',
      'IEC_62304',
      'GDPR',
      'ISO_14155',
      'ISO_27001'
    ];

    requiredStandards.forEach(standard => {
      expect(ComplianceStandard[standard]).toBeDefined();
      expect(typeof ComplianceStandard[standard]).toBe('string');
    });
  });

  test('should define compliance status values', () => {
    const requiredStatuses = [
      'COMPLIANT',
      'NON_COMPLIANT',
      'NEEDS_REVIEW',
      'PENDING_VALIDATION'
    ];

    requiredStatuses.forEach(status => {
      expect(ComplianceStatus[status]).toBeDefined();
      expect(typeof ComplianceStatus[status]).toBe('string');
    });
  });

  test('should define violation severity levels', () => {
    const requiredSeverities = [
      'CRITICAL',
      'HIGH',
      'MEDIUM',
      'LOW',
      'INFORMATIONAL'
    ];

    requiredSeverities.forEach(severity => {
      expect(ViolationSeverity[severity]).toBeDefined();
      expect(typeof ViolationSeverity[severity]).toBe('string');
    });
  });
});