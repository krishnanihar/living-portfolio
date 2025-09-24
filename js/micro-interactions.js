// js/micro-interactions.js - Premium Micro-interactions System
class MicroInteractions {
  constructor() {
    this.isTouch = 'ontouchstart' in window;
    this.hasHover = window.matchMedia('(hover: hover)').matches;
    this.hasPointer = window.matchMedia('(pointer: fine)').matches;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Performance tracking
    this.rafIds = new Set();
    this.activeInteractions = 0;

    // Element tracking
    this.magneticElements = [];
    this.parallaxElements = [];
    this.revealElements = [];
    this.spotlightContainer = null;

    this.init();
  }

  init() {
    console.log('✨ Initializing Premium Micro-interactions...');
    console.log(`Device: Touch=${this.isTouch}, Hover=${this.hasHover}, Fine Pointer=${this.hasPointer}`);
    console.log(`Reduced Motion: ${this.reducedMotion}`);

    // Initialize systems based on device capabilities
    if (this.hasHover && this.hasPointer && !this.isTouch) {
      this.initMagneticHover();
      this.initCursorParallax();
      this.initSpotlight();
    }

    this.initScrollReveal();
    this.setupEventListeners();

    console.log('✅ Micro-interactions system initialized');
  }

  // ============================================
  // MAGNETIC HOVER SYSTEM
  // ============================================

