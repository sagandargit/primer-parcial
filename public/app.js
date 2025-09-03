import { loadTasks, addTask, taskInput, taskDate } from './tasks.js';
import { initCalendar } from './calendar.js';

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  taskDate.min = today;

  loadTasks();
  initCalendar();

  const addTaskButton = document.getElementById('addTaskButton');
  addTaskButton.addEventListener('click', addTask);

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});