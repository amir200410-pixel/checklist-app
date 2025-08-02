// Shared Storage Manager - מנהל אחסון משותף
class SharedStorage {
    constructor() {
        this.serverUrl = 'http://192.168.1.8:3000';
        this.cache = {};
        this.lastSync = 0;
        this.syncInterval = 10000; // 10 שניות במקום 3
        this.isOnline = true;
        this.pendingChanges = new Map();
        this.init();
    }

    async init() {
        // טעינת נתונים מהשרת בטעינת הדף
        await this.loadAllData();
        
        // סנכרון אוטומטי כל 10 שניות
        setInterval(() => {
            this.loadAllData();
        }, this.syncInterval);
        
        // בדיקת חיבור כל 30 שניות
        setInterval(() => {
            this.checkConnection();
        }, 30000);
        
        // שמירת שינויים תלויים כל 5 שניות
        setInterval(() => {
            this.flushPendingChanges();
        }, 5000);
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.serverUrl}/api/status`, { 
                method: 'GET',
                signal: AbortSignal.timeout(3000) // timeout של 3 שניות
            });
            this.isOnline = response.ok;
        } catch (error) {
            this.isOnline = false;
            console.warn('⚠️ אין חיבור לשרת');
        }
    }

    async loadAllData() {
        if (!this.isOnline) {
            console.log('🔄 אין חיבור לשרת, משתמש בנתונים מקומיים');
            return;
        }
        
        try {
            console.log('🔄 טוען נתונים מהשרת...');
            const response = await fetch(`${this.serverUrl}/api/data`, {
                signal: AbortSignal.timeout(5000) // timeout של 5 שניות
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.cache = result.data;
                    this.lastSync = Date.now();
                    
                    // עדכון localStorage עם הנתונים מהשרת
                    Object.keys(this.cache).forEach(key => {
                        localStorage.setItem(key, JSON.stringify(this.cache[key]));
                    });
                    
                    console.log('✅ נתונים נטענו מהשרת:', {
                        users: this.cache.appUsers?.length || 0,
                        tasks: this.cache['manager-tasks']?.length || 0,
                        transfers: this.cache.transferRequests?.length || 0
                    });
                }
            }
        } catch (error) {
            console.error('❌ שגיאה בטעינת נתונים מהשרת:', error);
            this.isOnline = false;
        }
    }

    async saveData(key, value) {
        // שמירה מיידית למטמון
        this.cache[key] = value;
        localStorage.setItem(key, JSON.stringify(value));
        
        // הוספה לרשימת השינויים התלויים
        this.pendingChanges.set(key, value);
        
        // אם יש חיבור, שמירה מיידית
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.serverUrl}/api/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ key, value }),
                    signal: AbortSignal.timeout(3000)
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        this.pendingChanges.delete(key);
                        console.log(`✅ נתונים נשמרו: ${key}`);
                        return true;
                    }
                }
            } catch (error) {
                console.error('❌ שגיאה בשמירת נתונים:', error);
                this.isOnline = false;
            }
        }
        
        return false;
    }

    async flushPendingChanges() {
        if (!this.isOnline || this.pendingChanges.size === 0) {
            return;
        }
        
        for (const [key, value] of this.pendingChanges) {
            try {
                const response = await fetch(`${this.serverUrl}/api/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ key, value }),
                    signal: AbortSignal.timeout(3000)
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        this.pendingChanges.delete(key);
                        console.log(`✅ שינוי תלוי נשמר: ${key}`);
                    }
                }
            } catch (error) {
                console.error(`❌ שגיאה בשמירת שינוי תלוי ${key}:`, error);
            }
        }
    }

    getData(key) {
        // קודם מנסה מהמטמון, אחר כך מ-localStorage
        if (this.cache[key] !== undefined) {
            return this.cache[key];
        }
        
        const localData = localStorage.getItem(key);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                this.cache[key] = parsed; // שמירה במטמון
                return parsed;
            } catch (error) {
                console.error('שגיאה בפענוח נתונים:', error);
            }
        }
        
        return null;
    }

    setData(key, value) {
        // שמירה מיידית ל-localStorage ולמטמון
        localStorage.setItem(key, JSON.stringify(value));
        this.cache[key] = value;
        
        // שמירה לשרת ברקע
        this.saveData(key, value);
    }

    async getServerStatus() {
        try {
            const response = await fetch(`${this.serverUrl}/api/status`, {
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                const status = await response.json();
                return status;
            }
        } catch (error) {
            console.error('❌ שגיאה בבדיקת סטטוס שרת:', error);
        }
        return { server: 'offline' };
    }

    getUsers() {
        return this.getData('appUsers') || [];
    }

    getTasks() {
        return this.getData('manager-tasks') || [];
    }

    getTransferRequests() {
        return this.getData('transferRequests') || [];
    }

    setUsers(users) {
        this.setData('appUsers', users);
    }

    setTasks(tasks) {
        this.setData('manager-tasks', tasks);
    }

    setTransferRequests(requests) {
        this.setData('transferRequests', requests);
    }
}

// יצירת instance גלובלי
window.sharedStorage = new SharedStorage();

// פונקציות גלובליות לבדיקה
window.getServerStatus = async () => {
    return await window.sharedStorage.getServerStatus();
};

window.forceSync = async () => {
    await window.sharedStorage.loadAllData();
    return 'סנכרון הושלם';
}; 