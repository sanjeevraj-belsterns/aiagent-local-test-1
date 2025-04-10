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
    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update a task by ID', async () => {
        const newTask = { title: 'Test Task' };
        const addResponse = await request(app).post('/tasks').send(newTask);
        const taskId = addResponse.body.id;
        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should return 404 for updating a non-existent task', async () => {
        const response = await request(app).put('/tasks/999').send({ title: 'Non-existent Task' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should get all active tasks', async () => {
        const newTask = { title: 'Active Task' };
        await request(app).post('/tasks').send(newTask);
        const response = await request(app).get('/tasks/active');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('should delete a task', async () => {
        const newTask = { title: 'Task to Delete' };
        const addResponse = await request(app).post('/tasks').send(newTask);
        const taskId = addResponse.body.id;
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.statusCode).toBe(204);
    });

    it('should return 404 for deleting a non-existent task', async () => {
        const response = await request(app).delete('/tasks/999');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });
});