/**
 * ICH Volume Integration Helper
 * Provides functions to integrate volume visualization into existing components
 */

import { calculateICHVolume } from '../../logic/ich-volume-calculator.js';
import { renderCompactVolumeDisplay, renderDetailedVolumeCard, renderVolumeIndicator } from './volume-display.js';
import { store } from '../../state/store.js';

/**
 * Get GFAP value from current form data
 * @returns {number} GFAP value or 0 if not available
 */
function getCurrentGfapValue() {
  const state = store.getState();
  const formData = state.formData;
  
  // Check all modules for GFAP value
  for (const module of ['coma', 'limited', 'full']) {
    if (formData[module]?.gfap_value) {
      return parseFloat(formData[module].gfap_value);
    }
  }
  
  return 0;
}

/**
 * Add volume indicator to existing ICH risk card
 * Call this function after rendering ICH risk assessment
 * @param {HTMLElement} ichRiskCard - The ICH risk card element
 */
export function enhanceICHRiskCardWithVolume(ichRiskCard) {
  if (!ichRiskCard) return;
  
  const gfapValue = getCurrentGfapValue();
  if (gfapValue <= 0) return;
  
  // Find the appropriate insertion point (after risk percentage)
  const riskContent = ichRiskCard.querySelector('.risk-content, .card-content');
  if (riskContent) {
    const volumeIndicatorHtml = renderVolumeIndicator(gfapValue);
    if (volumeIndicatorHtml) {
      const volumeElement = document.createElement('div');
      volumeElement.innerHTML = volumeIndicatorHtml;
      riskContent.appendChild(volumeElement.firstElementChild);
    }
  }
}

/**
 * Add detailed volume card to results page
 * @param {HTMLElement} resultsContainer - Container to add volume card to
 * @param {boolean} expanded - Whether to show expanded by default
 */
export function addVolumeCardToResults(resultsContainer, expanded = false) {
  if (!resultsContainer) return;
  
  const gfapValue = getCurrentGfapValue();
  
  // Create volume card HTML
  const volumeCardHtml = renderDetailedVolumeCard(gfapValue, expanded);
  
  // Find insertion point (after risk cards, before hospital routing)
  const riskCards = resultsContainer.querySelector('.risk-cards, .results-grid');
  if (riskCards) {
    const volumeCardElement = document.createElement('div');
    volumeCardElement.innerHTML = volumeCardHtml;
    
    // Insert after risk cards
    riskCards.parentNode.insertBefore(volumeCardElement.firstElementChild, riskCards.nextSibling);
  } else {
    // Fallback: add at the beginning of results
    const volumeCardElement = document.createElement('div');
    volumeCardElement.innerHTML = volumeCardHtml;
    resultsContainer.insertBefore(volumeCardElement.firstElementChild, resultsContainer.firstChild);
  }
}

/**
 * Add compact volume display to summary section
 * @param {HTMLElement} summarySection - Input summary section
 */
export function addCompactVolumeToSummary(summarySection) {
  if (!summarySection) return;
  
  const gfapValue = getCurrentGfapValue();
  if (gfapValue <= 0) return;
  
  const compactVolumeHtml = renderCompactVolumeDisplay(gfapValue);
  
  // Create a new summary module for volume
  const volumeSummaryHtml = `
    <div class="summary-module">
      <h4>ICH Volume Analysis</h4>
      <div class="summary-items">
        ${compactVolumeHtml}
      </div>
    </div>
  `;
  
  const volumeElement = document.createElement('div');
  volumeElement.innerHTML = volumeSummaryHtml;
  summarySection.appendChild(volumeElement.firstElementChild);
}

/**
 * Update all volume displays when GFAP value changes
 * Call this when GFAP input field changes
 * @param {number} newGfapValue - New GFAP value
 */
export function updateAllVolumeDisplays(newGfapValue) {
  
  
  const volumeResult = calculateICHVolume(newGfapValue);
  
  
  // Update compact displays
  const compactDisplays = document.querySelectorAll('.compact-volume-display');
  compactDisplays.forEach(display => {
    const newContent = renderCompactVolumeDisplay(newGfapValue);
    display.outerHTML = newContent;
  });
  
  // Update volume indicators in risk cards
  const indicators = document.querySelectorAll('.volume-indicator');
  indicators.forEach(indicator => {
    const newContent = renderVolumeIndicator(newGfapValue);
    if (newContent) {
      indicator.outerHTML = newContent;
    } else {
      indicator.style.display = 'none';
    }
  });
  
  // Update detailed cards (preserve expanded state)
  const detailCards = document.querySelectorAll('.volume-detail-card');
  detailCards.forEach(card => {
    const isExpanded = card.classList.contains('expanded');
    const newContent = renderDetailedVolumeCard(newGfapValue, isExpanded);
    card.outerHTML = newContent;
  });
}

/**
 * Initialize volume visualization features
 * Call this during app initialization
 */
export function initializeVolumeVisualization() {
  // Add CSS for volume components
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = './src/styles/volume-components.css';
  document.head.appendChild(cssLink);
  
  // Listen for GFAP input changes
  document.addEventListener('input', (event) => {
    if (event.target.name === 'gfap_value') {
      const gfapValue = parseFloat(event.target.value) || 0;
      updateAllVolumeDisplays(gfapValue);
    }
  });
  
  console.log('🧠 ICH Volume Visualization initialized');
}

/**
 * Test the volume integration with sample data
 */
export function testVolumeIntegration() {
  console.log('🧪 Testing ICH Volume Integration:');
  
  const testValues = [100, 500, 1000, 1500, 3000, 5000];
  
  testValues.forEach(gfap => {
    const result = calculateICHVolume(gfap);
    console.log(`GFAP ${gfap}: ${result.displayVolume} (${result.riskLevel}) - ${result.mortalityRate}`);
  });
}