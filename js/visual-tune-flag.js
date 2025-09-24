// js/visual-tune-flag.js - VISUAL_TUNE_2025Q3 Feature Flag
const VISUAL_TUNE_2025Q3 = {
  enabled: true,

  features: {
    hero_alpha_reduction: true,      // Lower hero card surface alpha in Dark theme
    spotlight_optimization: true,    // Move spotlight under content, reduce opacity/radius
    parallax_clamping: true,        // Clamp parallax shift to ≤1%, increase damping
    scroll_reveal_tuning: true,     // Lower amplitude scroll reveals
    focus_visible_red: true,        // Red focus rings with :focus-visible
    skip_link_behavior: true,       // Hide skip link until focused, dismiss after use
    primary_cta_accent: true,       // Promote one hero CTA to primary with accent colors
    chat_fab_glow_removal: true,    // Remove persistent red glow, show only on hover/focus
    theme_flash_fix: true          // Set theme class before paint to eliminate flicker
  },

  isEnabled(feature) {
    return this.enabled && this.features[feature] !== false;
  },

  log(feature, action) {
    if (this.enabled) {
      console.log(`🔧 VISUAL_TUNE_2025Q3.${feature}: ${action}`);
    }
  }
};

// Make globally available
window.VISUAL_TUNE_2025Q3 = VISUAL_TUNE_2025Q3;