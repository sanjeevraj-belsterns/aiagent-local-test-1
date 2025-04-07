const request = require('supertest');
const express = require('express');
const userRoutes = require('../user');

const app = express();
app.use('/', userRoutes);

describe('User Routes', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});