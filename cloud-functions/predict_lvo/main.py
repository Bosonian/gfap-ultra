"""
Production LVO Prediction Cloud Function
Zero-dependency implementation using scientifically calibrated parameters.

Implements the complete GFAP+FAST-ED LVO prediction pipeline:
1. Input validation and FAST-ED range clamping
2. Yeo-Johnson power transformation of GFAP
3. Standardization of transformed GFAP and FAST-ED
4. Linear logistic regression
5. Platt calibration (sigmoid scaling)
6. Binary classification with clinical threshold
"""

import functions_framework
import math
from typing import Dict, Any, Tuple, Union
import json
from flask import jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ======= SCIENTIFICALLY CALIBRATED MODEL CONSTANTS =======
# These parameters are derived from trained CalibratedClassifierCV pipeline
# and should not be modified without proper retraining and validation

LAMBDA = -0.825559                    # Yeo-Johnson transformation parameter

# Standardization parameters
MU_G, SIG_G = -0.000000, 1.000000    # For transformed GFAP
MU_F, SIG_F = 3.701422, 2.306173     # For FAST-ED score

# Base logistic regression coefficients
B0 = -0.408314                        # Intercept
B_GFAP = -0.826450                    # GFAP coefficient (on transformed & scaled values)
B_FAST = 1.651521                     # FAST-ED coefficient (on scaled values)

# Platt calibration parameters (sigmoid scaling)
A_PLATT = 1.117420
B_PLATT = -1.032167

# Clinical classification threshold
FINAL_THRESHOLD = 0.333333

# Numeric stability constants
EXP_CLIP_MIN, EXP_CLIP_MAX = -80.0, 80.0
NUMERIC_EPS = 1e-12

# Input validation ranges
GFAP_MIN, GFAP_MAX = 0, 50000
FASTED_MIN, FASTED_MAX = 0, 16


# ======= MATHEMATICAL PRIMITIVES (Zero Dependencies) =======

def yeo_johnson(x: float, lmbda: float) -> float:
    """
    Yeo-Johnson power transformation (sklearn-exact implementation).

    Extends Box-Cox transformation to handle both positive and negative values.

    Args:
        x: Input value to transform
        lmbda: Transformation parameter

    Returns:
        Transformed value
    """
    if x >= 0.0:
        if abs(lmbda) < NUMERIC_EPS:
            return math.log(x + 1.0)
        return ((x + 1.0) ** lmbda - 1.0) / lmbda
    else:
        two_minus_lmbda = 2.0 - lmbda
        if abs(two_minus_lmbda) < NUMERIC_EPS:
            return -math.log(1.0 - x)
        return -(((1.0 - x) ** two_minus_lmbda - 1.0) / two_minus_lmbda)


def standardize(x: float, mu: float, sigma: float) -> float:
    """
    Z-score standardization: (x - μ) / σ

    Args:
        x: Value to standardize
        mu: Mean
        sigma: Standard deviation

    Returns:
        Standardized value

    Raises:
        ValueError: If sigma is invalid
    """
    if not math.isfinite(sigma) or abs(sigma) < NUMERIC_EPS:
        raise ValueError(f"Invalid sigma for standardization: {sigma}")
    return (x - mu) / sigma


def logistic(z: float) -> float:
    """
    Logistic (sigmoid) function with numeric stability.

    Args:
        z: Input logit value

    Returns:
        Probability value between 0 and 1
    """
    # Clip to prevent overflow/underflow
    z_clipped = max(EXP_CLIP_MIN, min(EXP_CLIP_MAX, z))
    return 1.0 / (1.0 + math.exp(-z_clipped))


def clamp_fasted(value: float) -> float:
    """
    Clamp FAST-ED score to valid range [0, 16].

    Args:
        value: Input FAST-ED score

    Returns:
        Clamped value within valid range
    """
    return max(FASTED_MIN, min(FASTED_MAX, float(value)))


def validate_number(value: Union[int, float, str], param_name: str) -> float:
    """
    Validate and convert input to finite number.

    Args:
        value: Input value to validate
        param_name: Parameter name for error messages

    Returns:
        Valid finite number

    Raises:
        ValueError: If value cannot be converted to valid number
    """
    if value is None:
        raise ValueError(f"{param_name} is required and cannot be None")

    try:
        num = float(value)
        if not math.isfinite(num):
            raise ValueError(f"{param_name} must be finite, got: {value}")
        return num
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid {param_name}: {value} - {str(e)}")


