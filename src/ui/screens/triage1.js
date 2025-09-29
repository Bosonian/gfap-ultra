import { renderProgressIndicator } from '../components/progress.js';
import { t } from '../../localization/i18n.js';

export function renderTriage1() {
  return `
    <div class="container">
      ${renderProgressIndicator(1)}
      <h2>${t('triage1Title')}</h2>
      <div class="triage-question">
        ${t('triage1Question')}
        <small>${t('triage1Help')}</small>
      </div>
      <div class="triage-buttons">
        <button class="yes-btn" data-action="triage1" data-value="true">${t('triage1Yes')}</button>
        <button class="no-btn" data-action="triage1" data-value="false">${t('triage1No')}</button>
      </div>
    </div>
  `;
}
