# --- main.py ---
# ICH Limited-Data Model (LogisticRegression) — faithful drivers
# Inputs: age_years, systolic_bp, diastolic_bp, gfap_value, vigilanzminderung
# Outputs: ich_probability, decision (threshold=0.8), drivers (true log-odds contributions)
# Robust for sklearn/imblearn Pipelines, ColumnTransformer, samplers (e.g., SMOTE).

import json
import joblib
import numpy as np
import pandas as pd
import functions_framework
from flask import make_response

# ---------- Config ----------
EXPECTED = ["age_years", "systolic_bp", "diastolic_bp", "gfap_value", "vigilanzminderung"]
CLINICAL_THRESHOLD = 0.8
MODEL_PATH = "ich_limited_data_model.joblib"

# ---------- CORS ----------
def _cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

# ---------- Input casting ----------
def _as_int_bool(v):
    if isinstance(v, bool): return int(v)
    if isinstance(v, (int, float)): return int(v)
    if isinstance(v, str):
        s = v.strip().lower()
        if s in ("true","yes","y","1"): return 1
        if s in ("false","no","n","0"): return 0
        try: return int(float(s))
        except Exception: pass
    raise ValueError(f"invalid boolean-like value: {v!r}")

def _normalize_and_validate(data: dict) -> pd.DataFrame:
    missing = [k for k in EXPECTED if k not in data]
    if missing: raise KeyError(f"missing keys: {missing}")
    age_years    = int(float(data["age_years"]))
    systolic_bp  = int(float(data["systolic_bp"]))
    diastolic_bp = int(float(data["diastolic_bp"]))
    gfap_value   = float(data["gfap_value"])
    vigilanz     = _as_int_bool(data["vigilanzminderung"])
    if not (0 <= age_years <= 120):       raise ValueError(f"age_years out of range: {age_years}")
    if not (40 <= systolic_bp <= 300):    raise ValueError(f"systolic_bp out of range: {systolic_bp}")
    if not (20 <= diastolic_bp <= 200):   raise ValueError(f"diastolic_bp out of range: {diastolic_bp}")
    if gfap_value < 0:                    raise ValueError(f"gfap_value must be non-negative: {gfap_value}")
    return pd.DataFrame([{
        "age_years": age_years,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "gfap_value": gfap_value,
        "vigilanzminderung": vigilanz
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

model = _load_model(MODEL_PATH)

# ---------- Wrapper unrolling ----------
def _unwrap_wrappers(est):
    # CalibratedClassifierCV -> base_estimator_; OneVsRestClassifier -> estimator_
    try:
        from sklearn.calibration import CalibratedClassifierCV
        if isinstance(est, CalibratedClassifierCV):
            return est.base_estimator_
    except Exception: pass
    try:
        from sklearn.multiclass import OneVsRestClassifier
        if isinstance(est, OneVsRestClassifier):
            return est.estimator_
    except Exception: pass
    return est

def _extract_logistic_components(m):
    """
    Return (preprocessor, logistic_estimator).
    Unwraps sklearn/imblearn Pipelines and common wrappers.
    """
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline as SKPipeline
    try:
        from imblearn.pipeline import Pipeline as IMBPipeline
    except Exception:
        IMBPipeline = tuple()

    # direct LR
    if isinstance(m, LogisticRegression):
        return (None, m)

    # sklearn pipeline
    if isinstance(m, SKPipeline):
        est = list(m.named_steps.values())[-1]
        pre = m[:-1]  # may not have .transform; we will walk its steps
        wrapped = _unwrap_wrappers(est)
        if isinstance(wrapped, LogisticRegression):
            return (pre, wrapped)

    # imblearn pipeline
    if IMBPipeline and isinstance(m, IMBPipeline):
        est = list(m.named_steps.values())[-1]
        pre = m[:-1]
        wrapped = _unwrap_wrappers(est)
        if isinstance(wrapped, LogisticRegression):
            return (pre, wrapped)

    # wrapped outside pipeline
    wrapped = _unwrap_wrappers(m)
    if hasattr(wrapped, "coef_") and wrapped.__class__.__name__ == "LogisticRegression":
        return (None, wrapped)

    return (None, None)

# ---------- Safe transform through preprocessors ----------
def _apply_preprocessor(pre, X):
    """
    Recursively apply preprocessing without assuming pre.transform exists.
    - Applies steps with .transform
    - Skips imbalanced-learn samplers (e.g., SMOTE) which have no transform
    - Works for sklearn/imblearn Pipelines and ColumnTransformer
    """
    import numpy as np
    import pandas as pd
    from sklearn.pipeline import Pipeline as SKPipeline
    try:
        from imblearn.pipeline import Pipeline as IMBPipeline
        from imblearn.base import SamplerMixin
    except Exception:
        IMBPipeline = tuple()
        class SamplerMixin:  # dummy fallback
            pass

    if pre is None:
        Z = X.values if isinstance(X, pd.DataFrame) else np.asarray(X)
        return np.asarray(Z)

    # Direct transform path
    if hasattr(pre, "transform"):
        Z = pre.transform(X)
        if hasattr(Z, "toarray"):
            Z = Z.toarray()
        return np.asarray(Z)

    # Pipeline path (sklearn / imblearn)
    if isinstance(pre, (SKPipeline, IMBPipeline)):
        Z = X
        for name, step in pre.steps:
            # Skip samplers at inference (no transform)
            if isinstance(step, SamplerMixin):
                continue
            if hasattr(step, "transform"):
                Z = step.transform(Z)
            elif hasattr(step, "fit_transform"):
                # In production, steps should already be fitted; avoid fitting here.
                # If no transform available, skip silently.
                continue
            else:
                # No applicable transform interface; skip
                continue
        if hasattr(Z, "toarray"):
            Z = Z.toarray()
        return np.asarray(Z)

    # Last resort: no transform and not a pipeline → return raw X
    Z = X.values if isinstance(X, pd.DataFrame) else np.asarray(X)
    return np.asarray(Z)

def _find_namer(pre):
    """
    Walk the preprocessor and return the first subobject that can provide 
    get_feature_names_out (e.g., ColumnTransformer, OneHotEncoder).
    """
    try:
        if pre is None:
            return None
        if hasattr(pre, "get_feature_names_out"):
            return pre

        from sklearn.pipeline import Pipeline as SKPipeline
        try:
            from imblearn.pipeline import Pipeline as IMBPipeline
        except Exception:
            IMBPipeline = tuple()

        if isinstance(pre, (SKPipeline, IMBPipeline)):
            for _, step in pre.steps:
                if hasattr(step, "get_feature_names_out"):
                    return step
                if hasattr(step, "transformers") or hasattr(step, "steps"):
                    nm = _find_namer(step)
                    if nm is not None:
                        return nm
        if hasattr(pre, "transformers"):  # ColumnTransformer fallback
            return pre
    except Exception:
        pass
    return None

def _safe_feature_names_out(namer, input_feature_names):
    """
    Best-effort retrieval of transformed feature names; fall back to input.
    """
    try:
        if namer is None:
            return list(input_feature_names)
        if hasattr(namer, "get_feature_names_out"):
            try:
                return list(namer.get_feature_names_out(input_feature_names))
            except Exception:
                return list(namer.get_feature_names_out())
        return list(input_feature_names)
    except Exception:
        return list(input_feature_names)

# ---------- Contributions ----------
def _compute_logistic_contributions(pipeline_like, X: pd.DataFrame, feature_names):
    """
    Compute per-original-feature contributions (log-odds).
    """
    from sklearn.linear_model import LogisticRegression
    pre, lr = _extract_logistic_components(pipeline_like)
    if lr is None or not isinstance(lr, LogisticRegression):
        return None, None, None

    # Transform through preprocessing (robust)
    Z = _apply_preprocessor(pre, X)

    # Feature names after preprocessing
    if pre is not None:
        namer = _find_namer(pre)
        z_names = _safe_feature_names_out(namer, feature_names)
    else:
        z_names = list(feature_names)

    if hasattr(Z, "toarray"):
        Z = Z.toarray()
    Z = np.asarray(Z)
    z_row = Z[0]

    coef = lr.coef_.ravel()
    intercept = float(lr.intercept_[0])

    if coef.shape[0] != z_row.shape[0]:
        print(f"Dim mismatch: coef {coef.shape[0]} vs Z {z_row.shape[0]}")
        return None, None, None

    contrib_z = z_row * coef  # log-odds per transformed column

    # Map back to original inputs
    per_feature = {fn: 0.0 for fn in feature_names}
    if len(z_names) == len(feature_names):
        for i, fn in enumerate(feature_names):
            per_feature[fn] = float(contrib_z[i])
    else:
        for name, val in zip(z_names, contrib_z):
            matched = False
            for fn in feature_names:
                if fn in name:
                    per_feature[fn] += float(val)
                    matched = True
                    break
            if not matched:
                # Ignore unmatched transformed columns
                pass

    contrib_sum = float(sum(per_feature.values()))
    logit_total = intercept + contrib_sum
    return per_feature, intercept, logit_total

def _drivers_payload_from_contribs(contribs: dict, intercept: float, logit_total: float):
    items = sorted(contribs.items(), key=lambda kv: abs(kv[1]), reverse=True)
    pos = [{"label": k, "weight": round(v, 4)} for k, v in items if v > 0][:5]
    neg = [{"label": k, "weight": round(v, 4)} for k, v in items if v < 0][:5]
    return {
        "kind": "logistic_contributions",
        "units": "logit",
        "positive": pos,
        "negative": neg,
        "intercept": round(intercept, 4),
        "contrib_sum": round(float(sum(contribs.values())), 4),
        "logit_total": round(logit_total, 4),
    }

# ---------- HTTP handler ----------
@functions_framework.http
def predict_limited_data_ich(request):
    """
    Returns ICH probability and faithful per-feature log-odds contributions.
    Adds a clinical decision using threshold = 0.8 (from documentation).
    """
    if request.method == "OPTIONS":
        return ("", 204, _cors_headers())
    headers = _cors_headers()

    if model is None:
        return make_response(json.dumps({"error": "Model could not be loaded."}), 500, headers)

    try:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            raise TypeError("JSON body must be an object")
        X = _normalize_and_validate(data)
    except (TypeError, KeyError, ValueError) as e:
        return make_response(json.dumps({"error": f"Invalid or missing input data: {e}"}), 400, headers)

    try:
        proba = float(model.predict_proba(X)[0, 1])

        contribs, intercept, logit_total = _compute_logistic_contributions(model, X, EXPECTED)
        if contribs is not None:
            drivers = _drivers_payload_from_contribs(contribs, intercept, logit_total)
        else:
            drivers = {
                "kind": "unsupported_model",
                "message": "Could not compute faithful drivers (no LogisticRegression at core).",
            }

        decision = {
            "threshold": CLINICAL_THRESHOLD,
            "meets_threshold": bool(proba >= CLINICAL_THRESHOLD),
            "recommendation": "ICH likely (consider ICH pathway)" if proba >= CLINICAL_THRESHOLD
                              else "ICH less likely (consider alternative pathways)"
        }

    except Exception as e:
        return make_response(json.dumps({"error": f"Error during prediction: {e}"}), 500, headers)

    return make_response(json.dumps({
        "ich_probability": round(proba, 4),
        "decision": decision,
        "drivers": drivers
    }), 200, headers)
