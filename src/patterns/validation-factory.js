/**
 * Factory Pattern for Medical Validation Rules
 * iGFAP Stroke Triage Assistant - Enterprise Architecture
 *
 * Creates validation rules based on medical field types and requirements
 */

import { GFAP_RANGES } from "../config.js";

/**
 * Abstract base class for validation rules
 */
class ValidationRule {
  constructor(name, required = false) {
    this.name = name;
    this.required = required;
    this.validators = [];
    this.medicalChecks = [];
  }

  addValidator(validator) {
    this.validators.push(validator);
    return this;
  }

  addMedicalCheck(check) {
    this.medicalChecks.push(check);
    return this;
  }

  validate(value, formData = null) {
    const errors = [];

    // Check required field
    if (this.required && !value && value !== 0) {
      errors.push("This field is required");
    }

    // Run basic validators
    for (const validator of this.validators) {
      const error = validator(value);
      if (error) {
        errors.push(error);
      }
    }

    // Run medical checks
    for (const check of this.medicalChecks) {
      const medicalError = check(value, formData);
      if (medicalError) {
        errors.push(medicalError);
      }
    }

    return errors;
  }

  toConfig() {
    return {
      required: this.required,
      validate: (value, formData) => this.validate(value, formData),
    };
  }
}

/**
 * Specific validation rule types
 */
class NumericValidationRule extends ValidationRule {
  constructor(name, required = false, min = null, max = null) {
    super(name, required);
    this.min = min;
    this.max = max;
    this.type = "number";

    if (min !== null) {
      this.addValidator(value => {
        if (value !== "" && !isNaN(value) && parseFloat(value) < min) {
          return `Value must be at least ${min}`;
        }
        return null;
      });
    }

    if (max !== null) {
      this.addValidator(value => {
        if (value !== "" && !isNaN(value) && parseFloat(value) > max) {
          return `Value must be at most ${max}`;
        }
        return null;
      });
    }
  }

  toConfig() {
    return {
      ...super.toConfig(),
      min: this.min,
      max: this.max,
      type: this.type,
    };
  }
}

class BiomarkerValidationRule extends NumericValidationRule {
  constructor(name, biomarkerType, ranges) {
    super(name, true, ranges.min, ranges.max);
    this.biomarkerType = biomarkerType;
    this.ranges = ranges;

    // Add biomarker-specific medical checks
    this.addMedicalCheck(value => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return null;
      }

      if (biomarkerType === "GFAP" && numValue > ranges.critical) {
        return "Extremely high GFAP value - please verify lab result";
      }

      return null;
    });
  }
}

class VitalSignValidationRule extends NumericValidationRule {
  constructor(name, vitalType, min, max) {
    super(name, true, min, max);
    this.vitalType = vitalType;

    // Add vital sign medical checks
    this.addMedicalCheck((value, formData) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return null;
      }

      switch (vitalType) {
        case "SYSTOLIC_BP":
          if (formData?.diastolic_bp) {
            const diastolic = parseFloat(formData.diastolic_bp);
            if (!isNaN(diastolic) && numValue <= diastolic) {
              return "Systolic BP must be higher than diastolic BP";
            }
          }
          break;
        case "DIASTOLIC_BP":
          if (formData?.systolic_bp) {
            const systolic = parseFloat(formData.systolic_bp);
            if (!isNaN(systolic) && numValue >= systolic) {
              return "Diastolic BP must be lower than systolic BP";
            }
          }
          break;
      }

      return null;
    });
  }
}

class AgeValidationRule extends NumericValidationRule {
  constructor(name) {
    super(name, true, 0, 120);

    this.addMedicalCheck(value => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return null;
      }

      if (numValue < 18) {
        return "Emergency stroke assessment typically for adults (≥18 years)";
      }

      return null;
    });
  }
}

class ClinicalScaleValidationRule extends NumericValidationRule {
  constructor(name, scaleType, min, max) {
    super(name, true, min, max);
    this.scaleType = scaleType;

    this.addMedicalCheck(value => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return null;
      }

      switch (scaleType) {
        case "GCS":
          if (numValue < 8) {
            return "GCS < 8 indicates severe consciousness impairment - consider coma module";
          }
          break;
        case "FAST_ED":
          if (numValue >= 4) {
            return "High FAST-ED score suggests LVO - consider urgent intervention";
          }
          break;
      }

      return null;
    });
  }
}

