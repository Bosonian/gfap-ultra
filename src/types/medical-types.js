/**
 * Medical Type Definitions for iGFAP Stroke Triage Assistant
 * Provides comprehensive type safety for medical calculations and data
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

/**
 * @typedef {Object} PatientData
 * @property {number} age - Patient age in years (0-120)
 * @property {string} gender - Patient gender ('male' | 'female' | 'other')
 * @property {number} gfap - GFAP biomarker level in pg/mL (29-10001)
 * @property {number} [nihss] - NIHSS score (0-42)
 * @property {number} [gcs] - Glasgow Coma Scale (3-15)
 * @property {boolean} [hypertension] - History of hypertension
 * @property {boolean} [diabetes] - History of diabetes
 * @property {boolean} [smoking] - Smoking status
 * @property {number} [sbp] - Systolic blood pressure (mmHg)
 * @property {number} [dbp] - Diastolic blood pressure (mmHg)
 */

/**
 * @typedef {Object} ICHRiskResult
 * @property {number} probability - ICH risk probability (0-1)
 * @property {number} percentage - ICH risk percentage (0-100)
 * @property {'low'|'moderate'|'high'|'critical'} riskLevel - Risk classification
 * @property {string} module - Module used for calculation
 * @property {string} timestamp - ISO timestamp of calculation
 */

/**
 * @typedef {Object} ICHVolumeResult
 * @property {number} volume - Predicted volume in mL
 * @property {number} confidence - Confidence level (0-1)
 * @property {'small'|'moderate'|'large'|'massive'} volumeCategory - Volume classification
 * @property {string} timestamp - ISO timestamp of calculation
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the data is valid
 * @property {string[]} errors - Array of validation error messages
 * @property {string[]} warnings - Array of validation warnings
 */

/**
 * @typedef {Object} PredictionRequest
 * @property {PatientData} data - Patient data for prediction
 * @property {string} module - Module type ('coma'|'limited'|'full')
 * @property {string} timestamp - ISO timestamp of request
 * @property {string} sessionId - Session identifier
 */

/**
 * @typedef {Object} PredictionResponse
 * @property {boolean} success - Whether prediction was successful
 * @property {ICHRiskResult} [ichRisk] - ICH risk prediction result
 * @property {ICHVolumeResult} [ichVolume] - ICH volume prediction result
 * @property {string} [error] - Error message if prediction failed
 * @property {number} processingTime - Time taken for prediction (ms)
 */

/**
 * @typedef {Object} QualityMetric
 * @property {string} name - Metric name
 * @property {'count'|'duration'|'percentage'|'average'} type - Metric type
 * @property {number} value - Metric value
 * @property {string} timestamp - ISO timestamp
 * @property {Object} [metadata] - Additional metric metadata
 */

/**
 * @typedef {Object} AuditEvent
 * @property {string} eventType - Type of event ('data_entry'|'prediction'|'error')
 * @property {string} timestamp - ISO timestamp
 * @property {string} userId - User identifier
 * @property {Object} data - Event-specific data
 * @property {string} [sessionId] - Session identifier
 */

/**
 * @typedef {Object} SessionInfo
 * @property {string} sessionId - Unique session identifier
 * @property {string} userId - User identifier
 * @property {number} startTime - Session start timestamp
 * @property {number} lastActivity - Last activity timestamp
 * @property {boolean} isValid - Whether session is still valid
 */

/**
 * @typedef {Object} AppStatus
 * @property {boolean} isInitialized - Whether app is initialized
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {string} currentScreen - Current screen name
 * @property {Object} features - Feature availability status
 * @property {string} version - Application version
 */

/**
 * @typedef {Object} ErrorContext
 * @property {string} operation - Operation being performed
 * @property {string} [component] - Component where error occurred
 * @property {Object} [metadata] - Additional error metadata
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} SafeOperationOptions
 * @property {'AUTHENTICATION'|'NETWORK'|'MEDICAL'|'STORAGE'|'RENDERING'} category - Error category
 * @property {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} severity - Error severity
 * @property {number} [timeout] - Operation timeout in milliseconds
 * @property {number} [retries] - Number of retry attempts
 * @property {ErrorContext} context - Error context information
 */

/**
 * Type validation functions
 */

/**
 * Validates patient data structure and ranges
 * @param {any} data - Data to validate
 * @returns {ValidationResult} Validation result
 */
