// ESLint Configuration for Medical Software Development
// iGFAP Stroke Triage Assistant - Research Preview
// Follows medical device software standards for quality and safety
module.exports = {
  // Specifies the JavaScript language options you want to support.
  parserOptions: {
    ecmaVersion: 2021, // Or a later version like 2022, "latest"
    sourceType: "module", // Or "script" for CommonJS
    ecmaFeatures: {
      jsx: true, // Enable JSX for React projects
    },
  },

  // Specifies the environments in which your code runs.
  env: {
    browser: true, // Browser global variables
    node: true, // Node.js global variables and Node.js scoping
    es2021: true, // Adds all ECMAScript 2021 global variables and parsing options
  },

  // Extends from recommended configurations or custom configurations.
  extends: [
    "eslint:recommended", // ESLint's base recommended rules
    // "plugin:react/recommended", // For React projects
    // "prettier", // For Prettier integration
  ],

  // Defines custom rules or overrides rules from extended configurations.
  rules: {
    indent: ["error", 2], // Enforce 2-space indentation
    "linebreak-style": ["error", "unix"], // Enforce Unix-style line endings
    quotes: ["error", "double"], // Enforce double quotes
    semi: ["error", "always"], // Enforce semicolons
    "no-unused-vars": ["warn", { args: "none" }], // Warn about unused variables
  },

  // Specifies plugins to use.
  plugins: [
    // "react", // For React projects
    // "prettier", // For Prettier integration
  ],

  // Global variables that are not defined in the code but are used.
  globals: {
    MyGlobalVar: "readonly",
  },

  // Overrides specific rules or settings for certain files or patterns.
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
};
