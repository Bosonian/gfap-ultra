/**
 * Quick validation test for the new TypeScript LVO model
 */

// Test the new TypeScript implementation
import { lvoProbability, lvoClass, predictLVO } from './src/lib/lvoModel.js';

console.log('🧪 Testing New Production LVO Model');
console.log('=====================================');

// Test cases from the clinical specification
const testCases = [
  { gfap: 180, fastEd: 7, description: 'Reference case from specification' },
  { gfap: 50, fastEd: 2, description: 'Low risk case' },
  { gfap: 500, fastEd: 12, description: 'High risk case' },
  { gfap: 100, fastEd: 8, description: 'Previous problem case (was only 4.6%)' }
];

console.log('Testing basic probability calculations:');
testCases.forEach((testCase, i) => {
  try {
    const prob = lvoProbability(testCase.gfap, testCase.fastEd);
    const classification = lvoClass(testCase.gfap, testCase.fastEd);
    const probPercent = (prob * 100).toFixed(1);

    console.log(`${i + 1}. ${testCase.description}`);
    console.log(`   GFAP: ${testCase.gfap}, FAST-ED: ${testCase.fastEd}`);
    console.log(`   Probability: ${probPercent}% (Class: ${classification})`);

    // Validate probability range
    if (prob < 0 || prob > 1) {
      console.log(`   ❌ ERROR: Probability out of range [0,1]`);
    } else {
      console.log(`   ✅ Valid probability range`);
    }

    console.log('');
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    console.log('');
  }
});

console.log('Testing comprehensive prediction with detailed results:');
try {
  const detailedResult = predictLVO(180, 7);

  console.log('Detailed Result for GFAP=180, FAST-ED=7:');
  console.log(`- Probability: ${(detailedResult.probability * 100).toFixed(1)}%`);
  console.log(`- Classification: ${detailedResult.classification}`);
  console.log(`- Risk Level: ${detailedResult.metadata.isValid ? detailedResult.metadata.threshold : 'N/A'}`);
  console.log(`- Model Valid: ${detailedResult.metadata.isValid}`);
  console.log(`- Warnings: ${detailedResult.metadata.warnings.length}`);

  if (detailedResult.transformedValues) {
    console.log(`- GFAP Transformed: ${detailedResult.transformedValues.gfapTransformed.toFixed(4)}`);
    console.log(`- Final Logit: ${detailedResult.transformedValues.calibratedLogit.toFixed(4)}`);
  }

  console.log('✅ Detailed prediction successful');
} catch (error) {
  console.log(`❌ Detailed prediction failed: ${error.message}`);
}

console.log('\nTesting input validation:');

// Test edge cases
const edgeCases = [
  { gfap: -100, fastEd: 8, expectError: true, description: 'Negative GFAP' },
  { gfap: 100, fastEd: 25, expectError: false, description: 'FAST-ED > 16 (should clamp)' },
  { gfap: 0, fastEd: 0, expectError: false, description: 'Minimum values' },
  { gfap: 10000, fastEd: 16, expectError: false, description: 'High values' }
];

edgeCases.forEach((testCase, i) => {
  try {
    const prob = lvoProbability(testCase.gfap, testCase.fastEd);
    const probPercent = (prob * 100).toFixed(1);

    if (testCase.expectError) {
      console.log(`${i + 1}. ${testCase.description}: ❌ Expected error but got ${probPercent}%`);
    } else {
      console.log(`${i + 1}. ${testCase.description}: ✅ ${probPercent}%`);
    }
  } catch (error) {
    if (testCase.expectError) {
      console.log(`${i + 1}. ${testCase.description}: ✅ Expected error: ${error.message}`);
    } else {
      console.log(`${i + 1}. ${testCase.description}: ❌ Unexpected error: ${error.message}`);
    }
  }
});

console.log('\n🎯 Testing Complete - New LVO Model Validation');

// Compare with a few expected ranges for clinical validation
console.log('\nClinical Range Validation:');
const clinicalCases = [
  { gfap: 100, fastEd: 8, expectedRange: '30-70%', description: 'High FAST-ED should give moderate-high probability' },
  { gfap: 50, fastEd: 1, expectedRange: '5-25%', description: 'Low values should give low probability' },
  { gfap: 300, fastEd: 14, expectedRange: '60-95%', description: 'High values should give high probability' }
];

clinicalCases.forEach((testCase, i) => {
  try {
    const prob = lvoProbability(testCase.gfap, testCase.fastEd);
    const probPercent = prob * 100;

    console.log(`${i + 1}. ${testCase.description}`);
    console.log(`   GFAP: ${testCase.gfap}, FAST-ED: ${testCase.fastEd}`);
    console.log(`   Result: ${probPercent.toFixed(1)}% (Expected: ${testCase.expectedRange})`);

    // Basic sanity check for clinical appropriateness
    if (testCase.fastEd >= 8 && probPercent < 20) {
      console.log(`   ⚠️  WARNING: High FAST-ED but low probability - may need parameter adjustment`);
    } else if (testCase.fastEd <= 2 && probPercent > 50) {
      console.log(`   ⚠️  WARNING: Low FAST-ED but high probability - may need parameter adjustment`);
    } else {
      console.log(`   ✅ Clinically reasonable result`);
    }

    console.log('');
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    console.log('');
  }
});

export { testCases };