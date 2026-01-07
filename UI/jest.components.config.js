const base = require("./jest.base.config");

module.exports = {
  ...base,

  preset: "jest-expo",
  testEnvironment: "jsdom",

  testMatch: [
    "**/__tests__/components/**/*.test.(ts|tsx)",
  ],

  setupFiles: [
    "<rootDir>/__tests__/setup.ts",
  ],

  setupFilesAfterEnv: [],

  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
  ],
  reporters: [
    'default',
    ['./node_modules/jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'reports/test-report-components.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
      sort:'titleAsc',
    }],
  ],
};