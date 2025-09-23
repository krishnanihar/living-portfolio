// Simple Elegant Bot - Consistent across all pages
class ElegantBot {
  constructor() {
    this.isOpen = false;
    this.messageCount = 0;
    this.currentPage = this.detectCurrentPage();
    this.responses = this.getPageResponses();
    this.init();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('air-india')) return 'air-india';
    if (path.includes('psychedelic')) return 'psychedelic';
    if (path.includes('index') || path === '/') return 'home';
    return 'home';
  }

  getPageResponses() {
    const responses = {
      home: [
        "Welcome! I'm Nihar's digital assistant. I can tell you about his work, background, or current projects.",
        "Hi there! This portfolio showcases 3+ years of design systems expertise. What interests you most?",
        "Hello! I help visitors explore Nihar's journey from NID to designing for 450+ daily users at Air India.",
        "Great to see you! This living portfolio adapts to your interests. How can I help you navigate?"
      ],
      'air-india': [
        "Welcome to the Air India transformation project! I designed systems serving 450+ daily users.",
        "This project showcases design systems at scale - from Pixel Radar plugin to mobile UX patterns.",
        "Hi! The Air India work represents real-world impact: faster reviews, consistent experiences, and hackathon wins.",
        "Hello! These 8 projects transformed Air India's digital experience. Which area interests you most?"
      ],
      'psychedelic': [
        "Welcome to the psychedelic journey project! This explores ego dissolution through interactive design.",
        "Hi! This installation combines TouchDesigner, Arduino, and AI-generated visuals for a safe transformative experience.",
        "Hello! This project was inspired by Timothy Leary's work - it's art meets consciousness exploration.",
        "Great to see you! This bathroom-to-mirror portal represents 2 months of 3D modeling, VR testing, and ethical design."
      ]
    };
    return responses[this.currentPage] || responses.home;
  }

  init() {
    this.createBotHTML();
    this.bindEvents();
    console.log(`🤖 Elegant Bot initialized for ${this.currentPage} page`);
  }

  createBotHTML() {
    const botHTML = `
      <!-- Elegant Bot FAB -->
      <button class="bot-fab" id="botFab" aria-label="Chat with Nihar's assistant">
        <span class="bot-icon">💬</span>
      </button>

      <!-- Elegant Bot Panel -->
      <div class="bot-panel" id="botPanel">
        <div class="bot-header">
          <div class="bot-status">
            <div class="bot-avatar">
              <span style="font-size: 16px;">🤖</span>
            </div>
            <div class="bot-info">
              <h3>Nihar's Assistant</h3>
              <p><span class="status-dot"></span> Online</p>
            </div>
          </div>
          <div class="bot-close" id="botClose">✕</div>
        </div>

        <div class="bot-body" id="botBody">
          <div class="bot-welcome">
            <div class="bot-avatar">
              <span style="font-size: 20px;">👋</span>
            </div>
            <h3>Hello! I'm here to help</h3>
            <p>Ask me about Nihar's work, experience, or any projects you see here.</p>
          </div>
        </div>

        <div class="bot-footer">
          <div class="bot-input-wrapper">
            <input
              type="text"
              class="bot-input"
              id="botInput"
              placeholder="Ask me anything..."
              maxlength="200"
            />
          </div>
          <button class="bot-send" id="botSend" aria-label="Send message">
            <span style="font-size: 16px;">→</span>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botHTML);
  }

  bindEvents() {
    const fab = document.getElementById('botFab');
    const panel = document.getElementById('botPanel');
    const close = document.getElementById('botClose');
    const input = document.getElementById('botInput');
    const send = document.getElementById('botSend');

    fab.addEventListener('click', () => this.toggle());
    close.addEventListener('click', () => this.close());
    send.addEventListener('click', () => this.sendMessage());

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    const panel = document.getElementById('botPanel');
    panel.classList.add('open');
    this.isOpen = true;

    // Welcome message if first time opening
    if (this.messageCount === 0) {
      setTimeout(() => {
        this.addWelcomeMessage();
      }, 300);
    }

    // Focus input
    setTimeout(() => {
      document.getElementById('botInput').focus();
    }, 400);
  }

  close() {
    const panel = document.getElementById('botPanel');
    panel.classList.remove('open');
    this.isOpen = false;
  }

  addWelcomeMessage() {
    const welcomeDiv = document.querySelector('.bot-welcome');
    if (welcomeDiv) {
      welcomeDiv.remove();
    }

    const randomResponse = this.responses[Math.floor(Math.random() * this.responses.length)];
    this.addMessage(randomResponse, 'bot');
    this.messageCount++;
  }

  sendMessage() {
    const input = document.getElementById('botInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    this.showTyping();

    // Generate bot response
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(message);
      this.addMessage(response, 'bot');
      this.messageCount++;
    }, 1000 + Math.random() * 1000); // Random delay for natural feeling
  }

  addMessage(text, sender) {
    const body = document.getElementById('botBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `msg ${sender}`;
    messageDiv.innerHTML = `
      ${text}
      <div class="msg-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;

    body.appendChild(messageDiv);
    body.scrollTop = body.scrollHeight;
  }

  showTyping() {
    const body = document.getElementById('botBody');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div></div><div></div><div></div>';

    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Page-specific responses
    if (this.currentPage === 'air-india') {
      if (message.includes('project') || message.includes('work')) {
        return "The Air India project involved 8 key initiatives: Pixel Radar plugin, analytics platform, mobile UX patterns, token architecture, IFE concepts, team enablement, and 2 hackathon wins now in production.";
      }
      if (message.includes('pixel radar') || message.includes('plugin')) {
        return "Pixel Radar is a Figma plugin I built to audit design token compliance. It significantly improved review speed and consistency across Air India's design system.";
      }
      if (message.includes('hackathon') || message.includes('win')) {
        return "I won 2 hackathons - an internal Air India innovation sprint and a Microsoft × Air India collaboration. Both prototypes moved to production within weeks.";
      }
    }

    if (this.currentPage === 'psychedelic') {
      if (message.includes('project') || message.includes('psychedelic')) {
        return "This installation explores ego dissolution through a bathroom-to-mirror portal. It combines TouchDesigner, Arduino, and AI-generated visuals for a safe, transformative experience.";
      }
      if (message.includes('technical') || message.includes('how')) {
        return "The technical stack includes TouchDesigner for visuals, Arduino for sensor input, Deforum Stable Diffusion for content generation, and VR for pre-visualization and testing.";
      }
      if (message.includes('safety') || message.includes('ethics')) {
        return "Safety was paramount: clear opt-out mechanisms, calming exit lighting, staff-visible indicators, and accessibility features like subtitles and seated options.";
      }
    }

    // General responses
    if (message.includes('experience') || message.includes('background')) {
      return "Nihar is a Master's graduate from NID with 3+ years in design systems. Currently revolutionizing Air India's digital experience, serving 450+ daily users.";
    }

    if (message.includes('contact') || message.includes('hire') || message.includes('work together')) {
      return "Nihar is open to new opportunities! You can reach out via the contact links in the footer or through LinkedIn for collaborations.";
    }

    if (message.includes('design system') || message.includes('tokens')) {
      return "Nihar specializes in scalable design systems. His token architecture and Pixel Radar plugin have transformed how teams maintain design consistency at scale.";
    }

    if (message.includes('portfolio') || message.includes('site')) {
      return "This living portfolio adapts to user behavior and features a particle system that responds to interaction. It's built with vanilla JavaScript for performance.";
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! Nihar's work spans design systems, data visualization, and interactive experiences. What specific area would you like to know more about?",
      "Great question! Nihar focuses on reducing the gap between thought and action through thoughtful interface design. Is there a particular project that caught your eye?",
      "I'd love to help you learn more about Nihar's work! His expertise includes design systems, aviation UX, and experimental interfaces. What interests you most?",
      "Thanks for asking! Nihar believes interfaces should have consciousness - they should remember, adapt, and evolve. Which aspect of his work would you like to explore?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}

// Initialize bot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ElegantBot());
} else {
  new ElegantBot();
}