// Family Dashboard JavaScript
class FamilyDashboard {
    constructor() {
        this.members = [];
        this.tasks = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadData();
        this.setupEventListeners();
        this.render();
        this.updateStats();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'index.html';
            return;
        }
    }

    setupEventListeners() {
        // Add member functionality
        document.getElementById('addMemberBtn').addEventListener('click', () => this.showAddMemberModal());
        document.getElementById('closeAddMemberModal').addEventListener('click', () => this.hideAddMemberModal());
        document.getElementById('addMemberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMember();
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Quick actions
        document.getElementById('viewAllTasksBtn').addEventListener('click', () => this.viewAllTasks());
        document.getElementById('assignTasksBtn').addEventListener('click', () => this.assignTasks());
        document.getElementById('reportsBtn').addEventListener('click', () => this.showReports());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());

        // Close modal when clicking outside
        document.getElementById('addMemberModal').addEventListener('click', (e) => {
            if (e.target.id === 'addMemberModal') {
                this.hideAddMemberModal();
            }
        });
    }

    loadData() {
        // Load family members
        const savedMembers = localStorage.getItem('familyMembers');
        if (savedMembers) {
            this.members = JSON.parse(savedMembers);
        } else {
            // Add default members for demo
            this.members = [
                {
                    id: 1,
                    name: 'אבא',
                    role: 'parent',
                    age: 35,
                    color: '#ff6b6b',
                    tasks: 5,
                    completed: 3
                },
                {
                    id: 2,
                    name: 'אמא',
                    role: 'parent',
                    age: 32,
                    color: '#4ecdc4',
                    tasks: 4,
                    completed: 2
                },
                {
                    id: 3,
                    name: 'יוסי',
                    role: 'child',
                    age: 8,
                    color: '#45b7d1',
                    tasks: 3,
                    completed: 1
                },
                {
                    id: 4,
                    name: 'שירה',
                    role: 'child',
                    age: 5,
                    color: '#96ceb4',
                    tasks: 2,
                    completed: 2
                }
            ];
            this.saveMembers();
        }

        // Load tasks
        const savedTasks = localStorage.getItem('checklist-items');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }

    saveMembers() {
        localStorage.setItem('familyMembers', JSON.stringify(this.members));
    }

    render() {
        this.renderMembers();
    }

    renderMembers() {
        const membersContainer = document.getElementById('familyMembers');
        
        if (this.members.length === 0) {
            membersContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>אין חברי משפחה</h3>
                    <p>הוסף חבר משפחה ראשון כדי להתחיל!</p>
                </div>
            `;
            return;
        }

        membersContainer.innerHTML = this.members.map(member => `
            <div class="member-card" style="--member-color: ${member.color}">
                <div class="member-header">
                    <div class="member-avatar">
                        ${member.name.charAt(0)}
                    </div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p>${this.getRoleText(member.role)} • גיל ${member.age}</p>
                    </div>
                </div>
                <div class="member-stats">
                    <div class="member-stat">
                        <span>${member.tasks}</span>
                        <label>משימות</label>
                    </div>
                    <div class="member-stat">
                        <span>${member.completed}</span>
                        <label>הושלמו</label>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn btn-secondary" onclick="dashboard.viewMemberTasks(${member.id})">
                        <i class="fas fa-eye"></i> צפה במשימות
                    </button>
                    <button class="btn btn-danger" onclick="dashboard.deleteMember(${member.id})">
                        <i class="fas fa-trash"></i> מחק
                    </button>
                </div>
            </div>
        `).join('');
    }

    getRoleText(role) {
        const roles = {
            'parent': 'הורה',
            'child': 'ילד',
            'teenager': 'מתבגר'
        };
        return roles[role] || role;
    }

    updateStats() {
        const totalMembers = this.members.length;
        const totalTasks = this.members.reduce((sum, member) => sum + member.tasks, 0);
        const completedTasks = this.members.reduce((sum, member) => sum + member.completed, 0);
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        document.getElementById('totalMembers').textContent = totalMembers;
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
    }

    showAddMemberModal() {
        const modal = document.getElementById('addMemberModal');
        modal.classList.add('show');
        
        // Clear form
        document.getElementById('addMemberForm').reset();
    }

    hideAddMemberModal() {
        const modal = document.getElementById('addMemberModal');
        modal.classList.remove('show');
    }

    addMember() {
        const name = document.getElementById('memberName').value.trim();
        const role = document.getElementById('memberRole').value;
        const age = parseInt(document.getElementById('memberAge').value) || 0;
        const color = document.getElementById('memberColor').value;

        if (!name || !role) {
            this.showToast('אנא מלא את כל השדות הנדרשים!', 'error');
            return;
        }

        const newMember = {
            id: Date.now(),
            name: name,
            role: role,
            age: age,
            color: color,
            tasks: 0,
            completed: 0
        };

        this.members.push(newMember);
        this.saveMembers();
        this.render();
        this.updateStats();
        this.hideAddMemberModal();
        this.showToast('חבר משפחה נוסף בהצלחה!');
    }

    deleteMember(memberId) {
        if (confirm('האם אתה בטוח שברצונך למחוק את חבר המשפחה?')) {
            this.members = this.members.filter(member => member.id !== memberId);
            this.saveMembers();
            this.render();
            this.updateStats();
            this.showToast('חבר משפחה נמחק בהצלחה!');
        }
    }

    viewMemberTasks(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            this.showToast(`צפייה במשימות של ${member.name}`, 'success');
            // Here you can implement task viewing functionality
        }
    }

    viewAllTasks() {
        window.location.href = 'app.html';
    }

    assignTasks() {
        this.showToast('פונקציונליות הקצאת משימות תתווסף בקרוב!', 'success');
    }

    showReports() {
        this.showToast('דוחות ביצועים יוצגו בקרוב!', 'success');
    }

    showSettings() {
        this.showToast('הגדרות משפחה יוצגו בקרוב!', 'success');
    }

    logout() {
        if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loginTime');
            window.location.href = 'index.html';
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FamilyDashboard();
}); 