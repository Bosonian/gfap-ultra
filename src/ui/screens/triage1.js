import { renderProgressIndicator } from '../components/progress.js';

export function renderTriage1() {
  return `
    <div class="container">
      ${renderProgressIndicator(1)}
      <h2>Initial Assessment</h2>
      <p class="subtitle">Emergency Stroke Triage Protocol</p>
      <div class="triage-question">
        Is the patient comatose?
        <small>Glasgow Coma Scale &lt; 8</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">YES - Comatose</button>
        <button class="no-btn" data-action="triage1" data-value="false">NO - Conscious</button>
      </div>
    </div>
  `;
}