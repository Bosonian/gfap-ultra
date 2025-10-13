/**
 * Legacy ICH Model - Simple Logistic Regression (Age + GFAP Only)
 *
 * This is a baseline model for research comparison purposes.
 * Uses only age and GFAP values with logistic regression.
 *
 * Performance Metrics:
 * - ROC-AUC: 0.789
 * - Recall: 40%
 * - Precision: 86%
 * - F1-Score: 55%
 *
 * FOR RESEARCH COMPARISON ONLY - NOT FOR CLINICAL USE
 */

export class LegacyICHModel {
  // Training data parameters from original study
  static PARAMS = {
    age: {
      mean: 74.59,
      std: 12.75,
    },
    gfap: {
      mean: 665.23,
      std: 2203.77,
    },
    coefficients: {
      intercept: 0.3248,
      age: -0.2108, // Negative: older age slightly decreases odds in this simple model
      gfap: 3.1631, // Positive: higher GFAP significantly increases odds
    },
  };

  /**
   * Calculate ICH probability using legacy logistic regression model
   * @param {number} age - Patient age in years
   * @param {number} gfapValue - GFAP value in pg/ml
   * @returns {object} - Probability and diagnostic information
   */
  static calculateProbability(age, gfapValue) {
    // Input validation
    if (!age || !gfapValue || age <= 0 || gfapValue <= 0) {
      return {
        probability: 0,
        confidence: 0,
        isValid: false,
        reason: "Invalid inputs: age and GFAP required",
      };
    }

    // Validate ranges
    if (age < 18 || age > 120) {
      return {
        probability: 0,
        confidence: 0,
        isValid: false,
        reason: `Age ${age} outside valid range (18-120 years)`,
      };
    }

    if (gfapValue < 10 || gfapValue > 20000) {
      // (`GFAP ${gfapValue} outside typical range (10-20000 pg/ml)`);
    }

    try {
      // Step 1: Scale inputs using training data statistics
      const scaledAge = (age - this.PARAMS.age.mean) / this.PARAMS.age.std;
      const scaledGfap = (gfapValue - this.PARAMS.gfap.mean) / this.PARAMS.gfap.std;

      // Step 2: Calculate log-odds (logit)
      const logit =
        this.PARAMS.coefficients.intercept +
        this.PARAMS.coefficients.age * scaledAge +
        this.PARAMS.coefficients.gfap * scaledGfap;

      // Step 3: Convert to probability using sigmoid function
      const rawProbability = 1 / (1 + Math.exp(-logit));
      const probability = rawProbability * 100; // Convert to percentage

      // Step 4: Calculate confidence based on distance from decision boundary
      // Confidence is higher when probability is closer to 0% or 100%
      const confidence = Math.abs(rawProbability - 0.5) * 2; // 0 to 1 scale

      // Step 5: Determine risk category
      const riskCategory = this.getRiskCategory(probability);

      return {
        probability: Math.round(probability * 10) / 10, // Round to 1 decimal
        confidence: Math.round(confidence * 100) / 100, // Round to 2 decimals
        logit: Math.round(logit * 1000) / 1000, // Round to 3 decimals
        riskCategory,
        scaledInputs: {
          age: Math.round(scaledAge * 1000) / 1000,
          gfap: Math.round(scaledGfap * 1000) / 1000,
        },
        rawInputs: { age, gfap: gfapValue },
        isValid: true,
        calculationMethod: "logistic_regression_age_gfap",
      };
    } catch (error) {
      // ('Legacy model calculation error:', error);
      return {
        probability: 0,
        confidence: 0,
        isValid: false,
        reason: "Calculation error",
        error: error.message,
      };
    }
  }

  /**
   * Get risk category and color based on probability
   * @param {number} probability - Probability percentage (0-100)
   * @returns {object} - Risk level information
   */
  static getRiskCategory(probability) {
    if (probability < 10) {
      return {
        level: "very_low",
        color: "#10b981",
        label: "Very Low Risk",
        description: "Minimal ICH likelihood",
      };
    }
    if (probability < 25) {
      return {
        level: "low",
        color: "#84cc16",
        label: "Low Risk",
        description: "Below typical threshold",
      };
    }
    if (probability < 50) {
      return {
        level: "moderate",
        color: "#f59e0b",
        label: "Moderate Risk",
        description: "Elevated concern",
      };
    }
    if (probability < 75) {
      return {
        level: "high",
        color: "#f97316",
        label: "High Risk",
        description: "Significant likelihood",
      };
    }
    return {
      level: "very_high",
      color: "#dc2626",
      label: "Very High Risk",
      description: "Critical ICH probability",
    };
  }

