// Global Configuration
const Config = {
  // Device settings
  device: {
    isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window,
    hasLowMemory: navigator.deviceMemory && navigator.deviceMemory < 4
  },
  
  // Particle settings - INCREASED DENSITY
  particles: {
    maxDesktop: 400,    // Dramatically increased from 96
    maxMobile: 200,     // Dramatically increased from 48
    connectionRadius: 140,  // Increased connection range
    mobileRadius: 100       // Increased mobile connection range
  },
  
  // Animation settings
  animation: {
    skipFramesMobile: 2,
    skipFramesDesktop: 1,
    idleThreshold: 30000
  },
  
  // Section colors
  colors: {
    home: '#da0e29',
    work: '#3b82f6',
    reading: '#10b981',
    about: '#8b5cf6'
  },
  
  // Storage keys
  storage: {
    key: 'living.v4',
    heatmapWidth: 32,
    heatmapHeight: 18
  }
};
