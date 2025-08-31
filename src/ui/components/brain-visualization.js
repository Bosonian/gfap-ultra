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
  if (!volume || volume <= 0) return '';
  
  // Calculate hemorrhage position in basal ganglia region
  const hemorrhageX = 60 + 8; // 8px right of center (120px circle)
  const hemorrhageY = 60 + 3; // 3px below center
  
  // Scale hemorrhage radius based on volume
  const hemorrhagePercent = calculateHemorrhageSizePercent(volume);
  const maxRadius = 25; // Maximum radius in 120px circle
  const hemorrhageRadius = Math.max(2, (hemorrhagePercent / 70) * maxRadius);
  
  return `
    <div class="circular-brain-display">
      <div class="brain-circle">
        <svg class="brain-svg-circle" width="120" height="120">
          <!-- 3D Brain background -->
          <defs>
            <clipPath id="brain-clip">
              <circle cx="60" cy="60" r="54"/>
            </clipPath>
          </defs>
          
          <image 
            x="6" y="6" 
            width="108" height="108"
            href="./src/assets/brain-3d.png"
            clip-path="url(#brain-clip)"
            opacity="0.95"
            preserveAspectRatio="xMidYMid meet"
          />
          
          <!-- Brain circle border -->
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-color)" stroke-width="8"/>
          
          <!-- Red hemorrhage dot -->
          <circle 
            cx="${hemorrhageX}" 
            cy="${hemorrhageY}" 
            r="${hemorrhageRadius}"
            fill="#dc2626"
            opacity="0.9"
            class="hemorrhage-dot"
          >
            <animate 
              attributeName="opacity" 
              values="0.7;1;0.7" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        
        <div class="volume-label-overlay">
          ${formatVolumeDisplay(volume)}
        </div>
      </div>
    </div>
  `;
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