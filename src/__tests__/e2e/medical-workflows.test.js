/**
 * End-to-End Medical Workflow Tests
 * Complete Patient Journey Testing from Input to Clinical Decision Support
 */

import { BasePredictionClient } from '../../api/base-prediction-client.js';
import { validateMedicalInput } from '../../logic/validate.js';
import { MedicalCacheFactory } from '../../performance/medical-cache.js';
import { medicalPerformanceMonitor } from '../../performance/medical-performance-monitor.js';
import { InputValidator } from '../../security/input-validator.js';

// Mock external dependencies for E2E tests
jest.mock('../../performance/medical-performance-monitor.js', () => ({
  medicalPerformanceMonitor: {
    isMonitoring: true,
    start: jest.fn(),
    startMeasurement: jest.fn(() => 'workflow-metric-id'),
    endMeasurement: jest.fn(() => ({
      duration: 1500,
      thresholdViolation: false,
      endTime: Date.now(),
    })),
    getStatistics: jest.fn(() => ({
      totalMeasurements: 1,
      averageDuration: 1500,
      slaCompliance: { compliancePercentage: 100 },
    })),
  },
  PerformanceMetricType: {
    VALIDATION: 'validation',
    API_CALL: 'api_call',
    PREDICTION: 'prediction',
    WORKFLOW: 'workflow',
  },
}));

jest.mock('../../patterns/observer.js', () => ({
  medicalEventObserver: {
    publish: jest.fn(),
  },
  MEDICAL_EVENTS: {
    AUDIT_EVENT: 'audit_event',
    WORKFLOW_START: 'workflow_start',
    WORKFLOW_COMPLETE: 'workflow_complete',
  },
}));

