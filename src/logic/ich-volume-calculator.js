/**
 * ICH Volume Calculation and Clinical Assessment
 * Based on validated log-log regression model (R² = 0.476)
 * Formula: log₁₀(Volume) = 0.0192 + 0.4533 × log₁₀(GFAP)
 */

// Volume-based risk thresholds with clinical significance
export const VOLUME_THRESHOLDS = {
  low: { max: 10, color: '#dc2626', label: 'Small', severity: 'low' },
  moderate: { min: 10, max: 20, color: '#dc2626', label: 'Moderate', severity: 'moderate' },
  high: { min: 20, max: 30, color: '#dc2626', label: 'Large', severity: 'high' },
  critical: { min: 30, color: '#dc2626', label: 'Critical', severity: 'critical' }
};

// 30-day mortality rates by hemorrhage volume (based on clinical literature)
// Calibrated to Broderick et al. (1993) landmark study:
// - 30ml = 19% mortality
// - 60ml = 91% mortality
// With correlation strengths from observational data
// Reference thresholds for documentation purposes:
export const MORTALITY_BY_VOLUME = {
  '<10ml': '5-10%',      // Minor hemorrhage
  '10-30ml': '10-19%',   // Small (Broderick: 30ml=19%)
  '30-50ml': '19-44%',   // Moderate (interpolated)
  '50-60ml': '44-91%',   // Large (Broderick: 60ml=91%)
  '≥60ml': '91-100%'     // Massive (Broderick: >60ml=91-100%)
};

/**
 * Calculate ICH volume from GFAP biomarker value
 * @param {number} gfapValue - GFAP value in pg/ml (0-10,000)
 * @returns {object} Volume calculation results
 */
export function calculateICHVolume(gfapValue) {
  // Handle edge cases
  if (!gfapValue || gfapValue <= 0) {
    return {
      volume: 0,
      volumeRange: { min: 0, max: 0 },
      riskLevel: 'low',
      mortalityRate: '~0%',
      isValid: true,
      calculation: 'No hemorrhage detected'
    };
  }
  
  // Cap extremely high GFAP values
  const cappedGfap = Math.min(gfapValue, 10000);
  if (gfapValue > 10000) {
    console.warn(`GFAP value ${gfapValue} exceeds expected range, capped at 10,000 pg/ml`);
  }
  
  try {
    // Apply log-log regression formula
    const logVolume = 0.0192 + 0.4533 * Math.log10(cappedGfap);
    const calculatedVolume = Math.pow(10, logVolume);
    
    // Calculate confidence range (±30%)
    const volumeRange = {
      min: calculatedVolume * 0.7,
      max: calculatedVolume * 1.3
    };
    
    // Determine risk level based on volume
    const riskLevel = getVolumeRiskLevel(calculatedVolume);
    
    // Get mortality rate
    const mortalityRate = getMortalityRate(calculatedVolume);
    
    // Format volume for display
    const displayVolume = calculatedVolume < 1 ? '<1' : calculatedVolume.toFixed(1);
    
    return {
      volume: calculatedVolume,
      displayVolume,
      volumeRange: {
        min: volumeRange.min.toFixed(1),
        max: volumeRange.max.toFixed(1)
      },
      riskLevel,
      mortalityRate,
      isValid: true,
      calculation: `Based on GFAP ${gfapValue} pg/ml`,
      threshold: calculatedVolume >= 30 ? 'SURGICAL' : calculatedVolume >= 20 ? 'HIGH_RISK' : 'MANAGEABLE'
    };
    
  } catch (error) {
    console.error('Volume calculation error:', error);
    return {
      volume: 0,
      volumeRange: { min: 0, max: 0 },
      riskLevel: 'low',
      mortalityRate: 'Unknown',
      isValid: false,
      calculation: 'Calculation error',
      error: error.message
    };
  }
}

/**
 * Determine risk level based on calculated volume
 * @param {number} volume - Calculated volume in ml
 * @returns {string} Risk level key
 */
