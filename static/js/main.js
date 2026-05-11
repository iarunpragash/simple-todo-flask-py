document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');

    // Initial fetch
    fetchTasks();

    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

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
        if (!title) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            
            if (response.ok) {
                taskInput.value = '';
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
            item.innerHTML = `
                <div class="checkbox" onclick="event.stopPropagation()">
                    ${task.completed ? '<i data-lucide="check" style="width:14px; height:14px; color:white"></i>' : ''}
                </div>
                <div class="task-title">${task.title}</div>
                <button class="delete-btn" title="Delete Task">
                    <i data-lucide="trash-2" style="width:18px; height:18px"></i>
                </button>
            `;

            // Click events
            item.addEventListener('click', () => toggleTask(task.id));
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
