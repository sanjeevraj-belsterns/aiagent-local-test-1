const request = require('supertest');
const fs = require('fs');
const app = require('./app'); // assuming app.js exports the express app

const DATA_FILE = 'src/tasks.json';

// Clean up tasks.json before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

afterAll(() => {
    // Clean up if needed
    fs.unlinkSync(DATA_FILE);
});

describe('Task API', () => {
    it('should fetch all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should create a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update an existing task', async () => {
        const newTask = { title: 'Test Task' };
        const createdResponse = await request(app).post('/tasks').send(newTask);
        const taskId = createdResponse.body.id;
        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should delete a task', async () => {
        const newTask = { title: 'Test Task' };
        const createdResponse = await request(app).post('/tasks').send(newTask);
        const taskId = createdResponse.body.id;
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for deleting a non-existent task', async () => {
        const response = await request(app).delete('/tasks/99999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });
});