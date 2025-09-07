/**
 * Local LVO Prediction Model
 * Uses GFAP and FAST-ED scores to predict LVO probability
 * Based on research findings with Yeo-Johnson transformation
 */

// Model coefficients from trained logistic regression
const MODEL_PARAMS = {
  intercept: -0.4731,
  coefficients: {
    gfap: -0.8623,
    fastEd: 1.8253
  },
  scaling: {
    gfap: {
      mean: 0.0000,
      std: 1.0000
    },
    fastEd: {
      mean: 3.6667,
      std: 2.3495
    }
  }
};

/**
 * Yeo-Johnson power transformation
 * Handles both positive and negative values
 * @param {number} x - Input value
 * @param {number} lambda - Transformation parameter (0 for log transform)
 * @returns {number} Transformed value
 */
function yeoJohnsonTransform(x, lambda = 0) {
  if (x >= 0) {
    if (lambda === 0) {
      return Math.log(x + 1);
    } else {
      return (Math.pow(x + 1, lambda) - 1) / lambda;
    }
  } else {
    if (lambda === 2) {
      return -Math.log(-x + 1);
    } else {
      return -(Math.pow(-x + 1, 2 - lambda) - 1) / (2 - lambda);
    }
  }
}

/**
 * Standard scaling: (value - mean) / std
 * @param {number} value - Raw value
 * @param {number} mean - Mean from training data
 * @param {number} std - Standard deviation from training data
 * @returns {number} Scaled value
 */
function standardScale(value, mean, std) {
  return (value - mean) / std;
}

/**
 * Logistic function to convert log-odds to probability
 * @param {number} logit - Log-odds value
 * @returns {number} Probability between 0 and 1
 */
function logisticFunction(logit) {
  return 1 / (1 + Math.exp(-logit));
}

/**
 * Calculate LVO probability using local model
 * @param {number} gfapValue - GFAP value in pg/mL
 * @param {number} fastEdScore - FAST-ED score (0-9)
 * @returns {Object} Prediction results with probability and risk factors
 */
export function predictLVO(gfapValue, fastEdScore) {
  try {
    // Input validation
    if (gfapValue == null || fastEdScore == null) {
      throw new Error('Missing required inputs: GFAP and FAST-ED scores');
    }
    
    if (gfapValue < 0) {
      throw new Error('GFAP value must be non-negative');
    }
    
    if (fastEdScore < 0 || fastEdScore > 9) {
      throw new Error('FAST-ED score must be between 0 and 9');
    }

    // Step 1: Transform and scale inputs
    // Apply Yeo-Johnson transform to GFAP (lambda=0 for log transform)
    const gfapTransformed = yeoJohnsonTransform(gfapValue, 0);
    
    // Scale both features
    const gfapScaled = standardScale(
      gfapTransformed,
      MODEL_PARAMS.scaling.gfap.mean,
      MODEL_PARAMS.scaling.gfap.std
    );
    
    const fastEdScaled = standardScale(
      fastEdScore,
      MODEL_PARAMS.scaling.fastEd.mean,
      MODEL_PARAMS.scaling.fastEd.std
    );

    // Step 2: Calculate log-odds (logit)
    const logit = MODEL_PARAMS.intercept + 
                  (MODEL_PARAMS.coefficients.gfap * gfapScaled) +
                  (MODEL_PARAMS.coefficients.fastEd * fastEdScaled);

    // Step 3: Convert to probability
    const probability = logisticFunction(logit);

    // Determine risk factors based on contributions
    const riskFactors = [];
    
    // FAST-ED contribution (positive coefficient means higher score increases risk)
    if (fastEdScore >= 4) {
      riskFactors.push({
        name: 'High FAST-ED Score',
        value: fastEdScore,
        impact: 'increase',
        contribution: MODEL_PARAMS.coefficients.fastEd * fastEdScaled
      });
    } else if (fastEdScore <= 2) {
      riskFactors.push({
        name: 'Low FAST-ED Score',
        value: fastEdScore,
        impact: 'decrease',
        contribution: MODEL_PARAMS.coefficients.fastEd * fastEdScaled
      });
    }

    // GFAP contribution (negative coefficient means higher GFAP slightly decreases LVO risk)
    if (gfapValue > 500) {
      riskFactors.push({
        name: 'Elevated GFAP',
        value: `${gfapValue.toFixed(0)} pg/mL`,
        impact: 'decrease',
        contribution: MODEL_PARAMS.coefficients.gfap * gfapScaled,
        note: 'May indicate hemorrhagic vs ischemic event'
      });
    } else if (gfapValue < 100) {
      riskFactors.push({
        name: 'Low GFAP',
        value: `${gfapValue.toFixed(0)} pg/mL`,
        impact: 'increase',
        contribution: Math.abs(MODEL_PARAMS.coefficients.gfap * gfapScaled),
        note: 'Consistent with ischemic LVO'
      });
    }

    // Sort risk factors by absolute contribution
    riskFactors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return {
      probability,
      riskLevel: probability > 0.7 ? 'high' : probability > 0.4 ? 'moderate' : 'low',
      model: 'Local LVO Model v2',
      inputs: {
        gfap: gfapValue,
        fastEd: fastEdScore
      },
      scaledInputs: {
        gfap: gfapScaled,
        fastEd: fastEdScaled
      },
      logit,
      riskFactors,
      interpretation: interpretLVOProbability(probability, fastEdScore, gfapValue)
    };

  } catch (error) {
    console.error('LVO prediction error:', error);
    return {
      probability: null,
      error: error.message,
      model: 'Local LVO Model v2'
    };
  }
}

/**
 * Provide clinical interpretation of LVO probability
 * @param {number} probability - LVO probability
 * @param {number} fastEdScore - FAST-ED score
 * @param {number} gfapValue - GFAP value
 * @returns {string} Clinical interpretation
 */
function interpretLVOProbability(probability, fastEdScore, gfapValue) {
  const probPercent = Math.round(probability * 100);
  
  if (probability > 0.7) {
    if (fastEdScore >= 6) {
      return `High probability of LVO (${probPercent}%). FAST-ED score of ${fastEdScore} strongly suggests large vessel occlusion. Consider immediate thrombectomy evaluation.`;
    } else {
      return `High probability of LVO (${probPercent}%). Despite moderate FAST-ED score, biomarker pattern suggests large vessel occlusion.`;
    }
  } else if (probability > 0.4) {
    if (gfapValue > 500) {
      return `Moderate LVO probability (${probPercent}%). Elevated GFAP (${gfapValue.toFixed(0)} pg/mL) may indicate hemorrhagic component. Further imaging recommended.`;
    } else {
      return `Moderate LVO probability (${probPercent}%). Clinical correlation and vascular imaging recommended.`;
    }
  } else {
    if (fastEdScore <= 3) {
      return `Low probability of LVO (${probPercent}%). FAST-ED score of ${fastEdScore} suggests small vessel disease or non-vascular etiology.`;
    } else {
      return `Low probability of LVO (${probPercent}%) despite FAST-ED score. Consider alternative diagnoses.`;
    }
  }
}

/**
 * Validate if local model should be used
 * @param {Object} patientData - Patient data object
 * @returns {boolean} True if local model can be used
 */
export function canUseLocalModel(patientData) {
  return patientData?.gfapValue != null && 
         patientData?.fastEdScore != null &&
         patientData?.gfapValue >= 0 &&
         patientData?.fastEdScore >= 0 &&
         patientData?.fastEdScore <= 9;
}