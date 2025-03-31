module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\.jsx?$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};