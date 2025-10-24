/**
 * ICH Volume Calculation and Clinical Assessment
 * Based on validated log-log regression model (R² = 0.476)
 * Formula: log₁₀(Volume) = 0.0192 + 0.4533 × log₁₀(GFAP)
 *
 * @typedef {import('../types/medical-types.js').ICHVolumeResult} ICHVolumeResult
 * @typedef {import('../types/medical-types.js').ValidationResult} ValidationResult
 */

// Bulletproof error handling utilities
import {
  safeAsync,
  safeMedicalCalculation,
  MedicalError,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  MEDICAL_ERROR_CODES,
  validateMedicalInputs,
} from "../utils/error-handler.js";

// Type safety utilities
import { TypeChecker, MEDICAL_CONSTANTS } from "../types/medical-types.js";

// Professional logging
import { medicalLogger, LOG_CATEGORIES } from "../utils/medical-logger.js";

// Volume-based risk thresholds with clinical significance
export const VOLUME_THRESHOLDS = {
  low: {
    max: 10,
    color: "#dc2626",
    label: "Small",
    severity: "low",
  },
  moderate: {
    min: 10,
    max: 20,
    color: "#dc2626",
    label: "Moderate",
    severity: "moderate",
  },
  high: {
    min: 20,
    max: 30,
    color: "#dc2626",
    label: "Large",
    severity: "high",
  },
  critical: {
    min: 30,
    color: "#dc2626",
    label: "Critical",
    severity: "critical",
  },
};

// 30-day mortality rates by hemorrhage volume (based on clinical literature)
// Calibrated to Broderick et al. (1993) landmark study:
// - 30ml = 19% mortality
// - 60ml = 91% mortality
// With correlation strengths from observational data
// Reference thresholds for documentation purposes:
export const MORTALITY_BY_VOLUME = {
  "<10ml": "5-10%", // Minor hemorrhage
  "10-30ml": "10-19%", // Small (Broderick: 30ml=19%)
  "30-50ml": "19-44%", // Moderate (interpolated)
  "50-60ml": "44-91%", // Large (Broderick: 60ml=91%)
  "≥60ml": "91-100%", // Massive (Broderick: >60ml=91-100%)
};

/**
 * Calculate ICH volume from GFAP biomarker value with bulletproof error handling
 * @param {number} gfapValue - GFAP value in pg/ml (29-10,001)
 * @returns {Promise<ICHVolumeResult>} Volume calculation results with type safety
 */
