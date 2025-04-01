const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = require('./app'); // Assuming app.js exports the app

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clear the tasks.json file before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

afterAll(() => {
    // Close any active connections if needed
});

describe('Tasks API', () => {
    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app)
            .post('/tasks')
            .send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update an existing task', async () => {
        const newTask = { title: 'Test Task' };
        const createResponse = await request(app)
            .post('/tasks')
            .send(newTask);
        const taskId = createResponse.body.id;

        const updateData = { title: 'Updated Task' };
        const updateResponse = await request(app)
            .put(`/tasks/${taskId}`)
            .send(updateData);
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toBe(updateData.title);
    });

    it('should delete an existing task', async () => {
        const newTask = { title: 'Test Task' };
        const createResponse = await request(app)
            .post('/tasks')
            .send(newTask);
        const taskId = createResponse.body.id;

        const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toEqual([]);
    });

    it('should return 404 when updating a non-existing task', async () => {
        const updateResponse = await request(app)
            .put('/tasks/99999')
            .send({ title: 'Updated Task' });
        expect(updateResponse.status).toBe(404);
        expect(updateResponse.body).toEqual({ error: 'Task not found' });
    });

    it('should return 404 when deleting a non-existing task', async () => {
        const deleteResponse = await request(app).delete('/tasks/99999');
        expect(deleteResponse.status).toBe(404);
        expect(deleteResponse.body).toEqual({ error: 'Task not found' });
    });
});
