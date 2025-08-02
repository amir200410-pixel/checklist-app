#!/bin/bash

echo "🚀 מתחיל תהליך העלאה ל-GitHub Pages..."
echo ""

# בדיקת Git
if ! command -v git &> /dev/null; then
    echo "❌ Git לא מותקן. אנא התקן Git תחילה."
    exit 1
fi

# בדיקת מצב Git
echo "🔍 בודק מצב Git..."
if [ ! -d ".git" ]; then
    echo "❌ זה לא repository Git. הרץ 'git init' תחילה."
    exit 1
fi

# בדיקת קבצים חשובים
echo "🔍 בודק קבצים חשובים..."
required_files=("index.html" "welcome.html" "manifest.json" "sw.js" "icons/icon.svg")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ קובץ חסר: $file"
        exit 1
    fi
done
echo "✅ כל הקבצים הנדרשים קיימים"

# בדיקת remote
echo "🔍 בודק remote repository..."
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  אין remote repository מוגדר"
    echo ""
    echo "📋 כדי להמשיך:"
    echo "1. צור repository ב-GitHub: https://github.com/new"
    echo "2. הרץ: git remote add origin https://github.com/YOUR_USERNAME/checklist-app.git"
    echo "3. הרץ שוב את הסקריפט"
    echo ""
    echo "📖 ראה GITHUB_DEPLOYMENT_STEPS.md להוראות מפורטות"
    exit 1
fi

# הצג מידע על ה-repository
echo "📋 מידע על ה-repository:"
git remote get-url origin
echo ""

# בדיקת שינויים
echo "🔍 בודק שינויים..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  יש שינויים שלא נשמרו"
    echo "📋 השינויים:"
    git status --short
    echo ""
    read -p "האם להוסיף ולשמור את השינויים? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Update before deployment"
        echo "✅ השינויים נשמרו"
    else
        echo "❌ ביטול התהליך"
        exit 1
    fi
else
    echo "✅ אין שינויים חדשים"
fi

# שנה לענף main
echo "🔄 שינוי לענף main..."
git branch -M main

# העלאה ל-GitHub
echo "🚀 מעלה ל-GitHub..."
if git push -u origin main; then
    echo "✅ הקוד הועלה בהצלחה!"
    echo ""
    echo "🎉 השלבים הבאים:"
    echo "1. לך ל-Settings של ה-repository ב-GitHub"
    echo "2. גלול למטה עד 'Pages'"
    echo "3. בחר Source: 'Deploy from a branch'"
    echo "4. בחר Branch: 'main'"
    echo "5. לחץ על 'Save'"
    echo ""
    echo "⏳ חכה 2-5 דקות עד שהאתר יופיע"
    echo "🌐 האתר יהיה זמין ב: https://YOUR_USERNAME.github.io/checklist-app"
    echo ""
    echo "📖 ראה GITHUB_DEPLOYMENT_STEPS.md להוראות מפורטות"
else
    echo "❌ שגיאה בהעלאה"
    echo "🔧 בדוק:"
    echo "   - שיש לך הרשאות ל-repository"
    echo "   - שה-URL נכון"
    echo "   - שיש חיבור לאינטרנט"
    exit 1
fi 