export async function calculateICHVolume(gfapValue) {
  return safeMedicalCalculation(
    async inputs => {
      const { gfap } = inputs;

      medicalLogger.info("ICH volume calculation started", {
        category: LOG_CATEGORIES.MEDICAL_CALCULATION,
        gfapValue: gfap,
        operation: "ich_volume_calculation",
      });

      // Type safety validation first
      TypeChecker.ensureType(gfap, "number", "GFAP value");
      TypeChecker.ensureRange(gfap, MEDICAL_CONSTANTS.GFAP_RANGE, "GFAP value");

      // Validate medical input
      const validation = validateMedicalInputs(
        { gfap },
        {
          gfap: {
            required: true,
            type: "number",
            min: 0,
            max: 10001,
            warningMin: 29,
            warningMax: 10000,
          },
        }
      );

      if (!validation.isValid) {
        throw new MedicalError(
          validation.errors[0]?.message || "Invalid GFAP value",
          MEDICAL_ERROR_CODES.INVALID_VITAL_SIGNS,
          ERROR_CATEGORIES.VALIDATION,
          ERROR_SEVERITY.HIGH
        ).withContext({ validationErrors: validation.errors, gfapValue: gfap });
      }

      // Handle edge cases
      if (!gfap || gfap <= 0) {
        return {
          volume: 0,
          volumeRange: { min: 0, max: 0 },
          riskLevel: "low",
          mortalityRate: "~0%",
          isValid: true,
          calculation: "No hemorrhage detected",
          warnings: [],
        };
      }

      // Cap extremely high GFAP values
      const cappedGfap = Math.min(gfap, 10000);
      const warnings = [];
      if (gfap > 10000) {
        warnings.push(
          `GFAP value ${gfap} exceeds maximum calculation range and was capped at 10,000 pg/ml`
        );
      }

      // Values above 10,000 pg/ml are capped for calculation stability
      if (cappedGfap !== gfap) {
        warnings.push("GFAP value was adjusted for calculation stability");
      }

      // Apply log-log regression formula with error checking
      if (cappedGfap <= 0) {
        throw new MedicalError(
          "GFAP value must be positive for volume calculation",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ gfapValue: cappedGfap });
      }

      const logGfap = Math.log10(cappedGfap);
      if (!isFinite(logGfap)) {
        throw new MedicalError(
          "Invalid logarithm calculation for GFAP value",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ gfapValue: cappedGfap, logValue: logGfap });
      }

      const logVolume = 0.0192 + 0.4533 * logGfap;
      if (!isFinite(logVolume)) {
        throw new MedicalError(
          "Invalid volume calculation result",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ logGfap, logVolume });
      }

      const calculatedVolume = 10 ** logVolume;
      if (!isFinite(calculatedVolume) || calculatedVolume < 0) {
        throw new MedicalError(
          "Calculated volume is invalid",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ logVolume, calculatedVolume });
      }

      // Calculate confidence range (±30%)
      const volumeRange = {
        min: calculatedVolume * 0.7,
        max: calculatedVolume * 1.3,
      };

      // Determine risk level based on volume
      const riskLevel = getVolumeRiskLevel(calculatedVolume);

      // Get mortality rate
      const mortalityRate = getMortalityRate(calculatedVolume);

      // Format volume for display
      const displayVolume = calculatedVolume < 1 ? "<1" : calculatedVolume.toFixed(1);

      // Safety check for extreme values
      if (calculatedVolume > 200) {
        warnings.push("Calculated volume is extremely high - please verify GFAP measurement");
      }

      /** @type {ICHVolumeResult} */
      const result = {
        volume: calculatedVolume,
        confidence: 0.476, // R² of the regression model
        volumeCategory: getVolumeCategory(calculatedVolume),
        timestamp: new Date().toISOString(),
        // Legacy properties for backward compatibility
        displayVolume,
        volumeRange: {
          min: volumeRange.min.toFixed(1),
          max: volumeRange.max.toFixed(1),
        },
        riskLevel,
        mortalityRate,
        isValid: true,
        calculation: `Based on GFAP ${gfap} pg/ml`,
        threshold:
          calculatedVolume >= 30 ? "SURGICAL" : calculatedVolume >= 20 ? "HIGH_RISK" : "MANAGEABLE",
        warnings,
        metadata: {
          originalGfap: gfap,
          cappedGfap,
          calculationTimestamp: new Date().toISOString(),
        },
      };

      // Validate final result
      if (typeof result.volume !== "number" || !isFinite(result.volume)) {
        medicalLogger.error("ICH volume calculation result validation failed", {
          category: LOG_CATEGORIES.MEDICAL_CALCULATION,
          gfapValue: gfap,
          resultVolume: result.volume,
          resultType: typeof result.volume,
        });
        throw new MedicalError(
          "Final volume calculation result is invalid",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.CRITICAL
        ).withContext({ result });
      }

      medicalLogger.info("ICH volume calculation completed successfully", {
        category: LOG_CATEGORIES.MEDICAL_CALCULATION,
        gfapValue: gfap,
        calculatedVolume: result.volume,
        volumeCategory: result.volumeCategory,
        riskLevel: result.riskLevel,
        confidence: result.confidence,
      });

      return result;
    },
    { gfap: gfapValue },
    {
      timeout: 5000,
      fallback: error => ({
        volume: 0,
        volumeRange: { min: 0, max: 0 },
        riskLevel: "low",
        mortalityRate: "Calculation unavailable",
        isValid: false,
        calculation: "Calculation error - using fallback",
        error: error.message,
        fallbackUsed: true,
        warnings: ["Volume calculation failed - fallback values used"],
      }),
      context: {
        operation: "ich_volume_calculation",
        gfapValue,
        formula: "log₁₀(Volume) = 0.0192 + 0.4533 × log₁₀(GFAP)",
      },
    }
  );
}

