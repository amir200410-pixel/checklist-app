// Sync Manager - מנהל סנכרון נתונים בין מכשירים
class SyncManager {
    constructor() {
        this.syncInterval = null;
        this.lastSync = {};
        this.init();
    }

    init() {
        // התחלת סנכרון אוטומטי כל 5 שניות
        this.startAutoSync();
        
        // סנכרון בטעינת הדף
        this.syncAllData();
        
        // האזנה לשינויים ב-localStorage
        this.setupStorageListener();
    }

    startAutoSync() {
        this.syncInterval = setInterval(() => {
            this.syncAllData();
        }, 5000); // כל 5 שניות
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    setupStorageListener() {
        // האזנה לשינויים ב-localStorage
        window.addEventListener('storage', (e) => {
            if (e.key && e.newValue !== null) {
                this.handleStorageChange(e.key, e.newValue);
            }
        });
    }

    handleStorageChange(key, newValue) {
        console.log(`סנכרון נתונים: ${key} השתנה`);
        
        // עדכון הנתונים המקומיים
        try {
            const data = JSON.parse(newValue);
            this.lastSync[key] = data;
        } catch (error) {
            console.error('שגיאה בפענוח נתונים:', error);
        }
    }

    syncAllData() {
        const keys = ['appUsers', 'manager-tasks', 'transferRequests'];
        
        keys.forEach(key => {
            this.syncData(key);
        });
    }

    syncData(key) {
        try {
            const localData = localStorage.getItem(key);
            const lastKnownData = this.lastSync[key];
            
            if (localData) {
                const parsedData = JSON.parse(localData);
                
                // בדיקה אם הנתונים השתנו
                if (!lastKnownData || JSON.stringify(parsedData) !== JSON.stringify(lastKnownData)) {
                    this.lastSync[key] = parsedData;
                    console.log(`סנכרון ${key}: ${parsedData.length || 0} פריטים`);
                }
            }
        } catch (error) {
            console.error(`שגיאה בסנכרון ${key}:`, error);
        }
    }

    // פונקציה לבדיקת סטטוס הסנכרון
    getSyncStatus() {
        const status = {
            isRunning: !!this.syncInterval,
            lastSync: this.lastSync,
            timestamp: new Date().toISOString()
        };
        
        return status;
    }

    // פונקציה לסנכרון ידני
    manualSync() {
        console.log('סנכרון ידני מתחיל...');
        this.syncAllData();
        console.log('סנכרון ידני הושלם');
    }

    // פונקציה לבדיקת חיבור רשת
    checkNetworkStatus() {
        return {
            online: navigator.onLine,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }
}

// יצירת מופע גלובלי של מנהל הסנכרון
window.syncManager = new SyncManager();

// פונקציות גלובליות לבדיקה
window.checkSyncStatus = () => {
    return window.syncManager.getSyncStatus();
};

window.manualSync = () => {
    window.syncManager.manualSync();
};

window.checkNetwork = () => {
    return window.syncManager.checkNetworkStatus();
}; 