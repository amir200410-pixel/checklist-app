// Login functionality
class LoginManager {
    constructor() {
        this.defaultPassword = '1234';
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
        }, 1000);
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Allow Enter key to submit
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });
    }

    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            this.redirectToApp();
        }
    }

    handleLogin() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();
        
        if (!enteredUsername) {
            this.showToast('יש להזין שם משתמש!', 'error');
            usernameInput.focus();
            return;
        }
        
        if (!enteredPassword) {
            this.showToast('יש להזין סיסמה!', 'error');
            passwordInput.focus();
            return;
        }
        
        // Get users from localStorage
        const users = this.getUsers();
        const user = users.find(u => u.username === enteredUsername && u.password === enteredPassword);
        
        if (user) {
            // Set login status
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loginTime', Date.now().toString());
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('userRole', user.role);
            
            this.showToast('התחברת בהצלחה!', 'success');
            
            // Redirect to appropriate dashboard
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else if (user.role === 'manager') {
                    window.location.href = 'manager-dashboard.html';
                } else {
                    window.location.href = 'worker-dashboard.html';
                }
            }, 1000);
        } else {
            this.showToast('שם משתמש או סיסמה שגויים!', 'error');
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
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    redirectToApp() {
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'manager') {
            window.location.href = 'manager-dashboard.html';
        } else {
            window.location.href = 'worker-dashboard.html';
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

// פונקציה לכפתור חזור
window.goBack = function() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = 'welcome.html';
    }
};

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
}); 