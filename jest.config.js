module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\.jsx?$': 'babel-jest',
    },
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/?(*.)+(spec|test).js',
    ],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};