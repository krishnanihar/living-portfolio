# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Living Instrument v4.2" - an interactive, living portfolio website for Nihar, a Product & New Media Designer. The project features a sophisticated particle system that responds to user interaction and adapts to different sections of the site.

## Development Commands

This is a static HTML/CSS/JavaScript project with no build tools. To develop:

1. **Local Development**: Open `index.html` directly in a browser or use a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .
   ```

2. **No build, lint, or test commands** - this is a vanilla JavaScript project

## Architecture

### Core Structure

The project follows a modular JavaScript architecture with global objects:

- **`Config`** (`js/config.js`) - Global configuration for device settings, particle limits, colors, and storage
- **`State`** (`js/state.js`) - Central state management for mood, user tracking, mouse/scroll state, and interaction patterns
- **`Sections`** (`js/sections.js`) - Main content loader that dynamically builds all page sections
- **`Particles`** (`js/particles.js`) - Advanced particle system with adaptive performance and interaction response
- **`Theme`** (`js/theme.js`) - Dark/light theme management with mobile snap scrolling
- **`Navigation`** (`js/navigation.js`) - Navigation behavior and section detection

### Key Systems

1. **Particle System**: Adaptive particle animation that responds to:
   - Mouse movement and velocity
   - Scroll behavior
   - Section transitions
   - Device capabilities (mobile vs desktop)
   - Performance constraints

2. **Section Architecture**: All page content is loaded dynamically by `Sections.init()`:
   - Hero section with 3D tilt effects
   - Work portfolio with detailed project views
   - Labs section for experimental work
   - Reading/Life section with book and game lists
   - About section

3. **Interactive Elements**:
   - Glass cursor effect (desktop only)
   - 3D hero card with mouse/touch tilt
   - Chat bot integration
   - Portfolio deck viewer
   - Mobile-optimized interactions

4. **State Management**: The `State` object tracks:
   - User behavior patterns (explorer, deep_diver, conversationalist)
   - Content interaction heatmaps
   - Focus states and reading detection
   - Section memory and navigation trails

### File Organization

```
├── index.html          # Main HTML with critical inline styles
├── css/               # Modular CSS files
│   ├── base.css       # Base styles and resets
│   ├── theme-consolidated.css # Theme system (dark/light)
│   ├── hero.css       # Hero section and 3D effects
│   ├── particles.css  # Particle system styles
│   ├── sections.css   # General section styles
│   ├── work.css       # Work portfolio styles
│   ├── labs.css       # Labs section styles
│   ├── bot.css        # Chat bot interface
│   └── ...            # Other component styles
└── js/                # Modular JavaScript
    ├── config.js      # Global configuration
    ├── state.js       # Central state management
    ├── sections.js    # Content loading system
    ├── particles.js   # Particle animation engine
    ├── theme.js       # Theme management
    ├── navigation.js  # Navigation system
    ├── chat.js        # Chat bot functionality
    └── ...            # Other modules
```

### Initialization Flow

1. DOM ready → Initialize core systems (Config, State, Theme)
2. Load particle system and begin animation
3. **Critical**: Load all sections via `Sections.init()`
4. Initialize additional modules (Chat, Navigation, Mobile enhancements)
5. Set up 3D effects and interactions

### Performance Considerations

- Adaptive particle count based on device capabilities
- Frame skipping on mobile devices
- Automatic cleanup and memory management
- Performance monitoring via `perf-monitor` element
- Idle detection to reduce animation overhead

### Mobile Optimizations

- Touch-based 3D tilt effects for hero card
- Reduced particle counts and connection radii
- Snap scrolling between sections
- Safe area handling for iOS devices
- Optimized interaction patterns

## Development Notes

- All modules use global namespace pattern (window.ModuleName)
- Heavy use of glassmorphism and backdrop-filter effects
- Particle system is the visual centerpiece - handle with care
- Section loading is critical - failures have fallback content
- Theme system supports both dark and light modes with smooth transitions