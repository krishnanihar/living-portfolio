// Global State
const State = {
  // Current values
  mood: Config.colors.home,
  experience: 'default',
  intensity: 1,
  formation: 'dna',
  sound: false,
  currentSection: 'home',
  
  // User tracking
  visits: 0,
  hasInteracted: false,
  pageLoadTime: Date.now(),
  
  // Mouse state
  mouse: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    v: 0,
    t: 0
  },
  
  // NEW: Scroll state
  scroll: {
    velocity: 0,
    lastPosition: 0,
    lastTime: Date.now(),
    isScrolling: false,
    scrollTimer: null
  },
  
  // NEW: Focus state
  focus: {
    isReading: false,
    point: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    strength: 0
  },
  
  // NEW: Section memory
  sectionMemory: {
    previous: null,
    trailParticles: [],
    maxTrails: 10
  },

  // NEW: Content density tracking
  contentDensity: {
    grid: [],
    gridSize: 50,
    calculated: false,
    lastCalculation: 0
  },
  
  // NEW: Keyword tracking for chat
  keywordTargets: {
    'pixel radar': { section: 'work', x: 0, y: 0 },
    'air india': { section: 'work', x: 0, y: 0 },
    'aviation': { section: 'work', x: 0, y: 0 },
    'design system': { section: 'work', x: 0, y: 0 },
    'book': { section: 'reading', x: 0, y: 0 },
    'game': { section: 'reading', x: 0, y: 0 },
    'baldur': { section: 'reading', x: 0, y: 0 }
  },
  
  // Idle detection
  idle: {
    lastMove: performance.now(),
    threshold: Config.animation.idleThreshold,
    readingThreshold: 2000  // NEW: 2 seconds for reading mode
  },
  
  // Performance
  adaptiveQuality: true,
  particlesActive: true,
  maxParticles: Config.device.isMobile ? Config.particles.maxMobile : Config.particles.maxDesktop,
  connectionRadius: Config.device.isMobile ? Config.particles.mobileRadius : Config.particles.connectionRadius,
  skipFrames: Config.device.isMobile ? Config.animation.skipFramesMobile : Config.animation.skipFramesDesktop,
  
  // Heatmap
  heatmap: null,
  
  // Interaction patterns
  interactionPatterns: {
    explorer: 0,
    deep_diver: 0,
    conversationalist: 0
  }
};
