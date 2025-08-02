// Manager Dashboard JavaScript
class ManagerDashboard {
    constructor() {
        this.tasks = [];
        this.currentUser = null;
        this.checkAuth();
        this.init();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userRole = sessionStorage.getItem('userRole');
        
        if (isLoggedIn !== 'true' || userRole !== 'manager') {
            window.location.href = 'welcome.html';
            return;
        }
        
        // Check if login is still valid (24 hours)
        const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0');
        const now = Date.now();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            this.logout();
            return;
        }

        this.currentUser = {
            username: sessionStorage.getItem('username'),
            role: userRole
        };
    }

    init() {
        this.loadTasks();
        this.loadWorkers();
        this.loadTransferRequests();
        this.setupEventListeners();
        this.render();
        this.renderWorkers();
        this.renderTransferRequests();
        this.updateStats();
        this.displayUsername();
    }

    setupEventListeners() {
        // Add worker functionality
        document.getElementById('addWorkerBtn').addEventListener('click', () => {
            this.showAddWorkerModal();
        });

        document.getElementById('closeAddWorkerModal').addEventListener('click', () => {
            this.hideAddWorkerModal();
        });

        document.getElementById('saveWorkerBtn').addEventListener('click', () => {
            this.saveWorker();
        });

        // Add task functionality
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            const workers = this.getWorkers();
            if (workers.length === 0) {
                this.showToast('יש להוסיף עובד תחילה לפני יצירת משימות!', 'error');
                return;
            }
            this.showAddTaskModal();
        });

        document.getElementById('closeAddTaskModal').addEventListener('click', () => {
            this.hideAddTaskModal();
        });

        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            this.saveTask();
        });

        // Task details modal
        document.getElementById('closeTaskDetailsModal').addEventListener('click', () => {
            this.hideTaskDetailsModal();
        });

        document.getElementById('editTaskBtn').addEventListener('click', () => {
            this.editTask();
        });

        document.getElementById('deleteTaskBtn').addEventListener('click', () => {
            this.deleteTask();
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Filter functionality
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterTasks();
        });

        // Transfer requests filter
        document.getElementById('transferStatusFilter').addEventListener('change', () => {
            this.filterTransferRequests();
        });

        // Close modals when clicking outside
        document.getElementById('addTaskModal').addEventListener('click', (e) => {
            if (e.target.id === 'addTaskModal') {
                this.hideAddTaskModal();
            }
        });

        document.getElementById('taskDetailsModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskDetailsModal') {
                this.hideTaskDetailsModal();
            }
        });

        document.getElementById('addWorkerModal').addEventListener('click', (e) => {
            if (e.target.id === 'addWorkerModal') {
                this.hideAddWorkerModal();
            }
        });
    }

    displayUsername() {
        const usernameElement = document.getElementById('username');
        if (usernameElement && this.currentUser) {
            usernameElement.textContent = this.currentUser.username;
        }
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('manager-tasks');
            if (saved) {
                this.tasks = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('manager-tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    loadWorkers() {
        try {
            const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
            const workers = users.filter(user => user.role === 'worker');
            
            const workerSelect = document.getElementById('assignedWorker');
            if (workerSelect) {
                workerSelect.innerHTML = '<option value="">בחר עובד</option>';
                
                if (workers.length === 0) {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'אין עובדים במערכת - הוסף עובד תחילה';
                    option.disabled = true;
                    workerSelect.appendChild(option);
                } else {
                    workers.forEach(worker => {
                        const option = document.createElement('option');
                        option.value = worker.username;
                        option.textContent = worker.fullName || worker.username;
                        workerSelect.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading workers:', error);
        }
    }

    loadTransferRequests() {
        try {
            const requests = localStorage.getItem('transferRequests');
            this.transferRequests = requests ? JSON.parse(requests) : [];
        } catch (error) {
            console.error('Error loading transfer requests:', error);
            this.transferRequests = [];
        }
    }

    showAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        modal.classList.add('show');
        
        // Load workers for the dropdown
        this.loadWorkers();
        
        // Clear form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('assignedWorker').value = '';
        document.getElementById('taskDeadline').value = '';
        document.getElementById('taskPriority').value = 'medium';
        
        // Set default deadline to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        document.getElementById('taskDeadline').value = tomorrow.toISOString().slice(0, 16);
    }

    hideAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        modal.classList.remove('show');
    }

    saveTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const assignedWorker = document.getElementById('assignedWorker').value;
        const deadline = document.getElementById('taskDeadline').value;
        const priority = document.getElementById('taskPriority').value;

        if (!title) {
            this.showToast('יש להזין כותרת למשימה!', 'error');
            return;
        }

        if (!assignedWorker) {
            this.showToast('יש לבחור עובד אחראי!', 'error');
            return;
        }

        if (!deadline) {
            this.showToast('יש להזין תאריך יעד!', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            title: title,
            description: description,
            assignedWorker: assignedWorker,
            deadline: deadline,
            priority: priority,
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser.username
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.render();
        this.updateStats();
        this.hideAddTaskModal();
        this.showToast('משימה נוספה בהצלחה!', 'success');
    }

    render() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');

        if (this.tasks.length === 0) {
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        tasksList.style.display = 'flex';
        emptyState.style.display = 'none';

        const filteredTasks = this.getFilteredTasks();

        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.priority}" data-id="${task.id}" onclick="managerDashboard.showTaskDetails(${task.id})">
                <div class="task-header">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-priority ${task.priority}">${this.getPriorityText(task.priority)}</div>
                </div>
                <div class="task-meta">
                    <span><i class="fas fa-user"></i> ${task.assignedWorker}</span>
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(task.deadline)}</span>
                    <span class="task-status ${task.status}">${this.getStatusText(task.status)}</span>
                </div>
            </div>
        `).join('');
    }

    getFilteredTasks() {
        const filter = document.getElementById('statusFilter').value;
        if (filter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.status === filter);
    }

    filterTasks() {
        this.render();
    }

    showTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const content = document.getElementById('taskDetailsContent');
        content.innerHTML = `
            <div class="task-details">
                <h4>${this.escapeHtml(task.title)}</h4>
                <p><strong>תיאור:</strong> ${this.escapeHtml(task.description || 'אין תיאור')}</p>
                <p><strong>עובד אחראי:</strong> ${task.assignedWorker}</p>
                <p><strong>תאריך יעד:</strong> ${this.formatDate(task.deadline)}</p>
                <p><strong>עדיפות:</strong> <span class="task-priority ${task.priority}">${this.getPriorityText(task.priority)}</span></p>
                <p><strong>סטטוס:</strong> <span class="task-status ${task.status}">${this.getStatusText(task.status)}</span></p>
                <p><strong>נוצר על ידי:</strong> ${task.createdBy}</p>
                <p><strong>תאריך יצירה:</strong> ${this.formatDate(task.createdAt)}</p>
            </div>
        `;

        // Store current task ID for edit/delete operations
        this.currentTaskId = taskId;

        const modal = document.getElementById('taskDetailsModal');
        modal.classList.add('show');
    }

    hideTaskDetailsModal() {
        const modal = document.getElementById('taskDetailsModal');
        modal.classList.remove('show');
        this.currentTaskId = null;
    }

    editTask() {
        // For now, just show a message. In a real app, you'd open an edit modal
        this.showToast('פונקציונליות עריכה תתווסף בקרוב!', 'error');
    }

    deleteTask() {
        if (!this.currentTaskId) return;

        if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
            this.tasks = this.tasks.filter(task => task.id !== this.currentTaskId);
            this.saveTasks();
            this.render();
            this.updateStats();
            this.hideTaskDetailsModal();
            this.showToast('משימה נמחקה בהצלחה!', 'success');
        }
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(task => task.status === 'pending').length;
        const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
        const totalWorkers = this.getWorkers().length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('totalWorkers').textContent = totalWorkers;
    }

    renderWorkers() {
        const workersList = document.getElementById('workersList');
        const emptyState = document.getElementById('workersEmptyState');

        if (!workersList || !emptyState) return;

        const workers = this.getWorkers();

        if (workers.length === 0) {
            workersList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        workersList.style.display = 'grid';
        emptyState.style.display = 'none';

        workersList.innerHTML = workers.map(worker => {
            const workerTasks = this.tasks.filter(task => task.assignedWorker === worker.username);
            const completedTasks = workerTasks.filter(task => task.status === 'completed').length;
            const pendingTasks = workerTasks.filter(task => task.status === 'pending').length;

            return `
                <div class="worker-item">
                    <div class="worker-header">
                        <div class="worker-name">${this.escapeHtml(worker.fullName)}</div>
                        <div class="worker-actions">
                            <button class="btn btn-secondary edit-worker-btn" data-worker-id="${worker.username}" style="padding: 5px 10px; font-size: 0.8rem;">
                                <i class="fas fa-edit"></i> ערוך
                            </button>
                            <button class="btn btn-danger delete-worker-btn" data-worker-id="${worker.username}" style="padding: 5px 10px; font-size: 0.8rem;">
                                <i class="fas fa-trash"></i> מחק
                            </button>
                        </div>
                    </div>
                    <div class="worker-username">@${worker.username}</div>
                    ${worker.email ? `<div class="worker-email">${this.escapeHtml(worker.email)}</div>` : ''}
                    <div class="worker-stats">
                        <div class="worker-stat">
                            <i class="fas fa-tasks"></i>
                            <span>${workerTasks.length} משימות</span>
                        </div>
                        <div class="worker-stat">
                            <i class="fas fa-check-circle"></i>
                            <span>${completedTasks} הושלמו</span>
                        </div>
                        <div class="worker-stat">
                            <i class="fas fa-clock"></i>
                            <span>${pendingTasks} ממתינות</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-worker-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const workerId = btn.getAttribute('data-worker-id');
                this.editWorker(workerId);
            });
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-worker-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const workerId = btn.getAttribute('data-worker-id');
                this.deleteWorker(workerId);
            });
        });
    }

    renderTransferRequests() {
        const requestsList = document.getElementById('transferRequestsList');
        const emptyState = document.getElementById('transferRequestsEmptyState');

        if (!requestsList || !emptyState) return;

        if (this.transferRequests.length === 0) {
            requestsList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        requestsList.style.display = 'flex';
        emptyState.style.display = 'none';

        const filteredRequests = this.getFilteredTransferRequests();

        requestsList.innerHTML = filteredRequests.map(request => {
            const fromWorker = this.getWorkers().find(w => w.username === request.fromWorker);
            const toWorker = this.getWorkers().find(w => w.username === request.toWorker);
            
            return `
                <div class="transfer-request-item ${request.status}">
                    <div class="transfer-request-header">
                        <div class="transfer-request-title">${this.escapeHtml(request.taskTitle)}</div>
                        <div class="transfer-request-status ${request.status}">${this.getTransferStatusText(request.status)}</div>
                    </div>
                    <div class="transfer-request-details">
                        <strong>מעובד:</strong> ${this.escapeHtml(fromWorker?.fullName || request.fromWorker)} 
                        <i class="fas fa-arrow-right"></i> 
                        <strong>לעובד:</strong> ${this.escapeHtml(toWorker?.fullName || request.toWorker)}
                    </div>
                    <div class="transfer-request-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(request.createdAt)}</span>
                        <span><i class="fas fa-user"></i> ${this.escapeHtml(fromWorker?.fullName || request.fromWorker)}</span>
                    </div>
                    ${request.status === 'pending' ? `
                        <div class="transfer-request-actions">
                            <button class="btn btn-success" onclick="managerDashboard.approveTransferRequest(${request.id})">
                                <i class="fas fa-check"></i> אשר העברה
                            </button>
                            <button class="btn btn-danger" onclick="managerDashboard.rejectTransferRequest(${request.id})">
                                <i class="fas fa-times"></i> דחה
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    getFilteredTransferRequests() {
        const statusFilter = document.getElementById('transferStatusFilter').value;
        if (statusFilter === 'all') {
            return this.transferRequests;
        }
        return this.transferRequests.filter(request => request.status === statusFilter);
    }

    filterTransferRequests() {
        this.renderTransferRequests();
    }

    approveTransferRequest(requestId) {
        const request = this.transferRequests.find(r => r.id === requestId);
        if (!request) return;

        if (confirm('האם אתה בטוח שברצונך לאשר את העברת המשימה?')) {
            // עדכון המשימה
            const task = this.tasks.find(t => t.id === request.taskId);
            if (task) {
                task.assignedWorker = request.toWorker;
                this.saveTasks();
            }

            // עדכון סטטוס הבקשה
            request.status = 'approved';
            this.saveTransferRequests();

            this.renderTransferRequests();
            this.render();
            this.updateStats();
            this.showToast('העברת המשימה אושרה בהצלחה!', 'success');
        }
    }

    rejectTransferRequest(requestId) {
        const request = this.transferRequests.find(r => r.id === requestId);
        if (!request) return;

        if (confirm('האם אתה בטוח שברצונך לדחות את בקשת ההעברה?')) {
            request.status = 'rejected';
            this.saveTransferRequests();

            this.renderTransferRequests();
            this.showToast('בקשת ההעברה נדחתה', 'error');
        }
    }

    saveTransferRequests() {
        try {
            localStorage.setItem('transferRequests', JSON.stringify(this.transferRequests));
        } catch (error) {
            console.error('Error saving transfer requests:', error);
        }
    }

    getTransferStatusText(status) {
        const texts = {
            'pending': 'ממתינה',
            'approved': 'אושרה',
            'rejected': 'נדחתה'
        };
        return texts[status] || status;
    }

    editWorker(workerId) {
        const users = this.getUsers();
        const worker = users.find(user => user.username === workerId);
        
        if (!worker) {
            this.showToast('עובד לא נמצא!', 'error');
            return;
        }

        // For now, show worker details and allow editing
        const newPassword = prompt(`עריכת פרטי העובד: ${worker.fullName}\n\nהכנס סיסמה חדשה (השאר ריק אם לא רוצה לשנות):`);
        
        if (newPassword !== null) {
            if (newPassword.trim() !== '') {
                worker.password = newPassword.trim();
                localStorage.setItem('appUsers', JSON.stringify(users));
                this.showToast('סיסמה עודכנה בהצלחה!', 'success');
            }
        }
    }

    deleteWorker(workerId) {
        const users = this.getUsers();
        const worker = users.find(user => user.username === workerId);
        
        if (!worker) {
            this.showToast('עובד לא נמצא!', 'error');
            return;
        }

        // Check if worker has assigned tasks
        const workerTasks = this.tasks.filter(task => task.assignedWorker === workerId);
        if (workerTasks.length > 0) {
            const confirmDelete = confirm(
                `העובד "${worker.fullName}" יש לו ${workerTasks.length} משימות מוקצות.\n\n` +
                `האם אתה בטוח שברצונך למחוק את העובד? המשימות יישארו ללא עובד אחראי.`
            );
            if (!confirmDelete) return;
        }

        const confirmDelete = confirm(
            `האם אתה בטוח שברצונך למחוק את העובד "${worker.fullName}"?\n\n` +
            `פעולה זו לא ניתנת להחזר.`
        );

        if (confirmDelete) {
            // Remove worker from users
            const updatedUsers = users.filter(user => user.username !== workerId);
            localStorage.setItem('appUsers', JSON.stringify(updatedUsers));

            // Update tasks to remove worker assignment
            this.tasks.forEach(task => {
                if (task.assignedWorker === workerId) {
                    task.assignedWorker = '';
                    task.assignedWorkerName = '';
                }
            });
            this.saveTasks();

            this.renderWorkers();
            this.updateStats();
            this.showToast(`העובד "${worker.fullName}" נמחק בהצלחה!`, 'success');
        }
    }

    showAddWorkerModal() {
        const modal = document.getElementById('addWorkerModal');
        modal.classList.add('show');
        
        // Clear form
        document.getElementById('workerUsername').value = '';
        document.getElementById('workerPassword').value = '';
        document.getElementById('workerFullName').value = '';
        document.getElementById('workerEmail').value = '';
    }

    hideAddWorkerModal() {
        const modal = document.getElementById('addWorkerModal');
        modal.classList.remove('show');
    }

    saveWorker() {
        const username = document.getElementById('workerUsername').value.trim();
        const password = document.getElementById('workerPassword').value;
        const fullName = document.getElementById('workerFullName').value.trim();
        const email = document.getElementById('workerEmail').value.trim();

        if (!username || username.length < 3) {
            this.showToast('שם משתמש חייב להיות לפחות 3 תווים!', 'error');
            return;
        }

        if (!password || password.length < 4) {
            this.showToast('סיסמה חייבת להיות לפחות 4 תווים!', 'error');
            return;
        }

        if (!fullName) {
            this.showToast('יש להזין שם מלא!', 'error');
            return;
        }

        // Check if username already exists
        const users = this.getUsers();
        if (users.find(user => user.username === username)) {
            this.showToast('שם משתמש זה כבר קיים במערכת!', 'error');
            return;
        }

        // Create new worker
        const newWorker = {
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            role: 'worker',
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser.username
        };

        // Save worker
        users.push(newWorker);
        localStorage.setItem('appUsers', JSON.stringify(users));

        this.hideAddWorkerModal();
        this.renderWorkers();
        this.updateStats();
        this.showToast('עובד נוסף בהצלחה!', 'success');
    }

    getUsers() {
        try {
            const users = localStorage.getItem('appUsers');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    getWorkers() {
        try {
            const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
            return users.filter(user => user.role === 'worker');
        } catch (error) {
            console.error('Error loading workers:', error);
            return [];
        }
    }

    getPriorityText(priority) {
        const texts = {
            'low': 'נמוכה',
            'medium': 'בינונית',
            'high': 'גבוהה',
            'urgent': 'דחופה'
        };
        return texts[priority] || priority;
    }

    getStatusText(status) {
        const texts = {
            'pending': 'ממתינה',
            'in-progress': 'בביצוע',
            'completed': 'הושלמה'
        };
        return texts[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    logout() {
        if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loginTime');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('userRole');
            window.location.href = 'welcome.html';
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize manager dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.managerDashboard = new ManagerDashboard();
}); 