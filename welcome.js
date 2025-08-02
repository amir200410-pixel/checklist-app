// Welcome Screen JavaScript
class WelcomeManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
    }

    setupEventListeners() {
        document.getElementById('loginBtn').addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        document.getElementById('registerBtn').addEventListener('click', () => {
            window.location.href = 'register.html';
        });
        
        document.getElementById('workerLoginBtn').addEventListener('click', () => {
            window.location.href = 'worker-login.html';
        });
        

    }

    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // Check if login is still valid (24 hours)
            const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0');
            const now = Date.now();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursSinceLogin <= 24) {
                // Redirect to appropriate dashboard based on user role
                const userRole = sessionStorage.getItem('userRole');
                if (userRole === 'manager') {
                    window.location.href = 'manager-dashboard.html';
                } else {
                    window.location.href = 'worker-dashboard.html';
                }
            } else {
                // Clear expired session
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('loginTime');
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('username');
            }
        }
    }

    // פונקציה פשוטה להצגת הודעות
    showWelcomeMessage() {
        console.log('ברוכים הבאים למערכת ניהול המשימות');
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

// פונקציה פשוטה
window.showWelcomeMessage = function() {
    console.log('ברוכים הבאים למערכת ניהול המשימות');
};

// פונקציה לכפתור חזור
window.goBack = function() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = 'welcome.html';
    }
};

// הצגת כפתור חזור אם יש היסטוריה
window.addEventListener('load', function() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        if (document.referrer && document.referrer !== window.location.href) {
            backButton.style.display = 'flex';
        }
    }
});

// Initialize welcome manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const welcomeManager = new WelcomeManager();
    welcomeManager.showWelcomeMessage();
}); 