// Jackson Hinks - To-Do List Plus - 3/19/2026
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let currentTag = "all";

const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const tagInput = document.getElementById("tagInput");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");
const counter = document.getElementById("counter");
const tagFilter = document.getElementById("tagFilter");

// STORAGE 
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// FILTER LOGIC 
function getFilteredTasks() {
    return tasks.filter(task => {
        const matchesStatus =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.done) ||
            (currentFilter === "completed" && task.done);

        const matchesTag =
            currentTag === "all" ||
            (task.tag && task.tag === currentTag);

        return matchesStatus && matchesTag;
    });
}

// RENDER 
function renderTasks() {
    taskList.innerHTML = "";

    const filtered = getFilteredTasks();

    filtered.forEach(task => {
        const li = document.createElement("li");
        if (task.done) li.classList.add("completed");

        li.innerHTML = `
            <span>${task.text} ${task.tag ? `[${task.tag}]` : ""}</span>
            <div>
                <button data-action="toggle" data-id="${task.id}">✔</button>
                <button data-action="delete" data-id="${task.id}">✖</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCounter();
}

// ADD TASK
form.addEventListener("submit", e => {
    e.preventDefault();

    const text = taskInput.value.trim();
    const tag = tagInput.value.trim();

    if (!text) {
        errorMsg.textContent = "Task cannot be empty!";
        return;
    }

    errorMsg.textContent = "";

    tasks.push({
        id: Date.now(),
        text,
        tag,
        done: false
    });

    saveTasks();
    renderTasks();
    updateTagOptions();

    form.reset();
});

// EVENT DELEGATION
taskList.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "toggle") {
        const task = tasks.find(t => t.id === id);
        if (task) task.done = !task.done;
    }

    if (action === "delete") {
        tasks = tasks.filter(t => t.id !== id);
    }

    saveTasks();
    renderTasks();
});

// FILTER BUTTONS
document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// TAG FILTER
tagFilter.addEventListener("change", () => {
    currentTag = tagFilter.value;
    renderTasks();
});

// TAG OPTIONS
function updateTagOptions() {
    const uniqueTags = [...new Set(tasks.map(t => t.tag).filter(t => t))];

    tagFilter.innerHTML = `<option value="all">All Tags</option>`;

    uniqueTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// COUNTER
function updateCounter() {
    const active = tasks.filter(t => !t.done).length;
    counter.textContent = `${active} active task(s)`;
}

// INIT
updateTagOptions();
renderTasks();