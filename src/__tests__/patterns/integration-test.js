/**
 * Integration Test Patterns for Medical Software
 * iGFAP Stroke Triage Assistant - Advanced Testing Architecture
 *
 * Provides comprehensive integration testing patterns for medical workflows
 */

import { MedicalValidationFactory } from '../../patterns/validation-factory.js';
import { predictionContext } from '../../patterns/prediction-strategy.js';
import { medicalCommandInvoker, SubmitFormCommand } from '../../patterns/command.js';
import { medicalEventObserver } from '../../patterns/observer.js';

import { PatientDataBuilder, MedicalTestScenarioBuilder, MockServiceBuilder } from './test-builders.js';

/**
 * Integration test harness for medical workflows
 */
export class MedicalIntegrationTestHarness {
  constructor() {
    this.setup = null;
    this.teardown = null;
    this.mocks = new Map();
    this.testData = new Map();
    this.assertions = [];
  }

  /**
   * Configure test environment setup
   * @param {Function} setupFn - Setup function
   * @returns {MedicalIntegrationTestHarness} Test harness
   */
  withSetup(setupFn) {
    this.setup = setupFn;
    return this;
  }

  /**
   * Configure test environment teardown
   * @param {Function} teardownFn - Teardown function
   * @returns {MedicalIntegrationTestHarness} Test harness
   */
  withTeardown(teardownFn) {
    this.teardown = teardownFn;
    return this;
  }

  /**
   * Add mock services for testing
   * @param {Map} mocks - Map of service mocks
   * @returns {MedicalIntegrationTestHarness} Test harness
   */
  withMocks(mocks) {
    mocks.forEach((mock, key) => {
      this.mocks.set(key, mock);
    });
    return this;
  }

  /**
   * Add test data
   * @param {string} key - Data key
   * @param {any} data - Test data
   * @returns {MedicalIntegrationTestHarness} Test harness
   */
  withTestData(key, data) {
    this.testData.set(key, data);
    return this;
  }

  /**
   * Add assertion to be checked after test execution
   * @param {Function} assertionFn - Assertion function
   * @returns {MedicalIntegrationTestHarness} Test harness
   */
  withAssertion(assertionFn) {
    this.assertions.push(assertionFn);
    return this;
  }

  /**
   * Execute the integration test
   * @param {Function} testFn - Test function to execute
   * @returns {Promise<Object>} Test results
   */
  async executeTest(testFn) {
    let testResult = null;
    let error = null;

    try {
      // Setup
      if (this.setup) {
        await this.setup();
      }

      // Apply mocks
      this.applyMocks();

      // Execute test
      testResult = await testFn(this.testData);

      // Run assertions
      this.runAssertions(testResult);

      return {
        success: true,
        result: testResult,
        error: null,
      };
    } catch (err) {
      error = err;
      return {
        success: false,
        result: testResult,
        error: err.message,
      };
    } finally {
      // Teardown
      try {
        if (this.teardown) {
          await this.teardown();
        }
        this.cleanupMocks();
      } catch (teardownError) {
        //('Teardown error:', teardownError);
      }
    }
  }

  /**
   * Apply all configured mocks
   */
  applyMocks() {
    this.mocks.forEach((mock, key) => {
      // Store original implementation for restoration
      const original = global[key] || window[key];
      if (original) {
        this.originalImplementations = this.originalImplementations || new Map();
        this.originalImplementations.set(key, original);
      }

      // Apply mock
      if (typeof global !== 'undefined') {
        global[key] = mock;
      }
      if (typeof window !== 'undefined') {
        window[key] = mock;
      }
    });
  }

  /**
   * Cleanup mocks and restore original implementations
   */
  cleanupMocks() {
    if (this.originalImplementations) {
      this.originalImplementations.forEach((original, key) => {
        if (typeof global !== 'undefined') {
          global[key] = original;
        }
        if (typeof window !== 'undefined') {
          window[key] = original;
        }
      });
    }

    // Clear Jest mocks
    this.mocks.forEach((mock) => {
      if (mock && typeof mock.mockClear === 'function') {
        mock.mockClear();
      }
    });
  }

  /**
   * Run all configured assertions
   * @param {any} testResult - Test result to assert against
   */
  runAssertions(testResult) {
    this.assertions.forEach((assertion, index) => {
      try {
        assertion(testResult);
      } catch (error) {
        throw new Error(`Assertion ${index + 1} failed: ${error.message}`);
      }
    });
  }

  /**
   * Create a new test harness
   * @returns {MedicalIntegrationTestHarness} New test harness
   */
  static create() {
    return new MedicalIntegrationTestHarness();
  }
}

/**
 * Test utilities for medical integration testing
 */
