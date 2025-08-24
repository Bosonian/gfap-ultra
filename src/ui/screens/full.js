import { renderProgressIndicator } from '../components/progress.js';
import { GFAP_RANGES } from '../../config.js';
import { t } from '../../localization/i18n.js';

export function renderFull() {
  return `
    <div class="container">
      ${renderProgressIndicator(2)}
      <h2>${t('fullStrokeModuleTitle') || 'Full Stroke Module'}</h2>
      <form data-module="full">
        <h3>${t('basicInformation')}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">${t('ageYearsLabel')}</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">${t('systolicBpLabel')}</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">${t('diastolicBpLabel')}</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>${t('biomarkersScores')}</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              ${t('gfapValueLabel')}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${t('gfapTooltip')}</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${GFAP_RANGES.min}" max="${GFAP_RANGES.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              ${t('fastEdScoreLabel')}
              <span class="tooltip">ℹ️
                <span class="tooltiptext">${t('fastEdCalculatorSubtitle')}</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required readonly placeholder="${t('fastEdCalculatorSubtitle')}" style="cursor: pointer;">
            <input type="hidden" name="armparese" id="armparese_hidden" value="false">
            <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
          </div>
        </div>

        <h3>${t('clinicalSymptoms')}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">${t('headacheLabel')}</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">${t('vigilanzLabel')}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">${t('legParesis')}</span>
            </label>
          </div>
        </div>

        <h3>${t('medicalHistory')}</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">${t('atrialFibrillation')}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">${t('onNoacDoac')}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">${t('onAntiplatelets')}</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">${t('analyzeStrokeRisk')}</button>
        <button type="button" class="secondary" data-action="reset">${t('startOver')}</button>
      </form>
    </div>
  `;
}