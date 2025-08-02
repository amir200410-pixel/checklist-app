// Worker Login functionality
class WorkerLoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
        
        // בדיקה שהמנהל המשותף נטען
        setTimeout(() => {
            console.log('🔍 בדיקת מנהל אחסון משותף:', {
                sharedStorage: !!window.sharedStorage,
                cache: window.sharedStorage?.cache ? Object.keys(window.sharedStorage.cache) : 'לא נטען'
            });
            
            // עדכון מספר משתמשים
            this.updateUserCount();
        }, 1000);
    }

    setupEventListeners() {
        const workerLoginForm = document.getElementById('workerLoginForm');
        const toggleWorkerPassword = document.getElementById('toggleWorkerPassword');
        const workerPasswordInput = document.getElementById('workerPassword');

        workerLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWorkerLogin();
        });

        toggleWorkerPassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Allow Enter key to submit
        workerPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleWorkerLogin();
            }
        });
    }

    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userRole = sessionStorage.getItem('userRole');
        
        if (isLoggedIn === 'true' && userRole === 'worker') {
            this.redirectToWorkerDashboard();
        }
    }

    handleWorkerLogin() {
        const usernameInput = document.getElementById('workerUsername');
        const passwordInput = document.getElementById('workerPassword');
        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();
        
        console.log('ניסיון התחברות:', { username: enteredUsername, password: enteredPassword ? '***' : 'ריק' });
        
        if (!enteredUsername) {
            this.showToast('יש להזין שם משתמש! (לדוגמה: worker1)', 'error');
            usernameInput.focus();
            return;
        }
        
        if (!enteredPassword) {
            this.showToast('יש להזין סיסמה! (לדוגמה: 1234)', 'error');
            passwordInput.focus();
            return;
        }
        
        // Get users from shared storage
        const users = this.getUsers();
        console.log('משתמשים במערכת:', users.map(u => ({ username: u.username, role: u.role })));
        console.log('מקור הנתונים:', window.sharedStorage ? 'Shared Storage' : 'LocalStorage');
        
        const worker = users.find(u => 
            u.username === enteredUsername && 
            u.password === enteredPassword && 
            u.role === 'worker'
        );
        
        if (worker) {
            // Set login status
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loginTime', Date.now().toString());
            sessionStorage.setItem('username', worker.username);
            sessionStorage.setItem('userRole', 'worker');
            
            console.log('משתמש התחבר בהצלחה:', worker.username);
            console.log('sessionStorage נשמר:', {
                isLoggedIn: sessionStorage.getItem('isLoggedIn'),
                username: sessionStorage.getItem('username'),
                userRole: sessionStorage.getItem('userRole')
            });
            this.showToast(`התחברת בהצלחה כעובד: ${worker.username}! 🎉`, 'success');
            
            // Redirect to worker dashboard
            setTimeout(() => {
                window.location.href = 'worker-dashboard.html';
            }, 1000);
        } else {
            // Check if user exists but is not a worker
            const user = users.find(u => u.username === enteredUsername && u.password === enteredPassword);
            if (user && user.role !== 'worker') {
                this.showToast('חשבון זה אינו של עובד! נסה להתחבר עם חשבון עובד.', 'error');
            } else {
                this.showToast('שם משתמש או סיסמה שגויים! נסה: worker1 / 1234', 'error');
            }
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    getUsers() {
        try {
            // קודם מנסה מהמנהל המשותף, אחר כך מ-localStorage
            if (window.sharedStorage) {
                return window.sharedStorage.getUsers();
            }
            
            const users = localStorage.getItem('appUsers');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('workerPassword');
        const toggleBtn = document.getElementById('toggleWorkerPassword');
        const icon = toggleBtn.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    redirectToWorkerDashboard() {
        window.location.href = 'worker-dashboard.html';
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
    
    updateUserCount() {
        const userCountElement = document.getElementById('userCount');
        if (userCountElement && window.sharedStorage) {
            const users = window.sharedStorage.getUsers();
            const workers = users.filter(u => u.role === 'worker').length;
            const managers = users.filter(u => u.role === 'manager').length;
            
            userCountElement.innerHTML = `
                <i class="fas fa-users"></i> 
                ${users.length} משתמשים במערכת (${workers} עובדים, ${managers} מנהלים)
            `;
        }
    }
}

// פונקציה לבדיקת נתונים
window.checkData = function() {
    console.log('🔍 בדיקת נתונים...');
    
    // בדיקת localStorage
    const localUsers = localStorage.getItem('appUsers');
    console.log('📱 localStorage users:', localUsers ? JSON.parse(localUsers).length : 0);
    
    // בדיקת shared storage
    if (window.sharedStorage) {
        const sharedUsers = window.sharedStorage.getUsers();
        console.log('🌐 Shared storage users:', sharedUsers.length);
        
        // בדיקת שרת
        fetch('http://192.168.1.8:3000/api/data')
            .then(response => response.json())
            .then(data => {
                console.log('🖥️ Server users:', data.data.appUsers.length);
                alert(`נתונים:\n- localStorage: ${localUsers ? JSON.parse(localUsers).length : 0} משתמשים\n- Shared storage: ${sharedUsers.length} משתמשים\n- Server: ${data.data.appUsers.length} משתמשים`);
            })
            .catch(error => {
                console.error('שגיאה בבדיקת שרת:', error);
                alert(`נתונים:\n- localStorage: ${localUsers ? JSON.parse(localUsers).length : 0} משתמשים\n- Shared storage: ${sharedUsers.length} משתמשים\n- Server: שגיאה בחיבור`);
            });
    } else {
        alert('Shared storage לא זמין!');
    }
};

// Initialize worker login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkerLoginManager();
}); 