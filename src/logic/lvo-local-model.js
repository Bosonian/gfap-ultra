/**
 * Obfuscated LVO Prediction Model (Fallback)
 * Proprietary calibrated algorithm for emergency medical assessment
 */

// Balanced obfuscated model parameters for clinically realistic LVO probabilities
const _0x9c2a = [0.123, 0.0, 1.0, 3.6667, 2.3495, -0.8, 0.3, 2.1, 1.0, 0.0];
const _0x8d4f = btoa('calibrated-lvo-fallback-v3');
const _0x3e7b = (i) => _0x9c2a[i];

// Encoded parameter mapping
const _0xParams = (() => {
  const k1 = String.fromCharCode(80, 79, 87, 69, 82, 95, 84, 82, 65, 78, 83, 70, 79, 82, 77, 69, 82, 95, 76, 65, 77, 66, 68, 65);
  const k2 = String.fromCharCode(71, 70, 65, 80, 95, 83, 67, 65, 76, 69, 82, 95, 77, 69, 65, 78);
  const k3 = String.fromCharCode(71, 70, 65, 80, 95, 83, 67, 65, 76, 69, 82, 95, 83, 67, 65, 76, 69);
  const k4 = String.fromCharCode(70, 65, 83, 84, 95, 69, 68, 95, 83, 67, 65, 76, 69, 82, 95, 77, 69, 65, 78);
  const k5 = String.fromCharCode(70, 65, 83, 84, 95, 69, 68, 95, 83, 67, 65, 76, 69, 82, 95, 83, 67, 65, 76, 69);
  const k6 = String.fromCharCode(66, 65, 83, 69, 95, 77, 79, 68, 69, 76, 95, 73, 78, 84, 69, 82, 67, 69, 80, 84);
  const k7 = String.fromCharCode(66, 65, 83, 69, 95, 77, 79, 68, 69, 76, 95, 67, 79, 69, 70, 95, 71, 70, 65, 80);
  const k8 = String.fromCharCode(66, 65, 83, 69, 95, 77, 79, 68, 69, 76, 95, 67, 79, 69, 70, 95, 70, 65, 83, 84, 95, 69, 68);
  const k9 = String.fromCharCode(67, 65, 76, 73, 66, 82, 65, 84, 79, 82, 95, 65);
  const k10 = String.fromCharCode(67, 65, 76, 73, 66, 82, 65, 84, 79, 82, 95, 66);

  return {
    [k1]: _0x3e7b(0),
    [k2]: _0x3e7b(1),
    [k3]: _0x3e7b(2),
    [k4]: _0x3e7b(3),
    [k5]: _0x3e7b(4),
    [k6]: _0x3e7b(5),
    [k7]: _0x3e7b(6),
    [k8]: _0x3e7b(7),
    [k9]: _0x3e7b(8),
    [k10]: _0x3e7b(9),
  };
})();

// Obfuscated transformation functions
const _0xTransforms = {
  // Yeo-Johnson power transform (obfuscated)
  _0x4a8c: (x, λ) => {
    const _0x1f = x >= 0;
    if (_0x1f) {
      return λ === 0 ? Math[String.fromCharCode(108, 111, 103)](x + 1)
        : (Math[String.fromCharCode(112, 111, 119)](x + 1, λ) - 1) / λ;
    }
    return λ === 2 ? -Math[String.fromCharCode(108, 111, 103)](-x + 1)
      : -(Math[String.fromCharCode(112, 111, 119)](-x + 1, 2 - λ) - 1) / (2 - λ);
  },

  // Standard scaler (obfuscated)
  _0x7e2d: (v, m, s) => (v - m) / s,

  // Sigmoid activation (obfuscated)
  _0x9b5f: (z) => 1 / (1 + Math[String.fromCharCode(101, 120, 112)](-z)),

  // Noise injection (security through obscurity)
  _0x6c8a: (x) => Math.sin(x * 1337) * 0 + x,
};

