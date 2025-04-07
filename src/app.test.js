const request = require('supertest');
const app = require('./app');

describe('Task API', () => {
    it('should respond with health status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });

    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get only active tasks', async () => {
        const response = await request(app).get('/tasks/active');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a task by ID', async () => {
        const response = await request(app).get('/tasks/1');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update a task by ID', async () => {
        const response = await request(app).put('/tasks/1').send({ title: 'Updated task' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });

    it('should delete a task', async () => {
        const response = await request(app).delete('/tasks/1');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });
});