const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./app'); // Assuming app.js exports the app instance

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clean up the tasks.json file before each test
afterEach(() => {
    if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
    }
});

describe('Task API', () => {
    it('should fetch all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update an existing task', async () => {
        const newTask = { title: 'Test task' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const updatedTask = { title: 'Updated task' };
        const updateResponse = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.title).toBe(updatedTask.title);
    });

    it('should delete an existing task', async () => {
        const newTask = { title: 'Test task' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteResponse.statusCode).toBe(204);

        const fetchResponse = await request(app).get('/tasks');
        expect(fetchResponse.body).toEqual([]);
    });

    it('should return 404 when updating a non-existing task', async () => {
        const response = await request(app).put('/tasks/99999').send({ title: 'Non-existing task' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });

    it('should return 404 when deleting a non-existing task', async () => {
        const response = await request(app).delete('/tasks/99999');
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });
});