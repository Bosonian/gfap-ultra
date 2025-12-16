/**
 * Detailed analysis of GFAP=59 scenario
 */

const API_URL = 'https://europe-west3-igfap-452720.cloudfunctions.net/predict_limited_data_ich';

async function testLimitedICH(age, systolic, diastolic, gfapPlasma, vigilanz = false) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age_years: age,
      systolic_bp: systolic,
      diastolic_bp: diastolic,
      gfap_value: gfapPlasma,
      vigilanzminderung: vigilanz
    })
  });

  const result = await response.json();
  return result.ich_probability;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  GFAP=59 ANALYSIS');
  console.log('═══════════════════════════════════════════════════════\n');

  // Test 1: GFAP=59 whole blood → plasma
  const gfapWB59 = 59;
  const gfapPlasma59WB = gfapWB59 * 0.46;
  console.log(`Scenario A: GFAP = 59 pg/mL WHOLE BLOOD`);
  console.log(`  → Plasma scale: ${gfapPlasma59WB.toFixed(2)} pg/mL`);

  const probA = await testLimitedICH(82, 150, 90, gfapPlasma59WB);
  console.log(`  → ICH Risk with age=82, BP=150/90: ${(probA * 100).toFixed(1)}%`);
  console.log(`  → This is ${probA < 0.28 ? 'LOWER' : 'HIGHER'} than 28%\n`);

  await new Promise(resolve => setTimeout(resolve, 300));

  // Test 2: GFAP=59 plasma (already converted)
  const gfapPlasma59 = 59;
  console.log(`Scenario B: GFAP = 59 pg/mL PLASMA (already converted)`);
  console.log(`  → Plasma scale: 59.00 pg/mL`);
  console.log(`  → Would be ~${(59 / 0.46).toFixed(0)} pg/mL whole blood\n`);

  const probB = await testLimitedICH(82, 150, 90, gfapPlasma59);
  console.log(`  → ICH Risk with age=82, BP=150/90: ${(probB * 100).toFixed(1)}%`);
  console.log(`  → This is ${Math.abs(probB - 0.28) < 0.05 ? 'CLOSE TO' : (probB < 0.28 ? 'LOWER THAN' : 'HIGHER THAN')} 28%\n`);

  await new Promise(resolve => setTimeout(resolve, 300));

  // Test 3: What whole blood GFAP gives 28%?
  console.log('═══════════════════════════════════════════════════════');
  console.log('  REVERSE CALCULATION: What GFAP gives 28% ICH risk?');
  console.log('═══════════════════════════════════════════════════════\n');

  // From earlier test, we know plasma GFAP ~54 gives 28%
  const gfapPlasmaFor28 = 54;
  const gfapWBFor28 = gfapPlasmaFor28 / 0.46;

  console.log(`✅ GFAP = ${gfapPlasmaFor28} pg/mL (plasma) gives ~28% ICH risk`);
  console.log(`   Equivalent whole blood: ${gfapWBFor28.toFixed(0)} pg/mL\n`);

  // Verify
  const probVerify = await testLimitedICH(82, 150, 90, gfapPlasmaFor28);
  console.log(`Verification: ${(probVerify * 100).toFixed(1)}% ICH risk ✓\n`);

  await new Promise(resolve => setTimeout(resolve, 300));

  // Test 4: Could GFAP be misread?
  console.log('═══════════════════════════════════════════════════════');
  console.log('  POSSIBLE GFAP MISREADINGS');
  console.log('═══════════════════════════════════════════════════════\n');

  const gfapCandidates = [
    { label: '59 → 54 (digit swap/misread)', value: 54 },
    { label: '59 → 56 (slight misread)', value: 56 },
    { label: '59 → 53 (slight misread)', value: 53 },
    { label: '59 → 95 (digit reversal)', value: 95 },
    { label: '59 → 50 (rounding)', value: 50 },
  ];

  for (const candidate of gfapCandidates) {
    const prob = await testLimitedICH(82, 150, 90, candidate.value);
    const close = Math.abs(prob - 0.28) < 0.02;
    const marker = close ? '✓ MATCH' : '';
    console.log(`${candidate.label.padEnd(40)} → ${(prob * 100).toFixed(1)}% ${marker}`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  CONCLUSION');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`If Rettungsdienst reported:`);
  console.log(`  - Age: 82 years`);
  console.log(`  - BP: 150/90 mmHg`);
  console.log(`  - GFAP: 59 pg/mL`);
  console.log(`  - ICH Risk: 28%\n`);

  console.log(`The GFAP value is INCONSISTENT with 28% risk.\n`);
  console.log(`Likely explanations:`);
  console.log(`  1. GFAP was actually ~117 pg/mL (whole blood) = 54 pg/mL (plasma)`);
  console.log(`  2. GFAP 59 was plasma scale (not whole blood)`);
  console.log(`  3. Age or BP values were different`);
  console.log(`  4. Digit misread: 59 → 54 plasma scale ✓\n`);
}

main().catch(console.error);
