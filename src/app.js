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

// Get all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
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

// Get all active tasks
app.get('/tasks/active', (req, res) => {
    const tasks = readTasks();
    const activeTasks = tasks.filter(task => task.isActive);
    res.json(activeTasks);
});

// Get all inactive tasks
app.get('/tasks/inactive', (req, res) => {
    const tasks = readTasks();
    const inactiveTasks = tasks.filter(task => !task.isActive);
    res.json(inactiveTasks);
});

// Get all tasks with status "in_progress"
app.get('/tasks/in_progress', (req, res) => {
    const tasks = readTasks();
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    res.json(inProgressTasks);
});

// Get all tasks with status "do_later"
app.get('/tasks/do_later', (req, res) => {
    const tasks = readTasks();
    const doLaterTasks = tasks.filter(task => task.status === 'do_later');
    res.json(doLaterTasks);
});

// Get all tasks with status "planning"
app.get('/tasks/planning', (req, res) => {
    const tasks = readTasks();
    const planningTasks = tasks.filter(task => task.status === 'planning');
    res.json(planningTasks);
});

// Get all tasks with status "testing"
app.get('/tasks/testing', (req, res) => {
    const tasks = readTasks();
    const testingTasks = tasks.filter(task => task.status === 'testing');
    res.json(testingTasks);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id);
    const filteredTasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length === filteredTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }
    writeTasks(filteredTasks);
    res.status(204).send();
});

// Start the server
var server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

module.exports = server