  initMagneticHover() {
    if (this.reducedMotion) {
      console.log('Magnetic hover disabled (reduced motion)');
      return;
    }

    // Find magnetic elements
    const selectors = [
      '.error-action.primary',
      '.contact-method.primary-email',
      '.work-card',
      '.nav-link',
      '[data-magnetic]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.setupMagneticElement(element);
      });
    });

    console.log(`✅ Magnetic hover initialized for ${this.magneticElements.length} elements`);
  }

  setupMagneticElement(element) {
    if (this.magneticElements.includes(element)) return;

    // Add magnetic properties
    element.style.transition = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
    element.style.willChange = 'transform';

    let rafId = null;
    let isHovering = false;

    const handleMouseMove = (e) => {
      if (!isHovering || this.reducedMotion) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.15; // 15% of distance
        const deltaY = (e.clientY - centerY) * 0.15;

        // Clamp to max 10px movement
        const clampedX = Math.max(-10, Math.min(10, deltaX));
        const clampedY = Math.max(-10, Math.min(10, deltaY));

        element.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
        this.rafIds.add(rafId);
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
      this.activeInteractions++;
      element.addEventListener('mousemove', handleMouseMove, { passive: true });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      this.activeInteractions = Math.max(0, this.activeInteractions - 1);
      element.removeEventListener('mousemove', handleMouseMove);

      if (rafId) {
        cancelAnimationFrame(rafId);
        this.rafIds.delete(rafId);
      }

      // Return to original position
      element.style.transform = 'translate3d(0, 0, 0)';
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup on focus lost (for keyboard users)
    element.addEventListener('blur', handleMouseLeave);

    this.magneticElements.push(element);
  }

  // ============================================
  // CURSOR PARALLAX SYSTEM
  // ============================================

  initCursorParallax() {
    if (this.reducedMotion) {
      console.log('Cursor parallax disabled (reduced motion)');
      return;
    }

    // Find hero sections
    const heroSelectors = [
      '#hero-section',
      '.hero-section',
      '.hero-card',
      '.about-header',
      '.contact-container'
    ];

    heroSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.setupParallaxElement(element);
      });
    });

    console.log(`✅ Cursor parallax initialized for ${this.parallaxElements.length} elements`);
  }

  setupParallaxElement(element) {
    if (this.parallaxElements.includes(element)) return;

    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const updateParallax = () => {
      const lerp = 0.08; // VISUAL_TUNE_2025Q3: Increased damping
      currentX += (mouseX - currentX) * lerp;
      currentY += (mouseY - currentY) * lerp;

      // VISUAL_TUNE_2025Q3: Clamped to ≤1% of viewport
      const maxShift = Math.min(window.innerWidth, window.innerHeight) * 0.01;
      const translateX = Math.max(-maxShift, Math.min(maxShift, currentX * 0.005));
      const translateY = Math.max(-maxShift, Math.min(maxShift, currentY * 0.005));

      element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;

      // Continue animation if there's movement
      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        rafId = requestAnimationFrame(updateParallax);
        this.rafIds.add(rafId);
      } else {
        rafId = null;
      }
    };

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate relative position (-1 to 1)
      mouseX = ((e.clientX - centerX) / (rect.width / 2)) * 20; // Max 20px shift
      mouseY = ((e.clientY - centerY) / (rect.height / 2)) * 20;

      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    // Set up smooth transitions
    element.style.willChange = 'transform';
    element.style.transition = 'transform 0.1s ease-out';

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave);

    this.parallaxElements.push(element);
  }

  // ============================================
  // SPOTLIGHT EFFECT SYSTEM
  // ============================================

  initSpotlight() {
    if (this.reducedMotion || this.isTouch) {
      console.log('Spotlight disabled (reduced motion or touch device)');
      return;
    }

    // Create spotlight container
    this.createSpotlightContainer();
    this.setupSpotlightListeners();

    console.log('✅ Spotlight effect initialized');
  }

  createSpotlightContainer() {
    // Remove existing spotlight
    const existing = document.getElementById('spotlight-container');
    if (existing) existing.remove();

    this.spotlightContainer = document.createElement('div');
    this.spotlightContainer.id = 'spotlight-container';
    this.spotlightContainer.setAttribute('aria-hidden', 'true');
    this.spotlightContainer.setAttribute('role', 'presentation');

    this.spotlightContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 150ms cubic-bezier(0.22, 1, 0.36, 1);
      background: ${this.getSpotlightGradient()};
      will-change: transform, opacity;
    `;

    document.body.appendChild(this.spotlightContainer);
  }

  getSpotlightGradient() {
    const isDark = this.currentTheme === 'dark';

    if (isDark) {
      // VISUAL_TUNE_2025Q3: Tighter radius, lower opacity, steeper falloff
      return `radial-gradient(circle 10vw at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
        rgba(218, 14, 41, 0.04) 0%,
        rgba(59, 130, 246, 0.03) 25%,
        transparent 60%)`;
    } else {
      // VISUAL_TUNE_2025Q3: Light theme with reduced halo
      return `radial-gradient(circle 12vw at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
        rgba(0, 0, 0, 0.02) 0%,
        rgba(218, 14, 41, 0.025) 30%,
        transparent 65%)`;
    }
  }

  setupSpotlightListeners() {
    let rafId = null;
    let isVisible = false;

    const updateSpotlight = (e) => {
      if (rafId) return; // Throttle updates

      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        this.spotlightContainer.style.setProperty('--spotlight-x', `${x}%`);
        this.spotlightContainer.style.setProperty('--spotlight-y', `${y}%`);

        if (!isVisible) {
          isVisible = true;
          this.spotlightContainer.style.opacity = '1';
        }

        rafId = null;
      });
    };

    const hideSpotlight = () => {
      isVisible = false;
      this.spotlightContainer.style.opacity = '0';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Mouse events
    document.addEventListener('mousemove', updateSpotlight, { passive: true });
    document.addEventListener('mouseleave', hideSpotlight);

    // VISUAL_TUNE_2025Q3: Faster fade on blur/scroll
    window.addEventListener('blur', hideSpotlight);

    let scrollTimeout;
    const fastHideOnScroll = () => {
      hideSpotlight();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Keep hidden for 150ms after scroll stops
      }, 150);
    };

    window.addEventListener('scroll', fastHideOnScroll, { passive: true });

    // Theme changes
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme');
      if (newTheme !== this.currentTheme) {
        this.currentTheme = newTheme;
        this.spotlightContainer.style.background = this.getSpotlightGradient();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  // ============================================
  // SCROLL REVEAL SYSTEM
  // ============================================

  initScrollReveal() {
    // Find elements to reveal
    const selectors = [
      '.work-title',
      '.about-title',
      '.contact-title',
      '.error-title',
      '.work-card',
      '.mind-map-container',
      '.contact-card',
      '.bio-content',
      'section > h2',
      'section > h3'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.revealed) {
            this.revealElement(entry.target);
            entry.target.dataset.revealed = 'true';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // VISUAL_TUNE_2025Q3: Lower amplitude reveals
        if (!this.reducedMotion) {
          element.style.opacity = '0';
          element.style.transform = 'translateY(12px)'; // Reduced from 20px
        }
        element.style.transition = `opacity ${this.reducedMotion ? '0.1s' : '0.4s'} cubic-bezier(0.22, 1, 0.36, 1),
                                   transform ${this.reducedMotion ? '0.1s' : '0.4s'} cubic-bezier(0.22, 1, 0.36, 1)`;

        observer.observe(element);
        this.revealElements.push(element);
      });
    });

    console.log(`✅ Scroll reveal initialized for ${this.revealElements.length} elements`);
  }

  revealElement(element) {
    if (this.reducedMotion) {
      // Reduced motion: just fade in
      element.style.opacity = '1';
      return;
    }

    // Full animation
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  // ============================================
  // EVENT LISTENERS & UTILITIES
  // ============================================

  setupEventListeners() {
    // Listen for reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.disableMotionEffects();
      }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 16.67 && this.activeInteractions > 0) {
            console.warn('Frame drop detected during interaction:', entry.duration);
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
    }
  }

  disableMotionEffects() {
    console.log('Disabling motion effects (reduced motion enabled)');

    // Remove transforms from magnetic elements
    this.magneticElements.forEach(element => {
      element.style.transform = 'none';
      element.style.transition = 'none';
    });

    // Remove transforms from parallax elements
    this.parallaxElements.forEach(element => {
      element.style.transform = 'none';
    });

    // Hide spotlight
    if (this.spotlightContainer) {
      this.spotlightContainer.style.opacity = '0';
    }

    // Show all reveal elements immediately
    this.revealElements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  cleanup() {
    // Cancel all animation frames
    this.rafIds.forEach(id => cancelAnimationFrame(id));
    this.rafIds.clear();

    // Remove spotlight
    if (this.spotlightContainer) {
      this.spotlightContainer.remove();
    }

    console.log('Micro-interactions cleaned up');
  }

  // ============================================
  // PUBLIC API
  // ============================================

  updateTheme(theme) {
    this.currentTheme = theme;
    if (this.spotlightContainer) {
      this.spotlightContainer.style.background = this.getSpotlightGradient();
    }
  }

  addMagneticElement(element) {
    if (this.hasHover && this.hasPointer && !this.isTouch && !this.reducedMotion) {
      this.setupMagneticElement(element);
    }
  }

  getStats() {
    return {
      magneticElements: this.magneticElements.length,
      parallaxElements: this.parallaxElements.length,
      revealElements: this.revealElements.length,
      activeInteractions: this.activeInteractions,
      activeRAFs: this.rafIds.size,
      reducedMotion: this.reducedMotion,
      deviceCapabilities: {
        touch: this.isTouch,
        hover: this.hasHover,
        pointer: this.hasPointer
      }
    };
  }
}

// Initialize and expose globally
window.MicroInteractions = MicroInteractions;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.microInteractions = new MicroInteractions();
  });
} else {
  window.microInteractions = new MicroInteractions();
}