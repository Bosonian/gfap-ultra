/**
 * Production-Grade LVO Prediction Model
 *
 * Implements the complete GFAP+FAST-ED Large Vessel Occlusion prediction pipeline:
 * 1. Input validation and range clamping
 * 2. Yeo-Johnson power transformation of GFAP
 * 3. Standardization of transformed GFAP and FAST-ED
 * 4. Linear logistic regression
 * 5. Platt calibration (sigmoid scaling)
 * 6. Binary classification with threshold
 *
 * This implementation is designed for production medical applications with:
 * - Strict TypeScript typing
 * - Comprehensive input validation
 * - Numeric stability safeguards
 * - Zero external dependencies
 * - Deterministic computation
 */

import {
  LAMBDA,
  MU_G, SIG_G,
  MU_F, SIG_F,
  B0, B_GFAP, B_FAST,
  A_PLATT, B_PLATT,
  FINAL_THRESHOLD,
  NUM_TOL,
  INPUT_RANGES
} from './constants/lvoParams.js';

/**
 * LVO prediction result interface
 */
export interface LVOPredictionResult {
  probability: number;
  classification: 0 | 1;
  inputs: {
    gfap: number;
    fasted: number;
  };
  transformedValues: {
    gfapTransformed: number;
    gfapStandardized: number;
    fastedStandardized: number;
    logit: number;
    calibratedLogit: number;
  };
  metadata: {
    modelVersion: string;
    threshold: number;
    isValid: boolean;
    warnings: string[];
  };
}

/**
 * Applies Yeo-Johnson power transformation to input value.
 *
 * The Yeo-Johnson transformation extends the Box-Cox transformation to handle
 * both positive and negative values, making it suitable for biomarker data.
 *
 * @param x - Input value to transform
 * @param lambda - Transformation parameter
 * @returns Transformed value
 */
function yeoJohnson(x: number, lambda: number): number {
  if (x >= 0) {
    if (Math.abs(lambda) < NUM_TOL.eps) {
      return Math.log(x + 1);
    }
    return (Math.pow(x + 1, lambda) - 1) / lambda;
  } else {
    const twoMinusLambda = 2 - lambda;
    if (Math.abs(twoMinusLambda) < NUM_TOL.eps) {
      return -Math.log(1 - x);
    }
    return -(Math.pow(1 - x, twoMinusLambda) - 1) / twoMinusLambda;
  }
}

/**
 * Standardizes a value using z-score normalization: (x - μ) / σ
 *
 * @param x - Value to standardize
 * @param mu - Mean value
 * @param sigma - Standard deviation
 * @returns Standardized value
 * @throws Error if sigma is zero or invalid
 */
function standardize(x: number, mu: number, sigma: number): number {
  if (!Number.isFinite(sigma) || Math.abs(sigma) < NUM_TOL.eps) {
    throw new Error(`Invalid standardization parameter: sigma=${sigma}`);
  }
  return (x - mu) / sigma;
}

/**
 * Applies logistic (sigmoid) function with numeric stability.
 *
 * Clips the input to prevent overflow/underflow in exponential calculation.
 *
 * @param z - Input logit value
 * @returns Probability value between 0 and 1
 */
function logistic(z: number): number {
  const clippedZ = Math.max(NUM_TOL.expClipMin, Math.min(NUM_TOL.expClipMax, z));
  return 1 / (1 + Math.exp(-clippedZ));
}

/**
 * Clamps FAST-ED score to valid range [0, 16].
 *
 * @param value - Input FAST-ED score
 * @returns Clamped value within valid range
 */
function clampFasted(value: number): number {
  return Math.max(INPUT_RANGES.fasted.min, Math.min(INPUT_RANGES.fasted.max, value));
}

/**
 * Validates and coerces input to a finite number.
 *
 * @param value - Input value to validate
 * @param paramName - Parameter name for error messages
 * @returns Valid finite number
 * @throws Error if value cannot be converted to a valid number
 */
function validateNumber(value: unknown, paramName: string): number {
  if (value === null || value === undefined) {
    throw new Error(`${paramName} is required and cannot be null or undefined`);
  }

  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`${paramName} must be a finite number, got: ${value}`);
  }

  return num;
}

/**
 * Calculates the probability of Large Vessel Occlusion (LVO) based on GFAP and FAST-ED scores.
 *
 * This function implements the complete calibrated pipeline:
 * 1. Yeo-Johnson transformation of GFAP with λ = -0.825559
 * 2. Standardization using training-derived means and standard deviations
 * 3. Linear logistic regression with validated coefficients
 * 4. Platt calibration for probability calibration
 *
 * @param gfap - GFAP biomarker value in pg/mL (must be ≥ 0)
 * @param fasted - FAST-ED neurological score (0-16, will be clamped to valid range)
 * @returns Calibrated probability of LVO (0.0 to 1.0)
 *
 * @example
 * ```typescript
 * const probability = lvoProbability(180, 7);
 * console.log(`LVO probability: ${(probability * 100).toFixed(1)}%`);
 * ```
 */
