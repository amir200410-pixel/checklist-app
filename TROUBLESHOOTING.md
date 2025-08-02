# 🔧 פתרון בעיות - מנהל המשימות

## בעיה: עובדים לא יכולים להתחבר

### סיבות אפשריות:

1. **אין עובדים במערכת**
2. **אין מנהלים במערכת**
3. **פרטי התחברות שגויים**
4. **בעיה בשרת**

### פתרון מהיר:

#### שלב 1: בדיקת המערכת
1. היכנס לכתובת: `http://localhost:3000`
2. לוחץ על "בדיקת מערכת" בתחתית הדף
3. בדוק מה מצב המערכת

#### שלב 2: יצירת נתוני בדיקה
1. בדף הבדיקה, לחץ על "צור נתוני בדיקה"
2. זה ייצור:
   - מנהל: `admin` / `1234`
   - עובד: `worker1` / `1234`

#### שלב 3: בדיקת התחברות
1. נסה להתחבר כמנהל: `admin` / `1234`
2. נסה להתחבר כעובד: `worker1` / `1234`

## הוראות מפורטות:

### אם אין מנהלים במערכת:
1. היכנס ל: `http://localhost:3000/register.html`
2. צור חשבון מנהל חדש
3. התחבר כמנהל
4. צור עובדים דרך דשבורד המנהל

### אם יש מנהלים אבל אין עובדים:
1. התחבר כמנהל
2. היכנס לדשבורד המנהל
3. לחץ על "הוסף עובד"
4. צור עובד חדש עם פרטי התחברות

### אם יש עובדים אבל לא מצליחים להתחבר:
1. בדוק שפרטי ההתחברות נכונים
2. וודא שהעובד נוצר עם תפקיד 'worker'
3. נסה לנקות את ה-cache של הדפדפן

## בדיקות נוספות:

### בדיקת שרת:
```bash
# בדוק אם השרת רץ
lsof -i :3000

# הפעל שרת חדש אם צריך
python3 -m http.server 3000
```

### בדיקת נתונים:
```javascript
// פתח Console בדפדפן (F12)
// הרץ את הפקודה הבאה:
console.log(JSON.parse(localStorage.getItem('appUsers') || '[]'));
```

### ניקוי נתונים:
1. בדף הבדיקה, לחץ על "נקה נתונים"
2. צור נתונים חדשים
3. נסה שוב

## כתובות חשובות:

- **דף הבית**: `http://localhost:3000`
- **בדיקת מערכת**: `http://localhost:3000/debug.html`
- **הרשמת מנהל**: `http://localhost:3000/register.html`
- **התחברות מנהל**: `http://localhost:3000/login.html`
- **התחברות עובד**: `http://localhost:3000/worker-login.html`

## נתוני בדיקה מוכנים:

### מנהל:
- שם משתמש: `admin`
- סיסמה: `1234`

### עובד:
- שם משתמש: `worker1`
- סיסמה: `1234`

## אם הבעיה נמשכת:

1. **נקה את ה-cache** של הדפדפן
2. **נסה דפדפן אחר** (Chrome, Firefox, Safari)
3. **בדוק את ה-Console** (F12) לשגיאות JavaScript
4. **הפעל מחדש את השרת**

## תמיכה טכנית:

אם הבעיה נמשכת, בדוק:
- `debug.html` - דף בדיקה מפורט
- `SERVER_INFO.md` - מידע על השרת
- `WORKER_PORTAL_README.md` - הוראות לפורטל העובדים 