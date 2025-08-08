// Email notification system for contact form submissions
// Add this to your supabase-config.js

export class EmailNotifications {
   constructor() {
      this.webhookUrl = 'YOUR_WEBHOOK_URL'; // You can use services like Zapier, IFTTT, or n8n
   }

   // Send email notification when someone contacts you
   async notifyNewContact(contactData) {
      try {
         // Option 1: Using a webhook service
         const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               type: 'new_contact',
               data: contactData,
               timestamp: new Date().toISOString()
            })
         });

         console.log('Email notification sent:', response.ok);
      } catch (error) {
         console.error('Failed to send email notification:', error);
      }
   }

   // Browser notification for real-time alerts
   async showBrowserNotification(title, message) {
      if ('Notification' in window) {
         // Request permission if not granted
         if (Notification.permission === 'default') {
            await Notification.requestPermission();
         }

         if (Notification.permission === 'granted') {
            new Notification(title, {
               body: message,
               icon: '/profile.jpeg',
               badge: '/profile.jpeg'
            });
         }
      }
   }

   // Send Discord/Slack webhook notification
   async sendDiscordNotification(contactData) {
      const discordWebhook = 'YOUR_DISCORD_WEBHOOK_URL';

      try {
         await fetch(discordWebhook, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               embeds: [{
                  title: '💌 New Portfolio Contact!',
                  description: `**Name:** ${contactData.name}\\n**Email:** ${contactData.email}\\n**Message:** ${contactData.message}`,
                  color: 0x00FF00,
                  timestamp: new Date().toISOString(),
                  footer: {
                     text: 'Portfolio Contact Form'
                  }
               }]
            })
         });
      } catch (error) {
         console.error('Discord notification failed:', error);
      }
   }
}

// Real-time visitor tracking
export class VisitorTracker {
   constructor() {
      this.isTracking = false;
      this.visitorCount = 0;
   }

   // Track active visitors in real-time
   async startRealTimeTracking() {
      if (this.isTracking) return;

      this.isTracking = true;

      // Subscribe to real-time changes in page_views table
      const subscription = supabase
         .channel('visitor-tracking')
         .on('postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'page_views'
            },
            (payload) => {
               console.log('New visitor detected:', payload.new);
               this.handleNewVisitor(payload.new);
            }
         )
         .subscribe();

      return subscription;
   }

   async handleNewVisitor(visitorData) {
      this.visitorCount++;

      // Show notification in admin dashboard
      if (window.location.pathname.includes('admin.html')) {
         this.showVisitorAlert(visitorData);
      }

      // Log visitor activity
      console.log(`Visitor #${this.visitorCount}:`, {
         page: visitorData.page,
         time: visitorData.viewed_at,
         ip: visitorData.ip_address
      });
   }

   showVisitorAlert(visitorData) {
      // Create a real-time notification in the admin panel
      const alertDiv = document.createElement('div');
      alertDiv.className = 'visitor-alert';
      alertDiv.innerHTML = `
            <div class="alert alert-info">
                <strong>👀 New Visitor!</strong> 
                Someone visited: <code>${visitorData.page}</code>
                <small>(${new Date(visitorData.viewed_at).toLocaleTimeString()})</small>
            </div>
        `;

      // Add to admin dashboard
      const alertContainer = document.getElementById('alerts-container') || document.body;
      alertContainer.appendChild(alertDiv);

      // Remove after 10 seconds
      setTimeout(() => alertDiv.remove(), 10000);
   }
}

// Usage example - Add to your script.js
const emailNotifications = new EmailNotifications();
const visitorTracker = new VisitorTracker();

// Start tracking when admin dashboard loads
if (window.location.pathname.includes('admin.html')) {
   visitorTracker.startRealTimeTracking();
}
