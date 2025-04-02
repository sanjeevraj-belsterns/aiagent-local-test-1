module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\.jsx?$': 'babel-jest',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};