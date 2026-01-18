// Task and List Management
class TaskApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.lists = this.loadLists();
        this.currentList = 'All Tasks';
        this.editingTaskId = null;

        // Initialize default lists if empty
        if (this.lists.length === 0) {
            this.lists = [
                { id: 1, name: 'Work' },
                { id: 2, name: 'Personal' },
                { id: 3, name: 'Shopping' }
            ];
            this.saveLists();
        }

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderLists();
        this.renderTasks();
    }

    setupEventListeners() {
        // Add task button
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.toggleTaskForm();
        });

        // Save task
        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            this.saveTask();
        });

        // Cancel task form
        document.getElementById('cancelTaskBtn').addEventListener('click', () => {
            this.toggleTaskForm();
        });

        // Add list button
        document.getElementById('addListBtn').addEventListener('click', () => {
            this.openListModal();
        });

        // Save list
        document.getElementById('saveListBtn').addEventListener('click', () => {
            this.createNewList();
        });

        // Cancel list modal
        document.getElementById('cancelListBtn').addEventListener('click', () => {
            this.closeListModal();
        });

        // Save edited task
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            this.saveEditedTask();
        });

        // Cancel edit modal
        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.closeEditModal();
        });

        // Handle Enter key in inputs
        document.getElementById('listInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createNewList();
        });

        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveTask();
        });
    }

    toggleTaskForm() {
        const form = document.getElementById('taskForm');
        const isHidden = form.style.display === 'none';

        if (isHidden) {
            form.style.display = 'block';
            document.getElementById('taskInput').focus();
        } else {
            form.style.display = 'none';
            this.clearTaskForm();
        }
    }

    clearTaskForm() {
        document.getElementById('taskInput').value = '';
        document.getElementById('taskDate').value = '';
        document.getElementById('taskTime').value = '';
        this.editingTaskId = null;
    }

    saveTask() {
        const text = document.getElementById('taskInput').value.trim();
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;

        if (!text) {
            alert('Please enter a task description');
            return;
        }

        const task = {
            id: this.editingTaskId || Date.now(),
            text,
            date,
            time,
            completed: false,
            list: this.currentList === 'All Tasks' ? 'Personal' : this.currentList,
            createdAt: this.editingTaskId
                ? this.tasks.find(t => t.id === this.editingTaskId).createdAt
                : new Date().toISOString()
        };

        if (this.editingTaskId) {
            const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
            this.tasks[index] = task;
        } else {
            this.tasks.push(task);
        }

        this.saveTasks();
        this.clearTaskForm();
        this.toggleTaskForm();
        this.renderTasks();
        this.renderLists();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.renderLists();
        }
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            document.getElementById('editTaskInput').value = task.text;
            document.getElementById('editTaskDate').value = task.date || '';
            document.getElementById('editTaskTime').value = task.time || '';
            document.getElementById('editModal').style.display = 'flex';
        }
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    saveEditedTask() {
        const text = document.getElementById('editTaskInput').value.trim();
        const date = document.getElementById('editTaskDate').value;
        const time = document.getElementById('editTaskTime').value;

        if (!text) {
            alert('Please enter a task description');
            return;
        }

        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            task.text = text;
            task.date = date;
            task.time = time;
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
        }
    }

    createNewList() {
        const name = document.getElementById('listInput').value.trim();

        if (!name) {
            alert('Please enter a list name');
            return;
        }

        if (this.lists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
            alert('This list already exists');
            return;
        }

        this.lists.push({
            id: Date.now(),
            name
        });

        this.saveLists();
        document.getElementById('listInput').value = '';
        this.closeListModal();
        this.renderLists();
    }

    openListModal() {
        document.getElementById('listModal').style.display = 'flex';
        document.getElementById('listInput').focus();
    }

    closeListModal() {
        document.getElementById('listModal').style.display = 'none';
    }

    selectList(name) {
        this.currentList = name;
        this.renderLists();
        this.renderTasks();

        // Update header
        document.getElementById('currentListTitle').textContent = name;

        // Hide form if visible
        if (document.getElementById('taskForm').style.display === 'block') {
            this.toggleTaskForm();
        }
    }

    deleteList(id) {
        if (confirm('Are you sure? This will not delete the tasks.')) {
            this.lists = this.lists.filter(list => list.id !== id);
            this.saveLists();
            if (this.currentList !== 'All Tasks' && !this.lists.find(l => l.name === this.currentList)) {
                this.currentList = 'All Tasks';
            }
            this.renderLists();
            this.renderTasks();
        }
    }

    renderLists() {
        const container = document.getElementById('listsContainer');
        container.innerHTML = '';

        // All Tasks button
        const allTasksBtn = document.createElement('div');
        allTasksBtn.className = `list-item ${this.currentList === 'All Tasks' ? 'active' : ''}`;
        const allTasksCount = this.tasks.length;
        allTasksBtn.innerHTML = `
            <span>📋 All Tasks</span>
            <span class="list-item-count">${allTasksCount}</span>
        `;
        allTasksBtn.addEventListener('click', () => this.selectList('All Tasks'));
        container.appendChild(allTasksBtn);

        // Custom lists
        this.lists.forEach(list => {
            const listBtn = document.createElement('div');
            listBtn.className = `list-item ${this.currentList === list.name ? 'active' : ''}`;
            const count = this.tasks.filter(t => t.list === list.name).length;
            listBtn.innerHTML = `
                <div style="flex: 1;">
                    <span>${list.name}</span>
                    <span class="list-item-count">${count}</span>
                </div>
            `;

            listBtn.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-delete-list')) {
                    this.selectList(list.name);
                }
            });

            // Add delete button on hover (visible in HTML)
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-list';
            deleteBtn.style.cssText = 'background: transparent; border: none; color: #999; cursor: pointer; font-size: 1.1em; padding: 0;';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => this.deleteList(list.id));
            listBtn.appendChild(deleteBtn);

            container.appendChild(listBtn);
        });
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        tasksList.innerHTML = '';

        let filteredTasks = this.currentList === 'All Tasks'
            ? this.tasks
            : this.tasks.filter(task => task.list === this.currentList);

        // Sort by incomplete first, then by date
        filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            // Sort by date if available
            if (a.date && b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            return 0;
        });

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        filteredTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;

            const dateTime = this.formatDateTime(task.date, task.time);

            taskEl.innerHTML = `
                <div class="task-checkbox" onclick="app.toggleTaskComplete(${task.id})"></div>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    ${dateTime ? `<div class="task-datetime">📅 ${dateTime}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-edit" onclick="app.openEditModal(${task.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="app.deleteTask(${task.id})">🗑️ Delete</button>
                </div>
            `;

            tasksList.appendChild(taskEl);
        });
    }

    formatDateTime(date, time) {
        if (!date) return '';

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const formattedTime = time
            ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
            : '';

        return formattedTime ? `${formattedDate} at ${formattedTime}` : formattedDate;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Local Storage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const data = localStorage.getItem('tasks');
        return data ? JSON.parse(data) : [];
    }

    saveLists() {
        localStorage.setItem('lists', JSON.stringify(this.lists));
    }

    loadLists() {
        const data = localStorage.getItem('lists');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize app
const app = new TaskApp();

// Close modals when clicking outside
document.getElementById('listModal').addEventListener('click', (e) => {
    if (e.target.id === 'listModal') {
        app.closeListModal();
    }
});

document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') {
        app.closeEditModal();
    }
});