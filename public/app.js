// Variables globales
let tasks = [];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const currentMonthElement = document.getElementById('currentMonth');
const calendarDays = document.getElementById('calendarDays');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Establecer la fecha mínima del input de fecha al día de hoy
    const today = new Date().toISOString().split('T')[0];
    taskDate.min = today;
    
    // Cargar tareas al iniciar
    loadTasks();
    
    // Inicializar el calendario
    updateCalendar();
    
    // Event listeners para los botones del calendario
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    // Permitir agregar tareas con Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Funciones para manejar tareas
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        tasks = await response.json();
        renderTasks();
        updateCalendar();
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, date })
        });
        
        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);
            renderTasks();
            updateCalendar();
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
            headers: {
                'Content-Type': 'application/json',
            },
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
    event.stopPropagation(); // Evitar que el evento se propague al elemento padre
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
            updateCalendar();
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
}

function renderTasks() {
    // Ordenar tareas: las no completadas primero, luego por fecha
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
            <button onclick="deleteTask('${task.id}', event)">×</button>
        `;
        
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        taskList.appendChild(taskElement);
    });
}

// Funciones para el calendario
function updateCalendar() {
    // Actualizar el encabezado del mes y año
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Limpiar el calendario
    calendarDays.innerHTML = '';
    
    // Obtener el primer día del mes y el número de días en el mes
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
    const firstDayOfWeek = firstDay === 0 ? 6 : firstDay - 1;
    
    // Días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, 'other-month');
        calendarDays.appendChild(dayElement);
    }
    
    // Días del mes actual
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = createDayElement(i);
        
        // Resaltar el día actual
        if (isCurrentMonth && i === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Marcar días con tareas
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasTasks = tasks.some(task => task.date === dateStr);
        
        if (hasTasks) {
            dayElement.classList.add('has-tasks');
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // Días del siguiente mes para completar la cuadrícula
    const totalDays = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const remainingDays = totalDays - (firstDayOfWeek + daysInMonth);
    
    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = createDayElement(i, 'other-month');
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(day, className = '') {
    const dayElement = document.createElement('div');
    dayElement.className = `day ${className}`;
    dayElement.textContent = day;
    
    // Agregar evento de clic para mostrar tareas del día
    if (!className.includes('other-month')) {
        dayElement.addEventListener('click', () => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            filterTasksByDate(dateStr);
        });
    }
    
    return dayElement;
}

function filterTasksByDate(date) {
    const filteredTasks = tasks.filter(task => task.date === date);
    
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
                <button onclick="deleteTask('${task.id}', event)">×</button>
            `;
            
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
            
            taskList.appendChild(taskElement);
        });
    }
    
    // Agregar botón para volver a mostrar todas las tareas
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

// Funciones de utilidad
function formatDate(dateString) {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        return dateString; // Devolver la cadena original si no es una fecha válida
    }
    
    return date.toLocaleDateString('es-ES', options);
}
