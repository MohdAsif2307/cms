module.exports = {
  testTimeout: 60000, // 60 seconds global timeout
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  // write coverage into the test folder for easier archiving
  coverageDirectory: "<rootDir>/test/coverage",
};