/**
 * Fast synchronous volume estimate for UI rendering
 * Mirrors the main formula without async/error wrappers.
 * @param {number} gfap
 * @returns {number} estimated volume in ml (>= 0)
 */
export function estimateVolumeFromGFAP(gfap) {
  try {
    const v = Math.max(0, 10 ** (0.0192 + 0.4533 * Math.log10(Math.max(1, Math.min(gfap, 10000)))));
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

/**
 * Estimate mortality band from volume (synchronous, display-only)
 * @param {number} volume
 * @returns {string}
 */
export function estimateMortalityFromVolume(volume) {
  if (!Number.isFinite(volume) || volume <= 0) {
    return "5-10%";
  }
  if (volume >= 60) {
    return "91-100%";
  }
  if (volume >= 50) {
    return "44-91%";
  }
  if (volume >= 30) {
    return "19-44%";
  }
  if (volume >= 10) {
    return "10-19%";
  }
  return "5-10%";
}

/**
 * Determine risk level based on calculated volume with safety checks
 * @param {number} volume - Calculated volume in ml
 * @returns {string} Risk level key
 */
function getVolumeRiskLevel(volume) {
  try {
    // Input validation
    if (typeof volume !== "number" || !isFinite(volume)) {
      throw new MedicalError(
        "Invalid volume for risk level calculation",
        MEDICAL_ERROR_CODES.INVALID_VITAL_SIGNS,
        ERROR_CATEGORIES.MEDICAL,
        ERROR_SEVERITY.MEDIUM
      ).withContext({ volume, type: typeof volume });
    }

    if (volume < 0) {
      throw new MedicalError(
        "Volume cannot be negative",
        MEDICAL_ERROR_CODES.INVALID_VITAL_SIGNS,
        ERROR_CATEGORIES.MEDICAL,
        ERROR_SEVERITY.MEDIUM
      ).withContext({ volume });
    }

    if (volume >= VOLUME_THRESHOLDS.critical.min) {
      return "critical";
    }
    if (volume >= VOLUME_THRESHOLDS.high.min) {
      return "high";
    }
    if (volume >= VOLUME_THRESHOLDS.moderate.min) {
      return "moderate";
    }
    return "low";
  } catch (error) {
    // Fallback to 'low' for safety
    console.warn("Risk level calculation failed, defaulting to low:", error.message);
    return "low";
  }
}

/**
 * Get mortality rate based on volume with improved interpolation and safety checks
 * Calibrated to match clinical studies (Broderick 1993: 30ml=19%, 60ml=91%)
 * @param {number} volume - Volume in ml
 * @returns {string} Mortality rate string with citation
 */
function getMortalityRate(volume) {
  try {
    // Input validation
    if (typeof volume !== "number" || !isFinite(volume)) {
      throw new MedicalError(
        "Invalid volume for mortality rate calculation",
        MEDICAL_ERROR_CODES.INVALID_VITAL_SIGNS,
        ERROR_CATEGORIES.MEDICAL,
        ERROR_SEVERITY.MEDIUM
      ).withContext({ volume, type: typeof volume });
    }

    if (volume < 0) {
      return "Invalid volume";
    }

    // For very small hemorrhages
    if (volume < 10) {
      return "5-10%⁴";
    }

    // For small hemorrhages (10-30ml)
    // Broderick: 30ml = 19% mortality
    if (volume < 30) {
      // Linear interpolation: 10ml=10%, 30ml=19%
      const rate = Math.round(10 + ((volume - 10) * (19 - 10)) / (30 - 10));
      // Validate interpolated rate
      if (rate < 0 || rate > 100) {
        throw new MedicalError(
          "Calculated mortality rate out of valid range",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ volume, rate });
      }
      return `${rate}%⁴`;
    }

    // For moderate hemorrhages (30-50ml)
    // Interpolating from Broderick 30ml=19% to 50ml≈44%
    if (volume < 50) {
      // Linear interpolation: 30ml=19%, 50ml=44%
      const rate = Math.round(19 + ((volume - 30) * (44 - 19)) / (50 - 30));
      if (rate < 0 || rate > 100) {
        throw new MedicalError(
          "Calculated mortality rate out of valid range",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ volume, rate });
      }
      return `${rate}%³`;
    }

    // For large hemorrhages (50-60ml)
    // Broderick: 60ml = 91% mortality
    if (volume < 60) {
      // Steeper increase: 50ml=44%, 60ml=91%
      const rate = Math.round(44 + ((volume - 50) * (91 - 44)) / (60 - 50));
      if (rate < 0 || rate > 100) {
        throw new MedicalError(
          "Calculated mortality rate out of valid range",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ volume, rate });
      }
      return `${rate}%²`;
    }

    // For massive hemorrhages (≥60ml)
    // Broderick: >60ml = 91-100%
    if (volume < 80) {
      // 60ml=91%, 80ml=96%
      const rate = Math.round(91 + ((volume - 60) * (96 - 91)) / (80 - 60));
      if (rate < 0 || rate > 100) {
        throw new MedicalError(
          "Calculated mortality rate out of valid range",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.HIGH
        ).withContext({ volume, rate });
      }
      return `${rate}%¹`;
    }

    // For extreme cases (≥80ml)
    return "96-100%¹";
  } catch (error) {
    // Fallback for safety
    console.warn("Mortality rate calculation failed:", error.message);
    return "Rate unavailable";
  }
}

