// Configuration for the Stroke Triage Assistant

export const API_URLS = {
  COMA_ICH: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich',
  LDM_ICH: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich',
  FULL_STROKE: 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke'
};

export const CRITICAL_THRESHOLDS = {
  ich: { 
    medium: 25,
    high: 50
  },
  lvo: { 
    medium: 25,
    high: 50
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
  autoSaveInterval: 180000, // 3 minutes to reduce irritating screen blinks
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  requestTimeout: 10000 // 10 seconds
};

export const VALIDATION_RULES = {
  age_years: {
    required: true,
    min: 0,
    max: 120,
    type: 'integer',
    medicalCheck: (value) => value >= 18 || 'Emergency stroke assessment typically for adults (≥18 years)'
  },
  systolic_bp: {
    required: true,
    min: 60,
    max: 300,
    type: 'number',
    medicalCheck: (value, formData) => {
      const diastolic = formData?.diastolic_bp;
      if (diastolic && value <= diastolic) {
        return 'Systolic BP must be higher than diastolic BP';
      }
      return null;
    }
  },
  diastolic_bp: {
    required: true,
    min: 30,
    max: 200,
    type: 'number',
    medicalCheck: (value, formData) => {
      const systolic = formData?.systolic_bp;
      if (systolic && value >= systolic) {
        return 'Diastolic BP must be lower than systolic BP';
      }
      return null;
    }
  },
  gfap_value: {
    required: true,
    min: GFAP_RANGES.min,
    max: GFAP_RANGES.max,
    type: 'number',
    medicalCheck: (value) => {
      if (value > 5000) return 'Extremely high GFAP value - please verify lab result';
      return null;
    }
  },
  fast_ed_score: {
    required: true,
    min: 0,
    max: 9,
    type: 'integer',
    medicalCheck: (value) => value >= 4 ? 'High FAST-ED score suggests LVO - consider urgent intervention' : null
  }
};