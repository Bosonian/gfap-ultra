/**
 * Test Builder Patterns for Medical Software Testing
 * iGFAP Stroke Triage Assistant - Advanced Testing Architecture
 *
 * Provides fluent builders for creating test data and scenarios
 */

import { MedicalValidationFactory } from '../../patterns/validation-factory.js';
import { PREDICTION_STRATEGIES } from '../../patterns/prediction-strategy.js';
import { GFAP_RANGES } from '../../config.js';

/**
 * Builder for creating medical patient test data
 */
export class PatientDataBuilder {
  constructor() {
    this.data = {};
    this.validationRules = {};
    this.expectations = {};
  }

  /**
   * Set patient age
   * @param {number} age - Patient age
   * @returns {PatientDataBuilder} Builder instance
   */
  withAge(age) {
    this.data.age_years = age;
    return this;
  }

  /**
   * Set patient as adult (18+ years)
   * @param {number} age - Adult age (default: 65)
   * @returns {PatientDataBuilder} Builder instance
   */
  asAdult(age = 65) {
    return this.withAge(age);
  }

  /**
   * Set patient as pediatric (< 18 years)
   * @param {number} age - Pediatric age (default: 16)
   * @returns {PatientDataBuilder} Builder instance
   */
  asPediatric(age = 16) {
    return this.withAge(age);
  }

  /**
   * Set GFAP biomarker level
   * @param {number} gfap - GFAP value in pg/mL
   * @returns {PatientDataBuilder} Builder instance
   */
  withGfap(gfap) {
    this.data.gfap_value = gfap;
    return this;
  }

  /**
   * Set normal GFAP level
   * @returns {PatientDataBuilder} Builder instance
   */
  withNormalGfap() {
    return this.withGfap(GFAP_RANGES.normal);
  }

  /**
   * Set elevated GFAP level
   * @returns {PatientDataBuilder} Builder instance
   */
  withElevatedGfap() {
    return this.withGfap(GFAP_RANGES.elevated);
  }

  /**
   * Set critical GFAP level
   * @returns {PatientDataBuilder} Builder instance
   */
  withCriticalGfap() {
    return this.withGfap(GFAP_RANGES.critical);
  }

  /**
   * Set extremely high GFAP level (triggers medical warning)
   * @returns {PatientDataBuilder} Builder instance
   */
  withExtremelyHighGfap() {
    return this.withGfap(6000);
  }

  /**
   * Set blood pressure values
   * @param {number} systolic - Systolic BP
   * @param {number} diastolic - Diastolic BP
   * @returns {PatientDataBuilder} Builder instance
   */
  withBloodPressure(systolic, diastolic) {
    this.data.systolic_bp = systolic;
    this.data.diastolic_bp = diastolic;
    return this;
  }

  /**
   * Set normal blood pressure
   * @returns {PatientDataBuilder} Builder instance
   */
  withNormalBloodPressure() {
    return this.withBloodPressure(120, 80);
  }

  /**
   * Set hypertensive blood pressure
   * @returns {PatientDataBuilder} Builder instance
   */
  withHypertension() {
    return this.withBloodPressure(160, 95);
  }

  /**
   * Set invalid blood pressure (systolic < diastolic)
   * @returns {PatientDataBuilder} Builder instance
   */
  withInvalidBloodPressure() {
    return this.withBloodPressure(120, 140);
  }

  /**
   * Set gender
   * @param {string} sex - Gender ('male' or 'female')
   * @returns {PatientDataBuilder} Builder instance
   */
  withGender(sex) {
    this.data.sex = sex;
    return this;
  }

  /**
   * Set as male patient
   * @returns {PatientDataBuilder} Builder instance
   */
  asMale() {
    return this.withGender('male');
  }

  /**
   * Set as female patient
   * @returns {PatientDataBuilder} Builder instance
   */
  asFemale() {
    return this.withGender('female');
  }

  /**
   * Set FAST-ED score
   * @param {number} score - FAST-ED score (0-9)
   * @returns {PatientDataBuilder} Builder instance
   */
  withFastEdScore(score) {
    this.data.fast_ed_score = score;
    return this;
  }

  /**
   * Set high FAST-ED score (suggests LVO)
   * @returns {PatientDataBuilder} Builder instance
   */
  withHighFastEdScore() {
    return this.withFastEdScore(6);
  }

  /**
   * Set neurological symptoms
   * @param {Object} symptoms - Symptom flags
   * @returns {PatientDataBuilder} Builder instance
   */
  withSymptoms(symptoms) {
    Object.assign(this.data, symptoms);
    return this;
  }

  /**
   * Set as stroke presentation
   * @returns {PatientDataBuilder} Builder instance
   */
  withStrokePresentation() {
    return this.withSymptoms({
      facialtwitching: false,
      armparese: true,
      speechdeficit: true,
      gaze: false,
      agitation: false,
      weakness_sudden: true,
      speech_sudden: true,
    });
  }

