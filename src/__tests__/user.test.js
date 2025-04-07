const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('../user');

const app = express();
app.use(bodyParser.json());
app.use(userRouter);

describe('User API', () => {
    beforeEach(() => {
        // Clear the users.json file before each test
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    });

    test('GET /users - should return an empty array', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /users - should add a new user', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.email).toBe(newUser.email);
    });

    test('POST /users - should return 400 if name or email is missing', async () => {
        const response = await request(app).post('/users').send({ name: 'John Doe' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Name and email are required' });
    });
});