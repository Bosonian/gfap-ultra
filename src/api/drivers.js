// Clean driver extraction - ensuring LVO drivers come from LVO API, ICH from ICH API

/**
 * Extract and format drivers from new backend flat dictionary format
 */
export function extractDriversFromResponse(response, predictionType) {
  console.log(`=== EXTRACTING ${predictionType.toUpperCase()} DRIVERS ===`);
  console.log('Full response:', response);
  
  let rawDrivers = null;
  
  if (predictionType === 'ICH') {
    rawDrivers = response.ich_prediction?.drivers || null;
    console.log('🧠 ICH raw drivers extracted:', rawDrivers);
  } else if (predictionType === 'LVO') {
    rawDrivers = response.lvo_prediction?.drivers || null;
    console.log('🩸 LVO raw drivers extracted:', rawDrivers);
  }
  
  if (!rawDrivers) {
    console.log(`❌ No ${predictionType} drivers found`);
    return null;
  }
  
  // Convert flat dictionary to structured format
  const formattedDrivers = formatDriversFromDictionary(rawDrivers, predictionType);
  
  console.log(`✅ ${predictionType} drivers formatted:`, formattedDrivers);
  
  // Check for FAST-ED specifically
  const allFeatures = [...formattedDrivers.positive, ...formattedDrivers.negative];
  const fastEdFeature = allFeatures.find(f => 
    f.label && (
      f.label.toLowerCase().includes('fast') || 
      f.label.includes('fast_ed')
    )
  );
  
  if (fastEdFeature) {
    console.log(`🎯 FAST-ED found in ${predictionType}:`, `${fastEdFeature.label}: ${fastEdFeature.weight > 0 ? '+' : ''}${fastEdFeature.weight.toFixed(4)}`);
  } else {
    console.log(`⚠️  FAST-ED NOT found in ${predictionType} drivers`);
  }
  
  return formattedDrivers;
}

/**
 * Convert backend flat dictionary to structured positive/negative arrays
 */
function formatDriversFromDictionary(drivers, predictionType) {
  console.log(`🔄 Formatting ${predictionType} drivers from dictionary:`, drivers);
  
  const positive = [];
  const negative = [];
  
  Object.entries(drivers).forEach(([label, weight]) => {
    if (typeof weight === 'number') {
      if (weight > 0) {
        positive.push({ label, weight });
      } else if (weight < 0) {
        negative.push({ label, weight: Math.abs(weight) }); // Store as positive value
      }
      // Skip zero weights
    }
  });
  
  // Sort by weight (descending)
  positive.sort((a, b) => b.weight - a.weight);
  negative.sort((a, b) => b.weight - a.weight);
  
  console.log(`📈 ${predictionType} positive drivers:`, positive.slice(0, 5));
  console.log(`📉 ${predictionType} negative drivers:`, negative.slice(0, 5));
  
  return {
    kind: 'flat_dictionary',
    units: 'logit',
    positive,
    negative,
    meta: {}
  };
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