/**
 * Clinical Audit Trail System
 * iGFAP Stroke Triage Assistant - Phase 4 Medical Intelligence
 *
 * Comprehensive audit logging and compliance tracking for clinical decisions
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "../patterns/observer.js";
import { medicalPerformanceMonitor, PerformanceMetricType } from "../performance/medical-performance-monitor.js";
import { predictionCache } from "../performance/medical-cache.js";

/**
 * Audit event types
 */
export const AuditEventTypes = {
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  PATIENT_ACCESS: "patient_access",
  DATA_ENTRY: "data_entry",
  DATA_MODIFICATION: "data_modification",
  PREDICTION_GENERATED: "prediction_generated",
  ALERT_TRIGGERED: "alert_triggered",
  ALERT_ACKNOWLEDGED: "alert_acknowledged",
  TREATMENT_RECOMMENDED: "treatment_recommended",
  REPORT_GENERATED: "report_generated",
  DATA_EXPORT: "data_export",
  SYSTEM_ERROR: "system_error",
  CONFIGURATION_CHANGE: "configuration_change",
  MODEL_PREDICTION: "model_prediction",
  QUALITY_METRIC: "quality_metric",
  CLINICAL_DECISION: "clinical_decision",
};

/**
 * Audit severity levels
 */
export const AuditSeverity = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
};

/**
 * Compliance frameworks
 */
export const ComplianceFrameworks = {
  HIPAA: "hipaa",
  GDPR: "gdpr",
  FDA_21CFR11: "fda_21cfr11",
  IEC_62304: "iec_62304",
  ISO_27001: "iso_27001",
};

/**
 * Audit event data structure
 */
class AuditEvent {
  constructor(eventType, data = {}) {
    this.id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date().toISOString();
    this.eventType = eventType;
    this.severity = data.severity || AuditSeverity.INFO;
    this.userId = data.userId || "system";
    this.sessionId = data.sessionId || null;
    this.patientId = data.patientId || null;
    this.ipAddress = data.ipAddress || this.getClientIP();
    this.userAgent = data.userAgent || navigator.userAgent;
    this.module = data.module || null;
    this.action = data.action || null;
    this.resource = data.resource || null;
    this.oldValue = data.oldValue || null;
    this.newValue = data.newValue || null;
    this.outcome = data.outcome || "success";
    this.errorMessage = data.errorMessage || null;
    this.metadata = data.metadata || {};
    this.compliance = this.determineComplianceRequirements(eventType);
    this.hash = this.calculateHash();
  }

  /**
   * Get client IP address (simplified)
   */
  getClientIP() {
    // In real implementation, this would get actual client IP
    return "127.0.0.1";
  }

  /**
   * Determine compliance requirements for event type
   */
  determineComplianceRequirements(eventType) {
    const requirements = [];

    // HIPAA requirements for PHI access and modifications
    if ([
      AuditEventTypes.PATIENT_ACCESS,
      AuditEventTypes.DATA_ENTRY,
      AuditEventTypes.DATA_MODIFICATION,
      AuditEventTypes.DATA_EXPORT,
      AuditEventTypes.REPORT_GENERATED,
    ].includes(eventType)) {
      requirements.push(ComplianceFrameworks.HIPAA);
    }

    // FDA 21 CFR Part 11 for electronic records
    if ([
      AuditEventTypes.DATA_ENTRY,
      AuditEventTypes.DATA_MODIFICATION,
      AuditEventTypes.REPORT_GENERATED,
      AuditEventTypes.CLINICAL_DECISION,
    ].includes(eventType)) {
      requirements.push(ComplianceFrameworks.FDA_21CFR11);
    }

    // IEC 62304 for medical device software
    if ([
      AuditEventTypes.PREDICTION_GENERATED,
      AuditEventTypes.MODEL_PREDICTION,
      AuditEventTypes.SYSTEM_ERROR,
      AuditEventTypes.CONFIGURATION_CHANGE,
    ].includes(eventType)) {
      requirements.push(ComplianceFrameworks.IEC_62304);
    }

    return requirements;
  }

