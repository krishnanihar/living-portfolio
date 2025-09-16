// js/theme.js - Complete Theme Management System
const Theme = {
  current: 'dark',
  
  init() {
    console.log('🎨 Initializing Theme System...');
    
    // Check saved preference or system preference
    const saved = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.current = saved || (systemPrefersDark ? 'dark' : 'light');
    this.apply(this.current);
    
    // Add theme toggle button
    this.createToggle();
    
    // Initialize mobile snap scrolling
    this.initMobileSnapScroll();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.current = e.matches ? 'dark' : 'light';
        this.apply(this.current);
      }
    });
    
    console.log('✅ Theme System initialized:', this.current);
  },
  
  createToggle() {
    const toggleHTML = `
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <span class="theme-icon">
          <svg class="theme-icon-light" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="white" stroke-width="1.5" fill="white" opacity="0.9"/>
          </svg>
          <svg class="theme-icon-dark" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="white" stroke-width="1.5" fill="white" opacity="0.9"/>
            <path d="m12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="white" stroke-width="1.5" opacity="0.7"/>
          </svg>
        </span>
      </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toggleHTML);
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.toggle();
      });
    }
  },
  
  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    this.apply(this.current);
    localStorage.setItem('theme', this.current);
    
    // Optional: trigger particle color adjustment
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
