import { renderProgressIndicator } from "../components/progress.js";
import { t } from "../../localization/i18n.js";

export default function renderTriage1() {
  return `
    <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Progress -->
      <div class="mb-6">
        ${renderProgressIndicator(1)}
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <!-- Title -->
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center" data-decode="true">
          ${t("triage1Title")}
        </h2>

        <!-- Question -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
          <p class="text-lg text-gray-800 dark:text-gray-200 font-medium mb-2 text-center">
            ${t("triage1Question")}
          </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
              <span data-i18n-key="triage1Help"></span>
            </p>
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button 
            class="yes-btn w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage1" 
            data-value="true"
          >
             ${t("triage1Yes")} ✅
          </button>
          
          <button 
            class="no-btn w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
            data-action="triage1" 
            data-value="false"
          >
             ${t("triage1No")} ❌
          </button>
        </div>
      </div>
    </div>
  `;
}
