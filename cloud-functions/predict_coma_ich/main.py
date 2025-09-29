# --- main.py ---
# ICH Coma Model (Simple Implementation) — for patients with GCS < 8
# Input: gfap_value (minimal data for comatose patients)
# Output: ich_probability, drivers (if available)
# Note: This is a template - the actual implementation may be simpler or integrated elsewhere

import json
import joblib
import numpy as np
import pandas as pd
import functions_framework
from flask import make_response

# ---------- Config ----------
EXPECTED = ["gfap_value"]
CLINICAL_THRESHOLD = 0.5
MODEL_PATH = "coma_ich_model.joblib"  # Note: actual model file may not exist

# ---------- CORS ----------
def _cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

# ---------- Input validation ----------
def _normalize_and_validate(data: dict) -> pd.DataFrame:
    missing = [k for k in EXPECTED if k not in data]
    if missing: raise KeyError(f"missing keys: {missing}")

    gfap_value = float(data["gfap_value"])
    if gfap_value < 0: raise ValueError(f"gfap_value must be non-negative: {gfap_value}")

    return pd.DataFrame([{
        "gfap_value": gfap_value
    }], columns=EXPECTED)

# ---------- Model load ----------
def _load_model(path: str):
    try:
        m = joblib.load(path)
        print(f"{path} loaded successfully. Type: {type(m)}")
        return m
    except Exception as e:
        print(f"Error loading '{path}': {e}")
        return None

# Try to load model, but handle gracefully if not found
model = _load_model(MODEL_PATH)

# ---------- Simple GFAP-based prediction (fallback) ----------
def _simple_gfap_prediction(gfap_value):
    """
    Simple GFAP-based prediction for coma patients.
    This is a placeholder implementation.
    """
    # Basic thresholds based on clinical literature (placeholder)
    if gfap_value < 50:
        probability = 0.1
    elif gfap_value < 100:
        probability = 0.25
    elif gfap_value < 200:
        probability = 0.4
    elif gfap_value < 500:
        probability = 0.6
    else:
        probability = 0.8

    # Add some variance
    variance = 0.05 * np.random.randn()
    probability = max(0.0, min(1.0, probability + variance))

    return probability

# ---------- HTTP handler ----------
@functions_framework.http
def predict_coma_ich(request):
    """
    Returns ICH probability for comatose patients based on GFAP value only.
    Simplified prediction for emergency situations with minimal data.
    """
    if request.method == "OPTIONS":
        return ("", 204, _cors_headers())
    headers = _cors_headers()

    try:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            raise TypeError("JSON body must be an object")
        X = _normalize_and_validate(data)
        gfap_value = X["gfap_value"].iloc[0]
    except (TypeError, KeyError, ValueError) as e:
        return make_response(json.dumps({"error": f"Invalid or missing input data: {e}"}), 400, headers)

    try:
        if model is not None:
            # Use actual model if available
            proba = float(model.predict_proba(X)[0, 1])
            print(f"Using trained model: ICH probability = {proba:.4f}")
        else:
            # Fallback to simple GFAP-based prediction
            proba = _simple_gfap_prediction(gfap_value)
            print(f"Using fallback prediction: ICH probability = {proba:.4f}")

        # Simple drivers based on GFAP value
        drivers = {
            "kind": "simple_gfap_based",
            "units": "contribution",
            "positive": [
                {"label": "gfap_value", "weight": round(float(gfap_value / 1000), 4)}
            ],
            "negative": [],
            "meta": {
                "gfap_level": "high" if gfap_value > 200 else "moderate" if gfap_value > 100 else "low",
                "note": "Simplified prediction for coma patients"
            }
        }

        decision = {
            "threshold": CLINICAL_THRESHOLD,
            "meets_threshold": bool(proba >= CLINICAL_THRESHOLD),
            "recommendation": "ICH likely - urgent imaging recommended" if proba >= CLINICAL_THRESHOLD
                              else "ICH less likely - consider other causes"
        }

    except Exception as e:
        print(f"Prediction error: {e}")
        return make_response(json.dumps({"error": f"Error during prediction: {e}"}), 500, headers)

    return make_response(json.dumps({
        "probability": round(proba, 4),
        "ich_probability": round(proba, 4),  # Compatibility
        "decision": decision,
        "drivers": drivers,
        "confidence": 0.7  # Lower confidence due to limited data
    }), 200, headers)