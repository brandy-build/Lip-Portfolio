# 🚀 Deploy Portfolio to GitHub Guide

## 📋 **Pre-requisites**
1. Install Git for Windows: https://git-scm.com/download/win
2. Have GitHub account access for: https://github.com/brandy-build/Lip-Portfolio

## 🔧 **Setup Commands (Run in PowerShell)**

### Step 1: Navigate to Project Directory
```powershell
cd "c:\Users\prajw\programs\portfolio_edIt\static page portfolio"
```

### Step 2: Initialize Git Repository
```powershell
git init
```

### Step 3: Configure Git (Replace with your details)
```powershell
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

### Step 4: Add Remote Repository
```powershell
git remote add origin https://github.com/brandy-build/Lip-Portfolio.git
```

### Step 5: Create .gitignore File
```powershell
@"
# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Dependencies (if you add npm later)
node_modules/
"@ | Out-File -FilePath .gitignore -Encoding UTF8
```

### Step 6: Add All Files
```powershell
git add .
```

### Step 7: Create Initial Commit
```powershell
git commit -m "🎉 Initial commit: Complete portfolio with Supabase integration

✨ Features added:
- Dark terminal-themed design with glassmorphism navbar
- Responsive portfolio sections (About, Skills, Projects, Contact)
- Supabase backend integration for contact forms and analytics
- Admin dashboard for portfolio management
- Real-time data tracking and user interactions
- Professional shield-shaped profile picture display
- Scroll animations and interactive elements

🛠️ Tech Stack:
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- Backend: Supabase (PostgreSQL, Authentication, Real-time)
- Design: JetBrains Mono font, Font Awesome icons
- Features: Contact forms, analytics, admin panel, RLS security"
```

### Step 8: Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

## 🔐 **If You Need Authentication**
If GitHub asks for credentials, you may need to:
1. Create a Personal Access Token at: https://github.com/settings/tokens
2. Use your GitHub username and the token as password

## 📁 **Files Being Committed:**
- `index.html` - Main portfolio page
- `style.css` - Terminal-themed styling
- `script.js` - Interactive functionality
- `supabase-config.js` - Backend integration
- `admin.html` - Admin dashboard
- `database-schema.sql` - Database setup
- `profile.jpeg` - Profile picture
- `SUPABASE_SETUP.md` - Setup documentation

## 🎯 **Next Steps After Deployment:**
1. Enable GitHub Pages in repository settings
2. Your portfolio will be live at: `https://brandy-build.github.io/Lip-Portfolio/`
3. Set up custom domain if desired

## 🚨 **Important Security Note:**
Your Supabase credentials are included in the code. This is okay for public projects since you're using Row Level Security (RLS) policies, but make sure your Supabase project has proper security settings enabled.
