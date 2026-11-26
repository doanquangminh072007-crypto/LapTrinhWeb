const monthYearDisplay = document.getElementById('month-year-display');
const daysGrid = document.getElementById('days-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const todayBtn = document.getElementById('today-btn');
const selectedDateText = document.getElementById('selected-date-text');
const eventInput = document.getElementById('event-input');
const addEventBtn = document.getElementById('add-event-btn');
const eventList = document.getElementById('event-list');

let currentDate = new Date();
let selectedDateKey = formatDateKey(new Date()); // Dạng YYYY-MM-DD

let events = JSON.parse(localStorage.getItem('calendar_events')) || {};

const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYearDisplay.textContent = `${monthNames[month]}, ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  daysGrid.innerHTML = '';

  for (let i = firstDayIndex; i > 0; i--) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day-cell', 'other-month');
    dayDiv.textContent = prevMonthTotalDays - i + 1;
    daysGrid.appendChild(dayDiv);
  }

  const today = new Date();
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day-cell');
    dayDiv.textContent = day;

    const thisDate = new Date(year, month, day);
    const dateKey = formatDateKey(thisDate);

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add('today');
    }

    if (dateKey === selectedDateKey) {
      dayDiv.classList.add('selected');
    }

    if (events[dateKey] && events[dateKey].length > 0) {
      dayDiv.classList.add('has-event');
    }

    dayDiv.addEventListener('click', () => {
      selectedDateKey = dateKey;
      renderCalendar();
      renderEvents();
    });

    daysGrid.appendChild(dayDiv);
  }

  const totalGridCells = daysGrid.children.length;
  const remainingCells = 42 - totalGridCells;
  for (let j = 1; j <= remainingCells; j++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day-cell', 'other-month');
    dayDiv.textContent = j;
    daysGrid.appendChild(dayDiv);
  }
}

function renderEvents() {
  const [y, m, d] = selectedDateKey.split('-');
  selectedDateText.textContent = `Ngày ${parseInt(d)} tháng ${parseInt(m)}, ${y}`;
  eventList.innerHTML = '';

  const dayEvents = events[selectedDateKey] || [];

  if (dayEvents.length === 0) {
    eventList.innerHTML = '<li style="color: #a0aec0; text-align: center; font-size: 0.85rem; padding-top: 10px;">Không có công việc nào</li>';
    return;
  }

  dayEvents.forEach((eventText, index) => {
    const li = document.createElement('li');
    li.classList.add('event-item');
    li.innerHTML = `
      <span>${eventText}</span>
      <button onclick="deleteEvent(${index})"><i class="fa-solid fa-trash"></i></button>
    `;
    eventList.appendChild(li);
  });
}

function addEvent() {
  const text = eventInput.value.trim();
  if (!text) return;

  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  }

  events[selectedDateKey].push(text);
  localStorage.setItem('calendar_events', JSON.stringify(events));

  eventInput.value = '';
  renderCalendar();
  renderEvents();
}

function deleteEvent(index) {
  events[selectedDateKey].splice(index, 1);
  if (events[selectedDateKey].length === 0) {
    delete events[selectedDateKey];
  }
  localStorage.setItem('calendar_events', JSON.stringify(events));

  renderCalendar();
  renderEvents();
}

prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  selectedDateKey = formatDateKey(currentDate);
  renderCalendar();
  renderEvents();
});

addEventBtn.addEventListener('click', addEvent);

eventInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addEvent();
});

renderCalendar();
renderEvents();