  /**
   * Set Glasgow Coma Scale
   * @param {number} gcs - GCS score (3-15)
   * @returns {PatientDataBuilder} Builder instance
   */
  withGcs(gcs) {
    this.data.gcs = gcs;
    return this;
  }

  /**
   * Set as comatose patient (GCS < 8)
   * @returns {PatientDataBuilder} Builder instance
   */
  asComatose() {
    return this.withGcs(6);
  }

  /**
   * Set validation expectations
   * @param {boolean} shouldBeValid - Whether data should be valid
   * @param {Array} expectedErrors - Expected validation error fields
   * @returns {PatientDataBuilder} Builder instance
   */
  expectValidation(shouldBeValid, expectedErrors = []) {
    this.expectations.shouldBeValid = shouldBeValid;
    this.expectations.expectedErrors = expectedErrors;
    return this;
  }

  /**
   * Expect validation to pass
   * @returns {PatientDataBuilder} Builder instance
   */
  shouldBeValid() {
    return this.expectValidation(true);
  }

  /**
   * Expect validation to fail
   * @param {Array} expectedErrorFields - Fields expected to have errors
   * @returns {PatientDataBuilder} Builder instance
   */
  shouldBeInvalid(expectedErrorFields = []) {
    return this.expectValidation(false, expectedErrorFields);
  }

  /**
   * Build the patient data object
   * @returns {Object} Patient data
   */
  build() {
    return {
      data: { ...this.data },
      expectations: { ...this.expectations },
    };
  }

  /**
   * Build for specific medical module
   * @param {string} moduleType - Module type ('coma', 'limited', 'full')
   * @returns {Object} Complete test case
   */
  buildForModule(moduleType) {
    const testCase = this.build();
    testCase.moduleType = moduleType;
    testCase.strategy = this.getStrategyForModule(moduleType);
    return testCase;
  }

  /**
   * Get prediction strategy for module type
   * @param {string} moduleType - Module type
   * @returns {string} Strategy name
   */
  getStrategyForModule(moduleType) {
    switch (moduleType) {
      case 'coma':
        return PREDICTION_STRATEGIES.COMA_ICH;
      case 'limited':
        return PREDICTION_STRATEGIES.LIMITED_DATA_ICH;
      case 'full':
        return PREDICTION_STRATEGIES.FULL_STROKE;
      default:
        throw new Error(`Unknown module type: ${moduleType}`);
    }
  }

  /**
   * Create a new builder instance
   * @returns {PatientDataBuilder} New builder
   */
  static create() {
    return new PatientDataBuilder();
  }

  /**
   * Create builder with valid adult stroke patient
   * @returns {PatientDataBuilder} Pre-configured builder
   */
  static validAdultStrokePatient() {
    return new PatientDataBuilder()
      .asAdult(72)
      .asMale()
      .withElevatedGfap()
      .withHypertension()
      .withStrokePresentation()
      .withFastEdScore(5)
      .shouldBeValid();
  }

  /**
   * Create builder with comatose patient
   * @returns {PatientDataBuilder} Pre-configured builder
   */
  static comatosePatient() {
    return new PatientDataBuilder()
      .asAdult(68)
      .withCriticalGfap()
      .asComatose()
      .shouldBeValid();
  }

  /**
   * Create builder with pediatric patient (should trigger warning)
   * @returns {PatientDataBuilder} Pre-configured builder
   */
  static pediatricPatient() {
    return new PatientDataBuilder()
      .asPediatric(16)
      .withNormalGfap()
      .withNormalBloodPressure()
      .shouldBeValid(); // Valid but with medical advisory
  }
}

/**
 * Builder for creating medical test scenarios
 */
export class MedicalTestScenarioBuilder {
  constructor() {
    this.scenarios = [];
    this.setup = null;
    this.teardown = null;
    this.name = '';
    this.description = '';
  }

  /**
   * Set scenario name and description
   * @param {string} name - Scenario name
   * @param {string} description - Scenario description
   * @returns {MedicalTestScenarioBuilder} Builder instance
   */
  named(name, description = '') {
    this.name = name;
    this.description = description;
    return this;
  }

  /**
   * Add setup function
   * @param {Function} setupFn - Setup function
   * @returns {MedicalTestScenarioBuilder} Builder instance
   */
  withSetup(setupFn) {
    this.setup = setupFn;
    return this;
  }

  /**
   * Add teardown function
   * @param {Function} teardownFn - Teardown function
   * @returns {MedicalTestScenarioBuilder} Builder instance
   */
  withTeardown(teardownFn) {
    this.teardown = teardownFn;
    return this;
  }

  /**
   * Add a test case to the scenario
   * @param {Object} testCase - Test case configuration
   * @returns {MedicalTestScenarioBuilder} Builder instance
   */
  addTestCase(testCase) {
    this.scenarios.push(testCase);
    return this;
  }

  /**
   * Add validation test case
   * @param {string} name - Test name
   * @param {Object} patientData - Patient data
   * @param {Object} expectations - Expected results
   * @returns {MedicalTestScenarioBuilder} Builder instance
   */
  addValidationTest(name, patientData, expectations) {
    return this.addTestCase({
      type: 'validation',
      name,
      patientData,
      expectations,
    });
  }

