const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks-122.json');

beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

describe('Task API', () => {
    test('GET /tasks returns an empty array', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /tasks adds a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    test('PUT /tasks/:id updates a task', async () => {
        const newTask = { title: 'Test Task' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    test('DELETE /tasks/:id deletes a task', async () => {
        const newTask = { title: 'Test Task' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.statusCode).toBe(204);

        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toEqual([]);
    });

    test('PUT /tasks/:id returns 404 for non-existent task', async () => {
        const response = await request(app).put('/tasks/999').send({ title: 'Non-existent Task' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });

    test('DELETE /tasks/:id returns 404 for non-existent task', async () => {
        const response = await request(app).delete('/tasks/999');
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });
});