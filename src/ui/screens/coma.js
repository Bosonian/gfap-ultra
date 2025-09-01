import { renderProgressIndicator } from '../components/progress.js';
import { GFAP_RANGES } from '../../config.js';
import { t } from '../../localization/i18n.js';

export function renderComa() {
  return `
    <div class="container">
      ${renderProgressIndicator(2)}
      <h2>${t('comaModuleTitle') || 'Coma Module'}</h2>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${t('gfapValueLabel')}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${t('gfapTooltipLong')}</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${GFAP_RANGES.min}" max="${GFAP_RANGES.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              ${t('gfapRange').replace('{min}', GFAP_RANGES.min).replace('{max}', GFAP_RANGES.max)}
            </div>
          </div>
        </div>
        <button type="submit" class="primary">${t('analyzeIchRisk')}</button>
        <button type="button" class="secondary" data-action="reset">${t('startOver')}</button>
      </form>
    </div>
  `;
}