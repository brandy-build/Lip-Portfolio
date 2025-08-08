// Import Supabase functionality
import { portfolioDb, realtimeFeatures, portfolioAuth } from './supabase-config.js';

// Track page view when the page loads
document.addEventListener('DOMContentLoaded', function () {
   // Track initial page view
   portfolioDb.trackPageView('home');

   // Initialize analytics display
   updateAnalyticsDisplay();

   // Set up real-time visitor count
   setupRealtimeFeatures();
});
document.querySelectorAll('.nav-link').forEach(link => {
   link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
         targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   });
});

// Navbar active link highlighting
window.addEventListener('scroll', () => {
   const sections = document.querySelectorAll('.section');
   const navLinks = document.querySelectorAll('.nav-link');

   let current = '';

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollY >= (sectionTop - 200)) {
         current = section.getAttribute('id');
      }
   });

   navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
         link.classList.add('active');
      }
   });
});

// Typing animation for the home section
class TypeWriter {
   constructor(element, words, wait = 3000) {
      this.element = element;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10);
      this.type();
      this.isDeleting = false;
   }

   type() {
      const current = this.wordIndex % this.words.length;
      const fullTxt = this.words[current];

      if (this.isDeleting) {
         this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
         this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

      let typeSpeed = 100;

      if (this.isDeleting) {
         typeSpeed /= 2;
      }

      if (!this.isDeleting && this.txt === fullTxt) {
         typeSpeed = this.wait;
         this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
         this.isDeleting = false;
         this.wordIndex++;
         typeSpeed = 500;
      }

      setTimeout(() => this.type(), typeSpeed);
   }
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', function () {
   const typeWriter = document.querySelector('.typewriter');
   if (typeWriter) {
      new TypeWriter(typeWriter, [
         'Cybersecurity Enthusiast',
         'Penetration Tester',
         'Security Researcher',
         'Tech Explorer',
         'Problem Solver'
      ], 2000);
   }
});

// Scroll reveal animations
const observerOptions = {
   threshold: 0.2,
   rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.classList.add('active');
      }
   });
}, observerOptions);

// Section observer with lower threshold for better section detection
const sectionObserverOptions = {
   threshold: 0.1,
   rootMargin: '0px 0px -20px 0px'
};

const sectionObserver = new IntersectionObserver(function (entries) {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.classList.add('section-visible');
      }
   });
}, sectionObserverOptions);

// Add scroll reveal to elements
document.addEventListener('DOMContentLoaded', function () {
   // Observe sections for visibility
   const sections = document.querySelectorAll('.section');
   sections.forEach(section => {
      section.classList.add('section-hidden');
      sectionObserver.observe(section);
   });

   const revealElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content, .terminal-window, .section-title');
   revealElements.forEach((el, index) => {
      el.classList.add('scroll-reveal');
      // Add staggered animation delay
      el.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
   });

   // Add individual skill item animations
   const skillItems = document.querySelectorAll('.skill-item');
   skillItems.forEach((item, index) => {
      item.classList.add('scroll-reveal');
      item.style.transitionDelay = `${index * 0.05}s`;
      observer.observe(item);
   });

   // Add individual stat animations
   const statItems = document.querySelectorAll('.stat-item');
   statItems.forEach((item, index) => {
      item.classList.add('scroll-reveal');
      item.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(item);
   });
});

// Skill bar animation
const animateSkillBars = () => {
   const skillBars = document.querySelectorAll('.skill-progress');
   skillBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
         bar.style.width = width;
      }, 500);
   });
};

// Trigger skill bar animation when skills section is visible
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
   const skillsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
         }
      });
   }, { threshold: 0.5 });

   skillsObserver.observe(skillsSection);
}

// Terminal cursor blinking
document.addEventListener('DOMContentLoaded', function () {
   const cursor = document.querySelector('.cursor');
   if (cursor) {
      setInterval(() => {
         cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      }, 500);
   }
});

