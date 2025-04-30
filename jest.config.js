module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/test/client/**/*.test.{js,jsx}'],
      setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/client/src/__mocks__/fileMock.js'
      },
      moduleDirectories: ['node_modules', 'client/src']
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/server/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/test/server/setup.js']
    },
    {
      displayName: 'circuits',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/circuits/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/test/circuits/setup.js']
    }
  ],
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx}',
    'server/src/**/*.js',
    'circuits/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
}; 