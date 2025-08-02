#!/bin/bash

# סקריפט לעצירת שרת האתר
echo "🛑 עוצר את שרת האתר..."

# בדיקה אם השרת רץ
if lsof -i :3000 > /dev/null 2>&1; then
    # עצירת השרת
    pkill -f "python3 -m http.server"
    echo "✅ השרת נעצר בהצלחה"
else
    echo "⚠️  השרת לא רץ על פורט 3000"
fi 