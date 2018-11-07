// eslint-disable-next-line no-unused-vars
const { defaults } = require('jest-config'); // if default config is needed

module.exports = {
    transformIgnorePatterns: ['/node_modules/.+\\.js$'],
    setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.js',
};
