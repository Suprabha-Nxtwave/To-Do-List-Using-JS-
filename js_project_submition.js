const taskTitle = document.getElementById("taskTitle");
const taskPriority = document.getElementById("taskPriority");
const taskDeadline = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeSwitch = document.getElementById("themeSwitch");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeSwitch.checked);
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, index) => {
        const taskEl = document.createElement("div");
        taskEl.classList.add("task");
        if (task.completed) taskEl.classList.add("completed");
        if (!task.completed && task.deadline < today) taskEl.classList.add("overdue");

        taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p><span class="priority ${task.priority}">${task.priority}</span> | Due: ${task.deadline}</p>
      <label><input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="completeToggle" /> Completed</label>
      <div class="controls">
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;

        taskList.appendChild(taskEl);
    });

    document.querySelectorAll(".completeToggle").forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
            const idx = e.target.dataset.index;
            tasks[idx].completed = e.target.checked;
            saveTasks();
            renderTasks();
        });
    });
}

addTaskBtn.addEventListener("click", () => {
    const title = taskTitle.value.trim();
    const priority = taskPriority.value;
    const deadline = taskDeadline.value;

    if (!title || !deadline) {
        alert("Please enter a task title and deadline.");
        return;
    }

    tasks.push({
        title,
        priority,
        deadline,
        completed: false
    });
    saveTasks();
    renderTasks();

    taskTitle.value = "";
    taskDeadline.value = "";
});

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];
    const newTitle = prompt("Edit task title:", task.title);
    const newDeadline = prompt("Edit deadline:", task.deadline);
    const newPriority = prompt("Edit priority (High, Medium, Low):", task.priority);

    if (newTitle && newDeadline && newPriority) {
        tasks[index] = {
            ...task,
            title: newTitle,
            deadline: newDeadline,
            priority: newPriority
        };
        saveTasks();
        renderTasks();
    }
}

// Initial render
renderTasks();