  /**
   * Add prediction test case
   * @param {string} name - Test name
   * @param {Object} patientData - Patient data
   * @param {string} strategy - Prediction strategy
   * @param {Object} expectations - Expected results
   * @returns {MedicalTestScenarioBuilder} Builder instance
   */
  addPredictionTest(name, patientData, strategy, expectations) {
    return this.addTestCase({
      type: 'prediction',
      name,
      patientData,
      strategy,
      expectations,
    });
  }

  /**
   * Build the complete test scenario
   * @returns {Object} Test scenario
   */
  build() {
    return {
      name: this.name,
      description: this.description,
      setup: this.setup,
      teardown: this.teardown,
      testCases: [...this.scenarios],
    };
  }

  /**
   * Create a new scenario builder
   * @returns {MedicalTestScenarioBuilder} New builder
   */
  static create() {
    return new MedicalTestScenarioBuilder();
  }

  /**
   * Create validation test scenario
   * @returns {MedicalTestScenarioBuilder} Pre-configured builder
   */
  static validationScenario() {
    return new MedicalTestScenarioBuilder()
      .named('Medical Validation Tests', 'Comprehensive validation testing for medical inputs');
  }

  /**
   * Create prediction test scenario
   * @returns {MedicalTestScenarioBuilder} Pre-configured builder
   */
  static predictionScenario() {
    return new MedicalTestScenarioBuilder()
      .named('Medical Prediction Tests', 'End-to-end prediction testing for medical modules');
  }
}

/**
 * Builder for creating mock medical services
 */
export class MockServiceBuilder {
  constructor() {
    this.mocks = new Map();
    this.behaviors = new Map();
  }

  /**
   * Mock a service with specific behavior
   * @param {string} serviceKey - Service key
   * @param {Object} mockImplementation - Mock implementation
   * @returns {MockServiceBuilder} Builder instance
   */
  mockService(serviceKey, mockImplementation) {
    this.mocks.set(serviceKey, mockImplementation);
    return this;
  }

  /**
   * Mock prediction API with specific responses
   * @param {Object} responses - Prediction responses by strategy
   * @returns {MockServiceBuilder} Builder instance
   */
  mockPredictionApi(responses) {
    const mockApi = {
      predictComaIch: jest.fn(),
      predictLimitedIch: jest.fn(),
      predictFullStroke: jest.fn(),
    };

    if (responses.coma) {
      mockApi.predictComaIch.mockResolvedValue(responses.coma);
    }
    if (responses.limited) {
      mockApi.predictLimitedIch.mockResolvedValue(responses.limited);
    }
    if (responses.full) {
      mockApi.predictFullStroke.mockResolvedValue(responses.full);
    }

    return this.mockService('medical.api.client', mockApi);
  }

  /**
   * Mock validation factory
   * @returns {MockServiceBuilder} Builder instance
   */
  mockValidationFactory() {
    const mockFactory = {
      createRule: jest.fn(),
      createModuleValidation: jest.fn(),
      validateModule: jest.fn(),
    };

    return this.mockService('medical.validation.factory', mockFactory);
  }

  /**
   * Mock event observer
   * @returns {MockServiceBuilder} Builder instance
   */
  mockEventObserver() {
    const mockObserver = {
      subscribe: jest.fn(() => jest.fn()), // Return unsubscribe function
      publish: jest.fn(),
      getEventHistory: jest.fn(() => []),
      clearAll: jest.fn(),
    };

    return this.mockService('medical.event.observer', mockObserver);
  }

  /**
   * Build all mocks
   * @returns {Map} Map of service mocks
   */
  build() {
    return new Map(this.mocks);
  }

  /**
   * Create a new mock builder
   * @returns {MockServiceBuilder} New builder
   */
  static create() {
    return new MockServiceBuilder();
  }

  /**
   * Create standard medical service mocks
   * @returns {MockServiceBuilder} Pre-configured builder
   */
  static standardMocks() {
    return new MockServiceBuilder()
      .mockEventObserver()
      .mockValidationFactory()
      .mockPredictionApi({
        coma: { ich_probability: 0.75, confidence: 0.85 },
        limited: { ich_probability: 0.65, lvo_probability: 0.25, confidence: 0.80 },
        full: { ich_probability: 0.70, lvo_probability: 0.30, confidence: 0.90 },
      });
  }
}

// Export pre-configured builders for common scenarios
export const CommonTestData = {
  validAdultPatient: () => PatientDataBuilder.validAdultStrokePatient().build(),
  comatosePatient: () => PatientDataBuilder.comatosePatient().build(),
  pediatricPatient: () => PatientDataBuilder.pediatricPatient().build(),
  invalidBloodPressure: () => PatientDataBuilder.create().withInvalidBloodPressure().shouldBeInvalid(['systolic_bp', 'diastolic_bp']).build(),
  extremelyHighGfap: () => PatientDataBuilder.create().withExtremelyHighGfap().shouldBeValid().build(),
};