export class MedicalTestUtils {
  /**
   * Create a complete form submission test
   * @param {string} moduleType - Medical module type
   * @param {Object} patientData - Patient data
   * @param {Object} expectedResult - Expected prediction result
   * @returns {Function} Test function
   */
  static createFormSubmissionTest(moduleType, patientData, expectedResult) {
    return async () => {
      // Setup prediction context
      predictionContext.setStrategy(PatientDataBuilder.create().getStrategyForModule(moduleType));

      // Create and execute form submission command
      const command = new SubmitFormCommand(patientData, moduleType, predictionContext);
      const result = await medicalCommandInvoker.executeCommand(command);

      // Validate result structure
      expect(result).toHaveProperty('strategy');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('inputSummary');

      // Validate specific expectations
      if (expectedResult.ich_probability !== undefined) {
        expect(result.ich_probability).toBeCloseTo(expectedResult.ich_probability, 2);
      }
      if (expectedResult.confidence !== undefined) {
        expect(result.confidence).toBeGreaterThanOrEqual(expectedResult.confidence);
      }

      return result;
    };
  }

  /**
   * Create a validation test with medical checks
   * @param {string} moduleType - Medical module type
   * @param {Object} patientData - Patient data
   * @param {boolean} shouldBeValid - Whether data should be valid
   * @param {Array} expectedErrors - Expected error fields
   * @returns {Function} Test function
   */
  static createValidationTest(moduleType, patientData, shouldBeValid, expectedErrors = []) {
    return async () => {
      // Validate using factory pattern
      const result = MedicalValidationFactory.validateModule(patientData, moduleType.toUpperCase());

      // Check overall validity
      expect(result.isValid).toBe(shouldBeValid);

      // Check specific error fields
      if (!shouldBeValid) {
        expectedErrors.forEach((field) => {
          expect(result.validationErrors).toHaveProperty(field);
          expect(Array.isArray(result.validationErrors[field])).toBe(true);
          expect(result.validationErrors[field].length).toBeGreaterThan(0);
        });
      } else {
        expect(Object.keys(result.validationErrors)).toHaveLength(0);
      }

      return result;
    };
  }

  /**
   * Create an event-driven test
   * @param {string} eventType - Event type to test
   * @param {Function} triggerFn - Function that triggers the event
   * @param {Function} assertionFn - Function to assert event data
   * @returns {Function} Test function
   */
  static createEventTest(eventType, triggerFn, assertionFn) {
    return async () => {
      let eventReceived = false;
      let eventData = null;

      // Subscribe to event
      const unsubscribe = medicalEventObserver.subscribe(eventType, (event) => {
        eventReceived = true;
        eventData = event;
      });

      try {
        // Trigger the event
        await triggerFn();

        // Wait a bit for async events
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Assert event was received
        expect(eventReceived).toBe(true);
        expect(eventData).not.toBeNull();

        // Run custom assertions
        if (assertionFn) {
          assertionFn(eventData);
        }

        return eventData;
      } finally {
        unsubscribe();
      }
    };
  }

  /**
   * Create a performance test
   * @param {Function} testFn - Function to performance test
   * @param {number} maxDuration - Maximum allowed duration in ms
   * @returns {Function} Test function
   */
  static createPerformanceTest(testFn, maxDuration) {
    return async () => {
      const startTime = performance.now();

      const result = await testFn();

      const duration = performance.now() - startTime;

      expect(duration).toBeLessThanOrEqual(maxDuration);

      return {
        result,
        duration,
        maxDuration,
        passed: duration <= maxDuration,
      };
    };
  }

  /**
   * Create a memory leak test
   * @param {Function} testFn - Function to test for memory leaks
   * @param {number} iterations - Number of iterations to run
   * @returns {Function} Test function
   */
  static createMemoryLeakTest(testFn, iterations = 100) {
    return async () => {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const initialMemory = process.memoryUsage?.() || { heapUsed: 0 };

      // Run test multiple times
      for (let i = 0; i < iterations; i++) {
        await testFn();
      }

      // Force garbage collection again
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage?.() || { heapUsed: 0 };
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Allow for some memory increase, but not excessive
      const maxAllowedIncrease = 10 * 1024 * 1024; // 10MB
      expect(memoryIncrease).toBeLessThanOrEqual(maxAllowedIncrease);

      return {
        initialMemory: initialMemory.heapUsed,
        finalMemory: finalMemory.heapUsed,
        memoryIncrease,
        iterations,
        passed: memoryIncrease <= maxAllowedIncrease,
      };
    };
  }

  /**
   * Create a concurrent access test
   * @param {Function} testFn - Function to test concurrently
   * @param {number} concurrency - Number of concurrent executions
   * @returns {Function} Test function
   */
  static createConcurrencyTest(testFn, concurrency = 10) {
    return async () => {
      const promises = Array.from({ length: concurrency }, (_, index) => testFn(index).catch((error) => ({ error: error.message, index })));

      const results = await Promise.all(promises);

      // Check for errors
      const errors = results.filter((result) => result && result.error);
      expect(errors).toHaveLength(0);

      return {
        results,
        concurrency,
        errors,
        passed: errors.length === 0,
      };
    };
  }
}