  /**
   * Compare legacy model with main model results
   * @param {object} mainResults - Results from complex ML model
   * @param {object} legacyResults - Results from legacy model
   * @returns {object} - Comparison analysis
   */
  static compareModels(mainResults, legacyResults) {
    if (!mainResults || !legacyResults || !legacyResults.isValid) {
      return {
        isValid: false,
        reason: "Invalid model results for comparison",
      };
    }

    // Normalize probabilities to percentage scale (0-100)
    let mainProb = mainResults.probability || 0;
    if (mainProb <= 1) {
      mainProb *= 100; // Convert 0.65 to 65%
    }

    const legacyProb = legacyResults.probability || 0; // Already in percentage

    const absoluteDifference = mainProb - legacyProb;
    const relativeDifference = legacyProb > 0 ? (absoluteDifference / legacyProb) * 100 : 0;

    // Determine which model suggests higher risk
    const higherRiskModel =
      mainProb > legacyProb ? "main" : legacyProb > mainProb ? "legacy" : "equal";

    // Assess agreement level
    let agreement;
    const absDiff = Math.abs(absoluteDifference);
    if (absDiff < 5) {
      agreement = "strong";
    } else if (absDiff < 15) {
      agreement = "moderate";
    } else if (absDiff < 30) {
      agreement = "weak";
    } else {
      agreement = "poor";
    }

    return {
      isValid: true,
      probabilities: {
        main: Math.round(mainProb * 10) / 10,
        legacy: Math.round(legacyProb * 10) / 10,
      },
      differences: {
        absolute: Math.round(absoluteDifference * 10) / 10,
        relative: Math.round(relativeDifference * 10) / 10,
      },
      agreement: {
        level: agreement,
        higherRiskModel,
      },
      interpretation: this.getComparisonInterpretation(absoluteDifference, agreement),
    };
  }

  /**
   * Get interpretation of model comparison
   * @param {number} difference - Absolute difference between models
   * @param {string} agreement - Agreement level
   * @returns {object} - Interpretation for researchers
   */
  static getComparisonInterpretation(difference, agreement) {
    const absDiff = Math.abs(difference);

    if (agreement === "strong") {
      return {
        type: "concordant",
        message: "Models show strong agreement",
        implication: "Age and GFAP are primary risk factors",
      };
    }

    if (absDiff > 20) {
      return {
        type: "divergent",
        message: "Significant model disagreement",
        implication: "Complex model captures additional risk factors not in age/GFAP",
      };
    }

    return {
      type: "moderate_difference",
      message: "Models show moderate difference",
      implication: "Additional factors provide incremental predictive value",
    };
  }

  /**
   * Test the legacy model with known cases
   * @returns {object} - Test results for validation
   */
  static runValidationTests() {
    const testCases = [
      {
        age: 65,
        gfap: 100,
        expected: "low",
        description: "Younger patient, low GFAP",
      },
      {
        age: 75,
        gfap: 500,
        expected: "moderate",
        description: "Average age, moderate GFAP",
      },
      {
        age: 85,
        gfap: 1000,
        expected: "high",
        description: "Older patient, high GFAP",
      },
      {
        age: 70,
        gfap: 2000,
        expected: "very_high",
        description: "High GFAP dominates",
      },
      {
        age: 90,
        gfap: 50,
        expected: "very_low",
        description: "Low GFAP despite age",
      },
    ];

    const results = testCases.map(testCase => {
      const result = this.calculateProbability(testCase.age, testCase.gfap);
      return {
        ...testCase,
        result,
        passed: result.isValid && result.riskCategory.level === testCase.expected,
      };
    });

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;

    return {
      summary: {
        passed: passedTests,
        total: totalTests,
        passRate: Math.round((passedTests / totalTests) * 100),
      },
      details: results,
    };
  }

  /**
   * Get model metadata for research documentation
   * @returns {object} - Model information
   */
  static getModelMetadata() {
    return {
      name: "Legacy ICH Model",
      type: "Logistic Regression",
      version: "1.0.0",
      features: ["age", "gfap"],
      performance: {
        rocAuc: 0.789,
        recall: 0.4,
        precision: 0.86,
        f1Score: 0.55,
        specificity: 0.94,
      },
      trainingData: {
        samples: "Historical cohort",
        dateRange: "Research study period",
        validation: "Cross-validation",
      },
      limitations: [
        "Only uses age and GFAP - ignores clinical symptoms",
        "Lower recall (40%) - misses some ICH cases",
        "No time-to-onset consideration",
        "No blood pressure or medication factors",
        "Simplified feature set for baseline comparison",
      ],
      purpose: "Research baseline for evaluating complex model improvements",
    };
  }
}

/**
 * Utility function to safely calculate legacy model in existing app flow
 * @param {object} patientData - Existing patient data structure
 * @returns {object|null} - Legacy model results or null if not applicable
 */
export function calculateLegacyICH(patientData) {
  try {
    // Extract age and GFAP from various possible data structures
    const age = patientData?.age_years || patientData?.age || null;
    const gfap = patientData?.gfap_value || patientData?.gfap || null;

    if (!age || !gfap) {
      return null; // Silently fail if required data not available
    }

    return LegacyICHModel.calculateProbability(age, gfap);
  } catch (error) {
    // ('Legacy ICH calculation failed (non-critical):', error);
    return null;
  }
}

/**
 * Export test function for validation
 */
export function testLegacyModel() {
  // ('🧪 Legacy ICH Model Validation Tests');
  const testResults = LegacyICHModel.runValidationTests();

  // (`✅ Passed: ${testResults.summary.passed}/${testResults.summary.total} tests`);
  // (`📊 Pass Rate: ${testResults.summary.passRate}%`);

  testResults.details.forEach(test => {
    const icon = test.passed ? "✅" : "❌";
    // (`${icon} ${test.description}: ${test.result.probability.toFixed(1)}% (${test.result.riskCategory.level})`);
  });

  return testResults;
}