  /**
   * Calculate event hash for integrity verification
   */
  calculateHash() {
    const dataString = JSON.stringify({
      timestamp: this.timestamp,
      eventType: this.eventType,
      userId: this.userId,
      action: this.action,
      resource: this.resource,
      outcome: this.outcome,
    });

    // Simplified hash calculation - in real implementation use crypto.subtle
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash &= hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16);
  }

  /**
   * Sanitize event for storage (remove sensitive data)
   */
  sanitize() {
    const sanitized = { ...this };

    // Remove or hash sensitive information
    if (sanitized.patientId) {
      sanitized.patientId = this.hashSensitiveData(sanitized.patientId);
    }

    if (sanitized.oldValue && typeof sanitized.oldValue === "object") {
      sanitized.oldValue = this.sanitizeObject(sanitized.oldValue);
    }

    if (sanitized.newValue && typeof sanitized.newValue === "object") {
      sanitized.newValue = this.sanitizeObject(sanitized.newValue);
    }

    return sanitized;
  }

  /**
   * Hash sensitive data
   */
  hashSensitiveData(data) {
    // In real implementation, use proper cryptographic hashing
    return `hash_${data.toString().length}_${Date.now().toString(36)}`;
  }

  /**
   * Sanitize object by removing PII
   */
  sanitizeObject(obj) {
    const sanitized = { ...obj };
    const sensitiveFields = ["name", "ssn", "address", "phone", "email"];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = "[REDACTED]";
      }
    });

    return sanitized;
  }

  /**
   * Export event in compliance format
   */
  exportForCompliance(framework) {
    const baseExport = {
      eventId: this.id,
      timestamp: this.timestamp,
      eventType: this.eventType,
      userId: this.userId,
      outcome: this.outcome,
      hash: this.hash,
    };

    switch (framework) {
    case ComplianceFrameworks.HIPAA:
      return {
        ...baseExport,
        patientId: this.patientId ? "[PROTECTED]" : null,
        accessType: this.action,
        reasonForAccess: this.metadata.reason || "Clinical care",
        minimalNecessary: true,
      };

    case ComplianceFrameworks.FDA_21CFR11:
      return {
        ...baseExport,
        electronicSignature: this.metadata.signature || null,
        recordIntegrity: this.hash,
        auditTrailComplete: true,
        dataModification: {
          old: this.oldValue ? "[RECORDED]" : null,
          new: this.newValue ? "[RECORDED]" : null,
        },
      };

    case ComplianceFrameworks.IEC_62304:
      return {
        ...baseExport,
        softwareVersion: this.metadata.version || "1.0",
        riskClass: this.metadata.riskClass || "B",
        safetyRequirement: this.metadata.safetyRequirement || null,
        traceabilityId: this.metadata.traceabilityId || null,
      };

    default:
      return baseExport;
    }
  }
}

/**
 * Audit trail storage and management
 */
class AuditStorage {
  constructor() {
    this.events = [];
    this.indices = new Map();
    this.maxEvents = 10000; // Maximum events to keep in memory
    this.retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years in milliseconds
  }

  /**
   * Store audit event
   */
  store(event) {
    // Add to events array
    this.events.push(event);

    // Update indices for fast searching
    this.updateIndices(event);

    // Maintain size limits
    this.maintainStorageSize();

    // Trigger persistence
    this.persistEvent(event);
  }

  /**
   * Update search indices
   */
  updateIndices(event) {
    // Index by event type
    if (!this.indices.has("eventType")) {
      this.indices.set("eventType", new Map());
    }
    const eventTypeIndex = this.indices.get("eventType");
    if (!eventTypeIndex.has(event.eventType)) {
      eventTypeIndex.set(event.eventType, []);
    }
    eventTypeIndex.get(event.eventType).push(event.id);

    // Index by user ID
    if (!this.indices.has("userId")) {
      this.indices.set("userId", new Map());
    }
    const userIndex = this.indices.get("userId");
    if (!userIndex.has(event.userId)) {
      userIndex.set(event.userId, []);
    }
    userIndex.get(event.userId).push(event.id);

    // Index by patient ID
    if (event.patientId) {
      if (!this.indices.has("patientId")) {
        this.indices.set("patientId", new Map());
      }
      const patientIndex = this.indices.get("patientId");
      if (!patientIndex.has(event.patientId)) {
        patientIndex.set(event.patientId, []);
      }
      patientIndex.get(event.patientId).push(event.id);
    }

    // Index by date (day granularity)
    const dateKey = event.timestamp.split("T")[0];
    if (!this.indices.has("date")) {
      this.indices.set("date", new Map());
    }
    const dateIndex = this.indices.get("date");
    if (!dateIndex.has(dateKey)) {
      dateIndex.set(dateKey, []);
    }
    dateIndex.get(dateKey).push(event.id);
  }

