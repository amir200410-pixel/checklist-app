// סקריפט לבדיקת משתמשים במערכת
console.log('🔍 בודק משתמשים במערכת...');

// בדיקת משתמשים ב-localStorage
const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
console.log('📊 סה"כ משתמשים:', users.length);

if (users.length === 0) {
    console.log('❌ אין משתמשים במערכת!');
    console.log('💡 צריך ליצור מנהל תחילה, ואז ליצור עובדים');
} else {
    console.log('✅ יש משתמשים במערכת:');
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} (${user.role}) - ${user.fullName || 'ללא שם מלא'}`);
    });
    
    // בדיקת עובדים
    const workers = users.filter(u => u.role === 'worker');
    console.log(`👥 סה"כ עובדים: ${workers.length}`);
    
    if (workers.length === 0) {
        console.log('⚠️  אין עובדים במערכת!');
        console.log('💡 המנהל צריך ליצור עובדים דרך דשבורד המנהל');
    } else {
        console.log('✅ יש עובדים במערכת:');
        workers.forEach((worker, index) => {
            console.log(`${index + 1}. ${worker.username} - ${worker.fullName || 'ללא שם מלא'}`);
        });
    }
}

// בדיקת מנהלים
const managers = users.filter(u => u.role === 'manager');
console.log(`👨‍💼 סה"כ מנהלים: ${managers.length}`);

if (managers.length === 0) {
    console.log('⚠️  אין מנהלים במערכת!');
    console.log('💡 צריך ליצור מנהל תחילה דרך דף ההרשמה');
} 