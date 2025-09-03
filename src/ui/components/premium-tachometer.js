/**
 * Premium Diagnostic Gauge - Vanilla JS Implementation
 * Inspired by premium automotive gauges with medical-grade precision
 */

class PremiumDiagnosticGauge {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas element ${canvasId} not found`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.currentNeedle = 0.5; // Start at center
    this.targetNeedle = 0.5;
    this.needleVelocity = 0;
    
    // Configuration
    this.options = {
      lvoProb: 0,
      ichProb: 0,
      ...options
    };
    
    this.setupCanvas();
    this.startAnimation();
  }
  
  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.width = rect.width || 400;
    this.height = rect.height || 400;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.centerX = this.width / 2;
    this.centerY = this.width / 2;
    this.radius = this.width * 0.40; // Slightly smaller for mobile
    
    // Check if mobile
    this.isMobile = this.width < 400;
  }
  
  drawBackground() {
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Dark background circle with subtle gradient
    const bgGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.radius + 20
    );
    bgGradient.addColorStop(0, 'rgba(15, 20, 25, 0.8)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius + 15, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawScale() {
    const ctx = this.ctx;
    const startAngle = -225 * Math.PI / 180; // Start angle in radians
    const endAngle = 45 * Math.PI / 180;     // End angle in radians
    const totalAngle = endAngle - startAngle;
    
    // Main track - very subtle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = this.isMobile ? 1 : 2;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
    ctx.stroke();
    
    // Color zones - medical grade precision
    const zones = [
      { start: 0, end: 0.2, color: 'rgba(255, 68, 68, 0.7)', label: 'ICH' },      // Strong ICH
      { start: 0.2, end: 0.35, color: 'rgba(255, 68, 68, 0.4)', label: '' },     // ICH lean
      { start: 0.35, end: 0.65, color: 'rgba(255, 165, 0, 0.4)', label: '' },    // Balanced
      { start: 0.65, end: 0.8, color: 'rgba(0, 168, 255, 0.4)', label: '' },     // LVO lean
      { start: 0.8, end: 1.0, color: 'rgba(0, 168, 255, 0.7)', label: 'LVO' }    // Strong LVO
    ];
    
    zones.forEach(zone => {
      const start = startAngle + (zone.start * totalAngle);
      const end = startAngle + (zone.end * totalAngle);
      
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = this.isMobile ? 6 : 8;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.radius - 8, start, end);
      ctx.stroke();
    });
    
    // Precision tick marks
    const tickCount = this.isMobile ? 50 : 100;
    for (let i = 0; i <= tickCount; i++) {
      const progress = i / tickCount;
      const angle = startAngle + (progress * totalAngle);
      const isMajor = i % (this.isMobile ? 10 : 20) === 0;
      const isMinor = i % (this.isMobile ? 5 : 10) === 0;
      
      const innerRadius = this.radius - (isMajor ? 12 : isMinor ? 8 : 5);
      const outerRadius = this.radius;
      
      ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.8)' : 
                       isMinor ? 'rgba(255, 255, 255, 0.4)' : 
                                'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = isMajor ? 2 : 1;
      
      ctx.beginPath();
      ctx.moveTo(
        this.centerX + Math.cos(angle) * innerRadius,
        this.centerY + Math.sin(angle) * innerRadius
      );
      ctx.lineTo(
        this.centerX + Math.cos(angle) * outerRadius,
        this.centerY + Math.sin(angle) * outerRadius
      );
      ctx.stroke();
    }
    
    // Scale numbers - clean and minimal
    const scaleNumbers = [
      { value: '0.5', pos: 0.0 },
      { value: '1.0', pos: 0.5 },
      { value: '2.0', pos: 1.0 }
    ];
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `600 ${this.isMobile ? 10 : 11}px Inter, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    scaleNumbers.forEach(num => {
      const angle = startAngle + (num.pos * totalAngle);
      const radius = this.radius - (this.isMobile ? 25 : 30);
      
      ctx.fillText(
        num.value,
        this.centerX + Math.cos(angle) * radius,
        this.centerY + Math.sin(angle) * radius
      );
    });
    
    // Zone labels - medical clarity
    ctx.font = `500 ${this.isMobile ? 9 : 10}px Inter, -apple-system, sans-serif`;
    
    // ICH label
    ctx.fillStyle = '#ff4444';
    const ichAngle = startAngle + (0.1 * totalAngle);
    const ichRadius = this.radius - (this.isMobile ? 45 : 50);
    ctx.fillText(
      'ICH',
      this.centerX + Math.cos(ichAngle) * ichRadius,
      this.centerY + Math.sin(ichAngle) * ichRadius
    );
    
