import { renderProgressIndicator } from "../components/progress.js";
import { t } from "../../localization/i18n.js";

export default function renderTriage2() {
  return `
    <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Progress -->
      <div class="mb-6">
        ${renderProgressIndicator(2)}
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <!-- Title -->
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
          ${t("triage2Title")}
        </h2>

        <!-- Question -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
          <p class="text-lg text-gray-800 dark:text-gray-200 font-medium mb-2 text-center">
            ${t("triage2Question")}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            ${t("triage2Help")}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col gap-4">
          <button 
            class="yes-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage2" 
            data-value="true"
          >
            ${t("triage2Yes")} ✅ 
          </button>
           <button 
            class="no-btn w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage2" 
            data-value="false"
          >
            ${t("triage2No")} ❌ 
          </button>
        </div>
      </div>
    </div>
  `;
}
