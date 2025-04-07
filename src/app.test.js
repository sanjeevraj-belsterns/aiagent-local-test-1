const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks-122.json');

beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

describe('Task API', () => {
    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update a task by ID', async () => {
        const newTask = { title: 'Test Task' };
        const addResponse = await request(app).post('/tasks').send(newTask);
        const taskId = addResponse.body.id;
        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should delete a task', async () => {
        const newTask = { title: 'Test Task' };
        const addResponse = await request(app).post('/tasks').send(newTask);
        const taskId = addResponse.body.id;
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toEqual([]);
    });

    it('should return 404 for non-existent task on update', async () => {
        const response = await request(app).put('/tasks/999').send({ title: 'Non-existent Task' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });

    it('should return 404 for non-existent task on delete', async () => {
        const response = await request(app).delete('/tasks/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });
});