/**
 * Factory for creating medical validation rules
 */
export class MedicalValidationFactory {
  static createRule(type, name, options = {}) {
    switch (type) {
      case "AGE":
        return new AgeValidationRule(name);

      case "BIOMARKER":
        if (options.biomarkerType === "GFAP") {
          return new BiomarkerValidationRule(name, "GFAP", GFAP_RANGES);
        }
        throw new Error(`Unsupported biomarker type: ${options.biomarkerType}`);

      case "VITAL_SIGN":
        return new VitalSignValidationRule(name, options.vitalType, options.min, options.max);

      case "CLINICAL_SCALE":
        return new ClinicalScaleValidationRule(name, options.scaleType, options.min, options.max);

      case "NUMERIC":
        return new NumericValidationRule(name, options.required, options.min, options.max);

      default:
        throw new Error(`Unsupported validation rule type: ${type}`);
    }
  }

  /**
   * Create a complete validation rule set for a medical module
   * @param {string} moduleType - Type of medical module
   * @returns {Object} Complete validation rule configuration
   */
  static createModuleValidation(moduleType) {
    const rules = {};

    switch (moduleType) {
      case "LIMITED":
        rules.age_years = this.createRule("AGE", "age_years").toConfig();
        rules.systolic_bp = this.createRule("VITAL_SIGN", "systolic_bp", {
          vitalType: "SYSTOLIC_BP",
          min: 60,
          max: 300,
        }).toConfig();
        rules.diastolic_bp = this.createRule("VITAL_SIGN", "diastolic_bp", {
          vitalType: "DIASTOLIC_BP",
          min: 30,
          max: 200,
        }).toConfig();
        rules.gfap_value = this.createRule("BIOMARKER", "gfap_value", {
          biomarkerType: "GFAP",
        }).toConfig();
        break;

      case "FULL":
        // Include all limited module rules
        Object.assign(rules, this.createModuleValidation("LIMITED"));

        // Add additional full module rules
        rules.fast_ed_score = this.createRule("CLINICAL_SCALE", "fast_ed_score", {
          scaleType: "FAST_ED",
          min: 0,
          max: 9,
        }).toConfig();
        break;

      case "COMA":
        rules.gfap_value = this.createRule("BIOMARKER", "gfap_value", {
          biomarkerType: "GFAP",
        }).toConfig();
        rules.gcs = this.createRule("CLINICAL_SCALE", "gcs", {
          scaleType: "GCS",
          min: 3,
          max: 15,
        }).toConfig();
        break;

      default:
        throw new Error(`Unsupported module type: ${moduleType}`);
    }

    return rules;
  }

  /**
   * Validate form data using factory-created rules
   * @param {Object} formData - Form data to validate
   * @param {string} moduleType - Type of medical module
   * @returns {Object} Validation result
   */
  static validateModule(formData, moduleType) {
    const rules = this.createModuleValidation(moduleType);
    const validationErrors = {};
    let isValid = true;

    Object.entries(rules).forEach(([fieldName, rule]) => {
      const value = formData[fieldName];
      const errors = rule.validate(value, formData);

      if (errors.length > 0) {
        validationErrors[fieldName] = errors;
        isValid = false;
      }
    });

    return { isValid, validationErrors };
  }
}

// Export validation rule types for external use
export const VALIDATION_RULE_TYPES = {
  AGE: "AGE",
  BIOMARKER: "BIOMARKER",
  VITAL_SIGN: "VITAL_SIGN",
  CLINICAL_SCALE: "CLINICAL_SCALE",
  NUMERIC: "NUMERIC",
};

export const BIOMARKER_TYPES = {
  GFAP: "GFAP",
};

export const VITAL_SIGN_TYPES = {
  SYSTOLIC_BP: "SYSTOLIC_BP",
  DIASTOLIC_BP: "DIASTOLIC_BP",
};

export const CLINICAL_SCALE_TYPES = {
  GCS: "GCS",
  FAST_ED: "FAST_ED",
};
