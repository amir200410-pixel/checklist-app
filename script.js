// Checklist App JavaScript
class ChecklistApp {
    constructor() {
        this.items = [];
        this.checkAuth();
        this.init();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        
        // Check if login is still valid (24 hours)
        const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0');
        const now = Date.now();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loginTime');
            window.location.href = 'login.html';
            return;
        }
    }

    init() {
        this.loadFromLocalStorage();
        this.loadFromURL();
        this.setupEventListeners();
        this.render();
        this.updateStats();
        this.setupMobileFeatures();
    }

    setupEventListeners() {
        // Add item functionality
        const addBtn = document.getElementById('addBtn');
        const newItemInput = document.getElementById('newItem');

        addBtn.addEventListener('click', () => this.addItem());
        newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });

        // Clear all functionality
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Share functionality
        document.getElementById('shareBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('closeModal').addEventListener('click', () => this.hideShareModal());
        document.getElementById('copyLink').addEventListener('click', () => this.copyShareLink());
        document.getElementById('shareWhatsApp').addEventListener('click', () => this.shareViaWhatsApp());
        document.getElementById('shareEmail').addEventListener('click', () => this.shareViaEmail());

        // Password change functionality
        document.getElementById('changePasswordBtn').addEventListener('click', () => this.showPasswordModal());
        document.getElementById('closePasswordModal').addEventListener('click', () => this.hidePasswordModal());
        document.getElementById('savePasswordBtn').addEventListener('click', () => this.changePassword());

        // Close modal when clicking outside
        document.getElementById('shareModal').addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') {
                this.hideShareModal();
            }
        });

        document.getElementById('passwordModal').addEventListener('click', (e) => {
            if (e.target.id === 'passwordModal') {
                this.hidePasswordModal();
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideShareModal();
            }
        });
    }

    setupMobileFeatures() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add haptic feedback for mobile devices
        if ('vibrate' in navigator) {
            this.addHapticFeedback();
        }

        // Handle PWA install prompt
        this.handleInstallPrompt();
    }

    addHapticFeedback() {
        const checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                navigator.vibrate(50);
            });
        });
    }

    handleInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or notification
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.showToast('App installed successfully!');
        });
    }

    showInstallPrompt() {
        // You can add an install button here if needed
        console.log('App can be installed');
    }

    logout() {
        if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loginTime');
            window.location.href = 'login.html';
        }
    }

    showPasswordModal() {
        const modal = document.getElementById('passwordModal');
        modal.classList.add('show');
        
        // Clear inputs
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    hidePasswordModal() {
        const modal = document.getElementById('passwordModal');
        modal.classList.remove('show');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Get stored password
        const storedPassword = localStorage.getItem('appPassword') || '1234';
        
        if (currentPassword !== storedPassword) {
            this.showToast('סיסמה נוכחית שגויה!', 'error');
            return;
        }
        
        if (newPassword.length < 4) {
            this.showToast('סיסמה חדשה חייבת להיות לפחות 4 תווים!', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showToast('הסיסמאות החדשות לא תואמות!', 'error');
            return;
        }
        
        // Save new password
        localStorage.setItem('appPassword', newPassword);
        this.hidePasswordModal();
        this.showToast('סיסמה שונתה בהצלחה!');
    }

    openFamilyDashboard() {
        window.location.href = 'family-dashboard.html';
    }

    addItem() {
        const input = document.getElementById('newItem');
        const text = input.value.trim();

        if (text) {
            const item = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.items.push(item);
            input.value = '';
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showToast('פריט נוסף בהצלחה!');
        }
    }

    toggleItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
        }
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.render();
        this.updateStats();
        this.showToast('פריט נמחק!');
    }

    clearAll() {
        if (this.items.length === 0) {
            this.showToast('אין פריטים למחיקה!', 'error');
            return;
        }

        if (confirm('האם אתה בטוח שברצונך למחוק את כל הפריטים?')) {
            this.items = [];
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showToast('כל הפריטים נמחקו!');
        }
    }

    render() {
        const checklist = document.getElementById('checklist');
        const emptyState = document.getElementById('emptyState');

        if (this.items.length === 0) {
            checklist.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        checklist.style.display = 'flex';
        emptyState.style.display = 'none';

        checklist.innerHTML = this.items.map(item => `
            <div class="checklist-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <div class="checkbox ${item.completed ? 'checked' : ''}" onclick="app.toggleItem(${item.id})"></div>
                <div class="item-text">${this.escapeHtml(item.text)}</div>
                <button class="delete-btn" onclick="app.deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Re-add haptic feedback to new checkboxes
        if ('vibrate' in navigator) {
            this.addHapticFeedback();
        }
    }

    updateStats() {
        const totalItems = this.items.length;
        const completedItems = this.items.filter(item => item.completed).length;
        const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('completedItems').textContent = completedItems;
        document.getElementById('progressPercent').textContent = `${progressPercent}%`;
    }

    showShareModal() {
        const modal = document.getElementById('shareModal');
        const shareLink = document.getElementById('shareLink');
        
        // Generate shareable URL with checklist data
        const shareData = {
            items: this.items,
            timestamp: Date.now()
        };
        
        const encodedData = btoa(JSON.stringify(shareData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
        
        shareLink.value = shareUrl;
        modal.classList.add('show');
    }

    hideShareModal() {
        const modal = document.getElementById('shareModal');
        modal.classList.remove('show');
    }

    async copyShareLink() {
        const shareLink = document.getElementById('shareLink');
        
        try {
            await navigator.clipboard.writeText(shareLink.value);
            this.showToast('קישור הועתק ללוח!');
        } catch (err) {
            // Fallback for older browsers
            shareLink.select();
            document.execCommand('copy');
            this.showToast('קישור הועתק ללוח!');
        }
    }

    shareViaWhatsApp() {
        const shareLink = document.getElementById('shareLink').value;
        const text = encodeURIComponent(`בדוק את רשימת המשימות שלי: ${shareLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    shareViaEmail() {
        const shareLink = document.getElementById('shareLink').value;
        const subject = encodeURIComponent('רשימת משימות משותפת');
        const body = encodeURIComponent(`בדוק את רשימת המשימות שלי: ${shareLink}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('checklist-items');
            if (saved) {
                this.items = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('checklist-items', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const data = urlParams.get('data');
        
        if (data) {
            try {
                const decodedData = JSON.parse(atob(data));
                if (decodedData.items && Array.isArray(decodedData.items)) {
                    // Merge with existing items, avoiding duplicates
                    const existingIds = new Set(this.items.map(item => item.id));
                    const newItems = decodedData.items.filter(item => !existingIds.has(item.id));
                    
                    if (newItems.length > 0) {
                        this.items = [...this.items, ...newItems];
                        this.saveToLocalStorage();
                        this.showToast(`יובאו ${newItems.length} פריטים מרשימת משימות משותפת!`);
                    }
                }
            } catch (error) {
                console.error('Error loading from URL:', error);
            }
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ChecklistApp();
});

// Add some sample items if the checklist is empty (for demo purposes)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.app && window.app.items.length === 0) {
            const sampleItems = [
                'Buy groceries for the week',
                'Call the dentist for appointment',
                'Finish the project presentation',
                'Exercise for 30 minutes',
                'Read a chapter of the book'
            ];

            sampleItems.forEach(item => {
                const newItem = {
                    id: Date.now() + Math.random(),
                    text: item,
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                window.app.items.push(newItem);
            });

            window.app.saveToLocalStorage();
            window.app.render();
            window.app.updateStats();
        }
    }, 1000);
}); 