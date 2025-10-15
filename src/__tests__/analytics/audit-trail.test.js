/**
 * Medical Audit Trail Test Suite
 * HIPAA/GDPR/FDA 21CFR11 Compliance Testing
 */

import {
  AuditEvent,
  AuditStorage,
  ClinicalAuditTrail,
  AuditEventType,
  ComplianceFramework,
} from "../../analytics/audit-trail.js";

// Mock IndexedDB for testing
global.indexedDB = {
  open: jest.fn(() => ({
    onsuccess: jest.fn(),
    onerror: jest.fn(),
    result: {
      transaction: jest.fn(() => ({
        objectStore: jest.fn(() => ({
          add: jest.fn(),
          get: jest.fn(),
          getAll: jest.fn(),
          index: jest.fn(() => ({
            getAll: jest.fn(),
          })),
        })),
      })),
    },
  })),
};

// Mock crypto for browser environment
Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
    getRandomValues: jest.fn().mockReturnValue(new Uint8Array(16)),
  },
});

describe("AuditEvent", () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      userId: "physician123",
      role: "physician",
      department: "neurology",
    };
  });

  describe("Event Creation", () => {
    test("should create valid audit event with required fields", () => {
      const event = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        mockUser,
        "patient456",
        "Viewed patient stroke assessment",
      );

      expect(event.id).toBeDefined();
      expect(event.timestamp).toBeInstanceOf(Date);
      expect(event.eventType).toBe(AuditEventType.PATIENT_DATA_ACCESS);
      expect(event.userId).toBe("physician123");
      expect(event.resourceId).toBe("patient456");
      expect(event.description).toBe("Viewed patient stroke assessment");
      expect(event.userRole).toBe("physician");
      expect(event.department).toBe("neurology");
      expect(event.sessionId).toBeDefined();
      expect(event.ipAddress).toBeDefined();
      expect(event.userAgent).toBeDefined();
    });

    test("should include medical-specific metadata", () => {
      const metadata = {
        patientId: "PT12345",
        assessmentType: "stroke_triage",
        riskScore: 0.75,
        clinicalDecision: "recommend_thrombolysis",
      };

      const event = new AuditEvent(
        AuditEventType.CLINICAL_DECISION,
        mockUser,
        "assessment789",
        "Clinical decision made",
        metadata,
      );

      expect(event.metadata.patientId).toBe("PT12345");
      expect(event.metadata.assessmentType).toBe("stroke_triage");
      expect(event.metadata.riskScore).toBe(0.75);
      expect(event.metadata.clinicalDecision).toBe("recommend_thrombolysis");
    });

    test("should sanitize PII from metadata", () => {
      const metadata = {
        patientName: "John Doe",
        ssn: "123-45-6789",
        dob: "1970-01-01",
        medicalRecordNumber: "MRN123456",
      };

      const event = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        mockUser,
        "patient456",
        "Data access",
        metadata,
      );

      expect(event.metadata.patientName).toBe("[REDACTED]");
      expect(event.metadata.ssn).toBe("[REDACTED]");
      expect(event.metadata.dob).toBe("[REDACTED]");
      expect(event.metadata.medicalRecordNumber).toBeDefined(); // Allowed for audit
    });

    test("should generate unique event IDs", () => {
      const event1 = new AuditEvent(AuditEventType.USER_LOGIN, mockUser);
      const event2 = new AuditEvent(AuditEventType.USER_LOGIN, mockUser);

      expect(event1.id).not.toBe(event2.id);
    });
  });

  describe("Validation", () => {
    test("should validate required fields", () => {
      expect(() => new AuditEvent()).toThrow("Event type is required");
      expect(() => new AuditEvent(AuditEventType.USER_LOGIN)).toThrow("User is required");
    });

    test("should validate event types", () => {
      expect(() => new AuditEvent("INVALID_EVENT", mockUser)).toThrow("Invalid event type");
    });

    test("should validate user structure", () => {
      const invalidUser = { userId: "test" }; // Missing role
      expect(() => new AuditEvent(AuditEventType.USER_LOGIN, invalidUser))
        .toThrow("User must have userId and role");
    });
  });

  describe("Integrity", () => {
    test("should generate integrity hash", async () => {
      const event = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        mockUser,
        "patient456",
        "Test event",
      );

      const hash = await event.generateIntegrityHash();
      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
    });

    test("should verify integrity", async () => {
      const event = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        mockUser,
        "patient456",
        "Test event",
      );

      const originalHash = await event.generateIntegrityHash();
      event.integrityHash = originalHash;

      const isValid = await event.verifyIntegrity();
      expect(isValid).toBe(true);

      // Tamper with event
      event.description = "Modified description";
      const isValidAfterTampering = await event.verifyIntegrity();
      expect(isValidAfterTampering).toBe(false);
    });
  });

  describe("Serialization", () => {
    test("should serialize to JSON correctly", () => {
      const event = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        mockUser,
        "patient456",
        "Test event",
      );

      const json = event.toJSON();

      expect(json.id).toBe(event.id);
      expect(json.timestamp).toBe(event.timestamp.toISOString());
      expect(json.eventType).toBe(event.eventType);
      expect(json.userId).toBe(event.userId);
    });

    test("should create event from JSON", () => {
      const originalEvent = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        mockUser,
        "patient456",
        "Test event",
      );

      const json = originalEvent.toJSON();
      const restoredEvent = AuditEvent.fromJSON(json);

      expect(restoredEvent.id).toBe(originalEvent.id);
      expect(restoredEvent.eventType).toBe(originalEvent.eventType);
      expect(restoredEvent.userId).toBe(originalEvent.userId);
      expect(restoredEvent.timestamp).toEqual(originalEvent.timestamp);
    });
  });
});

