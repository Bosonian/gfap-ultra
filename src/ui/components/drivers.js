import { normalizeDrivers } from '../../logic/shap.js';
import { t } from '../../localization/i18n.js';

export function renderDriversSection(ich, lvo) {
  if (!ich?.drivers && !lvo?.drivers) return '';
  
  let html = `
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${t('modelDrivers')}</h3>
        <p class="drivers-subtitle">${t('modelDriversSubtitle')}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;
  
  if (ich?.drivers) {
    html += renderEnhancedDriversPanel(ich.drivers, 'ICH', 'ich', ich.probability);
  }
  
  if (lvo?.drivers && !lvo.notPossible) {
    html += renderEnhancedDriversPanel(lvo.drivers, 'LVO', 'lvo', lvo.probability);
  }
  
  html += `
      </div>
    </div>
  `;
  return html;
}

export function renderDriversPanel(drivers, title, type) {
  if (!drivers || Object.keys(drivers).length === 0) {
    return `
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${type}">${type === 'ich' ? 'I' : 'L'}</span>
          ${title} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;
  }

  const driversViewModel = normalizeDrivers(drivers);
  
  if (driversViewModel.kind === 'unavailable') {
    return `
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${type}">${type === 'ich' ? 'I' : 'L'}</span>
          ${title} Risk Factors
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver analysis not available for this prediction.
        </p>
      </div>
    `;
  }

  let html = `
    <div class="drivers-panel">
      <h4>
        <span class="driver-icon ${type}">${type === 'ich' ? 'I' : 'L'}</span>
        ${title} Risk Factors
      </h4>
  `;

  // Show positive drivers (increase risk)
  if (driversViewModel.positive.length > 0) {
    driversViewModel.positive.forEach(driver => {
      const percentage = Math.abs(driver.weight * 100);
      const width = Math.min(percentage * 2, 100); // Scale for visualization
      html += `
        <div class="driver-item">
          <span class="driver-label">${driver.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${width}%">
              <span class="driver-value">+${percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Show negative drivers (decrease risk)
  if (driversViewModel.negative.length > 0) {
    driversViewModel.negative.forEach(driver => {
      const percentage = Math.abs(driver.weight * 100);
      const width = Math.min(percentage * 2, 100); // Scale for visualization
      html += `
        <div class="driver-item">
          <span class="driver-label">${driver.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${width}%">
              <span class="driver-value">-${percentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Show metadata if available
  if (driversViewModel.meta && Object.keys(driversViewModel.meta).length > 0) {
    html += `
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `;
    
    if (driversViewModel.meta.base_value !== undefined) {
      html += `Base value: ${driversViewModel.meta.base_value.toFixed(2)} `;
    }
    if (driversViewModel.meta.contrib_sum !== undefined) {
      html += `Contrib sum: ${driversViewModel.meta.contrib_sum.toFixed(2)} `;
    }
    if (driversViewModel.meta.logit_total !== undefined) {
      html += `Logit total: ${driversViewModel.meta.logit_total.toFixed(2)}`;
    }
    
    html += `
        </small>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

export function renderEnhancedDriversPanel(drivers, title, type, probability) {
  if (!drivers || Object.keys(drivers).length === 0) {
    return `
      <div class="enhanced-drivers-panel ${type}">
        <div class="panel-header">
          <div class="panel-icon ${type}">${type === 'ich' ? '🧠' : '🩸'}</div>
          <div class="panel-title">
            <h4>${title} Risk Factors</h4>
            <span class="panel-subtitle">${t('noDriverData')}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${t('driverInfoNotAvailable')}
        </p>
      </div>
    `;
  }

  const driversViewModel = normalizeDrivers(drivers);
  
  if (driversViewModel.kind === 'unavailable') {
    return `
      <div class="enhanced-drivers-panel ${type}">
        <div class="panel-header">
          <div class="panel-icon ${type}">${type === 'ich' ? '🧠' : '🩸'}</div>
          <div class="panel-title">
            <h4>${title} Risk Factors</h4>
            <span class="panel-subtitle">${t('driverAnalysisUnavailable')}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${t('driverAnalysisNotAvailable')}
        </p>
      </div>
    `;
  }

  const allDrivers = [...driversViewModel.positive, ...driversViewModel.negative]
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 8); // Show top 8 most important factors

  let html = `
    <div class="enhanced-drivers-panel ${type}">
      <div class="panel-header">
        <div class="panel-icon ${type}">${type === 'ich' ? '🧠' : '🩸'}</div>
        <div class="panel-title">
          <h4>${title} Risk Factors</h4>
          <span class="panel-subtitle">${t('contributingFactors')} (${allDrivers.length} ${t('factorsShown')})</span>
        </div>
      </div>
      
      <div class="drivers-chart">
  `;

  if (allDrivers.length > 0) {
    const maxWeight = Math.max(...allDrivers.map(d => Math.abs(d.weight)));
    
    allDrivers.forEach((driver, index) => {
      const weight = driver.weight;
      const isPositive = weight > 0;
      const percentage = Math.abs(weight * 100);
      const barWidth = (Math.abs(weight) / maxWeight) * 100;
      const cleanLabel = driver.label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      html += `
        <div class="enhanced-driver-item">
          <div class="driver-info">
            <span class="driver-label">${cleanLabel}</span>
            <div class="driver-impact ${isPositive ? 'positive' : 'negative'}">
              ${isPositive ? '↑' : '↓'} ${percentage.toFixed(1)}%
            </div>
          </div>
          <div class="driver-bar-wrapper">
            <div class="driver-bar-track">
              <div class="driver-bar ${isPositive ? 'positive' : 'negative'}" 
                   style="width: ${barWidth}%"
                   data-weight="${weight.toFixed(3)}">
                <div class="bar-glow"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  html += `
      </div>
      
      <div class="drivers-summary">
        <div class="summary-stats">
          <span class="stat-item">
            <span class="stat-label">${t('positiveFactors')}:</span>
            <span class="stat-value positive">${driversViewModel.positive.length}</span>
          </span>
          <span class="stat-item">
            <span class="stat-label">${t('negativeFactors')}:</span>
            <span class="stat-value negative">${driversViewModel.negative.length}</span>
          </span>
        </div>
      </div>
    </div>
  `;
  
  return html;
}