@echo off
echo 🚀 Portfolio Deployment Script
echo ==============================

echo.
echo 📁 Current directory: %CD%
echo.

echo 🔧 Initializing Git repository...
git init

echo 📝 Setting up .gitignore...
(
echo # Environment variables
echo .env
echo .env.local
echo.
echo # IDE files
echo .vscode/
echo .idea/
echo.
echo # OS files
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo *.log
echo npm-debug.log*
echo.
echo # Dependencies
echo node_modules/
) > .gitignore

echo 🔗 Adding remote repository...
git remote add origin https://github.com/brandy-build/Lip-Portfolio.git

echo 📦 Adding all files...
git add .

echo 💾 Creating commit...
git commit -m "🎉 Initial commit: Complete portfolio with Supabase integration - Dark terminal design with glassmorphism navbar - Responsive sections and contact forms - Supabase backend integration - Admin dashboard and analytics - Real-time data tracking"

echo 🌿 Setting main branch...
git branch -M main

echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Deployment complete!
echo 🌐 Your portfolio will be available at: https://brandy-build.github.io/Lip-Portfolio/
echo.
pause
