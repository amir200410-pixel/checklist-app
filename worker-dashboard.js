// Worker Dashboard JavaScript
class WorkerDashboard {
    constructor() {
        this.tasks = [];
        this.currentUser = null;
        this.checkAuth();
        this.init();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userRole = sessionStorage.getItem('userRole');
        
        if (isLoggedIn !== 'true' || userRole !== 'worker') {
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
        
        // בדיקה נוספת לוודא שהמשתמש נטען נכון
        console.log('משתמש נוכחי:', this.currentUser);
        if (!this.currentUser.username) {
            console.error('שם משתמש לא נמצא ב-sessionStorage');
        }
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.render();
        this.updateStats();
        this.displayUsername();
    }

    setupEventListeners() {
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    displayUsername() {
        const usernameElement = document.getElementById('username');
        if (usernameElement && this.currentUser) {
            // הצג את שם המשתמש בצורה ברורה יותר
            const username = this.currentUser.username || 'עובד';
            usernameElement.textContent = username;
            usernameElement.style.fontWeight = 'bold';
            usernameElement.style.color = '#667eea';
            console.log('מציג שם משתמש:', username);
        }
    }

    loadTasks() {
        try {
            // Load tasks from manager's storage and filter by assigned worker
            const saved = localStorage.getItem('manager-tasks');
            if (saved) {
                const allTasks = JSON.parse(saved);
                this.tasks = allTasks.filter(task => task.assignedWorker === this.currentUser.username);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    render() {
        const tasksList = document.getElementById('myTasksList');
        const emptyState = document.getElementById('emptyState');

        if (this.tasks.length === 0) {
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        tasksList.style.display = 'flex';
        emptyState.style.display = 'none';

        tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.priority}">
                <div class="task-header">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-priority ${task.priority}">${this.getPriorityText(task.priority)}</div>
                </div>
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(task.deadline)}</span>
                    <span class="task-status ${task.status}">${this.getStatusText(task.status)}</span>
                </div>
                <div class="task-actions">
                    ${this.getActionButtons(task)}
                </div>
            </div>
        `).join('');

        // Add event listeners to action buttons
        this.addActionEventListeners();
    }

    getActionButtons(task) {
        let buttons = '';
        
        if (task.status === 'pending') {
            buttons += `
                <button class="btn btn-warning start-task-btn" data-task-id="${task.id}">
                    <i class="fas fa-play"></i> התחל עבודה
                </button>
            `;
        } else if (task.status === 'in-progress') {
            buttons += `
                <button class="btn btn-success complete-task-btn" data-task-id="${task.id}">
                    <i class="fas fa-check"></i> סיים משימה
                </button>
            `;
        } else if (task.status === 'completed') {
            buttons += `
                <span class="task-status completed">הושלמה</span>
            `;
        }
        
        // הוספת כפתור "בקש העברה" רק למשימות שלא הושלמו
        if (task.status !== 'completed') {
            buttons += `
                <button class="btn btn-info request-transfer-btn" data-task-id="${task.id}">
                    <i class="fas fa-exchange-alt"></i> בקש העברה
                </button>
            `;
        }
        
        return buttons;
    }

    addActionEventListeners() {
        // Start task buttons
        document.querySelectorAll('.start-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = parseInt(btn.getAttribute('data-task-id'));
                this.startTask(taskId);
            });
        });

        // Complete task buttons
        document.querySelectorAll('.complete-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = parseInt(btn.getAttribute('data-task-id'));
                this.completeTask(taskId);
            });
        });

        // Request transfer buttons
        document.querySelectorAll('.request-transfer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = parseInt(btn.getAttribute('data-task-id'));
                this.showTransferDialog(taskId);
            });
        });
    }

    startTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm('האם אתה בטוח שברצונך להתחיל לעבוד על משימה זו?')) {
            task.status = 'in-progress';
            this.updateTaskInStorage(task);
            this.render();
            this.updateStats();
            this.showToast('התחלת לעבוד על המשימה!', 'success');
        }
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm('האם אתה בטוח שברצונך לסמן משימה זו כהושלמה?')) {
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            this.updateTaskInStorage(task);
            this.render();
            this.updateStats();
            this.showToast('משימה הושלמה בהצלחה!', 'success');
        }
    }

    updateTaskInStorage(updatedTask) {
        try {
            // Load all tasks from manager storage
            const saved = localStorage.getItem('manager-tasks');
            if (saved) {
                const allTasks = JSON.parse(saved);
                const taskIndex = allTasks.findIndex(task => task.id === updatedTask.id);
                
                if (taskIndex !== -1) {
                    allTasks[taskIndex] = updatedTask;
                    localStorage.setItem('manager-tasks', JSON.stringify(allTasks));
                }
            }
        } catch (error) {
            console.error('Error updating task in storage:', error);
        }
    }

    updateStats() {
        const myTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(task => task.status === 'pending').length;
        const completedTasks = this.tasks.filter(task => task.status === 'completed').length;

        document.getElementById('myTasks').textContent = myTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
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

    showTransferDialog(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // קבלת רשימת עובדים
        const workers = this.getWorkers();
        const availableWorkers = workers.filter(w => w.username !== this.currentUser.username);

        if (availableWorkers.length === 0) {
            this.showToast('אין עובדים אחרים זמינים להעברה', 'error');
            return;
        }

        // יצירת דיאלוג
        const dialog = document.createElement('div');
        dialog.className = 'transfer-dialog';
        dialog.innerHTML = `
            <div class="transfer-dialog-content">
                <h3>בקש העברת משימה</h3>
                <p>בחר עובד להעברת המשימה: <strong>${task.title}</strong></p>
                <select id="transferWorkerSelect" class="transfer-select">
                    <option value="">בחר עובד...</option>
                    ${availableWorkers.map(w => `<option value="${w.username}">${w.fullName || w.username}</option>`).join('')}
                </select>
                <div class="transfer-dialog-buttons">
                    <button class="btn btn-success" id="confirmTransfer">אשר העברה</button>
                    <button class="btn btn-secondary" id="cancelTransfer">ביטול</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Event listeners
        document.getElementById('confirmTransfer').addEventListener('click', () => {
            const selectedWorker = document.getElementById('transferWorkerSelect').value;
            if (!selectedWorker) {
                this.showToast('יש לבחור עובד', 'error');
                return;
            }
            this.submitTransferRequest(taskId, selectedWorker);
            document.body.removeChild(dialog);
        });

        document.getElementById('cancelTransfer').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }

    getWorkers() {
        try {
            const users = localStorage.getItem('appUsers');
            return users ? JSON.parse(users).filter(u => u.role === 'worker') : [];
        } catch (error) {
            console.error('Error loading workers:', error);
            return [];
        }
    }

    submitTransferRequest(taskId, toWorker) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const transferRequest = {
            id: Date.now(), // מזהה ייחודי
            taskId: taskId,
            fromWorker: this.currentUser.username,
            toWorker: toWorker,
            taskTitle: task.title,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // שמירת הבקשה
        this.saveTransferRequest(transferRequest);
        this.showToast('בקשת העברה נשלחה למנהל!', 'success');
    }

    saveTransferRequest(request) {
        try {
            const existingRequests = JSON.parse(localStorage.getItem('transferRequests') || '[]');
            existingRequests.push(request);
            localStorage.setItem('transferRequests', JSON.stringify(existingRequests));
        } catch (error) {
            console.error('Error saving transfer request:', error);
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

// Initialize worker dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.workerDashboard = new WorkerDashboard();
}); 