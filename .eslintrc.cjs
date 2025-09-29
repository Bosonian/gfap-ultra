// ESLint Configuration for Medical Software Development
// iGFAP Stroke Triage Assistant - Research Preview
// Follows medical device software standards for quality and safety

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base'
  ],
  plugins: [
    'security'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Medical software specific rules for safety and reliability
    'max-lines-per-function': ['error', 50],
    'max-depth': ['error', 3],
    'complexity': ['error', 10],
    'max-params': ['error', 3],
    'max-statements': ['error', 20],
    'max-nested-callbacks': ['error', 3],

    // Critical for PHI protection and medical data security
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error',

    // Prevent magic numbers for medical calculations
    'no-magic-numbers': ['error', {
      ignore: [0, 1, -1, 2, 3, 4, 5, 8, 9, 10, 15, 18, 29, 36, 50, 100, 120, 1000, 10001],
      ignoreArrayIndexes: true,
      detectObjects: false
    }],

    // Cognitive complexity for medical logic
    'complexity': ['error', 15],

    // Security rules for medical applications
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-possible-timing-attacks': 'warn',

    // Code quality and maintainability
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],

    // Function and variable naming for medical context
    'camelcase': ['error', {
      properties: 'always',
      allow: [
        'gfap_value', 'age_years', 'systolic_bp', 'diastolic_bp',
        'fast_ed_score', 'weakness_sudden', 'speech_sudden',
        'medical_calculation', 'api_request', 'arm_paresis', 'leg_paresis',
        'eye_deviation', 'atrial_fibrillation', 'anticoagulated_noak',
        'vigilance_reduction', 'reduced_consciousness', 'arm_weakness',
        'leg_weakness', 'gfap_level', 'fast_ed', 'fast_ed_total',
        'systolic_blood_pressure', 'diastolic_blood_pressure',
        'blood_pressure_systolic', 'blood_pressure_diastolic'
      ]
    }],
    'func-names': ['error', 'as-needed'],

    // Import/export organization
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always'
    }],

    // Relaxed rules for research prototype (temporary)
    'import/extensions': 'off', // Allow .js extensions for ES modules
    'no-await-in-loop': 'warn', // Medical calculations may require sequential processing
    'no-param-reassign': ['error', { props: false }], // Allow for DOM manipulation
    'max-len': ['warn', { code: 100, ignoreUrls: true, ignoreStrings: true }],

    // Medical calculation safety
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'radix': 'error'
  },

  // Override rules for specific file types
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js', 'src/__tests__/**/*.js'],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        'max-statements': 'off',
        'max-nested-callbacks': 'off',
        'complexity': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'object-curly-newline': 'off',
        'arrow-parens': 'off',
        'no-promise-executor-return': 'off',
        'security/detect-object-injection': 'off',
        'import/prefer-default-export': 'off'
      }
    },
    {
      files: ['src/config.js', 'src/constants.js'],
      rules: {
        'no-magic-numbers': 'off'
      }
    },
    {
      files: ['src/logic/validate.js', 'src/logic/lvo-local-model.js'],
      rules: {
        'no-magic-numbers': ['error', {
          ignore: [0, 1, -1, 2, 3, 4, 5, 8, 10, 25, 50, 70, 100, 1000],
          ignoreArrayIndexes: true
        }]
      }
    },
    {
      files: ['src/utils/performance-monitor.js'],
      rules: {
        'max-lines-per-function': ['error', 60],
        'max-statements': ['error', 25],
        'max-params': ['error', 5],
        'no-underscore-dangle': ['error', { allow: ['_sessionId'] }],
        'no-magic-numbers': ['error', {
          ignore: [0, 1, -1, 2, 36, 100, 1000],
          ignoreArrayIndexes: true
        }]
      }
    }
  ],

  // Ignore patterns for build and config files
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '*.min.js',
    'sw.js'
  ]
};