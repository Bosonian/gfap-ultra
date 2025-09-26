import { t } from '../../localization/i18n.js';
import { formatDriverName } from '../../utils/label-formatter.js';

export function renderDriversSection(ich, lvo) {
  console.log('=== DRIVER RENDERING SECTION ===');
  
  
  if (!ich?.drivers && !lvo?.drivers) {
    console.log('❌ No drivers available for rendering');
    return '';
  }
  
  let html = `
    <div class="drivers-section">
      <div class="drivers-header">
        <h3><span class="driver-header-icon">🎯</span> ${t('riskAnalysis')}</h3>
        <p class="drivers-subtitle">${t('riskAnalysisSubtitle')}</p>
      </div>
      <div class="enhanced-drivers-grid">
  `;
  
  if (ich?.drivers) {
    console.log('🧠 Rendering ICH drivers panel');
    html += renderEnhancedDriversPanel(ich.drivers, 'ICH', 'ich', ich.probability);
  }
  
  if (lvo?.drivers && !lvo.notPossible) {
    console.log('🩸 Rendering LVO drivers panel');
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

  // Calculate relative importance for legacy panel
  const totalPositiveWeightLegacy = driversViewModel.positive.reduce((sum, d) => sum + Math.abs(d.weight), 0);
  const totalNegativeWeightLegacy = driversViewModel.negative.reduce((sum, d) => sum + Math.abs(d.weight), 0);

  // Show positive drivers (increase risk)
  if (driversViewModel.positive.length > 0) {
    driversViewModel.positive.forEach(driver => {
      const relativeImportance = totalPositiveWeightLegacy > 0 ? 
        (Math.abs(driver.weight) / totalPositiveWeightLegacy) * 100 : 0;
      const width = Math.min(relativeImportance * 2, 100); // Scale for visualization
      html += `
        <div class="driver-item">
          <span class="driver-label">${driver.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${width}%">
              <span class="driver-value">+${relativeImportance.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Show negative drivers (decrease risk)
  if (driversViewModel.negative.length > 0) {
    driversViewModel.negative.forEach(driver => {
      const relativeImportance = totalNegativeWeightLegacy > 0 ? 
        (Math.abs(driver.weight) / totalNegativeWeightLegacy) * 100 : 0;
      const width = Math.min(relativeImportance * 2, 100); // Scale for visualization
      html += `
        <div class="driver-item">
          <span class="driver-label">${driver.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${width}%">
              <span class="driver-value">-${relativeImportance.toFixed(0)}%</span>
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
    console.log(`No drivers data for ${title}`);
    return `
      <div class="enhanced-drivers-panel ${type}">
        <div class="panel-header">
          <div class="panel-icon ${type}">${type === 'ich' ? '🩸' : '🧠'}</div>
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

  // Drivers are already in the correct format from our new extraction
  const driversViewModel = drivers;
  
  
  if (driversViewModel.kind === 'unavailable') {
    return `
      <div class="enhanced-drivers-panel ${type}">
        <div class="panel-header">
          <div class="panel-icon ${type}">${type === 'ich' ? '🩸' : '🧠'}</div>
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

  

  const maxWeight = Math.max(
    ...positiveDrivers.map(d => Math.abs(d.weight)),
    ...negativeDrivers.map(d => Math.abs(d.weight)),
    0.01 // Prevent division by zero
  );

  let html = `
    <div class="enhanced-drivers-panel ${type}">
      <div class="panel-header">
        <div class="panel-icon ${type}">${type === 'ich' ? '🩸' : '🧠'}</div>
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

  // Calculate relative importance percentages
  const totalPositiveWeight = positiveDrivers.reduce((sum, d) => sum + Math.abs(d.weight), 0);
  
  // Render positive drivers
  if (positiveDrivers.length > 0) {
    positiveDrivers.forEach((driver) => {
      // Calculate relative importance as percentage of total positive contribution
      const relativeImportance = totalPositiveWeight > 0 ? 
        (Math.abs(driver.weight) / totalPositiveWeight) * 100 : 0;
      const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
      const cleanLabel = formatDriverName(driver.label);
      
      html += `
        <div class="compact-driver-item">
          <div class="compact-driver-label">${cleanLabel}</div>
          <div class="compact-driver-bar positive" style="width: ${barWidth}%">
            <span class="compact-driver-value">+${relativeImportance.toFixed(0)}%</span>
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

  // Calculate relative importance percentages for negative drivers
  const totalNegativeWeight = negativeDrivers.reduce((sum, d) => sum + Math.abs(d.weight), 0);
  
  // Render negative drivers
  if (negativeDrivers.length > 0) {
    negativeDrivers.forEach((driver) => {
      // Calculate relative importance as percentage of total negative contribution
      const relativeImportance = totalNegativeWeight > 0 ? 
        (Math.abs(driver.weight) / totalNegativeWeight) * 100 : 0;
      const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
      const cleanLabel = formatDriverName(driver.label);
      
      html += `
        <div class="compact-driver-item">
          <div class="compact-driver-label">${cleanLabel}</div>
          <div class="compact-driver-bar negative" style="width: ${barWidth}%">
            <span class="compact-driver-value">-${relativeImportance.toFixed(0)}%</span>
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