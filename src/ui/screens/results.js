import { renderProgressIndicator } from '../components/progress.js';
import { renderCriticalAlert } from '../components/alerts.js';
import { renderDriversSection } from '../components/drivers.js';
import { renderRecommendations } from '../components/recommendations.js';
import { getRiskLevel, formatTime } from '../../logic/formatters.js';
import { CRITICAL_THRESHOLDS } from '../../config.js';

export function renderResults(results, startTime) {
  const { ich, lvo } = results;
  let ichHtml = '', lvoHtml = '';

  if (ich) {
    const ichPercent = Math.round(ich.probability * 100);
    const isCritical = ichPercent > CRITICAL_THRESHOLDS.ich.critical;

    ichHtml = `
      <div class="result-card ${isCritical ? 'critical' : 'ich'}">
        <h3> 🧠 ICH Probability <small>(${ich.module} Module)</small> </h3>
        <div class="probability-display">${ichPercent}%</div>
        <div class="probability-meter">
          <div class="probability-fill" style="width: ${ichPercent}%"></div>
          <div class="probability-marker" style="left: ${ichPercent}%">${ichPercent}%</div>
        </div>
        <p><strong>Risk Level:</strong> ${getRiskLevel(ichPercent, 'ich')}</p>
        <p><strong>Confidence:</strong> ${(ich.confidence * 100).toFixed(0)}%</p>
      </div>
    `;
  }

  if (lvo) {
    if (lvo.notPossible) {
      lvoHtml = `
        <div class="result-card info">
          <h3>🔍 LVO Prediction</h3>
          <p>LVO assessment not possible with limited data.</p>
          <p>A full neurological examination is required for LVO screening.</p>
        </div>
      `;
    } else {
      const lvoPercent = Math.round(lvo.probability * 100);
      const isCritical = lvoPercent > CRITICAL_THRESHOLDS.lvo.critical;

      lvoHtml = `
        <div class="result-card ${isCritical ? 'critical' : 'lvo'}">
          <h3> 🩸 LVO Probability <small>(${lvo.module} Module)</small> </h3>
          <div class="probability-display">${lvoPercent}%</div>
          <div class="probability-meter">
            <div class="probability-fill" style="width: ${lvoPercent}%"></div>
            <div class="probability-marker" style="left: ${lvoPercent}%">${lvoPercent}%</div>
          </div>
          <p><strong>Risk Level:</strong> ${getRiskLevel(lvoPercent, 'lvo')}</p>
          <p><strong>Confidence:</strong> ${(lvo.confidence * 100).toFixed(0)}%</p>
        </div>
      `;
    }
  }

  const criticalAlert = ich && ich.probability > 0.6 ? renderCriticalAlert() : '';
  const recommendationsHtml = renderRecommendations(ich, lvo, startTime);
  const driversHtml = renderDriversSection(ich, lvo);

  return `
    <div class="container">
      ${renderProgressIndicator(3)}
      <h2>Assessment Results</h2>
      <p class="subtitle">Clinical Decision Support Analysis</p>
      ${criticalAlert}
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${ichHtml}
        ${lvoHtml}
        ${recommendationsHtml}
      </div>
      ${driversHtml}
      <button type="button" class="primary" id="printResults"> 📄 Print Results </button>
      <button type="button" class="secondary" data-action="reset"> Start New Assessment </button>
      <div class="disclaimer">
        <strong>⚠️ Important:</strong> These results are for clinical decision support only. Always use clinical judgment and follow institutional protocols. Results generated at ${new Date().toLocaleTimeString()}.
      </div>
    </div>
  `;
}