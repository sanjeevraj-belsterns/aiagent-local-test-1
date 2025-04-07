const request = require('supertest');
const app = require('./app');

describe('Task API', () => {
    it('should return health status', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('OK');
    });

    it('should get all tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test task' };
        const res = await request(app).post('/tasks').send(newTask);
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toBe(newTask.title);
    });

    it('should return 400 if title is not provided', async () => {
        const res = await request(app).post('/tasks').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('Title is required');
    });

    it('should update a task by ID', async () => {
        const newTask = { title: 'Update task' };
        const postRes = await request(app).post('/tasks').send(newTask);
        const taskId = postRes.body.id;
        const updatedTask = { title: 'Updated task' };
        const res = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe(updatedTask.title);
    });

    it('should return 404 if task not found during update', async () => {
        const res = await request(app).put('/tasks/99999').send({ title: 'Not found' });
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Task not found');
    });

    it('should toggle completed status of a task', async () => {
        const newTask = { title: 'Toggle task' };
        const postRes = await request(app).post('/tasks').send(newTask);
        const taskId = postRes.body.id;
        const res = await request(app).patch(`/tasks/${taskId}/toggle`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.completed).toBe(true);
    });

    it('should return 404 if task not found during toggle', async () => {
        const res = await request(app).patch('/tasks/99999/toggle');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Task not found');
    });

    it('should delete a task', async () => {
        const newTask = { title: 'Delete task' };
        const postRes = await request(app).post('/tasks').send(newTask);
        const taskId = postRes.body.id;
        const res = await request(app).delete(`/tasks/${taskId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe(newTask.title);
    });

    it('should return 404 if task not found during delete', async () => {
        const res = await request(app).delete('/tasks/99999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Task not found');
    });
});