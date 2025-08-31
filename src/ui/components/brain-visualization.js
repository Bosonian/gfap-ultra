/**
 * Brain Visualization Component for ICH Volume Display
 * Creates an SVG-based brain hemorrhage visualization
 */

import { calculateHemorrhageSizePercent, getVolumeColor, calculateICHVolume, formatVolumeDisplay } from '../../logic/ich-volume-calculator.js';

/**
 * Render brain visualization with hemorrhage overlay
 * @param {number} volume - ICH volume in ml
 * @param {string} size - 'compact' or 'detailed'
 * @returns {string} HTML string with SVG brain visualization
 */
export function renderBrainVisualization(volume, size = 'compact') {
  const dimensions = size === 'compact' ? { width: 120, height: 120 } : { width: 200, height: 200 };
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  // Calculate hemorrhage appearance
  const hemorrhagePercent = calculateHemorrhageSizePercent(volume);
  const hemorrhageColor = getVolumeColor(volume);
  
  // Scale hemorrhage radius based on volume (basal ganglia region, slightly off-center)
  const maxRadius = dimensions.width * 0.25; // Maximum 25% of brain width
  const hemorrhageRadius = (hemorrhagePercent / 70) * maxRadius; // 70% is max brain area
  
  // Position hemorrhage in basal ganglia region (slightly right of center)
  const hemorrhageX = centerX + (dimensions.width * 0.1); // 10% right of center
  const hemorrhageY = centerY + (dimensions.height * 0.05); // 5% below center
  
  // 30ml reference circle (for detailed view)
  const referenceRadius = (40 / 70) * maxRadius; // 40% brain area = 30ml threshold
  
  // Animation for hemorrhage (subtle pulsing)
  const animationId = `hemorrhage-pulse-${Math.random().toString(36).substr(2, 9)}`;
  
  return `
    <div class="brain-visualization ${size}">
      <svg 
        width="${dimensions.width}" 
        height="${dimensions.height}" 
        viewBox="0 0 ${dimensions.width} ${dimensions.height}"
        class="brain-svg"
        role="img"
        aria-label="Brain hemorrhage visualization showing ${volume.toFixed(1)}ml ICH volume"
      >
        <!-- Brain outline with hemorrhage overlay -->
        ${renderBrainOutlineWithHemorrhage(dimensions, volume)}
        
        <!-- 30ml reference indicator (detailed view only) -->
        ${size === 'detailed' && volume > 0 ? `
          <circle 
            cx="${hemorrhageX}" 
            cy="${hemorrhageY}" 
            r="${referenceRadius}"
            fill="none" 
            stroke="#9ca3af" 
            stroke-width="1" 
            stroke-dasharray="3,3"
            opacity="0.5"
          />
          <text 
            x="${hemorrhageX + referenceRadius + 5}" 
            y="${hemorrhageY - referenceRadius}" 
            font-size="10" 
            fill="#6b7280"
            font-family="system-ui"
          >30ml</text>
        ` : ''}
        
        <!-- Hemorrhage visualization -->
        ${volume > 0 ? `
          <circle 
            cx="${hemorrhageX}" 
            cy="${hemorrhageY}" 
            r="${hemorrhageRadius}"
            fill="${hemorrhageColor}"
            opacity="0.8"
            class="hemorrhage-circle"
          >
            <!-- Subtle pulsing animation -->
            <animate 
              attributeName="opacity" 
              values="0.6;0.9;0.6" 
              dur="2.5s" 
              repeatCount="indefinite"
            />
            ${hemorrhageRadius > 15 ? `
            <animate 
              attributeName="r" 
              values="${hemorrhageRadius * 0.95};${hemorrhageRadius};${hemorrhageRadius * 0.95}" 
              dur="2.5s" 
              repeatCount="indefinite"
            />
            ` : ''}
          </circle>
          
          <!-- Volume label (detailed view only) -->
          ${size === 'detailed' ? `
            <text 
              x="${centerX}" 
              y="${dimensions.height - 10}" 
              text-anchor="middle" 
              font-size="12" 
              font-weight="bold"
              fill="#374151"
              font-family="system-ui"
            >${volume < 1 ? '<1' : volume.toFixed(1)} ml</text>
          ` : ''}
        ` : ''}
        
        <style>
          .hemorrhage-circle {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          }
        </style>
      </svg>
    </div>
  `;
}

