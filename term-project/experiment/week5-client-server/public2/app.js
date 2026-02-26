// public/js/app.js
// Task Board Frontend - N-Tier Architecture

// ===== Configuration =====
const API_BASE_URL = 'http://192.168.56.5:3000/api';  // Relative URL (Nginx proxies to backend)

// ===== State =====
let tasks = [];

// ===== DOM Elements =====
const elements = {
    connectionStatus: document.getElementById('connectionStatus'),
    addTaskForm: document.getElementById('addTaskForm'),
    editModal: document.getElementById('editModal'),
    editTaskForm: document.getElementById('editTaskForm'),
    toast: document.getElementById('toast'),
    
    // Stats
    statTotal: document.getElementById('statTotal'),
    statTodo: document.getElementById('statTodo'),
    statProgress: document.getElementById('statProgress'),
    statDone: document.getElementById('statDone'),
    
    // Task lists
    todoTasks: document.getElementById('todoTasks'),
    progressTasks: document.getElementById('progressTasks'),
    doneTasks: document.getElementById('doneTasks'),
    
    // Counts
    countTodo: document.getElementById('countTodo'),
    countProgress: document.getElementById('countProgress'),
    countDone: document.getElementById('countDone')
};

// ===== API Functions =====
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== Task API =====
const taskAPI = {
    getAll: () => apiRequest('/tasks'),
    getStats: () => apiRequest('/tasks/stats'),
    getById: (id) => apiRequest(`/tasks/${id}`),
    create: (data) => apiRequest('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id, status) => apiRequest(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    moveNext: (id) => apiRequest(`/tasks/${id}/next`, { method: 'PATCH' }),
    delete: (id) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
    healthCheck: () => apiRequest('/health')
};

// ===== UI Functions =====
function showToast(message, type = 'success') {
    elements.toast.querySelector('.toast-message').textContent = message;
    elements.toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        elements.toast.className = 'toast';
    }, 3000);
}

function updateConnectionStatus(connected, message = '') {
    elements.connectionStatus.className = `connection-status ${connected ? 'connected' : 'error'}`;
    elements.connectionStatus.querySelector('.status-text').textContent = 
        connected ? 'Connected' : (message || 'Disconnected');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== Render Functions =====
function renderTask(task) {
    const priorityClass = task.priority.toLowerCase();
    const nextStatuses = getNextStatuses(task.status);
    
    return `
        <div class="task-card priority-${priorityClass}" data-id="${task.id}">
            <div class="task-header">
                <span class="task-title">${escapeHtml(task.title)}</span>
                <span class="task-priority ${priorityClass}">${task.priority}</span>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <span>${formatDate(task.created_at)}</span>
                <div class="task-actions">
                    ${nextStatuses.length > 0 ? 
                        `<button class="btn-move" onclick="moveTask(${task.id})" title="Move to ${nextStatuses[0]}">→</button>` : ''
                    }
                    <button class="btn-edit" onclick="openEditModal(${task.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

function getNextStatuses(currentStatus) {
    const transitions = {
        'TODO': ['IN_PROGRESS'],
        'IN_PROGRESS': ['DONE'],
        'DONE': []
    };
    return transitions[currentStatus] || [];
}

function renderTasks() {
    const todoList = tasks.filter(t => t.status === 'TODO');
    const progressList = tasks.filter(t => t.status === 'IN_PROGRESS');
    const doneList = tasks.filter(t => t.status === 'DONE');
    
    elements.todoTasks.innerHTML = todoList.map(renderTask).join('') || '<p class="loading">No tasks</p>';
    elements.progressTasks.innerHTML = progressList.map(renderTask).join('') || '<p class="loading">No tasks</p>';
    elements.doneTasks.innerHTML = doneList.map(renderTask).join('') || '<p class="loading">No tasks</p>';
    
    // Update counts
    elements.countTodo.textContent = todoList.length;
    elements.countProgress.textContent = progressList.length;
    elements.countDone.textContent = doneList.length;
}

async function updateStats() {
    try {
        const response = await taskAPI.getStats();
        const stats = response.data;
        
        elements.statTotal.querySelector('.stat-number').textContent = stats.total;
        elements.statTodo.querySelector('.stat-number').textContent = stats.todo;
        elements.statProgress.querySelector('.stat-number').textContent = stats.in_progress;
        elements.statDone.querySelector('.stat-number').textContent = stats.done;
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

// ===== Task Actions =====
async function loadTasks() {
    try {
        elements.todoTasks.innerHTML = '<p class="loading">Loading...</p>';
        elements.progressTasks.innerHTML = '<p class="loading">Loading...</p>';
        elements.doneTasks.innerHTML = '<p class="loading">Loading...</p>';
        
        const response = await taskAPI.getAll();
        tasks = response.data;
        renderTasks();
        await updateStats();
        updateConnectionStatus(true);
    } catch (error) {
        showToast('Failed to load tasks', 'error');
        updateConnectionStatus(false, error.message);
    }
}

async function createTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    if (!title) {
        showToast('Title is required', 'error');
        return;
    }
    
    try {
        await taskAPI.create({ title, description, priority });
        showToast('Task created successfully');
        
        // Reset form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'MEDIUM';
        
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function moveTask(id) {
    try {
        await taskAPI.moveNext(id);
        showToast('Task moved');
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        await taskAPI.delete(id);
        showToast('Task deleted');
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== Modal Functions =====
async function openEditModal(id) {
    try {
        const response = await taskAPI.getById(id);
        const task = response.data;
        
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTitle').value = task.title;
        document.getElementById('editDescription').value = task.description || '';
        document.getElementById('editStatus').value = task.status;
        document.getElementById('editPriority').value = task.priority;
        
        elements.editModal.classList.add('show');
    } catch (error) {
        showToast('Failed to load task', 'error');
    }
}

function closeEditModal() {
    elements.editModal.classList.remove('show');
}

async function saveTask(event) {
    event.preventDefault();
    
    const id = document.getElementById('editTaskId').value;
    const data = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        status: document.getElementById('editStatus').value,
        priority: document.getElementById('editPriority').value
    };
    
    try {
        await taskAPI.update(id, data);
        showToast('Task updated');
        closeEditModal();
        await loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function checkHealth() {
    try {
        const response = await taskAPI.healthCheck();
        updateConnectionStatus(response.success);
        console.log('Health check:', response);
    } catch (error) {
        updateConnectionStatus(false, 'API Unavailable');
    }
}

// ===== Event Listeners =====
elements.addTaskForm.addEventListener('submit', createTask);
elements.editTaskForm.addEventListener('submit', saveTask);

// Close modal on outside click
elements.editModal.addEventListener('click', (e) => {
    if (e.target === elements.editModal) {
        closeEditModal();
    }
});

// Close modal on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditModal();
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Task Board - N-Tier Architecture');
    console.log('📡 API Base URL:', API_BASE_URL);
    
    //await checkHealth();
    await loadTasks();
    
    // Auto-refresh every 30 seconds
    setInterval(loadTasks, 30000);
});