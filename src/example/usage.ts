/**
 * LVO Model Usage Examples
 *
 * Demonstrates how to use the production-grade LVO prediction model
 * in various scenarios typical of medical applications.
 */

import { lvoProbability, lvoClass, predictLVO } from "../lib/lvoModel.js";

// Example 1: Basic probability calculation
console.log("=== Basic LVO Prediction ===");

const gfap = 180; // pg/mL
const fastEd = 7; // Score 0-16

const probability = lvoProbability(gfap, fastEd);
const classification = lvoClass(gfap, fastEd);

console.log(`GFAP: ${gfap} pg/mL, FAST-ED: ${fastEd}`);
console.log(`LVO Probability: ${(probability * 100).toFixed(1)}%`);
console.log(`Classification: ${classification === 1 ? "LVO Positive" : "LVO Negative"}`);

// Example 2: Detailed prediction with intermediate values
console.log("\n=== Detailed Prediction ===");

const detailedResult = predictLVO(gfap, fastEd);

console.log("Input Values:");
console.log(`  GFAP: ${detailedResult.inputs.gfap} pg/mL`);
console.log(`  FAST-ED: ${detailedResult.inputs.fasted}`);

console.log("Transformed Values:");
console.log(`  GFAP (transformed): ${detailedResult.transformedValues.gfapTransformed.toFixed(4)}`);
console.log(
  `  GFAP (standardized): ${detailedResult.transformedValues.gfapStandardized.toFixed(4)}`
);
console.log(
  `  FAST-ED (standardized): ${detailedResult.transformedValues.fastedStandardized.toFixed(4)}`
);
console.log(`  Logit: ${detailedResult.transformedValues.logit.toFixed(4)}`);
console.log(`  Calibrated Logit: ${detailedResult.transformedValues.calibratedLogit.toFixed(4)}`);

console.log("Results:");
console.log(`  Probability: ${detailedResult.probability.toFixed(4)}`);
console.log(`  Classification: ${detailedResult.classification}`);
console.log(`  Model Version: ${detailedResult.metadata.modelVersion}`);
console.log(`  Threshold: ${detailedResult.metadata.threshold}`);

if (detailedResult.metadata.warnings.length > 0) {
  console.log("Warnings:");
  detailedResult.metadata.warnings.forEach(warning => console.log(`  - ${warning}`));
}

// Example 3: Batch processing multiple patients
console.log("\n=== Batch Processing ===");

const patients = [
  { id: "P001", gfap: 50, fastEd: 2, description: "Low risk patient" },
  { id: "P002", gfap: 200, fastEd: 8, description: "Moderate risk patient" },
  { id: "P003", gfap: 500, fastEd: 12, description: "High risk patient" },
  { id: "P004", gfap: 1000, fastEd: 15, description: "Very high risk patient" },
];

console.log("Patient Risk Assessment:");
patients.forEach(patient => {
  const prob = lvoProbability(patient.gfap, patient.fastEd);
  const risk = prob > 0.7 ? "HIGH" : prob > 0.4 ? "MODERATE" : "LOW";

  console.log(`${patient.id}: ${patient.description}`);
  console.log(
    `  GFAP: ${patient.gfap}, FAST-ED: ${patient.fastEd} → ${(prob * 100).toFixed(1)}% (${risk})`
  );
});

// Example 4: Error handling
console.log("\n=== Error Handling ===");

try {
  // This will throw an error due to negative GFAP
  lvoProbability(-100, 8);
} catch (error) {
  console.log(`Caught error: ${error.message}`);
}

// Using predictLVO for graceful error handling
const errorResult = predictLVO(-100, 8);
if (!errorResult.metadata.isValid) {
  console.log("Prediction failed with errors:");
  errorResult.metadata.warnings.forEach(warning => console.log(`  - ${warning}`));
}

// Example 5: Edge case handling
console.log("\n=== Edge Cases ===");