export function validatePatientData(data) {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== "object") {
    errors.push("Patient data must be an object");
    return { isValid: false, errors, warnings };
  }

  // Required fields validation
  if (typeof data.age !== "number" || data.age < 0 || data.age > 120) {
    errors.push("Age must be a number between 0 and 120");
  }

  if (!["male", "female", "other"].includes(data.gender)) {
    errors.push("Gender must be \"male\", \"female\", or \"other\"");
  }

  if (typeof data.gfap !== "number" || data.gfap < 29 || data.gfap > 10001) {
    errors.push("GFAP must be a number between 29 and 10001 pg/mL");
  }

  // Optional fields validation
  if (data.nihss !== undefined && (typeof data.nihss !== "number" || data.nihss < 0 || data.nihss > 42)) {
    errors.push("NIHSS must be a number between 0 and 42");
  }

  if (data.gcs !== undefined && (typeof data.gcs !== "number" || data.gcs < 3 || data.gcs > 15)) {
    errors.push("GCS must be a number between 3 and 15");
  }

  if (data.sbp !== undefined && (typeof data.sbp !== "number" || data.sbp < 50 || data.sbp > 300)) {
    warnings.push("Systolic BP should typically be between 50-300 mmHg");
  }

  if (data.dbp !== undefined && (typeof data.dbp !== "number" || data.dbp < 30 || data.dbp > 200)) {
    warnings.push("Diastolic BP should typically be between 30-200 mmHg");
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validates ICH risk result
 * @param {any} result - Result to validate
 * @returns {ValidationResult} Validation result
 */
export function validateICHRiskResult(result) {
  const errors = [];
  const warnings = [];

  if (!result || typeof result !== "object") {
    errors.push("ICH risk result must be an object");
    return { isValid: false, errors, warnings };
  }

  if (typeof result.probability !== "number" || result.probability < 0 || result.probability > 1) {
    errors.push("Probability must be a number between 0 and 1");
  }

  if (typeof result.percentage !== "number" || result.percentage < 0 || result.percentage > 100) {
    errors.push("Percentage must be a number between 0 and 100");
  }

  if (!["low", "moderate", "high", "critical"].includes(result.riskLevel)) {
    errors.push("Risk level must be \"low\", \"moderate\", \"high\", or \"critical\"");
  }

  if (!result.timestamp || !Date.parse(result.timestamp)) {
    errors.push("Timestamp must be a valid ISO date string");
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Type guard functions
 */

/**
 * Checks if value is valid patient data
 * @param {any} value - Value to check
 * @returns {value is PatientData} Type guard result
 */
export function isPatientData(value) {
  const validation = validatePatientData(value);
  return validation.isValid;
}

/**
 * Checks if value is valid ICH risk result
 * @param {any} value - Value to check
 * @returns {value is ICHRiskResult} Type guard result
 */
export function isICHRiskResult(value) {
  const validation = validateICHRiskResult(value);
  return validation.isValid;
}

/**
 * Medical calculation constants with type safety
 */
export const MEDICAL_CONSTANTS = {
  /** @type {[number, number]} Age range */
  AGE_RANGE: [0, 120],

  /** @type {[number, number]} GFAP range in pg/mL */
  GFAP_RANGE: [29, 10001],

  /** @type {[number, number]} NIHSS range */
  NIHSS_RANGE: [0, 42],

  /** @type {[number, number]} GCS range */
  GCS_RANGE: [3, 15],

  /** @type {Object.<string, number>} Risk thresholds */
  RISK_THRESHOLDS: {
    LOW: 0.25,
    MODERATE: 0.50,
    HIGH: 0.70,
    CRITICAL: 0.85,
  },

  /** @type {Object.<string, number>} Volume thresholds in mL */
  VOLUME_THRESHOLDS: {
    SMALL: 10,
    MODERATE: 30,
    LARGE: 60,
    MASSIVE: 100,
  },
};

/**
 * Runtime type checking utility
 */
export class TypeChecker {
  /**
   * Ensures value matches expected type with detailed error
   * @param {any} value - Value to check
   * @param {string} expectedType - Expected type description
   * @param {string} fieldName - Field name for error messages
   * @throws {TypeError} If type check fails
   */
  static ensureType(value, expectedType, fieldName) {
    let isValid = false;
    let actualType = typeof value;

    switch (expectedType) {
    case "PatientData":
      isValid = isPatientData(value);
      actualType = "Invalid PatientData";
      break;
    case "ICHRiskResult":
      isValid = isICHRiskResult(value);
      actualType = "Invalid ICHRiskResult";
      break;
    case "number":
      isValid = typeof value === "number" && !isNaN(value);
      break;
    case "string":
      isValid = typeof value === "string";
      break;
    case "boolean":
      isValid = typeof value === "boolean";
      break;
    default:
      isValid = typeof value === expectedType;
    }

    if (!isValid) {
      throw new TypeError(
        `Type error in ${fieldName}: expected ${expectedType}, got ${actualType}. `
        + "This is a critical error in medical calculations.",
      );
    }
  }

  /**
   * Validates number is within range
   * @param {number} value - Value to check
   * @param {[number, number]} range - [min, max] range
   * @param {string} fieldName - Field name for error messages
   * @throws {RangeError} If value is out of range
   */
  static ensureRange(value, range, fieldName) {
    this.ensureType(value, "number", fieldName);
    const [min, max] = range;

    if (value < min || value > max) {
      throw new RangeError(
        `Range error in ${fieldName}: value ${value} must be between ${min} and ${max}. `
        + "This is a critical error in medical calculations.",
      );
    }
  }
}
