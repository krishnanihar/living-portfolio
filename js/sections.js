// Sections Module - Fixed Version (No Conflicts)
const Sections = {
  async init() {
    console.log('📄 Loading sections...');
    
    try {
      await this.loadHero();
      await this.loadWork();
      await this.loadReading();
      await this.loadAbout();
      
      this.setupInteractions();

      // Re-initialize navigation and theme after sections load
      setTimeout(() => {
        // Re-initialize navigation to observe new sections
        if (window.Navigation && Navigation.setupScrollSpy) {
          console.log('🔄 Re-initializing navigation for loaded sections...');
          Navigation.setupScrollSpy();
        }

        // Re-initialize theme snap scrolling
        if (window.Theme && Theme.initMobileSnapScroll) {
          Theme.initMobileSnapScroll();
        }
      }, 100);
      
      console.log('✅ All sections loaded');
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  },
  
  async loadHero() {
    const html = `
      <header id="home" class="hero" aria-label="Hero">
        
        <!-- Hero Card with 3D Effect -->
        <div class="hero-inner" id="heroCard">
          
          <!-- Dynamic Title -->
          <h1 class="hero-title kinetic" id="heroTitle">
            <span class="hero-greeting" id="heroGreeting"></span>
            <span class="hero-intro" id="heroIntro"></span>
          </h1>
          
          <!-- Chat Interface -->
          <div class="chat-bar enhanced">
            <input
              id="heroInput"
              class="chat-input"
              type="text"
              placeholder="What makes Pixel Radar revolutionary?"
              autocomplete="off"
            />
            <button id="heroSend" class="btn-send">
              <span class="send-text">Send</span>
            </button>
          </div>

          <!-- Simplified Navigation -->
          <div class="nav-pills" id="quickPills">
            <button class="pill pill-primary" onclick="if(window.Deck) Deck.open()">
              Quick Tour
            </button>
            <button class="pill pill-work" data-section="work" onclick="document.getElementById('work').scrollIntoView({behavior: 'smooth'})">
              Show me work
            </button>
            <button class="pill pill-about" data-section="about" onclick="document.getElementById('about').scrollIntoView({behavior: 'smooth'})">
              About me
            </button>
          </div>
          
          <!-- Trust Signals -->
          <div class="hero-trust">
            <span class="trust-item">Air India DesignLAB</span>
            <span class="trust-item">National Institute of Design</span>
            <span class="trust-item">Indian School of Business</span>
            <span class="trust-item">Microsoft</span>
          </div>
          
        </div>
      </header>
      
      <!-- Glass cursor (OUTSIDE hero for proper positioning) -->
      <div class="glass-cursor" aria-hidden="true" id="glass"></div>
    `;
    
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.innerHTML = html;
    }
    
    // Initialize features
    this.initHeroEnhancements();
    this.setupHero();
    this.initGlassCursor();
    
    // Initialize 3D after hero is created
    setTimeout(() => {
      if (window.init3DEffect) {
        window.init3DEffect();
      }
    }, 100);
  },
  
  initHeroEnhancements() {
    // Store enhancement functions
    this.heroEnhancements = {
      typingPhrases: [
        "I build living interfaces",
        "I reduce decision latency",
        "I craft design systems",
        "I visualize complex data",
        "I create with consciousness"
      ]
    };
    
    // Initialize typewriter effect
    const greeting = document.getElementById('heroGreeting');
    const intro = document.getElementById('heroIntro');
    
    if (greeting && intro) {
      // Determine greeting based on time
      const hour = new Date().getHours();
      let greetingText = '';
      if (hour < 6) greetingText = "Night owl detected.";
      else if (hour < 12) greetingText = "Good morning.";
      else if (hour < 18) greetingText = "Good afternoon.";
      else greetingText = "Good evening.";
      
      greeting.textContent = greetingText;
      intro.textContent = this.heroEnhancements.typingPhrases[0];
      
      // Start cycling through phrases
      this.cycleIntroText();
    }
  },
  
  cycleIntroText() {
    const intro = document.getElementById('heroIntro');
    if (!intro) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
      currentIndex = (currentIndex + 1) % this.heroEnhancements.typingPhrases.length;
      
      intro.style.opacity = '0';
      intro.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        intro.textContent = this.heroEnhancements.typingPhrases[currentIndex];
        intro.style.opacity = '1';
      }, 300);
    }, 3000);
  },
  
  initGlassCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    
    const glass = document.getElementById('glass');
    if (!glass) return;
    
    // Initially hide
    glass.style.opacity = '0';
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    
    // Smooth animation
    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      
      glass.style.left = currentX + 'px';
      glass.style.top = currentY + 'px';
      
      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        rafId = requestAnimationFrame(animateCursor);
      }
    };
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      // Show cursor
      glass.style.opacity = '0.8';
      
      // Update target position
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Start animation if not running
      if (!rafId) {
        rafId = requestAnimationFrame(animateCursor);
      }
    });
    
    // Hide when mouse leaves
    document.addEventListener('mouseleave', () => {
      glass.style.opacity = '0';
    });
    
    // Change appearance on hover
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches('.uni-card, .pill, button, .nav-link')) {
        glass.style.transform = 'translate(-50%, -50%) scale(1.3)';
        glass.style.background = `radial-gradient(circle at center, 
          rgba(218, 14, 41, 0.3) 0%, 
          rgba(218, 14, 41, 0.15) 40%,
          transparent 70%)`;
      } else {
        glass.style.transform = 'translate(-50%, -50%) scale(1)';
        glass.style.background = `radial-gradient(circle at center, 
          rgba(218, 14, 41, 0.2) 0%, 
          rgba(218, 14, 41, 0.1) 40%,
          transparent 70%)`;
      }
    });
  },
  
  setupHero() {
    // Update greeting based on time and visits
    const hour = new Date().getHours();
    const timeGreeting = hour < 6 ? 'Night owl mode activated.' : 
                         hour < 12 ? 'Good morning.' : 
                         hour < 18 ? 'Good afternoon.' : 'Good evening.';
    
    const heroSub = document.querySelector('#heroSub');
    if (heroSub && window.State && State.visits > 1) {
      heroSub.textContent = `${timeGreeting} Welcome back (visit #${State.visits}).`;
    }
    
    // Rotating placeholders
    const inputPrompts = [
      "Try: What makes Pixel Radar unique?",
      "Ask: How do you approach design systems?",
      "Type: Show me your process",
      "Ask: What are you building next?",
      "Try: Tell me about living interfaces",
      "Ask: How can you help my team?"
    ];
    
    let promptIndex = 0;
    const heroInput = document.querySelector('#heroInput');
    
    if (heroInput) {
      setInterval(() => {
        if (!heroInput.value) {
          promptIndex = (promptIndex + 1) % inputPrompts.length;
          heroInput.placeholder = inputPrompts[promptIndex];
        }
      }, 4000);
    }
  },
  
  async loadWork() {
    const html = `
      <section id="work" aria-label="Work">
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">Selected Work</h2>
            <div class="section-meta">
              <span id="projectCount">Swipe to explore projects</span>
            </div>
          </div>

          <!-- Unified Card Grid/Container -->
          <div class="uni-card-grid" id="workCards">
            
            <!-- Air India Project -->
            <article class="uni-card" data-project="air-india">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Design at Air India</h3>
                <span class="uni-card-badge">Design Systems</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-description">
                  Leading design transformation for India's flag carrier. Building scalable design systems and reimagining digital experiences across web, mobile, and in-flight entertainment.
                </p>
                
                <div class="uni-metric">
                  <span class="uni-metric-value">450+</span>
                  <span class="uni-metric-label">Daily Active Users</span>
                </div>
              </div>
              
              <footer class="uni-card-footer">
                <div class="uni-tags">
                  <span class="uni-tag">React</span>
                  <span class="uni-tag">Systems</span>
                  <span class="uni-tag">Aviation UX</span>
                </div>
              </footer>
            </article>
            
            <!-- Latent Space Project -->
            <article class="uni-card" data-project="latent-space">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Latent Space</h3>
                <span class="uni-card-badge">Multimodal AI</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-description">
                  Personal dream-to-meaning engine using wearable EEG + multimodal AI. Bridges sleep physiology and narrative meaning through real-time brain signal processing.
                </p>
                
                <div class="uni-metric">
                  <span class="uni-metric-value">∞</span>
                  <span class="uni-metric-label">Unique Dream Maps</span>
                </div>
              </div>
              
              <footer class="uni-card-footer">
                <div class="uni-tags">
                  <span class="uni-tag">EEG Processing</span>
                  <span class="uni-tag">ML/AI</span>
                  <span class="uni-tag">Privacy-First</span>
                </div>
              </footer>
            </article>
            
            <!-- Fractal Project -->
            <article class="uni-card" data-project="fractal">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Metamorphic Fractal Reflections</h3>
                <span class="uni-card-badge">New Media</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-description">
                  Experimental interface exploring consciousness through recursive patterns. Real-time generative visuals that respond to user behavior and create unique, evolving experiences.
                </p>
                
                <div class="uni-metric">
                  <span class="uni-metric-value">∞</span>
                  <span class="uni-metric-label">Unique Variations</span>
                </div>
              </div>
              
              <footer class="uni-card-footer">
                <div class="uni-tags">
                  <span class="uni-tag">WebGL</span>
                  <span class="uni-tag">GLSL</span>
                  <span class="uni-tag">Generative</span>
                </div>
              </footer>
            </article>
          </div>
          
          <!-- Mobile scroll indicators -->
          <div class="uni-scroll-indicators" id="workIndicators"></div>
        </div>
      </section>
    `;
    
    const workSection = document.getElementById('work-section');
    if (workSection) {
      workSection.innerHTML = html;
    }
  },
  
  // Labs section removed - no longer needed
  
  async loadReading() {
    const html = `
      <section id="reading" aria-label="Life">
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">Life</h2>
            <div class="section-sub">Books & Games that shape my thinking</div>
          </div>

          <!-- Side-by-side Layout -->
          <div class="life-layout">
            <!-- Left Column: Knowledge Graph -->
            <div class="life-graph-column">
              <div class="knowledge-graph-container">
                <canvas id="knowledgeGraph"></canvas>
                <div class="thought-stream" id="thoughtStream">
                  <!-- Thoughts will appear here -->
                </div>
              </div>
            </div>

            <!-- Right Column: Books & Games -->
            <div class="life-content-column">
              <!-- Cards Container - No tabs needed -->
              <div class="life-cards-container" id="lifeCardsContainer">

              <!-- Book: Gödel, Escher, Bach -->
              <article class="uni-card life-card" data-type="book" data-id="geb">
                <header class="uni-card-header">
                  <h3 class="uni-card-title">Gödel, Escher, Bach</h3>
                  <span class="uni-card-badge">Book</span>
                </header>

                <div class="uni-card-body">
                  <p class="uni-card-meta">Douglas Hofstadter</p>
                  <p class="uni-card-description">
                    An eternal golden braid exploring consciousness, recursion, and the nature of intelligence.
                  </p>

                  <div class="uni-progress">
                    <div class="uni-progress-header">
                      <span class="uni-progress-label">Reading Progress</span>
                      <span class="uni-progress-value">35%</span>
                    </div>
                    <div class="uni-progress-bar">
                      <div class="uni-progress-fill" style="width: 35%"></div>
                    </div>
                  </div>
                </div>
              </article>

              <!-- Game: Baldur's Gate 3 -->
              <article class="uni-card life-card" data-type="game" data-id="bg3">
                <header class="uni-card-header">
                  <h3 class="uni-card-title">Baldur's Gate 3</h3>
                  <span class="uni-card-badge">Game</span>
                </header>

                <div class="uni-card-body">
                  <p class="uni-card-meta">RPG • Fantasy</p>
                  <p class="uni-card-description">
                    Masterclass in narrative design and player agency. Every choice ripples through the world.
                  </p>

                  <div class="uni-progress">
                    <div class="uni-progress-header">
                      <span class="uni-progress-label">Story Progress</span>
                      <span class="uni-progress-value">78%</span>
                    </div>
                    <div class="uni-progress-bar">
                      <div class="uni-progress-fill" style="width: 78%"></div>
                    </div>
                  </div>
                </div>
              </article>

              <!-- Book: Design of Everyday Things -->
              <article class="uni-card life-card" data-type="book" data-id="doet">
                <header class="uni-card-header">
                  <h3 class="uni-card-title">The Design of Everyday Things</h3>
                  <span class="uni-card-badge">Book</span>
                </header>

                <div class="uni-card-body">
                  <p class="uni-card-meta">Don Norman</p>
                  <p class="uni-card-description">
                    Foundational text on human-centered design and the psychology of everyday interactions.
                  </p>

                  <div class="uni-progress">
                    <div class="uni-progress-header">
                      <span class="uni-progress-label">Reading Progress</span>
                      <span class="uni-progress-value">100%</span>
                    </div>
                    <div class="uni-progress-bar">
                      <div class="uni-progress-fill" style="width: 100%"></div>
                    </div>
                  </div>
                </div>
              </article>

              </div> <!-- Close life-cards-container -->
            </div> <!-- Close life-content-column -->
          </div> <!-- Close life-layout -->

          <!-- Mobile scroll indicators -->
          <div class="uni-scroll-indicators" id="lifeIndicators"></div>
        </div>
      </section>
    `;
    
    const readingSection = document.getElementById('reading-section');
    if (readingSection) {
      readingSection.innerHTML = html;
    }
    
    // Initialize the Life section interactions
    if (window.initializeLife) {
      initializeLife();
    }

    // Initialize enhanced life interactions
    this.initLifeInteractions();
  },
  
  async loadAbout() {
    const html = `
      <section id="about" aria-label="About">
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">About</h2>
            <div class="section-sub">The human behind the consciousness</div>
          </div>

          <!-- Stats Grid -->
          <div class="uni-card-grid" style="margin-bottom: 32px;">
            <article class="uni-card">
              <div class="uni-card-body" style="text-align: center;">
                <div class="uni-metric">
                  <span class="uni-metric-value">4+</span>
                  <span class="uni-metric-label">Years Experience</span>
                </div>
              </div>
            </article>
            
            <article class="uni-card">
              <div class="uni-card-body" style="text-align: center;">
                <div class="uni-metric">
                  <span class="uni-metric-value">12</span>
                  <span class="uni-metric-label">Products Shipped</span>
                </div>
              </div>
            </article>
            
            <article class="uni-card">
              <div class="uni-card-body" style="text-align: center;">
                <div class="uni-metric">
                  <span class="uni-metric-value">450+</span>
                  <span class="uni-metric-label">Daily Active Users</span>
                </div>
              </div>
            </article>
          </div>

          <!-- Info Cards -->
          <div class="uni-card-grid">
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Current Role</h3>
                <span class="uni-card-badge">Position</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-description">
                  I'm <strong>Nihar</strong>, building living interfaces at <strong>Air India DesignLAB</strong>. 
                  I specialize in design systems and data visualization that reduce decision latency.
                </p>
              </div>
            </article>
            
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Design Philosophy</h3>
                <span class="uni-card-badge">Approach</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-description">
                  Interfaces should breathe, remember, and evolve. Every system should reduce the time 
                  between thought and action.
                </p>
              </div>
            </article>
            
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Core Expertise</h3>
                <span class="uni-card-badge">Skills</span>
              </header>
              
              <div class="uni-card-body">
                <div class="uni-tags">
                  <span class="uni-tag">Design Systems</span>
                  <span class="uni-tag">Data Viz</span>
                  <span class="uni-tag">HCI</span>
                  <span class="uni-tag">Prototyping</span>
                  <span class="uni-tag">Creative Coding</span>
                </div>
              </div>
            </article>
          </div>

          <!-- Experience Timeline -->
          <h2 class="section-title" style="margin-top: 60px; margin-bottom: 32px;">Experience</h2>
          
          <div class="uni-card-grid">
            <!-- Current Position -->
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Product Designer</h3>
                <span class="uni-card-badge">Current</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-meta">Air India Limited • Aug 2024 - Present</p>
                <p class="uni-card-description">
                  Leading design transformation for India's flag carrier. Building scalable design systems and 
                  reimagining digital experiences.
                </p>
              </div>
              
              <footer class="uni-card-footer">
                <div class="uni-tags">
                  <span class="uni-tag">Design Systems</span>
                  <span class="uni-tag">Aviation UX</span>
                </div>
              </footer>
            </article>
            
            <!-- ISB -->
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">Digital Learning Designer</h3>
                <span class="uni-card-badge">Contract</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-meta">Indian School of Business • Sep - Dec 2023</p>
                <p class="uni-card-description">
                  Designed digital learning experiences and interactive educational interfaces for executive 
                  education programs.
                </p>
              </div>
              
              <footer class="uni-card-footer">
                <div class="uni-tags">
                  <span class="uni-tag">EdTech</span>
                  <span class="uni-tag">Learning Design</span>
                </div>
              </footer>
            </article>
            
            <!-- WONGDOODY -->
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">UX Researcher</h3>
                <span class="uni-card-badge">Internship</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-meta">WONGDOODY • Mar - Oct 2021</p>
                <p class="uni-card-description">
                  Conducted user research and created wireframes for digital products. Focused on HCI principles 
                  and usability testing.
                </p>
              </div>
              
              <footer class="uni-card-footer">
                <div class="uni-tags">
                  <span class="uni-tag">UX Research</span>
                  <span class="uni-tag">User Testing</span>
                </div>
              </footer>
            </article>
          </div>

          <!-- Education -->
          <h2 class="section-title" style="margin-top: 60px; margin-bottom: 32px;">Education</h2>
          
          <div class="uni-card-grid">
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">National Institute of Design</h3>
                <span class="uni-card-badge">Masters</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-meta">Master's in New Media Design • 2021-2023</p>
                <div class="uni-tags">
                  <span class="uni-tag">Prototyping</span>
                  <span class="uni-tag">Systems Thinking</span>
                  <span class="uni-tag">Creative Coding</span>
                </div>
              </div>
            </article>
            
            <article class="uni-card">
              <header class="uni-card-header">
                <h3 class="uni-card-title">JNTU</h3>
                <span class="uni-card-badge">Bachelors</span>
              </header>
              
              <div class="uni-card-body">
                <p class="uni-card-meta">BFA in Design & Applied Arts • 2016-2020</p>
                <div class="uni-tags">
                  <span class="uni-tag">Visual Design</span>
                  <span class="uni-tag">Typography</span>
                  <span class="uni-tag">Adobe Suite</span>
                </div>
              </div>
            </article>
          </div>
          
          <!-- Mobile scroll indicators -->
          <div class="uni-scroll-indicators" id="aboutIndicators"></div>
        </div>
      </section>
    `;
    
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.innerHTML = html;
    }
  },
  
  initLifeInteractions() {
    // Enhanced life section with graph-card interaction
    const lifeData = {
      'geb': { type: 'book', node: 'consciousness', theme: '#10b981' },
      'bg3': { type: 'game', node: 'narrative', theme: '#3b82f6' },
      'doet': { type: 'book', node: 'design', theme: '#f59e0b' }
    };

    // Initialize graph nodes (if graph exists)
    const setupGraphNodes = () => {
      const canvas = document.getElementById('knowledgeGraph');
      if (!canvas) return;

      // Performance optimized click handler
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simplified node detection for performance
        this.handleGraphNodeClick(x, y, lifeData);
      }, { passive: true });
    };


    // Initialize after DOM load
    setTimeout(setupGraphNodes, 100);
  },

  handleGraphNodeClick(x, y, lifeData) {
    // Performance-optimized node click handler
    const cards = document.querySelectorAll('.life-card');

    // Remove existing highlights efficiently
    cards.forEach(card => card.classList.remove('highlighted'));

    // Simple click zones for performance (instead of complex calculations)
    let targetCard = null;
    if (x < 200 && y < 200) targetCard = 'geb';
    else if (x > 200 && y < 200) targetCard = 'bg3';
    else if (y > 200) targetCard = 'doet';

    if (targetCard) {
      const card = document.querySelector(`[data-id="${targetCard}"]`);
      if (card) {
        // Performance-optimized highlight with RAF
        requestAnimationFrame(() => {
          card.classList.add('highlighted');

          // Create particle burst effect
          if (window.Particles && typeof Particles.createBurst === 'function') {
            const rect = card.getBoundingClientRect();
            Particles.createBurst(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              lifeData[targetCard]?.theme || '#10b981'
            );
          }
        });

        // Auto-remove highlight after 3 seconds
        setTimeout(() => {
          if (card) card.classList.remove('highlighted');
        }, 3000);
      }
    }
  },

  setupInteractions() {
    // Add hover effects to all unified cards
    const cards = document.querySelectorAll('.uni-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Track interaction
        if (window.State) {
          State.interactionPatterns.explorer++;
        }
      });

      card.addEventListener('click', () => {
        // Track deep dive
        if (window.State) {
          State.interactionPatterns.deep_diver++;
        }

        // Get project data and navigate
        const project = card.dataset.project;

        if (project === 'latent-space') {
          // Animate card before navigation
          card.style.transform = 'scale(0.98)';
          setTimeout(() => {
            window.open('https://latent-space.vercel.app/', '_blank');
            card.style.transform = '';
          }, 150);
        } else if (project === 'air-india') {
          // Animate card before navigation
          card.style.transform = 'scale(0.98)';
          setTimeout(() => {
            window.open('https://air-india-design.vercel.app/', '_blank');
            card.style.transform = '';
          }, 150);
        } else if (project === 'pixel-radar') {
          // Animate card before navigation
          card.style.transform = 'scale(0.98)';
          setTimeout(() => {
            window.open('https://pixel-radar.vercel.app/', '_blank');
            card.style.transform = '';
          }, 150);
        } else {
          // For other projects, add some visual feedback
          card.style.transform = 'scale(0.98)';
          setTimeout(() => {
            card.style.transform = '';
            console.log(`Project ${project} clicked - no navigation configured yet`);
          }, 150);
        }
      });
    });
  }
};

// Export
window.Sections = Sections;
