const express = require('express');
const path = require('path');
const taskRoutes = require('./src/routes/taskRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const { PORT } = require('./src/config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api/tasks', taskRoutes);

// Serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});