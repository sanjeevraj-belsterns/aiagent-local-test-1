module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\.js$': 'babel-jest',
    },
    testRegex: '(/__tests__/.*|(\.|/)(test|spec))\.js$',
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**'],
};