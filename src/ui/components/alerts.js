import { t } from "../../localization/i18n.js";

export function renderCriticalAlert() {
  return `
   <div class="critical-alert bg-red-50 dark:bg-red-900/40 border-l-4 border-red-600 rounded-lg p-4 shadow-sm flex flex-col gap-2 transition-all duration-300 hover:shadow-md mb-3">
  <h4 class="flex items-center gap-2 text-red-700 dark:text-red-300 font-semibold text-lg">
    <span class="alert-icon text-xl">🚨</span>
    ${t("criticalAlertTitle")}
  </h4>
  <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
    ${t("criticalAlertMessage")}
  </p>
</div>

  `;
}

export function renderCriticalLvoAlert() {
  return `
   <div class="critical-alert bg-red-50 dark:bg-red-900/40 border-l-4 border-red-600 rounded-lg p-4 shadow-sm flex flex-col gap-2 transition-all duration-300 hover:shadow-md mb-3">
  <h4 class="flex items-center gap-2 text-red-700 dark:text-red-300 font-semibold text-lg">
    <span class="alert-icon text-xl">🚨</span>
    ${t("criticalLvoAlertTitle")}
  </h4>
  <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
    ${t("criticalLvoAlertMessage")}
  </p>
</div>

  `;
}
