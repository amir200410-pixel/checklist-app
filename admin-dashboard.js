// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.checkAdminAccess();
        this.setupEventListeners();
        this.loadData();
        this.loadSystemInfo();
        this.testLogoutButton();
    }

    checkAdminAccess() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userRole = sessionStorage.getItem('userRole');
        const username = sessionStorage.getItem('username');
        
        // בדיקה שהמשתמש הוא מנהל מערכת
        if (isLoggedIn !== 'true' || userRole !== 'admin' || username !== '214796070') {
            alert('אין לך הרשאה לגשת לדף זה!');
            window.location.href = 'welcome.html';
            return;
        }
    }

    setupEventListeners() {
        // חיפוש חברות
        const searchInput = document.getElementById('searchBusiness');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterBusinesses(e.target.value);
            });
        }
    }

    async loadData() {
        try {
            console.log('🔄 טוען נתונים לדשבורד מנהל...');
            
            if (window.sharedStorage) {
                await window.sharedStorage.loadAllData();
                this.updateStats();
                this.renderBusinesses();
            } else {
                console.error('Shared storage לא זמין');
            }
        } catch (error) {
            console.error('שגיאה בטעינת נתונים:', error);
        }
    }

    updateStats() {
        const users = window.sharedStorage.getUsers();
        const tasks = window.sharedStorage.getTasks();
        
        // חישוב סטטיסטיקות
        const managers = users.filter(u => u.role === 'manager');
        const workers = users.filter(u => u.role === 'worker');
        const activeTasks = tasks.filter(t => t.status !== 'completed');
        
        // עדכון המספרים
        document.getElementById('totalBusinesses').textContent = managers.length;
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalTasks').textContent = activeTasks.length;
        document.getElementById('activeBusinesses').textContent = managers.length; // כל מנהל = עסק אחד
    }

    renderBusinesses() {
        const users = window.sharedStorage.getUsers();
        const managers = users.filter(u => u.role === 'manager');
        const businessesList = document.getElementById('businessesList');
        const emptyState = document.getElementById('emptyState');

        if (managers.length === 0) {
            businessesList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        businessesList.style.display = 'grid';
        emptyState.style.display = 'none';

        businessesList.innerHTML = managers.map(manager => {
            const businessUsers = users.filter(u => u.businessId === manager.businessId);
            const businessTasks = window.sharedStorage.getTasks().filter(t => 
                businessUsers.some(u => u.username === t.assignedWorker)
            );

            return `
                <div class="business-card">
                    <div class="business-header">
                        <div class="business-name">${manager.businessName || 'ללא שם'}</div>
                        <div class="business-id">${manager.businessId || 'N/A'}</div>
                    </div>
                    
                    <div class="business-details">
                        <div class="business-detail">
                            <span>מנהל:</span>
                            <span>${manager.fullName}</span>
                        </div>
                        <div class="business-detail">
                            <span>אימייל:</span>
                            <span>${manager.email || 'לא צוין'}</span>
                        </div>
                        <div class="business-detail">
                            <span>עובדים:</span>
                            <span>${businessUsers.filter(u => u.role === 'worker').length}</span>
                        </div>
                        <div class="business-detail">
                            <span>משימות פעילות:</span>
                            <span>${businessTasks.filter(t => t.status !== 'completed').length}</span>
                        </div>
                        <div class="business-detail">
                            <span>תאריך הרשמה:</span>
                            <span>${new Date(manager.createdAt).toLocaleDateString('he-IL')}</span>
                        </div>
                    </div>
                    
                    <div class="business-actions">
                        <button class="btn btn-view" onclick="viewBusinessDetails('${manager.businessId}')">
                            <i class="fas fa-eye"></i> צפה בפרטים
                        </button>
                        <button class="btn btn-delete" onclick="deleteBusiness('${manager.businessId}')">
                            <i class="fas fa-trash"></i> מחק
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterBusinesses(searchTerm) {
        const users = window.sharedStorage.getUsers();
        const managers = users.filter(u => u.role === 'manager');
        const filteredManagers = managers.filter(manager => 
            manager.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.businessId?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const businessesList = document.getElementById('businessesList');
        const emptyState = document.getElementById('emptyState');

        if (filteredManagers.length === 0) {
            businessesList.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>לא נמצאו תוצאות</h3>
                <p>נסה לחפש עם מילים אחרות</p>
            `;
            return;
        }

        businessesList.style.display = 'grid';
        emptyState.style.display = 'none';

        // הצגת התוצאות המסוננות
        const users = window.sharedStorage.getUsers();
        businessesList.innerHTML = filteredManagers.map(manager => {
            const businessUsers = users.filter(u => u.businessId === manager.businessId);
            const businessTasks = window.sharedStorage.getTasks().filter(t => 
                businessUsers.some(u => u.username === t.assignedWorker)
            );

            return `
                <div class="business-card">
                    <div class="business-header">
                        <div class="business-name">${manager.businessName || 'ללא שם'}</div>
                        <div class="business-id">${manager.businessId || 'N/A'}</div>
                    </div>
                    
                    <div class="business-details">
                        <div class="business-detail">
                            <span>מנהל:</span>
                            <span>${manager.fullName}</span>
                        </div>
                        <div class="business-detail">
                            <span>אימייל:</span>
                            <span>${manager.email || 'לא צוין'}</span>
                        </div>
                        <div class="business-detail">
                            <span>עובדים:</span>
                            <span>${businessUsers.filter(u => u.role === 'worker').length}</span>
                        </div>
                        <div class="business-detail">
                            <span>משימות פעילות:</span>
                            <span>${businessTasks.filter(t => t.status !== 'completed').length}</span>
                        </div>
                        <div class="business-detail">
                            <span>תאריך הרשמה:</span>
                            <span>${new Date(manager.createdAt).toLocaleDateString('he-IL')}</span>
                        </div>
                    </div>
                    
                    <div class="business-actions">
                        <button class="btn btn-view" onclick="viewBusinessDetails('${manager.businessId}')">
                            <i class="fas fa-eye"></i> צפה בפרטים
                        </button>
                        <button class="btn btn-delete" onclick="deleteBusiness('${manager.businessId}')">
                            <i class="fas fa-trash"></i> מחק
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadSystemInfo() {
        this.updateServerStatus();
        this.updateSyncStatus();
        this.updateConnectionStatus();
        this.updateDatabaseInfo();
        this.updatePerformanceInfo();
        this.updateSecurityInfo();
        
        // עדכון אוטומטי כל 30 שניות
        setInterval(() => {
            this.updateServerStatus();
            this.updateSyncStatus();
            this.updateConnectionStatus();
        }, 30000);
    }

    updateServerStatus() {
        const serverStatus = document.getElementById('serverStatus');
        if (window.sharedStorage) {
            window.sharedStorage.getServerStatus().then(status => {
                if (status && status.server === 'running') {
                    serverStatus.textContent = 'פעיל';
                    serverStatus.className = 'status online';
                } else {
                    serverStatus.textContent = 'לא פעיל';
                    serverStatus.className = 'status offline';
                }
            }).catch(() => {
                serverStatus.textContent = 'שגיאה';
                serverStatus.className = 'status offline';
            });
        } else {
            serverStatus.textContent = 'לא זמין';
            serverStatus.className = 'status warning';
        }
    }

    updateSyncStatus() {
        const syncStatus = document.getElementById('syncStatus');
        const lastSync = document.getElementById('lastSync');
        
        if (window.sharedStorage) {
            window.sharedStorage.getServerStatus().then(status => {
                if (status && status.server === 'running') {
                    syncStatus.textContent = 'מסנכרן';
                    syncStatus.className = 'status online';
                    lastSync.textContent = new Date().toLocaleTimeString('he-IL');
                } else {
                    syncStatus.textContent = 'לא מסנכרן';
                    syncStatus.className = 'status offline';
                    lastSync.textContent = '-';
                }
            }).catch(() => {
                syncStatus.textContent = 'שגיאה';
                syncStatus.className = 'status offline';
                lastSync.textContent = '-';
            });
        } else {
            syncStatus.textContent = 'לא זמין';
            syncStatus.className = 'status warning';
            lastSync.textContent = '-';
        }
    }

    updateConnectionStatus() {
        const connectionStatus = document.getElementById('connectionStatus');
        const connectionSpeed = document.getElementById('connectionSpeed');
        
        // בדיקת חיבור לאינטרנט
        if (navigator.onLine) {
            connectionStatus.textContent = 'מחובר';
            connectionStatus.className = 'status online';
            connectionSpeed.textContent = 'מהיר';
        } else {
            connectionStatus.textContent = 'לא מחובר';
            connectionStatus.className = 'status offline';
            connectionSpeed.textContent = '-';
        }
    }

    updateDatabaseInfo() {
        const dbSize = document.getElementById('dbSize');
        const dbUsers = document.getElementById('dbUsers');
        
        if (window.sharedStorage) {
            const users = window.sharedStorage.getUsers();
            const tasks = window.sharedStorage.getTasks();
            
            // חישוב גודל משוער
            const dataSize = JSON.stringify(users).length + JSON.stringify(tasks).length;
            const sizeInKB = Math.round(dataSize / 1024);
            
            dbSize.textContent = `${sizeInKB} KB`;
            dbUsers.textContent = users.length;
        } else {
            dbSize.textContent = '-';
            dbUsers.textContent = '-';
        }
    }

    updatePerformanceInfo() {
        const performanceStatus = document.getElementById('performanceStatus');
        const memoryUsage = document.getElementById('memoryUsage');
        
        // בדיקת ביצועים בסיסית
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            if (loadTime < 2000) {
                performanceStatus.textContent = 'מעולה';
                performanceStatus.className = 'status online';
            } else if (loadTime < 5000) {
                performanceStatus.textContent = 'טוב';
                performanceStatus.className = 'status online';
            } else {
                performanceStatus.textContent = 'איטי';
                performanceStatus.className = 'status warning';
            }
            
            memoryUsage.textContent = `${Math.round(loadTime)}ms`;
        } else {
            performanceStatus.textContent = 'לא זמין';
            performanceStatus.className = 'status warning';
            memoryUsage.textContent = '-';
        }
    }

    updateSecurityInfo() {
        const securityStatus = document.getElementById('securityStatus');
        const securityUpdate = document.getElementById('securityUpdate');
        
        // בדיקת אבטחה בסיסית
        if (location.protocol === 'https:') {
            securityStatus.textContent = 'מאובטח';
            securityStatus.className = 'status online';
        } else {
            securityStatus.textContent = 'לא מאובטח';
            securityStatus.className = 'status warning';
        }
        
        securityUpdate.textContent = new Date().toLocaleDateString('he-IL');
    }

    refreshSystemInfo() {
        console.log('🔄 מרענן מידע מערכת...');
        this.updateServerStatus();
        this.updateSyncStatus();
        this.updateConnectionStatus();
        this.updateDatabaseInfo();
        this.updatePerformanceInfo();
        this.updateSecurityInfo();
    }

    testLogoutButton() {
        // בדיקה שהכפתור עובד
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            console.log('✅ כפתור התנתקות נמצא');
            logoutBtn.addEventListener('click', function(e) {
                console.log('🖱️ כפתור התנתקות נלחץ');
                logout();
            });
        } else {
            console.warn('⚠️ כפתור התנתקות לא נמצא');
        }
    }
}

// פונקציות גלובליות
window.refreshData = function() {
    const adminDashboard = new AdminDashboard();
    adminDashboard.loadData();
};

window.viewBusinessDetails = function(businessId) {
    // שמירת ה-business ID ב-session storage לצפייה
    sessionStorage.setItem('viewingBusinessId', businessId);
    alert(`צפייה בפרטי העסק ${businessId}\n(פונקציה זו תתפתח בהמשך)`);
};

window.deleteBusiness = function(businessId) {
    if (confirm(`האם אתה בטוח שברצונך למחוק את העסק ${businessId}?\nפעולה זו תמחק את כל הנתונים הקשורים לעסק זה.`)) {
        const users = window.sharedStorage.getUsers();
        const tasks = window.sharedStorage.getTasks();
        
        // מחיקת כל המשתמשים של העסק
        const updatedUsers = users.filter(u => u.businessId !== businessId);
        
        // מחיקת כל המשימות של העסק
        const businessUsers = users.filter(u => u.businessId === businessId);
        const businessUsernames = businessUsers.map(u => u.username);
        const updatedTasks = tasks.filter(t => !businessUsernames.includes(t.assignedWorker));
        
        // שמירת השינויים
        window.sharedStorage.setUsers(updatedUsers);
        window.sharedStorage.setTasks(updatedTasks);
        
        alert('העסק נמחק בהצלחה!');
        refreshData();
    }
};

window.logout = function() {
    console.log('🔄 מתחיל התנתקות...');
    try {
        sessionStorage.clear();
        console.log('✅ sessionStorage נוקה בהצלחה');
        window.location.href = 'welcome.html';
        console.log('🔄 מעביר לדף הבית...');
    } catch (error) {
        console.error('❌ שגיאה בהתנתקות:', error);
        alert('שגיאה בהתנתקות. נסה שוב.');
    }
};



window.openAIAssistant = function() {
    window.location.href = 'ai-assistant.html';
};

window.refreshSystemInfo = function() {
    const adminDashboard = new AdminDashboard();
    adminDashboard.refreshSystemInfo();
};

// פונקציה לכפתור חזור
window.goBack = function() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = 'welcome.html';
    }
};

// בדיקה שהפונקציות הגלובליות נטענו
console.log('🔧 טוען פונקציות גלובליות...');
console.log('logout function:', typeof window.logout);
console.log('refreshData function:', typeof window.refreshData);
console.log('openAIAssistant function:', typeof window.openAIAssistant);

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 מתחיל דף ניהול מערכת...');
    new AdminDashboard();
}); 