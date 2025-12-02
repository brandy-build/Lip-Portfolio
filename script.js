// Handle contact form submission with loading state
document.querySelector('.terminal-form').addEventListener('submit', async function (e) {
   e.preventDefault(); // Prevent form redirect

   const submitBtn = document.querySelector('.submit-btn');
   const originalText = submitBtn.innerHTML;

   submitBtn.disabled = true;
   submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

   try {
      // Send form data to Formspree without redirecting
      const formData = new FormData(this);
      const response = await fetch('https://formspree.io/f/xdkqzllr', {
         method: 'POST',
         body: formData,
         headers: {
            'Accept': 'application/json'
         }
      });

      if (response.ok) {
         // Show terminal-style success message
         showTerminalMessage('✅ Message sent successfully! Thank you for reaching out.');
         document.querySelector('.terminal-form').reset();
      } else {
         showTerminalMessage('❌ Failed to send message. Try again!');
      }
   } catch (error) {
      showTerminalMessage('❌ Error: ' + error.message);
   } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
   }
});

// Function to show terminal-style message
function showTerminalMessage(message) {
   // Remove existing message if any
   const existingMessage = document.querySelector('.terminal-message');
   if (existingMessage) {
      existingMessage.remove();
   }

   // Create terminal message element
   const messageDiv = document.createElement('div');
   messageDiv.className = 'terminal-message';
   messageDiv.innerHTML = `
      <div class="terminal-window" style="position: fixed; bottom: 120px; right: 20px; width: 420px; z-index: 1000; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(0, 255, 100, 0.2); border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 255, 100, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
         <div class="terminal-header" style="background: rgba(0, 255, 100, 0.05); border-bottom: 1px solid rgba(0, 255, 100, 0.1); padding: 10px 12px; border-radius: 8px 8px 0 0;">
            <div class="terminal-buttons" style="display: flex; gap: 8px; float: left;">
               <span class="btn close" style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; cursor: pointer;"></span>
               <span class="btn minimize" style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; cursor: pointer;"></span>
               <span class="btn maximize" style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f; cursor: pointer;"></span>
            </div>
            <div class="terminal-title" style="text-align: center; color: #00ff64; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500; clear: both;">response@portfolio:~$</div>
         </div>
         <div class="terminal-body" style="padding: 16px;">
            <div class="terminal-line" style="display: flex; gap: 8px; align-items: center;">
               <span class="prompt" style="color: #ffff00; font-family: 'JetBrains Mono', monospace; font-weight: 600; text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);">$</span>
               <span class="command" style="color: #ffff00; font-family: 'JetBrains Mono', monospace; font-size: 13px; text-shadow: 0 0 10px rgba(255, 255, 0, 0.3);">send_message</span>
            </div>
            <div class="terminal-output" style="margin-top: 12px; color: #ffff00; font-size: 13px; line-height: 1.6; font-family: 'JetBrains Mono', monospace; font-weight: 500; letter-spacing: 0.5px; text-shadow: 0 0 8px rgba(255, 255, 0, 0.4);">
               ${message}
            </div>
         </div>
      </div>
   `;

   document.body.appendChild(messageDiv);

   // Auto-remove message after 5 seconds
   setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transition = 'opacity 0.5s ease-out';
      setTimeout(() => messageDiv.remove(), 500);
   }, 5000);
}
