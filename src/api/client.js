import { API_URLS, APP_CONFIG } from '../config.js';

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
  
  // Debug log the payload being sent
  console.log('Coma ICH API Payload:', normalizedPayload);
  
  try {
    const response = await fetchJSON(API_URLS.COMA_ICH, normalizedPayload);
    
    // Debug log the API response
    console.log('Coma ICH API Response:', response);
    
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
  
  // Debug log the payload being sent
  console.log('Limited Data ICH API Payload:', normalizedPayload);
  
  try {
    const response = await fetchJSON(API_URLS.LDM_ICH, normalizedPayload);
    
    // Debug log the API response
    console.log('Limited Data ICH API Response:', response);
    
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
  
  // Debug log the payload being sent
  console.log('Full Stroke API Payload:', normalizedPayload);
  
  try {
    const response = await fetchJSON(API_URLS.FULL_STROKE, normalizedPayload);
    
    // Debug log the API response
    console.log('Full Stroke API Response:', response);
    
    // Extract ICH and LVO predictions with proper null checks
    const ichResult = {
      probability: safeParseFloat(response.ich_probability || response.ich?.probability, 0),
      drivers: response.ich_drivers || response.ich?.drivers || null,
      confidence: safeParseFloat(response.ich_confidence || response.ich?.confidence, 0.85),
      module: 'Full Stroke'
    };
    
    const lvoResult = {
      probability: safeParseFloat(response.lvo_probability || response.lvo?.probability, 0),
      drivers: response.lvo_drivers || response.lvo?.drivers || null,
      confidence: safeParseFloat(response.lvo_confidence || response.lvo?.confidence, 0.85),
      module: 'Full Stroke'
    };
    
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