function getVolumeRiskLevel(volume) {
  if (volume >= VOLUME_THRESHOLDS.critical.min) return 'critical';
  if (volume >= VOLUME_THRESHOLDS.high.min) return 'high';
  if (volume >= VOLUME_THRESHOLDS.moderate.min) return 'moderate';
  return 'low';
}

/**
 * Get mortality rate based on volume with improved interpolation
 * Calibrated to match clinical studies (Broderick 1993: 30ml=19%, 60ml=91%)
 * @param {number} volume - Volume in ml
 * @returns {string} Mortality rate string with citation
 */
function getMortalityRate(volume) {
  // For very small hemorrhages
  if (volume < 10) {
    return '5-10%⁴';
  }
  
  // For small hemorrhages (10-30ml)
  // Broderick: 30ml = 19% mortality
  if (volume < 30) {
    // Linear interpolation: 10ml=10%, 30ml=19%
    const rate = Math.round(10 + (volume - 10) * (19 - 10) / (30 - 10));
    return `${rate}%⁴`;
  }
  
  // For moderate hemorrhages (30-50ml)
  // Interpolating from Broderick 30ml=19% to 50ml≈44%
  if (volume < 50) {
    // Linear interpolation: 30ml=19%, 50ml=44%
    const rate = Math.round(19 + (volume - 30) * (44 - 19) / (50 - 30));
    return `${rate}%³`;
  }
  
  // For large hemorrhages (50-60ml)
  // Broderick: 60ml = 91% mortality
  if (volume < 60) {
    // Steeper increase: 50ml=44%, 60ml=91%
    const rate = Math.round(44 + (volume - 50) * (91 - 44) / (60 - 50));
    return `${rate}%²`;
  }
  
  // For massive hemorrhages (≥60ml)
  // Broderick: >60ml = 91-100%
  if (volume < 80) {
    // 60ml=91%, 80ml=96%
    const rate = Math.round(91 + (volume - 60) * (96 - 91) / (80 - 60));
    return `${rate}%¹`;
  }
  
  // For extreme cases (≥80ml)
  return '96-100%¹';
}

/**
 * Calculate hemorrhage size percentage for visualization
 * Based on brain area scaling: 30ml = ~40% of brain area, 100ml = ~70%
 * @param {number} volume - Volume in ml
 * @returns {number} Percentage of brain area (0-70)
 */
export function calculateHemorrhageSizePercent(volume) {
  if (volume <= 0) return 0;
  if (volume >= 100) return 70; // Maximum 70% of brain area
  
  // Non-linear scaling for realistic appearance
  // 30ml = 40%, 100ml = 70%
  const basePercent = Math.sqrt(volume / 30) * 40;
  return Math.min(basePercent, 70);
}

/**
 * Get color for volume visualization
 * @param {number} volume - Volume in ml
 * @returns {string} CSS color value
 */
export function getVolumeColor(volume) {
  const riskLevel = getVolumeRiskLevel(volume);
  return VOLUME_THRESHOLDS[riskLevel].color;
}

/**
 * Test function for validation
 * Tests the calculator with known GFAP values
 */
export function testVolumeCalculator() {
  const testCases = [
    { gfap: 100, expectedVolume: '~5ml' },
    { gfap: 500, expectedVolume: '~15ml' },
    { gfap: 1000, expectedVolume: '~21ml' },
    { gfap: 1500, expectedVolume: '~28ml' },
    { gfap: 3000, expectedVolume: '~50ml' },
    { gfap: 5000, expectedVolume: '~72ml' }
  ];
  
  console.log('🧪 ICH Volume Calculator Test Results:');
  testCases.forEach(test => {
    const result = calculateICHVolume(test.gfap);
    console.log(`GFAP ${test.gfap}: ${result.displayVolume}ml (${test.expectedVolume}) - ${result.riskLevel} risk - ${result.mortalityRate}`);
  });
}

/**
 * Format volume for display with appropriate precision
 * @param {number} volume - Volume in ml
 * @returns {string} Formatted volume string
 */
export function formatVolumeDisplay(volume) {
  if (volume < 1) return '<1 ml';
  if (volume < 10) return `${volume.toFixed(1)} ml`;
  return `${Math.round(volume)} ml`;
}