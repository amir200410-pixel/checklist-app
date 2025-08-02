// AI Assistant JavaScript
class AIAssistant {
    constructor() {
        this.init();
        this.knowledgeBase = this.createKnowledgeBase();
    }

    init() {
        this.checkAdminAccess();
        this.setupEventListeners();
    }

    checkAdminAccess() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userRole = sessionStorage.getItem('userRole');
        const username = sessionStorage.getItem('username');
        
        if (isLoggedIn !== 'true' || userRole !== 'admin' || username !== '214796070') {
            alert('אין לך הרשאה לגשת לדף זה!');
            window.location.href = 'welcome.html';
            return;
        }
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }

    createKnowledgeBase() {
        return {
            // הוספת עובדים
            'עובד': {
                keywords: ['עובד', 'worker', 'הוספת עובד', 'צור עובד', 'עובד חדש'],
                response: `
                    <strong>הוספת עובד חדש:</strong><br><br>
                    
                    <strong>שיטה 1 - דרך דף ההרשמה:</strong><br>
                    1. פתח את דף ההרשמה<br>
                    2. מלא את הפרטים (שם משתמש, סיסמה, שם מלא)<br>
                    3. בחר תפקיד "עובד"<br>
                    4. לחץ על "צור חשבון"<br><br>
                    
                    <strong>שיטה 2 - דרך מנהל המערכת:</strong><br>
                    1. לך לדף ניהול המערכת<br>
                    2. לחץ על "הוספת עובד"<br>
                    3. מלא את הפרטים הנדרשים<br>
                    4. שמור את העובד<br><br>
                    
                    <strong>פרטים נדרשים:</strong><br>
                    • שם משתמש ייחודי<br>
                    • סיסמה חזקה (לפחות 4 תווים)<br>
                    • שם מלא<br>
                    • אימייל (אופציונלי)<br>
                    • תפקיד: עובד
                `
            },

            // עיצוב המערכת
            'עיצוב': {
                keywords: ['עיצוב', 'design', 'צבע', 'color', 'css', 'style', 'ממשק'],
                response: `
                    <strong>שינוי עיצוב המערכת:</strong><br><br>
                    
                    <strong>1. שינוי צבעים:</strong><br>
                    • פתח את קובץ ה-CSS הרלוונטי<br>
                    • חפש את המשתנים הבאים:<br>
                    &nbsp;&nbsp;- --primary-color: צבע ראשי<br>
                    &nbsp;&nbsp;- --secondary-color: צבע משני<br>
                    &nbsp;&nbsp;- --background-color: צבע רקע<br><br>
                    
                    <strong>2. שינוי גופנים:</strong><br>
                    • שנה את font-family ב-CSS<br>
                    • הוסף גופנים מ-Google Fonts<br><br>
                    
                    <strong>3. שינוי עיצוב כפתורים:</strong><br>
                    • חפש את .btn ב-CSS<br>
                    • שנה border-radius, padding, colors<br><br>
                    
                    <strong>4. הוספת אנימציות:</strong><br>
                    • השתמש ב-transition ו-transform<br>
                    • הוסף hover effects<br><br>
                    
                    <strong>דוגמה לשינוי צבע ראשי:</strong><br>
                    <code>--primary-color: #667eea;</code>
                `
            },

            // תכונות חדשות
            'תכונות': {
                keywords: ['תכונות', 'features', 'פונקציונליות', 'functionality', 'חדש', 'new'],
                response: `
                    <strong>הוספת תכונות חדשות למערכת:</strong><br><br>
                    
                    <strong>1. תכונות מומלצות להוספה:</strong><br>
                    • מערכת התראות מתקדמת<br>
                    • דוחות וסטטיסטיקות<br>
                    • יומן משימות<br>
                    • מערכת הערכות עובדים<br>
                    • ניהול קבצים<br>
                    • צ'אט פנימי<br><br>
                    
                    <strong>2. שלבי הפיתוח:</strong><br>
                    1. תכנון התכונה<br>
                    2. עיצוב הממשק<br>
                    3. פיתוח הקוד<br>
                    4. בדיקות<br>
                    5. הפצה<br><br>
                    
                    <strong>3. טכנולוגיות מומלצות:</strong><br>
                    • JavaScript ES6+<br>
                    • CSS Grid & Flexbox<br>
                    • Local Storage<br>
                    • Service Workers<br>
                    • Web APIs<br><br>
                    
                    <strong>4. דוגמה להוספת תכונה:</strong><br>
                    • צור קובץ HTML חדש<br>
                    • הוסף CSS לעיצוב<br>
                    • כתוב JavaScript לפונקציונליות<br>
                    • חבר לשרת הנתונים
                `
            },

            // ניהול חברות
            'חברות': {
                keywords: ['חברות', 'companies', 'business', 'ניהול', 'management'],
                response: `
                    <strong>ניהול חברות במערכת:</strong><br><br>
                    
                    <strong>1. צפייה בחברות:</strong><br>
                    • לך לדף ניהול המערכת<br>
                    • ראה את רשימת כל החברות<br>
                    • סטטיסטיקות לכל חברה<br><br>
                    
                    <strong>2. הוספת חברה חדשה:</strong><br>
                    • מנהל נרשם עם שם עסק<br>
                    • נוצר Business ID אוטומטי<br>
                    • החברה מופיעה ברשימה<br><br>
                    
                    <strong>3. מחיקת חברה:</strong><br>
                    • לחץ על "מחק" ליד החברה<br>
                    • אישר את המחיקה<br>
                    • כל הנתונים נמחקים<br><br>
                    
                    <strong>4. פרטי חברה:</strong><br>
                    • שם החברה<br>
                    • מספר עובדים<br>
                    • מספר משימות פעילות<br>
                    • תאריך הרשמה<br><br>
                    
                    <strong>5. חיפוש חברות:</strong><br>
                    • השתמש בתיבת החיפוש<br>
                    • חפש לפי שם חברה או מנהל
                `
            },

            // דוחות וסטטיסטיקות
            'דוחות': {
                keywords: ['דוחות', 'reports', 'סטטיסטיקות', 'statistics', 'charts', 'גרפים'],
                response: `
                    <strong>יצירת דוחות וסטטיסטיקות:</strong><br><br>
                    
                    <strong>1. דוחות זמינים:</strong><br>
                    • דוח עובדים לפי חברה<br>
                    • דוח משימות לפי סטטוס<br>
                    • דוח ביצועים לפי תקופה<br>
                    • דוח פעילות מערכת<br><br>
                    
                    <strong>2. הוספת דוחות חדשים:</strong><br>
                    1. צור קובץ HTML לדוח<br>
                    2. הוסף Chart.js לספריות<br>
                    3. כתוב JavaScript לאיסוף נתונים<br>
                    4. צור גרפים ויזואליים<br><br>
                    
                    <strong>3. דוגמה לדוח JavaScript:</strong><br>
                    <code>
                    // איסוף נתונים<br>
                    const tasks = getTasks();<br>
                    const completed = tasks.filter(t => t.status === 'completed');<br>
                    const pending = tasks.filter(t => t.status === 'pending');<br><br>
                    
                    // יצירת גרף<br>
                    new Chart(ctx, {<br>
                    &nbsp;&nbsp;type: 'doughnut',<br>
                    &nbsp;&nbsp;data: {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;labels: ['הושלמו', 'ממתינות'],<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;datasets: [{<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data: [completed.length, pending.length]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;}]<br>
                    &nbsp;&nbsp;}<br>
                    });
                    </code>
                `
            },

            // ביצועים
            'ביצועים': {
                keywords: ['ביצועים', 'performance', 'מהירות', 'speed', 'אופטימיזציה', 'optimization'],
                response: `
                    <strong>שיפור ביצועי המערכת:</strong><br><br>
                    
                    <strong>1. אופטימיזציית קוד:</strong><br>
                    • השתמש ב-const ו-let במקום var<br>
                    • הימנע מלולאות מיותרות<br>
                    • השתמש ב-arrow functions<br>
                    • קאש נתונים ב-localStorage<br><br>
                    
                    <strong>2. אופטימיזציית CSS:</strong><br>
                    • השתמש ב-CSS Grid ו-Flexbox<br>
                    • הימנע מ-!important<br>
                    • צמצם את מספר ה-selectors<br>
                    • השתמש ב-transform במקום position<br><br>
                    
                    <strong>3. אופטימיזציית נתונים:</strong><br>
                    • קאש נתונים בשרת<br>
                    • השתמש ב-pagination<br>
                    • צמצם את גודל התגובות<br>
                    • השתמש ב-compression<br><br>
                    
                    <strong>4. כלים לבדיקת ביצועים:</strong><br>
                    • Chrome DevTools Performance<br>
                    • Lighthouse Audit<br>
                    • WebPageTest<br>
                    • GTmetrix<br><br>
                    
                    <strong>5. טיפים מהירים:</strong><br>
                    • השתמש ב-lazy loading<br>
                    • דחוס תמונות<br>
                    • צמצם HTTP requests<br>
                    • השתמש ב-CDN
                `
            },

            // ברירת מחדל
            'default': {
                response: `
                    <strong>אני לא מבין את השאלה שלך.</strong><br><br>
                    
                    <strong>נסה לשאול על:</strong><br>
                    • הוספת עובדים חדשים<br>
                    • שינוי עיצוב המערכת<br>
                    • הוספת תכונות חדשות<br>
                    • ניהול חברות<br>
                    • יצירת דוחות<br>
                    • שיפור ביצועים<br><br>
                    
                    <strong>או לחץ על אחת ההצעות בצד ימין!</strong>
                `
            }
        };
    }

    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // חיפוש תשובה מתאימה
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (key === 'default') continue;
            
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    return data.response;
                }
            }
        }
        
        // אם לא נמצאה תשובה מתאימה
        return this.knowledgeBase.default.response;
    }

    addMessage(message, isUser = false) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        if (isUser) {
            messageDiv.innerHTML = `<strong>אתה:</strong> ${message}`;
        } else {
            messageDiv.innerHTML = `<strong>AI:</strong> ${message}`;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        // הצגת ההודעה של המשתמש
        this.addMessage(message, true);
        messageInput.value = '';
        
        // הצגת "כותב..."
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message typing';
        typingDiv.innerHTML = '<strong>AI:</strong> כותב...';
        document.getElementById('chatMessages').appendChild(typingDiv);
        
        // סימולציה של זמן כתיבה
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // הסרת "כותב..."
        typingDiv.remove();
        
        // קבלת תשובה מה-AI
        const response = await this.processMessage(message);
        this.addMessage(response);
    }
}

// פונקציות גלובליות
let aiAssistant;

window.sendMessage = function() {
    if (aiAssistant) {
        aiAssistant.sendMessage();
    }
};

window.sendSuggestion = function(suggestion) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = suggestion;
    sendMessage();
};

window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
};

window.goBack = function() {
    window.history.back();
};

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
}); 