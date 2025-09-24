// js/bot-a11y.js - VISUAL_TUNE_2025Q3 Bot Accessibility Enhancement
class BotA11y {
  constructor() {
    this.liveRegion = null;
    this.focusTrap = null;
    this.lastFocus = null;

    this.init();
  }

  init() {
    console.log('🎯 Initializing Bot A11y (VISUAL_TUNE_2025Q3)...');

    this.createLiveRegion();
    this.setupKeyboardHandlers();
    this.setupFocusManagement();
    this.markDecorativeElements();

    console.log('✅ Bot A11y initialized');
  }

  createLiveRegion() {
    // Create ARIA live region for new messages and toasts
    this.liveRegion = document.createElement('div');
    this.liveRegion.id = 'bot-live-region';
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'false');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.cssText = `
      position: absolute !important;
      left: -10000px !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
    `;

    document.body.appendChild(this.liveRegion);
  }

  announceMessage(message, urgency = 'polite') {
    if (!this.liveRegion) return;

    // Clear and announce new message
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.setAttribute('aria-live', urgency);
      this.liveRegion.textContent = `New message: ${message}`;
    }, 100);
  }

  announceToast(message) {
    if (!this.liveRegion) return;

    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.setAttribute('aria-live', 'assertive');
      this.liveRegion.textContent = message;

      // Reset to polite after announcement
      setTimeout(() => {
        this.liveRegion.setAttribute('aria-live', 'polite');
      }, 1000);
    }, 100);
  }

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      const botPanel = document.querySelector('.bot-panel');
      if (!botPanel || !botPanel.classList.contains('open')) return;

      // ESC closes and returns focus
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeBot();
        return;
      }

      // Tab trapping within bot panel
      if (e.key === 'Tab') {
        this.handleTabNavigation(e, botPanel);
      }
    });
  }

  handleTabNavigation(e, container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  getFocusableElements(container) {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '.bot-chip'
    ];

    return Array.from(container.querySelectorAll(selectors.join(',')))
      .filter(el => {
        return el.offsetWidth > 0 &&
               el.offsetHeight > 0 &&
               !el.hasAttribute('aria-hidden');
      });
  }

  setupFocusManagement() {
    const botFab = document.querySelector('.bot-fab');
    const botPanel = document.querySelector('.bot-panel');

    if (botFab) {
      botFab.addEventListener('click', () => {
        this.lastFocus = document.activeElement;
        setTimeout(() => {
          const firstFocusable = this.getFocusableElements(botPanel)[0];
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }, 300); // After panel animation
      });
    }

    // VISUAL_TUNE_2025Q3: Focus-visible only
    document.addEventListener('mousedown', () => {
      document.body.classList.add('using-mouse');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    });
  }

  closeBot() {
    const botPanel = document.querySelector('.bot-panel');
    if (botPanel) {
      botPanel.classList.remove('open');

      // Return focus to FAB or last focused element
      setTimeout(() => {
        if (this.lastFocus && document.contains(this.lastFocus)) {
          this.lastFocus.focus();
        } else {
          const botFab = document.querySelector('.bot-fab');
          if (botFab) botFab.focus();
        }
        this.lastFocus = null;
      }, 100);
    }
  }

  markDecorativeElements() {
    // Mark all decorative elements as aria-hidden
    const decorativeSelectors = [
      '.status-dot',
      '.typing',
      '.bot-avatar',
      '.film-grain',
      '.depth-fog',
      '#spotlight-container'
    ];

    decorativeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('role', 'presentation');
      });
    });
  }

  // Public methods for integration
  onNewMessage(messageText, isBot = false) {
    const prefix = isBot ? 'Bot says:' : 'You sent:';
    this.announceMessage(`${prefix} ${messageText}`);
  }

  onCopySuccess() {
    this.announceToast('Message copied to clipboard');
  }

  onLimitReached() {
    this.announceToast('Message limit reached. Please wait before sending another message.');
  }

  onError(error) {
    this.announceToast(`Error: ${error}`);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.BotA11y = new BotA11y();
  });
} else {
  window.BotA11y = new BotA11y();
}