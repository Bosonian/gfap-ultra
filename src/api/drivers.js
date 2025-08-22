// Clean driver extraction - ensuring LVO drivers come from LVO API, ICH from ICH API

/**
 * Extract drivers with clear API source tracking
 */
export function extractDriversFromResponse(response, predictionType) {
  console.log(`=== EXTRACTING ${predictionType.toUpperCase()} DRIVERS ===`);
  console.log('Full response:', response);
  
  let drivers = null;
  
  if (predictionType === 'ICH') {
    // ICH drivers only from ICH prediction
    drivers = response.ich_prediction?.drivers || null;
    console.log('🧠 ICH drivers extracted:', drivers);
    
    if (!drivers) {
      console.log('❌ No ICH drivers found in ich_prediction.drivers');
      console.log('Available ICH prediction keys:', Object.keys(response.ich_prediction || {}));
    }
    
  } else if (predictionType === 'LVO') {
    // LVO drivers only from LVO prediction  
    drivers = response.lvo_prediction?.drivers || null;
    console.log('🩸 LVO drivers extracted:', drivers);
    
    if (!drivers) {
      console.log('❌ No LVO drivers found in lvo_prediction.drivers');
      console.log('Available LVO prediction keys:', Object.keys(response.lvo_prediction || {}));
    }
  }
  
  if (drivers) {
    console.log(`✅ ${predictionType} drivers successfully extracted:`, drivers);
    console.log(`📊 ${predictionType} driver type:`, drivers.kind || 'unknown');
    
    // Log specific features for debugging
    if (drivers.positive) {
      console.log(`📈 ${predictionType} positive features:`, drivers.positive.map(d => `${d.label}: ${d.weight}`));
    }
    if (drivers.negative) {
      console.log(`📉 ${predictionType} negative features:`, drivers.negative.map(d => `${d.label}: ${d.weight}`));
    }
    
    // Check for FAST-ED specifically
    const allFeatures = [...(drivers.positive || []), ...(drivers.negative || [])];
    const fastEdFeature = allFeatures.find(f => 
      f.label && (
        f.label.toLowerCase().includes('fast') || 
        f.label.includes('fast_ed') ||
        f.label.toLowerCase().includes('ed')
      )
    );
    
    if (fastEdFeature) {
      console.log(`🎯 FAST-ED found in ${predictionType}:`, fastEdFeature);
    } else {
      console.log(`⚠️  FAST-ED NOT found in ${predictionType} drivers`);
    }
  }
  
  return drivers;
}

/**
 * Clean probability extraction with source tracking
 */
export function extractProbabilityFromResponse(response, predictionType) {
  console.log(`=== EXTRACTING ${predictionType.toUpperCase()} PROBABILITY ===`);
  
  let probability = 0;
  
  if (predictionType === 'ICH') {
    probability = response.ich_prediction?.probability || 0;
    console.log('🧠 ICH probability extracted:', probability);
    
  } else if (predictionType === 'LVO') {
    probability = response.lvo_prediction?.probability || 0;
    console.log('🩸 LVO probability extracted:', probability);
  }
  
  return probability;
}

/**
 * Clean confidence extraction with source tracking
 */
export function extractConfidenceFromResponse(response, predictionType) {
  let confidence = 0.85; // default
  
  if (predictionType === 'ICH') {
    confidence = response.ich_prediction?.confidence || 0.85;
  } else if (predictionType === 'LVO') {
    confidence = response.lvo_prediction?.confidence || 0.85;
  }
  
  return confidence;
}