// app.js - Frontend Logic (SOLUTION CODE)
// Task Board Application

// ===== STATE =====
let allTasks = [];
let currentFilter = 'ALL';

// ===== DOM ELEMENTS =====
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

// Task lists
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

// Counters
const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');

// ===== API FUNCTIONS =====

async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch('/api/tasks');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allTasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('❌ Failed to load tasks. Please refresh the page.');
    } finally {
        hideLoading();
    }
}

async function createTask(taskData) {
    showLoading();
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create task');
        }
        
        const data = await response.json();
        allTasks.unshift(data.task); // Add to beginning
        renderTasks();
        
        // Reset form
        addTaskForm.reset();
        
        // Success message
        showNotification('✅ Task created successfully!', 'success');
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ ' + error.message);
    } finally {
        hideLoading();
    }
}

async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update status');
        }
        
        const data = await response.json();
        
        // Update local state
        const index = allTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            allTasks[index] = data.task;
        }
        
        renderTasks();
        showNotification(`✅ Task moved to ${newStatus.replace('_', ' ')}`, 'success');
    } catch (error) {
        console.error('Error updating status:', error);
        alert('❌ ' + error.message);
    } finally {
        hideLoading();
    }
}

async function deleteTask(taskId) {
    // Confirmation dialog
    if (!confirm('⚠️ Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete task');
        }
        
        // Remove from local state
        allTasks = allTasks.filter(t => t.id !== taskId);
        renderTasks();
        
        showNotification('✅ Task deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ ' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== RENDER FUNCTIONS =====

function renderTasks() {
    // Clear all lists
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';
    
    // Filter tasks
    let filteredTasks = allTasks;
    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }
    
    // Separate by status
    const todo = filteredTasks.filter(t => t.status === 'TODO');
    const progress = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
    const done = filteredTasks.filter(t => t.status === 'DONE');
    
    // Update counters
    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;
    
    // Render each column
    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}

function renderTaskList(tasks, container, currentStatus) {
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 No tasks here</p>
                <p style="font-size: 0.85em; color: #999;">
                    ${currentStatus === 'TODO' ? 'Add a new task to get started!' : 
                      currentStatus === 'IN_PROGRESS' ? 'Move tasks here when you start working' : 
                      'Complete tasks to see them here'}
                </p>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const card = createTaskCard(task, currentStatus);
        container.appendChild(card);
    });
}

function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-task-id', task.id);
    
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    
    // Format dates
    const createdDate = formatDate(task.created_at);
    const updatedDate = task.updated_at !== task.created_at ? formatDate(task.updated_at) : null;
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
            <div>📅 Created: ${createdDate}</div>
            ${updatedDate ? `<div>✏️ Updated: ${updatedDate}</div>` : ''}
        </div>
        <div class="task-actions">
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}

function createStatusButtons(taskId, currentStatus) {
    const buttons = [];
    
    if (currentStatus !== 'TODO') {
        buttons.push(`
            <button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">
                ← To Do
            </button>
        `);
    }
    
    if (currentStatus !== 'IN_PROGRESS') {
        buttons.push(`
            <button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                ${currentStatus === 'TODO' ? '→' : '←'} In Progress
            </button>
        `);
    }
    
    if (currentStatus !== 'DONE') {
        buttons.push(`
            <button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">
                → Done ✓
            </button>
        `);
    }
    
    return buttons.join('');
}

// ===== UTILITY FUNCTIONS =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    // If less than 24 hours, show relative time
    if (diffInHours < 24) {
        if (diffInHours < 1) {
            const minutes = Math.floor(diffInMs / (1000 * 60));
            return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
        }
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Simple notification (you can enhance this with a toast library)
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ===== EVENT LISTENERS =====

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    if (!title) {
        alert('⚠️ Please enter a task title');
        return;
    }
    
    if (title.length > 200) {
        alert('⚠️ Title is too long (max 200 characters)');
        return;
    }
    
    createTask({ title, description, priority });
});

statusFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTasks();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus on task title input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('taskTitle').focus();
    }
});

// ===== INITIALIZE =====

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 Task Board App Initialized', 'color: #667eea; font-size: 16px; font-weight: bold');
    console.log('%c📊 Architecture: Monolithic', 'color: #48bb78; font-size: 14px');
    console.log('%c💡 Keyboard shortcut: Ctrl/Cmd + K to add task', 'color: #999; font-size: 12px');
    
    fetchTasks();
});

// Auto-refresh every 30 seconds (optional)
// setInterval(fetchTasks, 30000);

// Make functions globally accessible for inline event handlers
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
