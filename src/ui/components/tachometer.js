/**
 * Tachometer gauge for LVO/ICH ratio visualization
 */

let tachometerAnimation = null;

export function initializeTachometer(ichPercent, lvoPercent) {
  const canvas = document.getElementById('tachometerCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const ratio = lvoPercent / Math.max(ichPercent, 1);
  
  // Scale ratio to needle position (0.5 to 2.0 ratio maps to 0-1 position)
  const needlePosition = Math.min(1, Math.max(0, (ratio - 0.5) / 1.5));
  
  let currentPosition = 0;
  const targetPosition = needlePosition;
  
  const drawTachometer = () => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.8;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gauge arc background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Draw color zones
    const zones = [
      { start: 0, end: 0.33, color: '#ff0040' }, // ICH dominant (red)
      { start: 0.33, end: 0.67, color: '#ffd700' }, // Balanced (yellow)
      { start: 0.67, end: 1, color: '#00d4ff' } // LVO dominant (blue)
    ];
    
    zones.forEach(zone => {
      ctx.beginPath();
      const startAngle = Math.PI + (zone.start * Math.PI);
      const endAngle = Math.PI + (zone.end * Math.PI);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 6;
      ctx.stroke();
    });
    
    // Draw scale marks
    const marks = [0.5, 0.75, 1.0, 1.5, 2.0];
    marks.forEach(mark => {
      const position = (mark - 0.5) / 1.5;
      const angle = Math.PI + (position * Math.PI);
      const x1 = centerX + Math.cos(angle) * (radius - 15);
      const y1 = centerY + Math.sin(angle) * (radius - 15);
      const x2 = centerX + Math.cos(angle) * (radius - 5);
      const y2 = centerY + Math.sin(angle) * (radius - 5);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw mark labels
      const labelX = centerX + Math.cos(angle) * (radius + 15);
      const labelY = centerY + Math.sin(angle) * (radius + 15);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(mark.toString(), labelX, labelY + 4);
    });
    
    // Draw needle
    const needleAngle = Math.PI + (currentPosition * Math.PI);
    const needleLength = radius * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength,
      centerY + Math.sin(needleAngle) * needleLength
    );
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff6b35';
    ctx.fill();
    
    // Draw ratio value in center
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ratio.toFixed(2), centerX, centerY - 20);
    
    // Animate needle to target position
    if (Math.abs(currentPosition - targetPosition) > 0.01) {
      currentPosition += (targetPosition - currentPosition) * 0.05;
      tachometerAnimation = requestAnimationFrame(drawTachometer);
    }
  };
  
  // Start animation
  drawTachometer();
}

export function cleanupTachometer() {
  if (tachometerAnimation) {
    cancelAnimationFrame(tachometerAnimation);
    tachometerAnimation = null;
  }
}