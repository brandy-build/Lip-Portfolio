# 🌟 Prajwal Chawda - Portfolio

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen)](https://brandy-build.github.io/Lip-Portfolio/)
[![Tech Stack](https://img.shields.io/badge/Tech-HTML%20|%20CSS%20|%20JavaScript%20|%20Supabase-blue)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, terminal-themed portfolio website with glassmorphism design and real-time backend integration.

## 🎯 **Overview**

Professional portfolio showcasing cybersecurity expertise, Python development skills, and project experience. Features a sleek dark terminal aesthetic with interactive elements and comprehensive backend integration.

## ✨ **Features**

### 🎨 **Design & UI**
- **Dark Terminal Theme** - Professional cybersecurity-inspired design
- **Glassmorphism Navigation** - Translucent sidebar with hover effects
- **Responsive Layout** - Optimized for all devices
- **Shield Profile Display** - Unique hexagonal profile presentation
- **Smooth Animations** - Scroll-triggered reveal effects

### 🛠️ **Functionality**
- **Contact Form** - Real-time submission with backend storage
- **Analytics Tracking** - Page views and interaction monitoring
- **Admin Dashboard** - Portfolio management interface
- **Project Showcase** - Interactive project cards with external links
- **Skills Visualization** - Dynamic skill rating system

### 🔒 **Backend Integration**
- **Supabase Database** - PostgreSQL with Row Level Security
- **Real-time Updates** - Live data synchronization
- **Authentication** - Secure admin access
- **Data Analytics** - Visitor statistics and engagement metrics

## 🚀 **Tech Stack**

| Frontend | Backend | Database | Security |
|----------|---------|----------|----------|
| HTML5 | Supabase | PostgreSQL | RLS Policies |
| CSS3 | REST API | Real-time DB | Authentication |
| JavaScript ES6 | WebSockets | Cloud Storage | Data Encryption |

### **External Libraries**
- **Font Awesome** - Icon system
- **JetBrains Mono** - Terminal-style typography
- **Supabase JS Client** - Backend integration

## 📁 **Project Structure**

```
Lip-Portfolio/
├── index.html              # Main portfolio page
├── admin.html              # Admin dashboard
├── style.css               # Terminal-themed styling
├── script.js               # Interactive functionality
├── supabase-config.js      # Backend configuration
├── database-schema.sql     # Database setup
├── profile.jpeg            # Profile image
├── SUPABASE_SETUP.md       # Backend setup guide
└── README.md              # Project documentation
```

## 🎮 **Live Demo**

🌐 **Visit Portfolio:** [https://brandy-build.github.io/Lip-Portfolio/](https://brandy-build.github.io/Lip-Portfolio/)

### **Portfolio Sections**
1. **Home** - Hero section with terminal introduction
2. **About** - Professional background and expertise
3. **Skills** - Technical proficiencies with interactive ratings
4. **Projects** - Showcase of cybersecurity and development work
5. **Contact** - Real-time contact form with backend integration

## 🛠️ **Setup & Development**

### **Prerequisites**
- Modern web browser
- Supabase account (for backend features)
- Git (for deployment)

### **Local Development**
1. **Clone Repository**
   ```bash
   git clone https://github.com/brandy-build/Lip-Portfolio.git
   cd Lip-Portfolio
   ```

2. **Open in Browser**
   ```bash
   # Open index.html in your preferred browser
   start index.html  # Windows
   open index.html   # macOS
   xdg-open index.html  # Linux
   ```

3. **Backend Setup** (Optional)
   - Follow instructions in `SUPABASE_SETUP.md`
   - Configure database using `database-schema.sql`
   - Update credentials in `supabase-config.js`

## 📊 **Features Showcase**

### **Contact Form Integration**
```javascript
// Real-time form submission with backend storage
const portfolioDb = new PortfolioDatabase();
await portfolioDb.saveContactSubmission(formData);
```

### **Analytics Tracking**
```javascript
// Automatic page view tracking
await portfolioDb.trackPageView('home');
await portfolioDb.trackProjectInteraction('github-project', 'github');
```

### **Admin Dashboard**
- Contact submission management
- Visitor analytics and statistics
- Real-time data updates
- Secure authentication system

## 🎨 **Design Philosophy**

### **Terminal Aesthetic**
- **Color Scheme:** Dark backgrounds with neon green accents
- **Typography:** JetBrains Mono for authentic terminal feel
- **Animations:** Subtle, professional hover effects
- **Layout:** Clean, minimal design focusing on content

### **User Experience**
- **Navigation:** Intuitive sidebar with smooth transitions
- **Responsiveness:** Mobile-first design approach
- **Accessibility:** High contrast ratios and keyboard navigation
- **Performance:** Optimized loading and minimal dependencies

## 🔧 **Configuration**

### **Supabase Setup**
1. Create project at [supabase.com](https://supabase.com)
2. Run SQL schema from `database-schema.sql`
3. Update credentials in `supabase-config.js`
4. Configure Row Level Security policies

### **Customization**
- **Colors:** Modify CSS variables in `style.css`
- **Content:** Update personal information in `index.html`
- **Projects:** Add new projects in the projects section
- **Skills:** Update skill ratings and technologies

## 📈 **Performance**

- **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)
- **Loading Time:** <2 seconds on 3G
- **Bundle Size:** <500KB total assets
- **Mobile Optimized:** 100% responsive design

## 🤝 **Contributing**

Contributions, issues, and feature requests are welcome!

1. **Fork the Project**
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to Branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Prajwal Chawda**
- **Portfolio:** [Live Demo](https://brandy-build.github.io/Lip-Portfolio/)
- **LinkedIn:** [Connect with me](https://linkedin.com/in/prajwal-chawda)
- **GitHub:** [@brandy-build](https://github.com/brandy-build)
- **Email:** Available through portfolio contact form

## 🙏 **Acknowledgments**

- **Supabase** - For providing excellent backend-as-a-service
- **Font Awesome** - For comprehensive icon library
- **JetBrains** - For the beautiful Mono font
- **GitHub Pages** - For free hosting solution

---

⭐ **Star this repository if you found it helpful!**

[![Star History Chart](https://api.star-history.com/svg?repos=brandy-build/Lip-Portfolio&type=Date)](https://star-history.com/#brandy-build/Lip-Portfolio&Date)
