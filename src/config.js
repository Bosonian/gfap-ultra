// Configuration for the Stroke Triage Assistant

export const API_URLS = {
  COMA_ICH: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich',
  LDM_ICH: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich',
  FULL_STROKE: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke'
};

export const CRITICAL_THRESHOLDS = {
  ich: { 
    high: 60, 
    critical: 80 
  },
  lvo: { 
    high: 50, 
    critical: 70 
  }
};

export const GFAP_RANGES = {
  min: 29,
  max: 10001,
  normal: 100,
  elevated: 500,
  critical: 1000
};

export const APP_CONFIG = {
  autoSaveInterval: 5000,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  requestTimeout: 10000 // 10 seconds
};

export const VALIDATION_RULES = {
  age_years: { required: true, min: 0, max: 120 },
  systolic_bp: { required: true, min: 60, max: 300 },
  diastolic_bp: { required: true, min: 30, max: 200 },
  gfap_value: { required: true, min: GFAP_RANGES.min, max: GFAP_RANGES.max },
  fast_ed_score: { required: true, min: 0, max: 9 }
};