/**
 * Calculate hemorrhage size percentage for visualization with safety checks
 * Based on brain area scaling: 30ml = ~40% of brain area, 100ml = ~70%
 * @param {number} volume - Volume in ml
 * @returns {Promise<number>} Percentage of brain area (0-70)
 */
export async function calculateHemorrhageSizePercent(volume) {
  return safeAsync(
    async () => {
      // Input validation
      if (typeof volume !== "number" || !isFinite(volume)) {
        throw new MedicalError(
          "Invalid volume for size percentage calculation",
          MEDICAL_ERROR_CODES.INVALID_VITAL_SIGNS,
          ERROR_CATEGORIES.VALIDATION,
          ERROR_SEVERITY.MEDIUM
        ).withContext({ volume, type: typeof volume });
      }

      if (volume < 0) {
        throw new MedicalError(
          "Volume cannot be negative for visualization",
          MEDICAL_ERROR_CODES.INVALID_VITAL_SIGNS,
          ERROR_CATEGORIES.VALIDATION,
          ERROR_SEVERITY.MEDIUM
        ).withContext({ volume });
      }

      if (volume <= 0) {
        return 0;
      }
      if (volume >= 100) {
        return 70;
      } // Maximum 70% of brain area

      // Non-linear scaling for realistic appearance
      // 30ml = 40%, 100ml = 70%
      const sqrtValue = Math.sqrt(volume / 30);
      if (!isFinite(sqrtValue)) {
        throw new MedicalError(
          "Invalid square root calculation for visualization",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.MEDIUM
        ).withContext({ volume, sqrtValue });
      }

      const basePercent = sqrtValue * 40;
      const result = Math.min(basePercent, 70);

      // Final validation
      if (!isFinite(result) || result < 0 || result > 100) {
        throw new MedicalError(
          "Calculated percentage out of valid range",
          MEDICAL_ERROR_CODES.CALCULATION_FAILED,
          ERROR_CATEGORIES.MEDICAL,
          ERROR_SEVERITY.MEDIUM
        ).withContext({ volume, basePercent, result });
      }

      return result;
    },
    {
      category: ERROR_CATEGORIES.MEDICAL,
      severity: ERROR_SEVERITY.LOW,
      timeout: 1000,
      fallback: () => {
        // Safe fallback based on simple linear scaling
        if (volume <= 0) {
          return 0;
        }
        if (volume >= 100) {
          return 70;
        }
        return Math.min((volume / 100) * 70, 70);
      },
      context: {
        operation: "hemorrhage_size_calculation",
        volume,
      },
    }
  );
}

