const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const taskRepository = require('./src/services/taskRepository');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// API Routes
app.get('/api/tasks', (req, res) => {
    res.json(taskRepository.getAll());
});

app.post('/api/tasks', (req, res) => {
    const task = {
        id: Date.now().toString(),
        title: req.body.title,
        date: req.body.date,
        completed: false
    };
    taskRepository.add(task);
    res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
    const task = taskRepository.update(req.params.id, req.body);
    if (!task) return res.status(404).send('Tarea no encontrada');

    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const removed = taskRepository.remove(req.params.id);
    if (!removed) return res.status(404).send();
    res.status(204).send();
});

// Serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});