// User-friendly label formatter for technical field names
// Converts technical driver and field names to user-friendly labels

import { t } from '../localization/i18n.js';

/**
 * Mapping of technical field names to the same labels used in input forms
 * Uses existing localization keys from the input forms
 */
const FIELD_LABEL_MAP = {
  // Age and demographics
  age_years: 'ageLabel',
  age: 'ageLabel',

  // Blood pressure
  systolic_bp: 'systolicLabel',
  diastolic_bp: 'diastolicLabel',
  systolic_blood_pressure: 'systolicLabel',
  diastolic_blood_pressure: 'diastolicLabel',
  blood_pressure_systolic: 'systolicLabel',
  blood_pressure_diastolic: 'diastolicLabel',

  // Biomarkers
  gfap_value: 'gfapLabel',
  gfap: 'gfapLabel',
  gfap_level: 'gfapLabel',

  // Clinical scores
  fast_ed_score: 'fastEdLabel',
  fast_ed: 'fastEdLabel',
  fast_ed_total: 'fastEdLabel',

  // Neurological symptoms
  vigilanzminderung: 'vigilanzLabel',
  vigilance_reduction: 'vigilanzLabel',
  reduced_consciousness: 'vigilanzLabel',
  armparese: 'armPareseLabel',
  arm_paresis: 'armPareseLabel',
  arm_weakness: 'armPareseLabel',
  beinparese: 'beinPareseLabel',
  leg_paresis: 'beinPareseLabel',
  leg_weakness: 'beinPareseLabel',
  eye_deviation: 'eyeDeviationLabel',
  blickdeviation: 'eyeDeviationLabel',
  headache: 'headacheLabel',
  kopfschmerzen: 'headacheLabel',

  // Medical history
  atrial_fibrillation: 'atrialFibLabel',
  vorhofflimmern: 'atrialFibLabel',
  anticoagulated_noak: 'anticoagLabel',
  anticoagulation: 'anticoagLabel',
  antiplatelets: 'antiplateletsLabel',
  thrombozytenaggregationshemmer: 'antiplateletsLabel',
};

/**
 * Fallback patterns for common technical terms
 * Used when no specific mapping exists
 */
const PATTERN_REPLACEMENTS = [
  { pattern: /_score$/, replacement: ' Score' },
  { pattern: /_value$/, replacement: ' Level' },
  { pattern: /_bp$/, replacement: ' Blood Pressure' },
  { pattern: /_years?$/, replacement: ' (years)' },
  { pattern: /^ich_/, replacement: 'Brain Bleeding ' },
  { pattern: /^lvo_/, replacement: 'Large Vessel ' },
  { pattern: /parese$/, replacement: 'Weakness' },
  { pattern: /deviation$/, replacement: 'Movement' },
];

/**
 * Format a technical field name using the same labels as input forms
 * @param {string} fieldName - Technical field name (e.g., 'fast_ed_score')
 * @returns {string} - Consistent medical terminology label
 */
export function formatDriverName(fieldName) {
  if (!fieldName) {
    return '';
  }

  // First, try to find exact match in mapping to input form labels
  const mappedKey = FIELD_LABEL_MAP[fieldName.toLowerCase()];
  if (mappedKey) {
    const translated = t(mappedKey);
    if (translated && translated !== mappedKey) {
      return translated;
    }
  }

  // Apply pattern-based replacements for common medical terms
  let formatted = fieldName.toLowerCase();
  PATTERN_REPLACEMENTS.forEach(({ pattern, replacement }) => {
    formatted = formatted.replace(pattern, replacement);
  });

  // Clean up and format - keep medical terminology consistent
  formatted = formatted
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()) // Title case
    .trim();

  return formatted;
}

/**
 * Format field names for input summary display
 * @param {string} fieldName - Technical field name
 * @returns {string} - User-friendly label for summary
 */
export function formatSummaryLabel(fieldName) {
  // Use the same logic but with specific summary context
  const friendlyLabel = formatDriverName(fieldName);

  // Remove units from summary labels as they're shown in values
  return friendlyLabel
    .replace(/\s*\([^)]*\)\s*/g, '') // Remove anything in parentheses
    .trim();
}

/**
 * Format field values for display
 * @param {any} value - Field value
 * @param {string} fieldName - Field name for context
 * @returns {string} - Formatted display value
 */
export function formatDisplayValue(value, fieldName = '') {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }

  if (typeof value === 'number') {
    // Add units based on field type
    if (fieldName.includes('bp') || fieldName.includes('blood_pressure')) {
      return `${value} mmHg`;
    }
    if (fieldName.includes('gfap')) {
      return `${value} pg/mL`;
    }
    if (fieldName.includes('age')) {
      return `${value} years`;
    }
    if (fieldName.includes('score')) {
      return value.toString();
    }

    // Default number formatting
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }

  return value.toString();
}

/**
 * Get a short description for a clinical field
 * @param {string} fieldName - Technical field name
 * @returns {string} - Brief description
 */
export function getFieldDescription(fieldName) {
  const descriptions = {
    fast_ed_score: 'Stroke severity assessment',
    gfap_value: 'Brain injury biomarker',
    vigilanzminderung: 'Level of consciousness',
    systolic_bp: 'Upper blood pressure reading',
    diastolic_bp: 'Lower blood pressure reading',
    atrial_fibrillation: 'Irregular heart rhythm',
    anticoagulated_noak: 'Blood-thinning medication',
    antiplatelets: 'Anti-clotting medication',
  };

  return descriptions[fieldName.toLowerCase()] || '';
}
