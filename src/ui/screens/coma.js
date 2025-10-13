import { renderProgressIndicator } from '../components/progress.js';
import { GFAP_RANGES } from '../../config.js';
import { t } from '../../localization/i18n.js';

export function renderComa() {
  return `

   <div class="container mx-auto px-4 py-8 max-w-lg">
      <!-- Progress -->
      <div class="mb-6">
        ${renderProgressIndicator(2)}
      </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <!-- Title -->
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
             ${t('comaModuleTitle') || 'Coma Module'}
        </h2>

        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-6">
             <form data-module="coma" class="flex flex-col space-y-4">
                <div class="flex flex-col space-y-2">
                  <label for="gfap_value" class="text-gray-700 dark:text-gray-200 font-semibold flex items-center space-x-2">
                    <span>${t('gfapValueLabel')}</span>
                    <span class="relative group cursor-pointer text-gray-400 dark:text-gray-300">
                      ℹ️
                      <span class="absolute left-1/2 transform -translate-x-1/2 -top-8 w-56 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${t('gfapTooltipLong')}
                      </span>
                    </span>
                  </label>
                  <input
                    type="number"
                    id="gfap_value"
                    name="gfap_value"
                    min="${GFAP_RANGES.min}"
                    max="${GFAP_RANGES.max}"
                    step="0.1"
                    required
                    aria-describedby="gfap-help"
                    class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                  <div id="gfap-help" class="text-gray-500 dark:text-gray-400 text-sm">
                    ${t('gfapRange').replace('{min}', GFAP_RANGES.min).replace('{max}', GFAP_RANGES.max)}
                  </div>
                </div>
       
              <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <button
                  type="submit"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  ${t('analyzeIchRisk')}
                </button>
                <button
                  type="button"
                  class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition"
                  data-action="reset"
                >
                  ${t('startOver')}
                </button>
              </div>
            </form>
      </div>
    </div>
  `;
}
