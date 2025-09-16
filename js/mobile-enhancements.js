// js/mobile-enhancements.js - Smooth scrolling & 3D card motion
const MobileEnhancements = {
  init() {
    console.log('📱 Initializing Mobile Enhancements...');
    
    // Fix scroll glitch
    this.smoothenCardScroll();
    
    // Add 3D motion based on device orientation
    this.init3DCardMotion();
    
    console.log('✨ Mobile enhancements active!');
  },
  
  smoothenCardScroll() {
    // Get all card containers
    const containers = document.querySelectorAll('.uni-card-grid, .uni-card-container');
    
    containers.forEach(container => {
      if (!container) return;
      
      // Disable native scroll snap temporarily during touch
      let isScrolling = false;
      let scrollTimeout;
      let startX = 0;
      let startY = 0; // ADD: Track Y position too
      let scrollLeft = 0;
      let isHorizontalScroll = null; // ADD: Detect scroll direction
      
      // Prevent the janky snap behavior
      container.style.scrollBehavior = 'smooth';
      container.style.webkitOverflowScrolling = 'touch';
      
      // Add will-change for better performance
      container.style.willChange = 'scroll-position';
      
      // Touch start
      container.addEventListener('touchstart', (e) => {
        // Temporarily disable snap during touch
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto';
        startX = e.touches[0].pageX - container.offsetLeft;
        startY = e.touches[0].pageY; // ADD: Capture start Y
        scrollLeft = container.scrollLeft;
        isScrolling = true;
        isHorizontalScroll = null; // Reset direction detection
        
        // Add active state
        container.classList.add('scrolling');
      }, { passive: true });
      
      // Touch move - smooth scrolling
      container.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        
        // ADD: Detect scroll direction on first significant move
        if (isHorizontalScroll === null) {
          const deltaX = Math.abs(e.touches[0].pageX - (startX + container.offsetLeft));
          const deltaY = Math.abs(e.touches[0].pageY - startY);
          
          // If vertical movement is greater, allow native scroll
          if (deltaY > deltaX && deltaY > 10) {
            isHorizontalScroll = false;
            isScrolling = false;
            container.classList.remove('scrolling');
            return;
          } else if (deltaX > 10) {
            isHorizontalScroll = true;
          }
        }
        
        // Only handle horizontal scrolling
        if (isHorizontalScroll === true) {
          e.preventDefault(); // Only prevent default for horizontal scroll
          const x = e.touches[0].pageX - container.offsetLeft;
          const walk = (x - startX) * 1.5; // Scroll speed multiplier
          container.scrollLeft = scrollLeft - walk;
        }
      }, { passive: false });
      
      // Touch end
      container.addEventListener('touchend', () => {
        isScrolling = false;
        isHorizontalScroll = null; // Reset direction
        container.classList.remove('scrolling');
        
        // Re-enable snap after a delay
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          container.style.scrollSnapType = 'x mandatory';
          container.style.scrollBehavior = 'smooth';
          
          // Only snap if we were scrolling horizontally
          if (isHorizontalScroll === true) {
            // Snap to nearest card
            const cards = container.querySelectorAll('.uni-card');
            const cardWidth = cards[0]?.offsetWidth + 16 || 0;
            const currentScroll = container.scrollLeft;
            const targetIndex = Math.round(currentScroll / cardWidth);
            
            container.scrollTo({
              left: targetIndex * cardWidth,
              behavior: 'smooth'
            });
          }
        }, 50);
      }, { passive: true });
      
      // Prevent momentum scrolling issues
      container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        container.classList.add('is-scrolling');
        
        scrollTimeout = setTimeout(() => {
          container.classList.remove('is-scrolling');
        }, 150);
      }, { passive: true });
    });
  },
  
  init3DCardMotion() {
    // Check if device supports orientation
    if (!window.DeviceOrientationEvent) {
      console.log('Device orientation not supported');
      return;
    }
    
    // Variables for motion
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    let initialGamma = null;
    let initialBeta = null;
    let calibrated = false;
    
    // Get all cards
    const cards = document.querySelectorAll('.uni-card, .project-card, .lab-card, .card');
    
    // Add 3D perspective to card containers
    const containers = document.querySelectorAll('.uni-card-grid, .uni-card-container, .container');
    containers.forEach(container => {
      container.style.perspective = '1200px';
      container.style.transformStyle = 'preserve-3d';
    });
    
    // Prepare cards for 3D transforms
    cards.forEach((card, index) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.1s ease-out';
      card.style.willChange = 'transform';
      
   // Add depth layers for parallax (BALANCED)
const cardContent = card.querySelector('.uni-card-body, .project-summary, .lab-description');
if (cardContent) {
  cardContent.style.transform = 'translateZ(15px)'; // Increased from 10px
  cardContent.style.transformStyle = 'preserve-3d';
}

const cardHeader = card.querySelector('.uni-card-header, .project-header, .lab-title');
if (cardHeader) {
  cardHeader.style.transform = 'translateZ(22px)'; // Increased from 15px
  cardHeader.style.transformStyle = 'preserve-3d';
}

const cardBadge = card.querySelector('.uni-card-badge, .project-type, .lab-badge');
if (cardBadge) {
  cardBadge.style.transform = 'translateZ(30px)'; // Increased from 20px
  cardBadge.style.transformStyle = 'preserve-3d';
}
    });
    
    // Smooth animation loop
    const updateCardTransforms = () => {
      // Lerp for smooth motion
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      
      cards.forEach((card, index) => {
        // Only apply to visible cards
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Calculate distance from center for parallax intensity
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          const screenCenterX = window.innerWidth / 2;
          const screenCenterY = window.innerHeight / 2;
          
          const distanceFromCenterX = (cardCenterX - screenCenterX) / screenCenterX;
          const distanceFromCenterY = (cardCenterY - screenCenterY) / screenCenterY;
          
          // REDUCED: Apply transform with much subtler parallax effect
          const rotateY = currentX * (1 + distanceFromCenterX * 0.35); // Increased from 0.2 to 0.35
          const rotateX = -currentY * (1 + distanceFromCenterY * 0.35); // Increased from 0.2 to 0.35
          const translateZ = (Math.abs(currentX) + Math.abs(currentY)) * 0.5; // Increased from 0.3 to 0.5

          
         card.style.transform = `
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(${translateZ}px)
          scale(${1 + translateZ * 0.001})
          `; // Reduced scale effect from 0.001
        }
      });
      
      rafId = requestAnimationFrame(updateCardTransforms);
    };
    
