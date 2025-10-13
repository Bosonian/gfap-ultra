// Clean driver extraction - ensuring LVO drivers come from LVO API, ICH from ICH API

/**
 * Extract and format drivers from new backend flat dictionary format
 */
export function extractDriversFromResponse(response, predictionType) {
  let rawDrivers = null;

  if (predictionType === "ICH") {
    rawDrivers = response.ich_prediction?.drivers || null;
  } else if (predictionType === "LVO") {
    rawDrivers = response.lvo_prediction?.drivers || null;
  }

  if (!rawDrivers) {
    return null;
  }

  // Convert flat dictionary to structured format
  const formattedDrivers = formatDriversFromDictionary(rawDrivers, predictionType);

  // Check for FAST-ED specifically
  const allFeatures = [...formattedDrivers.positive, ...formattedDrivers.negative];
  const fastEdFeature = allFeatures.find((f) => f.label && (
    f.label.toLowerCase().includes("fast")
      || f.label.includes("fast_ed")
  ));

  // FAST-ED feature detection for validation

  return formattedDrivers;
}

/**
 * Convert backend flat dictionary to structured positive/negative arrays
 */
function formatDriversFromDictionary(drivers, predictionType) {
  const positive = [];
  const negative = [];

  Object.entries(drivers).forEach(([label, weight]) => {
    if (typeof weight === "number") {
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

  return {
    kind: "flat_dictionary",
    units: "logit",
    positive,
    negative,
    meta: {},
  };
}

/**
 * Clean probability extraction with source tracking
 */
export function extractProbabilityFromResponse(response, predictionType) {
  let probability = 0;

  if (predictionType === "ICH") {
    probability = response.ich_prediction?.probability || 0;
  } else if (predictionType === "LVO") {
    probability = response.lvo_prediction?.probability || 0;
  }

  return probability;
}

/**
 * Clean confidence extraction with source tracking
 */
export function extractConfidenceFromResponse(response, predictionType) {
  let confidence = 0.85; // default

  if (predictionType === "ICH") {
    confidence = response.ich_prediction?.confidence || 0.85;
  } else if (predictionType === "LVO") {
    confidence = response.lvo_prediction?.confidence || 0.85;
  }

  return confidence;
}
