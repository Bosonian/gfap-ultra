/**
 * Input Validator Test Suite
 * Medical-Grade Input Validation and Security Testing
 */

import { InputValidator, ValidationResult, MedicalParameterError } from '../../security/input-validator.js';

describe('InputValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new InputValidator();
  });

  describe('XSS Protection', () => {
    test('should sanitize basic XSS attempts', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload="alert(1)">',
        '<div onclick="alert(1)">test</div>',
      ];

      maliciousInputs.forEach(input => {
        const sanitized = validator.sanitizeInput(input);
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror=');
        expect(sanitized).not.toContain('onload=');
        expect(sanitized).not.toContain('onclick=');
      });
    });

    test('should preserve safe content', () => {
      const safeInputs = [
        'Normal patient name',
        'John Doe, age 65',
        'Test < 100 mg/dL',
        'BP: 120/80 mmHg',
        'GFAP value: 250.5 pg/mL',
      ];

      safeInputs.forEach(input => {
        const sanitized = validator.sanitizeInput(input);
        expect(sanitized).toBe(input);
      });
    });

    test('should handle edge cases', () => {
      expect(validator.sanitizeInput('')).toBe('');
      expect(validator.sanitizeInput(null)).toBe('');
      expect(validator.sanitizeInput(undefined)).toBe('');
      expect(validator.sanitizeInput(123)).toBe('123');
    });
  });

  describe('SQL Injection Protection', () => {
    test('should detect SQL injection patterns', () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM passwords --",
        "admin'--",
        "' OR 1=1 --",
        "'; DELETE FROM patients; --",
      ];

      sqlInjectionAttempts.forEach(input => {
        expect(validator.containsSqlInjection(input)).toBe(true);
      });
    });

    test('should allow safe medical content with apostrophes', () => {
      const safeInputs = [
        "O'Connor",
        "Patient's condition",
        "Dr. O'Brien",
        "Can't walk",
        "Doesn't respond",
      ];

      safeInputs.forEach(input => {
        expect(validator.containsSqlInjection(input)).toBe(false);
      });
    });
  });

  describe('Medical Parameter Validation', () => {
    describe('Age Validation', () => {
      test('should validate normal age ranges', () => {
        const validAges = [18, 25, 45, 65, 85, 100];
        validAges.forEach(age => {
          const result = validator.validateAge(age);
          expect(result.isValid).toBe(true);
          expect(result.warnings).toEqual([]);
        });
      });

      test('should reject invalid ages', () => {
        const invalidAges = [-1, 0, 17, 121, 150, null, undefined, 'abc'];
        invalidAges.forEach(age => {
          const result = validator.validateAge(age);
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        });
      });

      test('should provide warnings for extreme ages', () => {
        const result = validator.validateAge(95);
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Patient age >90 years - verify calculation accuracy');
      });
    });

    describe('GFAP Validation', () => {
      test('should validate normal GFAP ranges', () => {
        const validGfap = [50, 100, 250, 500, 1000, 5000];
        validGfap.forEach(gfap => {
          const result = validator.validateGfap(gfap);
          expect(result.isValid).toBe(true);
        });
      });

      test('should reject invalid GFAP values', () => {
        const invalidGfap = [-1, 0, 28, 10002, null, undefined, 'abc'];
        invalidGfap.forEach(gfap => {
          const result = validator.validateGfap(gfap);
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        });
      });

      test('should provide clinical warnings for extreme GFAP values', () => {
        const highGfap = validator.validateGfap(8000);
        expect(highGfap.isValid).toBe(true);
        expect(highGfap.warnings).toContain('GFAP >5000 pg/mL - extremely elevated, verify sample handling');

        const criticalGfap = validator.validateGfap(9500);
        expect(criticalGfap.isValid).toBe(true);
        expect(criticalGfap.warnings).toContain('GFAP >9000 pg/mL - critical level, immediate clinical correlation required');
      });
    });

    describe('Blood Pressure Validation', () => {
      test('should validate normal blood pressure ranges', () => {
        const validBP = [
          { systolic: 120, diastolic: 80 },
          { systolic: 140, diastolic: 90 },
          { systolic: 160, diastolic: 100 },
        ];

        validBP.forEach(bp => {
          const systolicResult = validator.validateBloodPressure(bp.systolic, 'systolic');
          const diastolicResult = validator.validateBloodPressure(bp.diastolic, 'diastolic');

          expect(systolicResult.isValid).toBe(true);
          expect(diastolicResult.isValid).toBe(true);
        });
      });

      test('should reject invalid blood pressure values', () => {
        const invalidBP = [
          { value: 49, type: 'systolic' },
          { value: 301, type: 'systolic' },
          { value: 29, type: 'diastolic' },
          { value: 201, type: 'diastolic' },
        ];

        invalidBP.forEach(bp => {
          const result = validator.validateBloodPressure(bp.value, bp.type);
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        });
      });

      test('should provide hypertension warnings', () => {
        const highSystolic = validator.validateBloodPressure(190, 'systolic');
        expect(highSystolic.warnings).toContain('Systolic >180 mmHg - increased ICH risk');

        const highDiastolic = validator.validateBloodPressure(110, 'diastolic');
        expect(highDiastolic.warnings).toContain('Diastolic >100 mmHg - hypertensive emergency consideration');
      });
    });

    describe('Glasgow Coma Scale (GCS) Validation', () => {
      test('should validate GCS ranges', () => {
        const validGCS = [3, 8, 12, 15];
        validGCS.forEach(gcs => {
          const result = validator.validateGCS(gcs);
          expect(result.isValid).toBe(true);
        });
      });

      test('should reject invalid GCS values', () => {
        const invalidGCS = [1, 2, 16, 20, null, undefined, 'abc'];
        invalidGCS.forEach(gcs => {
          const result = validator.validateGCS(gcs);
          expect(result.isValid).toBe(false);
        });
      });

      test('should provide clinical warnings for critical GCS values', () => {
        const criticalGCS = validator.validateGCS(6);
        expect(criticalGCS.warnings).toContain('GCS <8 - comatose patient, use Coma Module');

        const severeGCS = validator.validateGCS(4);
        expect(criticalGCS.warnings).toContain('GCS <8 - comatose patient, use Coma Module');
      });
    });

    describe('FAST-ED Score Validation', () => {
      test('should validate FAST-ED score ranges', () => {
        const validScores = [0, 2, 4, 6, 8, 10];
        validScores.forEach(score => {
          const result = validator.validateFastEdScore(score);
          expect(result.isValid).toBe(true);
        });
      });

      test('should reject invalid FAST-ED scores', () => {
        const invalidScores = [-1, 11, 15, null, undefined, 'abc'];
        invalidScores.forEach(score => {
          const result = validator.validateFastEdScore(score);
          expect(result.isValid).toBe(false);
        });
      });

      test('should provide LVO warnings for high FAST-ED scores', () => {
        const highScore = validator.validateFastEdScore(6);
        expect(highScore.warnings).toContain('FAST-ED ≥4 - consider Large Vessel Occlusion (LVO)');

        const veryHighScore = validator.validateFastEdScore(8);
        expect(veryHighScore.warnings).toContain('FAST-ED ≥4 - consider Large Vessel Occlusion (LVO)');
        expect(veryHighScore.warnings).toContain('FAST-ED ≥7 - high probability LVO, urgent intervention');
      });
    });
  });

  describe('Comprehensive Validation', () => {
    test('should validate complete patient data object', () => {
      const validPatientData = {
        age_years: 65,
        gfap_value: 250.5,
        systolic_bp: 140,
        diastolic_bp: 90,
        gcs: 15,
        fast_ed_score: 4,
      };

      const result = validator.validatePatientData(validPatientData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should accumulate errors from multiple invalid fields', () => {
      const invalidPatientData = {
        age_years: -5,
        gfap_value: 25,
        systolic_bp: 400,
        diastolic_bp: 250,
        gcs: 20,
        fast_ed_score: 15,
      };

      const result = validator.validatePatientData(invalidPatientData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5); // Multiple validation errors
    });

    test('should collect warnings from all fields', () => {
      const warningPatientData = {
        age_years: 95,
        gfap_value: 8500,
        systolic_bp: 190,
        diastolic_bp: 110,
        gcs: 6,
        fast_ed_score: 8,
      };

      const result = validator.validatePatientData(warningPatientData);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(5); // Multiple clinical warnings
    });
  });

  describe('Security Input Validation', () => {
    test('should validate and sanitize patient data with security checks', () => {
      const maliciousPatientData = {
        patient_name: '<script>alert("xss")</script>John Doe',
        notes: "'; DROP TABLE patients; --",
        age_years: 65,
        gfap_value: 250,
      };

      const result = validator.validateAndSanitizeInput(maliciousPatientData);

      expect(result.sanitizedData.patient_name).not.toContain('<script');
      expect(result.securityFlags.xssAttempts).toBe(true);
      expect(result.securityFlags.sqlInjectionAttempts).toBe(true);
      expect(result.isSecure).toBe(false);
    });

    test('should handle safe patient data without security warnings', () => {
      const safePatientData = {
        patient_name: 'John Doe',
        notes: 'Patient presents with stroke symptoms',
        age_years: 65,
        gfap_value: 250,
      };

      const result = validator.validateAndSanitizeInput(safePatientData);

      expect(result.sanitizedData).toEqual(safePatientData);
      expect(result.securityFlags.xssAttempts).toBe(false);
      expect(result.securityFlags.sqlInjectionAttempts).toBe(false);
      expect(result.isSecure).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle null and undefined inputs gracefully', () => {
      expect(() => validator.validateAge(null)).not.toThrow();
      expect(() => validator.validateGfap(undefined)).not.toThrow();
      expect(() => validator.sanitizeInput(null)).not.toThrow();
    });

    test('should handle non-numeric strings in numeric fields', () => {
      const result = validator.validateAge('abc');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be a valid number');
    });

    test('should throw MedicalParameterError for critical validation failures', () => {
      expect(() => {
        validator.validateCriticalParameters({
          age_years: -5,
          gfap_value: -100,
        });
      }).toThrow(MedicalParameterError);
    });
  });

  describe('ValidationResult Class', () => {
    test('should create validation results correctly', () => {
      const result = new ValidationResult(true, ['warning'], ['error']);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toEqual(['warning']);
      expect(result.errors).toEqual(['error']);
    });

    test('should combine validation results', () => {
      const result1 = new ValidationResult(true, ['warning1'], []);
      const result2 = new ValidationResult(false, ['warning2'], ['error1']);

      const combined = ValidationResult.combine([result1, result2]);

      expect(combined.isValid).toBe(false); // False if any result is invalid
      expect(combined.warnings).toEqual(['warning1', 'warning2']);
      expect(combined.errors).toEqual(['error1']);
    });
  });
});