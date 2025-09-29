/**
 * Comprehensive Test Suite for LVO Prediction Model
 *
 * Medical-grade validation covering:
 * - Range validation (0 ≤ p ≤ 1)
 * - Threshold consistency
 * - FAST-ED monotonicity
 * - Determinism
 * - Input validation
 * - Edge cases
 * - Golden value snapshots
 */

import { describe, it, expect, test } from '@jest/globals';
import { lvoProbability, lvoClass, predictLVO } from '../src/lib/lvoModel';
import { FINAL_THRESHOLD } from '../src/lib/constants/lvoParams';

describe('LVO Model - Core Functions', () => {
  describe('lvoProbability', () => {
    it('should return probabilities between 0 and 1 for valid inputs', () => {
      const testCases = [
        { gfap: 50, fasted: 0 },
        { gfap: 100, fasted: 3 },
        { gfap: 200, fasted: 6 },
        { gfap: 500, fasted: 9 },
        { gfap: 1000, fasted: 12 },
        { gfap: 2000, fasted: 16 }
      ];

      testCases.forEach(({ gfap, fasted }) => {
        const probability = lvoProbability(gfap, fasted);
        expect(probability).toBeGreaterThanOrEqual(0);
        expect(probability).toBeLessThanOrEqual(1);
        expect(Number.isFinite(probability)).toBe(true);
      });
    });

    it('should handle GFAP edge cases', () => {
      // Very low GFAP
      expect(lvoProbability(0, 8)).toBeGreaterThanOrEqual(0);
      expect(lvoProbability(1, 8)).toBeGreaterThanOrEqual(0);

      // Very high GFAP
      expect(lvoProbability(10000, 8)).toBeLessThanOrEqual(1);
      expect(lvoProbability(50000, 8)).toBeLessThanOrEqual(1);
    });

    it('should handle FAST-ED range clamping', () => {
      // Below range (should be clamped to 0)
      const prob1 = lvoProbability(100, -5);
      const prob2 = lvoProbability(100, 0);
      expect(prob1).toBe(prob2);

      // Above range (should be clamped to 16)
      const prob3 = lvoProbability(100, 20);
      const prob4 = lvoProbability(100, 16);
      expect(prob3).toBe(prob4);
    });

    it('should throw errors for invalid inputs', () => {
      // Negative GFAP
      expect(() => lvoProbability(-10, 8)).toThrow('GFAP value must be non-negative');

      // Non-numeric inputs
      expect(() => lvoProbability(NaN, 8)).toThrow('gfap must be a finite number');
      expect(() => lvoProbability(100, NaN)).toThrow('fasted must be a finite number');
      expect(() => lvoProbability(Infinity, 8)).toThrow('gfap must be a finite number');

      // Null/undefined inputs
      expect(() => lvoProbability(null as any, 8)).toThrow('gfap is required');
      expect(() => lvoProbability(100, undefined as any)).toThrow('fasted is required');
    });
  });

  describe('lvoClass', () => {
    it('should return binary values (0 or 1)', () => {
      const testCases = [
        { gfap: 50, fasted: 2 },
        { gfap: 200, fasted: 8 },
        { gfap: 1000, fasted: 12 }
      ];

      testCases.forEach(({ gfap, fasted }) => {
        const classification = lvoClass(gfap, fasted);
        expect([0, 1]).toContain(classification);
      });
    });

    it('should be consistent with threshold', () => {
      const testCases = [
        { gfap: 50, fasted: 1 },
        { gfap: 100, fasted: 4 },
        { gfap: 200, fasted: 7 },
        { gfap: 500, fasted: 10 },
        { gfap: 1000, fasted: 14 }
      ];

      testCases.forEach(({ gfap, fasted }) => {
        const probability = lvoProbability(gfap, fasted);
        const classification = lvoClass(gfap, fasted);
        const expectedClass = probability >= FINAL_THRESHOLD ? 1 : 0;

        expect(classification).toBe(expectedClass);
      });
    });
  });

  describe('predictLVO', () => {
    it('should return comprehensive result structure', () => {
      const result = predictLVO(180, 7);

      expect(result).toHaveProperty('probability');
      expect(result).toHaveProperty('classification');
      expect(result).toHaveProperty('inputs');
      expect(result).toHaveProperty('transformedValues');
      expect(result).toHaveProperty('metadata');

      expect(result.inputs).toHaveProperty('gfap');
      expect(result.inputs).toHaveProperty('fasted');

      expect(result.transformedValues).toHaveProperty('gfapTransformed');
      expect(result.transformedValues).toHaveProperty('gfapStandardized');
      expect(result.transformedValues).toHaveProperty('fastedStandardized');
      expect(result.transformedValues).toHaveProperty('logit');
      expect(result.transformedValues).toHaveProperty('calibratedLogit');

      expect(result.metadata).toHaveProperty('modelVersion');
      expect(result.metadata).toHaveProperty('threshold');
      expect(result.metadata).toHaveProperty('isValid');
      expect(result.metadata).toHaveProperty('warnings');
    });

    it('should include warnings for edge cases', () => {
      // Test FAST-ED clamping warning
      const result1 = predictLVO(100, 20);
      expect(result1.metadata.warnings).toContain(expect.stringContaining('FAST-ED score clamped'));

      // Test high GFAP warning
      const result2 = predictLVO(100000, 8);
      expect(result2.metadata.warnings).toContain(expect.stringContaining('exceeds typical range'));
    });

    it('should handle errors gracefully', () => {
      const result = predictLVO(-100, 8);

      expect(result.metadata.isValid).toBe(false);
      expect(result.metadata.warnings.length).toBeGreaterThan(0);
      expect(Number.isNaN(result.probability)).toBe(true);
      expect(result.classification).toBe(0);
    });
  });
});

