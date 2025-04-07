const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'tasks-122.json');

// Middleware to parse JSON
app.use(express.json());

// Helper function to read tasks from the JSON file
function readTasks() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    } 
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Helper function to write tasks to the JSON file
function writeTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Get all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        title: req.body.title,
        completed: false,
        isActive: true
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...req.body
    };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

// Toggle completed status of a task
app.patch('/tasks/:id/toggle', (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = !task.completed;
    writeTasks(tasks);
    res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    const filteredTasks = tasks.filter(task => task.id !== taskId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    writeTasks(filteredTasks);
    res.status(200).json(task);
});

// Start the server
var server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

module.exports = server;