/**
 * Pre-built integration test scenarios
 */
export class MedicalIntegrationScenarios {
  /**
   * Complete stroke triage workflow test
   * @returns {Object} Test scenario
   */
  static strokeTriageWorkflow() {
    return MedicalTestScenarioBuilder
      .create()
      .named('Complete Stroke Triage Workflow', 'End-to-end test of stroke triage process')
      .withSetup(async () => {
        // Setup clean state
        medicalCommandInvoker.clearHistory();
        medicalEventObserver.clearAll();
      })
      .addTestCase({
        name: 'Adult patient with stroke presentation',
        test: MedicalTestUtils.createFormSubmissionTest(
          'full',
          PatientDataBuilder.validAdultStrokePatient().build().data,
          { ich_probability: 0.6, confidence: 0.8 },
        ),
      })
      .addTestCase({
        name: 'Comatose patient assessment',
        test: MedicalTestUtils.createFormSubmissionTest(
          'coma',
          PatientDataBuilder.comatosePatient().build().data,
          { ich_probability: 0.7, confidence: 0.85 },
        ),
      })
      .addTestCase({
        name: 'Limited data assessment',
        test: MedicalTestUtils.createFormSubmissionTest(
          'limited',
          PatientDataBuilder.create()
            .asAdult(55)
            .withElevatedGfap()
            .withHypertension()
            .withStrokePresentation()
            .build().data,
          { ich_probability: 0.65, confidence: 0.75 },
        ),
      })
      .withTeardown(async () => {
        // Cleanup
        medicalCommandInvoker.clearHistory();
      })
      .build();
  }

  /**
   * Medical validation edge cases test
   * @returns {Object} Test scenario
   */
  static validationEdgeCases() {
    return MedicalTestScenarioBuilder
      .create()
      .named('Medical Validation Edge Cases', 'Test validation with edge cases and boundary values')
      .addTestCase({
        name: 'Pediatric patient warning',
        test: MedicalTestUtils.createValidationTest(
          'limited',
          PatientDataBuilder.pediatricPatient().build().data,
          true, // Valid but with warnings
          [],
        ),
      })
      .addTestCase({
        name: 'Invalid blood pressure',
        test: MedicalTestUtils.createValidationTest(
          'limited',
          PatientDataBuilder.create().withInvalidBloodPressure().build().data,
          false,
          ['systolic_bp', 'diastolic_bp'],
        ),
      })
      .addTestCase({
        name: 'Extremely high GFAP',
        test: MedicalTestUtils.createValidationTest(
          'limited',
          PatientDataBuilder.create().withExtremelyHighGfap().asAdult().withNormalBloodPressure()
            .build().data,
          true, // Valid but with medical warning
          [],
        ),
      })
      .build();
  }

  /**
   * Performance and reliability test
   * @returns {Object} Test scenario
   */
  static performanceAndReliability() {
    return MedicalTestScenarioBuilder
      .create()
      .named('Performance and Reliability', 'Test system performance and reliability under load')
      .addTestCase({
        name: 'Validation performance',
        test: MedicalTestUtils.createPerformanceTest(
          () => MedicalValidationFactory.validateModule(
            PatientDataBuilder.validAdultStrokePatient().build().data,
            'FULL',
          ),
          100, // Max 100ms
        ),
      })
      .addTestCase({
        name: 'Concurrent validation',
        test: MedicalTestUtils.createConcurrencyTest(
          () => MedicalValidationFactory.validateModule(
            PatientDataBuilder.validAdultStrokePatient().build().data,
            'LIMITED',
          ),
          20, // 20 concurrent validations
        ),
      })
      .addTestCase({
        name: 'Memory leak prevention',
        test: MedicalTestUtils.createMemoryLeakTest(
          () => {
            const { data } = PatientDataBuilder.create().asAdult().withNormalGfap().build();
            return MedicalValidationFactory.validateModule(data, 'LIMITED');
          },
          50, // 50 iterations
        ),
      })
      .build();
  }
}

// Export test execution helpers
export const runIntegrationScenario = async (scenario) => {
  const results = [];

  // Run setup
  if (scenario.setup) {
    await scenario.setup();
  }

  try {
    // Run all test cases
    for (const testCase of scenario.testCases) {
      try {
        const result = await testCase.test();
        results.push({
          name: testCase.name,
          success: true,
          result,
          error: null,
        });
      } catch (error) {
        results.push({
          name: testCase.name,
          success: false,
          result: null,
          error: error.message,
        });
      }
    }
  } finally {
    // Run teardown
    if (scenario.teardown) {
      await scenario.teardown();
    }
  }

  return {
    scenario: scenario.name,
    totalTests: scenario.testCases.length,
    passed: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
};