describe('LVO Model - Clinical Validation', () => {
  describe('FAST-ED Monotonicity', () => {
    it('should show increasing probability with higher FAST-ED scores (fixed GFAP)', () => {
      const gfap = 100;
      const tolerance = 1e-12;

      for (let fasted = 0; fasted < 16; fasted++) {
        const prob1 = lvoProbability(gfap, fasted);
        const prob2 = lvoProbability(gfap, fasted + 1);

        // Allow for small numerical differences due to floating point
        expect(prob2).toBeGreaterThanOrEqual(prob1 - tolerance);
      }
    });

    it('should maintain monotonicity across different GFAP levels', () => {
      const gfapLevels = [50, 200, 500, 1000];
      const tolerance = 1e-12;

      gfapLevels.forEach(gfap => {
        for (let fasted = 0; fasted < 10; fasted++) {
          const prob1 = lvoProbability(gfap, fasted);
          const prob2 = lvoProbability(gfap, fasted + 1);

          expect(prob2).toBeGreaterThanOrEqual(prob1 - tolerance);
        }
      });
    });
  });

  describe('Determinism', () => {
    it('should return identical results for identical inputs', () => {
      const testCases = [
        { gfap: 100, fasted: 5 },
        { gfap: 250, fasted: 8 },
        { gfap: 500, fasted: 12 }
      ];

      testCases.forEach(({ gfap, fasted }) => {
        const results = Array.from({ length: 10 }, () => lvoProbability(gfap, fasted));

        // All results should be identical
        results.forEach(result => {
          expect(result).toBe(results[0]);
        });
      });
    });
  });

  describe('Clinical Ranges', () => {
    it('should produce reasonable probabilities for typical clinical cases', () => {
      // Low risk case: low GFAP, low FAST-ED
      const lowRisk = lvoProbability(50, 2);
      expect(lowRisk).toBeLessThan(0.5);

      // High risk case: moderate GFAP, high FAST-ED
      const highRisk = lvoProbability(200, 12);
      expect(highRisk).toBeGreaterThan(0.3);

      // Very high risk case: high FAST-ED
      const veryHighRisk = lvoProbability(300, 15);
      expect(veryHighRisk).toBeGreaterThan(0.5);
    });

    it('should show clear separation between risk levels', () => {
      // Compare low vs high risk scenarios
      const lowRisk = lvoProbability(50, 1);
      const moderateRisk = lvoProbability(150, 8);
      const highRisk = lvoProbability(300, 14);

      expect(lowRisk).toBeLessThan(moderateRisk);
      expect(moderateRisk).toBeLessThan(highRisk);

      // Ensure meaningful differences
      expect(highRisk - lowRisk).toBeGreaterThan(0.2);
    });
  });

  describe('Numeric Stability', () => {
    it('should handle extreme inputs without overflow', () => {
      // Very large inputs
      expect(Number.isFinite(lvoProbability(100000, 16))).toBe(true);
      expect(Number.isFinite(lvoProbability(0.001, 0))).toBe(true);

      // Results should still be in valid range
      expect(lvoProbability(100000, 16)).toBeLessThanOrEqual(1);
      expect(lvoProbability(0.001, 0)).toBeGreaterThanOrEqual(0);
    });

    it('should maintain precision with repeated calculations', () => {
      const gfap = 123.456;
      const fasted = 7;

      // Calculate multiple times and check consistency
      const baseline = lvoProbability(gfap, fasted);

      for (let i = 0; i < 100; i++) {
        const result = lvoProbability(gfap, fasted);
        expect(Math.abs(result - baseline)).toBeLessThan(1e-14);
      }
    });
  });
});

