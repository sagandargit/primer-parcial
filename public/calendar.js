import { tasks, filterTasksByDate, setUpdateCalendar } from './tasks.js';

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const currentMonthElement = document.getElementById('currentMonth');
const calendarDays = document.getElementById('calendarDays');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

function updateCalendar() {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  calendarDays.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dayElement = createDayElement(day, 'other-month');
    calendarDays.appendChild(dayElement);
  }

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = createDayElement(i);
    if (isCurrentMonth && i === today.getDate()) {
      dayElement.classList.add('today');
    }
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const hasTasks = tasks.some(task => task.date === dateStr);
    if (hasTasks) {
      dayElement.classList.add('has-tasks');
    }
    calendarDays.appendChild(dayElement);
  }

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
  if (!className.includes('other-month')) {
    dayElement.addEventListener('click', () => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      filterTasksByDate(dateStr);
    });
  }
  return dayElement;
}

function initCalendar() {
  setUpdateCalendar(updateCalendar);
  updateCalendar();
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
}

export { initCalendar, updateCalendar };