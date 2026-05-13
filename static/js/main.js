document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDescription = document.getElementById('task-description');
    const taskDate = document.getElementById('task-date');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme Management
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? 'sun' : 'moon';
        themeToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
        if (window.lucide) lucide.createIcons();
    }

    // Initial fetch
    fetchTasks();

    // Event listeners
    addBtn.addEventListener('click', addTask);
    
    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function addTask() {
        const title = taskInput.value.trim();
        const description = taskDescription.value.trim();
        const due_date = taskDate.value;

        if (!title) {
            taskInput.focus();
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, due_date })
            });
            
            if (response.ok) {
                taskInput.value = '';
                taskDescription.value = '';
                taskDate.value = '';
                fetchTasks();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (response.ok) fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    async function toggleTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
            if (response.ok) fetchTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        let completed = 0;

        tasks.forEach(task => {
            if (task.completed) completed++;

            const item = document.createElement('div');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const dateHtml = task.due_date ? `
                <div class="task-date">
                    <i data-lucide="calendar" style="width:14px; height:14px"></i>
                    <span>${new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            ` : '';

            const descriptionHtml = task.description ? `
                <div class="task-description">${task.description}</div>
            ` : '';

            item.innerHTML = `
                <div class="task-main">
                    <div class="checkbox" onclick="event.stopPropagation()">
                        ${task.completed ? '<i data-lucide="check" style="width:16px; height:16px; color:white"></i>' : ''}
                    </div>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        ${descriptionHtml}
                        ${dateHtml ? `<div class="task-meta">${dateHtml}</div>` : ''}
                    </div>
                    <button class="delete-btn" title="Delete Task">
                        <i data-lucide="trash-2" style="width:20px; height:20px"></i>
                    </button>
                </div>
            `;

            // Click events
            item.addEventListener('click', () => toggleTask(task.id));
            item.querySelector('.checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTask(task.id);
            });
            item.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            taskList.appendChild(item);
        });

        // Update stats
        totalCount.textContent = tasks.length;
        completedCount.textContent = completed;

        // Re-initialize icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }
});
