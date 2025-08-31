# iGFAP Stroke Triage API Specification

## Version 1.0.0
**Last Updated**: August 31, 2025  
**Status**: Production Ready for Integration

---

## Executive Summary

The iGFAP Stroke Triage API provides programmatic access to advanced ML-based stroke risk assessment models. The API analyzes patient biomarkers and clinical data to predict:
- **ICH (Intracerebral Hemorrhage) Risk**: Probability and volume estimation
- **LVO (Large Vessel Occlusion) Risk**: Detection probability
- **Clinical Recommendations**: Risk-based triage guidance

## Base URL

```
Production: https://api.igfap.com/v1
Sandbox:    https://sandbox-api.igfap.com/v1
```

## Authentication

All API requests require authentication via API key in the header:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

## Core Endpoints

### 1. Risk Assessment

**Endpoint**: `POST /assess`

Performs comprehensive stroke risk assessment based on available patient data.

#### Request Body

```json
{
  "module": "auto|full|limited|coma",
  "patient_data": {
    // Required fields
    "age_years": 72,
    "systolic_bp": 165,
    "diastolic_bp": 95,
    "gfap_value": 850.5,
    
    // Module-specific fields
    "gcs_total": 7,              // Required for coma module
    "fast_ed_score": 5,          // Required for full module
    
    // Optional fields (full module)
    "time_since_onset_hours": 2.5,
    "on_anticoagulation": false,
    "on_dual_antiplatelet": false,
    "history_ich": false,
    "history_stroke": true,
    "hypertension": true,
    "diabetes": false,
    "smoking": false,
    "atrial_fibrillation": false,
    "coronary_artery_disease": false,
    "hyperlipidemia": true,
    "ckd": false
  },
  "options": {
    "include_drivers": true,      // Include risk factor analysis
    "include_volume": true,        // Calculate ICH volume
    "include_recommendations": true,
    "units": "metric"             // metric or imperial
  }
}
```

#### Response

```json
{
  "status": "success",
  "request_id": "req_abc123xyz",
  "timestamp": "2025-08-31T21:50:52Z",
  "module_used": "full",
  "results": {
    "ich": {
      "probability": 0.72,
      "confidence": 0.95,
      "risk_level": "very_high",
      "volume_ml": 45.2,
      "mortality_30d": 0.35,
      "functional_outcome": {
        "good_outcome_probability": 0.28,
        "mrs_0_2": 0.28,
        "mrs_3_5": 0.45,
        "mrs_6": 0.27
      }
    },
    "lvo": {
      "probability": 0.34,
      "confidence": 0.88,
      "risk_level": "moderate",
      "fast_ed_components": {
        "facial_palsy": 1,
        "arm_weakness": 2,
        "speech_changes": 1,
        "eye_deviation": 0,
        "denial_neglect": 1
      }
    },
    "risk_drivers": {
      "ich_positive": [
        {"factor": "gfap_elevation", "impact": 0.35, "value": 850.5},
        {"factor": "systolic_bp", "impact": 0.22, "value": 165},
        {"factor": "age", "impact": 0.15, "value": 72}
      ],
      "ich_negative": [
        {"factor": "no_anticoagulation", "impact": -0.12, "value": false}
      ],
      "lvo_positive": [
        {"factor": "fast_ed_score", "impact": 0.28, "value": 5}
      ]
    },
    "recommendations": {
      "priority": "emergent",
      "suggested_actions": [
        "Immediate neurosurgical consultation",
        "Prepare for potential surgical intervention",
        "Blood pressure management critical",
        "Consider reversal agents if anticoagulated"
      ],
      "contraindications": [
        "Avoid thrombolysis",
        "Monitor for hematoma expansion"
      ],
      "suggested_imaging": ["CT", "CTA", "MRI if stable"],
      "transfer_recommendation": "comprehensive_stroke_center"
    }
  }
}
```

### 2. Batch Assessment

**Endpoint**: `POST /assess/batch`

Process multiple patients in a single request (max 100).

#### Request Body

```json
{
  "patients": [
    {
      "patient_id": "PT001",
      "module": "auto",
      "patient_data": {...}
    },
    {
      "patient_id": "PT002", 
      "module": "limited",
      "patient_data": {...}
    }
  ],
  "options": {
    "include_drivers": false,
    "include_recommendations": true
  }
}
```

### 3. Module Selection Helper

**Endpoint**: `GET /modules/recommend`

Helps determine which module to use based on available data.

#### Query Parameters
- `gcs_score` (optional)
- `data_points` (comma-separated list of available fields)

#### Response

```json
{
  "recommended_module": "full",
  "available_modules": ["full", "limited"],
  "reason": "Sufficient data for comprehensive assessment",
  "missing_for_full": [],
  "accuracy_estimate": 0.94
}
```

---

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_GFAP_VALUE",
    "message": "GFAP value must be between 29 and 10001 pg/mL",
    "field": "patient_data.gfap_value",
    "provided_value": 15000
  },
  "request_id": "req_abc123xyz",
  "timestamp": "2025-08-31T21:50:52Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `INVALID_API_KEY` | 401 | Invalid or expired API key |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INVALID_MODULE` | 400 | Specified module not available |
| `MISSING_REQUIRED_FIELD` | 400 | Required field missing |
| `INVALID_VALUE_RANGE` | 400 | Value outside acceptable range |
| `INSUFFICIENT_DATA` | 400 | Not enough data for selected module |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limits

