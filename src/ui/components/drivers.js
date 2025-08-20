import { normalizeDrivers } from '../../logic/shap.js';

export function renderDriversSection(ich, lvo) {
  if (!ich?.drivers && !lvo?.drivers) return '';
  
  let html = `
    <div class="drivers-section">
      <h3>Prediction Drivers</h3>
      <div class="drivers-grid">
  `;
  
  if (ich?.drivers) {
    html += renderDriversPanel(ich.drivers, 'ICH', 'ich');
  }
  
  if (lvo?.drivers && !lvo.notPossible) {
    html += renderDriversPanel(lvo.drivers, 'LVO', 'lvo');
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