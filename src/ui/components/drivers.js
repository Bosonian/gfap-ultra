import { t } from "../../localization/i18n.js";
import { formatDriverName } from "../../utils/label-formatter.js";
import { normalizeDrivers } from "../../logic/shap.js";

export function renderDriversSection(ich, lvo) {
  // ('=== DRIVER RENDERING SECTION ===');

  if (!ich?.drivers && !lvo?.drivers) {
    // ('❌ No drivers available for rendering');
    return "";
  }

  let html = `
    <div class="drivers-section bg-white p-6 md:p-8 rounded-2xl shadow-sm drivers-section">
      <div class="drivers-header flex flex-col md:flex-row md:items-center md:justify-between gap-3 drivers-header">
        <div class="flex items-start md:items-center gap-3">
          <h3 class="driver-title text-lg md:text-xl font-semibold leading-tight flex items-center gap-2">
            <span class="driver-header-icon text-2xl">🎯</span>
            ${t("riskAnalysis")}
          </h3>
          <p class="drivers-subtitle text-sm text-gray-500 mt-1 md:mt-0">${t("riskAnalysisSubtitle")}</p>
        </div>
        <!-- place for header actions (optional) -->
        <div class="drivers-actions flex items-center gap-2"></div>
      </div>
      <div class="enhanced-drivers-grid flex flex-col gap-4 mt-6 enhanced-drivers-grid">
  `;

  console.log("[Drivers] ICH has drivers:", !!ich?.drivers, ich?.drivers);
  console.log(
    "[Drivers] LVO has drivers:",
    !!lvo?.drivers,
    "notPossible:",
    lvo?.notPossible,
    lvo?.drivers
  );

  if (ich?.drivers) {
    console.log("🧠 Rendering ICH drivers panel");
    html += renderEnhancedDriversPanel(ich.drivers, "ICH", "ich", ich.probability);
  }

  if (lvo?.drivers && !lvo.notPossible) {
    console.log("🩸 Rendering LVO drivers panel");
    html += renderEnhancedDriversPanel(lvo.drivers, "LVO", "lvo", lvo.probability);
  }

  html += `
      </div>
    </div>
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
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center shadow-sm">
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl ${type === "ich" ? "text-blue-500" : "text-red-500"}">
            ${type === "ich" ? "🧠" : "🩸"}
          </div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title} ${t("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t("noDriverData")}</p>
          <p class="italic text-gray-400">${t("driverInfoNotAvailable")}</p>
        </div>
      </div>
    `;
  }

  const driversViewModel = drivers;
  if (driversViewModel.kind === "unavailable") {
    return `
      <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center shadow-sm">
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="text-3xl ${type === "ich" ? "text-blue-500" : "text-red-500"}">
            ${type === "ich" ? "🧠" : "🩸"}
          </div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title} ${t("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t("driverAnalysisUnavailable")}</p>
          <p class="italic text-gray-400">${t("driverAnalysisNotAvailable")}</p>
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

  let html = `
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="text-3xl ${type === "ich" ? "text-blue-500" : "text-red-500"}">
          ${type === "ich" ? "🧠" : "🩸"}
        </div>
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title} ${t("riskFactors")}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">${t("contributingFactors")}</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
  `;

  // ✅ Positive Drivers
  html += `
    <div class="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-700 p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-green-600 dark:text-green-400 text-lg">⬆</span>
        <span class="text-sm font-semibold text-green-700 dark:text-green-300">${t("increaseRisk")}</span>
      </div>
      <div class="space-y-3">
  `;

  const totalPositiveWeight = positiveDrivers.reduce((sum, d) => sum + Math.abs(d.weight), 0);

  if (positiveDrivers.length > 0) {
    positiveDrivers.forEach(driver => {
      const relativeImportance =
        totalPositiveWeight > 0 ? (Math.abs(driver.weight) / totalPositiveWeight) * 100 : 0;
      const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
      const cleanLabel = formatDriverName(driver.label);

      html += `
        <div class="flex justify-between items-center text-sm bg-white dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm border border-green-100 dark:border-green-800">
          <span class="text-gray-700 dark:text-gray-300">${cleanLabel}</span>
          <span class="text-green-600 dark:text-green-400 font-semibold">+${relativeImportance.toFixed(0)}%</span>
        </div>
      `;
    });
  } else {
    html += `<p class="text-sm italic text-gray-500 dark:text-gray-400">${t("noPositiveFactors")}</p>`;
  }

  html += `
      </div>
    </div>
  `;

  // ✅ Negative Drivers
  html += `
    <div class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-red-600 dark:text-red-400 text-lg">⬇</span>
        <span class="text-sm font-semibold text-red-700 dark:text-red-300">${t("decreaseRisk")}</span>
      </div>
      <div class="space-y-3">
  `;

  const totalNegativeWeight = negativeDrivers.reduce((sum, d) => sum + Math.abs(d.weight), 0);

  if (negativeDrivers.length > 0) {
    negativeDrivers.forEach(driver => {
      const relativeImportance =
        totalNegativeWeight > 0 ? (Math.abs(driver.weight) / totalNegativeWeight) * 100 : 0;
      const barWidth = (Math.abs(driver.weight) / maxWeight) * 100;
      const cleanLabel = formatDriverName(driver.label);

      html += `
        <div class="flex justify-between items-center text-sm bg-white dark:bg-gray-800 rounded-md px-3 py-2 shadow-sm border border-red-100 dark:border-red-800">
          <span class="text-gray-700 dark:text-gray-300">${cleanLabel}</span>
          <span class="text-red-600 dark:text-red-400 font-semibold">-${relativeImportance.toFixed(0)}%</span>
        </div>
      `;
    });
  } else {
    html += `<p class="text-sm italic text-gray-500 dark:text-gray-400">${t("noNegativeFactors")}</p>`;
  }

  html += `
      </div>
    </div>
  </div>
</div>
`;

  return html;
}
