// Jest Setup for Medical Software Testing
// iGFAP Stroke Triage Assistant Test Environment

import "@testing-library/jest-dom";

// Mock crypto.subtle for testing environment
global.crypto = {
  subtle: {
    digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
  },
  getRandomValues: jest.fn().mockImplementation((array) => {
    // Return predictable values for testing
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
};

// Mock Web APIs not available in Node.js
global.fetch = jest.fn();
// Create proper mocks with jest functions
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.sessionStorage = sessionStorageMock;
global.localStorage = localStorageMock;

// Mock DOM methods
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn();

// Enhanced performance mock with medical-grade monitoring capabilities
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  timing: {
    navigationStart: Date.now(),
  },
};

// Mock navigator
global.navigator = {
  userAgent: "Jest Test Environment",
  platform: "Test",
  language: "en",
  onLine: true,
};

// Mock window methods
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, "matchMedia", {
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  writable: true,
});

// Setup medical testing constants
global.MEDICAL_TEST_DATA = {
  VALID_GFAP_VALUES: [29, 50, 100, 500, 1000, 5000, 10001],
  INVALID_GFAP_VALUES: [-1, 0, 28, 10002, null, undefined, ""],
  VALID_AGE_VALUES: [18, 25, 45, 65, 85, 100],
  INVALID_AGE_VALUES: [-1, 0, 17, 101, null, undefined, ""],
  VALID_BP_VALUES: {
    systolic: [90, 120, 140, 160, 180, 200],
    diastolic: [60, 80, 90, 100, 110, 120],
  },
  SAMPLE_PATIENT_DATA: {
    coma: {
      gfap: 150.5,
      valid: true,
    },
    limited: {
      age: 65,
      systolic_bp: 160,
      diastolic_bp: 95,
      gfap: 250.0,
      weakness_sudden: true,
      speech_sudden: false,
      valid: true,
    },
    full: {
      age: 72,
      sex: "male",
      systolic_bp: 170,
      diastolic_bp: 100,
      gfap: 400.0,
      facialtwitching: false,
      armparese: true,
      speechdeficit: true,
      gaze: false,
      agitation: false,
      strokeOnsetKnown: true,
      valid: true,
    },
  },
};

/**
// Console error suppression for expected errors in tests
const originalError = //;
beforeAll(() => {
  // = (...args) => {
    if (
      typeof args[0] === 'string'
      && args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  // = originalError;
});
*/

beforeEach(() => {
  global.crypto = {
    subtle: {
      digest: jest.fn().mockImplementation(async (algorithm) => {
        // Mock SHA-256 hash for testing
        if (algorithm === "SHA-256") {
          const encoder = new TextEncoder();
          const testData = encoder.encode("test-hash");
          return testData.buffer;
        }
        throw new Error("Unsupported algorithm");
      }),
    },
    getRandomValues: jest.fn().mockImplementation((array) => {
      // Return predictable values for testing
      for (let i = 0; i < array.length; i += 1) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),
  };

  global.fetch = jest.fn();

  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  global.sessionStorage = sessionStorageMock;

  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  global.localStorage = localStorageMock;

  global.alert = jest.fn();
  global.confirm = jest.fn(() => true);
  global.prompt = jest.fn();

  global.performance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    timing: {
      navigationStart: Date.now(),
    },
  };

  Object.defineProperty(window, "scrollTo", {
    value: jest.fn(),
    writable: true,
  });

  Object.defineProperty(window, "matchMedia", {
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
    writable: true,
  });
});

// Custom matchers for medical testing
expect.extend({
  toBeValidMedicalValue(received, type) {
    let pass = false;
    let message = "";

    switch (type) {
    case "gfap":
      pass = typeof received === "number" && received >= 29 && received <= 10001;
      message = pass
        ? `Expected ${received} not to be a valid GFAP value`
        : `Expected ${received} to be a valid GFAP value (29-10001 pg/mL)`;
      break;
    case "age":
      pass = typeof received === "number" && received >= 18 && received <= 100;
      message = pass
        ? `Expected ${received} not to be a valid age`
        : `Expected ${received} to be a valid age (18-100 years)`;
      break;
    case "bloodPressure":
      pass = typeof received === "number" && received >= 50 && received <= 250;
      message = pass
        ? `Expected ${received} not to be a valid blood pressure`
        : `Expected ${received} to be a valid blood pressure (50-250 mmHg)`;
      break;
    default:
      throw new Error(`Unknown medical value type: ${type}`);
    }

    return {
      message: () => message,
      pass,
    };
  },
});
