const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks-122.json');

beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

afterAll(() => {
    fs.unlinkSync(DATA_FILE);
});

describe('Task API', () => {
    test('GET /tasks should return an empty array', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /tasks should create a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    test('PUT /tasks/:id should update an existing task', async () => {
        const newTask = { title: 'Test Task' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;
        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    test('GET /tasks/active should return active tasks', async () => {
        await request(app).post('/tasks').send({ title: 'Active Task 1' });
        await request(app).post('/tasks').send({ title: 'Inactive Task 1', isActive: false });
        const response = await request(app).get('/tasks/active');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test('DELETE /tasks/:id should delete a task', async () => {
        const newTask = { title: 'Task to be deleted' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;
        const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteResponse.statusCode).toBe(204);
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body.length).toBe(0);
    });
});