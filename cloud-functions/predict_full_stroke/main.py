# --- main.py (Fixed Version) ---
# Fixes: 
# 1. SHAP values calculation for XGBoost (TreeExplainer returns array, not None)
# 2. Flask context issue for local testing
# 3. Added detailed debugging

import json
import joblib
import pandas as pd
import numpy as np
import shap
import functions_framework

# --- 1. Define expected inputs and load models/explainers ---
EXPECTED_FEATURES = [
    'age_years', 'systolic_bp', 'diastolic_bp', 'gfap_value',
    'fast_ed_score', 'headache', 'beinparese', 'eye_deviation',
    'armparese', 'vigilanzminderung', 'atrial_fibrillation',
    'anticoagulated_noak', 'antiplatelets'
]

try:
    ich_model = joblib.load('ich_champion_model.joblib')
    # For XGBoost, use TreeExplainer explicitly
    ich_explainer = shap.TreeExplainer(ich_model.named_steps['classifier'])
    print("ICH model and SHAP TreeExplainer loaded successfully.")
except Exception as e:
    ich_model = None
    ich_explainer = None
    print(f"ERROR loading ICH model or explainer: {e}")

# Import our new scientifically calibrated LVO model
from lvo_model import predict_lvo_with_drivers

print("New scientifically calibrated LVO model loaded successfully.")

# --- 2. Main HTTP Function ---
@functions_framework.http
def predict_full_stroke(request):
    """
    HTTP Cloud Function for examinable patients.
    Takes 13 clinical variables, returns ICH and LVO probabilities and drivers.
    """
    print(f"Function started. Method: {request.method}")
    
    # Handle CORS
    if request.method == 'OPTIONS':
        headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type'}
        return ('', 204, headers)
    
    headers = {'Access-Control-Allow-Origin': '*'}
    
    print(f"Models loaded - ICH: {ich_model is not None}, LVO: built-in (new model)")
    print(f"Explainers loaded - ICH: {ich_explainer is not None}, LVO: built-in (new model)")
    
    # Check if ICH model was loaded (LVO model is now built-in)
    if not ich_model or not ich_explainer:
        missing = []
        if not ich_model: missing.append("ich_model")
        if not ich_explainer: missing.append("ich_explainer")
        error_msg = f'Failed to load: {", ".join(missing)}'
        print(f"ERROR: {error_msg}")
        return json.dumps({'error': error_msg}), 500, headers
    
    # --- 3. Get and validate input data ---
    try:
        request_json = request.get_json(silent=True)
        print(f"Received input data: {list(request_json.keys())}")
        input_df = pd.DataFrame([request_json], columns=EXPECTED_FEATURES)
        if input_df.isnull().values.any():
            raise ValueError("Missing one or more required fields.")
        print("Input data validated successfully")
    except (Exception, KeyError, ValueError) as e:
        print(f"Input validation error: {e}")
        return json.dumps({'error': f'Invalid or missing input data: {e}'}), 400, headers
    
    # --- 4. Make predictions and calculate drivers ---
    try:
        # --- ICH Prediction (XGBoost) ---
        print("Starting ICH prediction...")
        ich_probability = float(ich_model.predict_proba(input_df)[0, 1])  # Convert to Python float
        print(f"ICH probability: {ich_probability:.4f}")
        
        # Calculate SHAP values for ICH
        try:
            ich_preprocessor = ich_model.named_steps['preprocessor']
            transformed_input_ich = ich_preprocessor.transform(input_df)
            print(f"ICH transformed input shape: {transformed_input_ich.shape}")
            
            # For TreeExplainer with XGBoost, get SHAP values directly
            shap_values_ich_raw = ich_explainer.shap_values(transformed_input_ich)
            
            # Handle different return types from TreeExplainer
            if isinstance(shap_values_ich_raw, list):
                # For multi-class, take the positive class (index 1)
                shap_values_ich = shap_values_ich_raw[1] if len(shap_values_ich_raw) > 1 else shap_values_ich_raw[0]
            else:
                shap_values_ich = shap_values_ich_raw
            
            # Ensure we have a 2D array
            if shap_values_ich.ndim == 1:
                shap_values_ich = shap_values_ich.reshape(1, -1)
            
            print(f"ICH SHAP values shape: {shap_values_ich.shape}")
            
            transformed_feature_names_ich = ich_preprocessor.get_feature_names_out()
            
            ich_drivers = {}
            for original_feature in EXPECTED_FEATURES:
                related_indices = [i for i, name in enumerate(transformed_feature_names_ich) if original_feature in name]
                if related_indices:
                    ich_drivers[original_feature] = round(float(shap_values_ich[0, related_indices].sum()), 4)
            
            print(f"ICH drivers calculated: {len(ich_drivers)} features")
        except Exception as e:
            print(f"ICH SHAP calculation failed: {e}")
            import traceback
            traceback.print_exc()
            ich_drivers = {"error": "Driver calculation failed"}
        
        # --- LVO Prediction (New Scientifically Calibrated Model) ---
        print("Starting LVO prediction with new model...")

        # Extract GFAP and FAST-ED for our new model
        gfap_value = input_df['gfap_value'].iloc[0]
        fast_ed_score = input_df['fast_ed_score'].iloc[0]

        print(f"LVO inputs: GFAP={gfap_value}, FAST-ED={fast_ed_score}")

        # Use our new scientifically calibrated model
        lvo_result = predict_lvo_with_drivers(gfap_value, fast_ed_score)

        if lvo_result['is_valid']:
            lvo_probability = lvo_result['probability']
            lvo_drivers = lvo_result['drivers']
            print(f"LVO probability (new model): {lvo_probability:.4f}")
            print(f"LVO drivers calculated: {len(lvo_drivers.get('positive', []) + lvo_drivers.get('negative', []))} features")
        else:
            print(f"LVO prediction failed: {lvo_result.get('warnings', [])}")
            lvo_probability = 0.0
            lvo_drivers = {"error": "New model prediction failed"}
        
    except Exception as e:
        print(f"PREDICTION FAILED: {e}")
        import traceback
        traceback.print_exc()
        return json.dumps({'error': f'Error during prediction: {e}'}), 500, headers
    
    # --- 5. Prepare and return the successful response ---
    response_payload = {
        'ich_prediction': {
            'probability': float(round(ich_probability, 4)),  # Ensure it's a Python float
            'drivers': ich_drivers
        },
        'lvo_prediction': {
            'probability': float(round(lvo_probability, 4)),  # Ensure it's a Python float
            'drivers': lvo_drivers
        }
    }
    
    print("Response prepared successfully")
    
    # Return simple tuple for compatibility with both Flask and local testing
    return json.dumps(response_payload), 200, headers