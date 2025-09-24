// js/lazy-loader.js - Performance Optimization Module
const LazyLoader = {
  // Track loaded modules
  loadedModules: new Set(),

  init() {
    console.log('🚀 Initializing Lazy Loader...');

    // Defer particles until hero section is visible
    this.deferParticles();

    // Set up chat lazy loading
    this.setupChatLazyLoading();

    // Set up intersection observer for performance optimization
    this.setupIntersectionObserver();

    console.log('✅ Lazy Loader initialized');
  },

  deferParticles() {
    // Check if hero section exists and is near viewport
    const heroSection = document.querySelector('#hero, .hero-section, main');

    if (!heroSection) {
      // No hero section found, load particles immediately
      this.loadParticles();
      return;
    }

    // Check if hero is already visible
    const heroRect = heroSection.getBoundingClientRect();
    const isHeroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

    if (isHeroVisible) {
      // Hero is already visible, load particles immediately
      this.loadParticles();
    } else {
      // Set up intersection observer to load particles when hero is near
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 1.2) {
              this.loadParticles();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '20% 0px 20% 0px' // Load when hero is 20% away from viewport
        }
      );

      observer.observe(heroSection);

      // Fallback: load particles after 2 seconds anyway
      setTimeout(() => {
        if (!this.loadedModules.has('particles')) {
          console.log('Fallback: Loading particles after timeout');
          this.loadParticles();
          observer.disconnect();
        }
      }, 2000);
    }
  },

  loadParticles() {
    if (this.loadedModules.has('particles')) return;

    console.log('Loading particles system...');

    // Check if particle script exists
    const particleScript = document.querySelector('script[src*="particles"]');
    if (particleScript && window.Particles) {
      // Particles already loaded, just initialize
      this.initializeParticles();
      return;
    }

    // Load particles script dynamically
    const script = document.createElement('script');
    script.src = 'js/particles.js';
    script.async = true;
    script.onload = () => {
      this.initializeParticles();
    };
    script.onerror = () => {
      console.warn('Failed to load particles.js');
    };

    document.head.appendChild(script);
  },

  initializeParticles() {
    if (this.loadedModules.has('particles')) return;

    // Wait a bit for the script to fully execute
    setTimeout(() => {
      if (window.Particles && !window.Particles.initialized) {
        // Initialize with adaptive settings
        this.applyAdaptiveParticleSettings();
        window.Particles.init();
        this.loadedModules.add('particles');
        console.log('✅ Particles system loaded and initialized');
      }
    }, 100);
  },

  applyAdaptiveParticleSettings() {
    if (!window.Particles || !window.Config) return;

    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isSlowConnection = navigator.connection && (
      navigator.connection.effectiveType === 'slow-2g' ||
      navigator.connection.effectiveType === '2g' ||
      navigator.connection.effectiveType === '3g'
    );
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.Config?.device?.isMobile || window.innerWidth <= 768;

    // Adaptive particle count
    let particleCount = window.Config?.particles?.maxDesktop || 300;

    if (isMobile) {
      particleCount = window.Config?.particles?.maxMobile || 150;
    }

    if (isLowMemory || isSlowConnection) {
      particleCount = Math.floor(particleCount * 0.5);
    }

    if (isReducedMotion) {
      particleCount = Math.floor(particleCount * 0.3);
    }

    // Update particle configuration
    if (window.Config?.particles) {
      window.Config.particles.adaptive = true;
      window.Config.particles.currentCount = particleCount;
      window.Config.particles.reducedMotion = isReducedMotion;
    }

    console.log(`Adaptive particles: ${particleCount} particles for current device`);
  },

  setupChatLazyLoading() {
    // Don't load chat until bot is clicked
    let chatLoadPromise = null;

    const loadChat = async () => {
      if (chatLoadPromise) return chatLoadPromise;
      if (this.loadedModules.has('chat')) return Promise.resolve();

      console.log('Loading chat system...');

      chatLoadPromise = new Promise((resolve, reject) => {
        // Load chat script
        const script = document.createElement('script');
        script.src = 'js/chat.js';
        script.async = true;
        script.onload = () => {
          this.loadedModules.add('chat');
          console.log('✅ Chat system loaded');

          // Initialize chat if available
          if (window.Chat && window.Chat.init) {
            window.Chat.init();
          }

          resolve();
        };
        script.onerror = () => {
          console.warn('Failed to load chat.js');
          reject(new Error('Failed to load chat'));
        };

        document.head.appendChild(script);
      });

      return chatLoadPromise;
    };

    // Listen for bot interactions
    const setupBotListener = () => {
      const botFab = document.getElementById('botFab');
      const botToggle = document.querySelector('.bot-fab, [class*="bot"]');

      const elements = [botFab, botToggle].filter(Boolean);

      elements.forEach(element => {
        // Mouse/touch events for immediate loading
        ['mouseenter', 'touchstart', 'focus'].forEach(event => {
          element.addEventListener(event, () => {
            loadChat();
          }, { once: true, passive: true });
        });

        // Click event for guaranteed loading
        element.addEventListener('click', (e) => {
          loadChat().catch(err => {
            console.warn('Chat failed to load:', err);
          });
        });
      });
    };

    // Set up listeners when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupBotListener);
    } else {
      setupBotListener();
    }

    // Also check periodically for dynamically added bot elements
    const checkForBot = () => {
      const botElements = document.querySelectorAll('[id*="bot"], [class*="bot"]');
      if (botElements.length > 0) {
        setupBotListener();
      } else {
        setTimeout(checkForBot, 1000);
      }
    };

    setTimeout(checkForBot, 500);
  },

  setupIntersectionObserver() {
    // Pause particles when page is not visible
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (window.Particles && window.Particles.pause && window.Particles.resume) {
          if (document.hidden) {
            window.Particles.pause();
          } else {
            window.Particles.resume();
          }
        }
      });
    }

    // Pause particles when window loses focus
    window.addEventListener('blur', () => {
      if (window.Particles && window.Particles.pause) {
        window.Particles.pause();
      }
    });

    window.addEventListener('focus', () => {
      if (window.Particles && window.Particles.resume) {
        window.Particles.resume();
      }
    });

    // Adaptive FPS based on page visibility
    if ('requestIdleCallback' in window) {
      const optimizeForIdle = (deadline) => {
        if (window.Particles && deadline.timeRemaining() < 16) {
          // Less than one frame worth of time, reduce particle complexity
          window.Particles.skipFrames = 2;
        } else if (window.Particles) {
          window.Particles.skipFrames = window.Config?.device?.isMobile ? 2 : 1;
        }

        // Schedule next optimization
        requestIdleCallback(optimizeForIdle);
      };

      requestIdleCallback(optimizeForIdle);
    }
  }
};

// Export for global access
window.LazyLoader = LazyLoader;