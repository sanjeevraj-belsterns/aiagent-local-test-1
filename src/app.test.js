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

    it('should return 404 for updating a non-existent task', async () => {
        const response = await request(app).put('/tasks/999').send({ title: 'Non-existent Task' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });

    it('should get all active tasks', async () => {
        await request(app).post('/tasks').send({ title: 'Active Task 1' });
        await request(app).post('/tasks').send({ title: 'Active Task 2' });
        const response = await request(app).get('/tasks/active');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should get all inactive tasks', async () => {
        await request(app).post('/tasks').send({ title: 'Inactive Task 1', isActive: false });
        await request(app).post('/tasks').send({ title: 'Inactive Task 2', isActive: false });
        const response = await request(app).get('/tasks/inactive');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should delete a task', async () => {
        const newTask = { title: 'Task to Delete' };
        const addResponse = await request(app).post('/tasks').send(newTask);
        const taskId = addResponse.body.id;
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body.length).toBe(0);
    });

    it('should return 404 for deleting a non-existent task', async () => {
        const response = await request(app).delete('/tasks/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });
});