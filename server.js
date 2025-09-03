const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Almacenamiento en memoria para las tareas
let tasks = [];

// API Routes
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const task = {
        id: Date.now().toString(),
        title: req.body.title,
        date: req.body.date,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).send('Tarea no encontrada');
    
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    task.title = req.body.title || task.title;
    task.date = req.body.date || task.date;
    
    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== req.params.id);
    res.status(204).send();
});

// Serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