    // LVO label
    ctx.fillStyle = '#00a8ff';
    const lvoAngle = startAngle + (0.9 * totalAngle);
    const lvoRadius = this.radius - (this.isMobile ? 45 : 50);
    ctx.fillText(
      'LVO',
      this.centerX + Math.cos(lvoAngle) * lvoRadius,
      this.centerY + Math.sin(lvoAngle) * lvoRadius
    );
    
    // Critical thresholds - precision markers
    const thresholds = [
      { ratio: 0.77, label: 'ICH dom', pos: this.ratioToPosition(0.77) },
      { ratio: 1.30, label: 'LVO dom', pos: this.ratioToPosition(1.30) }
    ];
    
    ctx.font = `500 ${this.isMobile ? 8 : 9}px Inter, -apple-system, sans-serif`;
    thresholds.forEach(th => {
      const angle = startAngle + (th.pos * totalAngle);
      const innerRadius = this.radius - 2;
      const outerRadius = this.radius + (this.isMobile ? 8 : 10);
      
      // Threshold line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        this.centerX + Math.cos(angle) * innerRadius,
        this.centerY + Math.sin(angle) * innerRadius
      );
      ctx.lineTo(
        this.centerX + Math.cos(angle) * outerRadius,
        this.centerY + Math.sin(angle) * outerRadius
      );
      ctx.stroke();
      
      // Threshold label
      if (!this.isMobile) { // Skip labels on very small screens
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const labelRadius = this.radius + 20;
        ctx.fillText(
          th.label,
          this.centerX + Math.cos(angle) * labelRadius,
          this.centerY + Math.sin(angle) * labelRadius
        );
      }
    });
  }
  
  drawNeedle() {
    const ctx = this.ctx;
    
    // Physics-based smooth animation
    const springStrength = 0.08;
    const damping = 0.7;
    
    const force = (this.targetNeedle - this.currentNeedle) * springStrength;
    this.needleVelocity += force;
    this.needleVelocity *= damping;
    this.currentNeedle += this.needleVelocity;
    
    // Calculate needle angle
    const startAngle = -225;
    const totalAngle = 270;
    const angle = startAngle + (this.currentNeedle * totalAngle);
    const angleRad = angle * Math.PI / 180;
    const needleLength = this.radius - (this.isMobile ? 15 : 20);
    
    // Needle color based on position - medical significance
    let needleColor;
    if (this.currentNeedle < 0.35) {
      needleColor = '#ff4444'; // ICH dominant
    } else if (this.currentNeedle > 0.65) {
      needleColor = '#00a8ff'; // LVO dominant
    } else {
      needleColor = '#ffa500'; // Balanced/uncertain
    }
    
    // Needle shadow for premium feel
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = this.isMobile ? 6 : 8;
    ctx.shadowOffsetY = 1;
    
    // Main needle - precision instrument style
    ctx.strokeStyle = needleColor;
    ctx.lineWidth = this.isMobile ? 2.5 : 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(
      this.centerX - Math.cos(angleRad) * 15,
      this.centerY - Math.sin(angleRad) * 15
    );
    ctx.lineTo(
      this.centerX + Math.cos(angleRad) * needleLength,
      this.centerY + Math.sin(angleRad) * needleLength
    );
    ctx.stroke();
    
    // Needle tip - precision point
    ctx.fillStyle = needleColor;
    ctx.beginPath();
    ctx.arc(
      this.centerX + Math.cos(angleRad) * needleLength,
      this.centerY + Math.sin(angleRad) * needleLength,
      this.isMobile ? 2.5 : 3, 0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.restore();
    
    // Center hub - premium instrument look
    const hubSize = this.isMobile ? 10 : 12;
    const hubGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, hubSize
    );
    hubGradient.addColorStop(0, '#444');
    hubGradient.addColorStop(0.8, '#222');
    hubGradient.addColorStop(1, '#111');
    
    ctx.fillStyle = hubGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, hubSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Hub ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Center indicator dot
    ctx.fillStyle = needleColor;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.isMobile ? 2 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ratioToPosition(ratio) {
    // Convert LVO/ICH ratio to needle position (0-1)
    if (ratio <= 0.5) return 0;
    if (ratio >= 2.0) return 1;
    return (ratio - 0.5) / 1.5;
  }
  
  updateValues(lvoProb, ichProb) {
    this.options.lvoProb = lvoProb;
    this.options.ichProb = ichProb;
    
    const ratio = lvoProb / Math.max(ichProb, 1);
    this.targetNeedle = this.ratioToPosition(ratio);
  }
  
  startAnimation() {
    const animate = () => {
      this.drawBackground();
      this.drawScale();
      this.drawNeedle();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  resize() {
    this.setupCanvas();
  }
}

// Export for use in the application
export { PremiumDiagnosticGauge };