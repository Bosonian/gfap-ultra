import { renderProgressIndicator } from '../components/progress.js';
import { renderCriticalAlert } from '../components/alerts.js';
import { renderDriversSection } from '../components/drivers.js';
import { renderStrokeCenterMap } from '../components/stroke-center-map.js';
import { getRiskLevel, formatTime } from '../../logic/formatters.js';
import { CRITICAL_THRESHOLDS } from '../../config.js';
import { t } from '../../localization/i18n.js';

export function renderResults(results, startTime) {
  const { ich, lvo } = results;
  let ichHtml = '', lvoHtml = '';

  if (ich) {
    const ichPercent = Math.round(ich.probability * 100);
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
      const lvoPercent = Math.round(lvo.probability * 100);
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

  return `
    <div class="container">
      ${renderProgressIndicator(3)}
      <h2>${t('resultsTitle')}</h2>
      ${criticalAlert}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${ichHtml}
        ${lvoHtml}
      </div>
      ${driversHtml}
      ${strokeCenterHtml}
      <button type="button" class="primary" id="printResults"> 📄 ${t('printResults')} </button>
      <button type="button" class="secondary" data-action="reset"> ${t('newAssessment')} </button>
      <div class="disclaimer">
        <strong>⚠️ ${t('importantNote')}:</strong> ${t('importantText')} Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `;
}