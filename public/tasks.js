let tasks = [];
let updateCalendarCallback = () => {};

const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');

function setUpdateCalendar(callback) {
  updateCalendarCallback = callback;
}

async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    tasks = await response.json();
    renderTasks();
    updateCalendarCallback();
  } catch (error) {
    console.error('Error al cargar tareas:', error);
  }
}

async function addTask() {
  const title = taskInput.value.trim();
  const date = taskDate.value;
  if (!title) return;

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date })
    });

    if (response.ok) {
      const newTask = await response.json();
      tasks.push(newTask);
      renderTasks();
      updateCalendarCallback();
      taskInput.value = '';
    }
  } catch (error) {
    console.error('Error al agregar tarea:', error);
  }
}

async function toggleTaskStatus(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });

    if (response.ok) {
      task.completed = !task.completed;
      renderTasks();
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
  }
}

async function deleteTask(taskId, event) {
  if (event) event.stopPropagation();
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      tasks = tasks.filter(t => t.id !== taskId);
      renderTasks();
      updateCalendarCallback();
    }
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
}

function renderTasks() {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date) - new Date(b.date);
  });

  taskList.innerHTML = '';

  if (sortedTasks.length === 0) {
    taskList.innerHTML = '<p class="no-tasks">No hay tareas. ¡Agrega una nueva tarea para comenzar!</p>';
    return;
  }

  sortedTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskElement.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-title">${task.title}</div>
      <div class="task-date">${formatDate(task.date)}</div>
      <button class="delete-button">×</button>
    `;

    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

    const deleteButton = taskElement.querySelector('.delete-button');
    deleteButton.addEventListener('click', (event) => deleteTask(task.id, event));

    taskList.appendChild(taskElement);
  });
}

function filterTasksByDate(date) {
  const filteredTasks = tasks.filter(task => task.date === date);

  taskList.innerHTML = '';
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<p class="no-tasks">No hay tareas para el ${formatDate(date)}.</p>`;
  } else {
    taskList.innerHTML = `<h3>Tareas para el ${formatDate(date)}</h3>`;
    filteredTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskElement.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-title">${task.title}</div>
        <button class="delete-button">×</button>
      `;

      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

      const deleteButton = taskElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', (event) => deleteTask(task.id, event));

      taskList.appendChild(taskElement);
    });
  }

  const backButton = document.createElement('button');
  backButton.textContent = 'Volver a todas las tareas';
  backButton.style.marginTop = '15px';
  backButton.style.padding = '8px 15px';
  backButton.style.backgroundColor = '#f0f0f0';
  backButton.style.border = '1px solid #ddd';
  backButton.style.borderRadius = '4px';
  backButton.style.cursor = 'pointer';
  backButton.addEventListener('click', renderTasks);
  taskList.appendChild(backButton);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('es-ES', options);
}

export {
  tasks,
  taskInput,
  taskDate,
  loadTasks,
  addTask,
  toggleTaskStatus,
  deleteTask,
  renderTasks,
  filterTasksByDate,
  setUpdateCalendar
};