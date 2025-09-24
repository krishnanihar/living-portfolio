// js/focus-management.js - Enhanced Accessibility & Focus Management
class FocusManager {
  constructor() {
    this.focusHistory = [];
    this.trapStack = [];
    this.currentTrap = null;
    this.isTrapping = false;

    // Track interactive elements for better keyboard navigation
    this.interactiveSelectors = [
      'button',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="tab"]',
      '.mind-node',
      '.work-card',
      '.contact-method',
      '.filter-tab'
    ];

    this.init();
  }

  init() {
    console.log('🎯 Initializing Enhanced Focus Management...');

    this.setupFocusTrapping();
    this.setupSkipLinks();
    this.setupFocusVisible();
    this.setupAriaLiveRegions();
    this.monitorFocusFlow();

    console.log('✅ Focus Management initialized');
  }

  // ============================================
  // FOCUS TRAPPING SYSTEM
  // ============================================

  setupFocusTrapping() {
    // Enhanced focus trapping for modals/overlays
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Check for modal/overlay patterns
            if (this.isModal(node)) {
              this.trapFocus(node);
            }
          }
        });

        mutation.removedNodes.forEach(node => {
          if (node.nodeType === 1 && this.currentTrap === node) {
            this.releaseFocusTrap();
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  isModal(element) {
    // Detect modal/overlay patterns
    const modalIndicators = [
      '.bot-panel.open',
      '.modal',
      '.overlay',
      '.popup',
      '[role="dialog"]',
      '[role="alertdialog"]',
      '[aria-modal="true"]'
    ];

    return modalIndicators.some(selector =>
      element.matches && element.matches(selector)
    );
  }

  trapFocus(container) {
    // Store the element that triggered the modal
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }

    this.currentTrap = container;
    this.isTrapping = true;

    // Get focusable elements within the trap
    const focusableElements = this.getFocusableElements(container);

    if (focusableElements.length === 0) return;

    // Focus the first element
    focusableElements[0].focus();

    // Set up trap listeners
    const handleKeyDown = (e) => {
      if (!this.isTrapping || this.currentTrap !== container) return;

      if (e.key === 'Tab') {
        this.handleTabTrap(e, focusableElements);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.releaseFocusTrap();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    this.trapStack.push({ container, handler: handleKeyDown });

    // Announce trap to screen readers
    this.announceToScreenReader('Dialog opened. Press Escape to close.');
  }

  handleTabTrap(e, focusableElements) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab (backwards)
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forwards)
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  releaseFocusTrap() {
    if (!this.isTrapping) return;

    this.isTrapping = false;

    // Remove event listeners
    const trap = this.trapStack.pop();
    if (trap) {
      trap.container.removeEventListener('keydown', trap.handler);
    }

    this.currentTrap = null;

    // Return focus to the triggering element
    const previousFocus = this.focusHistory.pop();
    if (previousFocus && document.contains(previousFocus)) {
      // Small delay to ensure modal is hidden
      setTimeout(() => {
        previousFocus.focus();
        this.announceToScreenReader('Dialog closed. Focus returned to previous element.');
      }, 100);
    }
  }

  // ============================================
  // SKIP LINKS ENHANCEMENT
  // ============================================

  setupSkipLinks() {
    // Enhance skip links with better positioning and visibility
    const skipLinks = document.querySelectorAll('.skip-link');

    skipLinks.forEach(link => {
      // VISUAL_TUNE_2025Q3: Hide skip link until focused, dismiss after first section
      if (!link.style.position) {
        link.style.cssText = `
          position: absolute;
          top: -40px;
          left: 6px;
          z-index: 100000;
          padding: 8px 16px;
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 2px solid var(--brand-red);
          border-radius: var(--radius-sm);
          opacity: 0;
          pointer-events: none;
          text-decoration: none;
          font-weight: 600;
          transition: top var(--transition-fast);
        `;
      }

      link.addEventListener('focus', () => {
        link.style.top = '6px';
        link.style.opacity = '1';
        link.style.pointerEvents = 'auto';
      });

      link.addEventListener('blur', () => {
        link.style.top = '-40px';
        link.style.opacity = '0';
        link.style.pointerEvents = 'none';
      });

      // VISUAL_TUNE_2025Q3: Auto-hide after entering main
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        if (targetId === 'main' || targetId.includes('main')) {
          setTimeout(() => {
            link.style.display = 'none';
          }, 1000);
        }
      });

      // Smooth scroll to target
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Focus the target if it's focusable
          if (target.tabIndex >= 0) {
            target.focus();
          } else {
            // Make it temporarily focusable
            target.tabIndex = -1;
            target.focus();
            target.addEventListener('blur', () => {
              target.removeAttribute('tabindex');
            }, { once: true });
          }
        }
      });
    });
  }

  // ============================================
  // FOCUS-VISIBLE POLYFILL & ENHANCEMENT
  // ============================================

  setupFocusVisible() {
    // Enhanced focus-visible behavior
    let hadKeyboardEvent = true;
    let keyboardThrottleTimeoutID = 0;

    const focusVisibleElements = new WeakSet();

    function onPointerDown() {
      hadKeyboardEvent = false;
    }

    function onKeyDown(e) {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      hadKeyboardEvent = true;
    }

    function onFocus(e) {
      if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
        focusVisibleElements.add(e.target);
        e.target.classList.add('focus-visible');
      }
    }

    function onBlur(e) {
      if (focusVisibleElements.has(e.target)) {
        focusVisibleElements.delete(e.target);
        e.target.classList.remove('focus-visible');
      }
    }

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);

    // Apply focus-visible class to body
    document.body.classList.add('js-focus-visible');
  }

  // ============================================
  // ARIA LIVE REGIONS
  // ============================================

  setupAriaLiveRegions() {
    // Create comprehensive live regions
    this.createLiveRegion('announcements', 'polite');
    this.createLiveRegion('status', 'polite');
    this.createLiveRegion('alerts', 'assertive');
  }

  createLiveRegion(id, politeness = 'polite') {
    if (document.getElementById(id)) return;

    const region = document.createElement('div');
    region.id = id;
    region.className = 'sr-only';
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.style.cssText = `
      position: absolute !important;
      left: -10000px !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
    `;

    document.body.appendChild(region);
  }

  announceToScreenReader(message, urgency = 'polite') {
    const regionId = urgency === 'assertive' ? 'alerts' : 'announcements';
    const region = document.getElementById(regionId);

    if (region) {
      // Clear previous content first
      region.textContent = '';

      // Small delay to ensure screen reader notices the change
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }

  // ============================================
  // FOCUS FLOW MONITORING
  // ============================================

  monitorFocusFlow() {
    let focusPath = [];
    let lastFocusTime = 0;

    document.addEventListener('focus', (e) => {
      const currentTime = Date.now();
      const focusGap = currentTime - lastFocusTime;

      // Track focus sequence
      focusPath.push({
        element: e.target,
        time: currentTime,
        gap: focusGap
      });

      // Keep only recent focus history (last 10 elements)
      if (focusPath.length > 10) {
        focusPath = focusPath.slice(-10);
      }

      lastFocusTime = currentTime;

      // Detect potential focus traps (rapid cycling)
      if (focusPath.length >= 3) {
        const recent = focusPath.slice(-3);
        const elements = recent.map(item => item.element);

        // Check if focus is cycling between same elements rapidly
        if (recent.every(item => item.gap < 500) &&
            elements.length === new Set(elements).size) {
          console.warn('Potential focus trap detected:', elements);
          this.handlePotentialTrap(elements);
        }
      }
    }, true);

    // Monitor for focus leaving the document
    document.addEventListener('focusout', (e) => {
      setTimeout(() => {
        if (!document.activeElement || document.activeElement === document.body) {
          // Focus has left the document, try to restore to a reasonable location
          this.restoreReasonableFocus();
        }
      }, 0);
    });
  }

  handlePotentialTrap(elements) {
    // Attempt to break out of potential focus trap
    this.announceToScreenReader('Navigation issue detected. Use Escape key if stuck.');

    // Log for debugging
    console.log('Focus trap mitigation activated');
  }

  restoreReasonableFocus() {
    // Try to find a reasonable element to focus
    const candidates = [
      document.querySelector('.skip-link'),
      document.querySelector('main'),
      document.querySelector('h1'),
      document.querySelector('nav a'),
      document.body
    ];

    const target = candidates.find(el => el && this.isVisible(el));
    if (target) {
      target.focus();
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  getFocusableElements(container) {
    const elements = container.querySelectorAll(this.interactiveSelectors.join(','));
    return Array.from(elements).filter(el =>
      this.isVisible(el) &&
      !el.disabled &&
      el.tabIndex !== -1
    );
  }

  isVisible(element) {
    if (!element || !element.offsetParent) return false;

    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0';
  }

  // ============================================
  // PUBLIC API
  // ============================================

  focusElement(element, options = {}) {
    if (!element) return false;

    const {
      preventScroll = false,
      announce = false,
      message = 'Focus moved'
    } = options;

    try {
      element.focus({ preventScroll });

      if (announce) {
        this.announceToScreenReader(message);
      }

      return true;
    } catch (error) {
      console.warn('Failed to focus element:', error);
      return false;
    }
  }

  createFocusTrap(container) {
    this.trapFocus(container);
  }

  releaseFocus() {
    this.releaseFocusTrap();
  }

  getStats() {
    return {
      currentTrap: this.currentTrap?.tagName || null,
      trapStackLength: this.trapStack.length,
      focusHistoryLength: this.focusHistory.length,
      isTrapping: this.isTrapping,
      activeElement: document.activeElement?.tagName || null
    };
  }
}

// Initialize and expose globally
window.FocusManager = FocusManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.focusManager = new FocusManager();
  });
} else {
  window.focusManager = new FocusManager();
}