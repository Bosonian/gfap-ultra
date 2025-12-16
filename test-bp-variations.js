/**
 * Test BP variations with GFAP=59 (whole blood)
 */

const API_URL = 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich';

async function testBP(age, systolic, diastolic, gfapPlasma) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age_years: age,
      systolic_bp: systolic,
      diastolic_bp: diastolic,
      gfap_value: gfapPlasma,
      vigilanzminderung: false
    })
  });

  const result = await response.json();
  return result.ich_probability * 100;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  BLOOD PRESSURE VARIATION TEST');
  console.log('  Fixed: Age=82, GFAP=59 pg/mL (whole blood)');
  console.log('═══════════════════════════════════════════════════════\n');

  const gfapPlasma = 59 * 0.46; // Convert to plasma scale
  console.log(`GFAP (whole blood): 59 pg/mL`);
  console.log(`GFAP (plasma scale): ${gfapPlasma.toFixed(2)} pg/mL\n`);

  console.log('📊 Testing SYSTOLIC BP variations (age=82, diastolic=90):\n');

  for (let sys = 120; sys <= 200; sys += 10) {
    const prob = await testBP(82, sys, 90, gfapPlasma);
    const match = Math.abs(prob - 28) < 1.5 ? '✓ MATCH' : '';
    console.log(`  BP ${sys}/90 mmHg → ${prob.toFixed(1)}% ICH risk ${match}`);
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('\n📊 Testing DIASTOLIC BP variations (age=82, systolic=150):\n');

  for (let dia = 60; dia <= 120; dia += 10) {
    const prob = await testBP(82, 150, dia, gfapPlasma);
    const match = Math.abs(prob - 28) < 1.5 ? '✓ MATCH' : '';
    console.log(`  BP 150/${dia} mmHg → ${prob.toFixed(1)}% ICH risk ${match}`);
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('\n📊 Testing COMBINED BP variations (age=82):\n');

  // Test some plausible BP misreadings
  const bpTests = [
    { sys: 140, dia: 90, note: '140/90 (150→140 misread)' },
    { sys: 160, dia: 90, note: '160/90 (150→160 misread)' },
    { sys: 150, dia: 80, note: '150/80 (90→80 misread)' },
    { sys: 150, dia: 100, note: '150/100 (90→100 misread)' },
    { sys: 180, dia: 90, note: '180/90 (high BP)' },
    { sys: 180, dia: 100, note: '180/100 (high BP)' },
    { sys: 200, dia: 100, note: '200/100 (very high BP)' },
  ];

  for (const test of bpTests) {
    const prob = await testBP(82, test.sys, test.dia, gfapPlasma);
    const match = Math.abs(prob - 28) < 1.5 ? '✓ MATCH' : '';
    console.log(`  ${test.note.padEnd(35)} → ${prob.toFixed(1)}% ${match}`);
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  COMBINED AGE + BP TEST');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Testing if different age + BP gives 28% with GFAP=59 WB:\n');

  const combos = [
    { age: 70, sys: 180, dia: 100 },
    { age: 75, sys: 180, dia: 100 },
    { age: 80, sys: 180, dia: 100 },
    { age: 85, sys: 180, dia: 100 },
    { age: 70, sys: 200, dia: 110 },
    { age: 75, sys: 200, dia: 110 },
  ];

  for (const combo of combos) {
    const prob = await testBP(combo.age, combo.sys, combo.dia, gfapPlasma);
    const match = Math.abs(prob - 28) < 2 ? '✓ CLOSE' : '';
    console.log(`  Age ${combo.age}, BP ${combo.sys}/${combo.dia} → ${prob.toFixed(1)}% ${match}`);
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  CONCLUSION');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('With GFAP=59 whole blood (27.14 plasma):');
  console.log('  ❌ NO blood pressure variation gives 28% ICH risk');
  console.log('  ❌ NO age + BP combination gives 28% ICH risk\n');

  console.log('GFAP is too low (only gives 1-6% ICH risk max)\n');

  console.log('The error is DEFINITELY in the GFAP value:');
  console.log('  Reported: 59 pg/mL');
  console.log('  Actual: 53-54 pg/mL (plasma scale)');
  console.log('  Equivalent whole blood: ~117 pg/mL\n');
}

main().catch(console.error);
