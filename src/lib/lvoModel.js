/**
 * Production LVO Model - Scientifically Calibrated (JavaScript Version)
 *
 * Implementation of GFAP + FAST-ED LVO prediction model with:
 * - Yeo-Johnson power transformation for GFAP
 * - Z-score normalization
 * - Logistic regression with calibrated thresholds
 * - Platt scaling for probability calibration
 */

// Model parameters (scientifically calibrated via CalibratedClassifierCV)
const LAMBDA = -0.825559; // Yeo-Johnson lambda for GFAP transformation
const B0 = -0.408314; // Logistic regression intercept
const B_GFAP = -0.826450; // GFAP coefficient (negative = protective when transformed)
const B_FAST = 1.651521; // FAST-ED coefficient (positive = risk factor)

// Standardization parameters (from training data statistics)
const MU_G = -0.000000; // Mean of transformed GFAP
const SIG_G = 1.000000; // Standard deviation of transformed GFAP
const MU_F = 3.701422; // Mean of FAST-ED
const SIG_F = 2.306173; // Standard deviation of FAST-ED

// Platt scaling parameters (for probability calibration)
const A_PLATT = 1.117420; // Platt scaling slope
const B_PLATT = -1.032167; // Platt scaling intercept

// Decision threshold
const FINAL_THRESHOLD = 0.333333; // Classification threshold

// Validation constants
const NUMERIC_EPS = 1e-15;
const MAX_GFAP_WARNING = 50000;
const MIN_FAST_ED = 0;
const MAX_FAST_ED = 16;

/**
 * Yeo-Johnson power transformation
 */
function yeoJohnson(x, lambda) {
  if (Math.abs(lambda) < NUMERIC_EPS) {
    return Math.log(x + 1.0);
  }
  return ((x + 1.0) ** lambda - 1.0) / lambda;
}

/**
 * Z-score standardization
 */
function standardize(value, mean, std) {
  return (value - mean) / std;
}

/**
 * Logistic (sigmoid) function
 */
function logistic(x) {
  if (x > 500) {
    return 1.0;
  } // Prevent overflow
  if (x < -500) {
    return 0.0;
  } // Prevent underflow
  return 1.0 / (1.0 + Math.exp(-x));
}

/**
 * Input validation
 */
function validateInputs(gfap, fasted) {
  // Check for null/undefined
  if (gfap == null) {
    throw new Error("gfap is required");
  }
  if (fasted == null) {
    throw new Error("fasted is required");
  }

  // Convert to numbers
  const numGfap = Number(gfap);
  const numFasted = Number(fasted);

  // Check for valid numbers
  if (!Number.isFinite(numGfap)) {
    throw new Error("gfap must be a finite number");
  }
  if (!Number.isFinite(numFasted)) {
    throw new Error("fasted must be a finite number");
  }

  // Check ranges
  if (numGfap < 0) {
    throw new Error("GFAP value must be non-negative");
  }

  return { gfap: numGfap, fasted: numFasted };
}

/**
 * Calculate LVO probability using scientifically calibrated model
 */
export function lvoProbability(gfap, fasted) {
  const validated = validateInputs(gfap, fasted);

  // Clamp FAST-ED to valid range
  const clampedFasted = Math.max(MIN_FAST_ED, Math.min(MAX_FAST_ED, validated.fasted));

  // Apply transformations
  const gfapTransformed = yeoJohnson(validated.gfap, LAMBDA);
  const gfapStandardized = standardize(gfapTransformed, MU_G, SIG_G);
  const fastedStandardized = standardize(clampedFasted, MU_F, SIG_F);

  // Calculate logit
  const logit = B0 + B_GFAP * gfapStandardized + B_FAST * fastedStandardized;

  // Apply Platt calibration
  const calibratedLogit = A_PLATT * logit + B_PLATT;

  // Return probability
  return logistic(calibratedLogit);
}

/**
 * Binary classification using threshold
 */
export function lvoClass(gfap, fasted) {
  const probability = lvoProbability(gfap, fasted);
  return probability >= FINAL_THRESHOLD ? 1 : 0;
}

/**
 * Comprehensive prediction with detailed intermediate values
 */
export function predictLVO(gfap, fasted) {
  const warnings = [];
  let isValid = true;

  try {
    const validated = validateInputs(gfap, fasted);
    const originalFasted = validated.fasted;

    // Clamp FAST-ED and warn if out of range
    const clampedFasted = Math.max(MIN_FAST_ED, Math.min(MAX_FAST_ED, validated.fasted));
    if (clampedFasted !== originalFasted) {
      warnings.push(`FAST-ED score clamped from ${originalFasted} to ${clampedFasted} (valid range: ${MIN_FAST_ED}-${MAX_FAST_ED})`);
    }

    // Warn for very high GFAP values
    if (validated.gfap > MAX_GFAP_WARNING) {
      warnings.push(`GFAP value ${validated.gfap} exceeds typical range (may indicate extreme case)`);
    }

    // Apply transformations
    const gfapTransformed = yeoJohnson(validated.gfap, LAMBDA);
    const gfapStandardized = standardize(gfapTransformed, MU_G, SIG_G);
    const fastedStandardized = standardize(clampedFasted, MU_F, SIG_F);

    // Calculate logit
    const logit = B0 + B_GFAP * gfapStandardized + B_FAST * fastedStandardized;

    // Apply Platt calibration
    const calibratedLogit = A_PLATT * logit + B_PLATT;

    // Calculate final probability
    const probability = logistic(calibratedLogit);
    const classification = probability >= FINAL_THRESHOLD ? 1 : 0;

    return {
      probability,
      classification,
      inputs: {
        gfap: validated.gfap,
        fasted: clampedFasted,
      },
      transformedValues: {
        gfapTransformed,
        gfapStandardized,
        fastedStandardized,
        logit,
        calibratedLogit,
      },
      metadata: {
        modelVersion: "2024.09.28-calibrated",
        threshold: FINAL_THRESHOLD,
        isValid,
        warnings,
      },
    };
  } catch (error) {
    warnings.push(error.message);
    isValid = false;

    return {
      probability: NaN,
      classification: 0,
      inputs: { gfap, fasted },
      transformedValues: {
        gfapTransformed: NaN,
        gfapStandardized: NaN,
        fastedStandardized: NaN,
        logit: NaN,
        calibratedLogit: NaN,
      },
      metadata: {
        modelVersion: "2024.09.28-calibrated",
        threshold: FINAL_THRESHOLD,
        isValid,
        warnings,
      },
    };
  }
}

// Export constants for external use
export const MODEL_CONSTANTS = {
  LAMBDA,
  B0,
  B_GFAP,
  B_FAST,
  MU_G,
  SIG_G,
  MU_F,
  SIG_F,
  A_PLATT,
  B_PLATT,
  FINAL_THRESHOLD,
};
