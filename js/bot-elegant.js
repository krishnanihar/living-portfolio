// ELEGANT BOT - Clean & Modern Implementation
class ElegantBot {
  constructor() {
    this.isOpen = false;
    this.messageCount = 0;
    this.currentPage = this.detectCurrentPage();
    this.responses = this.getPageResponses();
    this.typingTimeout = null;
    this.elements = {};

    this.init();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('air-india')) return 'air-india';
    if (path.includes('psychedelic')) return 'psychedelic';
    if (path.includes('latent-space')) return 'latent-space';
    if (path.includes('work')) return 'work';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    if (path.includes('index') || path === '/') return 'home';
    return 'home';
  }

  getPageResponses() {
    const responses = {
      home: [
        "Welcome! I'm Nihar's digital assistant. I can tell you about his work, background, or current projects.",
        "Hi there! This portfolio showcases 3+ years of design systems expertise. What interests you most?",
        "Hello! I help visitors explore Nihar's journey from NID to designing for 450+ daily users at Air India.",
        "Great to see you! This living portfolio adapts to your interests. How can I help you navigate?",
        "Welcome back! I see you're exploring my portfolio. Want to know about my latest project?",
        "Hey there! I've been working on some fascinating living interfaces lately.",
        "Great to see you! Did you know this portfolio adapts to your behavior?"
      ],
      work: [
        "You're checking out my work! Pixel Radar is my proudest achievement - it's reduced design review time by 30%.",
        "Welcome to my professional journey! 3+ years of design system expertise, currently revolutionizing Air India's digital experience.",
        "Fun fact: My aviation dashboards process 450+ daily users. That's real-time design at scale!",
        "Each project here represents a problem solved. Which challenge interests you most?"
      ],
      about: [
        "Want to know more about me? I'm a Master's graduate from NID, but that's just the beginning...",
        "Beyond the credentials, I believe interfaces should have consciousness. That's why I built this system!",
        "4+ years, 12 products shipped, and I'm still obsessed with reducing the gap between thought and action.",
        "I'm Nihar - I craft interfaces that remember, adapt, and evolve. Let me tell you my story..."
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
      ],
      'latent-space': [
        "Welcome to Latent Space! This speculative design explores the ethics of dream technology and consciousness interfaces.",
        "Hi! This project examines the boundaries between privacy, consciousness, and AI through interactive dream interface concepts.",
        "Hello! Latent Space is a thought-provoking exploration of future technology's impact on our most private thoughts - our dreams.",
        "Great to see you! This speculative design asks: what happens when AI can read our dreams? Navigate through the ethical implications."
      ]
    };
    return responses[this.currentPage] || responses.home;
  }

  init() {
    this.createBotHTML();
    this.bindEvents();
    this.setupAccessibility();
    console.log(`✨ Elegant Bot initialized for ${this.currentPage} page`);
  }

  createBotHTML() {
    const botHTML = `
      <!-- Elegant Bot FAB -->
      <button class="bot-fab" id="botFab" aria-label="Chat with Nihar's assistant" tabindex="0">
        <span class="bot-fab-icon" aria-hidden="true">💬</span>
      </button>

      <!-- Elegant Bot Panel -->
      <div class="bot-panel" id="botPanel" role="dialog" aria-labelledby="botTitle" aria-hidden="true">
        <div class="bot-header">
          <div class="bot-info">
            <div class="bot-avatar" aria-hidden="true">
              <span>🤖</span>
            </div>
            <div class="bot-details">
              <h3 id="botTitle">Nihar's Assistant</h3>
              <p><span class="status-dot" aria-hidden="true"></span> Online</p>
            </div>
          </div>
          <button class="bot-close" id="botClose" aria-label="Close chat">
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div class="bot-messages" id="botMessages" role="log" aria-live="polite" aria-label="Chat messages">
          <div class="bot-welcome">
            <div class="bot-avatar" aria-hidden="true">
              <span>👋</span>
            </div>
            <h3>Hello! I'm here to help</h3>
            <p>Ask me about Nihar's work, experience, or any projects you see here.</p>
          </div>
        </div>

        <div class="bot-footer">
          <div class="bot-input-wrapper">
            <textarea
              class="bot-input"
              id="botInput"
              placeholder="Ask me anything..."
              maxlength="500"
              rows="1"
              aria-label="Type your message"
            ></textarea>
          </div>
          <button class="bot-send" id="botSend" aria-label="Send message" disabled>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    const container = document.getElementById('bot-container') || document.body;
    container.insertAdjacentHTML('beforeend', botHTML);

    // Store references
    this.elements = {
      fab: document.getElementById('botFab'),
      panel: document.getElementById('botPanel'),
      close: document.getElementById('botClose'),
      messages: document.getElementById('botMessages'),
      input: document.getElementById('botInput'),
      send: document.getElementById('botSend')
    };
  }

  bindEvents() {
    // FAB click
    this.elements.fab.addEventListener('click', () => this.toggleBot());

    // Close button
    this.elements.close.addEventListener('click', () => this.closeBot());

    // Send button
    this.elements.send.addEventListener('click', () => this.sendMessage());

    // Input handling
    this.elements.input.addEventListener('input', (e) => this.handleInputChange(e));
    this.elements.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.elements.panel.contains(e.target) && e.target !== this.elements.fab) {
        this.closeBot();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeBot();
        this.elements.fab.focus();
      }
    });
  }

  setupAccessibility() {
    // Auto-resize textarea
    this.elements.input.addEventListener('input', () => {
      this.elements.input.style.height = 'auto';
      this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 120) + 'px';
    });

    // Focus management
    this.elements.panel.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  }

  trapFocus(e) {
    const focusableElements = this.elements.panel.querySelectorAll(
      'button, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  toggleBot() {
    if (this.isOpen) {
      this.closeBot();
    } else {
      this.openBot();
    }
  }

  openBot() {
    this.isOpen = true;
    this.elements.panel.classList.add('open');
    this.elements.panel.setAttribute('aria-hidden', 'false');

    // Focus first interactive element
    setTimeout(() => {
      this.elements.input.focus();
    }, 300);

    // Send welcome message if first time
    if (this.messageCount === 0) {
      setTimeout(() => {
        this.addBotMessage(this.getRandomResponse());
      }, 600);
    }

    // Update FAB appearance
    this.elements.fab.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.elements.fab.style.transform = 'scale(1)';
    }, 100);
  }

  closeBot() {
    this.isOpen = false;
    this.elements.panel.classList.remove('open');
    this.elements.panel.setAttribute('aria-hidden', 'true');

    // Clear any typing indicators
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.removeTypingIndicator();
  }

  handleInputChange(e) {
    const value = e.target.value.trim();
    this.elements.send.disabled = !value;

    if (value) {
      this.elements.send.style.opacity = '1';
      this.elements.send.style.transform = 'scale(1)';
    } else {
      this.elements.send.style.opacity = '0.5';
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!this.elements.send.disabled) {
        this.sendMessage();
      }
    }
  }

  sendMessage() {
    const message = this.elements.input.value.trim();
    if (!message) return;

    // Add user message
    this.addUserMessage(message);

    // Clear input
    this.elements.input.value = '';
    this.elements.input.style.height = 'auto';
    this.elements.send.disabled = true;
    this.elements.send.style.opacity = '0.5';

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate bot response
    this.typingTimeout = setTimeout(() => {
      this.removeTypingIndicator();
      this.addBotMessage(this.generateResponse(message));
    }, 1000 + Math.random() * 1000);
  }

  addUserMessage(message) {
    const messageEl = this.createMessageElement(message, 'user');
    this.elements.messages.appendChild(messageEl);
    this.scrollToBottom();
    this.messageCount++;
  }

  addBotMessage(message) {
    const messageEl = this.createMessageElement(message, 'bot');
    this.elements.messages.appendChild(messageEl);
    this.scrollToBottom();
    this.messageCount++;
  }

  createMessageElement(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;

    const timeEl = document.createElement('div');
    timeEl.className = 'message-time';
    timeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageEl.appendChild(timeEl);

    return messageEl;
  }

  showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.id = 'typingIndicator';
    typingEl.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    this.elements.messages.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingEl = document.getElementById('typingIndicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }, 100);
  }

  getRandomResponse() {
    const responses = this.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Context-aware responses
    if (message.includes('work') || message.includes('project')) {
      return "I've worked on fascinating projects! From Air India's design systems to speculative consciousness interfaces. Which type of work interests you?";
    }

    if (message.includes('experience') || message.includes('background')) {
      return "Nihar has 4+ years of design systems expertise, a Master's from NID, and currently works at Air India serving 450+ daily users. Want to know more about any specific area?";
    }

    if (message.includes('contact') || message.includes('reach') || message.includes('hire')) {
      return "You can reach Nihar at krishnan.nihar@gmail.com or connect on LinkedIn. He's always excited to discuss design systems and living interfaces!";
    }

    if (message.includes('ai') || message.includes('artificial intelligence')) {
      return "Great question! Nihar explores AI in design through projects like Latent Space - examining ethics of dream technology. AI should augment human creativity, not replace it.";
    }

    if (message.includes('design system')) {
      return "Design systems are Nihar's specialty! His Pixel Radar plugin reduced review time by 30% and he's built systems serving hundreds of users. Want to see some examples?";
    }

    // Fallback to random contextual response
    return this.getRandomResponse();
  }

  // Public methods for external integration
  addMessage(message, type = 'bot') {
    if (type === 'bot') {
      this.addBotMessage(message);
    } else {
      this.addUserMessage(message);
    }
  }

  open() {
    if (!this.isOpen) {
      this.openBot();
    }
  }

  close() {
    if (this.isOpen) {
      this.closeBot();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ElegantBot = new ElegantBot();
  });
} else {
  window.ElegantBot = new ElegantBot();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ElegantBot;
}