  /**
   * Maintain storage size limits
   */
  maintainStorageSize() {
    if (this.events.length > this.maxEvents) {
      const eventsToRemove = this.events.length - this.maxEvents;
      const removedEvents = this.events.splice(0, eventsToRemove);

      // Update indices to remove old events
      removedEvents.forEach((event) => {
        this.removeFromIndices(event);
      });
    }

    // Remove events older than retention period
    const cutoffTime = new Date(Date.now() - this.retentionPeriod);
    this.events = this.events.filter((event) => {
      const eventTime = new Date(event.timestamp);
      const shouldKeep = eventTime > cutoffTime;

      if (!shouldKeep) {
        this.removeFromIndices(event);
      }

      return shouldKeep;
    });
  }

  /**
   * Remove event from indices
   */
  removeFromIndices(event) {
    // Remove from event type index
    const eventTypeIndex = this.indices.get("eventType");
    if (eventTypeIndex && eventTypeIndex.has(event.eventType)) {
      const eventIds = eventTypeIndex.get(event.eventType);
      const index = eventIds.indexOf(event.id);
      if (index > -1) {
        eventIds.splice(index, 1);
      }
    }

    // Remove from user index
    const userIndex = this.indices.get("userId");
    if (userIndex && userIndex.has(event.userId)) {
      const eventIds = userIndex.get(event.userId);
      const index = eventIds.indexOf(event.id);
      if (index > -1) {
        eventIds.splice(index, 1);
      }
    }

    // Remove from patient index
    if (event.patientId) {
      const patientIndex = this.indices.get("patientId");
      if (patientIndex && patientIndex.has(event.patientId)) {
        const eventIds = patientIndex.get(event.patientId);
        const index = eventIds.indexOf(event.id);
        if (index > -1) {
          eventIds.splice(index, 1);
        }
      }
    }

    // Remove from date index
    const dateKey = event.timestamp.split("T")[0];
    const dateIndex = this.indices.get("date");
    if (dateIndex && dateIndex.has(dateKey)) {
      const eventIds = dateIndex.get(dateKey);
      const index = eventIds.indexOf(event.id);
      if (index > -1) {
        eventIds.splice(index, 1);
      }
    }
  }

  /**
   * Persist event to secure storage
   */
  async persistEvent(event) {
    try {
      // In real implementation, this would persist to secure database
      const sanitizedEvent = event.sanitize();
      await predictionCache.set(`audit_${event.id}`, sanitizedEvent, 24 * 60 * 60 * 1000);
    } catch (error) {
      // ('Failed to persist audit event:', error);
    }
  }

  /**
   * Search events
   */
  search(criteria) {
    let candidateIds = new Set();
    let firstCriteria = true;

    // Use indices to find candidate events
    Object.entries(criteria).forEach(([key, value]) => {
      const index = this.indices.get(key);
      if (index && index.has(value)) {
        const ids = new Set(index.get(value));

        if (firstCriteria) {
          candidateIds = ids;
          firstCriteria = false;
        } else {
          // Intersection with previous results
          candidateIds = new Set([...candidateIds].filter((id) => ids.has(id)));
        }
      } else if (firstCriteria) {
        // If first criteria has no matches, return empty set
        candidateIds = new Set();
        firstCriteria = false;
      } else {
        // No intersection possible
        candidateIds = new Set();
      }
    });

    // Get actual events
    const results = this.events.filter((event) => candidateIds.has(event.id));

    // Apply additional filters
    return this.applyAdditionalFilters(results, criteria);
  }

