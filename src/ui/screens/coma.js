import { renderProgressIndicator } from '../components/progress.js';
import { GFAP_RANGES } from '../../config.js';

export function renderComa() {
  return `
    <div class="container">
      ${renderProgressIndicator(2)}
      <h2>Coma Module</h2>
      <div class="critical-alert">
        <h4><span class="alert-icon">🚨</span> Critical Patient</h4>
        <p>Patient is comatose (GCS &lt; 8). Rapid assessment required.</p>
      </div>
      <form data-module="coma">
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              GFAP Value (pg/mL)
              <span class="tooltip">ℹ️
                <span class="tooltiptext">Glial Fibrillary Acidic Protein - Brain injury biomarker</span>
              </span>
            </label>
            <input type="number" id="gfap_value" name="gfap_value" min="${GFAP_RANGES.min}" max="${GFAP_RANGES.max}" step="0.1" required aria-describedby="gfap-help">
            <div id="gfap-help" class="input-help">
              Range: ${GFAP_RANGES.min} - ${GFAP_RANGES.max} pg/mL
            </div>
          </div>
        </div>
        <button type="submit" class="primary">Analyze ICH Risk</button>
        <button type="button" class="secondary" data-action="reset">Start Over</button>
      </form>
    </div>
  `;
}