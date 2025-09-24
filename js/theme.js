// js/theme.js - Enhanced Theme Management System
const Theme = {
  current: 'dark',

  init() {
    console.log('🎨 Initializing Enhanced Theme System...');

    // Check saved preference or default to system preference
    const saved = localStorage.getItem('living-portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Only use saved preference if it exists, otherwise follow OS
    if (saved) {
      this.current = saved;
    } else {
      this.current = systemPrefersDark ? 'dark' : 'light';
      // Don't save to localStorage yet - only after manual toggle
    }

    this.apply(this.current);
    this.createToggle();
    this.initMobileSnapScroll();

    // Listen for system theme changes (only if user hasn't set manual preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('living-portfolio-theme')) {
        this.current = e.matches ? 'dark' : 'light';
        this.apply(this.current);
        this.updateParticleTheme();
      }
    });

    // Listen for reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.handleReducedMotion(e.matches);
    });

    // Initial reduced motion check
    this.handleReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    console.log('✅ Enhanced Theme System initialized:', this.current);
  },
  
  createToggle() {
    const currentThemeLabel = this.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

    const toggleHTML = `
      <button class="theme-toggle" id="themeToggle"
              aria-label="${currentThemeLabel}"
              role="switch"
              aria-checked="${this.current === 'light'}">
        <span class="theme-icon" aria-hidden="true">
          <svg class="theme-icon-light" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.9"/>
          </svg>
          <svg class="theme-icon-dark" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.9"/>
            <path d="m12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
          </svg>
        </span>
        <span class="sr-only">${currentThemeLabel}</span>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', toggleHTML);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      // Enhanced keyboard support
      toggle.addEventListener('click', this.handleToggleClick.bind(this));
      toggle.addEventListener('keydown', this.handleToggleKeydown.bind(this));
    }
  },

  handleToggleClick(e) {
    e.preventDefault();
    this.toggle();
  },

  handleToggleKeydown(e) {
    // Support Enter and Space for activation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
  },
  
  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    this.apply(this.current);

    // Save to localStorage (user has made manual choice)
    localStorage.setItem('living-portfolio-theme', this.current);

    // Update toggle button attributes
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      const newLabel = this.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      toggle.setAttribute('aria-label', newLabel);
      toggle.setAttribute('aria-checked', this.current === 'light');

      const srOnly = toggle.querySelector('.sr-only');
      if (srOnly) {
        srOnly.textContent = newLabel;
      }
    }

    // Update particle system
    this.updateParticleTheme();

    // Update state
    if (window.State) {
      State.theme = this.current;
    }

    // Haptic feedback on mobile
    if (window.navigator && navigator.vibrate) {
      navigator.vibrate(10);
    }

    console.log('Theme toggled to:', this.current);
  },
  
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme === 'dark' ? '#0a0a0a' : '#ffffff';

    // Update color-scheme for OS integration
    document.documentElement.style.colorScheme = theme;

    console.log('Theme applied:', theme);
  },

  updateParticleTheme() {
    // Update particles if system is loaded
    if (window.Particles && window.Particles.initialized) {
      window.Particles.theme = this.current;
      // Force particle color recalculation
      if (window.Particles.updateTheme) {
        window.Particles.updateTheme();
      }
    }
  },

  handleReducedMotion(isReduced) {
    if (isReduced) {
      console.log('Reduced motion detected - adjusting animations');

      // Add reduced motion class
      document.documentElement.classList.add('reduce-motion');

      // Adjust particle system
      if (window.Particles) {
        window.Particles.reducedMotion = true;
        if (window.Particles.config) {
          window.Particles.config.starCount = Math.min(window.Particles.config.starCount, 50);
          window.Particles.config.connectionRadius = 60;
        }
      }
    } else {
      document.documentElement.classList.remove('reduce-motion');
      if (window.Particles) {
        window.Particles.reducedMotion = false;
      }
    }
  },
  
  initMobileSnapScroll() {
    // Function to setup snap scrolling for a container
    const setupSnapScroll = (container) => {
      if (!container) return;
      
      const cards = container.querySelectorAll('.uni-card');
      if (cards.length === 0) return;
      
      const section = container.closest('section');
      const sectionId = section ? section.id : 'default';
      
      // Create indicators if they don't exist
      let indicators = container.parentElement.querySelector('.uni-scroll-indicators');
      if (!indicators && cards.length > 1) {
        indicators = document.createElement('div');
        indicators.className = 'uni-scroll-indicators';
        
        // Create dots
        for (let i = 0; i < cards.length; i++) {
          const dot = document.createElement('span');
          dot.className = 'uni-scroll-dot';
          if (i === 0) dot.classList.add('active');
          indicators.appendChild(dot);
        }
        
        container.parentElement.appendChild(indicators);
      }
      
      if (!indicators) return;
      
      const dots = indicators.querySelectorAll('.uni-scroll-dot');
      
      // Update indicators on scroll
      let scrollTimeout;
      container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollLeft = container.scrollLeft;
          const containerWidth = container.offsetWidth;
          const scrollWidth = container.scrollWidth;
          
          // Calculate current card index
          const cardWidth = cards[0].offsetWidth + 16; // card width + gap
          const currentIndex = Math.round(scrollLeft / cardWidth);
          
          // Update dots
          dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
          });
          
          // Update section accent color based on current card
          if (section) {
            section.style.setProperty('--card-accent', `var(--accent-${sectionId})`);
          }
          
          // Track analytics
          if (window.State) {
            State.currentCard = currentIndex;
            State.interactionPatterns.explorer++;
          }
        }, 100);
      });
      
      // Click on dots to navigate
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth + 16;
          container.scrollTo({
            left: cardWidth * index,
            behavior: 'smooth'
          });
          
          // Haptic feedback
          if (window.navigator && navigator.vibrate) {
            navigator.vibrate(10);
          }
        });
      });
      
      // Enhanced touch gestures for better snap
      if (window.innerWidth <= 768) {
        let startX = 0;
        let scrollStart = 0;
        let isDragging = false;
        
        container.addEventListener('touchstart', (e) => {
          startX = e.touches[0].pageX;
          scrollStart = container.scrollLeft;
          isDragging = true;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          // Track movement for velocity
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
          if (!isDragging) return;
          isDragging = false;
          
          const endX = e.changedTouches[0].pageX;
          const diff = startX - endX;
          const velocity = Math.abs(diff) / 100;
          const cardWidth = cards[0].offsetWidth + 16;
          
          // If swipe is more than 30px or high velocity, snap to next/prev card
          if (Math.abs(diff) > 30 || velocity > 0.5) {
            const currentIndex = Math.round(scrollStart / cardWidth);
            const targetIndex = diff > 0 ? 
              Math.min(currentIndex + 1, cards.length - 1) : 
              Math.max(currentIndex - 1, 0);
            
            container.scrollTo({
              left: cardWidth * targetIndex,
              behavior: 'smooth'
            });
            
            // Haptic feedback for snap
            if (window.navigator && navigator.vibrate) {
              navigator.vibrate(20);
            }
          }
        });
        
        // Prevent default touch behavior
        container.addEventListener('touchstart', (e) => {
          container.style.scrollSnapType = 'none';
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
          setTimeout(() => {
            container.style.scrollSnapType = 'x mandatory';
          }, 300);
        });
      }
    };
    
    // Initialize on page load
    const initializeContainers = () => {
      // Find all card containers
      const containers = document.querySelectorAll('.uni-card-container, .uni-card-grid');
      containers.forEach(container => {
        setupSnapScroll(container);
      });
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeContainers);
    } else {
      // Small delay to ensure sections are loaded
      setTimeout(initializeContainers, 500);
    }
    
    // Re-initialize when new sections are loaded
    this.setupSnapScroll = setupSnapScroll;
  },
  
  // Helper function to update card styles
  updateCardStyles() {
    const cards = document.querySelectorAll('.uni-card');
    cards.forEach(card => {
      // Add subtle animation on theme change
      card.style.transition = 'all 0.5s ease';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  }
};

// Export for global access
window.Theme = Theme;
