import { renderProgressIndicator } from "../components/progress.js";
import { GFAP_RANGES } from "../../config.js";
import { t } from "../../localization/i18n.js";

export function renderFull() {
  return `
   <div class="container mx-auto px-4 py-8 max-w-lg">
        
        <div class="mb-6">
          ${renderProgressIndicator(2)}
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <!-- Title -->
          <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
            ${t("fullStrokeModuleTitle") || "Full Stroke Module"}
          </h2>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-1 text-center">
            ${t("enterRequiredDetails") || "Enter the required data for full module analysis"}
          </p>

          <form data-module="full" class="space-y-8 mt-6">

            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${t("basicInformation")}</h3>
              <div class="space-y-4">
                <!-- Age -->
                <div class="flex flex-col">
                  <label for="age_years" class="text-sm font-medium text-gray-700 dark:text-slate-200">${t("ageYearsLabel")}</label>
                  <input type="number" name="age_years" id="age_years"
                         class="mt-1 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         min="0" max="120" required>
                </div>

                <!-- Systolic BP -->
                <div class="flex flex-col">
                  <label for="systolic_bp" class="text-sm font-medium text-gray-700 dark:text-slate-200">${t("systolicBpLabel")}</label>
                  <div class="relative">
                    <input type="number" name="systolic_bp" id="systolic_bp"
                           class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                  text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           min="60" max="300" required inputmode="numeric">
                    <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">mmHg</span>
                  </div>
                </div>

                <!-- Diastolic BP -->
                <div class="flex flex-col">
                  <label for="diastolic_bp" class="text-sm font-medium text-gray-700 dark:text-slate-200">${t("diastolicBpLabel")}</label>
                  <div class="relative">
                    <input type="number" name="diastolic_bp" id="diastolic_bp"
                           class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                  text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           min="30" max="200" required inputmode="numeric">
                    <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm">mmHg</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Biomarkers & Scores -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3"> <span data-i18n-key="biomarkersScores"></span></h3>
              <div class="space-y-4">

                <!-- GFAP -->
                <div class="flex flex-col">
                  <label for="gfap_value" class="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                    <span data-i18n-key="gfapValueLabel"></span>
                    <span class="tooltip relative group cursor-pointer">
                      ℹ️
                      <span class="tooltiptext absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 dark:bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center z-10">
                        ${t("gfapTooltip")}
                      </span>
                    </span>
                  </label>

                  <div class="relative">
                    <input type="number" name="gfap_value" id="gfap_value"
                           class="mt-1 w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700
                                  text-gray-900 dark:text-white rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           min="${GFAP_RANGES.wholeblood.min}" max="${GFAP_RANGES.wholeblood.max}"
                           step="0.1"
                           required>
                    <span class="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 text-sm" data-i18n-key="pgml"></span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-slate-400 mt-1" id="gfap-range-note">
                    <span data-i18n-key="validRange"></span>: <span id="gfap-range-display">${GFAP_RANGES.wholeblood.min}-${GFAP_RANGES.wholeblood.max} pg/mL</span> (<span data-i18n-key="gfapWholeBlood"></span>)
                  </p>
                  <input type="hidden" id="gfap_cartridge_type" value="wholeblood">
                  <input type="hidden" id="gfap_displayed_value" value="">
                </div>

                <!-- FAST-ED Score -->
                <div class="flex flex-col">
                  <label for="fast_ed_score" class="text-sm font-medium text-gray-700 dark:text-slate-200 flex items-center gap-2">
                    ${t("fastEdScoreLabel")}
                      <span class="relative group select-none ml-1 text-gray-400 text-sm align-middle">
                        <!-- Icon -->
                        <span class="pointer-events-none">ℹ️</span>

                        <!-- Tooltip text (to the right of icon) -->
                        <span
                          class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                                bg-gray-800 dark:bg-slate-800 text-white text-xs rounded-lg p-2
                                opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out
                                w-48 text-center z-10 pointer-events-none"
                        >
                          ${t("fastEdCalculatorSubtitle")}
                        </span>
                      </span>
                  </label>
                  <input type="number" name="fast_ed_score" id="fast_ed_score"
                         class="mt-1 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 
                                text-gray-900 dark:text-white rounded-lg px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         min="0" max="9" required readonly placeholder="${t("fastEdCalculatorSubtitle")}">
                  <input type="hidden" name="armparese" id="armparese_hidden" value="false">
                  <input type="hidden" name="eye_deviation" id="eye_deviation_hidden" value="false">
                </div>
              </div>
            </div>

            <!-- Clinical Symptoms -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${t("clinicalSymptoms")}</h3>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="headache" id="headache" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${t("headacheLabel")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="vigilanzminderung" id="vigilanzminderung" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${t("vigilanzLabel")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="beinparese" id="beinparese" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${t("legParesis")}</span>
                </label>
              </div>
            </div>

            <!-- Medical History -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">${t("medicalHistory")}</h3>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="atrial_fibrillation" id="atrial_fibrillation" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${t("atrialFibrillation")}</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="anticoagulated_noak" id="anticoagulated_noak" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300" data-i18n-key="onNoacDoac"></span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" name="antiplatelets" id="antiplatelets" class="accent-blue-600 dark:accent-blue-500 w-4 h-4 rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">${t("onAntiplatelets")}</span>
                </label>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 space-y-3 sm:space-y-0 mt-6">
              <button type="submit" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                ${t("analyzeStrokeRisk")}
              </button>
              <button type="button" class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition" data-action="reset">
                ${t("startOver")}
              </button>
            </div>

          </form>
        </div>
      </div>
  `;
}
