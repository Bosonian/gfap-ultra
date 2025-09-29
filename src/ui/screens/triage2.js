import { renderProgressIndicator } from '../components/progress.js';
import { t } from '../../localization/i18n.js';

export function renderTriage2() {
  return `
    <div class="container">
      ${renderProgressIndicator(1)}
      <h2>${t('triage2Title')}</h2>
      <div class="triage-question">
        ${t('triage2Question')}
        <small>${t('triage2Help')}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage2" data-value="true">${t('triage2Yes')}</button>
        <button class="no-btn" data-action="triage2" data-value="false">${t('triage2No')}</button>
      </div>
    </div>
  `;
}