export function lvoProbability(gfap: number, fasted: number): number {
  // Input validation
  const validGfap = validateNumber(gfap, 'gfap');
  const validFasted = validateNumber(fasted, 'fasted');

  if (validGfap < 0) {
    throw new Error('GFAP value must be non-negative');
  }

  // Clamp FAST-ED to valid range
  const clampedFasted = clampFasted(validFasted);

  // Step 1: Yeo-Johnson transformation of GFAP
  const gfapTransformed = yeoJohnson(validGfap, LAMBDA);

  // Step 2: Standardization
  const gfapStandardized = standardize(gfapTransformed, MU_G, SIG_G);
  const fastedStandardized = standardize(clampedFasted, MU_F, SIG_F);

  // Step 3: Linear logistic regression
  const logit = B0 + B_GFAP * gfapStandardized + B_FAST * fastedStandardized;

  // Step 4: Platt calibration
  const calibratedLogit = A_PLATT * logit + B_PLATT;

  // Step 5: Convert to probability
  return logistic(calibratedLogit);
}

/**
 * Classifies LVO risk as binary outcome (0 = No LVO, 1 = LVO) based on GFAP and FAST-ED scores.
 *
 * Uses the calibrated probability with a clinical threshold of 33.33% for classification.
 * This threshold is derived from training data to optimize clinical sensitivity and specificity.
 *
 * @param gfap - GFAP biomarker value in pg/mL (must be ≥ 0)
 * @param fasted - FAST-ED neurological score (0-16, will be clamped to valid range)
 * @returns Binary classification: 0 (No LVO) or 1 (LVO)
 *
 * @example
 * ```typescript
 * const classification = lvoClass(180, 7);
 * console.log(`LVO classification: ${classification === 1 ? 'Positive' : 'Negative'}`);
 * ```
 */
export function lvoClass(gfap: number, fasted: number): 0 | 1 {
  const probability = lvoProbability(gfap, fasted);
  return probability >= FINAL_THRESHOLD ? 1 : 0;
}

/**
 * Comprehensive LVO prediction with detailed result information.
 *
 * Provides probability, classification, and detailed intermediate values for
 * clinical interpretation and debugging purposes.
 *
 * @param gfap - GFAP biomarker value in pg/mL
 * @param fasted - FAST-ED neurological score (0-16)
 * @returns Detailed prediction result with intermediate calculations
 *
 * @example
 * ```typescript
 * const result = predictLVO(180, 7);
 * console.log(`Probability: ${result.probability.toFixed(3)}`);
 * console.log(`Classification: ${result.classification}`);
 * console.log(`Warnings: ${result.metadata.warnings.join(', ')}`);
 * ```
 */
export function predictLVO(gfap: number, fasted: number): LVOPredictionResult {
  const warnings: string[] = [];

  try {
    // Input validation and preprocessing
    const validGfap = validateNumber(gfap, 'gfap');
    const validFasted = validateNumber(fasted, 'fasted');

    if (validGfap < 0) {
      throw new Error('GFAP value must be non-negative');
    }

    // Check for edge cases and add warnings
    if (validGfap > INPUT_RANGES.gfap.max) {
      warnings.push(`GFAP value (${validGfap}) exceeds typical range`);
    }

    const originalFasted = validFasted;
    const clampedFasted = clampFasted(validFasted);

    if (originalFasted !== clampedFasted) {
      warnings.push(`FAST-ED score clamped from ${originalFasted} to ${clampedFasted}`);
    }

    // Perform calculations
    const gfapTransformed = yeoJohnson(validGfap, LAMBDA);
    const gfapStandardized = standardize(gfapTransformed, MU_G, SIG_G);
    const fastedStandardized = standardize(clampedFasted, MU_F, SIG_F);
    const logit = B0 + B_GFAP * gfapStandardized + B_FAST * fastedStandardized;
    const calibratedLogit = A_PLATT * logit + B_PLATT;
    const probability = logistic(calibratedLogit);
    const classification = probability >= FINAL_THRESHOLD ? 1 : 0;

    return {
      probability,
      classification: classification as 0 | 1,
      inputs: {
        gfap: validGfap,
        fasted: clampedFasted
      },
      transformedValues: {
        gfapTransformed,
        gfapStandardized,
        fastedStandardized,
        logit,
        calibratedLogit
      },
      metadata: {
        modelVersion: '1.0.0',
        threshold: FINAL_THRESHOLD,
        isValid: true,
        warnings
      }
    };

  } catch (error) {
    // Return error result
    return {
      probability: NaN,
      classification: 0,
      inputs: {
        gfap: NaN,
        fasted: NaN
      },
      transformedValues: {
        gfapTransformed: NaN,
        gfapStandardized: NaN,
        fastedStandardized: NaN,
        logit: NaN,
        calibratedLogit: NaN
      },
      metadata: {
        modelVersion: '1.0.0',
        threshold: FINAL_THRESHOLD,
        isValid: false,
        warnings: [error instanceof Error ? error.message : String(error)]
      }
    };
  }
}