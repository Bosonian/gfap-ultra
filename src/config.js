// Configuration for the Stroke Triage Assistant

// Development mode detection (prefer Vite flag, fallback to hostname)
// Only treat Vite dev server as development; preview uses production settings
const isDevelopment = !!(import.meta && import.meta.env && import.meta.env.DEV);

// Mock authentication for local development
const MOCK_AUTH_SUCCESS = {
  success: true,
  message: "Development mode - authentication bypassed",
  session_token: `dev-token-${Date.now()}`,
  expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  session_duration: 1800,
};

// Mock API responses for development (matching real Cloud Function format)
const MOCK_API_RESPONSES = {
  coma_ich: {
    probability: 25.3,
    ich_probability: 25.3,
    drivers: {
      gfap_value: 0.4721,
      baseline_risk: 0.1456,
    },
    confidence: 0.75,
  },
  limited_ich: {
    probability: 31.7,
    ich_probability: 31.7,
    drivers: {
      age_years: 0.2845,
      systolic_bp: 0.1923,
      gfap_value: 0.4231,
      vigilanzminderung: 0.3456,
    },
    confidence: 0.65,
  },
  full_stroke: {
    ich_prediction: {
      probability: 28.4,
      drivers: {
        age_years: 0.1834,
        gfap_value: 0.3921,
        systolic_bp: 0.2341,
        vigilanzminderung: 0.2876,
      },
      confidence: 0.88,
    },
    lvo_prediction: {
      probability: 45.2,
      drivers: {
        fast_ed_score: 0.7834,
        age_years: 0.2341,
        eye_deviation: 0.1923,
      },
      confidence: 0.82,
    },
  },
  authenticate: {
    success: true,
    message: "Development mode - authentication bypassed",
    session_token: `dev-token-${Date.now()}`,
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    session_duration: 1800,
  },
};

export const API_URLS = isDevelopment
  ? {
      // Development mode - use Vite proxy to bypass CORS
      COMA_ICH: "/api/cloud-functions/predict_coma_ich",
      LDM_ICH: "/api/cloud-functions/predict_limited_data_ich",
      FULL_STROKE: "/api/cloud-functions/predict_full_stroke",
      LVO_PREDICTION: "/api/cloud-functions/predict_lvo",
      AUTHENTICATE: "/api/cloud-functions/authenticate-research-access",
    }
  : {
      // Production mode - use direct endpoints
      COMA_ICH: "https://europe-west3-igfap-452720.cloudfunctions.net/predict_coma_ich",
      LDM_ICH: "https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich",
      FULL_STROKE: "https://europe-west3-igfap-452720.cloudfunctions.net/predict_full_stroke",
      LVO_PREDICTION: "https://europe-west3-igfap-452720.cloudfunctions.net/predict_lvo",
      AUTHENTICATE:
        "https://europe-west3-igfap-452720.cloudfunctions.net/authenticate-research-access",
    };

export const DEV_CONFIG = {
  isDevelopment,
  mockAuthResponse: MOCK_AUTH_SUCCESS,
  mockApiResponses: MOCK_API_RESPONSES,
};

export const CRITICAL_THRESHOLDS = {
  ich: {
    medium: 25,
    high: 50,
  },
  lvo: {
    medium: 25,
    high: 50,
  },
};

// GFAP ranges for different cartridge types
// Source: Abbott i-STAT TBI Cartridge Product Specifications
// Whole Blood: Analytical measuring interval 47-10000 pg/mL, Cut-off 65 pg/mL
// Plasma: Analytical measuring interval 30-10000 pg/mL, Cut-off 30 pg/mL
export const GFAP_RANGES = {
  plasma: {
    min: 30,      // Abbott spec: 30 pg/mL (analytical measuring interval)
    max: 10000,   // Abbott spec: 10000 pg/mL
    normal: 100,
    elevated: 500,
    critical: 1000,
  },
  wholeblood: {
    min: 47,      // Abbott spec: 47 pg/mL (analytical measuring interval)
    max: 10000,   // Abbott spec: 10000 pg/mL (same as plasma)
    normal: 217,  // ~100 / 0.46 for reference
    elevated: 1087,
    critical: 2174,
  },
  // Legacy compatibility (defaults to plasma)
  min: 30,
  max: 10000,
  normal: 100,
  elevated: 500,
  critical: 1000,
};

export const APP_CONFIG = {
  autoSaveInterval: 180000, // 3 minutes to reduce irritating screen blinks
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  requestTimeout: 10000, // 10 seconds (default)
  fullStrokeTimeout: 20000, // 20 seconds for full stroke (handles cold starts)
};

// Kiosk case sharing configuration
export const KIOSK_CONFIG = {
  caseSharingUrl: "https://case-sharing-564499947017.europe-west3.run.app",

  // Google Maps API key
  googleMapsApiKey: "AIzaSyACBndIj8HD1wwZ4Vw8PDDI0bIe6DoBExI",

  // GPS tracking settings
  gpsUpdateInterval: 30000, // 30 seconds
  gpsHighAccuracy: true,
  gpsTimeout: 10000, // 10 seconds
  gpsMaxAge: 0, // Always get fresh location

  // Auto-archive settings
  autoArchiveHours: 2,
  staleGpsMinutes: 5,
};

export const VALIDATION_RULES = {
  age_years: {
    required: true,
    min: 0,
    max: 120,
    type: "integer",
    medicalCheck: value =>
      value < 18 ? "Emergency stroke assessment typically for adults (≥18 years)" : null,
  },
  systolic_bp: {
    required: true,
    min: 60,
    max: 300,
    type: "number",
    medicalCheck: (value, formData) => {
      const diastolic = formData?.diastolic_bp;
      if (diastolic && value <= diastolic) {
        return "Systolic BP must be higher than diastolic BP";
      }
      return null;
    },
  },
  diastolic_bp: {
    required: true,
    min: 30,
    max: 200,
    type: "number",
    medicalCheck: (value, formData) => {
      const systolic = formData?.systolic_bp;
      if (systolic && value >= systolic) {
        return "Diastolic BP must be lower than systolic BP";
      }
      return null;
    },
  },
  gfap_value: {
    required: true,
    min: GFAP_RANGES.min,
    max: GFAP_RANGES.max,
    type: "number",
    medicalCheck: value => {
      if (value > 8000) {
        return "Warning: Extremely high GFAP value - please verify lab result (still valid)";
      }
      return null;
    },
  },
  fast_ed_score: {
    required: true,
    min: 0,
    max: 9,
    type: "integer",
    medicalCheck: value =>
      value >= 4 ? "High FAST-ED score suggests LVO - consider urgent intervention" : null,
  },
  gcs: {
    required: true,
    min: 3,
    max: 15,
    type: "integer",
    medicalCheck: value =>
      value < 8 ? "GCS < 8 indicates severe consciousness impairment - consider coma module" : null,
  },
};
