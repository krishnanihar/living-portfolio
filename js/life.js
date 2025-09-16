// Life Section JavaScript - Save as js/life.js

// Tab switching
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tab + '-tab').classList.add('active');
}

// Enhanced Interactive Knowledge Graph
class KnowledgeGraph {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.particles = [];
    this.connections = [];
    this.activeNodes = new Set();
    this.connectionBeams = [];
    this.hoveredNode = null;
    this.init();
  }
  
  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    const nodes = [
      { name: 'Systems', x: 0.5, y: 0.2, type: 'book', 
        related: ['Thinking in Systems', 'The Nature of Order', 'Baldur\'s Gate 3'] },
      { name: 'Design', x: 0.2, y: 0.3, type: 'book',
        related: ['The Design of Everyday Things', 'How to Design Programs'] },
      { name: 'Strategy', x: 0.8, y: 0.3, type: 'both',
        related: ['48 Laws of Power', 'Baldur\'s Gate 3', 'Cyberpunk 2077'] },
      { name: 'Narrative', x: 0.3, y: 0.5, type: 'both',
        related: ['Gödel, Escher, Bach', 'Detroit: Become Human', 'Red Dead Redemption 2'] },
      { name: 'Mechanics', x: 0.7, y: 0.5, type: 'game',
        related: ['Portal 2', 'Half-Life: Alyx', 'How to Design Programs'] },
      { name: 'World Building', x: 0.2, y: 0.7, type: 'both',
        related: ['The Nature of Order', 'Cyberpunk 2077', 'Red Dead Redemption 2'] },
      { name: 'Experience', x: 0.5, y: 0.7, type: 'both',
        related: ['The Design of Everyday Things', 'Half-Life: Alyx', 'Detroit: Become Human'] },
      { name: 'Immersion', x: 0.8, y: 0.7, type: 'game',
        related: ['Half-Life: Alyx', 'Red Dead Redemption 2', 'Detroit: Become Human'] }
    ];
    
    nodes.forEach((node, i) => {
      this.nodes.push({
        id: i,
        name: node.name,
        type: node.type,
        related: node.related,
        x: node.x * this.canvas.width,
        y: node.y * this.canvas.height,
        baseX: node.x,
        baseY: node.y,
        pulsePhase: Math.random() * Math.PI * 2,
        radius: 10,
        active: false
      });
    });
    
    this.connections = [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 7], 
      [5, 6], [6, 7], [1, 6], [2, 6], [3, 4], [0, 6]
    ];
    
    this.canvas.addEventListener('click', (e) => this.handleNodeClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleNodeHover(e));
    
    this.animate();
  }
  
  handleNodeClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.nodes.forEach(node => {
      const dist = Math.hypot(x - node.x, y - node.y);
      if (dist < node.radius + 10) {
        this.highlightRelatedCards(node.related);
        this.pulseNode(node);
      }
    });
  }
  
  handleNodeHover(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.hoveredNode = null;
    this.nodes.forEach(node => {
      const dist = Math.hypot(x - node.x, y - node.y);
      if (dist < node.radius + 10) {
        this.hoveredNode = node;
        this.canvas.style.cursor = 'pointer';
      }
    });
    
    if (!this.hoveredNode) {
      this.canvas.style.cursor = 'default';
    }
  }
  
  highlightRelatedCards(relatedTitles) {
    document.querySelectorAll('.card').forEach(card => {
      const title = card.querySelector('h3').textContent;
      if (relatedTitles.includes(title)) {
        card.style.borderColor = 'var(--mood-reading)';
        card.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.4)';
        card.style.transform = 'translateY(-6px) scale(1.02)';
        
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
          card.style.transform = '';
        }, 2000);
      }
    });
  }
  
  pulseNode(node) {
    node.active = true;
    node.activePulse = 0;
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      this.particles.push({
        x: node.x,
        y: node.y,
        vx: Math.cos(angle) * 2,
        vy: Math.sin(angle) * 2,
        life: 1,
        color: 'rgba(16, 185, 129, 0.8)'
      });
    }
    
    setTimeout(() => {
      node.active = false;
    }, 1000);
  }
  
  highlightNodes(concepts) {
    this.activeNodes.clear();
    this.nodes.forEach(node => {
      if (concepts.includes(node.name)) {
        this.activeNodes.add(node.id);
        this.pulseNode(node);
      }
    });
  }
  
  createBeam(fromCard, toNode) {
    const cardRect = fromCard.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    
    const beam = {
      fromX: cardRect.left + cardRect.width / 2 - canvasRect.left,
      fromY: cardRect.top + cardRect.height / 2 - canvasRect.top,
      toX: toNode.x,
      toY: toNode.y,
      progress: 0,
      life: 1
    };
    
    this.connectionBeams.push(beam);
  }
  
  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => {
        node.x = node.baseX * this.canvas.width;
        node.y = node.baseY * this.canvas.height;
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = Date.now() * 0.001;
    
    // Draw connections
    this.connections.forEach(([from, to]) => {
      const fromNode = this.nodes[from];
      const toNode = this.nodes[to];
      
      const isActive = this.activeNodes.has(from) || this.activeNodes.has(to);
      this.ctx.strokeStyle = isActive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.2)';
      this.ctx.lineWidth = isActive ? 2 : 1;
      this.ctx.beginPath();
      this.ctx.moveTo(fromNode.x, fromNode.y);
      this.ctx.lineTo(toNode.x, toNode.y);
      this.ctx.stroke();
    });
    
    // Draw connection beams
    this.connectionBeams = this.connectionBeams.filter(beam => {
      beam.progress += 0.05;
      beam.life -= 0.02;
      
      if (beam.life <= 0) return false;
      
      const x = beam.fromX + (beam.toX - beam.fromX) * Math.min(1, beam.progress);
      const y = beam.fromY + (beam.toY - beam.fromY) * Math.min(1, beam.progress);
      
      this.ctx.globalAlpha = beam.life;
      this.ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
      
      return true;
    });
    
    this.ctx.globalAlpha = 1;
    
    // Create random particles
    if (Math.random() < 0.03 && this.particles.length < 20) {
      const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      this.particles.push({
        from: this.nodes[conn[0]],
        to: this.nodes[conn[1]],
        progress: 0,
        speed: 0.01 + Math.random() * 0.01
      });
    }
    
    // Update particles
    this.particles = this.particles.filter(p => {
      if (p.from && p.to) {
        p.progress += p.speed;
        if (p.progress >= 1) return false;
        
        const x = p.from.x + (p.to.x - p.from.x) * p.progress;
        const y = p.from.y + (p.to.y - p.from.y) * p.progress;
        
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
        this.ctx.globalAlpha = 1 - p.progress * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= 0.02;
        
        if (p.life <= 0) return false;
        
        this.ctx.fillStyle = p.color || 'rgba(16, 185, 129, 0.8)';
        this.ctx.globalAlpha = p.life;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      return true;
    });
    
    this.ctx.globalAlpha = 1;
    
    // Draw nodes
    this.nodes.forEach(node => {
      node.pulsePhase += 0.02;
      
      if (node.active) {
        node.activePulse = (node.activePulse || 0) + 0.1;
      }
      
      const basePulse = Math.sin(node.pulsePhase) * 2;
      const activePulse = node.active ? Math.sin(node.activePulse) * 5 : 0;
      const hoverScale = this.hoveredNode === node ? 3 : 0;
      const pulseSize = node.radius + basePulse + activePulse + hoverScale;
      
      const glow = this.ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, pulseSize * 2
      );
      
      const intensity = node.active ? 0.8 : this.hoveredNode === node ? 0.6 : 0.4;
      glow.addColorStop(0, `rgba(16, 185, 129, ${intensity})`);
      glow.addColorStop(0.5, `rgba(16, 185, 129, ${intensity * 0.5})`);
      glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = node.active ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseSize * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
      
      const labelOpacity = this.hoveredNode === node ? 1 : 0.6;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${labelOpacity})`;
      this.ctx.font = this.hoveredNode === node ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'bottom';
      this.ctx.fillText(node.name, node.x, node.y - pulseSize - 5);
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Global graph instance
let knowledgeGraph = null;

// Enhanced Thought Stream
class ThoughtStream {
  constructor(container) {
    this.container = container;
    this.thoughts = [
      "Games teach us systems thinking...",
      "Every book is a conversation across time...",
      "Stories shape how we see the world...",
      "Mechanics become metaphors...",
      "Reading builds empathy...",
      "Play is research...",
      "Knowledge compounds...",
      "Interfaces tell stories..."
    ];
    this.contextualThoughts = [];
    this.start();
  }
  
  start() {
    setInterval(() => this.showThought(), 5000);
    this.showThought();
  }
  
  showThought(customThought = null) {
    const thought = customThought || 
                   (this.contextualThoughts.length > 0 ? 
                    this.contextualThoughts.shift() : 
                    this.thoughts[Math.floor(Math.random() * this.thoughts.length)]);
    
    const el = document.createElement('div');
    el.className = 'floating-thought';
    el.textContent = thought;
    
    this.container.appendChild(el);
    
    setTimeout(() => el.classList.add('visible'), 10);
    
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 800);
    }, 4000);
  }
  
  addContextualThought(thought) {
    this.contextualThoughts.push(thought);
  }
}

let thoughtStream = null;

// Initialize Life Section
function initializeLife() {
  const graphCanvas = document.getElementById('knowledgeGraph');
  if (graphCanvas) {
    knowledgeGraph = new KnowledgeGraph(graphCanvas);
  }
  
  const thoughtContainer = document.getElementById('thoughtStream');
  if (thoughtContainer) {
    thoughtStream = new ThoughtStream(thoughtContainer);
  }
  
  // Enhanced Card interactions
  document.querySelectorAll('#reading .card').forEach(card => {
    const title = card.querySelector('h3').textContent;
    const type = card.dataset.type;
    
    const conceptMap = {
      'Gödel, Escher, Bach': ['Narrative', 'Systems'],
      'The Design of Everyday Things': ['Design', 'Experience'],
      'How to Design Programs': ['Design', 'Mechanics'],
      'The Nature of Order': ['Systems', 'World Building'],
      'Designing Data-Intensive Applications': ['Systems', 'Design'],
      'Thinking in Systems': ['Systems'],
      '48 Laws of Power': ['Strategy'],
      'Baldur\'s Gate 3': ['Strategy', 'Systems', 'Narrative'],
      'Cyberpunk 2077': ['World Building', 'Strategy', 'Immersion'],
      'Half-Life: Alyx': ['Mechanics', 'Experience', 'Immersion'],
      'Detroit: Become Human': ['Narrative', 'Experience', 'Immersion'],
      'Red Dead Redemption 2': ['World Building', 'Narrative', 'Immersion'],
      'Portal 2': ['Mechanics', 'Design']
    };
    
    card.addEventListener('mouseenter', () => {
      const concepts = conceptMap[title] || [];
      if (knowledgeGraph && concepts.length > 0) {
        knowledgeGraph.highlightNodes(concepts);
        
        concepts.forEach(concept => {
          const node = knowledgeGraph.nodes.find(n => n.name === concept);
          if (node) {
            knowledgeGraph.createBeam(card, node);
          }
        });
      }
      
      if (thoughtStream && type === 'book') {
        thoughtStream.addContextualThought(`"${title}" connects to ${concepts.join(' and ')}...`);
      } else if (thoughtStream && type === 'game') {
        thoughtStream.addContextualThought(`Playing "${title}" explores ${concepts.join(' and ')}...`);
      }
      
      if (window.Particles && typeof window.Particles.createBurst === 'function') {
        const rect = card.getBoundingClientRect();
        Particles.createBurst(
          rect.left + rect.width/2, 
          rect.top + rect.height/2,
          'rgba(16, 185, 129, 0.6)'
        );
      }
    });
    
    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (knowledgeGraph) {
          knowledgeGraph.activeNodes.clear();
        }
      }, 500);
    });
    
    card.addEventListener('click', () => {
      if (window.State) {
        State.interactionPatterns.deep_diver++;
      }
      
      const concepts = conceptMap[title] || [];
      if (knowledgeGraph && concepts.length > 0) {
        concepts.forEach(concept => {
          const node = knowledgeGraph.nodes.find(n => n.name === concept);
          if (node) {
            knowledgeGraph.pulseNode(node);
          }
        });
      }
    });
  });
}

// Export for use
window.initializeLife = initializeLife;
