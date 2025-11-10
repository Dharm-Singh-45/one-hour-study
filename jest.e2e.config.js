module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'jest-environment-puppeteer',
  testMatch: ['**/e2e/**/*.e2e.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.e2e.setup.js'],
  testTimeout: 30000,
  maxWorkers: 1, // Run E2E tests serially (solo mode)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

