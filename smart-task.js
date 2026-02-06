// ====== GLOBAL STATE ======
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchText = "";

// ====== SAVE TO LOCAL STORAGE ======
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ====== ADD TASK ======
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (taskInput.value.trim() === "") {
    alert("Please enter a task");
    return;
  }

  tasks.push({
    text: taskInput.value,
    priority: priority,
    dueDate: dueDate,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
}

// ====== RENDER TASKS ======
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  tasks.forEach((task, index) => {

    // Search
    if (!task.text.toLowerCase().includes(searchText)) return;

    // Filter
    if (
      (currentFilter === "completed" && !task.completed) ||
      (currentFilter === "pending" && task.completed)
    ) return;

    const li = document.createElement("li");
    li.className = `task ${task.priority.toLowerCase()}`;

    if (task.completed) li.classList.add("completed");
    if (task.dueDate && task.dueDate < today && !task.completed) {
      li.classList.add("overdue");
    }

    li.innerHTML = `
      <strong>${task.text}</strong><br>
      Priority: ${task.priority} | Due: ${task.dueDate || "N/A"}
      <br>
      <button onclick="toggleTask(${index})">Done</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    list.appendChild(li);
  });

  updateStats();
  checkDeadlines();
}

// ====== TOGGLE TASK ======
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// ====== DELETE TASK ======
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// ====== FILTER TASKS ======
function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

// ====== SEARCH TASKS ======
function searchTasks() {
  searchText = document
    .getElementById("searchInput")
    .value
    .toLowerCase();
  renderTasks();
}

// ====== UPDATE STATS ======
function updateStats() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent =
    tasks.filter(task => task.completed).length;
  document.getElementById("pending").textContent =
    tasks.filter(task => !task.completed).length;
}

// ====== DEADLINE REMINDER ======
function checkDeadlines() {
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach(task => {
    if (task.dueDate === today && !task.completed) {
      alert(`⏰ Reminder: "${task.text}" is due TODAY!`);
    }
  });
}

// ====== INITIAL LOAD ======
renderTasks();
