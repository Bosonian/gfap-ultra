# CE Certification Roadmap for iGFAP Stroke Triage Assistant

## Medical Device Classification
- **Class IIa** - Clinical decision support software with indirect patient impact
- **MDR 2017/745** regulation applies (not IVDR as we're not an in-vitro diagnostic)

## Timeline: 18-24 Months

### Phase 1: Foundation (Months 1-6)
#### Quality Management System (ISO 13485)
- [ ] Establish QMS procedures
- [ ] Document control system
- [ ] Management review process
- [ ] Internal audit procedures
- [ ] CAPA (Corrective and Preventive Action) system

#### Software Development Lifecycle (IEC 62304)
- [ ] Software Development Plan (SDP)
- [ ] Software Requirements Specification (SRS)
- [ ] Software Architecture Document
- [ ] Software Detailed Design
- [ ] Unit/Integration Test Plans
- [ ] Software Maintenance Plan

### Phase 2: Risk & Safety (Months 6-12)
#### Risk Management (ISO 14971)
- [ ] Risk Management Plan
- [ ] Hazard Analysis
- [ ] Risk Assessment Matrix
- [ ] Risk Control Measures
- [ ] Residual Risk Evaluation
- [ ] Risk Management Report

#### Cybersecurity (IEC 81001-5-1)
- [ ] Threat Modeling
- [ ] Security Risk Assessment
- [ ] Security Controls Implementation
- [ ] Penetration Testing
- [ ] Security Incident Response Plan

### Phase 3: Clinical & Usability (Months 12-18)
#### Clinical Evaluation (MDR Annex XIV)
- [ ] Clinical Evaluation Plan
- [ ] Literature Review
- [ ] Clinical Investigation (if needed)
- [ ] Clinical Evaluation Report
- [ ] PMCF Plan (Post-Market Clinical Follow-up)

#### Usability Engineering (IEC 62366-1)
- [ ] Use Specification
- [ ] User Interface Specification
- [ ] Use Error Analysis
- [ ] Usability Validation Testing
- [ ] Usability Engineering File

### Phase 4: Technical Documentation (Months 18-24)
#### Technical File Components
- [ ] Device Description and Specification
- [ ] Manufacturing Information
- [ ] Design and Manufacturing Information
- [ ] General Safety and Performance Requirements (GSPR)
- [ ] Benefit-Risk Analysis
- [ ] Product Verification and Validation

#### Notified Body Submission
- [ ] Select Notified Body
- [ ] Pre-submission Meeting
- [ ] Technical Documentation Review
- [ ] On-site Audit (if required)
- [ ] CE Certificate Issuance

## Code Changes Required

### 1. Add Traceability Headers
```javascript
/**
 * @medical-device-software
 * @iec-62304-class: B
 * @requirement-id: SRS-ICH-001
 * @risk-control: RCM-ICH-001
 * @validation-ref: VAL-ICH-001
 * @change-history: CR-2025-001
 */
```

### 2. Implement Audit Logging
```javascript
class MedicalAuditLogger {
  logClinicalDecision(userId, patientId, decision, timestamp) {
    // IEC 62304 requirement: maintain audit trail
    // ISO 14971: risk control measure for decision tracking
  }
}
```

### 3. Add Fail-Safe Mechanisms
```javascript
function calculateICHRisk(inputs) {
  try {
    // Primary calculation
  } catch (error) {
    // ISO 14971: Fail-safe to conservative estimate
    return {
      risk: 'UNKNOWN',
      confidence: 0,
      failSafeMode: true,
      requiresClinicalReview: true
    };
  }
}
```

### 4. Security Implementation
```javascript
// Authentication
app.use(requireAuthentication);
app.use(enforceRoleBasedAccess);

// Encryption
app.use(encryptPatientData);

// Session Management
app.use(secureSessionManagement);

// Input Sanitization
app.use(medicalDataValidator);
```

### 5. Clinical Override Capability
```javascript
class ClinicalOverride {
  constructor() {
    this.overrideLog = [];
  }
  
  allowClinicalOverride(automatedDecision, clinicianInput, justification) {
    // MDR requirement: clinician must be able to override
    this.auditOverride(automatedDecision, clinicianInput, justification);
    return clinicianInput;
  }
}
```

## Testing Requirements

### Verification Testing (IEC 62304)
- Unit Testing: 80% code coverage minimum
- Integration Testing: All interfaces
- System Testing: Full clinical workflows
- Regression Testing: After each change

### Validation Testing
- Clinical accuracy validation
- Usability validation with intended users
- Performance validation
- Security validation

### Special Testing
- Edge case testing (boundary values)
- Stress testing (load conditions)
- Interoperability testing
- Backward compatibility testing

## Documentation Requirements

### For Each Source File
```
- Purpose and scope
- Requirements traced
- Design rationale
- Risk controls implemented
- Test coverage
- Change history
- Review and approval records
```

### Clinical Documentation
- Clinical evidence for algorithms
- Validation study protocols and reports
- Performance characteristics
- Limitations and contraindications
- User training requirements

## Regulatory Consultants Needed

1. **Regulatory Affairs Specialist** - MDR navigation
2. **Quality Assurance Manager** - ISO 13485 implementation
3. **Clinical Affairs Manager** - Clinical evaluation
4. **Software V&V Engineer** - IEC 62304 compliance
5. **Cybersecurity Specialist** - Security implementation

## Budget Estimate

- QMS Implementation: €50,000-100,000
- Clinical Studies: €200,000-500,000
- Notified Body Fees: €30,000-50,000
- Consultancy: €100,000-200,000
- Documentation: €50,000-100,000
- **Total: €430,000-950,000**

## Alternative: CE Marking as General Wellness App

If you position as wellness/research tool (not medical device):
- No CE marking needed
- Must include clear disclaimers
- Cannot make medical claims
- Cannot be used for clinical decisions

## Recommended Next Steps

1. **Consult MDR Expert** - Determine exact classification
2. **Gap Assessment** - Formal IEC 62304 gap analysis
3. **QMS Foundation** - Start ISO 13485 implementation
4. **Clinical Protocol** - Design validation studies
5. **Notified Body** - Early engagement for guidance

## Important Note

The current codebase is a **good prototype** but needs significant enhancement for medical device certification. Consider partnering with an established medical device company who already has these systems in place.