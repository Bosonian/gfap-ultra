# GDPR Compliance Framework
## iGFAP Stroke Triage Assistant - Research Preview

**Document Version**: 1.0
**Date**: September 26, 2025
**Data Protection Officer**: Deepak Bos <bosdeepak@gmail.com>
**Classification**: Internal Use - GDPR Documentation

---

## 1. Data Processing Overview

### 1.1 Legal Basis for Processing
- **Article 6(1)(f) GDPR**: Legitimate interests for emergency medical research
- **Article 9(2)(j) GDPR**: Scientific research purposes for health data
- **Research Context**: Clinical validation of GFAP-based stroke assessment

### 1.2 Data Controller Information
- **Organization**: iGFAP Project Team
- **Contact**: Deepak Bos, Managing Director
- **Email**: bosdeepak@gmail.com
- **Clinical Oversight**: Prof. Christian Förch (RKH Klinikum Ludwigsburg)

---

## 2. Data Inventory & Classification

### 2.1 Personal Health Data Processed

| Data Type | Purpose | Legal Basis | Retention | Location |
|-----------|---------|-------------|-----------|----------|
| **Age** | Risk calculation | Legitimate interest (Art. 6.1.f) | Session only | Browser memory |
| **Blood Pressure** | Clinical assessment | Legitimate interest (Art. 6.1.f) | Session only | API transmission |
| **GFAP Biomarker** | Research validation | Scientific research (Art. 9.2.j) | Session only | Browser memory |
| **Clinical Symptoms** | Stroke assessment | Legitimate interest (Art. 6.1.f) | Session only | Browser memory |
| **FAST-ED Score** | LVO prediction | Scientific research (Art. 9.2.j) | Session only | Browser memory |

### 2.2 Technical Data Processed

| Data Type | Purpose | Legal Basis | Retention | Location |
|-----------|---------|-------------|-----------|----------|
| **Session ID** | Security tracking | Legitimate interest | 4 hours | sessionStorage |
| **Language Preference** | UI functionality | User consent (implied) | Persistent | localStorage |
| **Research Comparisons** | Model validation | Explicit consent | User-controlled | localStorage |
| **Authentication Logs** | Access control | Security interest | Session only | Memory only |

---

## 3. Data Protection Principles Compliance

### 3.1 Lawfulness, Fairness, Transparency ✅
- **Legal Basis**: Clearly documented (Art. 6.1.f + 9.2.j)
- **Transparency**: Privacy notice displayed on login screen
- **Fairness**: Data used only for stated research purposes

### 3.2 Purpose Limitation ✅
- **Specified Purpose**: Emergency stroke research and clinical validation
- **Legitimate Purpose**: Improving emergency medical care
- **Compatible Use**: All processing aligns with research objectives

### 3.3 Data Minimization ✅
- **Minimal Data**: Only essential clinical parameters collected
- **No Identifiers**: No names, addresses, or direct identifiers
- **Pseudonymization**: Session-based anonymous processing

### 3.4 Accuracy ✅
- **Medical Validation**: Clinical oversight by neurologists
- **Input Validation**: Technical validation of all clinical values
- **Error Correction**: Real-time validation with medical reasonableness checks

### 3.5 Storage Limitation ✅
- **Session-Based**: Patient data deleted on browser close
- **No Persistence**: Clinical data not stored on servers
- **User Control**: Research data with user-managed retention

### 3.6 Integrity & Confidentiality ✅
- **HTTPS Only**: All data transmission encrypted
- **Local Processing**: No external data sharing
- **Access Control**: Research-grade authentication

### 3.7 Accountability ✅
- **Documentation**: This compliance framework
- **Oversight**: Clinical advisory board supervision
- **Audit Trail**: Technical implementation logged

---

## 4. Data Subject Rights Implementation

### 4.1 Right to Information (Art. 13-14)
**Status**: ✅ **Implemented**
- Privacy notice on login screen
- Processing purposes clearly stated
- Contact information provided

### 4.2 Right of Access (Art. 15)
**Status**: ⚠️ **Partial Implementation**
- **Current**: Research data viewable in browser console
- **Required**: Formal access request process
- **Implementation Date**: Next 30 days

### 4.3 Right to Rectification (Art. 16)
**Status**: ✅ **Implemented**
- Users can modify inputs during session
- Real-time validation prevents incorrect data
- Clinical oversight ensures accuracy

### 4.4 Right to Erasure (Art. 17)
**Status**: ✅ **Implemented**
- Session data automatically deleted
- User can clear research data
- No long-term storage of personal data

### 4.5 Right to Restrict Processing (Art. 18)
**Status**: ✅ **Implemented**
- Users can close session to stop processing
- Research mode can be disabled
- No background processing

