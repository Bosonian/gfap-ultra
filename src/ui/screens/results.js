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

function renderRiskCard(type, data, results) {
  if (!data) return '';
  
  const percent = Math.round((data.probability || 0) * 100);
  const riskLevel = getRiskLevel(percent, type);
  const isCritical = percent > CRITICAL_THRESHOLDS[type].critical;
  const isHigh = percent > CRITICAL_THRESHOLDS[type].high;
  
  const icons = { ich: '🧠', lvo: '🩸' };
  const titles = { ich: t('ichProbability'), lvo: t('lvoProbability') };
  
  return `
    <div class="enhanced-risk-card ${type} ${isCritical ? 'critical' : isHigh ? 'high' : 'normal'}">
      <div class="risk-header">
        <div class="risk-icon">${icons[type]}</div>
        <div class="risk-title">
          <h3>${titles[type]}</h3>
          <span class="risk-module">${data.module} Module</span>
        </div>
      </div>
      
      <div class="risk-probability">
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
        
        <div class="risk-assessment">
          <div class="risk-level ${isCritical ? 'critical' : isHigh ? 'high' : 'normal'}">
            ${riskLevel}
          </div>
          <div class="risk-confidence">
            Confidence: ${Math.round((data.confidence || 0.8) * 100)}%
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLVONotPossible() {
  return `
    <div class="enhanced-risk-card lvo not-possible">
      <div class="risk-header">
        <div class="risk-icon">🔍</div>
        <div class="risk-title">
          <h3>${t('lvoProbability')}</h3>
          <span class="risk-module">Limited Assessment</span>
        </div>
      </div>
      
      <div class="not-possible-content">
        <p>LVO assessment not possible with limited data</p>
        <p>Full neurological examination required for LVO screening</p>
      </div>
    </div>
  `;
}

export function renderResults(results, startTime) {
  const { ich, lvo } = results;
  
  const ichHtml = renderRiskCard('ich', ich, results);
  const lvoHtml = lvo?.notPossible ? renderLVONotPossible() : renderRiskCard('lvo', lvo, results);
  
  const criticalAlert = ich && ich.probability > 0.6 ? renderCriticalAlert() : '';
  const driversHtml = renderDriversSection(ich, lvo);
  const strokeCenterHtml = renderStrokeCenterMap(results);
  const inputSummaryHtml = renderInputSummary();

  return `
    <div class="container">
      ${renderProgressIndicator(3)}
      <h2>${t('resultsTitle')}</h2>
      ${criticalAlert}
      
      <!-- Primary Risk Results -->
      <div class="risk-results-grid">
        ${ichHtml}
        ${lvoHtml}
      </div>
      
      <!-- Model Drivers - Prominent Display -->
      <div class="enhanced-drivers-section">
        ${driversHtml}
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
        
        <button class="info-toggle" data-target="clinical-info">
          <span class="toggle-icon">ℹ️</span>
          <span class="toggle-text">Clinical Information</span>
          <span class="toggle-arrow">▼</span>
        </button>
        <div class="collapsible-content" id="clinical-info" style="display: none;">
          <div class="clinical-recommendations">
            <h4>Clinical Recommendations</h4>
            <ul>
              <li>Consider immediate imaging if ICH risk is high</li>
              <li>Activate stroke team for LVO scores ≥ 50%</li>
              <li>Monitor blood pressure closely</li>
              <li>Document all findings thoroughly</li>
            </ul>
          </div>
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
    </div>
  `;
}