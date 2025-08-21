import { renderProgressIndicator } from '../components/progress.js';
import { GFAP_RANGES } from '../../config.js';

export function renderFull() {
  return `
    <div class="container">
      ${renderProgressIndicator(2)}
      <h2>Full Stroke Module</h2>
      <form data-module="full">
        <h3>Basic Information</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="age_years">Age (years)</label>
            <input type="number" name="age_years" id="age_years" min="0" max="120" required>
          </div>
          <div class="input-group">
            <label for="systolic_bp">Systolic BP (mmHg)</label>
            <input type="number" name="systolic_bp" id="systolic_bp" min="60" max="300" required>
          </div>
          <div class="input-group">
            <label for="diastolic_bp">Diastolic BP (mmHg)</label>
            <input type="number" name="diastolic_bp" id="diastolic_bp" min="30" max="200" required>
          </div>
        </div>

        <h3>Biomarkers & Scores</h3>
        <div class="input-grid">
          <div class="input-group">
            <label for="gfap_value">
              GFAP Value (pg/mL)
              <span class="tooltip">ℹ️
                <span class="tooltiptext">Brain injury biomarker</span>
              </span>
            </label>
            <input type="number" name="gfap_value" id="gfap_value" min="${GFAP_RANGES.min}" max="${GFAP_RANGES.max}" step="0.1" required>
          </div>
          <div class="input-group">
            <label for="fast_ed_score">
              FAST-ED Score
              <span class="tooltip">ℹ️
                <span class="tooltiptext">0-9 scale for LVO screening</span>
              </span>
            </label>
            <input type="number" name="fast_ed_score" id="fast_ed_score" min="0" max="9" required>
          </div>
        </div>

        <h3>Clinical Symptoms</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="headache" id="headache">
              <span class="checkbox-label">Headache</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung">
              <span class="checkbox-label">Vigilance Reduction</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="armparese" id="armparese">
              <span class="checkbox-label">Arm Paresis</span>
            </label>
            <label class="checkbox-wrapper">
              <input type="checkbox" name="beinparese" id="beinparese">
              <span class="checkbox-label">Leg Paresis</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="eye_deviation" id="eye_deviation">
              <span class="checkbox-label">Eye Deviation</span>
            </label>
          </div>
        </div>

        <h3>Medical History</h3>
        <div class="input-grid">
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation">
              <span class="checkbox-label">Atrial Fibrillation</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak">
              <span class="checkbox-label">On NOAC/DOAC</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" name="antiplatelets" id="antiplatelets">
              <span class="checkbox-label">On Antiplatelets</span>
            </label>
          </div>
        </div>

        <button type="submit" class="primary">Analyze Stroke Risk</button>
        <button type="button" class="secondary" data-action="reset">Start Over</button>
      </form>
    </div>
  `;
}