const base = require("./jest.base.config");

module.exports = {
  ...base,

  preset: "jest-expo",
  testEnvironment: "node",

  testMatch: [
    "**/__tests__/logic/**/*.test.ts",
  ],

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      isolatedModules: true,
    },
  },
  setupFiles: [
    "<rootDir>/__tests__/setup.ts",
  ],
    reporters: [
    'default',
    ['./node_modules/jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'reports/test-report-logic.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
      sort:'titleAsc',
    }],
  ],
};