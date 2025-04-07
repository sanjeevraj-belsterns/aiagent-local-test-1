const app = require('../app');

describe('App Tests', () => {
  test('should return expected output', () => {
    const result = app.someFunction();
    expect(result).toBe(expectedOutput);
  });
});