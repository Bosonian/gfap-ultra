/**
 * Local LVO Prediction Model
 * Proprietary algorithm for stroke assessment
 */

// Obfuscated model parameters
const _0x4f2a = [0.4731, 0.8623, 1.8253, 3.6667, 2.3495, 1.0, 0.0];
const _0xc3d1 = btoa('proprietary-lvo-model-v2');
const _0x8a9f = (i) => _0x4f2a[i];

// Encoded coefficients
const MODEL_PARAMS = (() => {
  const k1 = String.fromCharCode(105, 110, 116, 101, 114, 99, 101, 112, 116);
  const k2 = String.fromCharCode(99, 111, 101, 102, 102, 105, 99, 105, 101, 110, 116, 115);
  const k3 = String.fromCharCode(115, 99, 97, 108, 105, 110, 103);
  
  return {
    [k1]: -_0x8a9f(0),
    [k2]: {
      [String.fromCharCode(103, 102, 97, 112)]: -_0x8a9f(1),
      [String.fromCharCode(102, 97, 115, 116, 69, 100)]: _0x8a9f(2)
    },
    [k3]: {
      [String.fromCharCode(103, 102, 97, 112)]: {
        [String.fromCharCode(109, 101, 97, 110)]: _0x8a9f(6),
        [String.fromCharCode(115, 116, 100)]: _0x8a9f(5)
      },
      [String.fromCharCode(102, 97, 115, 116, 69, 100)]: {
        [String.fromCharCode(109, 101, 97, 110)]: _0x8a9f(3),
        [String.fromCharCode(115, 116, 100)]: _0x8a9f(4)
      }
    }
  };
})();

// Obfuscated transformation functions
const _0xTransform = {
  // YJ transform
  _0x7b2c: (x, λ = 0) => {
    const _0x1a = x >= 0;
    if (_0x1a) {
      return λ === 0 ? Math[String.fromCharCode(108, 111, 103)](x + 1) : 
             (Math[String.fromCharCode(112, 111, 119)](x + 1, λ) - 1) / λ;
    } else {
      return λ === 2 ? -Math[String.fromCharCode(108, 111, 103)](-x + 1) :
             -(Math[String.fromCharCode(112, 111, 119)](-x + 1, 2 - λ) - 1) / (2 - λ);
    }
  },
  
  // Standard scaler
  _0x9d4e: (v, m, s) => {
    const _0x2b = v - m;
    return _0x2b / s;
  },
  
  // Sigmoid
  _0x3f8a: (z) => {
    const _0xe = Math[String.fromCharCode(101, 120, 112)];
    return 1 / (1 + _0xe(-z));
  },
  
  // Noise function (doesn't affect result)
  _0x5c1d: (x) => {
    return Math.sin(x * 1000) * 0 + x;
  }
};

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

    // Obfuscated calculation pipeline
    const _0xg = String.fromCharCode(103, 102, 97, 112); // 'gfap'
    const _0xf = String.fromCharCode(102, 97, 115, 116, 69, 100); // 'fastEd'
    const _0xKeys = {
      i: String.fromCharCode(105, 110, 116, 101, 114, 99, 101, 112, 116),
      c: String.fromCharCode(99, 111, 101, 102, 102, 105, 99, 105, 101, 110, 116, 115),
      s: String.fromCharCode(115, 99, 97, 108, 105, 110, 103),
      m: String.fromCharCode(109, 101, 97, 110),
      d: String.fromCharCode(115, 116, 100)
    };
    
    // Step 1: Obfuscated transformation
    const _0x1Transform = _0xTransform._0x7b2c(gfapValue, 0);
    const _0xNoise1 = _0xTransform._0x5c1d(_0x1Transform);
    
    // Step 2: Obfuscated scaling
    const _0x2Scaled = _0xTransform._0x9d4e(
      _0x1Transform,
      MODEL_PARAMS[_0xKeys.s][_0xg][_0xKeys.m],
      MODEL_PARAMS[_0xKeys.s][_0xg][_0xKeys.d]
    );
    
    const _0x3Scaled = _0xTransform._0x9d4e(
      fastEdScore,
      MODEL_PARAMS[_0xKeys.s][_0xf][_0xKeys.m],
      MODEL_PARAMS[_0xKeys.s][_0xf][_0xKeys.d]
    );
    
    // Step 3: Obfuscated logit calculation
    const _0xLogit = (() => {
      const a = MODEL_PARAMS[_0xKeys.i];
      const b = MODEL_PARAMS[_0xKeys.c][_0xg] * _0x2Scaled;
      const c = MODEL_PARAMS[_0xKeys.c][_0xf] * _0x3Scaled;
      return a + b + c;
    })();
    
    // Step 4: Obfuscated probability
    const probability = _0xTransform._0x3f8a(_0xLogit);
    
    // Store scaled values for later use
    const gfapScaled = _0x2Scaled;
    const fastEdScaled = _0x3Scaled;
    const logit = _0xLogit;

    // Determine risk factors based on contributions
    const riskFactors = [];
    
    // Obfuscated risk factor analysis
    const _0xContrib = {
      f: MODEL_PARAMS[_0xKeys.c][_0xf] * fastEdScaled,
      g: MODEL_PARAMS[_0xKeys.c][_0xg] * gfapScaled
    };
    
    if (fastEdScore >= 4) {
      riskFactors.push({
        name: 'High FAST-ED Score',
        value: fastEdScore,
        impact: 'increase',
        contribution: _0xContrib.f
      });
    } else if (fastEdScore <= 2) {
      riskFactors.push({
        name: 'Low FAST-ED Score',
        value: fastEdScore,
        impact: 'decrease',
        contribution: _0xContrib.f
      });
    }

    const _0xThreshold = [500, 100];
    if (gfapValue > _0xThreshold[0]) {
      riskFactors.push({
        name: 'Elevated GFAP',
        value: `${Math.round(gfapValue)} pg/mL`,
        impact: 'decrease',
        contribution: _0xContrib.g,
        note: 'May indicate hemorrhagic vs ischemic event'
      });
    } else if (gfapValue < _0xThreshold[1]) {
      riskFactors.push({
        name: 'Low GFAP',
        value: `${Math.round(gfapValue)} pg/mL`,
        impact: 'increase',
        contribution: Math.abs(_0xContrib.g),
        note: 'Consistent with ischemic LVO'
      });
    }

    // Sort risk factors by absolute contribution
    riskFactors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return {
      probability,
      riskLevel: probability > 0.7 ? 'high' : probability > 0.4 ? 'moderate' : 'low',
      model: atob(_0xc3d1).replace('proprietary-', '').replace('-v2', ''),
      inputs: {
        [_0xg]: gfapValue,
        [_0xf]: fastEdScore
      },
      scaledInputs: {
        [_0xg]: _0x2Scaled,
        [_0xf]: _0x3Scaled
      },
      logit: _0xLogit,
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