import { t } from "../../localization/i18n.js";
import { formatDriverName } from "../../utils/label-formatter.js";
import { normalizeDrivers } from "../../logic/shap.js";

export function renderDriversSection(ich, lvo) {
  if (!ich?.drivers && !lvo?.drivers) {
    return "";
  }

  let html = `
    <section class="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div class="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          🎯 ${t("riskAnalysis")}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          ${t("riskAnalysisSubtitle")}
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-5 p-5">
  `;

  if (ich?.drivers) {
    html += `
      <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 transition hover:shadow-md">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
            🧠 ICH ${t("drivers")}
          </h4>
          <span class="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
            ${Math.round((ich.probability || 0) * 100)}%
          </span>
        </div>
        ${renderEnhancedDriversPanel(ich.drivers, "ICH", "ich", ich.probability)}
      </div>
    `;
  }

  if (lvo?.drivers && !lvo.notPossible) {
    html += `
      <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 transition hover:shadow-md">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
            🩸 LVO ${t("drivers")}
          </h4>
          <span class="text-sm px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
            ${Math.round((lvo.probability || 0) * 100)}%
          </span>
        </div>
        ${renderEnhancedDriversPanel(lvo.drivers, "LVO", "lvo", lvo.probability)}
      </div>
    `;
  }

  html += `
      </div>
    </section>
  `;

  return html;
}

export function renderDriversPanel(drivers, title, type) {
  if (!drivers || Object.keys(drivers).length === 0) {
    return `
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${type}">${type === "ich" ? "I" : "L"}</span>
          ${title} ${t("riskFactors")}
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver information not available from this prediction model.
        </p>
      </div>
    `;
  }

  const driversViewModel = normalizeDrivers(drivers);

  if (driversViewModel.kind === "unavailable") {
    return `
      <div class="drivers-panel">
        <h4>
          <span class="driver-icon ${type}">${type === "ich" ? "I" : "L"}</span>
          ${title} ${t("riskFactors")}
        </h4>
        <p style="color: var(--text-secondary); font-style: italic;">
          Driver analysis not available for this prediction.
        </p>
      </div>
    `;
  }

  let html = `
    <div class="drivers-panel">
      <h4>
        <span class="driver-icon ${type}">${type === "ich" ? "I" : "L"}</span>
        ${title} Risk Factors
      </h4>
  `;

  // Calculate relative importance for legacy panel
  const totalPositiveWeightLegacy = driversViewModel.positive.reduce(
    (sum, d) => sum + Math.abs(d.weight),
    0
  );
  const totalNegativeWeightLegacy = driversViewModel.negative.reduce(
    (sum, d) => sum + Math.abs(d.weight),
    0
  );

  // Show positive drivers (increase risk)
  if (driversViewModel.positive.length > 0) {
    driversViewModel.positive.forEach(driver => {
      const relativeImportance =
        totalPositiveWeightLegacy > 0
          ? (Math.abs(driver.weight) / totalPositiveWeightLegacy) * 100
          : 0;
      const width = Math.min(relativeImportance * 2, 100); // Scale for visualization
      html += `
        <div class="driver-item">
          <span class="driver-label">${driver.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar positive" style="width: ${width}%">
              <span class="driver-value">+${relativeImportance.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Show negative drivers (decrease risk)
  if (driversViewModel.negative.length > 0) {
    driversViewModel.negative.forEach(driver => {
      const relativeImportance =
        totalNegativeWeightLegacy > 0
          ? (Math.abs(driver.weight) / totalNegativeWeightLegacy) * 100
          : 0;
      const width = Math.min(relativeImportance * 2, 100); // Scale for visualization
      html += `
        <div class="driver-item">
          <span class="driver-label">${driver.label}</span>
          <div class="driver-bar-container">
            <div class="driver-bar negative" style="width: ${width}%">
              <span class="driver-value">-${relativeImportance.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Show metadata if available
  if (driversViewModel.meta && Object.keys(driversViewModel.meta).length > 0) {
    html += `
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <small style="color: var(--text-secondary);">
    `;

    if (driversViewModel.meta.base_value !== undefined) {
      html += `Base value: ${driversViewModel.meta.base_value.toFixed(2)} `;
    }
    if (driversViewModel.meta.contrib_sum !== undefined) {
      html += `Contrib sum: ${driversViewModel.meta.contrib_sum.toFixed(2)} `;
    }
    if (driversViewModel.meta.logit_total !== undefined) {
      html += `Logit total: ${driversViewModel.meta.logit_total.toFixed(2)}`;
    }

    html += `
        </small>
      </div>
    `;
  }

  html += "</div>";
  return html;
}

export function renderEnhancedDriversPanel(drivers, title, type, probability) {
  if (!drivers || Object.keys(drivers).length === 0) {
    return `
      <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="text-3xl">${type === "ich" ? "🩸" : "🧠"}</div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title} ${t("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t("driverInfoNotAvailable")}</p>
        </div>
      </div>
    `;
  }

  const driversViewModel = drivers;

  if (driversViewModel.kind === "unavailable") {
    return `
      <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="text-3xl">${type === "ich" ? "🩸" : "🧠"}</div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title} ${t("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t("driverAnalysisNotAvailable")}</p>
        </div>
      </div>
    `;
  }

  const positiveDrivers = (driversViewModel.positive || [])
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 3);

  const negativeDrivers = (driversViewModel.negative || [])
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 3);

  const maxWeight = Math.max(
    ...positiveDrivers.map(d => Math.abs(d.weight)),
    ...negativeDrivers.map(d => Math.abs(d.weight)),
    0.01
  );

  const renderDriverBar = (driver, sign, colorFrom, colorTo) => {
    const cleanLabel = formatDriverName(driver.label);
    const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
    const relativeImportance = barWidth.toFixed(0);

    return `
      <div class="mb-3">
        <div class="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>${cleanLabel}</span>
          <span class="font-medium">${sign}${relativeImportance}%</span>
        </div>
        <div class="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 mt-1">
          <div class="h-2 rounded-full bg-gradient-to-r from-${colorFrom}-400 to-${colorTo}-600 dark:from-${colorFrom}-500 dark:to-${colorTo}-700" style="width: ${barWidth}%"></div>
        </div>
      </div>
    `;
  };

  return `
    <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition hover:shadow-md">
      <div class="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-700 pb-3">
        <div class="text-3xl">${type === "ich" ? "🩸" : "🧠"}</div>
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title} ${t("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t("contributingFactors")}</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Increasing Risk -->
        <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-red-600 dark:text-red-400 text-lg">↑</span>
            <span class="font-semibold text-red-700 dark:text-red-300">${t("increaseRisk")}</span>
          </div>
          ${
            positiveDrivers.length
              ? positiveDrivers.map(d => renderDriverBar(d, "+", "red", "rose")).join("")
              : `<p class="text-gray-500 italic">${t("noPositiveFactors")}</p>`
          }
        </div>

        <!-- Decreasing Risk -->
        <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-blue-600 dark:text-blue-400 text-lg">↓</span>
            <span class="font-semibold text-blue-700 dark:text-blue-300">${t("decreaseRisk")}</span>
          </div>
          ${
            negativeDrivers.length
              ? negativeDrivers.map(d => renderDriverBar(d, "-", "blue", "indigo")).join("")
              : `<p class="text-gray-500 italic">${t("noNegativeFactors")}</p>`
          }
        </div>
      </div>
    </div>
  `;
}
