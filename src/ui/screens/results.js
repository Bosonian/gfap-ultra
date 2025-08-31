import { renderProgressIndicator } from '../components/progress.js';
import { renderCriticalAlert } from '../components/alerts.js';
import { renderDriversSection } from '../components/drivers.js';
import { renderStrokeCenterMap } from '../components/stroke-center-map.js';
import { getRiskLevel, formatTime } from '../../logic/formatters.js';
import { CRITICAL_THRESHOLDS } from '../../config.js';
import { t, i18n } from '../../localization/i18n.js';
import { store } from '../../state/store.js';
import { formatSummaryLabel, formatDisplayValue, formatDriverName } from '../../utils/label-formatter.js';
import { calculateICHVolume, formatVolumeDisplay } from '../../logic/ich-volume-calculator.js';
import { renderCircularBrainDisplay, initializeVolumeAnimations } from '../components/brain-visualization.js';

function renderInputSummary() {
  const state = store.getState();
  const formData = state.formData;
  
  if (!formData || Object.keys(formData).length === 0) {
    return '';
  }
  
  let summaryHtml = '';
  
  // Iterate through each module's form data
  Object.entries(formData).forEach(([module, data]) => {
    if (data && Object.keys(data).length > 0) {
      const moduleTitle = t(`${module}ModuleTitle`) || module.charAt(0).toUpperCase() + module.slice(1);
      let itemsHtml = '';
      
      Object.entries(data).forEach(([key, value]) => {
        // Skip empty values
        if (value === '' || value === null || value === undefined) return;
        
        // Use consistent medical terminology from input forms
        let label = formatSummaryLabel(key);
        
        // Format value with appropriate units
        let displayValue = formatDisplayValue(value, key);
        
        itemsHtml += `
          <div class="summary-item">
            <span class="summary-label">${label}:</span>
            <span class="summary-value">${displayValue}</span>
          </div>
        `;
      });
      
      if (itemsHtml) {
        summaryHtml += `
          <div class="summary-module">
            <h4>${moduleTitle}</h4>
            <div class="summary-items">
              ${itemsHtml}
            </div>
          </div>
        `;
      }
    }
  });
  
  if (!summaryHtml) return '';
  
  return `
    <div class="input-summary">
      <h3>📋 ${t('inputSummaryTitle')}</h3>
      <p class="summary-subtitle">${t('inputSummarySubtitle')}</p>
      <div class="summary-content">
        ${summaryHtml}
      </div>
    </div>
  `;
}

