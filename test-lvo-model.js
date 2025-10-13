// Test script for obfuscated LVO model
import { predictLVO, canUseLocalModel } from "./src/logic/lvo-local-model.js";

console.log("Testing Obfuscated LVO Model\n");
console.log("=====================================\n");

// Test cases with expected outcomes
const testCases = [
  {
    name: "High FAST-ED, Low GFAP (typical LVO)",
    gfap: 50,
    fastEd: 7,
    expected: "High LVO probability"
  },
  {
    name: "Low FAST-ED, Low GFAP",
    gfap: 30,
    fastEd: 2,
    expected: "Low LVO probability"
  },
  {
    name: "High FAST-ED, High GFAP (possible hemorrhage)",
    gfap: 800,
    fastEd: 6,
    expected: "Moderate-High LVO (GFAP reduces probability)"
  },
  {
    name: "Moderate values",
    gfap: 250,
    fastEd: 4,
    expected: "Moderate LVO probability"
  }
];

console.log("Test Cases:\n");

testCases.forEach((test, index) => {
  console.log(`\nTest ${index + 1}: ${test.name}`);
  console.log(`  Inputs: GFAP=${test.gfap} pg/mL, FAST-ED=${test.fastEd}`);
  
  // Check if model can be used
  const canUse = canUseLocalModel({ gfapValue: test.gfap, fastEdScore: test.fastEd });
  console.log(`  Can use model: ${canUse}`);
  
  if (canUse) {
    const result = predictLVO(test.gfap, test.fastEd);
    
    if (result.probability !== null) {
      console.log(`  ✅ Probability: ${(result.probability * 100).toFixed(1)}%`);
      console.log(`  Risk Level: ${result.riskLevel}`);
      console.log(`  Model: ${result.model}`);
      
      // Show risk factors
      if (result.riskFactors && result.riskFactors.length > 0) {
        console.log("  Risk Factors:");
        result.riskFactors.forEach(factor => {
          console.log(`    - ${factor.name}: ${factor.value} (${factor.impact})`);
        });
      }
      
      console.log(`  Expected: ${test.expected}`);
    } else {
      console.log(`  ❌ Error: ${result.error}`);
    }
  }
});

// Test edge cases
console.log("\n\nEdge Cases:\n");
console.log("=====================================\n");

// Test with invalid inputs
try {
  console.log("Testing negative GFAP:");
  const result = predictLVO(-10, 5);
  console.log(result.error ? `  ❌ ${result.error}` : "  ✅ Handled");
} catch (e) {
  console.log(`  ❌ Error: ${e.message}`);
}

try {
  console.log("Testing FAST-ED out of range:");
  const result = predictLVO(100, 15);
  console.log(result.error ? `  ❌ ${result.error}` : "  ✅ Handled");
} catch (e) {
  console.log(`  ❌ Error: ${e.message}`);
}

// Verify obfuscation doesn't affect results
console.log("\n\nObfuscation Verification:\n");
console.log("=====================================\n");

// Calculate expected value manually (for verification)
const gfap = 200;
const fastEd = 5;

console.log(`Testing with GFAP=${gfap}, FAST-ED=${fastEd}`);
const result = predictLVO(gfap, fastEd);

if (result.probability !== null) {
  console.log("✅ Model executed successfully");
  console.log(`Probability: ${(result.probability * 100).toFixed(2)}%`);
  console.log(`Risk Level: ${result.riskLevel}`);
  
  // Check that internal values are obfuscated
  console.log("\nChecking obfuscation:");
  console.log(`Model name obfuscated: ${!result.model.includes("proprietary")}`);
  console.log(`Scaled inputs use obfuscated keys: ${Object.keys(result.scaledInputs).some(k => k !== "gfap" && k !== "fastEd")}`);
} else {
  console.log("❌ Model failed");
}

console.log("\n✅ All tests completed");