/**
 * Load and render the provided brain SVG with hemorrhage overlay
 * @param {object} dimensions - Width and height for the brain
 * @returns {string} Brain SVG with embedded hemorrhage visualization
 */
function renderBrainOutlineWithHemorrhage(dimensions, volume) {
  // For performance, we'll use the SVG as a background image and overlay the hemorrhage
  // This avoids loading the 530KB SVG content directly into the DOM
  
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  // Calculate hemorrhage position (basal ganglia region - slightly right and posterior)
  const hemorrhageX = centerX + (dimensions.width * 0.08); // 8% right of center  
  const hemorrhageY = centerY + (dimensions.height * 0.03); // 3% below center
  
  const hemorrhagePercent = calculateHemorrhageSizePercent(volume);
  const hemorrhageColor = getVolumeColor(volume);
  const maxRadius = dimensions.width * 0.25;
  const hemorrhageRadius = (hemorrhagePercent / 70) * maxRadius;
  
  return `
    <!-- 3D Brain image as background -->
    <image 
      x="0" 
      y="0" 
      width="${dimensions.width}" 
      height="${dimensions.height}"
      href="./src/assets/brain-3d.png"
      opacity="0.95"
      preserveAspectRatio="xMidYMid meet"
    />
    
    <!-- Hemorrhage overlay in basal ganglia region -->
    ${volume > 0 ? `
      <circle 
        cx="${hemorrhageX}" 
        cy="${hemorrhageY}" 
        r="${hemorrhageRadius}"
        fill="${hemorrhageColor}"
        opacity="0.85"
        class="hemorrhage-circle"
      >
        <!-- Subtle pulsing animation -->
        <animate 
          attributeName="opacity" 
          values="0.7;0.95;0.7" 
          dur="2.5s" 
          repeatCount="indefinite"
        />
        ${hemorrhageRadius > 8 ? `
        <animate 
          attributeName="r" 
          values="${hemorrhageRadius * 0.96};${hemorrhageRadius * 1.02};${hemorrhageRadius * 0.96}" 
          dur="2.5s" 
          repeatCount="indefinite"
        />
        ` : ''}
      </circle>
      
      <!-- Hemorrhage center highlight -->
      <circle 
        cx="${hemorrhageX}" 
        cy="${hemorrhageY}" 
        r="${hemorrhageRadius * 0.3}"
        fill="${hemorrhageColor}"
        opacity="0.95"
        class="hemorrhage-center"
      />
    ` : ''}
  `;
}

/**
 * Temporary brain outline (for fallback when SVG file not available)
 */
function renderTemporaryBrainOutline(dimensions) {
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  return `
    <!-- Simplified brain outline -->
    <ellipse 
      cx="${centerX}" 
      cy="${centerY}" 
      rx="${dimensions.width * 0.4}" 
      ry="${dimensions.height * 0.35}" 
      fill="#f1f5f9" 
      stroke="#64748b" 
      stroke-width="2"
      opacity="0.8"
    />
    
    <!-- Brain hemisphere division -->
    <line 
      x1="${centerX}" 
      y1="${centerY - dimensions.height * 0.25}" 
      x2="${centerX}" 
      y2="${centerY + dimensions.height * 0.25}" 
      stroke="#9ca3af" 
      stroke-width="1" 
      opacity="0.5"
    />
  `;
}

/**
 * Create compact brain icon for inline display
 * @param {number} volume - ICH volume in ml
 * @param {number} size - Icon size in pixels
 * @returns {string} Small brain icon with hemorrhage indicator
 */
export function renderCompactBrainIcon(volume, size = 24) {
  const hemorrhageColor = getVolumeColor(volume);
  const hemorrhageSize = volume > 0 ? Math.max(2, (volume / 50) * size * 0.3) : 0;
  
  return `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 ${size} ${size}"
      class="brain-icon"
      style="display: inline-block; vertical-align: middle;"
    >
      <!-- Simple brain outline -->
      <ellipse 
        cx="${size/2}" 
        cy="${size/2}" 
        rx="${size*0.4}" 
        ry="${size*0.35}" 
        fill="#f1f5f9" 
        stroke="#64748b" 
        stroke-width="1"
      />
      
      <!-- Hemorrhage indicator -->
      ${volume > 0 ? `
        <circle 
          cx="${size/2 + size*0.1}" 
          cy="${size/2}" 
          r="${hemorrhageSize}"
          fill="${hemorrhageColor}"
          opacity="0.9"
        />
      ` : ''}
    </svg>
  `;
}

