const taskRepository = require('../services/taskRepository');

function list(req, res, next) {
  try {
    res.json(taskRepository.getAll());
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const task = {
      id: Date.now().toString(),
      title: req.body.title,
      date: req.body.date,
      completed: false
    };
    taskRepository.add(task);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

function update(req, res, next) {
  const task = taskRepository.update(req.params.id, req.body);
  if (!task) return next({ status: 404, message: 'Tarea no encontrada' });
  res.json(task);
}

function remove(req, res, next) {
  const removed = taskRepository.remove(req.params.id);
  if (!removed) return next({ status: 404, message: 'Tarea no encontrada' });
  res.status(204).send();
}

module.exports = {
  list,
  create,
  update,
  remove
};