// Contact form handling with Supabase
const contactForm = document.querySelector('.terminal-form');
if (contactForm) {
   contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const contactData = {
         name: formData.get('name'),
         email: formData.get('email'),
         message: formData.get('message')
      };

      // Simple form validation
      if (!contactData.name || !contactData.email || !contactData.message) {
         showNotification('Please fill in all fields', 'error');
         return;
      }

      // Show loading state
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
         // Save to Supabase (if available)
         if (window.portfolioDb) {
            const result = await window.portfolioDb.saveContactSubmission(contactData);

            if (result.success) {
               showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
               this.reset();

               // Track successful contact submission
               window.portfolioDb.trackPageView('contact-submitted');
            } else {
               throw new Error(result.error);
            }
         } else {
            // Fallback for when Supabase is not configured
            showNotification('Message received! (Note: Configure Supabase for full functionality)', 'success');
            this.reset();
         }
      } catch (error) {
         console.error('Error submitting contact form:', error);
         showNotification('Failed to send message. Please try again or email me directly.', 'error');
      } finally {
         // Restore button state
         submitBtn.innerHTML = originalText;
         submitBtn.disabled = false;
      }
   });
}

// Notification system
function showNotification(message, type = 'info') {
   const notification = document.createElement('div');
   notification.className = `notification notification-${type}`;
   notification.textContent = message;

   // Style the notification
   notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--terminal-green)' : 'var(--terminal-red)'};
        color: var(--bg-primary);
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

   document.body.appendChild(notification);

   // Animate in
   setTimeout(() => {
      notification.style.transform = 'translateX(0)';
   }, 100);

   // Remove after 3 seconds
   setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
         document.body.removeChild(notification);
      }, 300);
   }, 3000);
}

// Mobile navbar toggle
let isNavbarVisible = false;

function toggleMobileNavbar() {
   const navbar = document.querySelector('.navbar');
   if (window.innerWidth <= 768) {
      if (isNavbarVisible) {
         navbar.style.transform = 'translateX(-100%)';
         isNavbarVisible = false;
      } else {
         navbar.style.transform = 'translateX(0)';
         isNavbarVisible = true;
      }
   }
}

// Close mobile navbar when clicking outside
document.addEventListener('click', function (e) {
   const navbar = document.querySelector('.navbar');
   const isClickInsideNav = navbar.contains(e.target);

   if (!isClickInsideNav && isNavbarVisible && window.innerWidth <= 768) {
      navbar.style.transform = 'translateX(-100%)';
      isNavbarVisible = false;
   }
});

// Handle window resize
window.addEventListener('resize', function () {
   const navbar = document.querySelector('.navbar');
   if (window.innerWidth > 768) {
      navbar.style.transform = '';
      isNavbarVisible = false;
   }
});

// Add mobile menu button for smaller screens
document.addEventListener('DOMContentLoaded', function () {
   if (window.innerWidth <= 768) {
      const menuButton = document.createElement('button');
      menuButton.className = 'mobile-menu-btn';
      menuButton.innerHTML = '<i class="fas fa-bars"></i>';
      menuButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10001;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            width: 50px;
            height: 50px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;

      menuButton.addEventListener('click', toggleMobileNavbar);
      document.body.appendChild(menuButton);
   }
});

// Add glitch effect to terminal title on hover
document.addEventListener('DOMContentLoaded', function () {
   const terminalTitles = document.querySelectorAll('.terminal-title');
   terminalTitles.forEach(title => {
      const originalText = title.textContent;

      title.addEventListener('mouseenter', function () {
         let iteration = 0;
         const glitchInterval = setInterval(() => {
            this.textContent = originalText
               .split('')
               .map((letter, index) => {
                  if (index < iteration) {
                     return originalText[index];
                  }
                  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
               })
               .join('');

            iteration++;

            if (iteration > originalText.length) {
               clearInterval(glitchInterval);
               this.textContent = originalText;
            }
         }, 30);
      });
   });
});

// Terminal command simulation
document.addEventListener('DOMContentLoaded', function () {
   const terminalCommands = [
      { command: 'ls -la', delay: 1000 },
      { command: 'cat portfolio.txt', delay: 2000 },
      { command: 'npm start', delay: 3000 }
   ];

   let commandIndex = 0;
   const homeTerminalLine = document.querySelector('.home-section .terminal-line:last-child .command');

   if (homeTerminalLine) {
      function typeCommand() {
         if (commandIndex < terminalCommands.length) {
            const currentCommand = terminalCommands[commandIndex];
            let charIndex = 0;

            homeTerminalLine.textContent = '';

            const typeInterval = setInterval(() => {
               if (charIndex < currentCommand.command.length) {
                  homeTerminalLine.textContent += currentCommand.command[charIndex];
                  charIndex++;
               } else {
                  clearInterval(typeInterval);
                  setTimeout(() => {
                     commandIndex++;
                     if (commandIndex >= terminalCommands.length) {
                        commandIndex = 0;
                     }
                     typeCommand();
                  }, currentCommand.delay);
               }
            }, 100);
         }
      }

      // Start the command simulation after page load
      setTimeout(typeCommand, 2000);
   }
});

