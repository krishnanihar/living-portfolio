// particles.js - Complete Fixed Version with All Functions
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
  sectionDimming: 1.0,        // Start at full brightness
  targetDimming: 1.0,         // Target full brightness initially
  skipFrames: 0,              // Frame skipping for performance
  lastFrameTime: 0,           // Frame rate control
  
  // Ultra-performance optimized configuration
  config: {
    starCount: window.innerWidth > 1400 ? 300 : window.innerWidth > 1200 ? 250 : 200,
    starCountMobile: 120, // Reduced for better performance
    starSizeRange: [0.4, 2.2],
    starSpeed: 0.02,
    starOpacity: 0.4,
    starOpacityLight: 0.8,     // Higher opacity for light mode
    connectionDistance: 120,
    connectionOpacity: 0.0, // Hide by default
    connectionOpacityLight: 0.0, // Hide by default in light mode
    connectionOpacityHover: 0.15, // Show on hover
    connectionOpacityHoverLight: 0.25, // Show on hover in light mode
    maxConnections: 2,         // Reduced for performance
    specialStarRatio: 0.15,
    specialOpacity: 0.6,
    specialOpacityLight: 0.9,  // Higher for light mode
    nebulaCount: 5,            // Reduced for performance
    nebulaOpacity: 0.04,
    nebulaOpacityLight: 0.1,   // Higher for light mode
    mouseInfluence: 180,       // Optimized range
    scrollParallax: true,
    parallaxFactor: 0.6,        // Optimized for performance
    depthLayers: 4,             // Reduced for better performance
    maxDepthOffset: 80,
    throttleMs: 8,              // Higher frequency for smoother updates
    isMobile: window.innerWidth <= 768,
    useWorker: false,           // Disable web workers for now
    enableOptimizations: true,  // Enable all performance optimizations
    heroReactionDistance: 250,
    textChangeIntensity: 1.5,
    // Enhanced 3D Lighting for both themes
    lightSource: { x: 0.4, y: 0.3, z: 1.0 },
    ambientLight: 0.5,
    ambientLightDark: 0.3,      // Different for dark mode
    lightIntensity: 0.9,
    lightIntensityDark: 0.7,    // Different for dark mode
    // Section dimming
    heroDimming: 1.0,
    sectionDimming: 0.85,
    dimmingSpeed: 0.06,
    // Performance optimizations
    maxScrollVelocity: 40,
    smoothingFactor: 0.85,
    // Mouse interaction
    mouseTrailLength: 8,        // Length of mouse trail effect
    mouseTrailDecay: 0.85,      // How quickly trail fades
    mouseParticleSize: 1.5      // Size of mouse interaction particles
  },
  
  init() {
    console.log('✨ Initializing Space Particle System (Immediate Mode)...');

    this.canvas = document.getElementById('particles');
    if (!this.canvas) {
      console.error('Particle canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true
    });
    this.dpr = Math.min(2, window.devicePixelRatio || 1);

    // Initialize immediately for instant visibility
    this.resize();
    this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.createStars();

    // Start animation immediately before event listeners
    this.initialized = true;
    this.animate();

    // Draw first frame immediately
    this.draw();

    // Mark canvas as active to hide preloader
    this.canvas.classList.add('particles-active');

    this.setupEventListeners();
    this.setupHeroTextReaction(); // New: setup hero text monitoring

    // Initialize section dimming
    this.updateSectionDimming();

    console.log('✅ Space Particle System initialized IMMEDIATELY with', this.stars.length, 'stars!');
  },
  
  createStars() {
    this.stars = [];
    const count = this.config.isMobile ? this.config.starCountMobile : this.config.starCount;

    for (let i = 0; i < count; i++) {
      const isSpecial = Math.random() < this.config.specialStarRatio;
      // Enhanced depth with discrete layers for better 3D effect
      const depthLayer = Math.floor(Math.random() * this.config.depthLayers);
      const depth = depthLayer / (this.config.depthLayers - 1);

      // Ensure coordinates are always finite
      const x = Math.random() * (window.innerWidth || 1920);
      const y = Math.random() * (window.innerHeight || 1080);

      this.stars.push({
        x: isFinite(x) ? x : Math.random() * 1920,
        y: isFinite(y) ? y : Math.random() * 1080,
        z: depth,
        depthLayer: depthLayer,
        vx: (Math.random() - 0.5) * this.config.starSpeed * (1 - depth * 0.5),
        vy: (Math.random() - 0.5) * this.config.starSpeed * (1 - depth * 0.5),
        baseVx: 0,
        baseVy: 0,
        baseX: 0, // For parallax calculations
        baseY: 0,
        size: Math.random() * (this.config.starSizeRange[1] - this.config.starSizeRange[0])
              + this.config.starSizeRange[0],
        opacity: isSpecial ?
          (this.theme === 'dark' ? this.config.specialOpacity : this.config.specialOpacityLight) :
          (this.theme === 'dark' ? this.config.starOpacity : this.config.starOpacityLight) * (0.4 + depth * 0.6),
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.02,
        isSpecial: isSpecial,
        hue: isSpecial ? Math.random() * 60 + 200 : 0,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        growthFactor: 0,
        targetGrowth: 0,
        // 3D lighting properties
        lightFacing: Math.random() * 2 - 1, // How much this star faces the light (-1 to 1)
        baseOpacity: 0 // Will be calculated
      });

      this.stars[i].baseVx = this.stars[i].vx;
      this.stars[i].baseVy = this.stars[i].vy;
      this.stars[i].baseX = this.stars[i].x;
      this.stars[i].baseY = this.stars[i].y;
      this.stars[i].baseOpacity = this.stars[i].opacity;
    }
  },
  
  setupEventListeners() {
    // Optimized mouse handling with RAF
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

      // Throttle scroll updates to prevent glitches
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
    
    this.ctx.scale(this.dpr, this.dpr);
    
    this.config.isMobile = width <= 768;
  },
  
  update() {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    
    this.connections = [];
    
    this.stars.forEach((star, i) => {
      star.twinkle += star.twinkleSpeed;
      
      if (star.isSpecial) {
        star.pulsePhase += 0.01;
      }
      
      const dx = this.mouseX - star.x;
      const dy = this.mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.config.mouseInfluence && distance > 0) {
        const force = (1 - distance / this.config.mouseInfluence) * 0.5;
        const angle = Math.atan2(dy, dx);
        
        star.vx += Math.cos(angle) * force * 0.02;
        star.vy += Math.sin(angle) * force * 0.02;
        
        star.targetGrowth = force;
      } else {
        star.targetGrowth = 0;
      }
      
      star.growthFactor += (star.targetGrowth - star.growthFactor) * 0.1;
      
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
      
      star.vx += (Math.random() - 0.5) * 0.001;
      star.vy += (Math.random() - 0.5) * 0.001;
      
      // Update position with validation
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
      
      // Enhanced 3D parallax effect
      if (this.config.scrollParallax) {
        const scrollDelta = this.scrollY - this.lastScrollY;
        const parallaxStrength = this.config.parallaxFactor * (1 - star.z);

        // Smooth out fast scrolling to prevent glitches
        const smoothedScrollDelta = Math.abs(scrollDelta) > this.config.maxScrollVelocity ?
          scrollDelta * this.config.smoothingFactor : scrollDelta;

        // Multi-layer parallax
        // Apply parallax with validation
        const newY = star.baseY + (this.scrollY * parallaxStrength * 0.5);
        const newX = star.baseX + (this.scrollY * parallaxStrength * 0.1 * Math.sin(star.depthLayer));

        star.y = isFinite(newY) ? newY : star.baseY || 0;
        star.x = isFinite(newX) ? newX : star.baseX || 0;

        // Depth-based movement during scrolling
        if (this.isScrolling) {
          star.vy -= smoothedScrollDelta * 0.002 * parallaxStrength;
          star.vx += smoothedScrollDelta * 0.0005 * Math.sin(this.time + star.depthLayer);
        }
      }
    });
    
    // Update scroll velocity and section detection
    this.scrollVelocity = this.scrollY - this.lastScrollY;
    this.lastScrollY = this.scrollY;
    this.time += 0.01;

    // Detect current section and update dimming
    this.updateSectionDimming();

    // Update global dimming smoothly
    this.sectionDimming += (this.targetDimming - this.sectionDimming) * 0.05;

    // Ensure dimming stays within safe bounds
    this.sectionDimming = Math.max(0.7, Math.min(1.0, this.sectionDimming));
  },
  
  draw() {
    // Prevent drawing glitches by using a clean clear
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
    this.ctx.restore();

    this.ctx.save();

    // Apply subtle dimming to background elements
    const nebulaDimming = Math.max(0.7, this.sectionDimming); // Never below 70%
    this.ctx.globalAlpha = nebulaDimming;
    this.drawNebulaClouds();
    this.ctx.globalAlpha = 1.0;

    this.drawConnections();
    this.drawStars();

    this.ctx.restore();
  },
  
  drawNebulaClouds() {
    for (let i = 0; i < this.config.nebulaCount; i++) {
      const x = (Math.sin(this.time * 0.1 + i * 2) + 1) * window.innerWidth * 0.5;
      const y = (Math.cos(this.time * 0.05 + i * 3) + 1) * window.innerHeight * 0.5;
      const size = 200 + Math.sin(this.time * 0.1 + i) * 50;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);

      // Theme-aware nebula with enhanced visibility
      const baseNebulaOpacity = this.theme === 'dark' ? this.config.nebulaOpacity : this.config.nebulaOpacityLight;
      const nebulaOpacity = baseNebulaOpacity * (0.7 + Math.sin(this.time * 0.2 + i) * 0.3);

      if (this.theme === 'dark') {
        gradient.addColorStop(0, `rgba(138, 43, 226, ${nebulaOpacity * 1.2})`);
        gradient.addColorStop(0.3, `rgba(30, 144, 255, ${nebulaOpacity * 0.8})`);
        gradient.addColorStop(0.6, `rgba(147, 197, 253, ${nebulaOpacity * 0.4})`);
        gradient.addColorStop(1, 'transparent');
      } else {
        // Dark nebula for light mode - visible against white background
        gradient.addColorStop(0, `rgba(71, 85, 105, ${nebulaOpacity * 1.4})`);    // Dark slate
        gradient.addColorStop(0.3, `rgba(51, 65, 85, ${nebulaOpacity * 1.0})`);   // Darker slate
        gradient.addColorStop(0.6, `rgba(30, 41, 59, ${nebulaOpacity * 0.6})`);   // Darkest slate
        gradient.addColorStop(1, 'transparent');
      }
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }
  },
  
  drawConnections() {
    this.connections.forEach(conn => {
      this.ctx.save();
      
      const midX = (conn.from.x + conn.to.x) / 2;
      const midY = (conn.from.y + conn.to.y) / 2;
      const curve = Math.sin(this.time + conn.from.x * 0.01) * 20;
      
      this.ctx.beginPath();
      this.ctx.moveTo(conn.from.x, conn.from.y);
      this.ctx.quadraticCurveTo(
        midX + curve, 
        midY + curve * 0.5, 
        conn.to.x, 
        conn.to.y
      );
      
      // Validate coordinates to prevent non-finite values
      const fromX = isFinite(conn.from.x) ? conn.from.x : 0;
      const fromY = isFinite(conn.from.y) ? conn.from.y : 0;
      const toX = isFinite(conn.to.x) ? conn.to.x : 0;
      const toY = isFinite(conn.to.y) ? conn.to.y : 0;

      const gradient = this.ctx.createLinearGradient(
        fromX, fromY, toX, toY
      );
      
      // Theme-aware connection dimming with hover detection
      const connectionDimming = Math.max(0.7, this.sectionDimming);

      // Check if mouse is near the connection line for hover effect
      const mouseNearConnection = this.mouseX && this.mouseY &&
        this.isMouseNearConnection(conn, this.mouseX, this.mouseY, 100);

      const baseOpacity = mouseNearConnection ?
        (this.theme === 'dark' ? this.config.connectionOpacityHover : this.config.connectionOpacityHoverLight) :
        (this.theme === 'dark' ? this.config.connectionOpacity : this.config.connectionOpacityLight);

      const opacity = baseOpacity * (1 + conn.from.growthFactor * 2) * connectionDimming;

      if (this.theme === 'dark') {
        gradient.addColorStop(0, `rgba(147, 197, 253, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(196, 181, 253, ${opacity * 1.5})`);
        gradient.addColorStop(1, `rgba(147, 197, 253, ${opacity})`);
      } else {
        // Dark connections for light mode - highly visible
        gradient.addColorStop(0, `rgba(30, 41, 59, ${opacity})`);     // Dark slate
        gradient.addColorStop(0.5, `rgba(51, 65, 85, ${opacity * 1.3})`); // Darker slate
        gradient.addColorStop(1, `rgba(30, 41, 59, ${opacity})`);
      }
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 0.5 + conn.from.growthFactor;
      this.ctx.stroke();
      
      this.ctx.restore();
    });
  },
  
  drawStars() {
    this.stars.forEach(star => {
      this.ctx.save();

      const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7;
      const pulse = star.isSpecial ? Math.sin(star.pulsePhase) * 0.2 + 0.8 : 1;

      // Calculate theme-aware 3D lighting with validation
      const lightFactor = this.calculate3DLighting(star);
      const ambientLight = this.theme === 'dark' ? this.config.ambientLightDark : this.config.ambientLight;
      const lightStrength = this.theme === 'dark' ? this.config.lightIntensityDark : this.config.lightIntensity;

      // Ensure all lighting values are finite
      const safeLightFactor = isFinite(lightFactor) ? lightFactor : 0.5;
      const safeAmbientLight = isFinite(ambientLight) ? ambientLight : 0.5;
      const safeLightStrength = isFinite(lightStrength) ? lightStrength : 0.7;

      const lightIntensity = safeAmbientLight + (safeLightFactor * safeLightStrength);

      // Apply section dimming and 3D lighting - SAFE OPACITY CALCULATION
      const safeDimming = Math.max(0.7, this.sectionDimming); // Never below 70%
      const finalOpacity = Math.max(0.4, star.baseOpacity * twinkle * pulse * lightIntensity * safeDimming);
      const size = star.size * twinkle * pulse * (1 + star.growthFactor * 2) * (0.5 + star.z * 0.5);

      // Enhanced glow for depth
      if (star.isSpecial || star.growthFactor > 0.1 || star.z > 0.7) {
        const glowSize = size * (3 + star.z * 2); // Bigger glow for closer particles
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );

        const glowOpacity = finalOpacity * 0.4 * (1 + star.growthFactor) * lightIntensity;

        // Validate color values to prevent NaN in color strings
        const safeGlowOpacity = isFinite(glowOpacity) ? Math.max(0, Math.min(1, glowOpacity)) : 0.3;

        if (star.isSpecial) {
          const hue = isFinite(star.hue) ? star.hue : 200;
          const lightness1 = isFinite(lightIntensity) ? Math.max(30, Math.min(90, 60 + lightIntensity * 20)) : 60;
          const lightness2 = isFinite(lightIntensity) ? Math.max(20, Math.min(80, 50 + lightIntensity * 15)) : 50;

          gradient.addColorStop(0, `hsla(${hue}, 70%, ${lightness1}%, ${safeGlowOpacity})`);
          gradient.addColorStop(0.5, `hsla(${hue}, 70%, ${lightness2}%, ${safeGlowOpacity * 0.5})`);
          gradient.addColorStop(1, 'transparent');
        } else {
          // Dark glow for light mode with validation
          const darkness = isFinite(lightIntensity) ? Math.max(10, Math.min(200, Math.floor(40 + lightIntensity * 40))) : 60;
          const blueTint = isFinite(lightIntensity) ? Math.max(10, Math.min(200, Math.floor(darkness + lightIntensity * 60))) : 80;

          gradient.addColorStop(0, `rgba(${darkness}, ${darkness}, ${blueTint}, ${safeGlowOpacity})`);
          gradient.addColorStop(1, 'transparent');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
          star.x - glowSize,
          star.y - glowSize,
          glowSize * 2,
          glowSize * 2
        );
      }

      this.ctx.globalAlpha = finalOpacity;

      if (star.isSpecial) {
        const litHue = isFinite(star.hue) ? star.hue : 200;
        const litSaturation = isFinite(lightIntensity) ? Math.max(30, Math.min(100, 50 + lightIntensity * 30)) : 50;
        const litLightness = isFinite(lightIntensity) ? Math.max(40, Math.min(90, 60 + lightIntensity * 25)) : 60;
        this.ctx.fillStyle = `hsl(${litHue}, ${litSaturation}%, ${litLightness}%)`;
      } else {
        if (this.theme === 'dark') {
          const brightness = isFinite(lightIntensity) ? Math.max(100, Math.min(255, Math.floor(180 + lightIntensity * 75))) : 200;
          this.ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.9)`;
        } else {
          // Dark particles for light mode - highly visible on white background
          const baseDark = isFinite(lightIntensity) ? Math.max(20, Math.min(100, Math.floor(30 + lightIntensity * 50))) : 50;
          const blue = isFinite(lightIntensity) ? Math.max(20, Math.min(130, Math.floor(baseDark + lightIntensity * 30))) : 70;
          this.ctx.fillStyle = `rgba(${baseDark}, ${baseDark}, ${blue}, 0.9)`;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      this.ctx.fill();

      // Enhanced sparkle effect for bright/close particles
      if ((star.isSpecial || star.growthFactor > 0.3 || lightIntensity > 0.8) && finalOpacity > 0.3) {
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.lineWidth = 0.5 + star.z * 0.5;
        this.ctx.globalAlpha = finalOpacity * 0.6;

        const sparkleSize = size * (2 + star.z);

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

    // Advanced performance optimization
    const now = performance.now();
    if (!this.lastFrameTime) this.lastFrameTime = now;

    const deltaTime = now - this.lastFrameTime;
    const targetFPS = this.config.isMobile ? 30 : 60;
    const targetFrameTime = 1000 / targetFPS;

    // Skip frame if running too fast
    if (deltaTime < targetFrameTime && this.config.enableOptimizations) {
      this.animationId = requestAnimationFrame((t) => this.animate(t));
      return;
    }

    this.lastFrameTime = now;

    // Update only if necessary
    this.update();
    this.draw();

    this.animationId = requestAnimationFrame((t) => this.animate(t));
  },
  
  // Public API Functions
  triggerBurst(x, y) {
    const burst = 15;
    for (let i = 0; i < burst; i++) {
      const angle = (i / burst) * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      const size = Math.random() * 1.5 + 0.5;
      
      this.stars.push({
        x: x,
        y: y,
        z: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: 0,
        baseVy: 0,
        size: size,
        opacity: 0.8,
        twinkle: 0,
        twinkleSpeed: 0.1,
        isSpecial: true,
        hue: Math.random() * 60 + 200,
        pulsePhase: 0,
        connections: [],
        growthFactor: 1,
        targetGrowth: 0,
        temporary: true,
        life: 1
      });
    }
  },
  
  cleanup() {
    this.stars = this.stars.filter(star => {
      if (star.temporary) {
        // Use elegant decay if available, otherwise standard decay
        const decay = star.elegantDecay || 0.01;
        star.life -= decay;
        star.opacity = star.baseOpacity * star.life;
        star.baseOpacity = star.opacity;
        return star.life > 0;
      }
      return true;
    });

    const maxStars = this.config.isMobile ? 250 : 500; // Increased limits
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
  
  // MISSING FUNCTIONS - ADD THESE
  setFormation(formation) {
    this.formation = formation;
    console.log('Formation set to:', formation);
    // Add formation logic here if needed
  },
  
  updateFormation(formation) {
    this.setFormation(formation);
  },
  
  triggerKeywordAttraction(keyword, element) {
    console.log('Keyword attraction:', keyword);
    // Add attraction logic here if needed
  },
  
  createBurst(x, y, color) {
    console.log('Creating burst at:', x, y, color);
    this.triggerBurst(x, y);
  },

  // Enhanced: Setup elegant hero text change reactions
  setupHeroTextReaction() {
    const heroTitle = document.getElementById('heroTitle');
    const heroGreeting = document.getElementById('heroGreeting');
    const heroIntro = document.getElementById('heroIntro');
    const heroSub = document.getElementById('heroSub');

    const elements = [heroTitle, heroGreeting, heroIntro, heroSub].filter(el => el);

    if (elements.length === 0) {
      // If elements don't exist yet, try again later
      setTimeout(() => this.setupHeroTextReaction(), 1000);
      return;
    }

    const observeTextChanges = (element) => {
      if (!element) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            // Use a gentle delay to prevent interference
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
    console.log('✨ Elegant hero text reaction monitoring setup for', elements.length, 'elements');
  },

  // Enhanced: Trigger elegant particle reaction to text changes
  triggerElegantTextReaction(element) {
    if (!element || !this.initialized) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    console.log('✨ Hero text changed, creating elegant particle reaction');

    // Create a gentle wave of particle activity
    this.createElegantTextWave(centerX, centerY, rect.width);

    // Subtle particle attraction to the text area
    this.attractParticlesToText(centerX, centerY, rect.width * 1.2);
  },

  // New: Create elegant wave effect for text changes
  createElegantTextWave(centerX, centerY, width) {
    const waveParticles = 8; // Fewer, more elegant particles
    const radius = Math.min(width * 0.6, 150);

    for (let i = 0; i < waveParticles; i++) {
      const angle = (i / waveParticles) * Math.PI * 2;
      const distance = radius * (0.3 + Math.random() * 0.4);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      // Create elegant burst particles with staggered timing
      setTimeout(() => {
        this.createElegantBurst(x, y);
      }, i * 80); // Staggered 80ms apart
    }
  },

  // New: Create elegant burst (softer than regular burst)
  createElegantBurst(x, y) {
    const burstCount = 6; // Smaller, more refined bursts

    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2;
      const speed = 0.8 + Math.random() * 0.6; // Gentler speed
      const size = Math.random() * 1.2 + 0.4;

      this.stars.push({
        x: x,
        y: y,
        z: 0.8, // Closer to front for visibility
        depthLayer: 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: 0,
        baseVy: 0,
        baseX: x,
        baseY: y,
        size: size,
        opacity: 0.9,
        baseOpacity: 0.9,
        twinkle: 0,
        twinkleSpeed: 0.06, // Faster twinkle for elegance
        isSpecial: true,
        hue: this.theme === 'dark' ? Math.random() * 40 + 180 : Math.random() * 40 + 240, // Darker hues for light mode
        pulsePhase: 0,
        connections: [],
        growthFactor: 0.8,
        targetGrowth: 0,
        lightFacing: 1, // Face the light
        temporary: true,
        life: 1,
        elegantDecay: 0.008 // Slower, more elegant decay
      });
    }
  },

  // New: Attract particles to text area
  attractParticlesToText(centerX, centerY, radius) {
    this.stars.forEach(star => {
      const dx = centerX - star.x;
      const dy = centerY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 0) {
        const attraction = (1 - distance / radius) * 0.6;
        const angle = Math.atan2(dy, dx);

        // Gentle attraction force
        star.vx += Math.cos(angle) * attraction * 0.03;
        star.vy += Math.sin(angle) * attraction * 0.03;

        // Enhance particle properties temporarily
        star.targetGrowth = Math.max(star.targetGrowth, attraction * 0.8);
        star.twinkleSpeed = Math.min(star.twinkleSpeed * 1.5, 0.08);
      }
    });
  },

  // New: Handle mouse interactions with particles
  handleMouseInteraction(mouseX, mouseY) {
    if (!this.initialized) return;

    // Reduced mouse trail creation for performance
    if (Math.random() < 0.2) { // 20% chance for better performance
      this.createMouseTrailParticle(mouseX, mouseY);
    }

    // Enhance nearby particles
    this.stars.forEach(star => {
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.config.mouseInfluence && distance > 0) {
        const influence = (1 - distance / this.config.mouseInfluence);

        // Gentle attraction with performance consideration
        if (influence > 0.3) {
          const angle = Math.atan2(dy, dx);
          star.vx += Math.cos(angle) * influence * 0.015;
          star.vy += Math.sin(angle) * influence * 0.015;
          star.targetGrowth = Math.max(star.targetGrowth, influence * 0.6);
        }
      }
    });
  },

  // New: Create mouse trail particles
  createMouseTrailParticle(x, y) {
    const particle = {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      z: 0.9,
      depthLayer: 4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      baseVx: 0,
      baseVy: 0,
      baseX: x,
      baseY: y,
      size: this.config.mouseParticleSize * (0.5 + Math.random() * 0.5),
      opacity: 0.6,
      baseOpacity: 0.6,
      twinkle: 0,
      twinkleSpeed: 0.08,
      isSpecial: true,
      hue: this.theme === 'dark' ? 200 + Math.random() * 60 : 240 + Math.random() * 60, // Darker blue-purple for light mode
      pulsePhase: 0,
      connections: [],
      growthFactor: 0.5,
      targetGrowth: 0,
      lightFacing: 1,
      temporary: true,
      life: 1,
      elegantDecay: 0.02 // Quick decay for performance
    };

    this.stars.push(particle);
  },

  // New: Calculate 3D lighting for a star
  calculate3DLighting(star) {
    // Simulate 3D position (x, y, z where z is depth)
    const starPos = {
      x: (star.x / window.innerWidth) * 2 - 1, // Normalize to -1 to 1
      y: (star.y / window.innerHeight) * 2 - 1,
      z: star.z * 2 - 1 // Convert 0-1 depth to -1 to 1
    };

    // Calculate vector from star to light
    const lightVector = {
      x: this.config.lightSource.x - starPos.x,
      y: this.config.lightSource.y - starPos.y,
      z: this.config.lightSource.z - starPos.z
    };

    // Normalize light vector
    const lightLength = Math.sqrt(lightVector.x * lightVector.x + lightVector.y * lightVector.y + lightVector.z * lightVector.z);
    lightVector.x /= lightLength;
    lightVector.y /= lightLength;
    lightVector.z /= lightLength;

    // Calculate surface normal (simplified - particles face camera with slight random variation)
    const normal = {
      x: star.lightFacing * 0.3,
      y: star.lightFacing * 0.2,
      z: 0.9 // Mostly facing camera
    };

    // Dot product for lighting calculation
    const dotProduct = Math.max(0, normal.x * lightVector.x + normal.y * lightVector.y + normal.z * lightVector.z);

    return dotProduct;
  },

  // New: Check if mouse is near connection line for hover effect
  isMouseNearConnection(connection, mouseX, mouseY, threshold = 50) {
    if (!connection || !connection.from || !connection.to) return false;

    // Get line endpoints
    const x1 = connection.from.x;
    const y1 = connection.from.y;
    const x2 = connection.to.x;
    const y2 = connection.to.y;

    // Calculate distance from point to line
    const A = mouseX - x1;
    const B = mouseY - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) return false; // Line has no length

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

  // Simplified: Update section-based dimming
  updateSectionDimming() {
    // Simple scroll-based detection
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    if (scrollPercent < 0.15) { // In hero section (first 15% of page)
      this.targetDimming = 1.0; // Full brightness
      if (this.currentSection !== 'hero') {
        this.currentSection = 'hero';
        document.body.classList.remove('section-dimmed');
      }
    } else { // Below hero
      this.targetDimming = 0.8; // Slightly dimmed
      if (this.currentSection !== 'other') {
        this.currentSection = 'other';
        document.body.classList.add('section-dimmed');
      }
    }
  }
};

// Export
window.Particles = Particles;
