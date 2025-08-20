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
  
  try {
    const response = await fetchJSON(API_URLS.COMA_ICH, normalizedPayload);
    
    // Normalize response format for consistency
    return {
      probability: response.probability || response.ich_probability,
      drivers: response.drivers || null,
      confidence: response.confidence || 0.75,
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
  const normalizedPayload = normalizeBooleans(payload);
  
  try {
    const response = await fetchJSON(API_URLS.LDM_ICH, normalizedPayload);
    
    // Normalize response format for consistency
    return {
      probability: response.probability || response.ich_probability,
      drivers: response.drivers || null,
      confidence: response.confidence || 0.65,
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
  const normalizedPayload = normalizeBooleans(payload);
  
  try {
    const response = await fetchJSON(API_URLS.FULL_STROKE, normalizedPayload);
    
    // Extract ICH and LVO predictions
    const ichResult = {
      probability: response.ich_probability || response.ich?.probability,
      drivers: response.ich_drivers || response.ich?.drivers,
      confidence: response.ich_confidence || response.ich?.confidence || 0.85,
      module: 'Full Stroke'
    };
    
    const lvoResult = {
      probability: response.lvo_probability || response.lvo?.probability,
      drivers: response.lvo_drivers || response.lvo?.drivers,
      confidence: response.lvo_confidence || response.lvo?.confidence || 0.85,
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