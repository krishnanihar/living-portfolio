// particles.js - Enhanced Performance & Accessibility Version
const Particles = {
  // Core properties
  stars: [],
  connections: [],
  canvas: null,
  ctx: null,
  dpr: 1,
  mouseX: 0,
  mouseY: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  scrollY: 0,
  lastScrollY: 0,
  scrollVelocity: 0,
  isScrolling: false,
  scrollTimeout: null,
  theme: 'dark',
  initialized: false,
  animationId: null,
  time: 0,
  formation: 'default',
  currentSection: 'hero',
  sectionDimming: 1.0,
  targetDimming: 1.0,
  skipFrames: 0,
  lastFrameTime: 0,
  browser: null,
  isSafari: false,
  isMac: false,
  platformMultipliers: { opacity: 1.0, brightness: 1.0 },

  // Enhanced accessibility and performance
  isPaused: false,
  isVisible: true,
  reducedMotion: false,
  adaptiveCount: 0,
  
  // Safari/Mac optimized configuration
  config: {
    starCount: 150, // Reduced from 300
    starCountMobile: 10,
    starCountSafari: 80, // Much fewer particles for Safari
    starSizeRange: [0.3, 1.2], // Smaller particles
    starSizeRangeSafari: [0.2, 0.8], // Even smaller for Safari
    starSpeed: 0.015,
    starOpacity: 0.15, // Reduced from 0.3 for Mac
    starOpacityMobile: 0.15,
    starOpacitySafari: 0.02, // Barely visible ambient texture for Safari
    starOpacityMac: 0.02, // Almost invisible for Mac
    starOpacityLight: 0.5,
    starOpacityLightMobile: 0.2,
    starOpacityLightSafari: 0.03, // Extremely subtle for Safari light mode
    
    // Platform-specific adjustments
    platformAdjustments: {
      chrome: { opacityMultiplier: 1.0, brightnessMultiplier: 1.0 },
      firefox: { opacityMultiplier: 1.0, brightnessMultiplier: 1.0 },
      safari: { opacityMultiplier: 0.3, brightnessMultiplier: 0.6 }, // Much lower for Safari
      edge: { opacityMultiplier: 1.0, brightnessMultiplier: 1.0 }
    },
    
    connectionDistance: 100,
    connectionOpacity: 0.0,
    connectionOpacitySafari: 0.0, // No connections on Safari
    connectionOpacityLight: 0.0,
    connectionOpacityHover: 0.1,
    connectionOpacityHoverSafari: 0.0, // No hover connections on Safari
    maxConnections: 2,
    specialStarRatio: 0.08, // Fewer special stars
    specialOpacity: 0.4,
    specialOpacitySafari: 0.01, // Almost invisible special stars on Safari
    specialOpacityLight: 0.6,
    nebulaCount: 0, // Set to 0 for Mac
    nebulaCountMobile: 0,
    nebulaCountSafari: 0, // No nebula on Safari for clean look
    nebulaCountMac: 0, // COMPLETELY DISABLE nebula on Mac
    nebulaOpacity: 0.03,
    nebulaOpacityMobile: 0,
    nebulaOpacitySafari: 0, // No nebula on Safari
    nebulaOpacityLight: 0.08,
    mouseInfluence: 150,
    scrollParallax: true,
    parallaxFactor: 0.4,
    depthLayers: 3,
    maxDepthOffset: 60,
    throttleMs: 16, // 60fps cap
    isMobile: window.innerWidth <= 768,
    useWorker: false,
    enableOptimizations: true,
    heroReactionDistance: 200,
    textChangeIntensity: 1.0,
    // 3D Lighting - reduced for Safari
    lightSource: { x: 0.4, y: 0.3, z: 1.0 },
    ambientLight: 0.6,
    ambientLightDark: 0.4,
    ambientLightSafari: 0.8, // Higher ambient for Safari to reduce contrast
    lightIntensity: 0.7,
    lightIntensityDark: 0.5,
    lightIntensitySafari: 0.3, // Lower intensity for Safari
    // Section dimming
    heroDimming: 1.0,
    sectionDimming: 0.85,
    dimmingSpeed: 0.06,
    // Performance
    maxScrollVelocity: 30,
    smoothingFactor: 0.85,
    // Mouse interaction
    mouseTrailLength: 5,
    mouseTrailDecay: 0.9,
    mouseParticleSize: 1.0,
    mouseParticleSizeSafari: 0.6
  },
  
  // Enhanced browser detection
  detectBrowserAndPlatform() {
    // Detect Mac FIRST
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';
    const vendor = navigator.vendor?.toLowerCase() || '';
    
    this.isMac = platform.includes('mac') || 
                 userAgent.includes('macintosh') || 
                 userAgent.includes('mac os');
    
    // Force disable nebula for ALL Mac users
    if (this.isMac) {
      this.config.nebulaCount = 0;
      this.config.nebulaCountMobile = 0;
      this.config.nebulaCountSafari = 0;
    }
    
    // Better Safari detection
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                    (vendor.includes('apple') && !userAgent.includes('crios') && !userAgent.includes('fxios'));
    
    // If on Mac, apply ALL Safari restrictions regardless of browser
    if (this.isMac) {
      this.isSafari = true; // Force Safari mode for ALL Mac browsers
    }
    
    // Browser identification
    if (this.isSafari) {
      this.browser = 'safari';
    } else if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
      this.browser = 'chrome';
    } else if (userAgent.includes('firefox')) {
      this.browser = 'firefox';
    } else if (userAgent.includes('edge') || userAgent.includes('edg')) {
      this.browser = 'edge';
    } else {
      this.browser = 'unknown';
    }
    
    // Apply platform adjustments
    const platformAdjustment = this.config.platformAdjustments[this.browser] || 
                               this.config.platformAdjustments.chrome;
    
    // Extra reduction for ALL Mac browsers
    if (this.isMac) {
      platformAdjustment.opacityMultiplier *= 0.3; // Massive reduction for Mac
      platformAdjustment.brightnessMultiplier *= 0.5;
    }
    
    this.platformMultipliers = {
      opacity: platformAdjustment.opacityMultiplier,
      brightness: platformAdjustment.brightnessMultiplier
    };
    
    console.log(`🌐 Browser: ${this.browser}, Mac: ${this.isMac}, Safari: ${this.isSafari}`);
    console.log(`🎨 Adjustments: opacity=${this.platformMultipliers.opacity}, brightness=${this.platformMultipliers.brightness}`);
  },
  
  init() {
    console.log('✨ Initializing Enhanced Particles System...');

    // Check for reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      console.log('Reduced motion detected - using minimal particles');
    }

    this.detectBrowserAndPlatform();

    this.canvas = document.getElementById('particles');
    if (!this.canvas) {
      console.error('Particle canvas not found');
      return;
    }

    // Add ARIA attributes for accessibility
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.setAttribute('role', 'presentation');

    // Safari-specific canvas settings
    if (this.isSafari) {
      this.ctx = this.canvas.getContext('2d', {
        alpha: true,
        desynchronized: false, // Safari doesn't support desynchronized
        willReadFrequently: false
      });
      this.dpr = Math.min(1.5, window.devicePixelRatio || 1); // Lower DPR for Safari
    } else {
      this.ctx = this.canvas.getContext('2d', {
        alpha: true,
        desynchronized: true
      });
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
    }

    this.resize();
    this.theme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Apply adaptive settings before creating stars
    this.applyAdaptiveSettings();
    this.createStars();

    this.initialized = true;
    this.canvas.classList.add('particles-active');
    this.setupEventListeners();
    this.setupHeroTextReaction();
    this.updateSectionDimming();

    // Start animation only if not paused
    if (!this.isPaused) {
      this.animate();
    }

    console.log(`✅ Particles initialized with ${this.stars.length} stars (adaptive: ${this.adaptiveCount})`);
  },

  applyAdaptiveSettings() {
    // Get adaptive count from LazyLoader or calculate here
    let baseCount = this.config.starCount;

    if (this.config.isMobile) {
      baseCount = this.config.starCountMobile;
    } else if (this.isSafari) {
      baseCount = this.config.starCountSafari;
    }

    // Apply reduced motion adjustments
    if (this.reducedMotion) {
      baseCount = Math.floor(baseCount * 0.3);
      this.config.starSpeed *= 0.5;
      this.config.mouseInfluence *= 0.5;
    }

    // Apply performance-based adjustments
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isSlowConnection = navigator.connection && (
      navigator.connection.effectiveType === 'slow-2g' ||
      navigator.connection.effectiveType === '2g'
    );

    if (isLowMemory || isSlowConnection) {
      baseCount = Math.floor(baseCount * 0.5);
    }

    this.adaptiveCount = Math.max(10, baseCount); // Minimum 10 particles
    this.config.starCount = this.adaptiveCount;

    console.log(`Adaptive particle count: ${this.adaptiveCount} (reduced motion: ${this.reducedMotion})`);
  },

  // Pause/resume methods for performance
  pause() {
    if (this.isPaused) return;
    this.isPaused = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    console.log('Particles paused');
  },

  resume() {
    if (!this.isPaused || !this.initialized) return;
    this.isPaused = false;

    this.animate();
    console.log('Particles resumed');
  },

  // Theme update method
  updateTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (newTheme !== this.theme) {
      this.theme = newTheme;
      console.log(`Particles theme updated to: ${this.theme}`);
    }
  },
  
  createStars() {
    this.stars = [];
    
    // Use Safari-specific count if on Safari
    let count = this.config.isMobile ? this.config.starCountMobile : 
                this.isSafari ? this.config.starCountSafari : 
                this.config.starCount;
    
    for (let i = 0; i < count; i++) {
      const isSpecial = Math.random() < this.config.specialStarRatio && !this.isSafari; // Fewer special stars on Safari
      const depthLayer = Math.floor(Math.random() * this.config.depthLayers);
      const depth = depthLayer / (this.config.depthLayers - 1);
      
      const x = Math.random() * (window.innerWidth || 1920);
      const y = Math.random() * (window.innerHeight || 1080);
      
      // Safari-specific sizing
      const sizeRange = this.isSafari ? this.config.starSizeRangeSafari : this.config.starSizeRange;
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      
      // Mac/Safari-specific opacity
      let opacity;
      if (this.isMac) {
        // For Mac, use minimal opacity (2% opacity)
        opacity = 0.02; // Barely visible
      } else if (this.isSafari) {
        opacity = isSpecial ? this.config.specialOpacitySafari : 
                  (this.theme === 'dark' ? this.config.starOpacitySafari : this.config.starOpacityLightSafari);
      } else if (this.config.isMobile) {
        opacity = isSpecial ? this.config.specialOpacity * 0.3 : 
                  (this.theme === 'dark' ? this.config.starOpacityMobile : this.config.starOpacityLightMobile);
      } else {
        opacity = isSpecial ? 
          (this.theme === 'dark' ? this.config.specialOpacity : this.config.specialOpacityLight) :
          (this.theme === 'dark' ? this.config.starOpacity : this.config.starOpacityLight);
      }
      
      // Apply depth-based opacity reduction
      opacity *= (0.3 + depth * 0.7);
      
      this.stars.push({
        x: isFinite(x) ? x : Math.random() * 1920,
        y: isFinite(y) ? y : Math.random() * 1080,
        z: depth,
        depthLayer: depthLayer,
        vx: (Math.random() - 0.5) * this.config.starSpeed * (1 - depth * 0.5),
        vy: (Math.random() - 0.5) * this.config.starSpeed * (1 - depth * 0.5),
        baseVx: 0,
        baseVy: 0,
        baseX: 0,
        baseY: 0,
        size: size,
        opacity: opacity,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.015,
        isSpecial: isSpecial,
        hue: isSpecial ? Math.random() * 60 + 200 : 0,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        growthFactor: 0,
        targetGrowth: 0,
        lightFacing: Math.random() * 2 - 1,
        baseOpacity: 0
      });
      
      this.stars[i].baseVx = this.stars[i].vx;
      this.stars[i].baseVy = this.stars[i].vy;
      this.stars[i].baseX = this.stars[i].x;
      this.stars[i].baseY = this.stars[i].y;
      this.stars[i].baseOpacity = this.stars[i].opacity;
    }
  },
  
  setupEventListeners() {
    let mouseRaf = null;
    const handleMouseMove = (e) => {
      if (!mouseRaf) {
        mouseRaf = requestAnimationFrame(() => {
          this.targetMouseX = e.clientX;
          this.targetMouseY = e.clientY;
          mouseRaf = null;
        });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    if (this.config.isMobile) {
      document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        this.targetMouseX = touch.clientX;
        this.targetMouseY = touch.clientY;
      }, { passive: true });
    }
    
    let scrollThrottle = null;
    window.addEventListener('scroll', () => {
      const newScrollY = window.scrollY || window.pageYOffset;
      
      if (!scrollThrottle) {
        scrollThrottle = requestAnimationFrame(() => {
          this.scrollY = newScrollY;
          this.isScrolling = true;
          
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
          }, 150);
          
          scrollThrottle = null;
        });
      }
    }, { passive: true });
    
    window.addEventListener('resize', () => this.resize());
    
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      if (newTheme !== this.theme) {
        this.theme = newTheme;
      }
    });
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    });
  },
  
  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;
    
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '1';
    this.canvas.style.pointerEvents = 'none';
    
    this.ctx.scale(this.dpr, this.dpr);
    
    const wasMobile = this.config.isMobile;
    this.config.isMobile = width <= 768;
    
    if (wasMobile !== this.config.isMobile) {
      this.createStars();
    }
  },
  
  update() {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    
    this.connections = [];
    
    this.stars.forEach((star, i) => {
      star.twinkle += star.twinkleSpeed;
      
      if (star.isSpecial && !this.isSafari) {
        star.pulsePhase += 0.008;
      }
      
      const dx = this.mouseX - star.x;
      const dy = this.mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.config.mouseInfluence && distance > 0) {
        const force = (1 - distance / this.config.mouseInfluence) * 0.3;
        const angle = Math.atan2(dy, dx);
        
        star.vx += Math.cos(angle) * force * 0.015;
        star.vy += Math.sin(angle) * force * 0.015;
        
        star.targetGrowth = this.isSafari ? force * 0.3 : force;
      } else {
        star.targetGrowth = 0;
      }
      
      star.growthFactor += (star.targetGrowth - star.growthFactor) * 0.1;
      
      // Skip connections on Safari for performance
      if (!this.isSafari && !this.config.isMobile) {
        let connectionCount = 0;
        for (let j = i + 1; j < this.stars.length; j++) {
          if (connectionCount >= this.config.maxConnections) break;
          
          const other = this.stars[j];
          const cdx = star.x - other.x;
          const cdy = star.y - other.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          
          if (cdist < this.config.connectionDistance) {
            this.connections.push({
              from: star,
              to: other,
              distance: cdist,
              opacity: (1 - cdist / this.config.connectionDistance) * this.config.connectionOpacity
            });
            connectionCount++;
          }
        }
      }
      
      star.vx += (Math.random() - 0.5) * 0.0008;
      star.vy += (Math.random() - 0.5) * 0.0008;
      
      const newX = star.x + star.vx;
      const newY = star.y + star.vy;
      
      star.x = isFinite(newX) ? newX : star.x || 0;
      star.y = isFinite(newY) ? newY : star.y || 0;
      
      star.vx *= 0.99;
      star.vy *= 0.99;
      
      star.vx += (star.baseVx - star.vx) * 0.01;
      star.vy += (star.baseVy - star.vy) * 0.01;
      
      if (star.x < -50) star.x = window.innerWidth + 50;
      if (star.x > window.innerWidth + 50) star.x = -50;
      if (star.y < -50) star.y = window.innerHeight + 50;
      if (star.y > window.innerHeight + 50) star.y = -50;
      
      if (this.config.scrollParallax) {
        const scrollDelta = this.scrollY - this.lastScrollY;
        const parallaxStrength = this.config.parallaxFactor * (1 - star.z);
        
        const smoothedScrollDelta = Math.abs(scrollDelta) > this.config.maxScrollVelocity ?
          scrollDelta * this.config.smoothingFactor : scrollDelta;
        
        const newY = star.baseY + (this.scrollY * parallaxStrength * 0.5);
        const newX = star.baseX + (this.scrollY * parallaxStrength * 0.1 * Math.sin(star.depthLayer));
        
        star.y = isFinite(newY) ? newY : star.baseY || 0;
        star.x = isFinite(newX) ? newX : star.baseX || 0;
        
        if (this.isScrolling) {
          star.vy -= smoothedScrollDelta * 0.002 * parallaxStrength;
          star.vx += smoothedScrollDelta * 0.0005 * Math.sin(this.time + star.depthLayer);
        }
      }
    });
    
    this.scrollVelocity = this.scrollY - this.lastScrollY;
    this.lastScrollY = this.scrollY;
    this.time += 0.01;
    
    this.updateSectionDimming();
    this.sectionDimming += (this.targetDimming - this.sectionDimming) * 0.05;
    this.sectionDimming = Math.max(0.7, Math.min(1.0, this.sectionDimming));
  },
  
  draw() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
    this.ctx.restore();
    
    this.ctx.save();
    
    // ONLY draw nebula if NOT on Mac
    if (!this.isMac && !this.isSafari && !this.config.isMobile) {
      const nebulaDimming = Math.max(0.7, this.sectionDimming);
      this.ctx.globalAlpha = nebulaDimming;
      this.drawNebulaClouds();
    }
    
    this.ctx.globalAlpha = 1.0;
    this.drawConnections();
    this.drawStars();
    
    this.ctx.restore();
  },
  
  drawNebulaClouds() {
    // IMMEDIATE RETURN FOR MAC - NO NEBULA AT ALL
    if (this.isMac) {
      return; // EXIT IMMEDIATELY - DON'T DRAW ANY NEBULA
    }
    
    // Skip for mobile/Safari too
    if (this.config.isMobile || this.isSafari) {
      return;
    }
    
    const nebulaCount = this.config.nebulaCount;
    
    for (let i = 0; i < nebulaCount; i++) {
      const x = (Math.sin(this.time * 0.1 + i * 2) + 1) * window.innerWidth * 0.5;
      const y = (Math.cos(this.time * 0.05 + i * 3) + 1) * window.innerHeight * 0.5;
      const size = 180 + Math.sin(this.time * 0.1 + i) * 40;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
      
      const baseNebulaOpacity = this.theme === 'dark' ? 
        this.config.nebulaOpacity : this.config.nebulaOpacityLight;
      const nebulaOpacity = baseNebulaOpacity * (0.7 + Math.sin(this.time * 0.2 + i) * 0.3);
      
      if (this.theme === 'dark') {
        gradient.addColorStop(0, `rgba(138, 43, 226, ${nebulaOpacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(30, 144, 255, ${nebulaOpacity * 0.5})`);
        gradient.addColorStop(0.6, `rgba(147, 197, 253, ${nebulaOpacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
      } else {
        gradient.addColorStop(0, `rgba(71, 85, 105, ${nebulaOpacity * 1.2})`);
        gradient.addColorStop(0.3, `rgba(51, 65, 85, ${nebulaOpacity * 0.8})`);
        gradient.addColorStop(0.6, `rgba(30, 41, 59, ${nebulaOpacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
      }
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }
  },
  
  drawConnections() {
    // Skip on Safari/Mobile
    if (this.isSafari || this.config.isMobile) return;
    
    this.connections.forEach(conn => {
      this.ctx.save();
      
      const midX = (conn.from.x + conn.to.x) / 2;
      const midY = (conn.from.y + conn.to.y) / 2;
      const curve = Math.sin(this.time + conn.from.x * 0.01) * 15;
      
      this.ctx.beginPath();
      this.ctx.moveTo(conn.from.x, conn.from.y);
      this.ctx.quadraticCurveTo(
        midX + curve, 
        midY + curve * 0.5, 
        conn.to.x, 
        conn.to.y
      );
      
      const fromX = isFinite(conn.from.x) ? conn.from.x : 0;
      const fromY = isFinite(conn.from.y) ? conn.from.y : 0;
      const toX = isFinite(conn.to.x) ? conn.to.x : 0;
      const toY = isFinite(conn.to.y) ? conn.to.y : 0;
      
      const gradient = this.ctx.createLinearGradient(fromX, fromY, toX, toY);
      
      const connectionDimming = Math.max(0.7, this.sectionDimming);
      const baseOpacity = this.config.connectionOpacity;
      const opacity = baseOpacity * (1 + conn.from.growthFactor * 2) * connectionDimming;
      
      if (this.theme === 'dark') {
        gradient.addColorStop(0, `rgba(147, 197, 253, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(196, 181, 253, ${opacity * 1.5})`);
        gradient.addColorStop(1, `rgba(147, 197, 253, ${opacity})`);
      } else {
        gradient.addColorStop(0, `rgba(30, 41, 59, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(51, 65, 85, ${opacity * 1.3})`);
        gradient.addColorStop(1, `rgba(30, 41, 59, ${opacity})`);
      }
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 0.5 + conn.from.growthFactor * 0.5;
      this.ctx.stroke();
      
      this.ctx.restore();
    });
  },
  
  drawStars() {
    this.stars.forEach(star => {
      this.ctx.save();
      
      const twinkle = Math.sin(star.twinkle) * 0.2 + 0.8;
      const pulse = star.isSpecial ? Math.sin(star.pulsePhase) * 0.15 + 0.85 : 1;
      
      const lightFactor = this.calculate3DLighting(star);
      const ambientLight = this.isSafari ? this.config.ambientLightSafari :
                          this.theme === 'dark' ? this.config.ambientLightDark : 
                          this.config.ambientLight;
      const lightStrength = this.isSafari ? this.config.lightIntensitySafari :
                           this.theme === 'dark' ? this.config.lightIntensityDark : 
                           this.config.lightIntensity;
      
      const safeLightFactor = isFinite(lightFactor) ? lightFactor : 0.5;
      const safeAmbientLight = isFinite(ambientLight) ? ambientLight : 0.5;
      const safeLightStrength = isFinite(lightStrength) ? lightStrength : 0.7;
      
      const lightIntensity = safeAmbientLight + (safeLightFactor * safeLightStrength);
      
      const safeDimming = Math.max(0.7, this.sectionDimming);
      let finalOpacity = Math.max(0.1, star.baseOpacity * twinkle * pulse * lightIntensity * safeDimming);
      
      // Apply platform multipliers for consistency
      finalOpacity *= this.platformMultipliers.opacity;
      
      // Safari-specific opacity cap
      if (this.isSafari) {
        finalOpacity = Math.min(0.3, finalOpacity);
      }
      
      const size = star.size * twinkle * pulse * (1 + star.growthFactor) * (0.5 + star.z * 0.5);
      
      // Skip glow effect on Safari
      if (!this.isSafari && !this.config.isMobile && (star.isSpecial || star.growthFactor > 0.1)) {
        const glowSize = size * 2;
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        
        const glowOpacity = finalOpacity * 0.3 * (1 + star.growthFactor);
        const safeGlowOpacity = isFinite(glowOpacity) ? Math.max(0, Math.min(1, glowOpacity)) : 0.2;
        
        if (star.isSpecial) {
          const hue = isFinite(star.hue) ? star.hue : 200;
          gradient.addColorStop(0, `hsla(${hue}, 60%, 60%, ${safeGlowOpacity})`);
          gradient.addColorStop(0.5, `hsla(${hue}, 60%, 50%, ${safeGlowOpacity * 0.4})`);
          gradient.addColorStop(1, 'transparent');
        } else {
          const darkness = 60;
          const blueTint = 80;
          gradient.addColorStop(0, `rgba(${darkness}, ${darkness}, ${blueTint}, ${safeGlowOpacity})`);
          gradient.addColorStop(1, 'transparent');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(star.x - glowSize, star.y - glowSize, glowSize * 2, glowSize * 2);
      }
      
      this.ctx.globalAlpha = finalOpacity;
      
      if (star.isSpecial && !this.isSafari) {
        const litHue = isFinite(star.hue) ? star.hue : 200;
        const litSaturation = 40;
        let litLightness = 70;
        litLightness *= this.platformMultipliers.brightness;
        
        this.ctx.fillStyle = `hsl(${litHue}, ${litSaturation}%, ${litLightness}%)`;
      } else {
        if (this.theme === 'dark') {
          let brightness = this.isSafari ? 140 : 180;
          brightness *= this.platformMultipliers.brightness;
          brightness = Math.max(100, Math.min(255, Math.floor(brightness)));
          
          this.ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.9)`;
        } else {
          let baseDark = this.isSafari ? 60 : 40;
          let blue = this.isSafari ? 80 : 60;
          baseDark *= this.platformMultipliers.brightness;
          blue *= this.platformMultipliers.brightness;
          
          this.ctx.fillStyle = `rgba(${baseDark}, ${baseDark}, ${blue}, 0.9)`;
        }
      }
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Skip sparkle effect on Safari
      if (!this.isSafari && !this.config.isMobile && star.isSpecial && finalOpacity > 0.2) {
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.lineWidth = 0.3;
        this.ctx.globalAlpha = finalOpacity * 0.4;
        
        const sparkleSize = size * 1.5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(star.x - sparkleSize, star.y);
        this.ctx.lineTo(star.x + sparkleSize, star.y);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(star.x, star.y - sparkleSize);
        this.ctx.lineTo(star.x, star.y + sparkleSize);
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    });
  },
  
  animate(currentTime = 0) {
    if (!this.initialized) return;
    
    const now = performance.now();
    if (!this.lastFrameTime) this.lastFrameTime = now;
    
    const deltaTime = now - this.lastFrameTime;
    const targetFPS = this.isSafari ? 30 : (this.config.isMobile ? 30 : 60);
    const targetFrameTime = 1000 / targetFPS;
    
    if (deltaTime < targetFrameTime && this.config.enableOptimizations) {
      this.animationId = requestAnimationFrame((t) => this.animate(t));
      return;
    }
    
    this.lastFrameTime = now;
    
    this.update();
    this.draw();
    
    this.animationId = requestAnimationFrame((t) => this.animate(t));
  },
  
  // Public API Functions remain the same
  triggerBurst(x, y) {
    const burst = this.isSafari ? 5 : 10;
    for (let i = 0; i < burst; i++) {
      const angle = (i / burst) * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1;
      const size = this.isSafari ? Math.random() * 0.8 + 0.3 : Math.random() * 1.5 + 0.5;
      
      this.stars.push({
        x: x,
        y: y,
        z: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: 0,
        baseVy: 0,
        size: size,
        opacity: this.isSafari ? 0.3 : 0.6,
        twinkle: 0,
        twinkleSpeed: 0.08,
        isSpecial: !this.isSafari,
        hue: Math.random() * 60 + 200,
        pulsePhase: 0,
        connections: [],
        growthFactor: 0.5,
        targetGrowth: 0,
        temporary: true,
        life: 1
      });
    }
  },
  
  cleanup() {
    this.stars = this.stars.filter(star => {
      if (star.temporary) {
        const decay = star.elegantDecay || 0.01;
        star.life -= decay;
        star.opacity = star.baseOpacity * star.life;
        star.baseOpacity = star.opacity;
        return star.life > 0;
      }
      return true;
    });
    
    const maxStars = this.isSafari ? 150 : (this.config.isMobile ? 200 : 400);
    if (this.stars.length > maxStars) {
      this.stars = this.stars.slice(0, maxStars);
    }
  },
  
  destroy() {
    this.initialized = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.stars = [];
    this.connections = [];
  },
  
  // Helper functions
  setFormation(formation) {
    this.formation = formation;
  },
  
  updateFormation(formation) {
    this.setFormation(formation);
  },
  
  triggerKeywordAttraction(keyword, element) {
    // Simplified for Safari
    if (this.isSafari) return;
    console.log('Keyword attraction:', keyword);
  },
  
  createBurst(x, y, color) {
    this.triggerBurst(x, y);
  },
  
  setupHeroTextReaction() {
    // Simplified for Safari
    if (this.isSafari) return;
    
    const heroTitle = document.getElementById('heroTitle');
    const heroGreeting = document.getElementById('heroGreeting');
    const heroIntro = document.getElementById('heroIntro');
    const heroSub = document.getElementById('heroSub');
    
    const elements = [heroTitle, heroGreeting, heroIntro, heroSub].filter(el => el);
    
    if (elements.length === 0) {
      setTimeout(() => this.setupHeroTextReaction(), 1000);
      return;
    }
    
    const observeTextChanges = (element) => {
      if (!element) return;
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            setTimeout(() => {
              this.triggerElegantTextReaction(element);
            }, 50);
          }
        });
      });
      
      observer.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
      });
    };
    
    elements.forEach(observeTextChanges);
  },
  
  triggerElegantTextReaction(element) {
    if (!element || !this.initialized || this.isSafari) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    this.createElegantTextWave(centerX, centerY, rect.width);
    this.attractParticlesToText(centerX, centerY, rect.width * 1.2);
  },
  
  createElegantTextWave(centerX, centerY, width) {
    if (this.isSafari) return;
    
    const waveParticles = 5;
    const radius = Math.min(width * 0.5, 100);
    
    for (let i = 0; i < waveParticles; i++) {
      const angle = (i / waveParticles) * Math.PI * 2;
      const distance = radius * (0.3 + Math.random() * 0.3);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      setTimeout(() => {
        this.createElegantBurst(x, y);
      }, i * 60);
    }
  },
  
  createElegantBurst(x, y) {
    if (this.isSafari) return;
    
    const burstCount = 4;
    
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2;
      const speed = 0.5 + Math.random() * 0.4;
      const size = Math.random() * 0.8 + 0.3;
      
      this.stars.push({
        x: x,
        y: y,
        z: 0.8,
        depthLayer: 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: 0,
        baseVy: 0,
        baseX: x,
        baseY: y,
        size: size,
        opacity: 0.6,
        baseOpacity: 0.6,
        twinkle: 0,
        twinkleSpeed: 0.05,
        isSpecial: true,
        hue: this.theme === 'dark' ? Math.random() * 40 + 180 : Math.random() * 40 + 240,
        pulsePhase: 0,
        connections: [],
        growthFactor: 0.5,
        targetGrowth: 0,
        lightFacing: 1,
        temporary: true,
        life: 1,
        elegantDecay: 0.008
      });
    }
  },
  
  attractParticlesToText(centerX, centerY, radius) {
    if (this.isSafari) return;
    
    this.stars.forEach(star => {
      const dx = centerX - star.x;
      const dy = centerY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < radius && distance > 0) {
        const attraction = (1 - distance / radius) * 0.4;
        const angle = Math.atan2(dy, dx);
        
        star.vx += Math.cos(angle) * attraction * 0.02;
        star.vy += Math.sin(angle) * attraction * 0.02;
        
        star.targetGrowth = Math.max(star.targetGrowth, attraction * 0.5);
        star.twinkleSpeed = Math.min(star.twinkleSpeed * 1.3, 0.06);
      }
    });
  },
  
  handleMouseInteraction(mouseX, mouseY) {
    if (!this.initialized || this.isSafari) return;
    
    if (Math.random() < 0.1) {
      this.createMouseTrailParticle(mouseX, mouseY);
    }
    
    this.stars.forEach(star => {
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.config.mouseInfluence && distance > 0) {
        const influence = (1 - distance / this.config.mouseInfluence);
        
        if (influence > 0.3) {
          const angle = Math.atan2(dy, dx);
          star.vx += Math.cos(angle) * influence * 0.01;
          star.vy += Math.sin(angle) * influence * 0.01;
          star.targetGrowth = Math.max(star.targetGrowth, influence * 0.4);
        }
      }
    });
  },
  
  createMouseTrailParticle(x, y) {
    if (this.isSafari) return;
    
    const size = this.isSafari ? this.config.mouseParticleSizeSafari : this.config.mouseParticleSize;
    
    const particle = {
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      z: 0.9,
      depthLayer: 4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseVx: 0,
      baseVy: 0,
      baseX: x,
      baseY: y,
      size: size * (0.5 + Math.random() * 0.5),
      opacity: 0.4,
      baseOpacity: 0.4,
      twinkle: 0,
      twinkleSpeed: 0.06,
      isSpecial: true,
      hue: this.theme === 'dark' ? 200 + Math.random() * 60 : 240 + Math.random() * 60,
      pulsePhase: 0,
      connections: [],
      growthFactor: 0.3,
      targetGrowth: 0,
      lightFacing: 1,
      temporary: true,
      life: 1,
      elegantDecay: 0.02
    };
    
    this.stars.push(particle);
  },
  
  calculate3DLighting(star) {
    const starPos = {
      x: (star.x / window.innerWidth) * 2 - 1,
      y: (star.y / window.innerHeight) * 2 - 1,
      z: star.z * 2 - 1
    };
    
    const lightVector = {
      x: this.config.lightSource.x - starPos.x,
      y: this.config.lightSource.y - starPos.y,
      z: this.config.lightSource.z - starPos.z
    };
    
    const lightLength = Math.sqrt(lightVector.x * lightVector.x + lightVector.y * lightVector.y + lightVector.z * lightVector.z);
    lightVector.x /= lightLength;
    lightVector.y /= lightLength;
    lightVector.z /= lightLength;
    
    const normal = {
      x: star.lightFacing * 0.3,
      y: star.lightFacing * 0.2,
      z: 0.9
    };
    
    const dotProduct = Math.max(0, normal.x * lightVector.x + normal.y * lightVector.y + normal.z * lightVector.z);
    
    return dotProduct;
  },
  
  isMouseNearConnection(connection, mouseX, mouseY, threshold = 50) {
    if (!connection || !connection.from || !connection.to) return false;
    
    const x1 = connection.from.x;
    const y1 = connection.from.y;
    const x2 = connection.to.x;
    const y2 = connection.to.y;
    
    const A = mouseX - x1;
    const B = mouseY - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return false;
    
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = mouseX - xx;
    const dy = mouseY - yy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < threshold;
  },
  
  updateSectionDimming() {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (scrollPercent < 0.15) {
      this.targetDimming = 1.0;
      if (this.currentSection !== 'hero') {
        this.currentSection = 'hero';
        document.body.classList.remove('section-dimmed');
      }
    } else {
      this.targetDimming = 0.8;
      if (this.currentSection !== 'other') {
        this.currentSection = 'other';
        document.body.classList.add('section-dimmed');
      }
    }
  }
};

// Export
window.Particles = Particles;