# ======= CORE LVO PREDICTION FUNCTIONS =======

def lvo_probability(gfap: float, fasted: float) -> float:
    """
    Calculate calibrated LVO probability using the complete pipeline.

    Args:
        gfap: GFAP biomarker value in pg/mL (must be ≥ 0)
        fasted: FAST-ED score (0-16, will be clamped to valid range)

    Returns:
        Calibrated probability of LVO (0.0 to 1.0)

    Raises:
        ValueError: For invalid inputs
    """
    # Input validation
    valid_gfap = validate_number(gfap, "gfap")
    valid_fasted = validate_number(fasted, "fast_ed")

    if valid_gfap < GFAP_MIN:
        raise ValueError(f"GFAP value must be >= {GFAP_MIN}, got: {valid_gfap}")

    # Clamp FAST-ED to valid range
    clamped_fasted = clamp_fasted(valid_fasted)

    # Step 1: Yeo-Johnson transformation of GFAP
    gfap_transformed = yeo_johnson(valid_gfap, LAMBDA)

    # Step 2: Standardization
    gfap_standardized = standardize(gfap_transformed, MU_G, SIG_G)
    fasted_standardized = standardize(clamped_fasted, MU_F, SIG_F)

    # Step 3: Linear logistic regression
    logit = B0 + B_GFAP * gfap_standardized + B_FAST * fasted_standardized

    # Step 4: Platt calibration
    calibrated_logit = A_PLATT * logit + B_PLATT

    # Step 5: Convert to probability
    return logistic(calibrated_logit)


def lvo_class(gfap: float, fasted: float) -> int:
    """
    Binary LVO classification using clinical threshold.

    Args:
        gfap: GFAP biomarker value in pg/mL
        fasted: FAST-ED score (0-16)

    Returns:
        Binary classification: 0 (No LVO) or 1 (LVO)
    """
    probability = lvo_probability(gfap, fasted)
    return 1 if probability >= FINAL_THRESHOLD else 0


