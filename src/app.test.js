const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./app'); // Adjust this if app.js export is different

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clear tasks.json before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

// Close any active connections after all tests
afterAll(() => {
    // Close server if necessary or cleanup after tests
});

describe('Task API', () => {
    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a new task', async () => {
        const task = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(task);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(task.title);
    });

    it('should update an existing task', async () => {
        const task = { title: 'Test Task' };
        const postResponse = await request(app).post('/tasks').send(task);
        const taskId = postResponse.body.id;
        const updatedTask = { title: 'Updated Test Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should delete an existing task', async () => {
        const task = { title: 'Test Task' };
        const postResponse = await request(app).post('/tasks').send(task);
        const taskId = postResponse.body.id;
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 when trying to delete a non-existent task', async () => {
        const response = await request(app).delete('/tasks/99999'); // Assuming 99999 does not exist
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });
});
