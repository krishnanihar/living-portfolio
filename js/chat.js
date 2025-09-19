// js/chat.js - Enhanced Chat Module with Gemini AI Integration
const Chat = {
  initialized: false,
  botPanel: null,
  botBody: null,
  botInput: null,
  heroInput: null,
  messageCount: 0,
  typingTimeout: null,
  particles: [],
  animateParticles: null,
  currentSection: 'home',
  pendingSection: null,
  lastReactedSection: null,
  notificationTimeout: null,
  conversationHistory: [], // Store conversation history for context
  
  // API Configuration
  API_ENDPOINT: '/api/chat', // Vercel API route
  USE_GEMINI: true, // Toggle between Gemini and local responses
  
  // Section-specific contextual messages (for initial greetings)
  contextualMessages: {
    home: [
      "Welcome back! I see you're exploring my portfolio. Want to know about my latest project?",
      "Hey there! I've been working on some fascinating living interfaces lately.",
      "Great to see you! Did you know this portfolio adapts to your behavior?",
      "Back at the home base! This is where the journey begins. What would you like to explore?"
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
    reading: [
      "You've found my knowledge garden! Currently reading 'Gödel, Escher, Bach' - it's reshaping how I think about recursive design.",
      "234 hours in Baldur's Gate 3! I study game mechanics to inform my interaction design.",
      "Books shape strategy, games teach systems. I blend both into my design philosophy.",
      "This is where I document my learning journey. Notice how the knowledge graph connects everything?"
    ]
  },
  
  init() {
    console.log('🤖 Initializing Enhanced Chat Bot with Gemini AI...');
    this.createEnhancedBot();
    this.setupHeroChat();
    this.startPromptRotation();
    this.initBotParticles();
    this.initSectionObserver();
    
    // Make functions globally available for onclick handlers
    window.chatOpen = () => this.open();
    window.chatClose = () => this.close();
    window.chatQuickSend = (text) => this.quickSend(text);
    
    console.log('✅ Chat Bot initialized with Gemini:', this.USE_GEMINI);
  },
  
  createEnhancedBot() {
    const botHTML = `
      <!-- Bot FAB Button -->
      <button class="bot-fab" id="botFab" aria-label="Open digital consciousness">
        <div class="bot-avatar">
          <!-- Elegant consciousness icon -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="bot-consciousness">
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="1" opacity="0.7"/>
            <circle cx="12" cy="12" r="5" stroke="white" stroke-width="0.8" opacity="0.5"/>
            <circle cx="12" cy="12" r="2" fill="white" opacity="0.9"/>
            <path d="M12 3v2M12 19v2M21 12h-2M5 12H3" stroke="white" stroke-width="0.8" opacity="0.6"/>
          </svg>
        </div>
        <span class="bot-fab-pulse"></span>
      </button>
      
      <!-- Bot Panel -->
      <section class="bot-panel" id="botPanel" aria-label="Digital consciousness chat" data-section="home">
        <canvas class="bot-particle-field" id="botParticles"></canvas>
        
        <div class="bot-header">
          <div class="bot-status">
            <div class="bot-status-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="white" stroke-width="0.8" opacity="0.7"/>
                <circle cx="12" cy="12" r="4" stroke="white" stroke-width="0.6" opacity="0.5"/>
                <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.9"/>
                <path d="M12 4v1.5M12 18.5v1.5M20 12h-1.5M5.5 12H4" stroke="white" stroke-width="0.6" opacity="0.6"/>
              </svg>
            </div>
            <div class="bot-status-info">
              <div class="bot-status-name">
                Nihar's Consciousness
                <span style="font-size: 10px; opacity: 0.6;">AI-powered</span>
              </div>
              <div class="bot-status-state">
                <span class="status-dot"></span>
                <span id="botState">🏠 Exploring home</span>
              </div>
            </div>
          </div>
          <button class="bot-close" id="botClose">✕</button>
        </div>
        
        <div class="bot-body" id="botBody">
          <div class="bot-welcome">
            <div class="bot-welcome-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" opacity="0.9"/>
                <path d="M2 17L12 22L22 17" stroke="white" stroke-width="1.5" stroke-linejoin="round" opacity="0.7"/>
                <path d="M2 12L12 17L22 12" stroke="white" stroke-width="1.5" stroke-linejoin="round" opacity="0.5"/>
              </svg>
            </div>
            <h3 style="margin: 0 0 8px; font-weight: 600;">Welcome to my consciousness</h3>
            <p style="color: var(--text-dim); font-size: 13px; margin: 0;">
              Powered by AI. I remember our interactions and evolve with each conversation.
            </p>
          </div>
        </div>
        
        <div class="bot-suggestions" id="botSuggestions">
          <button class="suggestion-pill" data-msg="Tell me about Pixel Radar">
            Pixel Radar
          </button>
          <button class="suggestion-pill" data-msg="How do you approach design?">
            Design Process
          </button>
          <button class="suggestion-pill" data-msg="What makes you different?">
            Philosophy
          </button>
        </div>
        
        <div class="bot-footer">
          <div class="bot-input-wrapper">
            <input 
              id="botInput" 
              class="bot-input" 
              type="text" 
              placeholder="Ask me anything..."
              autocomplete="off"
            />
          </div>
          <button id="botSend" class="bot-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </section>
    `;
    
    // Insert HTML
    const container = document.getElementById('bot-container');
    if (container) {
      container.innerHTML = botHTML;
      
      // Get elements
      this.botPanel = document.getElementById('botPanel');
      this.botBody = document.getElementById('botBody');
      this.botInput = document.getElementById('botInput');
      
      // Set up event listeners properly
      this.setupBotEventListeners();
    } else {
      console.error('Bot container not found!');
    }
  },
  
  setupBotEventListeners() {
    // Enhanced FAB button with glassmorphic interactions
    const fab = document.getElementById('botFab');
    if (fab) {
      fab.addEventListener('click', () => this.open());
      
      // Add glassmorphic hover effects
      fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'scale(1.08) translateY(-2px)';
        fab.style.filter = 'brightness(1.1)';
      });
      
      fab.addEventListener('mouseleave', () => {
        fab.style.transform = 'scale(1) translateY(0px)';
        fab.style.filter = 'brightness(1)';
      });
      
      // Enhanced active state
      fab.addEventListener('mousedown', () => {
        fab.style.transform = 'scale(1.02) translateY(0px)';
      });
      
      fab.addEventListener('mouseup', () => {
        fab.style.transform = 'scale(1.08) translateY(-2px)';
      });
    }
    
    // Enhanced close button with glassmorphic interactions
    const closeBtn = document.getElementById('botClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
      
      // Add glassmorphic hover effects
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'rotate(90deg) scale(1.05)';
        closeBtn.style.filter = 'brightness(1.2)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'rotate(0deg) scale(1)';
        closeBtn.style.filter = 'brightness(1)';
      });
    }
    
    // Enhanced send button with glassmorphic interactions
    const sendBtn = document.getElementById('botSend');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendFromBot());
      
      // Add glassmorphic hover effects
      sendBtn.addEventListener('mouseenter', () => {
        sendBtn.style.transform = 'scale(1.08) translateY(-1px)';
        sendBtn.style.filter = 'brightness(1.1) saturate(1.2)';
      });
      
      sendBtn.addEventListener('mouseleave', () => {
        sendBtn.style.transform = 'scale(1) translateY(0px)';
        sendBtn.style.filter = 'brightness(1) saturate(1)';
      });
      
      // Enhanced active state
      sendBtn.addEventListener('mousedown', () => {
        sendBtn.style.transform = 'scale(1.02) translateY(0px)';
      });
      
      sendBtn.addEventListener('mouseup', () => {
        sendBtn.style.transform = 'scale(1.08) translateY(-1px)';
      });
    }
    
    // Enhanced input with glassmorphic interactions
    if (this.botInput) {
      this.botInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendFromBot();
          
          // Add send animation
          const sendBtn = document.getElementById('botSend');
          if (sendBtn) {
            sendBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
              sendBtn.style.transform = 'scale(1)';
            }, 150);
          }
        }
      });
      
      this.botInput.addEventListener('input', () => {
        this.updateBotState('typing');
        
        // Add subtle glow while typing
        this.botInput.style.boxShadow = '0 0 0 3px rgba(218, 14, 41, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
      });
      
      this.botInput.addEventListener('blur', () => {
        this.botInput.style.boxShadow = '';
      });
      
      // Enhanced focus interactions
      this.botInput.addEventListener('focus', () => {
        this.botInput.style.filter = 'brightness(1.05)';
      });
    }
    
    // Suggestion pills
    const pills = document.querySelectorAll('.suggestion-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const msg = pill.dataset.msg;
        if (msg) {
          this.quickSend(msg);
        }
      });
    });
  },
  
  initSectionObserver() {
    // Track when user enters new sections
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          this.onSectionChange(section);
        }
      });
    }, observerOptions);
    
    // Observe all main sections
    const sections = ['home', 'work', 'about', 'reading'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    // Also listen to navigation clicks for immediate response
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const section = link.dataset.section || link.getAttribute('href')?.replace('#', '');
        if (section) {
          setTimeout(() => this.onSectionChange(section), 500);
        }
      });
    });
  },
  
  onSectionChange(newSection) {
    // Don't react if it's the same section
    if (this.currentSection === newSection) return;
    
    this.currentSection = newSection;
    
    // Update bot panel data attribute
    if (this.botPanel) {
      this.botPanel.dataset.section = newSection;
    }
    
    // If bot is open, send contextual message
    if (this.botPanel && this.botPanel.classList.contains('open')) {
      this.sendContextualMessage(newSection);
    } else {
      // Store for when bot opens
      this.pendingSection = newSection;
      
      // Show a subtle notification
      this.showSectionNotification(newSection);
    }
    
    // Update bot mood/color based on section
    this.updateBotMood(newSection);
  },
  
  sendContextualMessage(section) {
    const messages = this.contextualMessages[section];
    if (!messages) return;
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // Add a small delay to feel more natural
    setTimeout(() => {
      this.showTyping();
      
      setTimeout(() => {
        this.hideTyping();
        this.appendMessage(message, 'bot', true); // true = contextual
        
        // Show section-specific quick actions
        this.showSectionActions(section);
      }, 1000 + Math.random() * 500);
    }, 500);
  },
  
  showSectionActions(section) {
    const actions = {
      work: [
        { text: "Tell me about Pixel Radar", action: "pixel radar" },
        { text: "Air India project", action: "aviation analytics" }
      ],
      about: [
        { text: "Your design process", action: "design process" },
        { text: "How can you help?", action: "how can you help" }
      ],
      reading: [
        { text: "Current books", action: "what are you reading" },
        { text: "Game insights", action: "how do games influence your design" }
      ]
    };
    
    const sectionActions = actions[section];
    if (!sectionActions) return;
    
    // Create temporary action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'quick-actions';
    
    sectionActions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = 'quick-action-btn';
      btn.textContent = action.text;
      
      btn.addEventListener('click', () => {
        this.send(action.action);
        actionsDiv.remove();
      });
      
      actionsDiv.appendChild(btn);
    });
    
    // Append after last bot message
    const lastBotMsg = [...this.botBody.querySelectorAll('.msg.bot')].pop();
    if (lastBotMsg) {
      lastBotMsg.appendChild(actionsDiv);
    }
  },
  
  showSectionNotification(section) {
    // Create or get notification element
    let notification = document.getElementById('botSectionNotification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'botSectionNotification';
      notification.className = 'bot-section-notification';
      document.body.appendChild(notification);
      
      notification.addEventListener('click', () => {
        this.open();
        notification.classList.remove('show');
      });
    }
    
    // Update notification content
    const sectionNames = {
      work: "Exploring my work",
      about: "Learning about me",
      reading: "Browsing my knowledge"
    };
    
    notification.innerHTML = `
      <div class="notification-dot"></div>
      <div class="notification-text">
        ${sectionNames[section] || "Navigating"}... I have insights!
      </div>
    `;
    
    // Show notification
    notification.classList.add('show');
    
    // Auto-hide after 3 seconds
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  },
  
  updateBotMood(section) {
    const moods = {
      home: { color: '#da0e29', emoji: '🏠' },
      work: { color: '#3b82f6', emoji: '💼' },
      about: { color: '#8b5cf6', emoji: '👤' },
      reading: { color: '#10b981', emoji: '📚' }
    };
    
    const mood = moods[section] || moods.home;
    
    // Update bot avatar if visible
    const avatar = document.querySelector('.bot-status-avatar');
    if (avatar) {
      avatar.style.background = `linear-gradient(135deg, ${mood.color}, ${mood.color}dd)`;
      avatar.style.boxShadow = `0 0 20px ${mood.color}66`;
    }
    
    // Update send button
    const sendBtn = document.querySelector('.bot-send');
    if (sendBtn) {
      sendBtn.style.background = `linear-gradient(135deg, ${mood.color}, ${mood.color}dd)`;
    }
    
    // Update bot state text
    const stateEl = document.getElementById('botState');
    if (stateEl) {
      stateEl.innerHTML = `${mood.emoji} Exploring ${section}`;
    }
  },
  
  setupHeroChat() {
    this.heroInput = document.getElementById('heroInput');
    const heroSend = document.getElementById('heroSend');
    
    if (heroSend) {
      heroSend.addEventListener('click', () => this.sendFromHero());
    }
    
    if (this.heroInput) {
      this.heroInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendFromHero();
        }
      });
    }
    
    // Quick pills in hero section
    const quickPills = document.querySelectorAll('#quickPills .pill');
    quickPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const ask = pill.dataset.ask;
        if (ask) {
          this.send(ask);
          this.open();
        }
      });
    });
  },
  
  startPromptRotation() {
    const prompts = [
      "Try: What makes Pixel Radar unique?",
      "Ask: How do you approach design systems?",
      "Type: Show me your process",
      "Ask: What are you building next?",
      "Try: Tell me about living interfaces",
      "Ask: How can you help my team?"
    ];
    
    let index = 0;
    setInterval(() => {
      if (this.heroInput && !this.heroInput.value) {
        this.heroInput.placeholder = prompts[index];
        index = (index + 1) % prompts.length;
      }
    }, 4000);
  },
  
  initBotParticles() {
    const canvas = document.getElementById('botParticles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      const panel = document.getElementById('botPanel');
      if (panel) {
        canvas.width = panel.offsetWidth;
        canvas.height = panel.offsetHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 14, 41, ${p.opacity})`;
        ctx.fill();
      });
      
      if (this.botPanel && this.botPanel.classList.contains('open')) {
        requestAnimationFrame(animate);
      }
    };
    
    this.animateParticles = animate;
  },
  
  updateBotState(state) {
    const stateEl = document.getElementById('botState');
    if (!stateEl) return;
    
    const states = {
      idle: 'Active & listening',
      typing: 'Detecting input...',
      thinking: 'Processing thoughts...',
      responding: 'Crafting response...'
    };
    
    // Keep the section emoji if we have one
    const currentText = stateEl.textContent;
    const emoji = currentText.match(/^[^\s]+/)?.[0] || '🏠';
    
    if (state === 'idle') {
      // Return to section state
      this.updateBotMood(this.currentSection);
    } else {
      stateEl.textContent = states[state] || states.idle;
    }
  },
  
  open() {
    if (!this.botPanel) {
      console.error('Bot panel not found!');
      return;
    }
    
    if (!this.initialized) {
      this.initialized = true;
      this.addWelcomeMessage();
    }
    
    // Enhanced glassmorphic entrance animation
    this.botPanel.style.display = 'block';
    this.botPanel.style.animation = 'panelEntrance 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    
    // Trigger open state after display
    setTimeout(() => {
      this.botPanel.classList.add('open');
    }, 10);
    
    this.botPanel.setAttribute('aria-hidden', 'false');
    
    // Focus input after animation
    setTimeout(() => {
      if (this.botInput) {
        this.botInput.focus();
      }
    }, 300);
    
    // Start particle animation
    if (this.animateParticles) {
      this.animateParticles();
    }
    
    // Check if there's a pending section to react to
    if (this.pendingSection && this.pendingSection !== this.lastReactedSection) {
      this.sendContextualMessage(this.pendingSection);
      this.lastReactedSection = this.pendingSection;
      this.pendingSection = null;
    }
    
    // Trigger main particles
    if (window.Particles && window.Particles.setFormation) {
      Particles.setFormation('ring');
    }
    
    // Hide suggestions after first interaction
    if (this.messageCount > 2) {
      const suggestions = document.getElementById('botSuggestions');
      if (suggestions) suggestions.style.display = 'none';
    }
    
    this.updateBotState('idle');
  },
  
  close() {
    if (!this.botPanel) return;
    
    this.botPanel.classList.remove('open');
    
    // Hide after animation
    setTimeout(() => {
      this.botPanel.style.display = 'none';
    }, 300);
    
    this.botPanel.setAttribute('aria-hidden', 'true');
    this.updateBotState('idle');
    
    // Reset particles
    if (window.Particles && window.Particles.setFormation) {
      Particles.setFormation('dna');
    }
  },
  
  addWelcomeMessage() {
    const welcomeMsg = "Hello! I'm Nihar's digital consciousness, powered by AI. How can I illuminate your path today?";
    setTimeout(() => {
      this.appendMessage(welcomeMsg, 'bot');
    }, 500);
  },
  
  quickSend(text) {
    this.send(text);
    const suggestions = document.getElementById('botSuggestions');
    if (suggestions) {
      suggestions.style.display = 'none';
    }
  },
  
  sendFromBot() {
    const text = this.botInput.value.trim();
    if (!text) return;
    
    this.send(text);
    this.botInput.value = '';
  },
  
  sendFromHero() {
    if (!this.heroInput) return;
    const text = this.heroInput.value.trim();
    if (!text) return;
    
    this.send(text);
    this.heroInput.value = '';
    this.open();
  },
  
  async send(text) {
    // Add user message
    this.appendMessage(text, 'you');
    this.conversationHistory.push({ role: 'user', content: text });
    
    // Update state
    this.updateBotState('thinking');
    
    // Show typing
    this.showTyping();
    
    // Track interaction
    if (window.State) {
      State.interactionPatterns.conversationalist++;
    }
    
    if (this.USE_GEMINI) {
      // Call Gemini API
      try {
        const response = await this.callGeminiAPI(text);
        
        this.hideTyping();
        this.updateBotState('responding');
        
        // Simulate typing speed
        const typingDelay = Math.min(response.length * 10, 1000);
        
        setTimeout(() => {
          this.appendMessage(response, 'bot');
          this.updateBotState('idle');
        }, typingDelay);
      } catch (error) {
        console.error('Error calling Gemini:', error);
        
        // Fallback to local response
        this.hideTyping();
        const fallbackResponse = "I'm having trouble connecting to my AI consciousness. Let me try to help you directly - what would you like to know about my work or design philosophy?";
        this.appendMessage(fallbackResponse, 'bot');
        this.updateBotState('idle');
      }
    } else {
      // Use local response generation (existing logic)
      const thinkingTime = 800 + Math.random() * 1200;
      
      setTimeout(() => {
        this.hideTyping();
        this.updateBotState('responding');
        
        const response = this.generateLocalResponse(text);
        
        // Simulate typing speed
        const typingDelay = Math.min(response.length * 10, 1000);
        
        setTimeout(() => {
          this.appendMessage(response, 'bot');
          this.updateBotState('idle');
        }, typingDelay);
      }, thinkingTime);
    }
  },
  
  async callGeminiAPI(message) {
    const hour = new Date().getHours();
    const timeOnSite = Math.round((Date.now() - (window.State ? State.pageLoadTime : Date.now())) / 1000);
    
    // Build context
    const context = {
      currentSection: this.currentSection,
      timeOnSite: timeOnSite,
      visitNumber: window.State ? State.visits : 1,
      previousMessages: this.conversationHistory.slice(-10) // Last 10 messages for context
    };
    
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: context
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process keywords for particle effects
      if (data.keywords && data.keywords.length > 0) {
        this.processKeywords(data.keywords);
      }
      
      // Add to conversation history
      this.conversationHistory.push({ role: 'assistant', content: data.response });
      
      return data.response;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  },
  
  processKeywords(keywords) {
    // Trigger particle effects based on detected keywords
    keywords.forEach(({ keyword, section }) => {
      const sectionElement = document.getElementById(section);
      if (sectionElement && window.Particles) {
        // Trigger particle attraction toward that section
        setTimeout(() => {
          if (typeof Particles.triggerKeywordAttraction === 'function') {
            Particles.triggerKeywordAttraction(keyword, sectionElement);
          }
          
          // Create a visual pulse at that section
          const rect = sectionElement.getBoundingClientRect();
          if (typeof Particles.createBurst === 'function') {
            Particles.createBurst(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              section === 'work' ? 'rgba(59, 130, 246, 0.8)' :
              section === 'reading' ? 'rgba(16, 185, 129, 0.8)' :
              'rgba(139, 92, 246, 0.8)'
            );
          }
        }, 500);
        
        console.log(`Gemini detected keyword "${keyword}" - particles will point to ${section}`);
      }
    });
  },
  
  generateLocalResponse(question) {
    // Fallback local response generation (existing logic)
    const q = question.toLowerCase();
    const hour = new Date().getHours();
    const timeOnSite = Math.round((Date.now() - (window.State ? State.pageLoadTime : Date.now())) / 1000);
    
    // Add context
    let prefix = '';
    if (hour < 6) prefix = "You're up late! ";
    else if (window.State && State.visits > 1) prefix = `Welcome back (visit #${State.visits}). `;
    else if (timeOnSite < 5) prefix = "Quick question! ";
    
    // Basic keyword matching for fallback
    const responses = {
      'pixel radar': `Pixel Radar is my Figma QA assistant that audits components against tokens/variables. It flags drift, suggests fixes, and can comment directly on PRs via a CI hook.`,
      'air india': `I'm currently at Air India DesignLAB, leading design transformation for India's flag carrier. Building scalable design systems across web, mobile, and in-flight entertainment.`,
      'design process': `Three pillars: (1) Systems — tokens, variables, guardrails. (2) Narrative — the story users follow under pressure. (3) Instrumentation — metrics, logs, and feedback that help the interface evolve.`,
      'living interfaces': `Interfaces that breathe, remember, and evolve. Motion is purposeful, memory adapts system behavior, and the UI learns from usage to optimize attention and friction.`
    };
    
    for (const [key, response] of Object.entries(responses)) {
      if (q.includes(key)) {
        return prefix + response;
      }
    }
    
    // Default response
    return prefix + "That's an interesting question! Feel free to ask about Pixel Radar, my design process, or how I can help your team build living interfaces.";
  },
  
  appendMessage(text, sender, isContextual = false) {
    if (!this.botBody) return;
    
    this.messageCount++;
    
    // Remove welcome message if it exists
    const welcome = this.botBody.querySelector('.bot-welcome');
    if (welcome) welcome.remove();
    
    const div = document.createElement('div');
    div.className = `msg ${sender}${isContextual ? ' contextual' : ''}`;
    div.innerHTML = `
      <div class="msg-content">${text}</div>
      <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    
    this.botBody.appendChild(div);
    this.botBody.scrollTop = this.botBody.scrollHeight;
    
    // Trigger particle burst for messages
    if (window.Particles && typeof Particles.createBurst === 'function') {
      const rect = div.getBoundingClientRect();
      const color = sender === 'you' ? 'rgba(218, 14, 41, 0.6)' : 'rgba(255, 255, 255, 0.4)';
      Particles.createBurst(rect.left + rect.width/2, rect.top + rect.height/2, color);
    }
  },
  
  showTyping() {
    if (!this.botBody) return;
    
    const typing = document.createElement('div');
    typing.className = 'typing msg bot';
    typing.id = 'typing';
    typing.innerHTML = '<div></div><div></div><div></div>';
    this.botBody.appendChild(typing);
    this.botBody.scrollTop = this.botBody.scrollHeight;
  },
  
  hideTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
  }
};

// Make Chat globally available
window.Chat = Chat;
