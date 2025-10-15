/**
 * Strategy Pattern for Medical Prediction Algorithms
 * iGFAP Stroke Triage Assistant - Enterprise Architecture
 *
 * Provides pluggable prediction strategies for different medical scenarios
 */

import { predictComaIch, predictLimitedIch, predictFullStroke } from "../api/client.js";

import { medicalEventObserver, MEDICAL_EVENTS } from "./observer.js";

/**
 * Abstract base strategy for medical predictions
 */
class PredictionStrategy {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.requiredFields = [];
    this.optionalFields = [];
  }

  /**
   * Validate input data before prediction
   * @param {Object} inputData - Input data for prediction
   * @returns {Object} Validation result
   */
  validateInput(inputData) {
    const errors = [];
    const missingFields = [];

    // Check required fields
    this.requiredFields.forEach((field) => {
      if (!(field in inputData) || inputData[field] === null || inputData[field] === undefined) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(", ")}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      missingFields,
    };
  }

  /**
   * Preprocess input data for the specific strategy
   * @param {Object} inputData - Raw input data
   * @returns {Object} Processed input data
   */
  preprocessInput(inputData) {
    // Default implementation - can be overridden by specific strategies
    return { ...inputData };
  }

  /**
   * Execute the prediction strategy
   * @param {Object} inputData - Input data for prediction
   * @returns {Promise<Object>} Prediction result
   */
  async predict(inputData) {
    throw new Error("predict() method must be implemented by concrete strategy");
  }

  /**
   * Postprocess prediction results
   * @param {Object} rawResult - Raw prediction result
   * @param {Object} inputData - Original input data
   * @returns {Object} Processed result
   */
  postprocessResult(rawResult, inputData) {
    return {
      ...rawResult,
      strategy: this.name,
      timestamp: new Date().toISOString(),
      inputSummary: this.createInputSummary(inputData),
    };
  }

  /**
   * Create a summary of input data for audit trail
   * @param {Object} inputData - Input data
   * @returns {Object} Input summary (sanitized)
   */
  createInputSummary(inputData) {
    const summary = {};
    [...this.requiredFields, ...this.optionalFields].forEach((field) => {
      if (field in inputData) {
        summary[field] = typeof inputData[field];
      }
    });
    return summary;
  }
}

/**
 * Strategy for coma patients (GCS < 8)
 */
class ComaPredictionStrategy extends PredictionStrategy {
  constructor() {
    super("COMA_ICH", "ICH prediction for comatose patients");
    this.requiredFields = ["gfap"];
    this.optionalFields = ["age", "symptoms_duration"];
  }

  preprocessInput(inputData) {
    return {
      gfap: parseFloat(inputData.gfap),
      patientType: "comatose",
    };
  }

  async predict(inputData) {
    const validation = this.validateInput(inputData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const processedInput = this.preprocessInput(inputData);

    // Emit event for audit trail
    medicalEventObserver.publish(MEDICAL_EVENTS.ASSESSMENT_STARTED, {
      strategy: this.name,
      inputFields: Object.keys(processedInput),
    });

    try {
      const rawResult = await predictComaIch(processedInput);
      const result = this.postprocessResult(rawResult, inputData);

      // Emit completion event
      medicalEventObserver.publish(MEDICAL_EVENTS.RESULTS_GENERATED, {
        strategy: this.name,
        success: true,
        confidence: result.confidence,
      });

      return result;
    } catch (error) {
      medicalEventObserver.publish(MEDICAL_EVENTS.SECURITY_EVENT, {
        type: "prediction_error",
        strategy: this.name,
        error: error.message,
      });
      throw error;
    }
  }
}

/**
 * Strategy for limited data scenarios
 */
class LimitedDataPredictionStrategy extends PredictionStrategy {
  constructor() {
    super("LIMITED_DATA_ICH", "ICH prediction with limited clinical data");
    this.requiredFields = ["gfap", "age", "systolic_bp", "diastolic_bp"];
    this.optionalFields = ["weakness_sudden", "speech_sudden", "vigilanzminderung"];
  }

  preprocessInput(inputData) {
    return {
      gfap: parseFloat(inputData.gfap),
      age: parseInt(inputData.age, 10),
      systolic_bp: parseFloat(inputData.systolic_bp),
      diastolic_bp: parseFloat(inputData.diastolic_bp),
      weakness_sudden: inputData.weakness_sudden === true || inputData.weakness_sudden === "true",
      speech_sudden: inputData.speech_sudden === true || inputData.speech_sudden === "true",
      vigilanzminderung: inputData.vigilanzminderung === true || inputData.vigilanzminderung === "true",
    };
  }

