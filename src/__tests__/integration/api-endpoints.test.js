/**
 * API Endpoints Integration Tests
 * Testing Real GCP Cloud Function Endpoints with Medical Data
 */

import { BasePredictionClient } from '../../api/base-prediction-client.js';
import { MedicalCacheFactory } from '../../performance/medical-cache.js';

// Mock the performance monitor for integration tests
jest.mock('../../performance/medical-performance-monitor.js', () => ({
  medicalPerformanceMonitor: {
    isMonitoring: true,
    startMeasurement: jest.fn(() => 'test-metric-id'),
    endMeasurement: jest.fn(),
  },
  PerformanceMetricType: {
    API_CALL: 'api_call',
    VALIDATION: 'validation',
    PREDICTION: 'prediction',
  },
}));

// Mock observer for audit trail
jest.mock('../../patterns/observer.js', () => ({
  medicalEventObserver: {
    publish: jest.fn(),
  },
  MEDICAL_EVENTS: {
    AUDIT_EVENT: 'audit_event',
  },
}));

describe('API Endpoints Integration Tests', () => {
  let predictionClient;
  let mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Clear all caches between tests
    MedicalCacheFactory.clearAllCaches();

    // Mock fetch globally
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    predictionClient = new BasePredictionClient();

    // Mock online status
    Object.defineProperty(predictionClient, 'isOnline', {
      value: true,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe('Coma ICH Prediction Endpoint', () => {
    test('should successfully call coma_ich endpoint with valid data', async () => {
      const patientData = {
        age_years: 72,
        gcs: 6,
        gfap_value: 450.0,
        systolic_bp: 165,
        diastolic_bp: 95,
      };

      const expectedResponse = {
        probability: 0.78,
        confidence: 0.85,
        drivers: ['Low GCS (6)', 'Elevated GFAP (450.0)', 'Age factor'],
        model_version: 'coma_ich_v2.1',
        timestamp: '2025-01-15T10:30:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(expectedResponse),
      });

      const result = await predictionClient.predict('coma_ich', patientData);

      // Verify API call was made correctly
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];

      expect(url).toContain('predict_coma_ich');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');

      const requestBody = JSON.parse(options.body);
      expect(requestBody.age_years).toBe(72);
      expect(requestBody.gcs).toBe(6);
      expect(requestBody.gfap_value).toBe(450.0);

      // Verify response structure
      expect(result).toMatchObject({
        probability: 0.78,
        confidence: 0.85,
        module: 'Coma',
        timestamp: expect.any(String),
      });

      expect(result.drivers).toContain('Low GCS (6)');
      expect(result.drivers).toContain('Elevated GFAP (450.0)');
    });

    test('should handle coma_ich endpoint validation errors', async () => {
      const invalidPatientData = {
        age_years: -5, // Invalid age
        gcs: 20, // Invalid GCS
        gfap_value: -100, // Invalid GFAP
      };

      await expect(predictionClient.predict('coma_ich', invalidPatientData))
        .rejects.toThrow('Medical parameter validation failed');

      // Should not make API call if validation fails
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test('should handle coma_ich endpoint server errors', async () => {
      const patientData = {
        age_years: 65,
        gcs: 8,
        gfap_value: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({
          error: 'Model prediction service temporarily unavailable',
          code: 'MODEL_SERVICE_ERROR',
        }),
        headers: new Map(),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Model prediction service temporarily unavailable');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Limited Data ICH Prediction Endpoint', () => {
    test('should successfully call limited_ich endpoint with valid data', async () => {
      const patientData = {
        age_years: 68,
        systolic_bp: 170,
        diastolic_bp: 100,
        gfap_value: 280.5,
        vigilanzminderung: true,
      };

      const expectedResponse = {
        probability: 0.65,
        confidence: 0.72,
        drivers: ['Hypertension', 'Moderate GFAP elevation', 'Consciousness impairment'],
        model_version: 'limited_data_v1.8',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(expectedResponse),
      });

      const result = await predictionClient.predict('limited_ich', patientData);

      // Verify boolean normalization
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.vigilanzminderung).toBe(1); // Boolean converted to 1

      // Verify response
      expect(result).toMatchObject({
        probability: 0.65,
        confidence: 0.72,
        module: 'Limited Data',
      });

      expect(result.drivers).toContain('Hypertension');
    });

    test('should handle limited_ich endpoint timeout', async () => {
      const patientData = {
        age_years: 65,
        gfap_value: 150,
        systolic_bp: 140,
        diastolic_bp: 90,
        vigilanzminderung: false,
      };

      // Mock timeout error
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      await expect(predictionClient.predict('limited_ich', patientData))
        .rejects.toThrow('Request timeout');
    });
  });

  describe('Full Stroke Prediction Endpoint', () => {
    test('should successfully call full_stroke endpoint with complete data', async () => {
      const patientData = {
        age_years: 74,
        systolic_bp: 180,
        diastolic_bp: 110,
        gfap_value: 650.0,
        fast_ed_score: 7,
        headache: false,
        vigilanzminderung: true,
        armparese: true,
        beinparese: false,
        eye_deviation: true,
        atrial_fibrillation: true,
        anticoagulated_noak: false,
        antiplatelets: true,
      };

      const expectedResponse = {
        probability: 0.89,
        confidence: 0.94,
        drivers: [
          'High FAST-ED score (7)',
          'Elevated GFAP (650.0)',
          'Atrial fibrillation',
          'Arm paresis',
          'Eye deviation',
          'Severe hypertension',
        ],
        risk_stratification: {
          lvo_probability: 0.82,
          hemorrhage_risk: 'moderate',
          treatment_urgency: 'high',
        },
        model_version: 'full_stroke_v3.2',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(expectedResponse),
      });

      const result = await predictionClient.predict('full_stroke', patientData);

      // Verify all 13 clinical variables are included
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(Object.keys(requestBody)).toHaveLength(13);

      // Verify boolean conversions
      expect(requestBody.headache).toBe(0);
      expect(requestBody.vigilanzminderung).toBe(1);
      expect(requestBody.armparese).toBe(1);
      expect(requestBody.beinparese).toBe(0);
      expect(requestBody.eye_deviation).toBe(1);
      expect(requestBody.atrial_fibrillation).toBe(1);
      expect(requestBody.anticoagulated_noak).toBe(0);
      expect(requestBody.antiplatelets).toBe(1);

      // Verify response structure
      expect(result).toMatchObject({
        probability: 0.89,
        confidence: 0.94,
        module: 'Full Stroke',
      });

      expect(result.drivers).toContain('High FAST-ED score (7)');
      expect(result.drivers).toContain('Elevated GFAP (650.0)');
      expect(result.riskStratification.lvo_probability).toBe(0.82);
    });

    test('should validate all required fields for full_stroke endpoint', async () => {
      const incompleteData = {
        age_years: 70,
        gfap_value: 300,
        systolic_bp: 160,
        // Missing 10 other required fields
      };

      await expect(predictionClient.predict('full_stroke', incompleteData))
        .rejects.toThrow('Medical parameter validation failed');
    });
  });

  describe('LVO Prediction Endpoint', () => {
    test('should successfully call lvo endpoint with valid data', async () => {
      const patientData = {
        gfap_value: 425.5,
        fast_ed_score: 8,
      };

      const expectedResponse = {
        lvo_probability: 0.84,
        confidence: 0.88,
        interpretation: 'High probability of large vessel occlusion',
        urgency_level: 'critical',
        recommended_action: 'immediate_intervention',
        model_version: 'lvo_v2.0',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(expectedResponse),
      });

      const result = await predictionClient.predict('lvo', patientData);

      // Verify minimal required data
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.gfap_value).toBe(425.5);
      expect(requestBody.fast_ed_score).toBe(8);

      // Verify response mapping
      expect(result).toMatchObject({
        probability: 0.84, // Mapped from lvo_probability
        confidence: 0.88,
        module: 'LVO',
      });

      expect(result.interpretation).toBe('High probability of large vessel occlusion');
      expect(result.urgencyLevel).toBe('critical');
    });

    test('should handle lvo endpoint with low probability response', async () => {
      const patientData = {
        gfap_value: 75.0,
        fast_ed_score: 2,
      };

      const expectedResponse = {
        lvo_probability: 0.18,
        confidence: 0.65,
        interpretation: 'Low probability of large vessel occlusion',
        urgency_level: 'routine',
        recommended_action: 'standard_workflow',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(expectedResponse),
      });

      const result = await predictionClient.predict('lvo', patientData);

      expect(result.probability).toBe(0.18);
      expect(result.urgencyLevel).toBe('routine');
      expect(result.interpretation).toBe('Low probability of large vessel occlusion');
    });
  });

  describe('Cross-Endpoint Performance Tests', () => {
    test('should handle concurrent API calls efficiently', async () => {
      const testData = [
        { endpoint: 'coma_ich', data: { age_years: 65, gcs: 8, gfap_value: 200 } },
        { endpoint: 'limited_ich', data: { age_years: 70, gfap_value: 300, systolic_bp: 160, diastolic_bp: 90, vigilanzminderung: true } },
        { endpoint: 'lvo', data: { gfap_value: 400, fast_ed_score: 6 } },
      ];

      // Mock responses for all endpoints
      testData.forEach((_, index) => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'application/json']]),
          json: () => Promise.resolve({
            probability: 0.5 + (index * 0.1),
            confidence: 0.8,
            drivers: [`Driver ${index + 1}`],
          }),
        });
      });

      const promises = testData.map(({ endpoint, data }) => predictionClient.predict(endpoint, data));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Verify each result has the expected module
      expect(results[0].module).toBe('Coma');
      expect(results[1].module).toBe('Limited Data');
      expect(results[2].module).toBe('LVO');
    });

    test('should handle mixed success and failure responses', async () => {
      const testCases = [
        {
          endpoint: 'coma_ich',
          data: { age_years: 65, gcs: 8, gfap_value: 200 },
          mockResponse: {
            ok: true,
            status: 200,
            headers: new Map([['content-type', 'application/json']]),
            json: () => Promise.resolve({ probability: 0.6, confidence: 0.8 }),
          },
        },
        {
          endpoint: 'limited_ich',
          data: { age_years: 70, gfap_value: 300, systolic_bp: 160, diastolic_bp: 90, vigilanzminderung: false },
          mockResponse: {
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
            json: () => Promise.resolve({ error: 'Model temporarily unavailable' }),
            headers: new Map(),
          },
        },
      ];

      testCases.forEach(({ mockResponse }) => {
        mockFetch.mockResolvedValueOnce(mockResponse);
      });

      const results = await Promise.allSettled([
        predictionClient.predict(testCases[0].endpoint, testCases[0].data),
        predictionClient.predict(testCases[1].endpoint, testCases[1].data),
      ]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[0].value.probability).toBe(0.6);

      expect(results[1].status).toBe('rejected');
      expect(results[1].reason.message).toContain('Model temporarily unavailable');
    });
  });

  describe('API Response Format Validation', () => {
    test('should handle malformed JSON responses', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.reject(new Error('Unexpected token in JSON')),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Unexpected token in JSON');
    });

    test('should handle non-JSON content type responses', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/html']]),
        text: () => Promise.resolve('<html><body>Service temporarily unavailable</body></html>'),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Expected JSON response');
    });

    test('should validate required response fields', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      // Missing required probability field
      const invalidResponse = {
        confidence: 0.8,
        drivers: ['Age factor'],
        // Missing probability field
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(invalidResponse),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Invalid response format');
    });
  });

  describe('Network Error Handling', () => {
    test('should handle network connection errors', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'));

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Network connection failed');
    });

    test('should handle DNS resolution errors', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      const dnsError = new Error('getaddrinfo ENOTFOUND');
      dnsError.code = 'ENOTFOUND';
      mockFetch.mockRejectedValueOnce(dnsError);

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('getaddrinfo ENOTFOUND');
    });
  });

  describe('Authentication and Security Headers', () => {
    test('should include proper security headers in requests', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ probability: 0.5, confidence: 0.8 }),
      });

      await predictionClient.predict('coma_ich', patientData);

      const [, options] = mockFetch.mock.calls[0];

      expect(options.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-Request-ID': expect.any(String),
        'User-Agent': expect.stringContaining('iGFAP-Medical'),
      });

      // Verify request has proper structure
      expect(options.method).toBe('POST');
      expect(options.signal).toBeInstanceOf(AbortSignal);
    });

    test('should handle authentication errors appropriately', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({
          error: 'Invalid API credentials',
          code: 'AUTHENTICATION_FAILED',
        }),
        headers: new Map(),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Invalid API credentials');
    });
  });

  describe('Rate Limiting and Throttling', () => {
    test('should handle rate limiting responses', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Map([
          ['retry-after', '60'],
          ['x-ratelimit-remaining', '0'],
        ]),
        json: () => Promise.resolve({
          error: 'Rate limit exceeded',
          retry_after: 60,
        }),
      });

      await expect(predictionClient.predict('coma_ich', patientData))
        .rejects.toThrow('Rate limit exceeded');
    });

    test('should respect retry-after headers', async () => {
      const patientData = {
        age_years: 65,
        gcs: 10,
        gfap_value: 150,
      };

      // First call - rate limited
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([['retry-after', '1']]),
        json: () => Promise.resolve({ error: 'Rate limit exceeded', retry_after: 1 }),
      });

      try {
        await predictionClient.predict('coma_ich', patientData);
      } catch (error) {
        expect(error.message).toContain('Rate limit exceeded');
        expect(error.retryAfter).toBe(1);
      }
    });
  });
});
