let tasks = [];

function getTasks(req, res) {
  res.json(tasks);
}

function createTask(req, res) {
  const task = {
    id: Date.now().toString(),
    title: req.body.title,
    date: req.body.date,
    completed: false
  };
  tasks.push(task);
  res.status(201).json(task);
}

function updateTask(req, res) {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).send('Tarea no encontrada');

  task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
  task.title = req.body.title || task.title;
  task.date = req.body.date || task.date;

  res.json(task);
}

function deleteTask(req, res) {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(204).send();
}

module.exports = { getTasks, createTask, updateTask, deleteTask };