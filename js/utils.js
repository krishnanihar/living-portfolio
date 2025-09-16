// Utility Functions
const Utils = {
  // DOM helpers
  $(selector, element = document) {
    return element.querySelector(selector);
  },
  
  $$(selector, element = document) {
    return Array.from(element.querySelectorAll(selector));
  },
  
  // Math helpers
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  
  lerp(start, end, t) {
    return start + (end - start) * t;
  },
  
  // Storage helpers
  storage: {
    load() {
      try {
        return JSON.parse(localStorage.getItem(Config.storage.key) || '{}');
      } catch {
        return {};
      }
    },
    
    save(obj) {
      localStorage.setItem(Config.storage.key, JSON.stringify(obj));
    },
    
    merge(obj) {
      const current = this.load();
      this.save({ ...current, ...obj });
    }
  },
  
  // Create element helper
  createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
};

// Expose globally for convenience
const $ = Utils.$;
const $$ = Utils.$$;
