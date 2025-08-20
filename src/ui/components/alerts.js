export function renderCriticalAlert() {
  return `
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> CRITICAL FINDING</h4>
      <p>High probability of intracerebral hemorrhage detected.</p>
      <p><strong>Immediate actions required:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Initiate stroke protocol immediately</li>
        <li>Urgent CT imaging required</li>
        <li>Consider blood pressure management</li>
        <li>Prepare for potential neurosurgical consultation</li>
      </ul>
    </div>
  `;
}