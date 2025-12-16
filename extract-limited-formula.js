/**
 * Extract Limited ICH logistic regression formula
 */

const API_URL = 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich';

async function extractFormula() {
  // Test with known values to get coefficients
  const testCase = {
    age_years: 82,
    systolic_bp: 150,
    diastolic_bp: 90,
    gfap_value: 54, // plasma scale
    vigilanzminderung: false
  };

  console.log('🔬 Extracting Limited ICH Model Formula\n');
  console.log('Test case:', testCase, '\n');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCase)
  });

  const result = await response.json();

  console.log('═══════════════════════════════════════════════════════');
  console.log('  LOGISTIC REGRESSION COEFFICIENTS');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Intercept (β₀):', result.drivers.intercept);
  console.log('\nFeature Contributions (log-odds):\n');

  const allContribs = [...result.drivers.positive, ...result.drivers.negative];
  allContribs.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  allContribs.forEach(c => {
    const sign = c.weight >= 0 ? '+' : '';
    console.log(`  ${c.label.padEnd(25)} ${sign}${c.weight.toFixed(4)}`);
  });

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  CALCULATION');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`Total logit = ${result.drivers.intercept} (intercept) + ${result.drivers.contrib_sum} (features)`);
  console.log(`           = ${result.drivers.logit_total}`);
  console.log(`\nProbability = 1 / (1 + e^(-logit))`);
  console.log(`           = 1 / (1 + e^(${-result.drivers.logit_total}))`);
  console.log(`           = ${result.ich_probability} (${(result.ich_probability * 100).toFixed(1)}%)\n`);

  return result.drivers;
}

async function calculateManually(age, systolic, diastolic, gfap, vigilanz, drivers) {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  MANUAL CALCULATION WITH EXTRACTED FORMULA');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Inputs:');
  console.log(`  Age: ${age} years`);
  console.log(`  BP: ${systolic}/${diastolic} mmHg`);
  console.log(`  GFAP: ${gfap} pg/mL (plasma)`);
  console.log(`  Vigilanzminderung: ${vigilanz}\n`);

  // NOTE: Without the actual preprocessing pipeline, we can only approximate
  // The model uses a sklearn Pipeline with preprocessing steps
  console.log('⚠️  Note: This requires the exact preprocessing pipeline');
  console.log('    (standardization, transformations) from the trained model.');
  console.log('    The API call gives us the coefficients but not the preprocessing.\n');

  console.log('✅ Better approach: Use the API to test all scenarios');
}

async function testAllScenarios() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  TESTING ALL SCENARIOS TO FIND 28% ICH RISK');
  console.log('═══════════════════════════════════════════════════════\n');

  const baseCase = {
    age_years: 82,
    systolic_bp: 150,
    diastolic_bp: 90,
    vigilanzminderung: false
  };

  console.log('📊 Testing GFAP variations (age=82, BP=150/90):\n');

  // Test GFAP values around 54
  for (let gfap = 50; gfap <= 60; gfap++) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...baseCase, gfap_value: gfap })
    });

    const result = await response.json();
    const prob = result.ich_probability * 100;
    const match = Math.abs(prob - 28) < 1 ? '✓ MATCH' : '';

    console.log(`  GFAP ${gfap} pg/mL → ${prob.toFixed(1)}% ICH risk ${match}`);

    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('\n📊 Testing AGE variations (GFAP=59×0.46=27.14, BP=150/90):\n');

  const gfap59plasma = 59 * 0.46;
  for (let age = 70; age <= 95; age += 5) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age_years: age, systolic_bp: 150, diastolic_bp: 90, gfap_value: gfap59plasma, vigilanzminderung: false })
    });

    const result = await response.json();
    const prob = result.ich_probability * 100;
    const match = Math.abs(prob - 28) < 2 ? '✓ CLOSE' : '';

    console.log(`  Age ${age} years → ${prob.toFixed(1)}% ICH risk ${match}`);

    await new Promise(resolve => setTimeout(resolve, 150));
  }
}

async function main() {
  const drivers = await extractFormula();
  await testAllScenarios();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  CONCLUSION');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('The Limited ICH model uses a trained LogisticRegression with');
  console.log('preprocessing (likely StandardScaler or similar).\n');

  console.log('To manually calculate ICH risk, you need:');
  console.log('  1. The exact preprocessing steps (means, std devs)');
  console.log('  2. The logistic regression coefficients');
  console.log('  3. Apply: logit = β₀ + Σ(βᵢ × feature_transformed)\n');

  console.log('Best approach: Use the API to test scenarios (as done above).');
}

main().catch(console.error);