// FAST-ED out of range (will be clamped)
const edgeCaseResult = predictLVO(100, 25); // FAST-ED > 16
console.log(`FAST-ED clamping: Input 25 → Processed ${edgeCaseResult.inputs.fasted}`);
if (edgeCaseResult.metadata.warnings.length > 0) {
  console.log(`Warning: ${edgeCaseResult.metadata.warnings[0]}`);
}

// Very high GFAP
const highGfapResult = predictLVO(10000, 8);
console.log(
  `High GFAP (${highGfapResult.inputs.gfap}): ${(highGfapResult.probability * 100).toFixed(1)}%`
);

// Example 6: Integration with existing application data
console.log("\n=== Application Integration ===");

// Simulating typical API payload from the stroke triage application
interface StrokeTriagePayload {
  gfap_value: string | number;
  fast_ed_score: string | number;
}

function processStrokeTriageData(payload: StrokeTriagePayload) {
  try {
    // Convert and validate inputs
    const gfap = parseFloat(String(payload.gfap_value));
    const fastEd = parseInt(String(payload.fast_ed_score));

    // Predict LVO
    const result = predictLVO(gfap, fastEd);

    return {
      success: true,
      lvo_probability: result.probability,
      lvo_classification: result.classification,
      risk_level: result.probability > 0.7 ? "high" : result.probability > 0.4 ? "moderate" : "low",
      model_version: result.metadata.modelVersion,
      warnings: result.metadata.warnings,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      lvo_probability: null,
      lvo_classification: 0,
    };
  }
}

// Test with typical payloads
const testPayloads = [
  { gfap_value: "180", fast_ed_score: "7" },
  { gfap_value: 250, fast_ed_score: 10 },
  { gfap_value: "invalid", fast_ed_score: "8" },
];

testPayloads.forEach((payload, index) => {
  const result = processStrokeTriageData(payload);
  console.log(`Payload ${index + 1}:`, result);
});

// Example 7: Clinical decision support
console.log("\n=== Clinical Decision Support ===");

function generateClinicalRecommendation(gfap: number, fastEd: number) {
  const result = predictLVO(gfap, fastEd);

  let recommendation = "";
  let urgency = "";

  if (result.probability >= 0.7) {
    recommendation = "IMMEDIATE thrombectomy evaluation recommended";
    urgency = "URGENT";
  } else if (result.probability >= 0.4) {
    recommendation = "Advanced imaging and neurological consultation recommended";
    urgency = "HIGH";
  } else if (result.probability >= 0.2) {
    recommendation = "Standard stroke protocol, monitor for changes";
    urgency = "MODERATE";
  } else {
    recommendation = "Low LVO probability, consider alternative diagnoses";
    urgency = "LOW";
  }

  return {
    probability: (result.probability * 100).toFixed(1) + "%",
    urgency,
    recommendation,
    fastEdLevel:
      fastEd >= 10 ? "Very High" : fastEd >= 6 ? "High" : fastEd >= 3 ? "Moderate" : "Low",
    gfapLevel: gfap >= 1000 ? "Very High" : gfap >= 500 ? "High" : gfap >= 200 ? "Moderate" : "Low",
  };
}

const clinicalCases = [
  { gfap: 80, fastEd: 3, case: "Mild presentation" },
  { gfap: 300, fastEd: 9, case: "Typical LVO candidate" },
  { gfap: 150, fastEd: 14, case: "High FAST-ED, moderate GFAP" },
];

clinicalCases.forEach(({ gfap, fastEd, case: caseDesc }) => {
  const rec = generateClinicalRecommendation(gfap, fastEd);
  console.log(`${caseDesc}:`);
  console.log(`  GFAP: ${gfap} (${rec.gfapLevel}), FAST-ED: ${fastEd} (${rec.fastEdLevel})`);
  console.log(`  LVO Probability: ${rec.probability} (${rec.urgency})`);
  console.log(`  Recommendation: ${rec.recommendation}`);
  console.log();
});

export { processStrokeTriageData, generateClinicalRecommendation };