// Add matrix rain effect to background (subtle)
function createMatrixRain() {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');

   canvas.style.position = 'fixed';
   canvas.style.top = '0';
   canvas.style.left = '0';
   canvas.style.width = '100%';
   canvas.style.height = '100%';
   canvas.style.pointerEvents = 'none';
   canvas.style.zIndex = '-1';
   canvas.style.opacity = '0.1';

   document.body.appendChild(canvas);

   function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
   }

   resizeCanvas();
   window.addEventListener('resize', resizeCanvas);

   const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   const charSize = 14;
   const columns = Math.floor(canvas.width / charSize);
   const drops = [];

   for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
   }

   function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = `${charSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
         const char = chars[Math.floor(Math.random() * chars.length)];
         ctx.fillText(char, i * charSize, drops[i]);

         if (drops[i] > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
         }
         drops[i] += charSize;
      }
   }

   setInterval(draw, 100);
}

// Initialize matrix rain effect on load
document.addEventListener('DOMContentLoaded', function () {
   // Only add matrix rain on desktop for performance
   if (window.innerWidth > 768) {
      setTimeout(createMatrixRain, 1000);
   }
});

console.log(`
╔══════════════════════════════════════╗
║       LIP'S TERMINAL PORTFOLIO       ║
║                                      ║
║  Welcome to Prajwal's workspace!     ║
║  Built with ♥ and lots of ☕        ║
║                                      ║
║  GitHub: github.com/brandy-build     ║
║  LinkedIn: /in/prajwal-l-chawda-*    ║
╚══════════════════════════════════════╝
`);

// Supabase integration functions
async function updateAnalyticsDisplay() {
   try {
      if (window.portfolioDb) {
         const analytics = await window.portfolioDb.getAnalytics();
         if (analytics.success) {
            // Update stats in the about section if elements exist
            updateStatsDisplay(analytics.data);
         }
      }
   } catch (error) {
      console.log('Analytics not available:', error);
   }
}

function updateStatsDisplay(data) {
   // Update portfolio view count if element exists
   const viewCountElement = document.querySelector('.portfolio-views');
   if (viewCountElement) {
      viewCountElement.textContent = data.totalViews || 0;
   }

   // You can add more stat displays here
   console.log('Portfolio Analytics:', data);
}

// Track project clicks
function trackProjectClick(projectName, linkType) {
   if (window.portfolioDb) {
      window.portfolioDb.trackProjectClick(projectName, linkType);
   }
}

// Add click tracking to project links
document.addEventListener('DOMContentLoaded', function () {
   const projectLinks = document.querySelectorAll('.project-link');
   projectLinks.forEach(link => {
      link.addEventListener('click', function (e) {
         const projectCard = this.closest('.project-card');
         const projectName = projectCard.querySelector('h3').textContent;
         const linkType = this.href.includes('github') ? 'github' : 'demo';

         trackProjectClick(projectName, linkType);
      });
   });
});

// Set up real-time features
function setupRealtimeFeatures() {
   if (window.realtimeFeatures) {
      // Subscribe to visitor count updates
      window.realtimeFeatures.subscribeToVisitorCount((payload) => {
         console.log('New visitor detected:', payload);
         updateAnalyticsDisplay();
      });
   }
}

// Track section views
function trackSectionView(sectionName) {
   if (window.portfolioDb) {
      window.portfolioDb.trackPageView(sectionName);
   }
}

// Enhanced navbar active link highlighting with section tracking
window.addEventListener('scroll', () => {
   const sections = document.querySelectorAll('.section');
   const navLinks = document.querySelectorAll('.nav-link');

   let current = '';

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollY >= (sectionTop - 200)) {
         current = section.getAttribute('id');
      }
   });

   navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
         link.classList.add('active');
         // Track section view
         if (current) {
            trackSectionView(current);
         }
      }
   });
});

// Initialize Supabase when available
window.addEventListener('load', function () {
   // Check if Supabase config is loaded
   if (typeof window.portfolioDb !== 'undefined') {
      console.log('✅ Supabase integration active');
      updateAnalyticsDisplay();
      setupRealtimeFeatures();
   } else {
      console.log('⚠️ Supabase not configured - using offline mode');
   }
});
