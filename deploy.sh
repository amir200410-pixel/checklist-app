#!/bin/bash

# 🚀 סקריפט העלאה אוטומטי - מנהל המשימות
# צבעים לטרמינל
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 מתחיל תהליך העלאה לאוויר...${NC}"
echo ""

# בדיקת Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git לא מותקן. אנא התקן Git תחילה.${NC}"
    exit 1
fi

# בדיקת קבצים חשובים
echo -e "${YELLOW}🔍 בודק קבצים חשובים...${NC}"
required_files=("welcome.html" "manifest.json" "sw.js" "icons/icon.svg")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file נמצא${NC}"
    else
        echo -e "${RED}❌ $file חסר${NC}"
        exit 1
    fi
done

echo ""

# בחירת שירות העלאה
echo -e "${BLUE}📋 בחר שירות העלאה:${NC}"
echo "1) GitHub Pages (מומלץ)"
echo "2) Netlify"
echo "3) Vercel"
echo "4) רק הכנה ל-Git"
echo ""
read -p "הכנס בחירה (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}🎯 נבחר GitHub Pages${NC}"
        deploy_github_pages
        ;;
    2)
        echo -e "${GREEN}🎯 נבחר Netlify${NC}"
        prepare_for_netlify
        ;;
    3)
        echo -e "${GREEN}🎯 נבחר Vercel${NC}"
        prepare_for_vercel
        ;;
    4)
        echo -e "${GREEN}🎯 הכנה ל-Git בלבד${NC}"
        prepare_git_only
        ;;
    *)
        echo -e "${RED}❌ בחירה לא תקינה${NC}"
        exit 1
        ;;
esac

# פונקציה להעלאה ל-GitHub Pages
deploy_github_pages() {
    echo ""
    echo -e "${YELLOW}📝 הכנה ל-GitHub Pages...${NC}"
    
    # בדיקת Git repository
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}🔧 מאתחל Git repository...${NC}"
        git init
    fi
    
    # הוספת קבצים
    echo -e "${YELLOW}📁 מוסיף קבצים...${NC}"
    git add .
    
    # Commit
    echo -e "${YELLOW}💾 יוצר commit...${NC}"
    git commit -m "Deploy Task Manager App - $(date)"
    
    # בדיקת remote
    if ! git remote get-url origin &> /dev/null; then
        echo -e "${YELLOW}🔗 צריך להוסיף remote origin${NC}"
        echo -e "${BLUE}הכנס את URL של ה-repository שלך:${NC}"
        read -p "URL: " repo_url
        git remote add origin "$repo_url"
    fi
    
    # Push
    echo -e "${YELLOW}🚀 דוחף ל-GitHub...${NC}"
    git branch -M main
    git push -u origin main
    
    echo ""
    echo -e "${GREEN}✅ העלאה הושלמה!${NC}"
    echo -e "${BLUE}📋 השלבים הבאים:${NC}"
    echo "1. לך ל-Settings של ה-Repository"
    echo "2. גלול ל-Pages"
    echo "3. בחר 'Deploy from a branch'"
    echo "4. בחר 'main' branch"
    echo "5. לחץ Save"
    echo ""
    echo -e "${GREEN}🌐 האפליקציה תהיה זמינה ב: https://YOUR_USERNAME.github.io/REPO_NAME${NC}"
}

# פונקציה להכנה ל-Netlify
prepare_for_netlify() {
    echo ""
    echo -e "${YELLOW}📝 מכין ל-Netlify...${NC}"
    
    # יצירת קובץ _redirects
    echo -e "${YELLOW}📄 יוצר קובץ _redirects...${NC}"
    cat > _redirects << EOF
/*    /index.html   200
EOF
    
    # הכנה ל-Git
    prepare_git_only
    
    echo ""
    echo -e "${GREEN}✅ הכנה הושלמה!${NC}"
    echo -e "${BLUE}📋 השלבים הבאים:${NC}"
    echo "1. לך ל-Netlify.com"
    echo "2. הירשם עם GitHub"
    echo "3. לחץ 'New site from Git'"
    echo "4. בחר את ה-Repository שלך"
    echo "5. לחץ 'Deploy site'"
}

# פונקציה להכנה ל-Vercel
prepare_for_vercel() {
    echo ""
    echo -e "${YELLOW}📝 מכין ל-Vercel...${NC}"
    
    # יצירת קובץ vercel.json
    echo -e "${YELLOW}📄 יוצר קובץ vercel.json...${NC}"
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
EOF
    
    # הכנה ל-Git
    prepare_git_only
    
    echo ""
    echo -e "${GREEN}✅ הכנה הושלמה!${NC}"
    echo -e "${BLUE}📋 השלבים הבאים:${NC}"
    echo "1. לך ל-Vercel.com"
    echo "2. הירשם עם GitHub"
    echo "3. לחץ 'New Project'"
    echo "4. בחר את ה-Repository שלך"
    echo "5. לחץ 'Deploy'"
}

# פונקציה להכנה ל-Git בלבד
prepare_git_only() {
    echo ""
    echo -e "${YELLOW}📝 מכין ל-Git...${NC}"
    
    # בדיקת Git repository
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}🔧 מאתחל Git repository...${NC}"
        git init
    fi
    
    # הוספת קבצים
    echo -e "${YELLOW}📁 מוסיף קבצים...${NC}"
    git add .
    
    # Commit
    echo -e "${YELLOW}💾 יוצר commit...${NC}"
    git commit -m "Initial commit - Task Manager App"
    
    echo ""
    echo -e "${GREEN}✅ הכנה הושלמה!${NC}"
    echo -e "${BLUE}📋 השלבים הבאים:${NC}"
    echo "1. צור repository ב-GitHub"
    echo "2. הרץ: git remote add origin YOUR_REPO_URL"
    echo "3. הרץ: git push -u origin main"
}

echo ""
echo -e "${GREEN}🎉 תהליך הושלם!${NC}"
echo -e "${BLUE}📖 למידע נוסף, ראה את הקובץ DEPLOYMENT_GUIDE.md${NC}" 