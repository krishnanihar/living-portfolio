// deck.js - Enhanced Deck Module integrated with existing site
const Deck = {
  currentSlide: 0,
  totalSlides: 5,
  isPlaying: true,
  slideTimer: null,
  progressTimer: null,
  initialized: false,
  
  slides: [
    {
      id: 'intro',
      label: 'INTRODUCTION',
      title: "Hi, I'm Nihar",
      subtitle: 'Product & New Media Designer',
      content: `I craft living interfaces that reduce decision latency. Currently transforming Air India's digital experience while building consciousness into systems.`,
      metrics: [
        { value: 4, displayValue: '4+', label: 'Years Experience', color: '#da0e29', type: 'number' },
        { value: 12, displayValue: '12', label: 'Products Shipped', color: '#3b82f6', type: 'number' },
        { value: 450, displayValue: '450+', label: 'Daily Active Users', color: '#f59e0b', type: 'number' }
      ],
      tags: ['Air India DesignLAB', 'National Institute of Design', 'Microsoft'],
      mood: '#da0e29',
      formation: 'ring',
      particleBehavior: 'converge',
      links: [
        { label: 'View Work', url: '#work', action: 'section' },
        { label: 'About Me', url: '#about', action: 'section' }
      ]
    },
    {
      id: 'air-india',
      label: 'CURRENT WORK',
      title: 'Design at Air India',
      subtitle: 'Design Systems & Digital Transformation',
      content: `Leading design transformation for India's flag carrier. Building scalable design systems and reimagining digital experiences across web, mobile, and in-flight entertainment.`,
      metrics: [
        { value: 450, displayValue: '450+', label: 'Daily Users', color: '#3b82f6', type: 'number' },
        { value: 30, displayValue: '30%', label: 'Efficiency Gain', color: '#f59e0b', type: 'percent' },
        { value: 5, displayValue: '5', label: 'Platforms', color: '#8b5cf6', type: 'number' }
      ],
      tags: ['React', 'Design Systems', 'Aviation UX'],
      mood: '#3b82f6',
      formation: 'grid',
      particleBehavior: 'scan',
      links: [
        { label: 'View Projects', url: '#work', action: 'section' },
        { label: 'Case Studies', url: '#work', action: 'section' }
      ]
    },
    {
      id: 'latent-space',
      label: 'PERSONAL PROJECT',
      title: 'Latent Space',
      subtitle: 'Dream-to-Meaning Engine',
      content: `Personal dream analysis using wearable EEG + multimodal AI. Bridges sleep physiology and narrative meaning through real-time brain signal processing.`,
      metrics: [
        { value: '∞', displayValue: '∞', label: 'Unique Dream Maps', color: '#10b981', type: 'infinite' },
        { value: 1, displayValue: '1st', label: 'Of Its Kind', color: '#8b5cf6', type: 'ordinal' },
        { value: 24, displayValue: '24/7', label: 'Monitoring', color: '#da0e29', type: 'time' }
      ],
      tags: ['EEG Processing', 'ML/AI', 'Privacy-First'],
      mood: '#10b981',
      formation: 'organic',
      particleBehavior: 'dream',
      links: [
        { label: 'View Project', url: '#work', action: 'section' },
        { label: 'Technical Details', url: '#work', action: 'section' }
      ]
    },
    {
      id: 'philosophy',
      label: 'DESIGN PHILOSOPHY',
      title: 'Living Interfaces',
      subtitle: 'Consciousness in Design',
      content: `Interfaces should breathe, remember, and evolve. Every system should reduce the time between thought and action. I believe in building consciousness into design systems.`,
      metrics: [
        { value: 'Adaptive', displayValue: 'Adaptive', label: 'Systems', color: '#f59e0b', type: 'concept' },
        { value: 'Conscious', displayValue: 'Conscious', label: 'Interfaces', color: '#8b5cf6', type: 'concept' },
        { value: 'Human', displayValue: 'Human', label: 'Centered', color: '#10b981', type: 'concept' }
      ],
      tags: ['Systems Thinking', 'HCI', 'Future of Design'],
      mood: '#8b5cf6',
      formation: 'constellation',
      particleBehavior: 'evolve',
      links: [
        { label: 'About Me', url: '#about', action: 'section' },
        { label: 'My Process', url: '#about', action: 'section' }
      ]
    },
    {
      id: 'contact',
      label: 'GET IN TOUCH',
      title: 'Let\'s Build Together',
      subtitle: 'Ready to create living interfaces?',
      content: `I'm always excited to collaborate on projects that push the boundaries of design and consciousness. Let's reduce decision latency together.`,
      metrics: [
        { value: 'Available', displayValue: 'Available', label: 'For Projects', color: '#10b981', type: 'status' },
        { value: '24h', displayValue: '24h', label: 'Response Time', color: '#3b82f6', type: 'time' },
        { value: 'Global', displayValue: 'Global', label: 'Collaboration', color: '#da0e29', type: 'scope' }
      ],
      tags: ['nihar@example.com', 'Available for hire', 'Remote friendly'],
      mood: '#da0e29',
      formation: 'ring',
      particleBehavior: 'converge',
      links: [
        { label: 'Contact Me', url: '#about', action: 'section' },
        { label: 'View Work', url: '#work', action: 'section' }
      ]
    }
  ],
  
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Create deck HTML
    this.createDeck();
    
    // Set up listeners after DOM is ready
    requestAnimationFrame(() => {
      this.setupEventListeners();
    });
  },
  
  createDeck() {
    // Quick Tour now happens inside the hero card, not in a separate container
    const heroCard = document.querySelector('.hero-inner') || document.getElementById('heroCard');
    if (!heroCard) {
      console.error('Hero card not found for Quick Tour');
      return;
    }

    // Store original hero content
    if (!this.originalHeroContent) {
      this.originalHeroContent = heroCard.innerHTML;
    }

    // Create the deck HTML to replace hero content
    const deckHTML = `
      <div class="deck-content-container" id="deckContent">
        <!-- Close Button -->
        <button class="deck-close-hero" id="deckClose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Slide Content (replaces hero content) -->
        <div class="deck-slide-content">
          ${this.slides.map((slide, i) => this.createSlideHTML(slide, i)).join('')}
        </div>

        <!-- Navigation Controls -->
        <div class="deck-navigation">
          <!-- Previous Button -->
          <button class="deck-nav-btn deck-nav-prev" id="deckPrev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Dots Navigation -->
          <div class="deck-nav-dots">
            ${this.slides.map((slide, i) => `
              <button class="deck-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>
            `).join('')}
          </div>

          <!-- Next Button -->
          <button class="deck-nav-btn deck-nav-next" id="deckNext">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    return deckHTML;
  },
  
  createSlideHTML(slide, index) {
    const isActive = index === 0;

    return `
      <div class="deck-slide-hero ${isActive ? 'active' : ''}" data-slide="${index}">
        <div class="deck-slide-header">
          <span class="deck-slide-label">${slide.label}</span>
          <h1 class="deck-slide-title">${slide.title}</h1>
          <p class="deck-slide-subtitle">${slide.subtitle}</p>
        </div>

        <div class="deck-slide-body">
          <p class="deck-slide-content">${slide.content}</p>
          ${slide.links ? `
            <div class="deck-slide-links">
              ${slide.links.map(link => `
                <a href="${link.url}" class="deck-slide-link" data-action="${link.action}">${link.label}</a>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="deck-metrics-grid">
          ${slide.metrics.map((metric, i) => `
            <div class="deck-metric-card" style="--i: ${i}; --metric-color: ${metric.color};">
              <span class="deck-metric-value"
                    data-value="${metric.value}"
                    data-display-value="${metric.displayValue}"
                    data-type="${metric.type}">${metric.type === 'text' || metric.type === 'concept' || metric.type === 'status' || metric.type === 'scope' || metric.type === 'infinite' || metric.type === 'ordinal' ? metric.displayValue : '0'}</span>
              <span class="deck-metric-label">${metric.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  setupEventListeners() {
    // Close button
    const closeBtn = $('#deckClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    // Navigation buttons
    const prevBtn = $('#deckPrev');
    const nextBtn = $('#deckNext');
    const playBtn = $('#deckPlayPause');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
    
    // Dot navigation
    $$('.deck-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        this.goToSlide(parseInt(dot.dataset.slide));
      });
    });

    // Link handling
    $$('.deck-slide-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.dataset.action;
        const url = link.getAttribute('href');

        if (action === 'section') {
          // Close deck and navigate to section
          this.close();
          setTimeout(() => {
            // Handle different section targets
            let targetElement = null;

            if (url === '#work') {
              targetElement = document.getElementById('work-section');
            } else if (url === '#about') {
              targetElement = document.getElementById('about-section');
            } else if (url === '#reading') {
              targetElement = document.getElementById('reading-section');
            } else {
              targetElement = document.querySelector(url);
            }

            if (targetElement) {
              // Ensure element is visible and has content
              console.log('Navigating to:', url, targetElement);
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });

              // Highlight the target section briefly
              targetElement.style.transition = 'background-color 0.5s ease';
              targetElement.style.backgroundColor = 'rgba(218, 14, 41, 0.02)';
              setTimeout(() => {
                targetElement.style.backgroundColor = '';
              }, 1000);
            } else {
              console.warn('Target element not found:', url);
            }
          }, 400);
        }
      });
    });
    
    // Keyboard controls
    this.keyboardHandler = (e) => {
      const heroCard = document.querySelector('.hero-inner');
      if (!heroCard || !heroCard.classList.contains('deck-active')) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.next();
          break;
        case ' ':
          e.preventDefault();
          this.togglePlay();
          break;
        case 'Escape':
          e.preventDefault();
          this.close();
          break;
      }
    };
    
    document.addEventListener('keydown', this.keyboardHandler);
    
    // Touch/swipe controls
    this.setupTouchControls();
  },
  
  setupTouchControls() {
    const stage = $('.deck-slide-content') || document.querySelector('.hero-inner');
    if (!stage) return;
    
    let touchStartX = 0;
    
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    stage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });
  },
  
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    // Performance: Use requestAnimationFrame for smooth transitions
    requestAnimationFrame(() => {
      // Update slides
      $$('.deck-slide-hero').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        slide.classList.toggle('prev', i < index);
        slide.classList.toggle('next', i > index);
      });

      // Update dots
      $$('.deck-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    });
    
    // Update counter
    const counter = $('#currentSlide');
    if (counter) counter.textContent = index + 1;
    
    // Update mood color
    const slide = this.slides[index];
    document.documentElement.style.setProperty('--deck-mood', slide.mood);

    // Update State if exists
    if (window.State) {
      State.mood = slide.mood;
      State.particleMode = slide.particleBehavior;
    }

    // Update Particles formation if available
    if (window.Particles && typeof Particles.setFormation === 'function') {
      Particles.setFormation(slide.formation);
    }

    // Trigger particle interaction with the hero card
    this.triggerParticleInteractionWithHero(index, slide);

    // Trigger Canvas effects if available
    if (window.Canvas && typeof Canvas.onSlideChange === 'function') {
      Canvas.onSlideChange(index, slide);
    }
    
    // Animate metrics
    if (index !== this.currentSlide) {
      setTimeout(() => this.animateMetrics(index), 100);
    }
    
    this.currentSlide = index;
    
    // Reset autoplay
    if (this.isPlaying) {
      this.startAutoPlay();
    }
    
    // Track interaction
    if (window.State) {
      State.interactionPatterns.deep_diver++;
    }
  },
  
  animateMetrics(slideIndex) {
    const slide = $(`.deck-slide-hero[data-slide="${slideIndex}"]`);
    if (!slide) return;

    const metrics = slide.querySelectorAll('.deck-metric-value[data-value]');

    metrics.forEach((metric) => {
      const type = metric.dataset.type;
      const displayValue = metric.dataset.displayValue;

      // Skip non-numeric types that shouldn't animate
      if (type === 'text' || type === 'concept' || type === 'status' || type === 'scope' || type === 'infinite' || type === 'ordinal') {
        metric.textContent = displayValue;
        return;
      }

      const endValue = parseInt(metric.dataset.value);
      if (!endValue || isNaN(endValue)) {
        metric.textContent = displayValue;
        return;
      }

      let current = 0;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        current = endValue * easeOutExpo;

        // Use the displayValue format for final result
        if (progress === 1) {
          metric.textContent = displayValue;
        } else {
          // Animate with proper formatting during animation
          if (type === 'percent') {
            metric.textContent = Math.floor(current) + '%';
          } else if (type === 'time') {
            if (displayValue.includes('/')) {
              metric.textContent = Math.floor(current) + '/7'; // For "24/7"
            } else {
              metric.textContent = Math.floor(current) + 'h'; // For "24h"
            }
          } else if (type === 'number') {
            // Handle display values like "4+", "450+", etc.
            const suffix = displayValue.replace(/\d+/, ''); // Extract non-numeric suffix
            metric.textContent = Math.floor(current) + suffix;
          } else {
            metric.textContent = Math.floor(current);
          }
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  },
  
  next() {
    this.goToSlide((this.currentSlide + 1) % this.slides.length);
  },
  
  prev() {
    this.goToSlide((this.currentSlide - 1 + this.slides.length) % this.slides.length);
  },
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.isPlaying = true;
    
    // Update button
    const icon = $('#playIcon');
    if (icon) icon.textContent = '❚❚';
    
    // Animate progress ring
    const ring = $('#progressRing');
    if (ring) {
      ring.style.transition = 'none';
      ring.style.strokeDashoffset = '226';
      
      setTimeout(() => {
        ring.style.transition = 'stroke-dashoffset 10s linear';
        ring.style.strokeDashoffset = '0';
      }, 100);
    }
    
    // Set timer for next slide
    this.slideTimer = setTimeout(() => {
      this.next();
    }, 10000);
  },
  
  stopAutoPlay() {
    this.isPlaying = false;
    clearTimeout(this.slideTimer);
    
    // Update button
    const icon = $('#playIcon');
    if (icon) icon.textContent = '▶';
    
    // Stop progress animation
    const ring = $('#progressRing');
    if (ring) {
      ring.style.transition = 'none';
    }
  },
  
  togglePlay() {
    if (this.isPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  },
  
  open() {
    const heroCard = document.querySelector('.hero-inner') || document.getElementById('heroCard');
    if (!heroCard) {
      console.error('Hero card not found');
      return;
    }

    // Store original content if not already stored
    if (!this.originalHeroContent) {
      this.originalHeroContent = heroCard.innerHTML;
    }

    // Replace hero content with deck content
    const deckHTML = this.createDeck();
    heroCard.innerHTML = deckHTML;

    // Add deck-active class to hero card
    heroCard.classList.add('deck-active');

    // Setup event listeners for the new content
    setTimeout(() => {
      this.setupEventListeners();
    }, 50);

    // Reset to first slide
    this.currentSlide = 0;
    this.goToSlide(0);

    // Track event
    if (window.State) {
      State.interactionPatterns.explorer++;
    }

    // Trigger particle interaction with hero card
    this.triggerParticleInteractionWithHero();
  },
  
  close() {
    const heroCard = document.querySelector('.hero-inner') || document.getElementById('heroCard');
    if (!heroCard) return;

    // Restore original hero content
    if (this.originalHeroContent) {
      heroCard.innerHTML = this.originalHeroContent;
    }

    // Remove deck-active class
    heroCard.classList.remove('deck-active');

    this.stopAutoPlay();

    // Reset particles to default
    if (window.Particles && typeof Particles.setFormation === 'function') {
      Particles.setFormation('dna');
    }

    // Reset mood
    if (window.State) {
      State.mood = Config.colors.home;
    }

    // Re-initialize 3D effect for hero card
    if (window.init3DEffect) {
      setTimeout(() => {
        window.init3DEffect();
      }, 100);
    }
  },

  triggerParticleInteractionWithHero(slideIndex, slide) {
    if (!window.Particles) return;

    // Get the hero card element
    const heroCard = document.querySelector('.hero-inner');
    if (!heroCard) return;

    const rect = heroCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create particle attraction to the hero card center
    if (typeof Particles.attractParticlesToText === 'function') {
      Particles.attractParticlesToText(centerX, centerY, Math.min(rect.width, rect.height) * 0.8);
    }

    // Create particle burst effect around the hero card
    if (typeof Particles.createElegantBurst === 'function') {
      // Create multiple bursts around the card perimeter
      const burstCount = 8;
      const radius = Math.min(rect.width, rect.height) * 0.45;

      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        setTimeout(() => {
          Particles.createElegantBurst(x, y);
        }, i * 80);
      }
    }

    // Update particle behavior based on slide mood
    if (window.State && slide) {
      if (slide.mood) {
        State.mood = slide.mood;
      }

      // Enhance particles based on slide content
      if (slide.particleBehavior) {
        State.particleMode = slide.particleBehavior;
      }
    }

    console.log('✨ Particle interaction triggered for hero card slide:', slideIndex);
  }
};

// Export for global access
window.Deck = Deck;
