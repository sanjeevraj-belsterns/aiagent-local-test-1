const app = require('../src/app');

describe('App Tests', () => {
  test('should return expected output', () => {
    const result = app.someFunction();
    expect(result).toBe(expectedValue);
  });
});