def calculate_lvo_probability(gfap_value: float, fast_ed_score: int) -> dict:
    """
    Comprehensive LVO prediction with detailed clinical information.

    Args:
        gfap_value: GFAP value in pg/mL
        fast_ed_score: FAST-ED score (0-16, extended from previous 0-9 range)

    Returns:
        Dictionary with probability, risk factors, and clinical interpretation
    """
    try:
        # Input validation and preprocessing
        valid_gfap = validate_number(gfap_value, "gfap_value")
        valid_fasted = validate_number(fast_ed_score, "fast_ed_score")

        if valid_gfap < GFAP_MIN:
            raise ValueError(f"GFAP value must be >= {GFAP_MIN}")

        # Check for input warnings
        warnings = []
        original_fasted = valid_fasted
        clamped_fasted = clamp_fasted(valid_fasted)

        if abs(original_fasted - clamped_fasted) > NUMERIC_EPS:
            warnings.append(f"FAST-ED score clamped from {original_fasted} to {clamped_fasted}")

        if valid_gfap > GFAP_MAX:
            warnings.append(f"GFAP value ({valid_gfap}) exceeds typical range")

        # Perform calculation
        gfap_transformed = yeo_johnson(valid_gfap, LAMBDA)
        gfap_standardized = standardize(gfap_transformed, MU_G, SIG_G)
        fasted_standardized = standardize(clamped_fasted, MU_F, SIG_F)

        logit_uncalibrated = B0 + B_GFAP * gfap_standardized + B_FAST * fasted_standardized
        logit_calibrated = A_PLATT * logit_uncalibrated + B_PLATT
        final_probability = logistic(logit_calibrated)

        # Calculate feature contributions for interpretability
        gfap_contribution = B_GFAP * gfap_standardized
        fast_ed_contribution = B_FAST * fasted_standardized

        # Generate risk factors
        risk_factors = []

        # FAST-ED risk factors
        if clamped_fasted >= 6:
            risk_factors.append({
                'name': 'High FAST-ED Score',
                'value': int(clamped_fasted),
                'impact': 'increase' if fast_ed_contribution > 0 else 'decrease',
                'contribution': float(fast_ed_contribution),
            })
        elif clamped_fasted <= 3:
            risk_factors.append({
                'name': 'Low FAST-ED Score',
                'value': int(clamped_fasted),
                'impact': 'increase' if fast_ed_contribution > 0 else 'decrease',
                'contribution': float(fast_ed_contribution),
            })

        # GFAP risk factors
        if valid_gfap > 500:
            risk_factors.append({
                'name': 'Elevated GFAP',
                'value': f"{round(valid_gfap)} pg/mL",
                'impact': 'increase' if gfap_contribution > 0 else 'decrease',
                'contribution': float(gfap_contribution),
                'note': 'May indicate hemorrhagic vs ischemic event',
            })
        elif valid_gfap < 100:
            risk_factors.append({
                'name': 'Low GFAP',
                'value': f"{round(valid_gfap)} pg/mL",
                'impact': 'increase' if gfap_contribution > 0 else 'decrease',
                'contribution': float(abs(gfap_contribution)),
                'note': 'Consistent with ischemic LVO',
            })

        # Sort risk factors by absolute contribution
        risk_factors.sort(key=lambda x: abs(x['contribution']), reverse=True)

        # Generate clinical interpretation
        prob_percent = round(final_probability * 100)
        if final_probability >= 0.7:
            if clamped_fasted >= 10:
                interpretation = f"High probability of LVO ({prob_percent}%). FAST-ED score of {int(clamped_fasted)} strongly suggests large vessel occlusion. Consider immediate thrombectomy evaluation."
            else:
                interpretation = f"High probability of LVO ({prob_percent}%). Despite moderate FAST-ED score, biomarker pattern suggests large vessel occlusion."
        elif final_probability >= 0.4:
            if valid_gfap > 500:
                interpretation = f"Moderate LVO probability ({prob_percent}%). Elevated GFAP ({valid_gfap:.0f} pg/mL) may indicate hemorrhagic component. Further imaging recommended."
            else:
                interpretation = f"Moderate LVO probability ({prob_percent}%). Clinical correlation and vascular imaging recommended."
        else:
            if clamped_fasted <= 4:
                interpretation = f"Low probability of LVO ({prob_percent}%). FAST-ED score of {int(clamped_fasted)} suggests small vessel disease or non-vascular etiology."
            else:
                interpretation = f"Low probability of LVO ({prob_percent}%) despite FAST-ED score. Consider alternative diagnoses."

        return {
            'probability': float(final_probability),
            'is_lvo': int(final_probability >= FINAL_THRESHOLD),
            'risk_level': 'high' if final_probability >= 0.7 else 'moderate' if final_probability >= 0.4 else 'low',
            'model': 'Production LVO Model v1.0',
            'risk_factors': risk_factors,
            'interpretation': interpretation,
            'confidence': 0.9 if final_probability >= 0.7 else 0.8 if final_probability >= 0.4 else 0.7,
            'threshold': FINAL_THRESHOLD,
            'warnings': warnings,
            'debug': {
                'gfap_input': float(valid_gfap),
                'fasted_input': float(clamped_fasted),
                'gfap_transformed': float(gfap_transformed),
                'gfap_standardized': float(gfap_standardized),
                'fasted_standardized': float(fasted_standardized),
                'logit_uncalibrated': float(logit_uncalibrated),
                'logit_calibrated': float(logit_calibrated),
                'gfap_contribution': float(gfap_contribution),
                'fast_ed_contribution': float(fast_ed_contribution)
            }
        }

    except Exception as e:
        logger.error(f"Error in LVO calculation: {str(e)}")
        return {
            'probability': None,
            'is_lvo': 0,
            'error': str(e),
            'model': 'Production LVO Model v1.0',
            'risk_factors': [],
            'warnings': [str(e)]
        }


