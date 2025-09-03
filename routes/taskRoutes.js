const express = require('express');
const taskRepository = require('../services/taskRepository');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(taskRepository.getAll());
});

router.post('/', (req, res) => {
  const task = {
    id: Date.now().toString(),
    title: req.body.title,
    date: req.body.date,
    completed: false
  };
  taskRepository.add(task);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const task = taskRepository.update(req.params.id, req.body);
  if (!task) return res.status(404).send('Tarea no encontrada');
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const removed = taskRepository.remove(req.params.id);
  if (!removed) return res.status(404).send();
  res.status(204).send();
});

module.exports = router;