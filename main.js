// ---- THEME TOGGLE ----
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ---- CREATE MEAL INPUTS ----
const mealsContainer = document.getElementById("meals");

for (let i = 1; i <= 3; i++) {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
    <div class="meal-row">
      
      <div class="meal-input-wrapper">
        <span class="meal-label">${i}°</span>
        <input type="text" id="meal-input-${i}" placeholder="Meal">
        <button class="add-btn" data-meal="${i}">+</button>
      </div>

      <div class="pill-container" id="meal-container-${i}"></div>

    </div>
  `;

  mealsContainer.appendChild(wrapper);
}

// Add meal event (using event delegation)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-btn")) {
    const mealNumber = e.target.getAttribute("data-meal");
    const input = document.getElementById(`meal-input-${mealNumber}`);
    const container = document.getElementById(
      `meal-container-${mealNumber}`
    );

    if (!input.value.trim()) return;

    const pill = document.createElement("div");
    pill.className = "pill";
    pill.innerHTML = `
      ${input.value}
      <button class="remove-pill">−</button>
    `;

    container.appendChild(pill);
    input.value = "";
  }

  if (e.target.classList.contains("remove-pill")) {
    e.target.parentElement.remove();
  }
});

// ---- SCHEDULE GENERATION ----
const schedule = document.getElementById("schedule");
const durationSelect = document.getElementById("duration");

durationSelect.addEventListener("change", generateSchedule);

function generateSchedule() {
  schedule.innerHTML = "";

  const interval = getMinutes(durationSelect.value);
  let currentMinutes = 5 * 60;
  const endMinutes = 17 * 60;

  let firstRow = true;

  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;

    const row = document.createElement("div");
    row.className = "schedule-row";

    row.innerHTML = `
      <div class="cell">${formatTime(hours, minutes)}</div>
      <div class="cell airlock-cell">
        ${firstRow ? "Airlock" : ""}
      </div>
      <div class="cell car-cell">
        ${firstRow ? "Car" : ""}
      </div>
    `;

    schedule.appendChild(row);

    currentMinutes += interval;
    firstRow = false;
  }
}
const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", populateSchedule);

function getAllPills() {
  const pills = document.querySelectorAll(".pill");
  return Array.from(pills).map(p => p.firstChild.textContent.trim());
}

function populateSchedule() {
  const names = getAllPills();
  if (!names.length) return;

  const rows = document.querySelectorAll(".schedule-row");

  // Clear previous values except headers
  rows.forEach((row, index) => {
    if (index !== 0) {
      row.children[1].textContent = "";
      row.children[2].textContent = "";
    }
  });

  let nameIndex = 0;

  // ---- Fill Airlock First ----
  for (let i = 1; i < rows.length && nameIndex < names.length; i++) {
    rows[i].children[1].textContent = names[nameIndex];
    nameIndex++;
  }

  // ---- Then Fill Car ----
  for (let i = 1; i < rows.length && nameIndex < names.length; i++) {

    const airlockName = rows[i].children[1].textContent;

    if (names[nameIndex] !== airlockName) {
      rows[i].children[2].textContent = names[nameIndex];
      nameIndex++;
    }
  }
}

// Initial load
generateSchedule();
