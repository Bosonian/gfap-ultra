import { renderProgressIndicator } from '../components/progress.js';
import { GFAP_RANGES } from '../../config.js';
import { t } from '../../localization/i18n.js';

export function renderLimited() {
  return `
    <div class="container">
      ${renderProgressIndicator(2)}
      <h2>${t('limitedDataModuleTitle') || 'Limited Data Module'}</h2>
      <form data-module="limited">
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${t('ageYearsLabel')}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required aria-describedby="age-help">
            <div id="age-help" class="input-help">${t('ageYearsHelp')}</div>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${t('systolicBpLabel')}</label>
            <div class="input-with-unit">
              <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required aria-describedby="sbp-help" inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
            <div id="sbp-help" class="input-help">${t('systolicBpHelp')}</div>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${t('diastolicBpLabel')}</label>
            <div class="input-with-unit">
              <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required aria-describedby="dbp-help" inputmode="numeric">
              <span class="unit">mmHg</span>
            </div>
            <div id="dbp-help" class="input-help">${t('diastolicBpHelp')}</div>
          </div>
          <div class="input-group">
            <label for="gfap_value">
              ${t('gfapValueLabel')}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${t('gfapTooltipLong')}</span>
              </span>
            </label>
            <div class="input-with-unit">
              <input type="number" name="gfap_value" id="gfap_value" min="${GFAP_RANGES.min}" max="${GFAP_RANGES.max}" step="0.1" required inputmode="decimal">
              <span class="unit">pg/mL</span>
            </div>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-wrapper">
            <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
            <span class="checkbox-label">${t('vigilanceReduction')}</span>
          </label>
        </div>
        <button type="submit" class="primary">${t('analyzeIchRisk')}</button>
        <button type="button" class="secondary" data-action="reset">${t('startOver')}</button>
      </form>
    </div>
  `;
}