  /**
   * Apply additional filters that can't use indices
   */
  applyAdditionalFilters(events, criteria) {
    let filtered = events;

    if (criteria.startDate) {
      const startDate = new Date(criteria.startDate);
      filtered = filtered.filter((event) => new Date(event.timestamp) >= startDate);
    }

    if (criteria.endDate) {
      const endDate = new Date(criteria.endDate);
      filtered = filtered.filter((event) => new Date(event.timestamp) <= endDate);
    }

    if (criteria.severity) {
      filtered = filtered.filter((event) => event.severity === criteria.severity);
    }

    if (criteria.outcome) {
      filtered = filtered.filter((event) => event.outcome === criteria.outcome);
    }

    if (criteria.textSearch) {
      const searchTerm = criteria.textSearch.toLowerCase();
      filtered = filtered.filter((event) => event.action?.toLowerCase().includes(searchTerm)
        || event.resource?.toLowerCase().includes(searchTerm)
        || event.errorMessage?.toLowerCase().includes(searchTerm));
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get events count
   */
  getCount() {
    return this.events.length;
  }

  /**
   * Get storage statistics
   */
  getStatistics() {
    const eventsByType = {};
    const eventsBySeverity = {};
    const eventsBy日 = {};

    this.events.forEach((event) => {
      // Count by type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;

      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;

      // Count by day
      const day = event.timestamp.split("T")[0];
      eventsBy日[day] = (eventsBy日[day] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      eventsByDay: eventsBy日,
      oldestEvent: this.events.length > 0 ? this.events[0].timestamp : null,
      newestEvent: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null,
    };
  }
}

/**
 * Clinical Audit Trail System
 */
export class ClinicalAuditTrail {
  constructor() {
    this.storage = new AuditStorage();
    this.isActive = false;
    this.currentSession = null;
    this.automaticEvents = new Set([
      MEDICAL_EVENTS.PREDICTION_GENERATED,
      MEDICAL_EVENTS.CLINICAL_ALERT,
      MEDICAL_EVENTS.FORM_UPDATED,
      MEDICAL_EVENTS.AUDIT_EVENT,
    ]);
  }

  /**
   * Initialize audit trail system
   */
  async initialize() {
    const metricId = medicalPerformanceMonitor.startMeasurement(
      PerformanceMetricType.SYSTEM_STARTUP,
      "audit_trail_init",
    );

    try {
      // Setup event listeners for automatic auditing
      this.setupEventListeners();

      // Start session tracking
      this.startSession();

      this.isActive = true;

      medicalPerformanceMonitor.endMeasurement(metricId, { success: true });

      this.logEvent(AuditEventTypes.CONFIGURATION_CHANGE, {
        action: "audit_trail_initialized",
        resource: "audit_system",
        metadata: {
          version: "1.0",
          riskClass: "B",
          safetyRequirement: "Clinical decision audit logging",
        },
      });

      // ('📋 Clinical audit trail system initialized');
    } catch (error) {
      medicalPerformanceMonitor.endMeasurement(metricId, {
        success: false,
        error: error.message,
      });

      // ('Audit trail initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners for automatic audit logging
   */
  setupEventListeners() {
    // Listen for medical events
    this.automaticEvents.forEach((eventType) => {
      medicalEventObserver.subscribe(eventType, (data) => {
        this.handleAutomaticEvent(eventType, data);
      });
    });

    // Listen for form submissions
    document.addEventListener("submit", (event) => {
      this.handleFormSubmission(event);
    });

    // Listen for page navigation
    window.addEventListener("beforeunload", () => {
      this.logEvent(AuditEventTypes.USER_LOGOUT, {
        action: "session_ended",
        resource: "application",
      });
    });

    // Listen for errors
    window.addEventListener("error", (event) => {
      this.logEvent(AuditEventTypes.SYSTEM_ERROR, {
        severity: AuditSeverity.ERROR,
        action: "javascript_error",
        resource: event.filename || "unknown",
        errorMessage: event.message,
        metadata: {
          line: event.lineno,
          column: event.colno,
          stack: event.error?.stack,
        },
      });
    });
  }

  /**
   * Start user session
   */
  startSession() {
    this.currentSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
      userId: "clinical_user", // In real implementation, get from auth
      events: [],
    };

    this.logEvent(AuditEventTypes.USER_LOGIN, {
      action: "session_started",
      resource: "application",
      sessionId: this.currentSession.id,
    });
  }

  /**
   * Log audit event
   */
  logEvent(eventType, data = {}) {
    if (!this.isActive) {
      return;
    }

    try {
      // Add session information
      if (this.currentSession) {
        data.sessionId = this.currentSession.id;
        data.userId = data.userId || this.currentSession.userId;
      }

      // Create audit event
      const event = new AuditEvent(eventType, data);

      // Store event
      this.storage.store(event);

      // Add to current session
      if (this.currentSession) {
        this.currentSession.events.push(event.id);
      }

      // Notify for critical events
      if (event.severity === AuditSeverity.CRITICAL || event.severity === AuditSeverity.ERROR) {
        this.notifyCriticalEvent(event);
      }

      return event.id;
    } catch (error) {
      // ('Failed to log audit event:', error);
      return null;
    }
  }

  /**
   * Handle automatic events
   */
  handleAutomaticEvent(eventType, data) {
    switch (eventType) {
    case MEDICAL_EVENTS.PREDICTION_GENERATED:
      this.logEvent(AuditEventTypes.PREDICTION_GENERATED, {
        action: "prediction_generated",
        resource: "predictive_engine",
        patientId: data.patientId,
        metadata: {
          predictions: Object.keys(data.predictions || {}),
          confidence: data.predictions?.mortality?.confidence?.level,
        },
      });
      break;

    case MEDICAL_EVENTS.CLINICAL_ALERT:
      this.logEvent(AuditEventTypes.ALERT_TRIGGERED, {
        severity: data.alert?.severity?.level === "critical" ? AuditSeverity.CRITICAL : AuditSeverity.WARNING,
        action: data.action === "activated" ? "alert_triggered" : "alert_acknowledged",
        resource: "clinical_decision_support",
        patientId: data.alert?.patientId,
        metadata: {
          alertId: data.alert?.id,
          alertType: data.alert?.ruleId,
          alertTitle: data.alert?.title,
        },
      });
      break;

    case MEDICAL_EVENTS.FORM_UPDATED:
      this.logEvent(AuditEventTypes.DATA_ENTRY, {
        action: "form_data_updated",
        resource: `form_${data.module}`,
        patientId: data.patientId,
        metadata: {
          module: data.module,
          fieldsUpdated: Object.keys(data.formData || {}),
        },
      });
      break;

    case MEDICAL_EVENTS.AUDIT_EVENT:
      // Don't log audit events to avoid recursion
      break;
    }
  }

  /**
   * Handle form submissions
   */
  handleFormSubmission(event) {
    const form = event.target;
    if (form.dataset.module) {
      const formData = new FormData(form);
      const patientData = Object.fromEntries(formData.entries());

      this.logEvent(AuditEventTypes.CLINICAL_DECISION, {
        action: "clinical_assessment_submitted",
        resource: `module_${form.dataset.module}`,
        metadata: {
          module: form.dataset.module,
          fieldsSubmitted: Object.keys(patientData),
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  /**
   * Log data modification
   */
  logDataModification(resource, oldValue, newValue, options = {}) {
    return this.logEvent(AuditEventTypes.DATA_MODIFICATION, {
      action: "data_modified",
      resource,
      oldValue,
      newValue,
      patientId: options.patientId,
      metadata: {
        reason: options.reason || "Clinical update",
        signature: options.signature,
      },
    });
  }

  /**
   * Log report generation
   */
  logReportGeneration(reportType, patientId, options = {}) {
    return this.logEvent(AuditEventTypes.REPORT_GENERATED, {
      action: "clinical_report_generated",
      resource: `report_${reportType}`,
      patientId,
      metadata: {
        reportType,
        format: options.format || "html",
        recipient: options.recipient,
        reason: options.reason || "Clinical documentation",
      },
    });
  }

  /**
   * Log data export
   */
  logDataExport(dataType, format, options = {}) {
    return this.logEvent(AuditEventTypes.DATA_EXPORT, {
      severity: AuditSeverity.WARNING,
      action: "data_exported",
      resource: `export_${dataType}`,
      metadata: {
        dataType,
        format,
        recordCount: options.recordCount,
        recipient: options.recipient,
        purpose: options.purpose || "Clinical analysis",
      },
    });
  }

  /**
   * Search audit events
   */
  searchEvents(criteria) {
    return this.storage.search(criteria);
  }

  /**
   * Get audit trail for patient
   */
  getPatientAuditTrail(patientId, options = {}) {
    const criteria = {
      patientId,
      startDate: options.startDate,
      endDate: options.endDate,
    };

    return this.storage.search(criteria);
  }

  /**
   * Get audit trail for user
   */
  getUserAuditTrail(userId, options = {}) {
    const criteria = {
      userId,
      startDate: options.startDate,
      endDate: options.endDate,
    };

    return this.storage.search(criteria);
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(framework, options = {}) {
    const events = this.storage.search({
      startDate: options.startDate,
      endDate: options.endDate,
    });

    const complianceEvents = events.filter((event) => event.compliance.includes(framework));

    const report = {
      framework,
      reportPeriod: {
        start: options.startDate || "N/A",
        end: options.endDate || "N/A",
      },
      totalEvents: complianceEvents.length,
      events: complianceEvents.map((event) => event.exportForCompliance(framework)),
      summary: this.generateComplianceSummary(complianceEvents, framework),
      generatedAt: new Date().toISOString(),
    };

    // Log report generation
    this.logEvent(AuditEventTypes.REPORT_GENERATED, {
      action: "compliance_report_generated",
      resource: `compliance_${framework}`,
      metadata: {
        framework,
        eventCount: complianceEvents.length,
        period: report.reportPeriod,
      },
    });

    return report;
  }

  /**
   * Generate compliance summary
   */
  generateComplianceSummary(events, framework) {
    const summary = {
      totalEvents: events.length,
      eventsByType: {},
      eventsBySeverity: {},
      complianceMetrics: {},
    };

    events.forEach((event) => {
      // Count by type
      summary.eventsByType[event.eventType] = (summary.eventsByType[event.eventType] || 0) + 1;

      // Count by severity
      summary.eventsBySeverity[event.severity] = (summary.eventsBySeverity[event.severity] || 0) + 1;
    });

    // Framework-specific metrics
    switch (framework) {
    case ComplianceFrameworks.HIPAA:
      summary.complianceMetrics = {
        patientAccesses: summary.eventsByType[AuditEventTypes.PATIENT_ACCESS] || 0,
        dataExports: summary.eventsByType[AuditEventTypes.DATA_EXPORT] || 0,
        unauthorizedAttempts: events.filter((e) => e.outcome === "failure").length,
      };
      break;

    case ComplianceFrameworks.FDA_21CFR11:
      summary.complianceMetrics = {
        electronicRecords: summary.eventsByType[AuditEventTypes.DATA_ENTRY] || 0,
        recordModifications: summary.eventsByType[AuditEventTypes.DATA_MODIFICATION] || 0,
        signedRecords: events.filter((e) => e.metadata?.signature).length,
      };
      break;

    case ComplianceFrameworks.IEC_62304:
      summary.complianceMetrics = {
        softwareEvents: summary.eventsByType[AuditEventTypes.MODEL_PREDICTION] || 0,
        systemErrors: summary.eventsByType[AuditEventTypes.SYSTEM_ERROR] || 0,
        configurationChanges: summary.eventsByType[AuditEventTypes.CONFIGURATION_CHANGE] || 0,
      };
      break;
    }

    return summary;
  }

  /**
   * Verify audit trail integrity
   */
  verifyIntegrity() {
    const results = {
      totalEvents: this.storage.getCount(),
      verified: 0,
      failed: 0,
      issues: [],
    };

    this.storage.events.forEach((event) => {
      const expectedHash = event.calculateHash();
      if (event.hash === expectedHash) {
        results.verified++;
      } else {
        results.failed++;
        results.issues.push({
          eventId: event.id,
          timestamp: event.timestamp,
          issue: "Hash mismatch - possible tampering",
        });
      }
    });

    // Log integrity check
    this.logEvent(AuditEventTypes.CONFIGURATION_CHANGE, {
      action: "integrity_verification",
      resource: "audit_trail",
      outcome: results.failed === 0 ? "success" : "warning",
      metadata: {
        verified: results.verified,
        failed: results.failed,
        totalChecked: results.totalEvents,
      },
    });

    return results;
  }

  /**
   * Export audit trail
   */
  exportAuditTrail(format = "json", options = {}) {
    const events = this.storage.search({
      startDate: options.startDate,
      endDate: options.endDate,
      eventType: options.eventType,
      userId: options.userId,
      patientId: options.patientId,
    });

    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalEvents: events.length,
        period: {
          start: options.startDate || "beginning",
          end: options.endDate || "now",
        },
        filters: options,
      },
      events: events.map((event) => event.sanitize()),
    };

    // Log export
    this.logDataExport("audit_trail", format, {
      recordCount: events.length,
      purpose: options.purpose || "Compliance audit",
    });

    switch (format) {
    case "json":
      return JSON.stringify(exportData, null, 2);

    case "csv":
      return this.convertToCSV(exportData.events);

    case "xml":
      return this.convertToXML(exportData);

    default:
      return exportData;
    }
  }

  /**
   * Convert events to CSV format
   */
  convertToCSV(events) {
    if (events.length === 0) {
      return "";
    }

    const headers = ["Timestamp", "Event Type", "User ID", "Action", "Resource", "Outcome", "Severity"];
    const rows = [headers];

    events.forEach((event) => {
      rows.push([
        event.timestamp,
        event.eventType,
        event.userId,
        event.action || "",
        event.resource || "",
        event.outcome,
        event.severity,
      ]);
    });

    return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  }

  /**
   * Convert events to XML format
   */
  convertToXML(exportData) {
    let xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    xml += "<auditTrail>\n";
    xml += "  <metadata>\n";
    xml += `    <exportedAt>${exportData.metadata.exportedAt}</exportedAt>\n`;
    xml += `    <totalEvents>${exportData.metadata.totalEvents}</totalEvents>\n`;
    xml += "  </metadata>\n";
    xml += "  <events>\n";

    exportData.events.forEach((event) => {
      xml += "    <event>\n";
      xml += `      <id>${event.id}</id>\n`;
      xml += `      <timestamp>${event.timestamp}</timestamp>\n`;
      xml += `      <eventType>${event.eventType}</eventType>\n`;
      xml += `      <userId>${event.userId}</userId>\n`;
      xml += `      <action>${event.action || ""}</action>\n`;
      xml += `      <resource>${event.resource || ""}</resource>\n`;
      xml += `      <outcome>${event.outcome}</outcome>\n`;
      xml += `      <severity>${event.severity}</severity>\n`;
      xml += "    </event>\n";
    });

    xml += "  </events>\n";
    xml += "</auditTrail>";

    return xml;
  }

  /**
   * Notify critical event
   */
  notifyCriticalEvent(event) {
    // (`🚨 Critical audit event: ${event.eventType} - ${event.action}`);

    // In real implementation, this would trigger alerts to administrators
    medicalEventObserver.publish(MEDICAL_EVENTS.CLINICAL_ALERT, {
      alert: {
        id: `audit_${event.id}`,
        severity: { level: "critical", icon: "🚨" },
        title: "Critical Audit Event",
        message: `${event.eventType}: ${event.action}`,
        recommendation: "Review audit event immediately",
      },
      action: "activated",
    });
  }

  /**
   * Get audit statistics
   */
  getStatistics() {
    return this.storage.getStatistics();
  }

  /**
   * Get current session information
   */
  getCurrentSession() {
    return this.currentSession;
  }

  /**
   * Stop audit trail system
   */
  stop() {
    if (this.currentSession) {
      this.logEvent(AuditEventTypes.USER_LOGOUT, {
        action: "audit_system_stopped",
        resource: "audit_system",
      });
    }

    this.isActive = false;
    // ('📋 Clinical audit trail system stopped');
  }

  /**
   * Dispose audit trail system
   */
  dispose() {
    this.stop();
    this.storage.events.length = 0;
    this.storage.indices.clear();
    this.currentSession = null;

    // ('📋 Clinical audit trail system disposed');
  }
}

// Export audit trail instance
export const clinicalAuditTrail = new ClinicalAuditTrail();
