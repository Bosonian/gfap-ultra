// Jest Configuration for iGFAP Stroke Triage Assistant
// Medical Software Testing Framework

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.{js,jsx}',
    '<rootDir>/src/**/__tests__/**/*.spec.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],

  // Module paths
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Module name mapping for imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds for medical software quality
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Critical medical modules require higher coverage
    './src/logic/validate.js': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './src/logic/lvo-local-model.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/auth/authentication.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.js',
    '!src/config.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/__tests__/**/*'
  ],

  // Test timeout for medical calculations
  testTimeout: 10000,

  // Verbose output for medical testing validation
  verbose: true,

  // Fail tests on console errors (important for medical software)
  errorOnDeprecated: true,

  // Global test setup
  globals: {
    'process.env.NODE_ENV': 'test'
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],

  // Watch mode configuration
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/'
  ]
};