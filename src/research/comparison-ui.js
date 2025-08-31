/**
 * Research Comparison UI Components
 * Hidden by default, activated only for research purposes
 */

import { LegacyICHModel } from './legacy-ich-model.js';
import { ResearchDataLogger, isResearchModeEnabled } from './data-logger.js';
import { t } from '../localization/i18n.js';

/**
 * Render research toggle button (subtle, in footer)
 * @returns {string} - HTML for research toggle
 */
export function renderResearchToggle() {
  if (!isResearchModeEnabled()) {
    return '';
  }

  return `
    <div class="research-toggle-container">
      <button id="researchToggle" class="research-toggle" title="Research Mode Active">
        🔬 Research
      </button>
    </div>
  `;
}

/**
 * Render model comparison panel
 * @param {object} mainResults - Main model results
 * @param {object} legacyResults - Legacy model results
 * @param {object} inputs - Patient input data
 * @returns {string} - HTML for comparison panel
 */
export function renderModelComparison(mainResults, legacyResults, inputs) {
  if (!isResearchModeEnabled() || !legacyResults?.isValid) {
    return '';
  }

  const comparison = LegacyICHModel.compareModels(mainResults, legacyResults);
  
  return `
    <div class="research-panel" id="researchPanel" style="display: none;">
      <div class="research-header">
        <h4>🔬 Model Comparison (Research)</h4>
        <button class="close-research" id="closeResearch">×</button>
      </div>
      
      <div class="model-comparison">
        ${renderProbabilityBars(mainResults, legacyResults)}
        ${renderDifferenceAnalysis(comparison)}
        ${renderCalculationDetails(legacyResults, inputs)}
        ${renderModelMetrics()}
      </div>
      
      <div class="research-actions">
        <button id="exportResearchData" class="research-btn">📥 Export Data</button>
        <button id="toggleCalculationDetails" class="research-btn">🧮 Details</button>
        <button id="clearResearchData" class="research-btn danger">🗑️ Clear</button>
      </div>
      
      <div class="research-disclaimer">
        <small>
          ⚠️ <strong>Research Mode Active</strong><br>
          Legacy model: Age + GFAP only (ROC-AUC: 0.789, Recall: 40%)<br>
          For baseline comparison. Main model includes additional clinical factors.
        </small>
      </div>
    </div>
  `;
}

/**
 * Render probability comparison bars
 * @param {object} mainResults - Main model results
 * @param {object} legacyResults - Legacy model results
 * @returns {string} - HTML for probability bars
 */
function renderProbabilityBars(mainResults, legacyResults) {
  const mainProb = mainResults.probability || 0;
  const legacyProb = legacyResults.probability || 0;
  
  return `
    <div class="probability-comparison">
      <div class="bar-group">
        <label class="bar-label">Main Model (Complex)</label>
        <div class="probability-bar">
          <div class="bar-fill main-model" style="width: ${mainProb}%">
            <span class="bar-value">${mainProb.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div class="bar-group">
        <label class="bar-label">Legacy Model (Age + GFAP)</label>
        <div class="probability-bar">
          <div class="bar-fill legacy-model" style="width: ${legacyProb}%">
            <span class="bar-value">${legacyProb.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render difference analysis
 * @param {object} comparison - Model comparison results
 * @returns {string} - HTML for difference analysis
 */
function renderDifferenceAnalysis(comparison) {
  if (!comparison.isValid) {
    return '<div class="comparison-error">Unable to compare models</div>';
  }

  const { differences, agreement } = comparison;
  const isMainHigher = differences.absolute > 0;
  
  return `
    <div class="difference-analysis">
      <div class="difference-metric">
        <span class="metric-label">Difference:</span>
        <span class="metric-value ${isMainHigher ? 'higher' : 'lower'}">
          ${differences.absolute > 0 ? '+' : ''}${differences.absolute}%
        </span>
      </div>
      
      <div class="agreement-level">
        <span class="metric-label">Agreement:</span>
        <span class="agreement-badge ${agreement.level}">
          ${agreement.level.charAt(0).toUpperCase() + agreement.level.slice(1)}
        </span>
      </div>
      
      <div class="interpretation">
        <p class="interpretation-text">${comparison.interpretation.message}</p>
        <small class="interpretation-detail">${comparison.interpretation.implication}</small>
      </div>
    </div>
  `;
}

/**
 * Render calculation details (expandable)
 * @param {object} legacyResults - Legacy model results
 * @param {object} inputs - Patient input data
 * @returns {string} - HTML for calculation details
 */
function renderCalculationDetails(legacyResults, inputs) {
  return `
    <div class="calculation-details" id="calculationDetails" style="display: none;">
      <h5>Legacy Model Calculation</h5>
      <div class="calculation-steps">
        <div class="step">
          <strong>Inputs:</strong> Age ${inputs.age}, GFAP ${inputs.gfap} pg/ml
        </div>
        <div class="step">
          <strong>Scaling:</strong> Age → ${legacyResults.scaledInputs.age}, GFAP → ${legacyResults.scaledInputs.gfap}
        </div>
        <div class="step">
          <strong>Logit:</strong> ${legacyResults.logit}
        </div>
        <div class="step">
          <strong>Probability:</strong> ${legacyResults.probability}% (Confidence: ${(legacyResults.confidence * 100).toFixed(0)}%)
        </div>
      </div>
    </div>
  `;
}

/**
 * Render model performance metrics
 * @returns {string} - HTML for model metrics
 */
function renderModelMetrics() {
  const metadata = LegacyICHModel.getModelMetadata();
  
  return `
    <div class="model-metrics">
      <h5>Performance Comparison</h5>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-name">ROC-AUC</span>
          <span class="metric-value">Legacy: ${metadata.performance.rocAuc}</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Recall</span>
          <span class="metric-value">Legacy: ${(metadata.performance.recall * 100).toFixed(0)}%</span>
        </div>
        <div class="metric-item">
          <span class="metric-name">Precision</span>
          <span class="metric-value">Legacy: ${(metadata.performance.precision * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize research mode event handlers
 */
export function initializeResearchMode() {
  if (!isResearchModeEnabled()) {
    return;
  }

  // Research toggle button
  const researchToggle = document.getElementById('researchToggle');
  if (researchToggle) {
    researchToggle.addEventListener('click', () => {
      const panel = document.getElementById('researchPanel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Close research panel
  const closeResearch = document.getElementById('closeResearch');
  if (closeResearch) {
    closeResearch.addEventListener('click', () => {
      const panel = document.getElementById('researchPanel');
      if (panel) {
        panel.style.display = 'none';
      }
    });
  }

  // Export data button
  const exportButton = document.getElementById('exportResearchData');
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      ResearchDataLogger.downloadData('csv');
    });
  }

  // Toggle calculation details
  const detailsToggle = document.getElementById('toggleCalculationDetails');
  if (detailsToggle) {
    detailsToggle.addEventListener('click', () => {
      const details = document.getElementById('calculationDetails');
      if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
        detailsToggle.textContent = details.style.display === 'none' ? '🧮 Details' : '🧮 Hide';
      }
    });
  }

  // Clear data button
  const clearButton = document.getElementById('clearResearchData');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (confirm('Clear all research data? This cannot be undone.')) {
        ResearchDataLogger.clearData();
        
        // Update display
        const summary = ResearchDataLogger.getDataSummary();
        console.log(`Data cleared. Total entries: ${summary.totalEntries}`);
      }
    });
  }

  console.log('🔬 Research mode initialized');
}

