/**
 * ICH Volume Display Components
 * Provides compact and detailed views of hemorrhage volume and mortality
 */

import { calculateICHVolume, formatVolumeDisplay, VOLUME_THRESHOLDS } from "../../logic/ich-volume-calculator.js";
import { t } from "../../localization/i18n.js";
import { safeSetInnerHTML } from "../../security/html-sanitizer.js";

import { renderBrainVisualization, renderCompactBrainIcon } from "./brain-visualization.js";

/**
 * Render compact volume display for integration into risk cards
 * @param {number} gfapValue - GFAP value in pg/ml
 * @returns {string} HTML for compact volume display
 */
export function renderCompactVolumeDisplay(gfapValue) {
  if (!gfapValue || gfapValue <= 0) {
    return `
      <div class="compact-volume-display">
        <div class="volume-metric">
          ${renderCompactBrainIcon(0, 20)}
          <span class="volume-text">No ICH detected</span>
        </div>
      </div>
    `;
  }

  const volumeResult = calculateICHVolume(gfapValue);

  if (!volumeResult.isValid) {
    return `
      <div class="compact-volume-display error">
        <div class="volume-metric">
          <span class="error-icon">⚠️</span>
          <span class="volume-text">Volume calculation error</span>
        </div>
      </div>
    `;
  }

  const { riskLevel } = volumeResult;
  const thresholdInfo = VOLUME_THRESHOLDS[riskLevel];

  return `
    <div class="compact-volume-display ${riskLevel}">
      <div class="volume-metric">
        ${renderCompactBrainIcon(volumeResult.volume, 22)}
        <div class="volume-details">
          <div class="volume-primary">
            <span class="volume-label">ICH Volume:</span>
            <span class="volume-value" style="color: ${thresholdInfo.color}">
              ${formatVolumeDisplay(volumeResult.volume)}
            </span>
          </div>
          <div class="volume-secondary">
            <span class="mortality-label">30-day Mortality:</span>
            <span class="mortality-value">${volumeResult.mortalityRate}</span>
          </div>
        </div>
      </div>
      ${riskLevel === "critical" ? `
        <div class="volume-warning">
          <span class="warning-icon">⚠️</span>
          <span class="warning-text">Volume ≥30ml threshold</span>
        </div>
      ` : ""}
    </div>
  `;
}

/**
 * Render detailed volume visualization card (expandable)
 * @param {number} gfapValue - GFAP value in pg/ml
 * @param {boolean} expanded - Whether to show full details
 * @returns {string} HTML for detailed volume card
 */
export function renderDetailedVolumeCard(gfapValue, expanded = false) {
  if (!gfapValue || gfapValue <= 0) {
    return `
      <div class="volume-detail-card collapsed">
        <div class="volume-header" onclick="toggleVolumeDetails()">
          <h4>🩸 ICH Volume Analysis</h4>
          <span class="expand-icon">▼</span>
        </div>
        <div class="volume-content">
          <p class="no-volume-message">No GFAP value available for volume calculation</p>
        </div>
      </div>
    `;
  }

  const volumeResult = calculateICHVolume(gfapValue);
  const { riskLevel } = volumeResult;
  const thresholdInfo = VOLUME_THRESHOLDS[riskLevel];

  return `
    <div class="volume-detail-card ${expanded ? "expanded" : "collapsed"} ${riskLevel}">
      <div class="volume-header" onclick="toggleVolumeDetails()">
        <h4>🩸 ICH Volume Analysis</h4>
        <span class="expand-icon">${expanded ? "▲" : "▼"}</span>
      </div>
      
      ${expanded ? `
        <div class="volume-content">
          <!-- Large brain visualization -->
          <div class="brain-container">
            ${renderBrainVisualization(volumeResult.volume, "detailed")}
          </div>
          
          <!-- Volume metrics -->
          <div class="volume-metrics">
            <div class="primary-metric">
              <span class="metric-label">Estimated Volume:</span>
              <span class="metric-value large" style="color: ${thresholdInfo.color}">
                ${formatVolumeDisplay(volumeResult.volume)}
              </span>
            </div>
            
            <div class="confidence-range">
              <span class="range-label">Confidence Range:</span>
              <span class="range-value">
                ${volumeResult.volumeRange.min} - ${volumeResult.volumeRange.max} ml
              </span>
            </div>
            
            <div class="risk-classification">
              <span class="classification-label">Risk Level:</span>
              <span class="classification-value" style="color: ${thresholdInfo.color}">
                ${thresholdInfo.label}
              </span>
            </div>
            
            <div class="mortality-projection">
              <span class="mortality-label">30-day Mortality:</span>
              <span class="mortality-value ${riskLevel}">
                ${volumeResult.mortalityRate}
              </span>
            </div>
          </div>
          
          <!-- Clinical context -->
          <div class="clinical-context">
            <div class="calculation-basis">
              <small class="basis-text">
                ${volumeResult.calculation}
              </small>
            </div>
            
            ${volumeResult.threshold === "SURGICAL" ? `
              <div class="threshold-alert critical">
                <span class="alert-icon">🔴</span>
                <span class="alert-text">Volume exceeds 30ml surgical threshold</span>
              </div>
            ` : volumeResult.threshold === "HIGH_RISK" ? `
              <div class="threshold-alert warning">
                <span class="alert-icon">🟡</span>
                <span class="alert-text">Approaching critical volume threshold</span>
              </div>
            ` : ""}
            
            <div class="research-citation">
              <small class="citation-text">
                Based on Förch et al. GFAP-volume correlation research
              </small>
            </div>
          </div>
        </div>
      ` : `
        <div class="volume-summary">
          <div class="summary-metric">
            ${renderCompactBrainIcon(volumeResult.volume, 28)}
            <span class="summary-volume">${formatVolumeDisplay(volumeResult.volume)}</span>
            <span class="summary-risk" style="color: ${thresholdInfo.color}">
              ${thresholdInfo.label}
            </span>
          </div>
        </div>
      `}
    </div>
  `;
}

