// Access Control System - מערכת הגנה עם קוד כניסה
class AccessControl {
    constructor() {
        this.accessCode = '214796070';
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // בדוק אם המשתמש כבר מאומת
        const authStatus = sessionStorage.getItem('accessAuthenticated');
        if (authStatus === 'true') {
            this.isAuthenticated = true;
            return;
        }

        // הצג מסך כניסה
        this.showAccessScreen();
    }

    showAccessScreen() {
        // יצירת מסך כניסה
        const accessScreen = document.createElement('div');
        accessScreen.id = 'accessScreen';
        accessScreen.innerHTML = `
            <div class="access-overlay">
                <div class="access-modal">
                    <div class="access-header">
                        <i class="fas fa-shield-alt"></i>
                        <h2>גישה מוגבלת</h2>
                        <p>המערכת מוגנת. הכנס קוד כניסה</p>
                    </div>
                    
                    <div class="access-form">
                        <div class="input-group">
                            <label for="accessCode">
                                <i class="fas fa-key"></i>
                                קוד כניסה
                            </label>
                            <input 
                                type="password" 
                                id="accessCode" 
                                placeholder="הכנס קוד כניסה"
                                maxlength="9"
                                autocomplete="off"
                            >
                        </div>
                        
                        <button id="submitAccess" class="btn btn-primary">
                            <i class="fas fa-sign-in-alt"></i>
                            כניסה
                        </button>
                    </div>
                    
                    <div class="access-footer">
                        <small>מערכת ניהול משימות מוגנת</small>
                    </div>
                </div>
            </div>
        `;

        // הוספת סגנונות
        const style = document.createElement('style');
        style.textContent = `
            .access-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                direction: rtl;
            }

            .access-modal {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 25px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }

            .access-header {
                margin-bottom: 30px;
            }

            .access-header i {
                font-size: 3rem;
                color: #667eea;
                margin-bottom: 15px;
                filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
            }

            .access-header h2 {
                font-size: 1.8rem;
                color: #333;
                margin-bottom: 10px;
                font-weight: 700;
            }

            .access-header p {
                color: #666;
                font-size: 1rem;
            }

            .access-form {
                margin-bottom: 20px;
            }

            .input-group {
                margin-bottom: 20px;
                text-align: right;
            }

            .input-group label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .input-group label i {
                margin-left: 8px;
                color: #667eea;
            }

            .input-group input {
                width: 100%;
                padding: 15px;
                border: 2px solid #e1e5e9;
                border-radius: 12px;
                font-size: 1.1rem;
                text-align: center;
                letter-spacing: 2px;
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.9);
            }

            .input-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                transform: translateY(-2px);
            }

            .btn {
                width: 100%;
                padding: 15px;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }

            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
            }

            .access-footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e1e5e9;
            }

            .access-footer small {
                color: #999;
                font-size: 0.8rem;
            }

            .error-message {
                background: #f8d7da;
                color: #721c24;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 0.9rem;
                display: none;
            }

            .success-message {
                background: #d4edda;
                color: #155724;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 0.9rem;
                display: none;
            }

            @media (max-width: 480px) {
                .access-modal {
                    padding: 30px 20px;
                    margin: 20px;
                }
                
                .access-header h2 {
                    font-size: 1.5rem;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(accessScreen);

        // הוספת אירועים
        this.setupAccessEvents();
    }

    setupAccessEvents() {
        const accessCodeInput = document.getElementById('accessCode');
        const submitButton = document.getElementById('submitAccess');

        // כניסה בלחיצה על Enter
        accessCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAccess();
            }
        });

        // כניסה בלחיצה על כפתור
        submitButton.addEventListener('click', () => {
            this.checkAccess();
        });

        // מיקוד אוטומטי
        accessCodeInput.focus();
    }

    checkAccess() {
        const accessCodeInput = document.getElementById('accessCode');
        const enteredCode = accessCodeInput.value.trim();

        if (enteredCode === this.accessCode) {
            this.grantAccess();
        } else {
            this.showError('קוד כניסה שגוי. נסה שוב.');
            accessCodeInput.value = '';
            accessCodeInput.focus();
        }
    }

    showError(message) {
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            const form = document.querySelector('.access-form');
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    grantAccess() {
        // שמירת סטטוס אימות
        sessionStorage.setItem('accessAuthenticated', 'true');
        this.isAuthenticated = true;

        // הצגת הודעת הצלחה
        let successDiv = document.querySelector('.success-message');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            const form = document.querySelector('.access-form');
            form.insertBefore(successDiv, form.firstChild);
        }
        
        successDiv.textContent = '✅ כניסה אושרה! מעביר למערכת...';
        successDiv.style.display = 'block';

        // הסתרת מסך הכניסה
        setTimeout(() => {
            const accessScreen = document.getElementById('accessScreen');
            if (accessScreen) {
                accessScreen.style.opacity = '0';
                accessScreen.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    accessScreen.remove();
                }, 300);
            }
        }, 1500);
    }

    // פונקציה לבדיקת אימות
    isUserAuthenticated() {
        return this.isAuthenticated || sessionStorage.getItem('accessAuthenticated') === 'true';
    }

    // פונקציה ליציאה
    logout() {
        sessionStorage.removeItem('accessAuthenticated');
        this.isAuthenticated = false;
        location.reload();
    }
}

// יצירת מופע של מערכת ההגנה
const accessControl = new AccessControl();

// פונקציה גלובלית לבדיקת אימות
window.checkAccess = function() {
    return accessControl.isUserAuthenticated();
};

// פונקציה גלובלית ליציאה
window.logoutAccess = function() {
    accessControl.logout();
}; 