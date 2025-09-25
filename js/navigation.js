// Enhanced Navigation Module - Floating Glassmorphic
const Navigation = {
  nav: null,
  links: [],
  sections: [],
  logo: null,

  // Enhanced properties for micro-interactions
  isInitialized: false,
  currentPage: null,
  magneticElements: [],
  glowEffect: null,

  init() {
    // Update selectors for new navigation
    this.nav = $('#floating-nav');
    this.logo = $('#nav-logo');
    this.links = $$('.nav-link');
    this.glowEffect = $('.nav-glow');
    this.sections = ['work'];

    // Detect current page for active state
    this.detectCurrentPage();

    // Setup all interactions
    this.setupScrollSpy();
    this.setupNavLinks();
    this.setupLogo();
    this.setupMagnetic();
    this.setupMicroInteractions();
    this.trackMouse();
    this.trackScroll();

    // Initialize entrance animation
    this.initEntranceAnimation();

    this.isInitialized = true;
    console.log('✨ Enhanced Navigation initialized');
  },
  
  setupScrollSpy() {
    // Scroll detection for nav appearance
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    }, { passive: true });
    
    // Section observer
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          this.updateActiveSection(section);
        }
      });
    }, observerOptions);
    
    // Observe sections
    this.sections.forEach(id => {
      const section = $('#' + id);
      if (section) observer.observe(section);
    });
  },
  
  setupNavLinks() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        let target = $('#' + section);

        // Fallback: if section not found, try to find it after a short delay
        if (!target) {
          console.log(`Section #${section} not found, retrying...`);
          setTimeout(() => {
            target = $('#' + section);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              this.updateActiveSection(section);
            } else {
              console.error(`Section #${section} still not found!`);
            }
          }, 100);
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.updateActiveSection(section);
        }

        if (window.State) {
          State.interactionPatterns.explorer++;
        }
      });
    });
  },
  
  updateActiveSection(section) {
    // Update mood color
    const color = Config.colors[section] || Config.colors.home;
    document.documentElement.style.setProperty('--mood', color);
    State.mood = color;
    State.currentSection = section;
    
    // Update active link
    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === section) {
        link.classList.add('active');
      }
    });
  },
  
  setupLogo() {
    let holdTimer = null;
    
    // Easter egg - hold logo for 3 seconds
    this.logo.addEventListener('pointerdown', () => {
      holdTimer = setTimeout(() => {
        Particles.setFormation('N');
        if (State.sound) Sound.play('transition');
      }, 3000);
    });
    
    this.logo.addEventListener('pointerup', () => clearTimeout(holdTimer));
    this.logo.addEventListener('pointerleave', () => clearTimeout(holdTimer));
  },
  
  setupMagnetic() {
    const magnets = $$('[data-magnetic]');
    
    this.magneticUpdate = () => {
      if (Config.device.isTouch) return;
      
      magnets.forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = State.mouse.x - cx;
        const dy = State.mouse.y - cy;
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(rect.width, rect.height) * 1.6;
        const force = Utils.clamp(1 - dist / radius, 0, 1);
        
        el.style.transform = `translate(${dx * 0.08 * force}px, ${dy * 0.08 * force}px)`;
      });
    };
  },
  
  trackMouse() {
    let lastMouse = { x: State.mouse.x, y: State.mouse.y, t: performance.now() };
    let mouseThrottle;
    
    window.addEventListener('mousemove', (e) => {
      State.hasInteracted = true;
      State.mouse.x = e.clientX;
      State.mouse.y = e.clientY;
      State.idle.lastMove = performance.now();
      
      // Throttled velocity calculation
      clearTimeout(mouseThrottle);
      mouseThrottle = setTimeout(() => {
        const now = performance.now();
        const dt = Math.max(16, now - lastMouse.t);
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        
        State.mouse.vx = (dx / dt) * 16;
        State.mouse.vy = (dy / dt) * 16;
        State.mouse.v = Math.hypot(State.mouse.vx, State.mouse.vy);
        State.mouse.t = now;
        
        lastMouse = { x: e.clientX, y: e.clientY, t: now };
        
        // Update heatmap
        const hx = Math.floor(e.clientX / window.innerWidth * Config.storage.heatmapWidth);
        const hy = Math.floor(e.clientY / window.innerHeight * Config.storage.heatmapHeight);
        
        if (State.heatmap[hy] && typeof State.heatmap[hy][hx] === 'number') {
          State.heatmap[hy][hx] = Utils.clamp(State.heatmap[hy][hx] + 0.05, 0, 1.0);
        }
      }, 16);
    }, { passive: true });
  },
  
  update() {
    // Check idle state
    if (performance.now() - State.idle.lastMove > State.idle.threshold) {
      if (State.formation !== 'N') {
        Particles.setFormation('N');
      }
    }
    
    // Update magnetic elements
    if (this.magneticUpdate) {
      this.magneticUpdate();
    }
    
    
   
  },

  // NEW: Detect current page for proper active state
  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();

    if (filename === '' || filename === 'index.html') {
      this.currentPage = 'home';
    } else if (filename === 'work.html') {
      this.currentPage = 'work';
    } else if (filename === 'about.html') {
      this.currentPage = 'about';
    } else if (filename === 'contact.html') {
      this.currentPage = 'contact';
    }

    // Update active state
    this.updateActiveNavLink();
  },

  // NEW: Update active navigation link based on current page
  updateActiveNavLink() {
    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === this.currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },

  // NEW: Enhanced entrance animation
  initEntranceAnimation() {
    if (!this.nav) return;

    // Add entrance class after a brief delay for smoother animation
    setTimeout(() => {
      this.nav.classList.add('nav-entered');
    }, 100);

    // Add interaction-complete class after animations finish
    setTimeout(() => {
      document.body.classList.add('nav-interaction-complete');
    }, 1200);
  },

  // NEW: Enhanced micro-interactions
  setupMicroInteractions() {
    if (!this.nav) return;

    // Subtle scale on nav hover
    this.nav.addEventListener('mouseenter', () => {
      if (!Config.device.isTouch) {
        this.nav.style.transform = 'translateX(-50%) translateY(0) scale(1.02)';
      }
    });

    this.nav.addEventListener('mouseleave', () => {
      if (!Config.device.isTouch) {
        this.nav.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      }
    });

    // Enhanced link interactions
    this.links.forEach((link, index) => {
      // Staggered hover effect
      link.addEventListener('mouseenter', () => {
        if (!Config.device.isTouch) {
          this.activateGlowEffect(link);
          this.createRippleEffect(link);
        }
      });

      link.addEventListener('mouseleave', () => {
        this.deactivateGlowEffect();
      });

      // Click feedback with haptic-style animation
      link.addEventListener('click', (e) => {
        this.createClickFeedback(link);
        this.trackInteraction('nav_click', link.dataset.page);
      });

      // Touch interactions for mobile
      if (Config.device.isTouch) {
        link.addEventListener('touchstart', () => {
          link.classList.add('touch-active');
        });

        link.addEventListener('touchend', () => {
          setTimeout(() => {
            link.classList.remove('touch-active');
          }, 150);
        });
      }
    });

    // Logo interaction enhancements
    this.setupEnhancedLogoInteraction();
  },

  // NEW: Enhanced logo interactions
  setupEnhancedLogoInteraction() {
    if (!this.logo) return;

    let holdTimer = null;
    let isHolding = false;

    // Enhanced click/hold interaction
    this.logo.addEventListener('pointerdown', (e) => {
      isHolding = true;
      this.logo.classList.add('logo-pressing');

      holdTimer = setTimeout(() => {
        if (isHolding) {
          this.triggerEasterEgg();
        }
      }, 3000);
    });

    this.logo.addEventListener('pointerup', () => {
      isHolding = false;
      this.logo.classList.remove('logo-pressing');
      clearTimeout(holdTimer);
    });

    this.logo.addEventListener('pointerleave', () => {
      isHolding = false;
      this.logo.classList.remove('logo-pressing');
      clearTimeout(holdTimer);
    });

    // Subtle animation on hover
    this.logo.addEventListener('mouseenter', () => {
      if (!Config.device.isTouch) {
        this.logo.style.transform = 'scale(1.08)';
      }
    });

    this.logo.addEventListener('mouseleave', () => {
      if (!Config.device.isTouch) {
        this.logo.style.transform = 'scale(1)';
      }
    });
  },

  // NEW: Glow effect activation
  activateGlowEffect(targetLink) {
    if (!this.glowEffect) return;

    const rect = targetLink.getBoundingClientRect();
    const navRect = this.nav.getBoundingClientRect();

    // Position glow effect
    const leftOffset = rect.left - navRect.left;
    const width = rect.width;

    this.glowEffect.style.left = `${leftOffset}px`;
    this.glowEffect.style.width = `${width}px`;
    this.glowEffect.style.opacity = '1';
  },

  deactivateGlowEffect() {
    if (this.glowEffect) {
      this.glowEffect.style.opacity = '0';
    }
  },

  // NEW: Ripple effect for interactions
  createRippleEffect(element) {
    if (Config.device.isTouch) return; // Skip on touch devices

    const ripple = document.createElement('div');
    ripple.className = 'nav-ripple';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'navRipple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size / 2 + 'px';
    ripple.style.marginTop = -size / 2 + 'px';

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  },

  // NEW: Click feedback animation
  createClickFeedback(element) {
    element.style.transform = 'translateY(-1px) scale(0.95)';
    setTimeout(() => {
      element.style.transform = '';
    }, 150);

    // Create subtle particle burst if particles system is available
    if (window.Particles && typeof Particles.createBurst === 'function') {
      const rect = element.getBoundingClientRect();
      Particles.createBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        'rgba(255, 255, 255, 0.4)',
        { count: 3, speed: 1, size: 0.5 }
      );
    }
  },

  // NEW: Easter egg trigger
  triggerEasterEgg() {
    if (window.Particles && Particles.setFormation) {
      Particles.setFormation('N');
      console.log('🎉 Navigation Easter Egg Activated!');
    }

    // Visual feedback
    this.logo.style.transform = 'scale(1.2)';
    this.logo.style.color = 'rgba(218, 14, 41, 0.9)';

    setTimeout(() => {
      this.logo.style.transform = '';
      this.logo.style.color = '';
    }, 1000);

    this.trackInteraction('easter_egg', 'logo_hold');
  },

  // NEW: Interaction tracking
  trackInteraction(type, target) {
    if (window.State && State.interactionPatterns) {
      State.interactionPatterns.explorer++;
    }

    // Log for analytics
    console.log(`🎯 Navigation interaction: ${type} - ${target}`);
  },

  trackScroll() {
    let scrollTimeout;
    
    window.addEventListener('scroll', (e) => {
      const now = Date.now();
      const currentPosition = window.scrollY;
      const timeDiff = now - State.scroll.lastTime;
      const posDiff = currentPosition - State.scroll.lastPosition;
      
      // Calculate velocity (pixels per second)
      if (timeDiff > 0) {
        const velocity = Math.abs(posDiff / timeDiff * 1000);
        State.scroll.velocity = velocity;
        State.scroll.isScrolling = true;
      }
      
      // Update last values
      State.scroll.lastPosition = currentPosition;
      State.scroll.lastTime = now;
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set scrolling to false after scroll stops
      scrollTimeout = setTimeout(() => {
        State.scroll.isScrolling = false;
        State.scroll.velocity = 0;
      }, 150);
      
    }, { passive: true });
  }
   
};