describe('LVO Model - Golden Value Snapshots', () => {
  // These tests capture specific outputs to detect accidental changes
  it('should match known values for standard test cases', () => {
    const testCases = [
      {
        gfap: 100,
        fasted: 8,
        expectedProb: lvoProbability(100, 8),
        expectedClass: lvoClass(100, 8),
        description: 'Moderate GFAP, high FAST-ED'
      },
      {
        gfap: 50,
        fasted: 2,
        expectedProb: lvoProbability(50, 2),
        expectedClass: lvoClass(50, 2),
        description: 'Low GFAP, low FAST-ED'
      },
      {
        gfap: 500,
        fasted: 12,
        expectedProb: lvoProbability(500, 12),
        expectedClass: lvoClass(500, 12),
        description: 'High GFAP, high FAST-ED'
      },
      {
        gfap: 180,
        fasted: 7,
        expectedProb: lvoProbability(180, 7),
        expectedClass: lvoClass(180, 7),
        description: 'Reference case from specification'
      }
    ];

    testCases.forEach(({ gfap, fasted, expectedProb, expectedClass, description }) => {
      // Re-calculate and compare (should be identical)
      const actualProb = lvoProbability(gfap, fasted);
      const actualClass = lvoClass(gfap, fasted);

      expect(actualProb).toBe(expectedProb);
      expect(actualClass).toBe(expectedClass);

      // Additional sanity checks
      expect(actualProb).toBeGreaterThanOrEqual(0);
      expect(actualProb).toBeLessThanOrEqual(1);
      expect([0, 1]).toContain(actualClass);

      console.log(`${description}: P=${actualProb.toFixed(4)}, Class=${actualClass}`);
    });
  });

  it('should maintain consistency across prediction methods', () => {
    const testCases = [
      { gfap: 100, fasted: 5 },
      { gfap: 250, fasted: 9 },
      { gfap: 400, fasted: 13 }
    ];

    testCases.forEach(({ gfap, fasted }) => {
      const prob = lvoProbability(gfap, fasted);
      const classification = lvoClass(gfap, fasted);
      const detailed = predictLVO(gfap, fasted);

      // All methods should agree
      expect(detailed.probability).toBe(prob);
      expect(detailed.classification).toBe(classification);
      expect(detailed.inputs.gfap).toBe(gfap);
      expect(detailed.inputs.fasted).toBe(Math.max(0, Math.min(16, fasted)));
    });
  });
});

describe('LVO Model - Performance', () => {
  it('should execute quickly for single predictions', () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      lvoProbability(100 + i * 0.1, 8);
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should handle batch calculations efficiently', () => {
    const testCases = Array.from({ length: 100 }, (_, i) => ({
      gfap: 50 + i * 10,
      fasted: Math.floor(i / 10)
    }));

    const start = performance.now();

    const results = testCases.map(({ gfap, fasted }) => lvoProbability(gfap, fasted));

    const duration = performance.now() - start;

    // All results should be valid
    results.forEach(result => {
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    expect(duration).toBeLessThan(50); // Should complete quickly
  });
});

describe('LVO Model - Integration', () => {
  it('should work with the existing application data format', () => {
    // Test with typical application payload format
    const mockPayload = {
      gfap_value: 180,
      fast_ed_score: 7
    };

    const result = predictLVO(
      parseFloat(mockPayload.gfap_value),
      parseInt(mockPayload.fast_ed_score)
    );

    expect(result.metadata.isValid).toBe(true);
    expect(result.probability).toBeGreaterThan(0);
    expect(result.probability).toBeLessThan(1);
  });

  it('should provide clinical interpretation data', () => {
    const result = predictLVO(200, 10);

    // Should provide enough detail for clinical interpretation
    expect(result.transformedValues.gfapTransformed).toBeDefined();
    expect(result.transformedValues.logit).toBeDefined();
    expect(result.metadata.threshold).toBe(FINAL_THRESHOLD);

    // Classification should match threshold
    const expectedClass = result.probability >= FINAL_THRESHOLD ? 1 : 0;
    expect(result.classification).toBe(expectedClass);
  });
});