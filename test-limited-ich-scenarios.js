/**
 * Test Limited ICH scenarios to find typo possibilities
 *
 * Scenario: Rettungsdienst reported 28% ICH risk
 * Question 1: With age=82, BP=150/90, what GFAP gives 28%?
 * Question 2: With GFAP=59, what age/BP combinations give 28%?
 */

const API_URL = 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich';

async function testLimitedICH(age, systolic, diastolic, gfap, vigilanz = false) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age_years: age,
        systolic_bp: systolic,
        diastolic_bp: diastolic,
        gfap_value: gfap,
        vigilanzminderung: vigilanz
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error: ${error}`);
      return null;
    }

    const result = await response.json();
    return result.ich_probability;
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    return null;
  }
}

async function findGFAPFor28Percent(age, systolic, diastolic) {
  console.log(`\n🔍 Finding GFAP value that gives 28% ICH risk`);
  console.log(`   Fixed: Age=${age}, BP=${systolic}/${diastolic}\n`);

  // Binary search for GFAP value
  let low = 10;
  let high = 500;
  const target = 0.28;
  const tolerance = 0.005; // ±0.5%

  while (high - low > 1) {
    const mid = Math.round((low + high) / 2);
    const prob = await testLimitedICH(age, systolic, diastolic, mid);

    if (prob === null) {
      console.error('API error, stopping search');
      break;
    }

    console.log(`   GFAP=${mid} pg/mL → ICH=${(prob * 100).toFixed(1)}%`);

    if (Math.abs(prob - target) < tolerance) {
      console.log(`\n✅ Found: GFAP = ${mid} pg/mL gives ${(prob * 100).toFixed(1)}% ICH risk`);
      return mid;
    }

    if (prob < target) {
      low = mid;
    } else {
      high = mid;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Final check at midpoint
  const finalGFAP = Math.round((low + high) / 2);
  const finalProb = await testLimitedICH(age, systolic, diastolic, finalGFAP);
  console.log(`\n✅ Best match: GFAP = ${finalGFAP} pg/mL → ${(finalProb * 100).toFixed(1)}% ICH risk`);

  return finalGFAP;
}

async function findTyposFor28Percent(gfap) {
  console.log(`\n\n🔍 Finding age/BP typos that give 28% ICH risk`);
  console.log(`   Fixed: GFAP=${gfap} pg/mL (whole blood)\n`);

  // Convert to plasma scale (0.46 factor)
  const gfapPlasma = gfap * 0.46;
  console.log(`   Converted to plasma: ${gfapPlasma.toFixed(2)} pg/mL\n`);

  const target = 0.28;
  const tolerance = 0.01; // ±1%
  const scenarios = [];

  // Test age variations (82 ±10 years)
  console.log('📊 Testing AGE variations (BP fixed at 150/90):');
  for (let age = 72; age <= 92; age += 2) {
    const prob = await testLimitedICH(age, 150, 90, gfapPlasma);
    if (prob && Math.abs(prob - target) < tolerance) {
      const match = {
        type: 'Age typo',
        age,
        systolic: 150,
        diastolic: 90,
        gfap: gfap,
        probability: prob
      };
      scenarios.push(match);
      console.log(`   ✓ Age=${age} → ${(prob * 100).toFixed(1)}% (diff from 82: ${age - 82})`);
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Test systolic BP variations (150 ±30)
  console.log('\n📊 Testing SYSTOLIC BP variations (Age=82, diastolic=90):');
  for (let sys = 120; sys <= 180; sys += 5) {
    const prob = await testLimitedICH(82, sys, 90, gfapPlasma);
    if (prob && Math.abs(prob - target) < tolerance) {
      const match = {
        type: 'Systolic BP typo',
        age: 82,
        systolic: sys,
        diastolic: 90,
        gfap: gfap,
        probability: prob
      };
      scenarios.push(match);
      console.log(`   ✓ Systolic=${sys} → ${(prob * 100).toFixed(1)}% (diff from 150: ${sys - 150})`);
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Test diastolic BP variations (90 ±20)
  console.log('\n📊 Testing DIASTOLIC BP variations (Age=82, systolic=150):');
  for (let dia = 70; dia <= 110; dia += 5) {
    const prob = await testLimitedICH(82, 150, dia, gfapPlasma);
    if (prob && Math.abs(prob - target) < tolerance) {
      const match = {
        type: 'Diastolic BP typo',
        age: 82,
        systolic: 150,
        diastolic: dia,
        gfap: gfap,
        probability: prob
      };
      scenarios.push(match);
      console.log(`   ✓ Diastolic=${dia} → ${(prob * 100).toFixed(1)}% (diff from 90: ${dia - 90})`);
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  return scenarios;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  LIMITED ICH MODULE - TYPO INVESTIGATION');
  console.log('  Target: 28% ICH Risk');
  console.log('═══════════════════════════════════════════════════════');

  // Question 1: What GFAP gives 28% with age=82, BP=150/90?
  await findGFAPFor28Percent(82, 150, 90);

  // Question 2: What age/BP typos give 28% with GFAP=59?
  const scenarios = await findTyposFor28Percent(59);

  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  SUMMARY: Possible Typo Scenarios');
  console.log('═══════════════════════════════════════════════════════\n');

  if (scenarios.length > 0) {
    scenarios.forEach((s, i) => {
      console.log(`${i + 1}. ${s.type}:`);
      console.log(`   Age: ${s.age} years`);
      console.log(`   BP: ${s.systolic}/${s.diastolic} mmHg`);
      console.log(`   GFAP: ${s.gfap} pg/mL (whole blood)`);
      console.log(`   Result: ${(s.probability * 100).toFixed(1)}% ICH risk\n`);
    });
  } else {
    console.log('❌ No exact matches found within ±1% tolerance');
    console.log('   Try widening search ranges or adjusting tolerance');
  }
}

main().catch(console.error);