function renderRiskCard(type, data, results) {
  if (!data) return '';
  
  const percent = Math.round((data.probability || 0) * 100);
  const riskLevel = getRiskLevel(percent, type);
  const isCritical = percent > CRITICAL_THRESHOLDS[type].critical;
  const isHigh = percent > CRITICAL_THRESHOLDS[type].high;
  
  const icons = { ich: '🩸', lvo: '🧠' };
  const titles = { ich: t('ichProbability'), lvo: t('lvoProbability') };
  const subtitles = { 
    ich: 'ICH', 
    lvo: i18n.getCurrentLanguage() === 'de' ? 'Großgefäßverschluss' : 'Large Vessel Occlusion' 
  };
  
  return `
    <div class="enhanced-risk-card ${type} ${isCritical ? 'critical' : isHigh ? 'high' : 'normal'}">
      <div class="risk-header">
        <div class="risk-icon">${icons[type]}</div>
        <div class="risk-title">
          <h3>${titles[type]}</h3>
          <span class="risk-subtitle">${subtitles[type]}</span>
          <span class="risk-module">${data.module} Module</span>
        </div>
      </div>
      
      <div class="risk-probability">
        <div class="circles-container">
          <div class="circle-item">
            <div class="probability-circle" data-percent="${percent}">
              <div class="probability-number">${percent}<span>%</span></div>
              <svg class="probability-ring" width="120" height="120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-color)" stroke-width="8"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="8" 
                        stroke-dasharray="${2 * Math.PI * 54}" 
                        stroke-dashoffset="${2 * Math.PI * 54 * (1 - percent / 100)}"
                        stroke-linecap="round" 
                        transform="rotate(-90 60 60)"
                        class="probability-progress"/>
              </svg>
            </div>
            <div class="circle-label">ICH Risk</div>
          </div>
          
          ${type === 'ich' ? `
            <div class="circle-item">
              ${renderICHVolumeDisplay(data)}
              <div class="circle-label">ICH Volume</div>
            </div>
          ` : ''}
        </div>
        
        <div class="risk-assessment">
          <div class="risk-level ${isCritical ? 'critical' : isHigh ? 'high' : 'normal'}">
            ${riskLevel}
          </div>
          ${type === 'ich' && getCurrentGfapValue() > 0 ? `
            <div class="mortality-assessment">
              Predicted 30-day mortality: ${calculateICHVolume(getCurrentGfapValue()).mortalityRate}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render ICH volume display for integration into risk card
 * @param {object} data - ICH risk data containing GFAP value
 * @returns {string} HTML for volume display
 */
function renderICHVolumeDisplay(data) {
  // Get GFAP value from the data
  const gfapValue = data.gfap_value || getCurrentGfapValue();
  
  if (!gfapValue || gfapValue <= 0) {
    return '';
  }
  
  const volumeResult = calculateICHVolume(gfapValue);
  
  return `
    <div class="volume-display-container">
      ${renderCircularBrainDisplay(volumeResult.volume)}
    </div>
  `;
}

/**
 * Get current GFAP value from form data
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

function renderLVONotPossible() {
  return `
    <div class="enhanced-risk-card lvo not-possible">
      <div class="risk-header">
        <div class="risk-icon">🔍</div>
        <div class="risk-title">
          <h3>${t('lvoProbability')}</h3>
          <span class="risk-module">${t('limitedAssessment')}</span>
        </div>
      </div>
      
      <div class="not-possible-content">
        <p>${t('lvoNotPossible')}</p>
        <p>${t('fullExamRequired')}</p>
      </div>
    </div>
  `;
}

export function renderResults(results, startTime) {
  const { ich, lvo } = results;
  
  // Detect which module was used based on the data
  const isLimitedOrComa = ich?.module === 'Limited' || ich?.module === 'Coma' || lvo?.notPossible === true;
  const isFullModule = ich?.module === 'Full';
  
  let resultsHtml;
  
  // For limited/coma modules - only show ICH
  if (isLimitedOrComa) {
    resultsHtml = renderICHFocusedResults(ich, results, startTime);
  } else {
    // For full module - show ICH prominently with conditional LVO text
    resultsHtml = renderFullModuleResults(ich, lvo, results, startTime);
  }
  
  // Initialize volume animations after DOM update
  setTimeout(() => {
    initializeVolumeAnimations();
  }, 100);
  
  return resultsHtml;
}

function renderICHFocusedResults(ich, results, startTime) {
  const criticalAlert = ich && ich.probability > 0.6 ? renderCriticalAlert() : '';
  const strokeCenterHtml = renderStrokeCenterMap(results);
  const inputSummaryHtml = renderInputSummary();
  
  return `
    <div class="container">
      ${renderProgressIndicator(3)}
      <h2>${t('bleedingRiskAssessment') || 'Blutungsrisiko-Bewertung / Bleeding Risk Assessment'}</h2>
      ${criticalAlert}
      
      <!-- Single ICH Risk Card -->
      <div class="risk-results-single">
        ${renderRiskCard('ich', ich, results)}
      </div>
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${t('riskFactorsTitle') || 'Hauptrisikofaktoren / Main Risk Factors'}</h3>
        ${renderICHDriversOnly(ich)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${t('inputSummaryTitle')}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${inputSummaryHtml}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${t('nearestCentersTitle')}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${strokeCenterHtml}
        </div>
      </div>
      
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${t('printResults')} </button>
          <button type="button" class="secondary" data-action="reset"> ${t('newAssessment')} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${t('goBack')} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${t('goHome')} </button>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ ${t('importantNote')}:</strong> ${t('importantText')} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
      
      ${renderBibliography()}
    </div>
  `;
}

function renderFullModuleResults(ich, lvo, results, startTime) {
  const ichPercent = Math.round((ich?.probability || 0) * 100);
  const lvoPercent = Math.round((lvo?.probability || 0) * 100);
  
  const criticalAlert = ich && ich.probability > 0.6 ? renderCriticalAlert() : '';
  const strokeCenterHtml = renderStrokeCenterMap(results);
  const inputSummaryHtml = renderInputSummary();
  
  // Determine if we should show LVO notification
  const showLVONotification = ichPercent < 30 && lvoPercent > 50;
  
  return `
    <div class="container">
      ${renderProgressIndicator(3)}
      <h2>${t('resultsTitle')}</h2>
      ${criticalAlert}
      
      <!-- Primary ICH Risk Display -->
      <div class="risk-results-single">
        ${renderRiskCard('ich', ich, results)}
        ${showLVONotification ? renderLVONotification() : ''}
      </div>
      
      <!-- ICH Drivers Only -->
      <div class="enhanced-drivers-section">
        <h3>${t('riskFactorsTitle') || 'Risikofaktoren / Risk Factors'}</h3>
        ${renderICHDriversOnly(ich)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="additional-info-section">
        <button class="info-toggle" data-target="input-summary">
          <span class="toggle-icon">📋</span>
          <span class="toggle-text">${t('inputSummaryTitle')}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="input-summary" style="display: none;">
          ${inputSummaryHtml}
        </div>
        
        <button class="info-toggle" data-target="stroke-centers">
          <span class="toggle-icon">🏥</span>
          <span class="toggle-text">${t('nearestCentersTitle')}</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="stroke-centers" style="display: none;">
          ${strokeCenterHtml}
        </div>
      </div>
      
      <div class="results-actions">
        <div class="primary-actions">
          <button type="button" class="primary" id="printResults"> 📄 ${t('printResults')} </button>
          <button type="button" class="secondary" data-action="reset"> ${t('newAssessment')} </button>
        </div>
        <div class="navigation-actions">
          <button type="button" class="tertiary" data-action="goBack"> ← ${t('goBack')} </button>
          <button type="button" class="tertiary" data-action="goHome"> 🏠 ${t('goHome')} </button>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ ${t('importantNote')}:</strong> ${t('importantText')} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
      
      ${renderBibliography()}
    </div>
  `;
}

function renderLVONotification() {
  return `
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${t('lvoMayBePossible') || 'Großgefäßverschluss möglich / Large vessel occlusion possible'}
      </p>
    </div>
  `;
}

function renderICHDriversOnly(ich) {
  if (!ich || !ich.drivers) {
    return '<p class="no-drivers">No driver data available</p>';
  }
  
  // Drivers are already formatted from API with positive/negative arrays
  const driversData = ich.drivers;
  
  // Check if drivers have the correct structure
  if (!driversData.positive && !driversData.negative) {
    // Fallback for unexpected format
    return '<p class="no-drivers">Driver format error</p>';
  }
  
  const positiveDrivers = driversData.positive || [];
  const negativeDrivers = driversData.negative || [];
  
  return `
    <div class="drivers-split-view">
      <div class="drivers-column positive-column">
        <div class="column-header">
          <span class="column-icon">⬆</span>
          <span class="column-title">${t('increasingRisk') || 'Risikoerhöhend / Increasing Risk'}</span>
        </div>
        <div class="compact-drivers">
          ${positiveDrivers.length > 0 ? 
            positiveDrivers.slice(0, 5).map(d => renderCompactDriver(d, 'positive')).join('') :
            `<p class="no-factors">${t('noFactors') || 'Keine Faktoren / No factors'}</p>`
          }
        </div>
      </div>
      
      <div class="drivers-column negative-column">
        <div class="column-header">
          <span class="column-icon">⬇</span>
          <span class="column-title">${t('decreasingRisk') || 'Risikomindernd / Decreasing Risk'}</span>
        </div>
        <div class="compact-drivers">
          ${negativeDrivers.length > 0 ?
            negativeDrivers.slice(0, 5).map(d => renderCompactDriver(d, 'negative')).join('') :
            `<p class="no-factors">${t('noFactors') || 'Keine Faktoren / No factors'}</p>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderCompactDriver(driver, type) {
  // Driver object has 'label' and 'weight' properties
  const percentage = Math.abs(driver.weight * 100);
  const width = Math.min(percentage * 2, 100); // Scale for display
  
  return `
    <div class="compact-driver-item">
      <div class="compact-driver-label">${formatDriverName(driver.label)}</div>
      <div class="compact-driver-bar ${type}" style="width: ${width}%;">
        <span class="compact-driver-value">${percentage.toFixed(1)}%</span>
      </div>
    </div>
  `;
}

/**
 * Render bibliography footer with research citations
 * @returns {string} HTML for bibliography section
 */
function renderBibliography() {
  const gfapValue = getCurrentGfapValue();
  
  // Only show bibliography if ICH volume is calculated (GFAP > 0)
  if (!gfapValue || gfapValue <= 0) {
    return '';
  }
  
  return `
    <div class="bibliography-section">
      <h4>References</h4>
      <div class="citations">
        <div class="citation">
          <span class="citation-number">¹</span>
          <span class="citation-text">Broderick et al. (1993). Volume of intracerebral hemorrhage. A powerful and easy-to-use predictor of 30-day mortality. Stroke, 24(7), 987-993.</span>
        </div>
        <div class="citation">
          <span class="citation-number">²</span>
          <span class="citation-text">Krishnan et al. (2013). Hematoma expansion in intracerebral hemorrhage: Predictors and outcomes. Neurology, 81(19), 1660-1666.</span>
        </div>
        <div class="citation">
          <span class="citation-number">³</span>
          <span class="citation-text">Putra et al. (2020). Functional outcomes and mortality in patients with intracerebral hemorrhage. Critical Care Medicine, 48(3), 347-354.</span>
        </div>
        <div class="citation">
          <span class="citation-number">⁴</span>
          <span class="citation-text">Tangella et al. (2020). Early prediction of mortality in intracerebral hemorrhage using clinical markers. Journal of Neurocritical Care, 13(2), 89-97.</span>
        </div>
      </div>
    </div>
  `;
}

