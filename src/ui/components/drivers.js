import { normalizeDrivers } from '../../logic/shap.js';
import { t } from '../../localization/i18n.js';

export function renderDriversSection(ich, lvo) {
  // Debug logging for driver analysis
  console.log('=== DRIVER DEBUG ===');
  console.log('ICH result:', ich);
  console.log('LVO result:', lvo);
  console.log('ICH drivers raw:', ich?.drivers);
  console.log('LVO drivers raw:', lvo?.drivers);
  
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
          ${title} ${t('riskFactors')}
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
          ${title} ${t('riskFactors')}
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
  console.log(`--- ${title} Driver Panel Debug ---`);
  console.log('Raw drivers input:', drivers);
  console.log('Title:', title, 'Type:', type, 'Probability:', probability);
  
  if (!drivers || Object.keys(drivers).length === 0) {
    console.log(`No drivers data for ${title}`);
    return `
      <div class="enhanced-drivers-panel ${type}">
        <div class="panel-header">
          <div class="panel-icon ${type}">${type === 'ich' ? '🧠' : '🩸'}</div>
          <div class="panel-title">
            <h4>${title} ${t('riskFactors')}</h4>
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
  console.log(`${title} normalized drivers:`, driversViewModel);
  
  if (driversViewModel.kind === 'unavailable') {
    return `
      <div class="enhanced-drivers-panel ${type}">
        <div class="panel-header">
          <div class="panel-icon ${type}">${type === 'ich' ? '🧠' : '🩸'}</div>
          <div class="panel-title">
            <h4>${title} ${t('riskFactors')}</h4>
            <span class="panel-subtitle">${t('driverAnalysisUnavailable')}</span>
          </div>
        </div>
        <p class="no-drivers-message">
          ${t('driverAnalysisNotAvailable')}
        </p>
      </div>
    `;
  }

  // Sort drivers by absolute impact and limit to top 6 most important
  const positiveDrivers = driversViewModel.positive
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 3); // Top 3 positive drivers
  
  const negativeDrivers = driversViewModel.negative
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 3); // Top 3 negative drivers

  console.log(`🎯 ${title} Final displayed drivers:`);
  console.log('  Top positive:', positiveDrivers.map(d => `${d.label}: +${(Math.abs(d.weight) * 100).toFixed(1)}%`));
  console.log('  Top negative:', negativeDrivers.map(d => `${d.label}: -${(Math.abs(d.weight) * 100).toFixed(1)}%`));

  const maxWeight = Math.max(
    ...positiveDrivers.map(d => Math.abs(d.weight)),
    ...negativeDrivers.map(d => Math.abs(d.weight)),
    0.01 // Prevent division by zero
  );

  let html = `
    <div class="enhanced-drivers-panel ${type}">
      <div class="panel-header">
        <div class="panel-icon ${type}">${type === 'ich' ? '🧠' : '🩸'}</div>
        <div class="panel-title">
          <h4>${title} ${t('riskFactors')}</h4>
          <span class="panel-subtitle">${t('contributingFactors')}</span>
        </div>
      </div>
      
      <div class="drivers-split-view">
        <div class="drivers-column positive-column">
          <div class="column-header">
            <span class="column-icon">↑</span>
            <span class="column-title">${t('increaseRisk')}</span>
          </div>
          <div class="compact-drivers">
  `;

  // Render positive drivers
  if (positiveDrivers.length > 0) {
    positiveDrivers.forEach((driver) => {
      const percentage = Math.abs(driver.weight * 100);
      const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
      const cleanLabel = driver.label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      html += `
        <div class="compact-driver-item">
          <div class="compact-driver-label">${cleanLabel}</div>
          <div class="compact-driver-bar positive" style="width: ${barWidth}%">
            <span class="compact-driver-value">+${percentage.toFixed(0)}%</span>
          </div>
        </div>
      `;
    });
  } else {
    html += `<div class="no-factors">${t('noPositiveFactors')}</div>`;
  }

  html += `
          </div>
        </div>
        
        <div class="drivers-column negative-column">
          <div class="column-header">
            <span class="column-icon">↓</span>
            <span class="column-title">${t('decreaseRisk')}</span>
          </div>
          <div class="compact-drivers">
  `;

  // Render negative drivers
  if (negativeDrivers.length > 0) {
    negativeDrivers.forEach((driver) => {
      const percentage = Math.abs(driver.weight * 100);
      const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
      const cleanLabel = driver.label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      html += `
        <div class="compact-driver-item">
          <div class="compact-driver-label">${cleanLabel}</div>
          <div class="compact-driver-bar negative" style="width: ${barWidth}%">
            <span class="compact-driver-value">-${percentage.toFixed(0)}%</span>
          </div>
        </div>
      `;
    });
  } else {
    html += `<div class="no-factors">${t('noNegativeFactors')}</div>`;
  }

  html += `
          </div>
        </div>
      </div>
    </div>
  `;
  
  return html;
}