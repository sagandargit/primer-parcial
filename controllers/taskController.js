const taskRepository = require('../services/taskRepository');

function list(req, res) {
  res.json(taskRepository.getAll());
}

function create(req, res) {
  const task = {
    id: Date.now().toString(),
    title: req.body.title,
    date: req.body.date,
    completed: false
  };
  taskRepository.add(task);
  res.status(201).json(task);
}

function update(req, res) {
  const task = taskRepository.update(req.params.id, req.body);
  if (!task) return res.status(404).send('Tarea no encontrada');
  res.json(task);
}

function remove(req, res) {
  const removed = taskRepository.remove(req.params.id);
  if (!removed) return res.status(404).send();
  res.status(204).send();
}

module.exports = {
  list,
  create,
  update,
  remove
};