| Plan | Requests/Second | Requests/Day | Batch Size |
|------|----------------|--------------|------------|
| Trial | 1 | 100 | 10 |
| Basic | 10 | 10,000 | 25 |
| Pro | 50 | 100,000 | 50 |
| Enterprise | Custom | Unlimited | 100 |

---

## Webhooks (Optional)

Configure webhooks to receive results asynchronously:

```json
POST /webhooks/configure
{
  "url": "https://your-system.com/webhook",
  "events": ["assessment.completed", "assessment.failed"],
  "secret": "your_webhook_secret"
}
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
import { IGFAPClient } from '@igfap/sdk';

const client = new IGFAPClient({
  apiKey: process.env.IGFAP_API_KEY,
  environment: 'production'
});

try {
  const assessment = await client.assess({
    module: 'auto',
    patientData: {
      age_years: 72,
      systolic_bp: 165,
      diastolic_bp: 95,
      gfap_value: 850.5,
      fast_ed_score: 5
    }
  });
  
  console.log(`ICH Risk: ${assessment.ich.probability * 100}%`);
} catch (error) {
  console.error('Assessment failed:', error.message);
}
```

### Python

```python
from igfap import IGFAPClient

client = IGFAPClient(
    api_key=os.environ['IGFAP_API_KEY'],
    environment='production'
)

assessment = client.assess(
    module='auto',
    patient_data={
        'age_years': 72,
        'systolic_bp': 165,
        'diastolic_bp': 95,
        'gfap_value': 850.5,
        'fast_ed_score': 5
    }
)

print(f"ICH Risk: {assessment.ich.probability * 100:.1f}%")
```

### cURL

```bash
curl -X POST https://api.igfap.com/v1/assess \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "module": "auto",
    "patient_data": {
      "age_years": 72,
      "systolic_bp": 165,
      "diastolic_bp": 95,
      "gfap_value": 850.5
    }
  }'
```

---

## Integration Options

### 1. Direct API Integration
- RESTful API calls from your backend
- Real-time risk assessment
- Full control over UI/UX

### 2. Embedded Widget
```html
<iframe 
  src="https://widget.igfap.com/embed?key=YOUR_KEY"
  width="600" 
  height="800"
  frameborder="0">
</iframe>
```

### 3. FHIR Integration
- HL7 FHIR compatible endpoints
- Integrate with existing EHR systems
- Support for Observation and RiskAssessment resources

---

## Compliance & Security

- **HIPAA Compliant**: All data transmission encrypted with TLS 1.3
- **GDPR Ready**: Data processing agreements available
- **ISO 27001**: Information security certified
- **SOC 2 Type II**: Security controls audited
- **Data Retention**: 30 days for audit logs, immediate deletion available
- **Encryption**: AES-256 at rest, TLS 1.3 in transit

---

## SLA & Support

### Uptime Guarantee
- Basic: 99.5% uptime
- Pro: 99.9% uptime  
- Enterprise: 99.99% uptime with custom SLA

### Support Channels
- **Basic**: Email support (48h response)
- **Pro**: Email + Slack (24h response)
- **Enterprise**: Dedicated support team, phone support

---

## Pricing

| Plan | Monthly Price | Included Assessments | Overage Rate |
|------|--------------|---------------------|--------------|
| Trial | Free | 100 | N/A |
| Basic | $299 | 10,000 | $0.03 each |
| Pro | $999 | 100,000 | $0.01 each |
| Enterprise | Custom | Unlimited | Custom |

---

## Migration from Current Web App

For organizations currently using the web interface:

1. **Data Export**: Export historical assessments via `/export` endpoint
2. **Parallel Running**: Test API alongside web app
3. **Gradual Migration**: Route percentage of traffic to API
4. **Full Cutover**: Complete transition with rollback option

---

## Contact & Getting Started

**Technical Integration Support**  
Email: api-support@igfap.com  
Documentation: https://docs.igfap.com  
Status Page: https://status.igfap.com

**Sales & Partnerships**  
Email: partnerships@igfap.com  
Phone: +1-800-IGFAP-AI

**Getting Started**
1. Sign up at https://dashboard.igfap.com
2. Generate API key
3. Test in sandbox environment
4. Review integration guide
5. Go live with production key

---

## Appendix: Field Specifications

### Required Fields by Module

| Field | Coma | Limited | Full | Type | Range |
|-------|------|---------|------|------|-------|
| age_years | ✓ | ✓ | ✓ | integer | 0-120 |
| systolic_bp | ✓ | ✓ | ✓ | integer | 60-300 |
| diastolic_bp | ✓ | ✓ | ✓ | integer | 30-200 |
| gfap_value | ✓ | ✓ | ✓ | float | 29-10001 |
| gcs_total | ✓ | - | - | integer | 3-15 |
| fast_ed_score | - | - | ✓ | integer | 0-9 |
| time_since_onset_hours | - | ✓ | ✓ | float | 0-24 |

### Risk Level Thresholds

| Risk Level | ICH Probability | LVO Probability |
|------------|----------------|-----------------|
| Low | < 25% | < 25% |
| Moderate | 25-50% | 25-50% |
| High | 50-70% | 50-70% |
| Very High | > 70% | > 70% |

---

*This document is version controlled. Latest version always available at https://docs.igfap.com/api/latest*