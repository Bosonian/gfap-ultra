/**
 * LVO Model Constants
 *
 * Scientifically calibrated parameters from trained CalibratedClassifierCV pipeline.
 * These values are derived from clinical data and should not be modified without
 * proper retraining and validation.
 */

// Yeo-Johnson transformation parameter
export const LAMBDA = -0.825559;

// Standardization parameters for transformed GFAP
export const MU_G = -0.000000;
export const SIG_G = 1.000000;

// Standardization parameters for FAST-ED score
export const MU_F = 3.701422;
export const SIG_F = 2.306173;

// Base logistic regression coefficients
export const B0 = -0.408314;           // Intercept
export const B_GFAP = -0.826450;       // GFAP coefficient (on transformed & scaled values)
export const B_FAST = 1.651521;        // FAST-ED coefficient (on scaled values)

// Platt calibration parameters (sigmoid scaling)
export const A_PLATT = 1.117420;
export const B_PLATT = -1.032167;

// Classification threshold for binary LVO prediction
export const FINAL_THRESHOLD = 0.333333;

// Numeric tolerance settings for computational stability
export const NUM_TOL = {
  expClipMin: -80,
  expClipMax: 80,
  eps: 1e-12
} as const;

// Input validation ranges
export const INPUT_RANGES = {
  gfap: {
    min: 0,
    max: 50000,  // Extended range for edge cases
    name: 'GFAP (pg/mL)'
  },
  fasted: {
    min: 0,
    max: 16,     // Extended FAST-ED range vs previous 0-9
    name: 'FAST-ED Score'
  }
} as const;

// Model metadata
export const MODEL_INFO = {
  name: 'Production LVO Prediction Model',
  version: '1.0.0',
  description: 'Calibrated GFAP+FAST-ED Large Vessel Occlusion prediction model',
  calibrationType: 'Platt Scaling',
  transformationType: 'Yeo-Johnson',
  trainingDate: '2024-12-01',  // Placeholder for actual training date
  validationAccuracy: 0.85    // Placeholder for actual validation metrics
} as const;