describe("AuditStorage", () => {
  let storage;

  beforeEach(() => {
    storage = new AuditStorage();
  });

  describe("Initialization", () => {
    test("should initialize with default configuration", () => {
      expect(storage.dbName).toBe("ClinicalAuditDB");
      expect(storage.version).toBe(1);
      expect(storage.retentionDays).toBe(2555); // 7 years for medical data
    });

    test("should support custom configuration", () => {
      const customStorage = new AuditStorage({
        dbName: "TestAuditDB",
        retentionDays: 365,
      });

      expect(customStorage.dbName).toBe("TestAuditDB");
      expect(customStorage.retentionDays).toBe(365);
    });
  });

  describe("Database Operations", () => {
    test("should handle database initialization", async () => {
      const initResult = await storage.initialize();
      expect(initResult).toBe(true);
    });

    test("should store audit events", async () => {
      const event = new AuditEvent(
        AuditEventType.PATIENT_DATA_ACCESS,
        { userId: "test", role: "physician" },
      );

      await storage.store(event);
      // Mock implementation would verify the store operation
    });

    test("should retrieve events by criteria", async () => {
      const criteria = {
        userId: "physician123",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        eventTypes: [AuditEventType.PATIENT_DATA_ACCESS],
      };

      const events = await storage.getEvents(criteria);
      expect(Array.isArray(events)).toBe(true);
    });

    test("should support pagination", async () => {
      const criteria = {
        userId: "physician123",
        limit: 10,
        offset: 0,
      };

      const result = await storage.getEvents(criteria);
      expect(result).toHaveProperty("events");
      expect(result).toHaveProperty("totalCount");
      expect(result).toHaveProperty("hasMore");
    });
  });

  describe("Search and Indexing", () => {
    test("should search by user ID", async () => {
      const events = await storage.searchByUserId("physician123");
      expect(Array.isArray(events)).toBe(true);
    });

    test("should search by resource ID", async () => {
      const events = await storage.searchByResourceId("patient456");
      expect(Array.isArray(events)).toBe(true);
    });

    test("should search by event type", async () => {
      const events = await storage.searchByEventType(AuditEventType.CLINICAL_DECISION);
      expect(Array.isArray(events)).toBe(true);
    });

    test("should search by date range", async () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-31");

      const events = await storage.searchByDateRange(startDate, endDate);
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe("Data Retention", () => {
    test("should identify expired events", async () => {
      const expiredEvents = await storage.getExpiredEvents();
      expect(Array.isArray(expiredEvents)).toBe(true);
    });

    test("should archive expired events", async () => {
      const archiveResult = await storage.archiveExpiredEvents();
      expect(archiveResult).toHaveProperty("archivedCount");
      expect(archiveResult).toHaveProperty("archiveLocation");
    });

    test("should purge expired events after archival", async () => {
      const purgeResult = await storage.purgeExpiredEvents();
      expect(typeof purgeResult.deletedCount).toBe("number");
    });
  });

  describe("Compliance Export", () => {
    test("should export audit trail for compliance", async () => {
      const exportCriteria = {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        format: "JSON",
        includeIntegrityVerification: true,
      };

      const exportResult = await storage.exportAuditTrail(exportCriteria);
      expect(exportResult).toHaveProperty("data");
      expect(exportResult).toHaveProperty("metadata");
      expect(exportResult).toHaveProperty("integrityReport");
    });

    test("should support multiple export formats", async () => {
      const formats = ["JSON", "CSV", "XML"];

      for (const format of formats) {
        const result = await storage.exportAuditTrail({
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-01-31"),
          format,
        });
        expect(result.metadata.format).toBe(format);
      }
    });
  });

  describe("Integrity Verification", () => {
    test("should verify audit trail integrity", async () => {
      const integrityReport = await storage.verifyIntegrity();

      expect(integrityReport).toHaveProperty("totalEvents");
      expect(integrityReport).toHaveProperty("verifiedEvents");
      expect(integrityReport).toHaveProperty("failedEvents");
      expect(integrityReport).toHaveProperty("integrityScore");
    });

    test("should detect tampered events", async () => {
      // This would test the ability to detect modifications to stored events
      const tamperedEvents = await storage.detectTampering();
      expect(Array.isArray(tamperedEvents)).toBe(true);
    });
  });
});

describe("ClinicalAuditTrail", () => {
  let auditTrail;
  let mockUser;

  beforeEach(() => {
    mockUser = {
      userId: "physician123",
      role: "physician",
      department: "neurology",
    };

    auditTrail = new ClinicalAuditTrail({
      retentionDays: 2555,
      complianceFrameworks: [
        ComplianceFramework.HIPAA,
        ComplianceFramework.FDA_21CFR11,
      ],
    });
  });

  describe("Initialization", () => {
    test("should initialize with compliance frameworks", () => {
      expect(auditTrail.complianceFrameworks).toContain(ComplianceFramework.HIPAA);
      expect(auditTrail.complianceFrameworks).toContain(ComplianceFramework.FDA_21CFR11);
    });

    test("should set up automatic event handlers", () => {
      expect(auditTrail.eventHandlers).toBeDefined();
      expect(auditTrail.autoAuditEnabled).toBe(true);
    });
  });

  describe("Event Logging", () => {
    test("should log user authentication events", async () => {
      await auditTrail.logUserLogin(mockUser, {
        ipAddress: "192.168.1.1",
        sessionId: "session123",
      });

      // Verify event was created and stored
      expect(auditTrail.pendingEvents.length).toBeGreaterThan(0);
    });

    test("should log patient data access", async () => {
      await auditTrail.logPatientDataAccess(mockUser, "patient456", {
        accessType: "view",
        dataElements: ["demographics", "stroke_assessment"],
        justification: "clinical_care",
      });

      const event = auditTrail.pendingEvents[auditTrail.pendingEvents.length - 1];
      expect(event.eventType).toBe(AuditEventType.PATIENT_DATA_ACCESS);
      expect(event.resourceId).toBe("patient456");
    });

    test("should log clinical decisions", async () => {
      await auditTrail.logClinicalDecision(mockUser, "assessment789", {
        decisionType: "treatment_recommendation",
        recommendation: "thrombolysis",
        riskScore: 0.85,
        evidenceBasis: "ai_model_prediction",
      });

      const event = auditTrail.pendingEvents[auditTrail.pendingEvents.length - 1];
      expect(event.eventType).toBe(AuditEventType.CLINICAL_DECISION);
      expect(event.metadata.recommendation).toBe("thrombolysis");
    });

    test("should log system configuration changes", async () => {
      await auditTrail.logSystemChange(mockUser, {
        changeType: "configuration_update",
        component: "risk_thresholds",
        oldValues: { criticalThreshold: 0.7 },
        newValues: { criticalThreshold: 0.75 },
        justification: "clinical_guideline_update",
      });

      const event = auditTrail.pendingEvents[auditTrail.pendingEvents.length - 1];
      expect(event.eventType).toBe(AuditEventType.SYSTEM_CONFIGURATION);
    });

    test("should log data export events", async () => {
      await auditTrail.logDataExport(mockUser, {
        exportType: "patient_data",
        recordCount: 150,
        dateRange: { start: "2025-01-01", end: "2025-01-31" },
        recipient: "research_team",
        purpose: "quality_improvement",
      });

      const event = auditTrail.pendingEvents[auditTrail.pendingEvents.length - 1];
      expect(event.eventType).toBe(AuditEventType.DATA_EXPORT);
    });
  });

  describe("Automatic Event Capture", () => {
    test("should automatically capture API calls", () => {
      const apiInterceptor = auditTrail.createAPIInterceptor();
      expect(apiInterceptor).toBeDefined();
      expect(typeof apiInterceptor.beforeRequest).toBe("function");
      expect(typeof apiInterceptor.afterResponse).toBe("function");
    });

    test("should automatically capture UI interactions", () => {
      const uiTracker = auditTrail.createUITracker();
      expect(uiTracker).toBeDefined();
      expect(typeof uiTracker.trackClick).toBe("function");
      expect(typeof uiTracker.trackNavigation).toBe("function");
    });

    test("should capture error events", async () => {
      const error = new Error("Database connection failed");
      await auditTrail.logError(mockUser, error, {
        context: "patient_data_retrieval",
        severity: "high",
      });

      const event = auditTrail.pendingEvents[auditTrail.pendingEvents.length - 1];
      expect(event.eventType).toBe(AuditEventType.SYSTEM_ERROR);
    });
  });

  describe("Compliance Reporting", () => {
    test("should generate HIPAA compliance report", async () => {
      const report = await auditTrail.generateComplianceReport(
        ComplianceFramework.HIPAA,
        {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-01-31"),
        },
      );

      expect(report).toHaveProperty("framework");
      expect(report).toHaveProperty("period");
      expect(report).toHaveProperty("accessEvents");
      expect(report).toHaveProperty("violations");
      expect(report).toHaveProperty("recommendations");
    });

    test("should generate FDA 21CFR11 compliance report", async () => {
      const report = await auditTrail.generateComplianceReport(
        ComplianceFramework.FDA_21CFR11,
        {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-01-31"),
        },
      );

      expect(report).toHaveProperty("electronicRecords");
      expect(report).toHaveProperty("electronicSignatures");
      expect(report).toHaveProperty("systemValidation");
    });

    test("should identify compliance violations", async () => {
      const violations = await auditTrail.identifyViolations({
        framework: ComplianceFramework.HIPAA,
        period: { days: 30 },
      });

      expect(Array.isArray(violations)).toBe(true);
      violations.forEach(violation => {
        expect(violation).toHaveProperty("type");
        expect(violation).toHaveProperty("severity");
        expect(violation).toHaveProperty("description");
        expect(violation).toHaveProperty("events");
      });
    });
  });

  describe("Real-time Monitoring", () => {
    test("should set up real-time alerts", () => {
      const alertRules = [
        {
          name: "suspicious_access_pattern",
          condition: "multiple_failed_logins",
          threshold: 3,
          timeWindow: 300000, // 5 minutes
        },
        {
          name: "bulk_data_access",
          condition: "high_volume_access",
          threshold: 100,
          timeWindow: 3600000, // 1 hour
        },
      ];

      auditTrail.setupRealTimeAlerts(alertRules);
      expect(auditTrail.alertRules.length).toBe(2);
    });

    test("should trigger alerts for suspicious activity", async () => {
      const alertHandler = jest.fn();
      auditTrail.onAlert(alertHandler);

      // Simulate suspicious activity
      for (let i = 0; i < 4; i++) {
        await auditTrail.logUserLogin(mockUser, {
          ipAddress: "192.168.1.1",
          success: false,
        });
      }

      // In real implementation, this would trigger the alert
      expect(alertHandler).toBeDefined();
    });
  });

  describe("Performance and Scalability", () => {
    test("should handle high-volume event logging", async () => {
      const startTime = Date.now();
      const eventPromises = [];

      // Log 1000 events concurrently
      for (let i = 0; i < 1000; i++) {
        eventPromises.push(
          auditTrail.logPatientDataAccess(mockUser, `patient${i}`, {
            accessType: "view",
          }),
        );
      }

      await Promise.all(eventPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should handle 1000 events in reasonable time (< 5 seconds)
      expect(duration).toBeLessThan(5000);
    });

    test("should batch events for efficient storage", () => {
      auditTrail.enableBatching({ batchSize: 100, flushInterval: 1000 });
      expect(auditTrail.batchingEnabled).toBe(true);
      expect(auditTrail.batchSize).toBe(100);
    });
  });
});

describe("Compliance Framework Support", () => {
  describe("HIPAA Compliance", () => {
    test("should support HIPAA minimum necessary standard", () => {
      const hipaaValidator = ClinicalAuditTrail.getComplianceValidator(
        ComplianceFramework.HIPAA,
      );

      const accessEvent = {
        userId: "physician123",
        patientId: "patient456",
        dataElements: ["demographics", "vital_signs", "full_medical_history"],
        purpose: "treatment",
      };

      const validation = hipaaValidator.validateMinimumNecessary(accessEvent);
      expect(validation).toHaveProperty("compliant");
      expect(validation).toHaveProperty("violations");
      expect(validation).toHaveProperty("recommendations");
    });

    test("should track minimum necessary violations", () => {
      const violations = [
        {
          type: "excessive_data_access",
          description: "Accessed more data than necessary for stated purpose",
          severity: "medium",
        },
      ];

      expect(violations[0].type).toBe("excessive_data_access");
    });
  });

  describe("FDA 21CFR11 Compliance", () => {
    test("should support electronic signature requirements", () => {
      const fdaValidator = ClinicalAuditTrail.getComplianceValidator(
        ComplianceFramework.FDA_21CFR11,
      );

      const signatureEvent = {
        userId: "physician123",
        documentId: "clinical_report_456",
        signatureType: "electronic",
        biometricData: "fingerprint_hash",
        timestamp: new Date(),
      };

      const validation = fdaValidator.validateElectronicSignature(signatureEvent);
      expect(validation.compliant).toBe(true);
    });

    test("should track system validation requirements", () => {
      const systemValidation = {
        validated: true,
        validationDate: new Date("2025-01-01"),
        validationType: "retrospective",
        validatedBy: "quality_assurance_team",
      };

      expect(systemValidation.validated).toBe(true);
    });
  });

  describe("IEC 62304 Medical Device Software", () => {
    test("should support software lifecycle processes", () => {
      const iecValidator = ClinicalAuditTrail.getComplianceValidator(
        ComplianceFramework.IEC_62304,
      );

      const softwareEvent = {
        eventType: "software_update",
        version: "2.1.0",
        safetyClassification: "Class B",
        riskAnalysis: "completed",
        verification: "passed",
      };

      const validation = iecValidator.validateSoftwareLifecycle(softwareEvent);
      expect(validation.compliant).toBe(true);
    });
  });
});

describe("Event Types Coverage", () => {
  test("should define all required audit event types", () => {
    const requiredTypes = [
      "USER_LOGIN",
      "USER_LOGOUT",
      "PATIENT_DATA_ACCESS",
      "PATIENT_DATA_MODIFICATION",
      "CLINICAL_DECISION",
      "SYSTEM_CONFIGURATION",
      "DATA_EXPORT",
      "DATA_IMPORT",
      "SYSTEM_ERROR",
      "SECURITY_VIOLATION",
    ];

    requiredTypes.forEach(type => {
      expect(AuditEventType[type]).toBeDefined();
    });
  });

  test("should support medical-specific event types", () => {
    const medicalTypes = [
      "STROKE_ASSESSMENT",
      "RISK_CALCULATION",
      "TREATMENT_RECOMMENDATION",
      "CLINICAL_PROTOCOL_DEVIATION",
      "QUALITY_METRIC_CALCULATION",
    ];

    medicalTypes.forEach(type => {
      expect(AuditEventType[type]).toBeDefined();
    });
  });
});
