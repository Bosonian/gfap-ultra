"""
Scientifically Calibrated LVO Model - Python Implementation
Same implementation as our TypeScript/JavaScript versions but for cloud functions
"""

import math

# Model parameters (scientifically calibrated via CalibratedClassifierCV)
LAMBDA = -0.825559           # Yeo-Johnson lambda for GFAP transformation
B0 = -0.408314               # Logistic regression intercept
B_GFAP = -0.826450           # GFAP coefficient (negative = protective when transformed)
B_FAST = 1.651521            # FAST-ED coefficient (positive = risk factor)

# Standardization parameters (from training data statistics)
MU_G = -0.000000             # Mean of transformed GFAP
SIG_G = 1.000000             # Standard deviation of transformed GFAP
MU_F = 3.701422              # Mean of FAST-ED
SIG_F = 2.306173             # Standard deviation of FAST-ED

# Platt scaling parameters (for probability calibration)
A_PLATT = 1.117420           # Platt scaling slope
B_PLATT = -1.032167          # Platt scaling intercept

# Decision threshold
FINAL_THRESHOLD = 0.333333   # Classification threshold

# Validation constants
NUMERIC_EPS = 1e-15
MAX_GFAP_WARNING = 50000
MIN_FAST_ED = 0
MAX_FAST_ED = 16


def yeo_johnson(x, lambda_param):
    """Yeo-Johnson power transformation"""
    if abs(lambda_param) < NUMERIC_EPS:
        return math.log(x + 1.0)
    return (math.pow(x + 1.0, lambda_param) - 1.0) / lambda_param


def standardize(value, mean, std):
    """Z-score standardization"""
    return (value - mean) / std


def logistic(x):
    """Logistic (sigmoid) function with overflow protection"""
    if x > 500:
        return 1.0  # Prevent overflow
    if x < -500:
        return 0.0  # Prevent underflow
    return 1.0 / (1.0 + math.exp(-x))


def validate_inputs(gfap, fasted):
    """Input validation"""
    # Check for null/undefined
    if gfap is None:
        raise ValueError('gfap is required')
    if fasted is None:
        raise ValueError('fasted is required')

    # Convert to numbers
    try:
        num_gfap = float(gfap)
        num_fasted = float(fasted)
    except (ValueError, TypeError):
        raise ValueError('gfap and fasted must be valid numbers')

    # Check for valid numbers
    if not math.isfinite(num_gfap):
        raise ValueError('gfap must be a finite number')
    if not math.isfinite(num_fasted):
        raise ValueError('fasted must be a finite number')

    # Check ranges
    if num_gfap < 0:
        raise ValueError('GFAP value must be non-negative')

    return num_gfap, num_fasted


def lvo_probability(gfap, fasted):
    """Calculate LVO probability using scientifically calibrated model"""
    validated_gfap, validated_fasted = validate_inputs(gfap, fasted)

    # Clamp FAST-ED to valid range
    clamped_fasted = max(MIN_FAST_ED, min(MAX_FAST_ED, validated_fasted))

    # Apply transformations
    gfap_transformed = yeo_johnson(validated_gfap, LAMBDA)
    gfap_standardized = standardize(gfap_transformed, MU_G, SIG_G)
    fasted_standardized = standardize(clamped_fasted, MU_F, SIG_F)

    # Calculate logit
    logit = B0 + B_GFAP * gfap_standardized + B_FAST * fasted_standardized

    # Apply Platt calibration
    calibrated_logit = A_PLATT * logit + B_PLATT

    # Return probability
    return logistic(calibrated_logit)


def lvo_class(gfap, fasted):
    """Binary classification using threshold"""
    probability = lvo_probability(gfap, fasted)
    return 1 if probability >= FINAL_THRESHOLD else 0


def predict_lvo_with_drivers(gfap, fasted):
    """Comprehensive prediction with detailed intermediate values and drivers"""
    warnings = []
    is_valid = True

    try:
        validated_gfap, validated_fasted = validate_inputs(gfap, fasted)
        original_fasted = validated_fasted

        # Clamp FAST-ED and warn if out of range
        clamped_fasted = max(MIN_FAST_ED, min(MAX_FAST_ED, validated_fasted))
        if clamped_fasted != original_fasted:
            warnings.append(f"FAST-ED score clamped from {original_fasted} to {clamped_fasted} (valid range: {MIN_FAST_ED}-{MAX_FAST_ED})")

        # Warn for very high GFAP values
        if validated_gfap > MAX_GFAP_WARNING:
            warnings.append(f"GFAP value {validated_gfap} exceeds typical range (may indicate extreme case)")

        # Apply transformations
        gfap_transformed = yeo_johnson(validated_gfap, LAMBDA)
        gfap_standardized = standardize(gfap_transformed, MU_G, SIG_G)
        fasted_standardized = standardize(clamped_fasted, MU_F, SIG_F)

        # Calculate logit
        logit = B0 + B_GFAP * gfap_standardized + B_FAST * fasted_standardized

        # Apply Platt calibration
        calibrated_logit = A_PLATT * logit + B_PLATT

        # Calculate final probability
        probability = logistic(calibrated_logit)
        classification = 1 if probability >= FINAL_THRESHOLD else 0

        # Create simplified drivers
        gfap_contribution = B_GFAP * gfap_standardized
        fast_contribution = B_FAST * fasted_standardized

        # Determine risk level
        if probability > 0.7:
            risk_level = 'high'
        elif probability > 0.4:
            risk_level = 'moderate'
        else:
            risk_level = 'low'

        # Create drivers in expected format
        drivers = {
            "kind": "new_model_calibrated",
            "units": "logit_contribution",
            "positive": [],
            "negative": [],
            "meta": {
                "riskLevel": risk_level,
                "interpretation": f"{(probability * 100):.1f}% LVO probability (scientifically calibrated)"
            }
        }

        # Add contributions
        if fast_contribution > 0:
            drivers["positive"].append({"label": "fast_ed_score", "weight": round(fast_contribution, 4)})
        else:
            drivers["negative"].append({"label": "fast_ed_score", "weight": round(abs(fast_contribution), 4)})

        if gfap_contribution > 0:
            drivers["positive"].append({"label": "gfap_value", "weight": round(gfap_contribution, 4)})
        else:
            drivers["negative"].append({"label": "gfap_value", "weight": round(abs(gfap_contribution), 4)})

        # Sort by weight
        drivers["positive"].sort(key=lambda x: abs(x["weight"]), reverse=True)
        drivers["negative"].sort(key=lambda x: abs(x["weight"]), reverse=True)

        return {
            "probability": probability,
            "classification": classification,
            "drivers": drivers,
            "confidence": 0.9 if probability > 0.7 else 0.7 if probability > 0.4 else 0.5,
            "interpretation": f"{(probability * 100):.1f}% LVO probability based on GFAP={validated_gfap} and FAST-ED={clamped_fasted}",
            "model_version": "2024.09.28-calibrated",
            "is_valid": is_valid,
            "warnings": warnings
        }

    except Exception as error:
        warnings.append(str(error))
        is_valid = False

        return {
            "probability": None,
            "classification": 0,
            "drivers": {"error": "Driver calculation failed"},
            "confidence": 0.0,
            "interpretation": f"Error: {str(error)}",
            "model_version": "2024.09.28-calibrated",
            "is_valid": is_valid,
            "warnings": warnings
        }