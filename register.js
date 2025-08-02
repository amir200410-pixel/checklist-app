// Registration Page JavaScript
class RegisterManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // בדיקה שהמנהל המשותף נטען
        setTimeout(() => {
            console.log('🔍 בדיקת מנהל אחסון משותף:', {
                sharedStorage: !!window.sharedStorage,
                cache: window.sharedStorage?.cache ? Object.keys(window.sharedStorage.cache) : 'לא נטען'
            });
        }, 1000);
    }

    setupEventListeners() {
        const registerForm = document.getElementById('registerForm');
        const togglePassword = document.getElementById('togglePassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        // בדיקה שהאלמנטים קיימים
        if (!registerForm) {
            console.error('registerForm לא נמצא!');
            return;
        }

        if (!togglePassword) {
            console.error('togglePassword לא נמצא!');
        }

        if (!toggleConfirmPassword) {
            console.error('toggleConfirmPassword לא נמצא!');
        }

        if (!passwordInput) {
            console.error('passwordInput לא נמצא!');
        }

        if (!confirmPasswordInput) {
            console.error('confirmPasswordInput לא נמצא!');
        }

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('טופס נשלח!');
            this.handleRegistration();
        });

        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility(passwordInput, togglePassword);
            });
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => {
                this.togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
            });
        }

        // Real-time validation
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validatePassword();
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validateConfirmPassword();
            });
        }

        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('input', () => {
                this.validateUsername();
            });
        } else {
            console.error('username input לא נמצא!');
        }

        const businessNameInput = document.getElementById('businessName');
        if (businessNameInput) {
            businessNameInput.addEventListener('input', () => {
                this.validateBusinessName();
            });
        } else {
            console.error('businessName input לא נמצא!');
        }

        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) {
            fullNameInput.addEventListener('input', () => {
                this.validateFullName();
            });
        } else {
            console.error('fullName input לא נמצא!');
        }

        console.log('Event listeners הותקנו בהצלחה!');
    }

    validateUsername() {
        const username = document.getElementById('username');
        const usernameValue = username.value.trim();
        
        if (usernameValue.length < 3) {
            username.classList.add('error');
            return false;
        } else {
            username.classList.remove('error');
            return true;
        }
    }

    validateBusinessName() {
        const businessName = document.getElementById('businessName');
        const businessNameValue = businessName.value.trim();
        
        if (businessNameValue.length < 2) {
            businessName.classList.add('error');
            return false;
        } else {
            businessName.classList.remove('error');
            return true;
        }
    }

    validateFullName() {
        const fullName = document.getElementById('fullName');
        const fullNameValue = fullName.value.trim();
        
        if (fullNameValue.length < 2) {
            fullName.classList.add('error');
            return false;
        } else {
            fullName.classList.remove('error');
            return true;
        }
    }

    validatePassword() {
        const password = document.getElementById('password');
        const passwordValue = password.value;
        
        if (passwordValue.length < 4) {
            password.classList.add('error');
            return false;
        } else {
            password.classList.remove('error');
            return true;
        }
    }

    validateConfirmPassword() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;
        
        if (confirmPasswordValue !== passwordValue) {
            confirmPassword.classList.add('error');
            return false;
        } else {
            confirmPassword.classList.remove('error');
            return true;
        }
    }

    handleRegistration() {
        console.log('התחלת handleRegistration...');
        
        const username = document.getElementById('username').value.trim();
        const businessName = document.getElementById('businessName').value.trim();
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        console.log('ערכים שנאספו:', { username, businessName, fullName, email, password: password ? '***' : 'ריק', confirmPassword: confirmPassword ? '***' : 'ריק' });

        // Validate all fields
        if (!this.validateUsername()) {
            console.log('שגיאה: שם משתמש לא תקין');
            this.showToast('שם משתמש חייב להיות לפחות 3 תווים!', 'error');
            return;
        }

        if (!this.validateBusinessName()) {
            console.log('שגיאה: שם עסק לא תקין');
            this.showToast('שם העסק חייב להיות לפחות 2 תווים!', 'error');
            return;
        }

        if (!this.validateFullName()) {
            console.log('שגיאה: שם מלא לא תקין');
            this.showToast('שם מלא חייב להיות לפחות 2 תווים!', 'error');
            return;
        }

        if (!this.validatePassword()) {
            console.log('שגיאה: סיסמה לא תקינה');
            this.showToast('סיסמה חייבת להיות לפחות 4 תווים!', 'error');
            return;
        }

        if (!this.validateConfirmPassword()) {
            console.log('שגיאה: אימות סיסמה לא תואם');
            this.showToast('הסיסמאות לא תואמות!', 'error');
            return;
        }

        // Check if username already exists
        const users = this.getUsers();
        if (users.find(user => user.username === username)) {
            console.log('שגיאה: שם משתמש כבר קיים');
            this.showToast('שם משתמש זה כבר קיים במערכת!', 'error');
            return;
        }

        console.log('כל הבדיקות עברו בהצלחה, יוצר משתמש חדש...');

        // Create new user (always manager for registration page)
        const newUser = {
            username: username,
            password: password,
            businessName: businessName,
            fullName: fullName,
            email: email,
            role: 'manager', // Registration page is only for managers
            businessId: this.generateBusinessId(businessName),
            createdAt: new Date().toISOString()
        };

        console.log('משתמש חדש נוצר:', { ...newUser, password: '***' });

        // Save user
        users.push(newUser);
        
        // שמירה למנהל המשותף אם זמין, אחרת ל-localStorage
        if (window.sharedStorage) {
            window.sharedStorage.setUsers(users);
        } else {
            localStorage.setItem('appUsers', JSON.stringify(users));
        }

        console.log('משתמש נשמר בהצלחה!');

        this.showToast('המשתמש נרשם בהצלחה!', 'success');

        // Auto login and redirect
        setTimeout(() => {
            console.log('מתחיל התחברות אוטומטית...');
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loginTime', Date.now().toString());
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('userRole', 'manager');

            console.log('מועבר לדשבורד המנהל...');
            window.location.href = 'manager-dashboard.html';
        }, 1500);
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

    togglePasswordVisibility(input, button) {
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    generateBusinessId(businessName) {
        // יצירת ID ייחודי לעסק
        const timestamp = Date.now().toString(36);
        const businessCode = businessName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
        return `${businessCode}${timestamp}`;
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

// Initialize register manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegisterManager();
}); 