  async predict(inputData) {
    const validation = this.validateInput(inputData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const processedInput = this.preprocessInput(inputData);

    medicalEventObserver.publish(MEDICAL_EVENTS.ASSESSMENT_STARTED, {
      strategy: this.name,
      inputFields: Object.keys(processedInput),
    });

    try {
      const rawResult = await predictLimitedIch(processedInput);
      const result = this.postprocessResult(rawResult, inputData);

      medicalEventObserver.publish(MEDICAL_EVENTS.RESULTS_GENERATED, {
        strategy: this.name,
        success: true,
        confidence: result.confidence,
      });

      return result;
    } catch (error) {
      medicalEventObserver.publish(MEDICAL_EVENTS.SECURITY_EVENT, {
        type: "prediction_error",
        strategy: this.name,
        error: error.message,
      });
      throw error;
    }
  }
}

/**
 * Strategy for comprehensive stroke assessment
 */
class FullStrokePredictionStrategy extends PredictionStrategy {
  constructor() {
    super("FULL_STROKE", "Comprehensive stroke prediction with full clinical data");
    this.requiredFields = [
      "gfap", "age", "systolic_bp", "diastolic_bp", "fast_ed_score",
      "sex", "facialtwitching", "armparese", "speechdeficit", "gaze", "agitation",
    ];
    this.optionalFields = ["strokeOnsetKnown", "medical_history"];
  }

  preprocessInput(inputData) {
    return {
      gfap: parseFloat(inputData.gfap),
      age: parseInt(inputData.age, 10),
      systolic_bp: parseFloat(inputData.systolic_bp),
      diastolic_bp: parseFloat(inputData.diastolic_bp),
      fast_ed_score: parseInt(inputData.fast_ed_score, 10),
      sex: inputData.sex === "male" ? 1 : 0,
      facialtwitching: inputData.facialtwitching === true || inputData.facialtwitching === "true",
      armparese: inputData.armparese === true || inputData.armparese === "true",
      speechdeficit: inputData.speechdeficit === true || inputData.speechdeficit === "true",
      gaze: inputData.gaze === true || inputData.gaze === "true",
      agitation: inputData.agitation === true || inputData.agitation === "true",
      strokeOnsetKnown: inputData.strokeOnsetKnown === true || inputData.strokeOnsetKnown === "true",
    };
  }

  async predict(inputData) {
    const validation = this.validateInput(inputData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const processedInput = this.preprocessInput(inputData);

    medicalEventObserver.publish(MEDICAL_EVENTS.ASSESSMENT_STARTED, {
      strategy: this.name,
      inputFields: Object.keys(processedInput),
    });

    try {
      const rawResult = await predictFullStroke(processedInput);
      const result = this.postprocessResult(rawResult, inputData);

      medicalEventObserver.publish(MEDICAL_EVENTS.RESULTS_GENERATED, {
        strategy: this.name,
        success: true,
        confidence: result.confidence,
      });

      return result;
    } catch (error) {
      medicalEventObserver.publish(MEDICAL_EVENTS.SECURITY_EVENT, {
        type: "prediction_error",
        strategy: this.name,
        error: error.message,
      });
      throw error;
    }
  }
}

/**
 * Context class for managing prediction strategies
 */
export class PredictionContext {
  constructor() {
    this.strategies = new Map();
    this.currentStrategy = null;
    this.predictionHistory = [];

    // Register default strategies
    this.registerStrategy(new ComaPredictionStrategy());
    this.registerStrategy(new LimitedDataPredictionStrategy());
    this.registerStrategy(new FullStrokePredictionStrategy());
  }

  /**
   * Register a new prediction strategy
   * @param {PredictionStrategy} strategy - Strategy to register
   */
  registerStrategy(strategy) {
    if (!(strategy instanceof PredictionStrategy)) {
      throw new Error("Strategy must extend PredictionStrategy");
    }
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * Set the current prediction strategy
   * @param {string} strategyName - Name of the strategy to use
   */
  setStrategy(strategyName) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      throw new Error(`Unknown strategy: ${strategyName}`);
    }
    this.currentStrategy = strategy;
  }

  /**
   * Execute prediction using the current strategy
   * @param {Object} inputData - Input data for prediction
   * @returns {Promise<Object>} Prediction result
   */
  async predict(inputData) {
    if (!this.currentStrategy) {
      throw new Error("No prediction strategy selected");
    }

    const startTime = performance.now();

    try {
      const result = await this.currentStrategy.predict(inputData);
      const duration = performance.now() - startTime;

      // Add to prediction history
      this.predictionHistory.push({
        strategy: this.currentStrategy.name,
        timestamp: new Date().toISOString(),
        duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.predictionHistory.push({
        strategy: this.currentStrategy.name,
        timestamp: new Date().toISOString(),
        duration,
        success: false,
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Get available strategies
   * @returns {Array} List of available strategies
   */
  getAvailableStrategies() {
    return Array.from(this.strategies.keys());
  }

  /**
   * Get strategy information
   * @param {string} strategyName - Name of the strategy
   * @returns {Object} Strategy information
   */
  getStrategyInfo(strategyName) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      return null;
    }

    return {
      name: strategy.name,
      description: strategy.description,
      requiredFields: strategy.requiredFields,
      optionalFields: strategy.optionalFields,
    };
  }

  /**
   * Get prediction history for audit
   * @returns {Array} Prediction history
   */
  getPredictionHistory() {
    return [...this.predictionHistory];
  }

  /**
   * Clear prediction history (privacy compliance)
   */
  clearHistory() {
    this.predictionHistory = [];
  }
}

// Export singleton instance
export const predictionContext = new PredictionContext();

// Export strategy types for external reference
export const PREDICTION_STRATEGIES = {
  COMA_ICH: "COMA_ICH",
  LIMITED_DATA_ICH: "LIMITED_DATA_ICH",
  FULL_STROKE: "FULL_STROKE",
};