/**
 * Render volume indicator for existing ICH risk cards
 * @param {number} gfapValue - GFAP value in pg/ml
 * @returns {string} HTML for volume indicator
 */
export function renderVolumeIndicator(gfapValue) {
  if (!gfapValue || gfapValue <= 0) {
    return "";
  }

  const volumeResult = calculateICHVolume(gfapValue);
  const thresholdInfo = VOLUME_THRESHOLDS[volumeResult.riskLevel];

  return `
    <div class="volume-indicator">
      <div class="volume-row">
        <span class="volume-icon">🩸</span>
        <span class="volume-label">Est. Volume:</span>
        <span class="volume-value" style="color: ${thresholdInfo.color}">
          ${formatVolumeDisplay(volumeResult.volume)}
        </span>
      </div>
      <div class="mortality-row">
        <span class="mortality-icon">📊</span>
        <span class="mortality-label">30-day Mortality:</span>
        <span class="mortality-value">${volumeResult.mortalityRate}</span>
      </div>
    </div>
  `;
}

/**
 * Toggle volume details visibility
 * Called from onclick events
 */
window.toggleVolumeDetails = function () {
  const card = document.querySelector(".volume-detail-card");
  if (card) {
    const isExpanded = card.classList.contains("expanded");

    if (isExpanded) {
      card.classList.remove("expanded");
      card.classList.add("collapsed");
    } else {
      card.classList.remove("collapsed");
      card.classList.add("expanded");
    }

    // Update expand icon
    const icon = card.querySelector(".expand-icon");
    if (icon) {
      icon.textContent = isExpanded ? "▼" : "▲";
    }

    // Re-render content with new state
    const gfapValue = parseFloat(document.querySelector("[name=\"gfap_value\"]")?.value || 0);
    if (gfapValue > 0) {
      try {
        const newContent = renderDetailedVolumeCard(gfapValue, !isExpanded);
        const tempElement = document.createElement("div");
        safeSetInnerHTML(tempElement, newContent);
        if (tempElement.firstElementChild) {
          card.parentNode.replaceChild(tempElement.firstElementChild, card);
        }
      } catch (error) {
        console.error("Volume card toggle sanitization failed:", error);
        // Fallback: just toggle classes without re-rendering
        card.classList.toggle("expanded");
        card.classList.toggle("collapsed");
      }
    }
  }
};

/**
 * Update volume displays when GFAP value changes
 * @param {number} newGfapValue - New GFAP value
 */
export function updateVolumeDisplays(newGfapValue) {
  // Update compact displays
  const compactDisplays = document.querySelectorAll(".compact-volume-display");
  compactDisplays.forEach((display) => {
    try {
      const newContent = renderCompactVolumeDisplay(newGfapValue);
      const tempElement = document.createElement("div");
      safeSetInnerHTML(tempElement, newContent);
      if (tempElement.firstElementChild) {
        display.parentNode.replaceChild(tempElement.firstElementChild, display);
      }
    } catch (error) {
      console.error("Compact display update sanitization failed:", error);
      display.textContent = `Volume: ${newGfapValue} GFAP`;
    }
  });

  // Update volume indicators
  const indicators = document.querySelectorAll(".volume-indicator");
  indicators.forEach((indicator) => {
    const newContent = renderVolumeIndicator(newGfapValue);
    if (newContent) {
      try {
        const tempElement = document.createElement("div");
        safeSetInnerHTML(tempElement, newContent);
        if (tempElement.firstElementChild) {
          indicator.parentNode.replaceChild(tempElement.firstElementChild, indicator);
        }
      } catch (error) {
        console.error("Volume indicator update sanitization failed:", error);
        indicator.textContent = `Volume indicator: ${newGfapValue} GFAP`;
      }
    } else {
      indicator.style.display = "none";
    }
  });

  // Update detailed cards if expanded
  const detailCards = document.querySelectorAll(".volume-detail-card.expanded");
  detailCards.forEach((card) => {
    try {
      const newContent = renderDetailedVolumeCard(newGfapValue, true);
      const tempElement = document.createElement("div");
      safeSetInnerHTML(tempElement, newContent);
      if (tempElement.firstElementChild) {
        card.parentNode.replaceChild(tempElement.firstElementChild, card);
      }
    } catch (error) {
      console.error("Detail card update sanitization failed:", error);
      card.textContent = `ICH Volume Analysis: ${newGfapValue} GFAP`;
    }
  });
}
