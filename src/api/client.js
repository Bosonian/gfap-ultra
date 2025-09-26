import { API_URLS, APP_CONFIG } from '../config.js';
import { extractDriversFromResponse, extractProbabilityFromResponse, extractConfidenceFromResponse } from './drivers.js';
import { predictLVO, canUseLocalModel } from '../logic/lvo-local-model.js';

// Warm up Google Cloud Functions on app load
export async function warmUpFunctions() {
  console.log('Warming up Cloud Functions...');
  
  // Send lightweight ping requests to wake up cold functions
  const warmUpPromises = Object.values(API_URLS).map(async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for warm-up
      
      // Use minimal POST with empty data to warm up
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body will fail validation but still warms up the function
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      console.log(`Warmed up: ${url}`);
    } catch (error) {
      // Ignore warm-up errors - they're not critical
      // The function is still warmed up even if it returns an error
      console.log(`Warm-up attempt for ${url.split('/').pop()} completed`);
    }
  });
  
  // Don't wait for warm-up to complete - do it in background
  Promise.all(warmUpPromises).then(() => {
    console.log('Cloud Functions warm-up complete');
  });
}

class APIError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.url = url;
  }
}

function normalizeBooleans(payload) {
  const normalized = { ...payload };
  
  Object.keys(normalized).forEach(key => {
    const value = normalized[key];
    if (typeof value === 'boolean' || value === 'on' || value === 'true' || value === 'false') {
      normalized[key] = value === true || value === 'on' || value === 'true' ? 1 : 0;
    }
  });
  
  return normalized;
}

function safeParseFloat(value, defaultValue = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

async function fetchJSON(url, payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeout);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.statusText}`;
      }
      throw new APIError(errorMessage, response.status, url);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout - please try again', 408, url);
    }
    
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      'Network error - please check your connection and try again',
      0,
      url
    );
  }
}

export async function predictComaIch(payload) {
  const normalizedPayload = normalizeBooleans(payload);
  
  // Production: Patient data logging removed for privacy
  
  try {
    const response = await fetchJSON(API_URLS.COMA_ICH, normalizedPayload);
    
    // Production: Response logging removed for privacy
    
    // Normalize response format for consistency
    return {
      probability: safeParseFloat(response.probability || response.ich_probability, 0),
      drivers: response.drivers || null,
      confidence: safeParseFloat(response.confidence, 0.75),
      module: 'Coma'
    };
  } catch (error) {
    console.error('Coma ICH prediction failed:', error);
    throw new APIError(
      `Failed to get ICH prediction: ${error.message}`,
      error.status,
      API_URLS.COMA_ICH
    );
  }
}

export async function predictLimitedIch(payload) {
  // Ensure all required fields are present for the Limited Data API
  const fullPayload = {
    age_years: payload.age_years,
    systolic_bp: payload.systolic_bp,
    diastolic_bp: payload.diastolic_bp,
    gfap_value: payload.gfap_value,
    // Ensure checkbox fields are present (default to 0 if missing/unchecked)
    vigilanzminderung: payload.vigilanzminderung || 0
  };
  
  const normalizedPayload = normalizeBooleans(fullPayload);
  
  // Production: Patient data logging removed for privacy
  
  try {
    const response = await fetchJSON(API_URLS.LDM_ICH, normalizedPayload);
    
    // Production: Response logging removed for privacy
    
    // Normalize response format for consistency
    return {
      probability: safeParseFloat(response.probability || response.ich_probability, 0),
      drivers: response.drivers || null,
      confidence: safeParseFloat(response.confidence, 0.65),
      module: 'Limited Data'
    };
  } catch (error) {
    console.error('Limited Data ICH prediction failed:', error);
    throw new APIError(
      `Failed to get ICH prediction: ${error.message}`,
      error.status,
      API_URLS.LDM_ICH
    );
  }
}

export async function predictFullStroke(payload) {
  // Ensure all required fields are present for the Full Stroke API
  const fullPayload = {
    age_years: payload.age_years,
    systolic_bp: payload.systolic_bp,
    diastolic_bp: payload.diastolic_bp,
    gfap_value: payload.gfap_value,
    fast_ed_score: payload.fast_ed_score,
    // Ensure all checkbox fields are present (default to 0 if missing)
    headache: payload.headache || 0,
    vigilanzminderung: payload.vigilanzminderung || 0,
    armparese: payload.armparese || 0,
    beinparese: payload.beinparese || 0,
    eye_deviation: payload.eye_deviation || 0,
    atrial_fibrillation: payload.atrial_fibrillation || 0,
    anticoagulated_noak: payload.anticoagulated_noak || 0,
    antiplatelets: payload.antiplatelets || 0
  };
  
  const normalizedPayload = normalizeBooleans(fullPayload);
  
  // Production: Patient data logging removed for privacy
  
  // Use local LVO model for prediction (more accurate, faster, works offline)
  let lvoResult = null;
  
  if (canUseLocalModel(normalizedPayload)) {
    console.log('🚀 Using local LVO model (GFAP + FAST-ED)');
    const localLVO = predictLVO(normalizedPayload.gfap_value, normalizedPayload.fast_ed_score);
    
    if (localLVO.probability !== null) {
      // Convert local model format to match expected API format
      lvoResult = {
        probability: localLVO.probability,
        drivers: localLVO.riskFactors.map(factor => ({
          feature: factor.name,
          value: factor.value,
          contribution: factor.contribution,
          impact: factor.impact
        })),
        confidence: localLVO.riskLevel === 'high' ? 0.9 : localLVO.riskLevel === 'moderate' ? 0.7 : 0.5,
        module: 'Full Stroke (Local LVO)',
        interpretation: localLVO.interpretation
      };
      
      // Production: Prediction logging removed for privacy
    }
  }
  
  try {
    // Still use API for ICH prediction (requires all parameters)
    const response = await fetchJSON(API_URLS.FULL_STROKE, normalizedPayload);
    
    // Production: Response logging removed for privacy
    
    // Extract ICH results from API
    const ichProbability = extractProbabilityFromResponse(response, 'ICH');
    const ichDrivers = extractDriversFromResponse(response, 'ICH');
    const ichConfidence = extractConfidenceFromResponse(response, 'ICH');
    
    const ichResult = {
      probability: ichProbability,
      drivers: ichDrivers,
      confidence: ichConfidence,
      module: 'Full Stroke'
    };
    
    // If local LVO failed, fall back to API
    if (!lvoResult) {
      console.log('⚠️ Falling back to API for LVO prediction');
      const lvoProbability = extractProbabilityFromResponse(response, 'LVO');
      const lvoDrivers = extractDriversFromResponse(response, 'LVO');
      const lvoConfidence = extractConfidenceFromResponse(response, 'LVO');
      
      lvoResult = {
        probability: lvoProbability,
        drivers: lvoDrivers,
        confidence: lvoConfidence,
        module: 'Full Stroke (API)'
      };
    }
    
    // Production: Results logging removed for privacy
    
    return {
      ich: ichResult,
      lvo: lvoResult
    };
  } catch (error) {
    console.error('Full Stroke prediction failed:', error);
    throw new APIError(
      `Failed to get stroke predictions: ${error.message}`,
      error.status,
      API_URLS.FULL_STROKE
    );
  }
}

// Export the error class for use in other modules
export { APIError };