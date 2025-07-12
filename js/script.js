const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskList = document.getElementById('task-list');
const deleteAllBtn = document.getElementById('delete-all-btn');
const noTaskMsg = document.getElementById('no-task-msg');
const filterTasksEl = document.getElementById('filter-tasks');

let tasks = [];
let currentFilter = 'all';


function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        noTaskMsg.style.display = 'block';
        noTaskMsg.textContent = tasks.length === 0 ? "No task found. Let's add one!" : `No ${currentFilter} tasks.`;
    } else {
        noTaskMsg.style.display = 'none';
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id);
        
        const taskTextClasses = task.completed ? 'completed' : '';
        const formattedDate = task.date 
            ? new Date(task.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
            : '';

        li.innerHTML = `
            <div class="task-content">
                <p class="${taskTextClasses}">${task.text}</p>
                ${formattedDate ? `<p class="task-date">${formattedDate}</p>` : ''}
            </div>
            <div class="task-actions">
                <button class="complete-btn">✔️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const dueDate = taskDate.value;
    
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        date: dueDate,
        completed: false
    };
    
    tasks.push(newTask);
    
    taskInput.value = '';
    taskDate.value = '';
    
    renderTasks();
}

function handleTaskAction(e) {
    const item = e.target;
    const li = item.closest('.task-item');
    if (!li) return;

    const taskId = Number(li.getAttribute('data-id'));

    if (item.classList.contains('complete-btn')) {
        tasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
    }
    
    if (item.classList.contains('delete-btn')) {
        tasks = tasks.filter(task => task.id !== taskId);
    }
    
    renderTasks();
}

function deleteAllTasks() {
    if (tasks.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        renderTasks();
    }
}

function handleFilterChange(e) {
    currentFilter = e.target.value;
    renderTasks();
}

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskAction);
deleteAllBtn.addEventListener('click', deleteAllTasks);
filterTasksEl.addEventListener('change', handleFilterChange);

renderTasks();