let tasks = [];

function getAll() {
  return tasks;
}

function add(task) {
  tasks.push(task);
  return task;
}

function update(id, data) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  if (data.title !== undefined) task.title = data.title;
  if (data.date !== undefined) task.date = data.date;
  if (data.completed !== undefined) task.completed = data.completed;
  return task;
}

function remove(id) {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  return tasks.length < initialLength;
}

module.exports = {
  getAll,
  add,
  update,
  remove
};