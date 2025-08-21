import { renderProgressIndicator } from '../components/progress.js';
import { renderCriticalAlert } from '../components/alerts.js';
import { renderDriversSection } from '../components/drivers.js';
import { renderStrokeCenterMap } from '../components/stroke-center-map.js';
import { getRiskLevel, formatTime } from '../../logic/formatters.js';
import { CRITICAL_THRESHOLDS } from '../../config.js';
import { t } from '../../localization/i18n.js';
import { store } from '../../state/store.js';

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
        
        // Get friendly label name
        let label = key;
        if (t(`${key}Label`)) {
          label = t(`${key}Label`);
        } else {
          // Fallback: convert snake_case to Title Case
          label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        // Format value
        let displayValue = value;
        if (typeof value === 'boolean') {
          displayValue = value ? '✓' : '✗';
        }
        
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

export function renderResults(results, startTime) {
  const { ich, lvo } = results;
  let ichHtml = '', lvoHtml = '';

  if (ich) {
    const ichPercent = Math.round((ich.probability || 0) * 100);
    const isCritical = ichPercent > CRITICAL_THRESHOLDS.ich.critical;

    ichHtml = `
      <div class="result-card ${isCritical ? 'critical' : 'ich'}">
        <h3> 🧠 ${t('ichProbability')} <small>(${ich.module} Module)</small> </h3>
        <div class="probability-display">${ichPercent}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${ichPercent}%"></div>
          <div class="probability-marker" style="left: ${ichPercent}%">${ichPercent}%</div>
        </div>
        <p><strong>${t('riskLevel')}:</strong> ${getRiskLevel(ichPercent, 'ich')}</p>
      </div>
    `;
  }

  if (lvo) {
    if (lvo.notPossible) {
      lvoHtml = `
        <div class="result-card info">
          <h3>🔍 ${t('lvoProbability')}</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;
    } else {
      const lvoPercent = Math.round((lvo.probability || 0) * 100);
      const isCritical = lvoPercent > CRITICAL_THRESHOLDS.lvo.critical;

      lvoHtml = `
        <div class="result-card ${isCritical ? 'critical' : 'lvo'}">
          <h3> 🩸 ${t('lvoProbability')} <small>(${lvo.module} Module)</small> </h3>
          <div class="probability-display">${lvoPercent}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${lvoPercent}%"></div>
            <div class="probability-marker" style="left: ${lvoPercent}%">${lvoPercent}%</div>
          </div>
          <p><strong>${t('riskLevel')}:</strong> ${getRiskLevel(lvoPercent, 'lvo')}</p>
        </div>
      `;
    }
  }

  const criticalAlert = ich && ich.probability > 0.6 ? renderCriticalAlert() : '';
  const driversHtml = renderDriversSection(ich, lvo);
  const strokeCenterHtml = renderStrokeCenterMap(results);
  const inputSummaryHtml = renderInputSummary();

  return `
    <div class="container">
      ${renderProgressIndicator(3)}
      <h2>${t('resultsTitle')}</h2>
      ${criticalAlert}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${ichHtml}
        ${lvoHtml}
      </div>
      ${inputSummaryHtml}
      ${driversHtml}
      ${strokeCenterHtml}
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
    </div>
  `;
}