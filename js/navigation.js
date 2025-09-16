// Navigation Module
const Navigation = {
  nav: null,
  links: [],
  sections: [],
  logo: null,
  
  init() {
    this.nav = $('#nav');
    this.logo = $('#logo');
    this.links = $$('.nav-link');
    this.sections = ['work', 'reading', 'about'];
    
    this.setupScrollSpy();
    this.setupNavLinks();
    this.setupLogo();
    this.setupMagnetic();
    this.trackMouse();
    this.trackScroll(); 
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
        const target = $('#' + section);
        
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.updateActiveSection(section);
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
