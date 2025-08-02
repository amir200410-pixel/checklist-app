#!/bin/bash

# סקריפט להפעלת שרת האתר
echo "🚀 מפעיל את שרת האתר..."

# בדיקה אם השרת כבר רץ
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  השרת כבר רץ על פורט 3000"
    echo "📱 האתר זמין בכתובת: http://localhost:3000"
    echo "🌐 או בכתובת: http://192.168.1.8:3000"
    exit 0
fi

# מעבר לתיקיית הפרויקט
cd "$(dirname "$0")"

# הפעלת השרת
echo "✅ השרת מתחיל..."
echo "📱 האתר יהיה זמין בכתובת: http://localhost:3000"
echo "🌐 או בכתובת: http://192.168.1.8:3000"
echo ""
echo "לעצירת השרת, לחץ Ctrl+C"
echo ""

python3 -m http.server 3000 