### 4.6 Right to Data Portability (Art. 20)
**Status**: ⚠️ **Partial Implementation**
- **Current**: Research data downloadable as CSV
- **Required**: Structured export format
- **Implementation Date**: Next 60 days

### 4.7 Right to Object (Art. 21)
**Status**: ✅ **Implemented**
- Users can exit application at any time
- Research participation is optional
- Clear opt-out mechanism

---

## 5. Technical & Organizational Measures

### 5.1 Data Security Measures
- **Encryption in Transit**: TLS 1.3 for all communications
- **Authentication**: Secure session management
- **Access Control**: Role-based research access
- **Audit Logging**: Security event tracking

### 5.2 Privacy by Design Implementation
- **Proactive**: Security built into system architecture
- **Default Settings**: Maximum privacy by default
- **Embedded**: Privacy controls integrated into UI
- **End-to-End**: Comprehensive protection throughout data lifecycle
- **Transparency**: Clear processing information
- **Respect**: User autonomy and consent

### 5.3 Data Protection Impact Assessment (DPIA)
**Required**: Yes (special category health data processing)
**Status**: ⚠️ **In Progress**
**Completion Date**: Next 45 days

---

## 6. Breach Response Procedures

### 6.1 Incident Detection
- **Automated Monitoring**: Security logging enabled
- **Manual Reporting**: Staff breach reporting process
- **External Reporting**: Clinical partner notification

### 6.2 Breach Assessment (72-hour timeline)
1. **Hour 0-4**: Incident containment and assessment
2. **Hour 4-24**: Risk evaluation and impact analysis
3. **Hour 24-48**: Regulatory notification if required
4. **Hour 48-72**: Data subject notification if high risk

### 6.3 Notification Contacts
- **Data Protection Officer**: Deepak Bos <bosdeepak@gmail.com>
- **Clinical Supervisor**: Prof. Christian Förch
- **Regulatory Contact**: Dr. Lovepreet Kalra

---

## 7. International Transfers

### 7.1 Third Country Processing
**Status**: ⚠️ **Limited Google Cloud Processing**
- **Destination**: Google Cloud Platform (EU regions)
- **Safeguards**: Standard Contractual Clauses (SCCs)
- **Data**: Anonymized clinical parameters only
- **Retention**: No long-term storage by Google

### 7.2 Adequacy Decision
- **EU-Internal**: Primary processing in EU/EEA
- **Google Cloud**: Adequate protection under SCCs
- **No Other Transfers**: No other international data flows

---

## 8. Records of Processing Activities (Art. 30)

### 8.1 Controller Information
- **Name**: iGFAP Project Team
- **Contact**: Deepak Bos <bosdeepak@gmail.com>
- **DPO Contact**: Same as above
- **Categories of Processing**: Health research, clinical validation

### 8.2 Processing Activities
1. **Emergency Stroke Assessment**
   - Categories of data subjects: Emergency patients (research context)
   - Categories of data: Age, vitals, biomarkers, symptoms
   - Recipients: Clinical research team only
   - Retention: Session-based (immediate deletion)

2. **Research Model Validation**
   - Categories of data subjects: Research participants
   - Categories of data: Anonymized assessment results
   - Recipients: Authorized researchers only
   - Retention: User-controlled (can delete anytime)

---

## 9. Compliance Monitoring

### 9.1 Regular Reviews
- **Monthly**: Technical security review
- **Quarterly**: Data processing audit
- **Annually**: Full GDPR compliance assessment

### 9.2 Clinical Oversight
- **Weekly**: Clinical advisory board review
- **Monthly**: Medical ethics assessment
- **Quarterly**: Patient safety evaluation

### 9.3 Documentation Updates
- **Policy Review**: Every 6 months
- **Technical Changes**: Within 30 days of system updates
- **Regulatory Changes**: Within 60 days of legal updates

---

## 10. Training & Awareness

### 10.1 Staff Training
- **Data Protection**: All team members annually
- **Clinical Ethics**: Medical team quarterly
- **Technical Security**: Development team monthly

### 10.2 User Education
- **Login Screen**: Privacy information displayed
- **In-App Guidance**: Contextual privacy tips
- **Documentation**: This framework publicly available

---

## Contact for Data Protection Matters

**Data Protection Officer**: Deepak Bos
**Email**: bosdeepak@gmail.com
**Response Time**: 5 business days for standard inquiries
**Emergency Contact**: Available for urgent data protection matters

**Clinical Oversight**:
- Prof. Christian Förch (Chefarzt, Neurologie, RKH Klinikum Ludwigsburg)
- Dr. med. Lovepreet Kalra (Assistenzärztin, Neurologie)

---

*This document is reviewed quarterly and updated as needed to ensure ongoing GDPR compliance. Last review: September 26, 2025*