describe('End-to-End Medical Workflows', () => {
  let predictionClient;
  let inputValidator;
  let mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Clear all caches
    MedicalCacheFactory.clearAllCaches();

    // Setup mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Initialize components
    predictionClient = new BasePredictionClient();
    inputValidator = new InputValidator();

    // Mock online status
    Object.defineProperty(predictionClient, 'isOnline', {
      value: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe('Complete Coma Patient Workflow', () => {
    test('should handle complete coma patient assessment workflow', async () => {
      // Step 1: Raw patient input (as would come from UI)
      const rawPatientInput = {
        patient_name: 'John Doe',
        age_years: '72',
        gcs: '6',
        gfap_value: '485.5',
        systolic_bp: '165',
        diastolic_bp: '95',
        notes: 'Patient found unconscious, suspected stroke',
      };

      // Step 2: Security validation and sanitization
      const securityValidation = inputValidator.validateAndSanitizeInput(rawPatientInput);
      expect(securityValidation.isSecure).toBe(true);
      expect(securityValidation.sanitizedData.patient_name).toBe('John Doe');

      // Step 3: Medical parameter validation
      const medicalValidation = await validateMedicalInput(
        securityValidation.sanitizedData,
        'coma'
      );
      expect(medicalValidation.isValid).toBe(true);

      // Extract medical data for prediction
      const medicalData = {
        age_years: 72,
        gcs: 6,
        gfap_value: 485.5,
        systolic_bp: 165,
        diastolic_bp: 95,
      };

      // Step 4: Mock API response
      const expectedApiResponse = {
        probability: 0.82,
        confidence: 0.89,
        drivers: [
          'Severe consciousness impairment (GCS: 6)',
          'Elevated GFAP biomarker (485.5 pg/mL)',
          'Advanced age (72 years)',
          'Hypertension (165/95 mmHg)',
        ],
        model_version: 'coma_ich_v2.1',
        timestamp: '2025-01-15T14:30:00Z',
        clinical_recommendations: [
          'Immediate CT scan required',
          'Consider neurosurgical consultation',
          'Monitor for deterioration',
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(expectedApiResponse),
      });

      // Step 5: Make prediction
      const predictionResult = await predictionClient.predict('coma_ich', medicalData);

      // Step 6: Verify complete workflow result
      expect(predictionResult).toMatchObject({
        probability: 0.82,
        confidence: 0.89,
        module: 'Coma',
        riskLevel: 'Very High Risk', // Should be calculated based on probability > 0.7
        timestamp: expect.any(String),
      });

      expect(predictionResult.drivers).toContain('Severe consciousness impairment (GCS: 6)');
      expect(predictionResult.drivers).toContain('Elevated GFAP biomarker (485.5 pg/mL)');
      expect(predictionResult.clinicalRecommendations).toContain('Immediate CT scan required');

      // Step 7: Verify caching worked
      const cachedResult = await predictionClient.predict('coma_ich', medicalData);
      expect(cachedResult.fromCache).toBe(true);
      expect(cachedResult.probability).toBe(0.82);

      // Step 8: Verify performance tracking
      expect(medicalPerformanceMonitor.startMeasurement).toHaveBeenCalled();
      expect(medicalPerformanceMonitor.endMeasurement).toHaveBeenCalled();
    });

    test('should handle coma workflow with clinical warnings', async () => {
      const extremeCaseInput = {
        age_years: 95, // Extreme age
        gcs: 3, // Worst possible GCS
        gfap_value: 8500, // Extremely elevated
        systolic_bp: 200, // Severe hypertension
        diastolic_bp: 120,
      };

      // Validation should pass but generate multiple warnings
      const validation = await validateMedicalInput(extremeCaseInput, 'coma');
      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(3);

      // Mock API response for extreme case
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.95,
          confidence: 0.92,
          drivers: ['Critical GCS (3)', 'Extreme GFAP elevation', 'Advanced age', 'Severe hypertension'],
          urgency: 'critical',
          clinical_alerts: [
            'IMMEDIATE INTERVENTION REQUIRED',
            'Consider end-of-life care discussions',
            'Neurosurgical emergency consultation',
          ],
        }),
      });

      const result = await predictionClient.predict('coma_ich', extremeCaseInput);

      expect(result.probability).toBe(0.95);
      expect(result.riskLevel).toBe('Critical Risk');
      expect(result.urgency).toBe('critical');
      expect(result.clinicalAlerts).toContain('IMMEDIATE INTERVENTION REQUIRED');
    });
  });

  describe('Limited Data Patient Workflow', () => {
    test('should handle limited data workflow with incomplete information', async () => {
      const limitedPatientData = {
        age_years: 68,
        systolic_bp: 170,
        diastolic_bp: 100,
        gfap_value: 280.5,
        vigilanzminderung: true,
        // Missing some optional clinical variables
      };

      // Security and medical validation
      const securityCheck = inputValidator.validateAndSanitizeInput(limitedPatientData);
      expect(securityCheck.isSecure).toBe(true);

      const medicalValidation = await validateMedicalInput(limitedPatientData, 'limited');
      expect(medicalValidation.isValid).toBe(true);

      // Mock API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.65,
          confidence: 0.74,
          drivers: ['Moderate hypertension', 'Consciousness impairment', 'Moderate GFAP elevation'],
          data_completeness: 0.6,
          recommendation: 'Consider additional clinical assessment',
        }),
      });

      const result = await predictionClient.predict('limited_ich', limitedPatientData);

      expect(result.probability).toBe(0.65);
      expect(result.module).toBe('Limited Data');
      expect(result.riskLevel).toBe('High Risk');
      expect(result.dataCompleteness).toBe(0.6);
      expect(result.recommendation).toContain('additional clinical assessment');

      // Verify boolean normalization occurred
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.vigilanzminderung).toBe(1);
    });

    test('should recommend full assessment when appropriate', async () => {
      const borderlineCaseData = {
        age_years: 45, // Younger patient
        systolic_bp: 145,
        diastolic_bp: 85,
        gfap_value: 150, // Moderate elevation
        vigilanzminderung: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.35,
          confidence: 0.68,
          drivers: ['Mild hypertension', 'Moderate GFAP'],
          recommendation: 'Consider full stroke assessment for more accurate prediction',
          suggested_next_step: 'full_stroke_module',
        }),
      });

      const result = await predictionClient.predict('limited_ich', borderlineCaseData);

      expect(result.probability).toBe(0.35);
      expect(result.riskLevel).toBe('Moderate Risk');
      expect(result.suggestedNextStep).toBe('full_stroke_module');
      expect(result.recommendation).toContain('full stroke assessment');
    });
  });

  describe('Full Stroke Assessment Workflow', () => {
    test('should handle comprehensive stroke assessment workflow', async () => {
      const completeStrokeData = {
        age_years: 74,
        systolic_bp: 185,
        diastolic_bp: 110,
        gfap_value: 650.0,
        fast_ed_score: 8,
        headache: false,
        vigilanzminderung: true,
        armparese: true,
        beinparese: false,
        eye_deviation: true,
        atrial_fibrillation: true,
        anticoagulated_noak: false,
        antiplatelets: true,
      };

      // Comprehensive validation
      const validation = await validateMedicalInput(completeStrokeData, 'full');
      expect(validation.isValid).toBe(true);
      expect(validation.requiredFields).toHaveLength(13);

      // Mock comprehensive API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.88,
          confidence: 0.94,
          drivers: [
            'High FAST-ED score (8/10)',
            'Significantly elevated GFAP (650.0 pg/mL)',
            'Atrial fibrillation present',
            'Focal neurological deficits',
            'Severe hypertension',
          ],
          risk_stratification: {
            ich_probability: 0.88,
            lvo_probability: 0.82,
            hemorrhage_risk: 'high',
            thrombolysis_eligibility: 'conditional',
          },
          clinical_decision_support: {
            primary_recommendation: 'Immediate stroke protocol activation',
            secondary_recommendations: [
              'CT/CTA within 20 minutes',
              'Neurology consultation STAT',
              'Consider thrombectomy evaluation',
              'Blood pressure management protocol',
            ],
            contraindications: ['Anticoagulation not documented'],
            time_targets: {
              ct_scan: '20 minutes',
              neurology_consult: '30 minutes',
              treatment_decision: '60 minutes',
            },
          },
        }),
      });

      const result = await predictionClient.predict('full_stroke', completeStrokeData);

      // Verify comprehensive result structure
      expect(result).toMatchObject({
        probability: 0.88,
        confidence: 0.94,
        module: 'Full Stroke',
        riskLevel: 'Very High Risk',
      });

      expect(result.riskStratification).toMatchObject({
        ich_probability: 0.88,
        lvo_probability: 0.82,
        hemorrhage_risk: 'high',
      });

      expect(result.clinicalDecisionSupport.primary_recommendation)
        .toBe('Immediate stroke protocol activation');

      expect(result.clinicalDecisionSupport.secondary_recommendations)
        .toContain('CT/CTA within 20 minutes');

      expect(result.clinicalDecisionSupport.time_targets.ct_scan)
        .toBe('20 minutes');

      // Verify all 13 variables were sent
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(Object.keys(requestBody)).toHaveLength(13);
    });

    test('should handle low-risk full stroke assessment', async () => {
      const lowRiskData = {
        age_years: 45,
        systolic_bp: 125,
        diastolic_bp: 80,
        gfap_value: 75.0,
        fast_ed_score: 1,
        headache: true,
        vigilanzminderung: false,
        armparese: false,
        beinparese: false,
        eye_deviation: false,
        atrial_fibrillation: false,
        anticoagulated_noak: false,
        antiplatelets: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.15,
          confidence: 0.82,
          drivers: ['Young age', 'Normal blood pressure', 'Low GFAP', 'Minimal neurological deficits'],
          risk_stratification: {
            ich_probability: 0.15,
            lvo_probability: 0.08,
            hemorrhage_risk: 'low',
          },
          clinical_decision_support: {
            primary_recommendation: 'Standard stroke workup',
            secondary_recommendations: [
              'Standard CT timing acceptable',
              'Consider alternative diagnoses',
              'Migraine evaluation if headache prominent',
            ],
          },
        }),
      });

      const result = await predictionClient.predict('full_stroke', lowRiskData);

      expect(result.probability).toBe(0.15);
      expect(result.riskLevel).toBe('Low Risk');
      expect(result.riskStratification.hemorrhage_risk).toBe('low');
      expect(result.clinicalDecisionSupport.primary_recommendation)
        .toBe('Standard stroke workup');
    });
  });

  describe('LVO Assessment Workflow', () => {
    test('should handle high-probability LVO workflow', async () => {
      const lvoSuspectedData = {
        gfap_value: 825.0,
        fast_ed_score: 9,
      };

      // Validation for minimal LVO data
      const validation = await validateMedicalInput(lvoSuspectedData, 'lvo');
      expect(validation.isValid).toBe(true);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          lvo_probability: 0.91,
          confidence: 0.96,
          interpretation: 'Very high probability of large vessel occlusion',
          urgency_level: 'critical',
          recommended_action: 'immediate_thrombectomy_evaluation',
          time_sensitivity: {
            target_groin_puncture: '90 minutes',
            target_recanalization: '360 minutes',
          },
          vessel_territories: {
            most_likely: 'M1_segment_MCA',
            alternatives: ['ICA_terminus', 'M2_segment_MCA'],
          },
        }),
      });

      const result = await predictionClient.predict('lvo', lvoSuspectedData);

      expect(result.probability).toBe(0.91); // Mapped from lvo_probability
      expect(result.module).toBe('LVO');
      expect(result.urgencyLevel).toBe('critical');
      expect(result.recommendedAction).toBe('immediate_thrombectomy_evaluation');
      expect(result.timeSensitivity.target_groin_puncture).toBe('90 minutes');
      expect(result.vesselTerritories.most_likely).toBe('M1_segment_MCA');
    });

    test('should handle low-probability LVO workflow', async () => {
      const lowLvoData = {
        gfap_value: 95.0,
        fast_ed_score: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          lvo_probability: 0.18,
          confidence: 0.78,
          interpretation: 'Low probability of large vessel occlusion',
          urgency_level: 'routine',
          recommended_action: 'standard_stroke_protocol',
          alternative_considerations: [
            'Small vessel disease',
            'Lacunar infarct',
            'Non-vascular etiology',
          ],
        }),
      });

      const result = await predictionClient.predict('lvo', lowLvoData);

      expect(result.probability).toBe(0.18);
      expect(result.urgencyLevel).toBe('routine');
      expect(result.recommendedAction).toBe('standard_stroke_protocol');
      expect(result.alternativeConsiderations).toContain('Small vessel disease');
    });
  });

  describe('Multi-Module Workflow Orchestration', () => {
    test('should handle intelligent module progression workflow', async () => {
      // Start with limited data, progress to full assessment
      const initialData = {
        age_years: 67,
        systolic_bp: 175,
        diastolic_bp: 105,
        gfap_value: 450.0,
        vigilanzminderung: true,
      };

      // Step 1: Limited assessment
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.72,
          confidence: 0.68,
          drivers: ['Hypertension', 'Elevated GFAP', 'Consciousness impairment'],
          recommendation: 'High risk detected - recommend full stroke assessment',
          suggested_next_step: 'full_stroke_module',
        }),
      });

      const limitedResult = await predictionClient.predict('limited_ich', initialData);

      expect(limitedResult.probability).toBe(0.72);
      expect(limitedResult.suggestedNextStep).toBe('full_stroke_module');

      // Step 2: Gather additional data for full assessment
      const fullStrokeData = {
        ...initialData,
        fast_ed_score: 6,
        headache: false,
        armparese: true,
        beinparese: false,
        eye_deviation: true,
        atrial_fibrillation: false,
        anticoagulated_noak: false,
        antiplatelets: true,
      };

      // Step 3: Full stroke assessment
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.84,
          confidence: 0.91,
          drivers: ['High FAST-ED', 'Elevated GFAP', 'Focal deficits', 'Hypertension'],
          risk_stratification: {
            ich_probability: 0.84,
            lvo_probability: 0.75,
          },
          progression_analysis: {
            risk_change: '+0.12',
            confidence_improvement: '+0.23',
            additional_risk_factors: ['Focal neurological deficits'],
          },
        }),
      });

      const fullResult = await predictionClient.predict('full_stroke', fullStrokeData);

      expect(fullResult.probability).toBe(0.84);
      expect(fullResult.confidence).toBe(0.91);
      expect(fullResult.progressionAnalysis.risk_change).toBe('+0.12');

      // Step 4: LVO assessment if indicated
      if (fullResult.riskStratification.lvo_probability > 0.7) {
        const lvoData = {
          gfap_value: fullStrokeData.gfap_value,
          fast_ed_score: fullStrokeData.fast_ed_score,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: () => Promise.resolve({
            lvo_probability: 0.79,
            confidence: 0.87,
            interpretation: 'High probability LVO - thrombectomy candidate',
            urgency_level: 'high',
          }),
        });

        const lvoResult = await predictionClient.predict('lvo', lvoData);

        expect(lvoResult.probability).toBe(0.79);
        expect(lvoResult.urgencyLevel).toBe('high');
      }

      // Verify API calls were made in sequence
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Workflow Error Recovery', () => {
    test('should handle partial workflow failures gracefully', async () => {
      const patientData = {
        age_years: 70,
        gcs: 10,
        gfap_value: 300,
        systolic_bp: 160,
        diastolic_bp: 95,
      };

      // First attempt fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: () => Promise.resolve({ error: 'Prediction service temporarily unavailable' }),
        headers: new Map(),
      });

      // Verify error is handled properly
      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Prediction service temporarily unavailable');

      // Second attempt succeeds (after service recovery)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.68,
          confidence: 0.82,
          drivers: ['Moderate GFAP elevation', 'Hypertension'],
        }),
      });

      const result = await predictionClient.predict('coma_ich', patientData);
      expect(result.probability).toBe(0.68);
    });

    test('should handle offline mode gracefully in workflows', async () => {
      const patientData = {
        age_years: 65,
        gcs: 12,
        gfap_value: 200,
      };

      // First make a successful call to cache the result
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.55,
          confidence: 0.78,
          drivers: ['Moderate risk factors'],
        }),
      });

      await predictionClient.predict('coma_ich', patientData);

      // Simulate going offline
      predictionClient.isOnline = false;

      // Should return cached result with offline indicators
      const offlineResult = await predictionClient.predict('coma_ich', patientData);

      expect(offlineResult.fromCache).toBe(true);
      expect(offlineResult.offlineMode).toBe(true);
      expect(offlineResult.warning).toContain('offline mode');
      expect(offlineResult.probability).toBe(0.55);
    });
  });

  describe('Performance and Monitoring Integration', () => {
    test('should track complete workflow performance metrics', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 250,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.60,
          confidence: 0.80,
          drivers: ['Moderate risk'],
        }),
      });

      await predictionClient.predict('coma_ich', patientData);

      // Verify performance monitoring was active
      expect(medicalPerformanceMonitor.startMeasurement).toHaveBeenCalledWith(
        expect.stringContaining('coma_ich'),
        'api_call',
        expect.any(Object)
      );

      expect(medicalPerformanceMonitor.endMeasurement).toHaveBeenCalledWith(
        'workflow-metric-id'
      );

      // Get performance statistics
      const stats = medicalPerformanceMonitor.getStatistics();
      expect(stats.totalMeasurements).toBe(1);
      expect(stats.slaCompliance.compliancePercentage).toBe(100);
    });

    test('should generate comprehensive workflow audit trail', async () => {
      const patientData = {
        age_years: 75,
        gcs: 8,
        gfap_value: 400,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({
          probability: 0.75,
          confidence: 0.85,
          drivers: ['Elderly patient', 'Impaired consciousness', 'Elevated biomarker'],
        }),
      });

      const result = await predictionClient.predict('coma_ich', patientData);

      // Verify audit events were published
      const { medicalEventObserver } = require('../../patterns/observer.js');
      expect(medicalEventObserver.publish).toHaveBeenCalledWith(
        'audit_event',
        expect.objectContaining({
          event_type: 'PREDICTION_REQUEST',
          module: 'coma_ich',
          result_probability: 0.75,
          timestamp: expect.any(String),
        })
      );

      expect(result.probability).toBe(0.75);
    });
  });
});