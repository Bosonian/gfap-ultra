import { API_URLS, APP_CONFIG } from '../config.js';

// Warm up Google Cloud Functions on app load
export async function warmUpFunctions() {
  console.log('Warming up Cloud Functions...');
  
  // Send lightweight ping requests to wake up cold functions
  const warmUpPromises = Object.values(API_URLS).map(async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for warm-up
      
      await fetch(url, {
        method: 'OPTIONS', // Use OPTIONS to avoid triggering actual processing
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      console.log(`Warmed up: ${url}`);
    } catch (error) {
      // Ignore warm-up errors - they're not critical
      console.log(`Warm-up failed for ${url}, but continuing...`);
    }
  });
  
  // Don't wait for warm-up to complete - do it in background
  Promise.all(warmUpPromises).then(() => {
    console.log('All functions warmed up');
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
  console.log('=== BACKEND DATA MAPPING TEST ===');
  console.log('📤 Full Stroke API Payload:', normalizedPayload);
  
  // Test all key clinical variables
  console.log('🧪 Clinical Variables Being Sent:');
  console.log('  📊 FAST-ED Score:', normalizedPayload.fast_ed_score);
  console.log('  🩸 Systolic BP:', normalizedPayload.systolic_bp);
  console.log('  🩸 Diastolic BP:', normalizedPayload.diastolic_bp);
  console.log('  🧬 GFAP Value:', normalizedPayload.gfap_value);
  console.log('  👤 Age:', normalizedPayload.age_years);
  console.log('  🤕 Headache:', normalizedPayload.headache);
  console.log('  😵 Vigilanz:', normalizedPayload.vigilanzminderung);
  console.log('  💪 Arm Parese:', normalizedPayload.armparese);
  console.log('  🦵 Leg Parese:', normalizedPayload.beinparese);
  console.log('  👁️ Eye Deviation:', normalizedPayload.eye_deviation);
  console.log('  💓 Atrial Fib:', normalizedPayload.atrial_fibrillation);
  console.log('  💊 Anticoag NOAK:', normalizedPayload.anticoagulated_noak);
  console.log('  💊 Antiplatelets:', normalizedPayload.antiplatelets);
  
  try {
    const response = await fetchJSON(API_URLS.FULL_STROKE, normalizedPayload);
    
    // Debug log the API response
    console.log('📥 Full Stroke API Response:', response);
    console.log('🔑 Available keys in response:', Object.keys(response));
    
    // Test backend data mapping accuracy
    console.log('=== BACKEND MAPPING VERIFICATION ===');
    
    // Check if backend returns any feature names that match our inputs
    const responseStr = JSON.stringify(response).toLowerCase();
    console.log('🔍 Backend Feature Name Analysis:');
    console.log('  Contains "fast":', responseStr.includes('fast'));
    console.log('  Contains "ed":', responseStr.includes('ed'));
    console.log('  Contains "fast_ed":', responseStr.includes('fast_ed'));
    console.log('  Contains "systolic":', responseStr.includes('systolic'));
    console.log('  Contains "diastolic":', responseStr.includes('diastolic'));
    console.log('  Contains "gfap":', responseStr.includes('gfap'));
    console.log('  Contains "age":', responseStr.includes('age'));
    console.log('  Contains "headache":', responseStr.includes('headache'));
    
    // Debug driver extraction
    console.log('🧠 ICH driver sources:');
    console.log('  response.ich_prediction?.drivers:', response.ich_prediction?.drivers);
    console.log('  response.ich_drivers:', response.ich_drivers);
    console.log('  response.ich?.drivers:', response.ich?.drivers);
    console.log('  response.drivers?.ich:', response.drivers?.ich);
    
    console.log('🩸 LVO driver sources:');
    console.log('  response.lvo_prediction?.drivers:', response.lvo_prediction?.drivers);
    console.log('  response.lvo_drivers:', response.lvo_drivers);
    console.log('  response.lvo?.drivers:', response.lvo?.drivers);
    console.log('  response.drivers?.lvo:', response.drivers?.lvo);
    
    // Try to identify probability values
    Object.keys(response).forEach(key => {
      const value = response[key];
      if (typeof value === 'number' && value >= 0 && value <= 1) {
        console.log(`Potential probability field: ${key} = ${value}`);
      }
    });
    
    // Extract ICH and LVO predictions based on actual API response structure
    const ichProbability = safeParseFloat(
      response.ich_prediction?.probability || 
      response.ich_probability || 
      response.ich?.probability || 
      response.ICH_probability || 
      response.ich_prob || 
      response.probability?.ich ||
      response.results?.ich_probability, 0);
    
    const lvoProbability = safeParseFloat(
      response.lvo_prediction?.probability || 
      response.lvo_probability || 
      response.lvo?.probability || 
      response.LVO_probability || 
      response.lvo_prob ||
      response.probability?.lvo ||
      response.results?.lvo_probability, 0);
      
    console.log('Extracted probabilities:', { ich: ichProbability, lvo: lvoProbability });

    const ichResult = {
      probability: ichProbability,
      drivers: response.ich_prediction?.drivers || response.ich_drivers || response.ich?.drivers || response.drivers?.ich || null,
      confidence: safeParseFloat(response.ich_prediction?.confidence || response.ich_confidence || response.ich?.confidence, 0.85),
      module: 'Full Stroke'
    };
    
    const lvoResult = {
      probability: lvoProbability,
      drivers: response.lvo_prediction?.drivers || response.lvo_drivers || response.lvo?.drivers || response.drivers?.lvo || null,
      confidence: safeParseFloat(response.lvo_prediction?.confidence || response.lvo_confidence || response.lvo?.confidence, 0.85),
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