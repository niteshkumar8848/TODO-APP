const API_BASE = 'http://localhost:5000/api';
let currentEditId = null;

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/login';
        return;
    }

    document.getElementById('usernameDisplay').textContent = `Welcome, ${user.username}`;
    loadTasks();

    // Modal functionality
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

// Load tasks from API
async function loadTasks() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else if (response.status === 401) {
            logout();
        } else {
            throw new Error('Failed to load tasks');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showMessage('Error loading tasks. Please try again.', 'error');
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No tasks yet. Add your first task above!</p>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => {
        const deadline = task.deadline ? new Date(task.deadline) : null;
        const now = new Date();
        const isOverdue = deadline && deadline < now && !task.completed;
        
        return `
        <div class="task-item ${task.completed ? 'task-completed' : ''} priority-${task.priority} ${isOverdue ? 'task-overdue' : ''}">
            <div class="task-header">
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                </div>
                <div class="task-meta">
                    ${deadline ? `
                        <span class="deadline ${isOverdue ? 'overdue' : ''}">
                            📅 ${deadline.toLocaleString()}
                            ${isOverdue ? ' (Overdue)' : ''}
                        </span>
                    ` : ''}
                    <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask('${task._id}', ${!task.completed})" 
                        class="btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}">
                    ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button onclick="openEditModal('${task._id}')" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="deleteTask('${task._id}')" class="btn btn-sm btn-danger">Delete</button>
            </div>
        </div>
        `;
    }).join('');
}

// Add new task
document.getElementById('taskForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;

    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        deadline: document.getElementById('taskDeadline').value || null,
        priority: document.getElementById('taskPriority').value
    };

    if (!taskData.title) {
        showMessage('Task title is required', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            document.getElementById('taskForm').reset();
            loadTasks();
            showMessage('Task added successfully!', 'success');
        } else if (response.status === 401) {
            logout();
        } else {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showMessage('Error adding task', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Open edit modal
async function openEditModal(taskId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            const task = tasks.find(t => t._id === taskId);
            
            if (task) {
                document.getElementById('editTaskId').value = task._id;
                document.getElementById('editTaskTitle').value = task.title;
                document.getElementById('editTaskDescription').value = task.description || '';
                document.getElementById('editTaskPriority').value = task.priority;
                
                if (task.deadline) {
                    const deadline = new Date(task.deadline);
                    document.getElementById('editTaskDeadline').value = 
                        deadline.toISOString().slice(0, 16);
                } else {
                    document.getElementById('editTaskDeadline').value = '';
                }

                document.getElementById('editModal').style.display = 'block';
                currentEditId = taskId;
            }
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error loading task for edit:', error);
        showMessage('Error loading task', 'error');
    }
}

// Update task
document.getElementById('editTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;

    const taskData = {
        title: document.getElementById('editTaskTitle').value.trim(),
        description: document.getElementById('editTaskDescription').value.trim(),
        deadline: document.getElementById('editTaskDeadline').value || null,
        priority: document.getElementById('editTaskPriority').value
    };

    if (!taskData.title) {
        showMessage('Task title is required', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/tasks/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            document.getElementById('editModal').style.display = 'none';
            loadTasks();
            showMessage('Task updated successfully!', 'success');
        } else if (response.status === 401) {
            logout();
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showMessage('Error updating task', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Toggle task completion
async function toggleTask(taskId, completed) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            loadTasks();
            showMessage(`Task marked as ${completed ? 'completed' : 'incomplete'}!`, 'success');
        } else if (response.status === 401) {
            logout();
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showMessage('Error updating task', 'error');
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadTasks();
            showMessage('Task deleted successfully!', 'success');
        } else if (response.status === 401) {
            logout();
        } else {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showMessage('Error deleting task', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Show message function
function showMessage(message, type) {
    let messageDiv = document.getElementById('message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        document.querySelector('.container').prepend(messageDiv);
    }

    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Utility function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}