// Handle device orientation
const handleOrientation = (event) => {
  // Get device orientation values
  const gamma = event.gamma; // -90 to 90 (left to right tilt)
  const beta = event.beta;   // -180 to 180 (front to back tilt)
  
  // CALIBRATION: Set initial position as "flat" reference point
  if (!calibrated) {
    initialGamma = gamma;
    initialBeta = beta;
    calibrated = true;
    console.log('3D Motion calibrated to current position');
    return; // Skip first frame to start flat
  }
  
  // Calculate relative movement from initial position
  const relativeGamma = gamma - initialGamma;
  const relativeBeta = beta - initialBeta;
  
  // BALANCED: More noticeable but still professional
  targetX = Math.max(-10, Math.min(10, relativeGamma * 0.3));
  targetY = Math.max(-10, Math.min(10, relativeBeta * 0.2));
};
    
    // Request permission for iOS 13+
    const requestOrientationPermission = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            updateCardTransforms();
            // Smooth intro - cards gently come to life
setTimeout(() => {
  calibrated = false; // Reset calibration to allow movement
}, 100);
            
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
          // Fallback to mouse parallax
          this.initMouseParallax(cards, targetX, targetY, currentX, currentY);
        }
      } else {
        // Non-iOS devices
        window.addEventListener('deviceorientation', handleOrientation);
        updateCardTransforms();
        // Smooth intro - cards gently come to life
setTimeout(() => {
  calibrated = false; // Reset calibration to allow movement
}, 100);
      }
    };
    
    // Add a button to trigger permission on iOS
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Create a subtle prompt for 3D effects
      const enableButton = document.createElement('button');
      enableButton.innerHTML = '✨ Enable 3D Motion';
      enableButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: linear-gradient(135deg, var(--accent-home), var(--accent-work));
        border: none;
        border-radius: 999px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        animation: fadeInUp 0.5s ease forwards;
        animation-delay: 2s;
      `;
      
      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `;
      document.head.appendChild(style);
      
      enableButton.addEventListener('click', async () => {
        await requestOrientationPermission();
        enableButton.style.animation = 'fadeOutDown 0.3s ease forwards';
        setTimeout(() => enableButton.remove(), 300);
      });
      
      document.body.appendChild(enableButton);
      
      // Auto-hide after 10 seconds if not clicked
      setTimeout(() => {
        if (enableButton.parentNode) {
          enableButton.style.animation = 'fadeOutDown 0.3s ease forwards';
          setTimeout(() => enableButton.remove(), 300);
        }
      }, 10000);
    } else {
      requestOrientationPermission();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (rafId) cancelAnimationFrame(rafId);
    });
  },
  
  // Fallback mouse parallax for desktop or if orientation is denied
  initMouseParallax(cards, targetX, targetY, currentX, currentY) {
    let rafId;
    
    const updateWithMouse = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          card.style.transform = `
            rotateX(${-currentY}deg) 
            rotateY(${currentX}deg) 
            translateZ(${Math.abs(currentX) + Math.abs(currentY)}px)
          `;
        }
      });
      
      rafId = requestAnimationFrame(updateWithMouse);
    };
    
    document.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      targetX = mouseX * 10;
      targetY = mouseY * 10;
    });
    
    updateWithMouse();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MobileEnhancements.init());
} else {
  MobileEnhancements.init();
}

// Export for global access
window.MobileEnhancements = MobileEnhancements;