/**
 * Render circular brain display matching ICH risk circle style
 * @param {number} volume - ICH volume in ml
 * @returns {string} HTML for circular brain display
 */
export function renderCircularBrainDisplay(volume) {
  if (!volume || volume <= 0) {
    return `
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0 ml</div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;
  }
  
  const formattedVolume = formatVolumeDisplay(volume);
  const canvasId = `volume-canvas-${Math.random().toString(36).substr(2, 9)}`;
  
  return `
    <div class="volume-circle" data-volume="${volume}">
      <div class="volume-number">${formattedVolume}</div>
      <canvas id="${canvasId}" class="volume-canvas" width="120" height="120" 
              data-volume="${volume}" data-canvas-id="${canvasId}"></canvas>
    </div>
  `;
}

/**
 * Initialize fluid fill animation for volume canvas
 * Call this after DOM is updated with new volume circles
 */
export function initializeVolumeAnimations() {
  const canvases = document.querySelectorAll('.volume-canvas');
  
  canvases.forEach(canvas => {
    const volume = parseFloat(canvas.dataset.volume) || 0;
    if (volume > 0) {
      drawVolumeFluid(canvas, volume);
    }
  });
}

/**
 * Draw fluid fill animation on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} volume - ICH volume in ml
 */
function drawVolumeFluid(canvas, volume) {
  const ctx = canvas.getContext('2d');
  const centerX = 60;
  const centerY = 60;
  const radius = 54;
  let animationFrame = 0;
  
  // Wave parameters for subtle animation
  const waves = [
    { amplitude: 3, frequency: 0.03, speed: 0.02, phase: 0, opacity: 0.4 },
    { amplitude: 2, frequency: 0.04, speed: 0.03, phase: Math.PI / 3, opacity: 0.3 }
  ];
  
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw brain background image
    const brain = new Image();
    brain.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(brain, 6, 6, 108, 108);
      ctx.restore();
      
      // Continue with fluid rendering after brain loads
      drawFluid();
    };
    brain.src = './src/assets/brain-3d.png';
    
    // If brain doesn't load, draw fluid anyway
    setTimeout(drawFluid, 50);
  }
  
  function drawFluid() {
    // Calculate fill level (volume as percentage of max visible area)
    const maxVolume = 100; // ml
    const fillPercentage = Math.min(volume / maxVolume, 0.8); // Max 80% fill
    const fillLevel = centerY + radius - (fillPercentage * radius * 2);
    
    // Set up clipping for circular container
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
    ctx.clip();
    
    // Draw animated fluid waves
    const color = '#dc2626'; // Always red
    
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.globalAlpha = wave.opacity;
      
      // Draw wave line
      for (let x = centerX - radius; x <= centerX + radius; x += 2) {
        const relX = x - (centerX - radius);
        const waveY = fillLevel + 
          Math.sin((relX * wave.frequency) + animationFrame * wave.speed + wave.phase) * 
          wave.amplitude;
        
        // Check if point is within circle
        const dx = x - centerX;
        const dy = waveY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= radius - 2) {
          if (x === centerX - radius + 2) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
      }
      
      // Complete fill area to bottom of circle
      for (let x = centerX + radius; x >= centerX - radius; x -= 2) {
        const dx = x - centerX;
        const maxY = Math.sqrt((radius - 2) * (radius - 2) - dx * dx);
        if (!isNaN(maxY)) {
          const bottomY = centerY + maxY;
          ctx.lineTo(x, bottomY);
        }
      }
      
      ctx.closePath();
      ctx.fill();
    });
    
    ctx.restore();
    
    // Draw circle border
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Glass effect
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    const gradient = ctx.createLinearGradient(centerX, centerY - radius, centerX, centerY + radius);
    gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    
    // Continue animation
    animationFrame += 0.03;
    requestAnimationFrame(draw);
  }
  
  draw();
}

/**
 * Get brain visualization CSS classes
 * @param {string} size - 'compact' or 'detailed'
 * @returns {string} CSS classes
 */
export function getBrainVisualizationClasses(size) {
  const baseClasses = 'brain-visualization';
  const sizeClasses = size === 'compact' ? 'compact-brain' : 'detailed-brain';
  return `${baseClasses} ${sizeClasses}`;
}