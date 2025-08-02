// Security Manager - ניהול אבטחה
class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSP();
        this.setupXSSProtection();
        this.setupCSRFProtection();
        this.setupInputValidation();
        this.setupSecureHeaders();
        this.setupSessionManagement();
    }

    // Content Security Policy
    setupCSP() {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
            style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
            font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https://api.example.com;
            frame-src 'none';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
        `.replace(/\s+/g, ' ').trim();
        document.head.appendChild(cspMeta);
    }

    // XSS Protection
    setupXSSProtection() {
        const xssMeta = document.createElement('meta');
        xssMeta.httpEquiv = 'X-XSS-Protection';
        xssMeta.content = '1; mode=block';
        document.head.appendChild(xssMeta);
    }

    // CSRF Protection
    setupCSRFProtection() {
        // Generate CSRF token
        const csrfToken = this.generateCSRFToken();
        window.csrfToken = csrfToken;

        // Add token to all forms
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.method.toLowerCase() === 'post') {
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = '_csrf';
                tokenInput.value = csrfToken;
                form.appendChild(tokenInput);
            }
        });
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Input Validation
    setupInputValidation() {
        // Sanitize all user inputs
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = this.sanitizeInput(e.target.value);
            }
        });

        // Validate forms before submission
        document.addEventListener('submit', (e) => {
            if (!this.validateForm(e.target)) {
                e.preventDefault();
                this.showSecurityAlert('אנא בדוק את הנתונים שהוזנו');
            }
        });
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                this.highlightInvalidInput(input);
            }

            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    this.highlightInvalidInput(input);
                }
            }

            if (input.type === 'password' && input.value) {
                if (input.value.length < 6) {
                    isValid = false;
                    this.highlightInvalidInput(input);
                }
            }
        });

        return isValid;
    }

    highlightInvalidInput(input) {
        input.style.borderColor = '#dc3545';
        input.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 3000);
    }

    // Secure Headers
    setupSecureHeaders() {
        // Add security headers via meta tags
        const headers = [
            { name: 'X-Content-Type-Options', value: 'nosniff' },
            { name: 'X-Frame-Options', value: 'DENY' },
            { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { name: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
        ];

        headers.forEach(header => {
            const meta = document.createElement('meta');
            meta.httpEquiv = header.name;
            meta.content = header.value;
            document.head.appendChild(meta);
        });
    }

    // Session Management
    setupSessionManagement() {
        // Auto logout after inactivity
        let inactivityTimer;
        const timeout = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.logout();
            }, timeout);
        };

        // Reset timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    logout() {
        // Clear sensitive data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        // Redirect to login
        window.location.href = '/login.html';
    }

    // Security Alerts
    showSecurityAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'security-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-shield-alt"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        if (!document.querySelector('#security-styles')) {
            const style = document.createElement('style');
            style.id = 'security-styles';
            style.textContent = `
                .security-alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #dc3545;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease;
                }
                .alert-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .security-alert button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    // Rate Limiting
    setupRateLimiting() {
        const requests = new Map();
        const maxRequests = 10; // Max requests per minute
        const windowMs = 60 * 1000; // 1 minute

        return function checkRateLimit(identifier) {
            const now = Date.now();
            const userRequests = requests.get(identifier) || [];
            
            // Remove old requests
            const validRequests = userRequests.filter(time => now - time < windowMs);
            
            if (validRequests.length >= maxRequests) {
                return false; // Rate limit exceeded
            }
            
            validRequests.push(now);
            requests.set(identifier, validRequests);
            return true;
        };
    }
}

// Initialize security manager
const securityManager = new SecurityManager(); 