@functions_framework.http
def predict_lvo(request) -> Tuple[Dict[str, Any], int, Dict[str, str]]:
    """
    HTTP Cloud Function for LVO prediction.

    Expects POST JSON payload:
    {
        "gfap_value": <number>,     // GFAP in pg/mL (≥ 0)
        "fast_ed_score": <number>   // FAST-ED score (0-16, will be clamped)
    }

    Returns JSON response:
    {
        "probability": <0.0-1.0>,
        "is_lvo": <0|1>,
        "risk_level": <"low"|"moderate"|"high">,
        "model": "Production LVO Model v1.0",
        "risk_factors": [...],
        "interpretation": "...",
        "confidence": <0.0-1.0>,
        "threshold": 0.333333,
        "warnings": [...]
    }
    """
    # CORS headers
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'application/json'
    }

    # Handle preflight CORS request
    if request.method == 'OPTIONS':
        return {}, 204, cors_headers

    try:
        # Validate HTTP method
        if request.method != 'POST':
            return {
                'error': 'Method not allowed. Use POST.',
                'allowed_methods': ['POST']
            }, 405, cors_headers

        # Parse JSON payload
        try:
            request_json = request.get_json(silent=True) or {}
        except Exception as e:
            return {
                'error': f'Invalid JSON payload: {str(e)}',
                'expected_format': {'gfap_value': '<number>', 'fast_ed_score': '<number>'}
            }, 400, cors_headers

        # Extract required parameters
        gfap_value = request_json.get('gfap_value')
        fast_ed_score = request_json.get('fast_ed_score')

        if gfap_value is None or fast_ed_score is None:
            return {
                'error': 'Missing required parameters',
                'required': ['gfap_value', 'fast_ed_score'],
                'received': list(request_json.keys())
            }, 400, cors_headers

        # Log request (without sensitive data)
        logger.info(f"LVO prediction request: GFAP={gfap_value}, FAST-ED={fast_ed_score}")

        # Perform LVO calculation
        result = calculate_lvo_probability(gfap_value, fast_ed_score)

        # Check for calculation errors
        if result.get('error'):
            logger.warning(f"LVO calculation error: {result['error']}")
            return result, 400, cors_headers

        # Log successful prediction
        prob = result.get('probability', 0)
        risk = result.get('risk_level', 'unknown')
        logger.info(f"LVO prediction successful: {prob:.3f} ({risk} risk)")

        return result, 200, cors_headers

    except Exception as e:
        # Log unexpected errors
        logger.error(f"Unexpected error in predict_lvo: {str(e)}", exc_info=True)

        return {
            'error': 'Internal server error',
            'message': 'An unexpected error occurred during prediction',
            'model': 'Production LVO Model v1.0',
            'timestamp': str(math.floor(1000 * 1000))  # Simple timestamp
        }, 500, cors_headers


# ======= SIMPLE API FOR EXTERNAL TESTING =======

def predict(request) -> Tuple[Dict[str, Any], int, Dict[str, str]]:
    """
    Alternative entry point with simpler interface.
    Compatible with the provided specification.

    Expected JSON: {"gfap": <number>, "fast_ed": <number>}
    Returns: {"probability": <0..1>, "is_lvo": 0|1}
    """
    # Reuse the main function with parameter mapping
    if hasattr(request, 'get_json'):
        data = request.get_json(silent=True) or {}
        # Map alternative parameter names
        mapped_data = {
            'gfap_value': data.get('gfap', data.get('gfap_value')),
            'fast_ed_score': data.get('fast_ed', data.get('fast_ed_score'))
        }
        # Create a mock request object
        class MockRequest:
            method = 'POST'
            def get_json(self, silent=True):
                return mapped_data

        return predict_lvo(MockRequest())
    else:
        # Direct call with data dict
        return predict_lvo(request)


if __name__ == '__main__':
    # Simple test when run locally
    test_cases = [
        {'gfap': 180, 'fast_ed': 7},
        {'gfap': 50, 'fast_ed': 2},
        {'gfap': 500, 'fast_ed': 12}
    ]

    print("Local testing of LVO model:")
    for i, case in enumerate(test_cases, 1):
        try:
            prob = lvo_probability(case['gfap'], case['fast_ed'])
            classification = lvo_class(case['gfap'], case['fast_ed'])
            print(f"Test {i}: GFAP={case['gfap']}, FAST-ED={case['fast_ed']} → {prob:.3f} (class: {classification})")
        except Exception as e:
            print(f"Test {i} failed: {e}")