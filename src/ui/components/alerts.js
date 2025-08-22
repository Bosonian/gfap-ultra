import { t } from '../../localization/i18n.js';

export function renderCriticalAlert() {
  return `
    <div class="critical-alert">
      <h4><span class="alert-icon">🚨</span> ${t('criticalAlertTitle')}</h4>
      <p>${t('criticalAlertMessage')}</p>
      <p><strong>${t('immediateActionsRequired')}:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>${t('initiateStrokeProtocol')}</li>
        <li>${t('urgentCtImaging')}</li>
        <li>${t('considerBpManagement')}</li>
        <li>${t('prepareNeurosurgicalConsult')}</li>
      </ul>
    </div>
  `;
}