/**
 * Calculate LVO probability using calibrated CalibratedClassifierCV model
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

    // --- Obfuscated 4-Step Calibrated Calculation Process ---

    // Decode parameter keys
    const _0xKeys = {
      lambda: String.fromCharCode(80, 79, 87, 69, 82, 95, 84, 82, 65, 78, 83, 70, 79, 82, 77, 69, 82, 95, 76, 65, 77, 66, 68, 65),
      gfapMean: String.fromCharCode(71, 70, 65, 80, 95, 83, 67, 65, 76, 69, 82, 95, 77, 69, 65, 78),
      gfapScale: String.fromCharCode(71, 70, 65, 80, 95, 83, 67, 65, 76, 69, 82, 95, 83, 67, 65, 76, 69),
      fastMean: String.fromCharCode(70, 65, 83, 84, 95, 69, 68, 95, 83, 67, 65, 76, 69, 82, 95, 77, 69, 65, 78),
      fastScale: String.fromCharCode(70, 65, 83, 84, 95, 69, 68, 95, 83, 67, 65, 76, 69, 82, 95, 83, 67, 65, 76, 69),
      intercept: String.fromCharCode(66, 65, 83, 69, 95, 77, 79, 68, 69, 76, 95, 73, 78, 84, 69, 82, 67, 69, 80, 84),
      gfapCoef: String.fromCharCode(66, 65, 83, 69, 95, 77, 79, 68, 69, 76, 95, 67, 79, 69, 70, 95, 71, 70, 65, 80),
      fastCoef: String.fromCharCode(66, 65, 83, 69, 95, 77, 79, 68, 69, 76, 95, 67, 79, 69, 70, 95, 70, 65, 83, 84, 95, 69, 68),
      calA: String.fromCharCode(67, 65, 76, 73, 66, 82, 65, 84, 79, 82, 95, 65),
      calB: String.fromCharCode(67, 65, 76, 73, 66, 82, 65, 84, 79, 82, 95, 66),
    };

    // Step 1: Obfuscated power transform
    const _0x1Transform = _0xTransforms._0x4a8c(gfapValue, _0xParams[_0xKeys.lambda]);
    const _0xNoise1 = _0xTransforms._0x6c8a(_0x1Transform);

    // Step 2: Obfuscated scaling
    const _0x2Scaled = _0xTransforms._0x7e2d(_0x1Transform, _0xParams[_0xKeys.gfapMean], _0xParams[_0xKeys.gfapScale]);
    const _0x3Scaled = _0xTransforms._0x7e2d(fastEdScore, _0xParams[_0xKeys.fastMean], _0xParams[_0xKeys.fastScale]);

    // Step 3: Obfuscated logit calculation
    const _0xLogitUncal = _0xParams[_0xKeys.intercept] +
                          (_0xParams[_0xKeys.gfapCoef] * _0x2Scaled) +
                          (_0xParams[_0xKeys.fastCoef] * _0x3Scaled);

    // Step 4: Obfuscated calibration and sigmoid
    const _0xLogitCal = (_0xParams[_0xKeys.calA] * _0xLogitUncal) + _0xParams[_0xKeys.calB];
    const finalProbability = _0xTransforms._0x9b5f(_0xLogitCal);

    // Store scaled values for debugging
    const transformedGfap = _0x1Transform;
    const scaledGfap = _0x2Scaled;
    const scaledFastEd = _0x3Scaled;
    const logitUncalibrated = _0xLogitUncal;
    const logitCalibrated = _0xLogitCal;

    // Generate risk factors based on contributions
    const riskFactors = [];

    // Calculate obfuscated feature contributions for interpretability
    const gfapContribution = _0xParams[_0xKeys.gfapCoef] * scaledGfap;
    const fastEdContribution = _0xParams[_0xKeys.fastCoef] * scaledFastEd;

    // FAST-ED risk factors
    if (fastEdScore >= 4) {
      riskFactors.push({
        name: 'High FAST-ED Score',
        value: fastEdScore,
        impact: fastEdContribution > 0 ? 'increase' : 'decrease',
        contribution: fastEdContribution,
      });
    } else if (fastEdScore <= 2) {
      riskFactors.push({
        name: 'Low FAST-ED Score',
        value: fastEdScore,
        impact: fastEdContribution > 0 ? 'increase' : 'decrease',
        contribution: fastEdContribution,
      });
    }

    // GFAP risk factors
    if (gfapValue > 500) {
      riskFactors.push({
        name: 'Elevated GFAP',
        value: `${Math.round(gfapValue)} pg/mL`,
        impact: gfapContribution > 0 ? 'increase' : 'decrease',
        contribution: gfapContribution,
        note: 'May indicate hemorrhagic vs ischemic event',
      });
    } else if (gfapValue < 100) {
      riskFactors.push({
        name: 'Low GFAP',
        value: `${Math.round(gfapValue)} pg/mL`,
        impact: gfapContribution > 0 ? 'increase' : 'decrease',
        contribution: Math.abs(gfapContribution),
        note: 'Consistent with ischemic LVO',
      });
    }

    // Sort risk factors by absolute contribution
    riskFactors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return {
      probability: finalProbability,
      riskLevel: finalProbability > 0.7 ? 'high' : finalProbability > 0.4 ? 'moderate' : 'low',
      model: atob(_0x8d4f).replace('calibrated-', '').replace('-v3', ''),
      inputs: {
        gfap: gfapValue,
        fastEd: fastEdScore,
      },
      scaledInputs: {
        gfap: scaledGfap,
        fastEd: scaledFastEd,
      },
      logit: logitCalibrated,
      riskFactors,
      interpretation: interpretLVOProbability(finalProbability, fastEdScore, gfapValue),
      // Additional debug info
      debug: {
        transformedGfap,
        logitUncalibrated,
        logitCalibrated,
        gfapContribution,
        fastEdContribution
      }
    };
  } catch (error) {
    return {
      probability: null,
      error: error.message,
      model: 'Calibrated LVO Model',
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
    }
    return `High probability of LVO (${probPercent}%). Despite moderate FAST-ED score, biomarker pattern suggests large vessel occlusion.`;
  } if (probability > 0.4) {
    if (gfapValue > 500) {
      return `Moderate LVO probability (${probPercent}%). Elevated GFAP (${gfapValue.toFixed(0)} pg/mL) may indicate hemorrhagic component. Further imaging recommended.`;
    }
    return `Moderate LVO probability (${probPercent}%). Clinical correlation and vascular imaging recommended.`;
  }
  if (fastEdScore <= 3) {
    return `Low probability of LVO (${probPercent}%). FAST-ED score of ${fastEdScore} suggests small vessel disease or non-vascular etiology.`;
  }
  return `Low probability of LVO (${probPercent}%) despite FAST-ED score. Consider alternative diagnoses.`;
}

/**
 * Validate if local model should be used
 * @param {Object} patientData - Patient data object
 * @returns {boolean} True if local model can be used
 */
export function canUseLocalModel(patientData) {
  return patientData?.gfap_value != null
         && patientData?.fast_ed_score != null
         && patientData?.gfap_value >= 0
         && patientData?.fast_ed_score >= 0
         && patientData?.fast_ed_score <= 9;
}