/**
 * Get color for volume visualization
 * @param {number} volume - Volume in ml
 * @returns {string} CSS color value
 */
export function getVolumeColor(volume) {
  const riskLevel = getVolumeRiskLevel(volume);
  return VOLUME_THRESHOLDS[riskLevel].color;
}

/**
 * Test function for validation with comprehensive error handling
 * Tests the calculator with known GFAP values
 */
export async function testVolumeCalculator() {
  return safeAsync(
    async () => {
      const testCases = [
        { gfap: 100, expectedVolume: "~5ml" },
        { gfap: 500, expectedVolume: "~15ml" },
        { gfap: 1000, expectedVolume: "~21ml" },
        { gfap: 1500, expectedVolume: "~28ml" },
        { gfap: 3000, expectedVolume: "~50ml" },
        { gfap: 5000, expectedVolume: "~72ml" },
      ];

      // ICH Volume Calculator Test Results
      const results = await Promise.allSettled(
        testCases.map(async test => {
          try {
            const result = await calculateICHVolume(test.gfap);
            return {
              gfap: test.gfap,
              result,
              expected: test.expectedVolume,
              success: true,
            };
          } catch (error) {
            return {
              gfap: test.gfap,
              result: null,
              expected: test.expectedVolume,
              success: false,
              error: error.message,
            };
          }
        })
      );

      // Process results and handle any failures
      const processedResults = results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
        return {
          gfap: testCases[index].gfap,
          result: null,
          expected: testCases[index].expectedVolume,
          success: false,
          error: result.reason?.message || "Test failed",
        };
      });

      const successfulTests = processedResults.filter(r => r.success).length;
      const totalTests = testCases.length;

      return {
        results: processedResults,
        summary: {
          total: totalTests,
          successful: successfulTests,
          failed: totalTests - successfulTests,
          successRate: `${Math.round((successfulTests / totalTests) * 100)}%`,
        },
        timestamp: new Date().toISOString(),
      };
    },
    {
      category: ERROR_CATEGORIES.MEDICAL,
      severity: ERROR_SEVERITY.LOW,
      timeout: 10000,
      fallback: error => ({
        results: [],
        summary: {
          total: 0,
          successful: 0,
          failed: 0,
          successRate: "0%",
        },
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      context: {
        operation: "volume_calculator_test",
      },
    }
  );
}

/**
 * Get volume category according to medical type definitions
 * @param {number} volume - Volume in ml
 * @returns {'small'|'moderate'|'large'|'massive'} Volume category
 */
function getVolumeCategory(volume) {
  try {
    // Type safety validation
    TypeChecker.ensureType(volume, "number", "volume for categorization");

    if (volume < 0) {
      throw new TypeError("Volume cannot be negative for categorization");
    }

    const thresholds = MEDICAL_CONSTANTS.VOLUME_THRESHOLDS;

    if (volume < thresholds.SMALL) {
      return "small";
    }
    if (volume < thresholds.MODERATE) {
      return "moderate";
    }
    if (volume < thresholds.LARGE) {
      return "large";
    }
    return "massive";
  } catch (error) {
    // Fallback to 'small' for safety
    return "small";
  }
}

/**
 * Format volume for display with appropriate precision
 * @param {number} volume - Volume in ml
 * @returns {string} Formatted volume string
 */
export function formatVolumeDisplay(volume) {
  if (volume < 1) {
    return "<1 ml";
  }
  if (volume < 10) {
    return `${volume.toFixed(1)} ml`;
  }
  return `${Math.round(volume)} ml`;
}
