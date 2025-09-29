import { t } from '../../localization/i18n.js';

export function renderCriticalAlert() {
  return `
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${t('criticalAlertTitle')}</h4>
      <p>${t('criticalAlertMessage')}</p>
    </div>
  `;
}
