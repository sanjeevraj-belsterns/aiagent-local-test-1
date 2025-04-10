const request = require('supertest');
const app = require('../src/app');

describe('Task API', () => {
    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update a task by ID', async () => {
        const newTask = { title: 'Task to Update' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should delete a task by ID', async () => {
        const newTask = { title: 'Task to Delete' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for deleting a non-existent task', async () => {
        const response = await request(app).delete('/tasks/99999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });
});