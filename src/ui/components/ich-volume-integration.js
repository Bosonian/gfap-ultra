/**
 * ICH Volume Integration Helper
 * Provides functions to integrate volume visualization into existing components
 */

import { calculateICHVolume } from '../../logic/ich-volume-calculator.js';
import { store } from '../../state/store.js';
import { safeSetInnerHTML } from '../../security/html-sanitizer.js';

import { renderCompactVolumeDisplay, renderDetailedVolumeCard, renderVolumeIndicator } from './volume-display.js';

/**
 * Get GFAP value from current form data
 * @returns {number} GFAP value or 0 if not available
 */
function getCurrentGfapValue() {
  const state = store.getState();
  const { formData } = state;

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
  if (!ichRiskCard) {
    return;
  }

  const gfapValue = getCurrentGfapValue();
  if (gfapValue <= 0) {
    return;
  }

  // Find the appropriate insertion point (after risk percentage)
  const riskContent = ichRiskCard.querySelector('.risk-content, .card-content');
  if (riskContent) {
    const volumeIndicatorHtml = renderVolumeIndicator(gfapValue);
    if (volumeIndicatorHtml) {
      const volumeElement = document.createElement('div');
      try {
        safeSetInnerHTML(volumeElement, volumeIndicatorHtml);
        if (volumeElement.firstElementChild) {
          riskContent.appendChild(volumeElement.firstElementChild);
        }
      } catch (error) {
        console.error('Volume indicator sanitization failed:', error);
        // Create fallback text element
        const fallbackElement = document.createElement('div');
        fallbackElement.textContent = `ICH Volume indicator (GFAP: ${gfapValue})`;
        riskContent.appendChild(fallbackElement);
      }
    }
  }
}

/**
 * Add detailed volume card to results page
 * @param {HTMLElement} resultsContainer - Container to add volume card to
 * @param {boolean} expanded - Whether to show expanded by default
 */
export function addVolumeCardToResults(resultsContainer, expanded = false) {
  if (!resultsContainer) {
    return;
  }

  const gfapValue = getCurrentGfapValue();

  // Create volume card HTML
  const volumeCardHtml = renderDetailedVolumeCard(gfapValue, expanded);

  // Find insertion point (after risk cards, before hospital routing)
  const riskCards = resultsContainer.querySelector('.risk-cards, .results-grid');
  if (riskCards) {
    const volumeCardElement = document.createElement('div');
    try {
      safeSetInnerHTML(volumeCardElement, volumeCardHtml);
      if (volumeCardElement.firstElementChild) {
        // Insert after risk cards
        riskCards.parentNode.insertBefore(volumeCardElement.firstElementChild, riskCards.nextSibling);
      }
    } catch (error) {
      console.error('Volume card sanitization failed:', error);
      // Create fallback element
      const fallbackElement = document.createElement('div');
      fallbackElement.textContent = `ICH Volume Analysis (GFAP: ${gfapValue})`;
      riskCards.parentNode.insertBefore(fallbackElement, riskCards.nextSibling);
    }
  } else {
    // Fallback: add at the beginning of results
    const volumeCardElement = document.createElement('div');
    try {
      safeSetInnerHTML(volumeCardElement, volumeCardHtml);
      if (volumeCardElement.firstElementChild) {
        resultsContainer.insertBefore(volumeCardElement.firstElementChild, resultsContainer.firstChild);
      }
    } catch (error) {
      console.error('Volume card sanitization failed:', error);
      // Create fallback element
      const fallbackElement = document.createElement('div');
      fallbackElement.textContent = `ICH Volume Analysis (GFAP: ${gfapValue})`;
      resultsContainer.insertBefore(fallbackElement, resultsContainer.firstChild);
    }
  }
}

/**
 * Add compact volume display to summary section
 * @param {HTMLElement} summarySection - Input summary section
 */
export function addCompactVolumeToSummary(summarySection) {
  if (!summarySection) {
    return;
  }

  const gfapValue = getCurrentGfapValue();
  if (gfapValue <= 0) {
    return;
  }

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
  try {
    safeSetInnerHTML(volumeElement, volumeSummaryHtml);
    if (volumeElement.firstElementChild) {
      summarySection.appendChild(volumeElement.firstElementChild);
    }
  } catch (error) {
    console.error('Volume summary sanitization failed:', error);
    // Create fallback element
    const fallbackElement = document.createElement('div');
    fallbackElement.className = 'summary-module';
    fallbackElement.textContent = 'ICH Volume Analysis - Volume data unavailable';
    summarySection.appendChild(fallbackElement);
  }
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
  compactDisplays.forEach((display) => {
    try {
      const newContent = renderCompactVolumeDisplay(newGfapValue);
      const tempElement = document.createElement('div');
      safeSetInnerHTML(tempElement, newContent);
      if (tempElement.firstElementChild) {
        display.parentNode.replaceChild(tempElement.firstElementChild, display);
      }
    } catch (error) {
      console.error('Compact display update sanitization failed:', error);
      display.textContent = `Volume: ${newGfapValue} GFAP`;
    }
  });

  // Update volume indicators in risk cards
  const indicators = document.querySelectorAll('.volume-indicator');
  indicators.forEach((indicator) => {
    const newContent = renderVolumeIndicator(newGfapValue);
    if (newContent) {
      try {
        const tempElement = document.createElement('div');
        safeSetInnerHTML(tempElement, newContent);
        if (tempElement.firstElementChild) {
          indicator.parentNode.replaceChild(tempElement.firstElementChild, indicator);
        }
      } catch (error) {
        console.error('Volume indicator update sanitization failed:', error);
        indicator.textContent = `Volume indicator: ${newGfapValue} GFAP`;
      }
    } else {
      indicator.style.display = 'none';
    }
  });

  // Update detailed cards (preserve expanded state)
  const detailCards = document.querySelectorAll('.volume-detail-card');
  detailCards.forEach((card) => {
    const isExpanded = card.classList.contains('expanded');
    const newContent = renderDetailedVolumeCard(newGfapValue, isExpanded);
    try {
      const tempElement = document.createElement('div');
      safeSetInnerHTML(tempElement, newContent);
      if (tempElement.firstElementChild) {
        card.parentNode.replaceChild(tempElement.firstElementChild, card);
      }
    } catch (error) {
      console.error('Detail card update sanitization failed:', error);
      card.textContent = `ICH Volume Analysis: ${newGfapValue} GFAP`;
    }
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

  //('🧠 ICH Volume Visualization initialized');
}

/**
 * Test the volume integration with sample data
 */
export function testVolumeIntegration() {
  //('🧪 Testing ICH Volume Integration:');

  const testValues = [100, 500, 1000, 1500, 3000, 5000];

  testValues.forEach((gfap) => {
    const result = calculateICHVolume(gfap);
    //(`GFAP ${gfap}: ${result.displayVolume} (${result.riskLevel}) - ${result.mortalityRate}`);
  });
}
