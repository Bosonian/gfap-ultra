import { renderProgressIndicator } from "../components/progress.js";
import { renderCriticalAlert, renderCriticalLvoAlert } from "../components/alerts.js";
import { renderDriversSection } from "../components/drivers.js";
import { renderStrokeCenterMap } from "../components/stroke-center-map.js";
import { getRiskLevel } from "../../logic/formatters.js";
import { CRITICAL_THRESHOLDS } from "../../config.js";
import { t, i18n } from "../../localization/i18n.js";
import { store } from "../../state/store.js";
import {
  formatSummaryLabel,
  formatDisplayValue,
  formatDriverName,
} from "../../utils/label-formatter.js";
import {
  estimateVolumeFromGFAP,
  estimateMortalityFromVolume,
} from "../../logic/ich-volume-calculator.js";
import {
  renderCircularBrainDisplay,
  initializeVolumeAnimations,
} from "../components/brain-visualization.js";
import { calculateLegacyICH } from "../../research/legacy-ich-model.js";
import { safeLogResearchData, isResearchModeEnabled } from "../../research/data-logger.js";
import { renderModelComparison, renderResearchToggle } from "../../research/comparison-ui.js";
import { escapeHTML } from "../../security/html-sanitizer.js";
import { detectKioskMode } from "../../logic/kiosk-loader.js";

function renderInputSummary() {
  const { formData } = store.getState() || {};

  if (!formData || Object.keys(formData).length === 0) return "";

  let summaryHtml = Object.entries(formData)
    .map(([module, data]) => {
      if (!data || Object.keys(data).length === 0) return "";

      const moduleTitle =
        t(`${module}ModuleTitle`) || module.charAt(0).toUpperCase() + module.slice(1);

      const itemsHtml = Object.entries(data)
        .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        .filter(([key, _]) => key !== "gfap_cartridge_type")
        .map(([key, value]) => {
          const label = formatSummaryLabel(key);
          const displayValue = formatDisplayValue(value, key);
          const displayType = displayValue.type ? displayValue.type : "";
          let displayHtml = "<span>" + displayType + "</span>";
          if (displayType == "pg/mL") {
            displayHtml = "<span data-i18n-key='pgml'></span>";
          }
          return `
            <div class="summary-item flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
              <span class="summary-label text-gray-600 dark:text-gray-300 font-medium"><span data-i18n-key="${label}"></span></span>
              <span class="summary-value text-gray-900 dark:text-gray-100 font-semibold">${displayValue.value} ${displayHtml}</span>
            </div>
          `;
        })
        .join("");

      if (!itemsHtml) return "";

      return `
        <div class="summary-module bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 transition-all duration-200 hover:shadow-md">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span class="text-blue-600 dark:text-blue-400">🩺</span> ${moduleTitle}
          </h4>
          <div class="summary-items divide-y divide-gray-200 dark:divide-gray-700">
            ${itemsHtml}
          </div>
        </div>
      `;
    })
    .join("");

  if (!summaryHtml) return "";

  return `
    <div class="">
      <div class="summary-content space-y-5">
        ${summaryHtml}
      </div>
    </div>
  `;
}

function renderRiskCard(type, data, results) {
  if (!data) {
    console.log(`[RiskCard] No data for ${type}`);
    return "";
  }

  const percent = Math.round((data.probability || 0) * 100);
  console.log(`[RiskCard] ${type} - probability: ${data.probability}, percent: ${percent}%`);

  const riskLevel = getRiskLevel(percent, type);
  const isCritical = percent > 70; // Very high risk threshold
  const isHigh = percent > CRITICAL_THRESHOLDS[type].high;

  const icons = { ich: "🩸", lvo: "🧠" };
  const titles = { ich: t("ichProbability"), lvo: t("lvoProbability") };

  const level = isCritical ? "critical" : isHigh ? "high" : "normal";

  return `
   <div class="enhanced-risk-card ${type} ${level} bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="risk-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <div class="risk-icon text-3xl">${icons[type]}</div>
          <div class="risk-title">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${titles[type]}</h3>
          </div>
      </div>
      <!-- Probability Section -->
      <div class="risk-probability flex flex-col items-center">
          <div class="circles-container flex flex-col items-center">
            <div class="rings-row flex justify-center">
                <div class="circle-item flex flex-col items-center">
                  <!-- React ring mount -->
                  <div
                      class="probability-circle w-28 h-28 relative flex items-center justify-center"
                      data-react-ring
                      data-percent="${percent}"
                      data-level="${level}"
                      >
                      <svg viewBox="0 0 120 120" class="probability-svg w-full h-full absolute top-0 left-0">
                        <circle
                            cx="60" cy="60" r="50"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            stroke-width="8"
                            />
                        <circle
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke="${level === "critical" ? "#ff4444" : level === "high" ? "#ff8800" : "#0066cc"}"
                        stroke-width="8"
                        stroke-dasharray="${Math.PI * 100}"
                        stroke-dashoffset="${Math.PI * 100 * (1 - percent / 100)}"
                        stroke-linecap="round"
                        transform="rotate(-90 60 60)"
                        />
                        <text
                            x="60" y="60"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            class="probability-text fill-white font-bold text-xl"
                            >
                            ${percent}%
                        </text>
                      </svg>
                  </div>
                  <!-- Label -->
                  <div class="circle-label text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">
                      ${type === "ich" ? "ICH Risk" : "LVO Risk"}
                  </div>
                </div>
            </div>
            <!-- Risk Level -->
            <div class="risk-level ${level} text-center mt-4 px-3 py-1 rounded-full text-sm font-semibold
            ${
              level === "critical"
                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                : level === "high"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            }">
            ${riskLevel}
          </div>
      </div>
    </div>
</div>
  `;
}

/**
 * Render ICH volume display for integration into risk card
 * @param {object} data - ICH risk data containing GFAP value
 * @returns {string} HTML for volume display
 */
function renderICHVolumeDisplay(data) {
  const gfapValue = data.gfap_value || getCurrentGfapValue();
  if (!gfapValue || gfapValue <= 0) return "";

  const estVolume = estimateVolumeFromGFAP(gfapValue);
  return `
    <div class="volume-display-container">
      ${renderCircularBrainDisplay(estVolume)}
    </div>
  `;
}

/**
 * Get current GFAP value from form data
 * @returns {number} GFAP value or 0 if not available
 */
function getCurrentGfapValue() {
  const state = store.getState();
  const { formData } = state;

  // Check all modules for GFAP value
  for (const module of ["coma", "limited", "full"]) {
    if (formData[module]?.gfap_value) {
      return parseFloat(formData[module].gfap_value);
    }
  }

  return 0;
}

function renderLVONotPossible() {
  return `
    <div class="enhanced-risk-card lvo not-possible">
      <div class="risk-header">
        <div class="risk-icon">🔍</div>
        <div class="risk-title">
          <h3>${t("lvoProbability")}</h3>
          <span class="risk-module">${t("limitedAssessment")}</span>
        </div>
      </div>
      
      <div class="not-possible-content">
        <p>${t("lvoNotPossible")}</p>
        <p>${t("fullExamRequired")}</p>
      </div>
    </div>
  `;
}

export function renderResults(results, startTime) {
  try {
    // Add error handling for missing results
    if (!results) {
      console.error("renderResults: No results data provided");
      return `
        <div class="container">
          <div class="error-message">
            <h2>No Results Available</h2>
            <p>Please complete an assessment first.</p>
            <button class="primary" onclick="window.location.reload()">Start Over</button>
          </div>
        </div>
      `;
    }

    const { ich, lvo } = results;

    // Determine current module
    const currentModule = getCurrentModuleName(ich);

    // Calculate legacy model for research comparison (only for stroke modules)
    const legacyResults = currentModule !== "coma" ? calculateLegacyFromResults(results) : null;

    // Debug logging for research mode

    // Log research data if research mode is enabled (background, non-breaking)
    if (legacyResults && isResearchModeEnabled(currentModule)) {
      safeLogResearchData(ich, legacyResults, getPatientInputs());
    }

    // Detect which module was used based on the data
    const isLimitedOrComa =
      ich?.module === "Limited" || ich?.module === "Coma" || lvo?.notPossible === true;
    const isFullModule = ich?.module === "Full Stroke" || ich?.module?.includes("Full");

    let resultsHtml;

    // Debug logging
    console.log("[Results] ICH data:", ich);
    console.log("[Results] LVO data:", lvo);
    console.log("[Results] ICH module:", ich?.module);
    console.log("[Results] isLimitedOrComa:", isLimitedOrComa);
    console.log("[Results] isFullModule:", isFullModule);

    // For limited/coma modules - only show ICH
    if (isLimitedOrComa) {
      resultsHtml = renderICHFocusedResults(ich, results, startTime, legacyResults, currentModule);
    } else {
      // For full module - show ICH prominently with conditional LVO text
      resultsHtml = renderFullModuleResults(
        ich,
        lvo,
        results,
        startTime,
        legacyResults,
        currentModule
      );
    }

    // Initialize animations after DOM update
    setTimeout(async () => {
      console.log("[Results] Initializing volume animations...");
      initializeVolumeAnimations();
      try {
        const { mountIslands } = await import("../../react/mountIslands.jsx");
        mountIslands();
      } catch (err) {
        // ('React islands not available:', err);
      }
    }, 100);

    return resultsHtml;
  } catch (error) {
    console.error("Error in renderResults:", error);
    return `
      <div class="container">
        <div class="error-message">
          <h2>Error Displaying Results</h2>
          <p>There was an error displaying the results. Error: ${error.message}</p>
          <button class="primary" onclick="window.location.reload()">Start Over</button>
        </div>
      </div>
    `;
  }
}

export function renderICHFocusedResults(ich, results, startTime, legacyResults, currentModule) {
  // Detect kiosk mode
  const kioskMode = detectKioskMode();
  const isKioskMode = kioskMode.isKioskMode;

  const criticalAlert = ich && ich.probability > 0.7 ? renderCriticalAlert() : "";
  const ichPercentLocal = Math.round((ich?.probability || 0) * 100);
  const strokeCenterHtml = renderStrokeCenterMap(results);
  const inputSummaryHtml = renderInputSummary();
  const researchToggleHtml = isResearchModeEnabled(currentModule) ? renderResearchToggle() : "";
  const researchComparisonHtml =
    legacyResults && isResearchModeEnabled(currentModule)
      ? renderModelComparison(ich, legacyResults, getPatientInputs())
      : "";

  const alternativeDiagnosesHtml =
    ich?.module === "Coma" ? renderComaAlternativeDiagnoses(ich.probability) : "";

  const strokeDifferentialHtml =
    ich?.module !== "Coma" ? renderStrokeDifferentialDiagnoses(ich.probability) : "";

  return `
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Progress -->
      <div class="mb-8">
        ${renderProgressIndicator(3)}
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        ${t("bleedingRiskAssessment") || "Blutungsrisiko-Bewertung / Bleeding Risk Assessment"}
      </h2>

      <!-- Critical Alert -->
      ${criticalAlert ? `<div class="mb-6">${criticalAlert}</div>` : ""}

      <!-- ICH Risk Card -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-6">
        ${renderRiskCard("ich", ich, results)}
      </div>

      <!-- ICH Volume (Coma only) -->
      ${
        ich?.module === "Coma" && ichPercentLocal >= 50
          ? `
          <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-6">
            ${renderVolumeCard(ich)}
          </div>
        `
          : ""
      }

      <!-- Alternative Diagnoses (Coma) -->
      ${alternativeDiagnosesHtml ? `<div class="mb-6">${alternativeDiagnosesHtml}</div>` : ""}

      <!-- Stroke Differential Diagnoses -->
      ${strokeDifferentialHtml ? `<div class="mb-6">${strokeDifferentialHtml}</div>` : ""}

      <!-- Research Comparison -->
      ${researchComparisonHtml ? `<div class="mb-6">${researchComparisonHtml}</div>` : ""}

      <!-- ICH Drivers (non-Coma) -->
      ${
        ich?.module !== "Coma"
          ? `
          <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6 transition-all duration-300 hover:shadow-lg">
          <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
            <span class="text-3xl">⚡</span>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"> ${t("riskFactorsTitle") || "Hauptrisikofaktoren / Main Risk Factorss"}</h3>
          </div>
           ${renderICHDriversOnly(ich)}
        </div>`
          : ""
      }

      <!-- Collapsible Sections -->
      <div class="space-y-4 mb-8">
        <!-- Input Summary -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition info-toggle"
            data-target="input-summary">
            <div class="flex items-center gap-2">
              <span class="text-xl">📋</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${t("inputSummaryTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="input-summary" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4">
            ${inputSummaryHtml}
          </div>
        </div>

        <!-- Stroke Centers -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="info-toggle w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            data-target="stroke-centers">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏥</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${t("nearestCentersTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="stroke-centers" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4 my-3">
            ${strokeCenterHtml}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
      ${
        isKioskMode
          ? `
    <!-- 🖥️ Kiosk Mode: Simple navigation back to case list -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        data-action="kiosk-home"
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
      >
        🏠 ${t("backToCaseList")}
      </button>

      <button
        type="button"
        id="printResults"
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        📄 ${t("printResults")}
      </button>
    </div>
  `
          : `
    <!-- 🌐 Normal Mode: Full actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      <!-- Primary Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          id="shareToKiosk"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition"
        >
          🚀 ${t("sendToHospital")}
        </button>

        <button
          type="button"
          id="shareCaseLink"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
        >
          📲 ${t("shareCase")}
        </button>

        <button
          type="button"
          id="printResults"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          📄 ${t("printResults")}
        </button>

        <button
          type="button"
          data-action="reset"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm font-medium border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition"
        >
          ${t("newAssessment")}
        </button>
      </div>

      <!-- Navigation Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-action="goBack"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ← ${t("goBack")}
        </button>

        <button
          type="button"
          data-action="goHome"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          🏠 ${t("goHome")}
        </button>
      </div>
    </div>
  `
      }
      </div>

      <!-- Disclaimer -->
      <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-xl text-sm text-yellow-800 dark:text-yellow-100 mb-6">
        <strong>⚠️ ${t("importantNote")}:</strong> ${t("importantText")} 
        <span class="block mt-1 text-xs opacity-80">Results generated at ${new Date().toLocaleTimeString()}.</span>
      </div>

      <!-- Bibliography -->
      <div class="mt-6">${renderBibliography(ich)}</div>

      <!-- Research Toggle -->
      ${researchToggleHtml ? `<div class="mt-6">${researchToggleHtml}</div>` : ""}
    </div>
  `;
}

function renderFullModuleResults(ich, lvo, results, startTime, legacyResults, currentModule) {
  const kioskMode = detectKioskMode();
  const isKioskMode = kioskMode.isKioskMode;
  const ichPercent = Math.round((ich?.probability || 0) * 100);
  const lvoPercent = Math.round((lvo?.probability || 0) * 100);

  console.log("[FullModuleResults] ICH probability:", ich?.probability, "-> %:", ichPercent);
  console.log("[FullModuleResults] LVO probability:", lvo?.probability, "-> %:", lvoPercent);

  const criticalIchAlert = ich && ich.probability > 0.7 ? renderCriticalAlert() : "";
  const criticalLvoAlert = lvo && lvo.probability > 0.7 ? renderCriticalLvoAlert() : "";
  const strokeCenterHtml = renderStrokeCenterMap(results);
  const inputSummaryHtml = renderInputSummary();
  const researchToggleHtml = isResearchModeEnabled(currentModule) ? renderResearchToggle() : "";
  const researchComparisonHtml =
    legacyResults && isResearchModeEnabled(currentModule)
      ? renderModelComparison(ich, legacyResults, getPatientInputs())
      : "";

  // Get FAST-ED score from form data to determine LVO display
  const state = store.getState();
  const fastEdScore = parseInt(state.formData?.full?.fast_ed_score) || 0;

  // Ensure we only show LVO in full module and when LVO data is available
  const isFullModule = currentModule === "full" || ich?.module === "Full";
  const hasValidLVO = lvo && typeof lvo.probability === "number" && !lvo.notPossible;
  const showLVORiskCard = isFullModule && fastEdScore > 3 && hasValidLVO;

  // ('  Conditions: isFullModule:', isFullModule);
  // ('  Conditions: fastEdScore > 3:', fastEdScore > 3);
  // ('  Conditions: hasValidLVO:', hasValidLVO);
  // ('  Show LVO Card:', showLVORiskCard);

  // Determine layout configuration
  const showVolumeCard = ichPercent >= 50;
  const maxProbability = Math.max(ichPercent, lvoPercent);
  // Robust ratio for gating (avoid divide-by-zero)
  const eps = 0.5;
  const ratio = lvoPercent / Math.max(ichPercent, eps);
  const inRatioBand = ratio >= 0.6 && ratio <= 1.7;
  // Strong-signal gate: both ICH and LVO at least 50%, and ratio in an informative band
  const showTachometer = isFullModule && ichPercent >= 50 && lvoPercent >= 50 && inRatioBand;
  const showDominanceBanner = isFullModule && ichPercent >= 50 && lvoPercent >= 50 && !inRatioBand;
  // DEBUG: Temporary relaxed conditions for testing
  const debugShowTachometer = isFullModule && ichPercent >= 30 && lvoPercent >= 30;

  // Calculate number of cards and layout class
  let cardCount = 1; // Always have ICH
  // No placeholder needed - only show LVO card when FAST-ED > 3
  if (showLVORiskCard) {
    cardCount++;
  }
  if (showVolumeCard) {
    cardCount++;
  }

  const layoutClass =
    cardCount === 1
      ? "risk-results-single"
      : cardCount === 2
        ? "risk-results-dual"
        : "risk-results-triple";

  // Add differential diagnoses for stroke modules
  const strokeDifferentialHtml = renderStrokeDifferentialDiagnoses(ich.probability);

  return `
     <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Progress -->
      <div class="mb-8">
        ${renderProgressIndicator(3)}
      </div>
      <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
        ${t("resultsTitle")}
      </h2>
      ${criticalIchAlert}
      ${criticalLvoAlert}

      <!-- Risk Assessment Display -->
      <div class="${layoutClass} gap-1 flex flex-col flex-wrap justify-center items-stretch mb-6">
        ${renderRiskCard("ich", ich, results)}
        ${showLVORiskCard ? renderRiskCard("lvo", lvo, results) : ""}
        ${showVolumeCard ? renderVolumeCard(ich) : ""}
      </div>
      
      <!-- Treatment Decision Gauge (when strong signal) -->
      ${debugShowTachometer ? renderTachometerGauge(ichPercent, lvoPercent) : ""}
      ${!debugShowTachometer && showDominanceBanner ? renderDominanceBanner(ichPercent, lvoPercent, ratio) : ""}
      
      <!-- Differential Diagnoses for Stroke Modules -->
      ${strokeDifferentialHtml}
      
      <!-- Research Model Comparison (hidden unless research mode) -->
      ${researchComparisonHtml}
      
      <!-- Risk Factor Drivers -->
      <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6 transition-all duration-300 hover:shadow-lg">
        <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <span class="text-3xl">⚡</span>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100"> ${t("riskFactorsTitle") || "Risikofaktoren / Risk Factors"}</h3>
        </div>
      ${showLVORiskCard ? renderDriversSection(ich, lvo) : renderICHDriversOnly(ich)}
      </div>
      
      <!-- Collapsible Additional Information -->
      <div class="space-y-4 mb-8">
        <!-- Input Summary -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition info-toggle"
            data-target="input-summary">
            <div class="flex items-center gap-2">
              <span class="text-xl">📋</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${t("inputSummaryTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="input-summary" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4">
            ${inputSummaryHtml}
          </div>
        </div>

        <!-- Stroke Centers -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button 
            class="info-toggle w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            data-target="stroke-centers">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏥</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${t("nearestCentersTitle")}</span>
            </div>
            <span class="text-gray-600 dark:text-gray-300">▼</span>
          </button>
          <div id="stroke-centers" class="collapsible-content hidden bg-white dark:bg-gray-800 p-4">
            ${strokeCenterHtml}
          </div>
        </div>
      </div>
      
       <!-- Actions --> 
     <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
    ${
      isKioskMode
        ? `
    <!-- 🖥️ Kiosk Mode: Simple navigation back to case list -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        data-action="kiosk-home"
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
      >
        🏠 ${t("backToCaseList")}
      </button>

      <button
        type="button"
        id="printResults"
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        📄 ${t("printResults")}
      </button>
    </div>
  `
        : `
    <!-- 🌐 Normal Mode: Full actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      <!-- Primary Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          id="shareToKiosk"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition"
        >
          🚀 ${t("sendToHospital")}
        </button>

        <button
          type="button"
          id="shareCaseLink"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
        >
          📲 ${t("shareCase")}
        </button>

        <button
          type="button"
          id="printResults"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          📄 ${t("printResults")}
        </button>

        <button
          type="button"
          data-action="reset"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm font-medium border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition"
        >
          ${t("newAssessment")}
        </button>
      </div>

      <!-- Navigation Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-action="goBack"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ← ${t("goBack")}
        </button>

        <button
          type="button"
          data-action="goHome"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          🏠 ${t("goHome")}
        </button>
      </div>
    </div>
  `
    }
    </div>

      </div>

      <!-- Disclaimer -->
      <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-xl text-sm text-yellow-800 dark:text-yellow-100 mb-6">
        <strong>⚠️ ${t("importantNote")}:</strong> ${t("importantText")} 
        <span class="block mt-1 text-xs opacity-80">Results generated at ${new Date().toLocaleTimeString()}.</span>
      </div>

      <!-- Bibliography -->
      <div class="mt-6">${renderBibliography(ich)}</div>

      <!-- Research Toggle -->
      ${researchToggleHtml ? `<div class="mt-6">${researchToggleHtml}</div>` : ""}
    </div>
  `;
}

function renderLVONotification() {
  return `
    <div class="secondary-notification">
      <p class="lvo-possible">
        ⚡ ${t("lvoMayBePossible") || "Großgefäßverschluss möglich / Large vessel occlusion possible"}
      </p>
    </div>
  `;
}

function renderDominanceBanner(ichPercent, lvoPercent, ratio) {
  const dominant = ratio > 1 ? "LVO" : "ICH";
  const icon = dominant === "LVO" ? "🧠" : "🩸";
  const dominantText =
    i18n.getCurrentLanguage() === "de"
      ? dominant === "LVO"
        ? "LVO-dominant"
        : "ICH-dominant"
      : dominant === "LVO"
        ? "LVO dominant"
        : "ICH dominant";
  const subtitle =
    i18n.getCurrentLanguage() === "de"
      ? `Verhältnis LVO/ICH: ${ratio.toFixed(2)}`
      : `LVO/ICH ratio: ${ratio.toFixed(2)}`;
  return `
    <div class="tachometer-section w-full my-6">
      <div class="tachometer-card">
        <div class="treatment-recommendation ${dominant === "LVO" ? "lvo-dominant" : "ich-dominant"}">
          <div class="recommendation-icon">${icon}</div>
          <div class="recommendation-text">
            <h4>${dominantText}</h4>
            <p>${subtitle}</p>
          </div>
          <div class="probability-summary">
            ICH: ${ichPercent}% | LVO: ${lvoPercent}%
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderICHDriversOnly(ich) {
  if (!ich || !ich.drivers) {
    return `
      <div class="no-drivers text-center py-6 text-gray-500 dark:text-gray-400 italic">
        No driver data available
      </div>
    `;
  }

  const { positive = [], negative = [] } = ich.drivers || {};

  if (!Array.isArray(positive) && !Array.isArray(negative)) {
    return `
      <div class="no-drivers text-center py-6 text-red-500 dark:text-red-400 font-medium">
        Driver format error
      </div>
    `;
  }

  return `
    <div class="drivers-split-view grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
      
      <!-- Positive Drivers -->
      <div class="drivers-column positive-column rounded-2xl bg-gradient-to-br from-green-50 to-white dark:from-green-950/40 dark:to-gray-900 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div class="column-header flex items-center gap-2 px-5 py-3 border-b border-green-100 dark:border-green-800">
          <span class="column-icon text-green-600 dark:text-green-400 text-xl">⬆</span>
          <span class="column-title font-semibold text-green-800 dark:text-green-200 tracking-wide uppercase text-sm">
            ${t("increasingRisk") || "Increasing Risk"}
          </span>
        </div>
        <div class="compact-drivers p-4 space-y-2">
          ${
            positive.length > 0
              ? positive
                  .slice(0, 5)
                  .map(d => renderCompactDriver(d, "positive"))
                  .join("")
              : `<p class="no-factors text-gray-500 dark:text-gray-400 italic text-sm"> 
                  ${t("noFactors") || "No factors"} 
                 </p>`
          }
        </div>
      </div>

      <!-- Negative Drivers -->
      <div class="drivers-column negative-column rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-gray-900 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div class="column-header flex items-center gap-2 px-5 py-3 border-b border-blue-100 dark:border-blue-800">
          <span class="column-icon text-blue-600 dark:text-blue-400 text-xl">⬇</span>
          <span class="column-title font-semibold text-blue-800 dark:text-blue-200 tracking-wide uppercase text-sm">
            ${t("decreasingRisk") || "Decreasing Risk"}
          </span>
        </div>
        <div class="compact-drivers p-4 space-y-2">
          ${
            negative.length > 0
              ? negative
                  .slice(0, 5)
                  .map(d => renderCompactDriver(d, "negative"))
                  .join("")
              : `<p class="no-factors text-gray-500 dark:text-gray-400 italic text-sm">
                  ${t("noFactors") || "No factors"}
                 </p>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderCompactDriver(driver, type) {
  const percentage = Math.abs(driver.weight * 100).toFixed(1);
  const isPositive = type === "positive";

  const textColor = isPositive
    ? "text-green-700 dark:text-green-300"
    : "text-blue-700 dark:text-blue-300";

  const borderColor = isPositive
    ? "border-green-300 dark:border-green-600"
    : "border-blue-300 dark:border-blue-600";

  const bgColor = isPositive
    ? "bg-green-50 dark:bg-green-950/40"
    : "bg-blue-50 dark:bg-blue-950/40";

  return `
    <div class="compact-driver-item flex justify-between items-center ${bgColor} border ${borderColor} rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="compact-driver-label text-sm font-medium ${textColor}">
        ${formatDriverName(driver.label)}
      </div>
      <div class="compact-driver-value text-sm font-semibold ${textColor}">
        ${escapeHTML(percentage)}%
      </div>
    </div>
  `;
}

/**
 * Render bibliography footer with research citations
 * @param {object} ichData - ICH risk data containing probability
 * @returns {string} HTML for bibliography section
 */
function renderBibliography(ichData) {
  if (!ichData || !ichData.probability) return "";

  const ichPercent = Math.round((ichData.probability || 0) * 100);
  if (ichPercent < 50) return "";

  const gfapValue = getCurrentGfapValue();
  if (!gfapValue || gfapValue <= 0) return "";

  return `
    <div class="my-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-5 shadow-sm">
      <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        📚 ${t("references")}
      </h4>
      
      <div class="space-y-3">
        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">¹</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Broderick et al. (1993). <em>Volume of intracerebral hemorrhage: A powerful and easy-to-use predictor of 30-day mortality.</em> Stroke, 24(7), 987–993.
          </p>
        </div>

        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">²</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Krishnan et al. (2013). <em>Hematoma expansion in intracerebral hemorrhage: Predictors and outcomes.</em> Neurology, 81(19), 1660–1666.
          </p>
        </div>

        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">³</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Putra et al. (2020). <em>Functional outcomes and mortality in patients with intracerebral hemorrhage.</em> Critical Care Medicine, 48(3), 347–354.
          </p>
        </div>

        <div class="flex items-start gap-2">
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">⁴</span>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Tangella et al. (2020). <em>Early prediction of mortality in intracerebral hemorrhage using clinical markers.</em> Journal of Neurocritical Care, 13(2), 89–97.
          </p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Calculate legacy model results from current results data (background, non-breaking)
 * @param {object} results - Main model results
 * @returns {object|null} - Legacy model results or null if not possible
 */
function calculateLegacyFromResults(results) {
  try {
    const patientInputs = getPatientInputs();

    if (!patientInputs.age || !patientInputs.gfap) {
      // console.log('🔍 Missing required inputs for legacy model:', {
      //  age: patientInputs.age,
      //  gfap: patientInputs.gfap,
      // });
      return null;
    }

    const legacyResult = calculateLegacyICH(patientInputs);

    return legacyResult;
  } catch (error) {
    // console.log('Legacy model calculation failed (non-critical):', error);
    return null;
  }
}

/**
 * Get patient input data from store for research logging
 * @returns {object} - Patient input data
 */
function getPatientInputs() {
  const state = store.getState();
  const { formData } = state;

  // Extract age and GFAP from any module
  let age = null;
  let gfap = null;

  for (const module of ["coma", "limited", "full"]) {
    if (formData[module]) {
      age = age || formData[module].age_years;
      gfap = gfap || formData[module].gfap_value;
    }
  }

  const result = {
    age: parseInt(age) || null,
    gfap: parseFloat(gfap) || null,
  };

  return result;
}

/**
 * Render alternative diagnoses for coma module
 * @param {number} probability - ICH probability (0-1)
 * @returns {string} HTML for alternative diagnoses
 */

function renderStrokeDifferentialDiagnoses(probability) {
  const percent = Math.round(probability * 100);
  if (percent <= 25) return "";

  return `
    <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6 transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <span class="lightning-icon text-2xl text-yellow-500">⚡</span>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          ${t("differentialDiagnoses")}
        </h3>
      </div>

      <!-- Content -->
      <div class="diagnosis-content space-y-4">
        <!-- Clinical Action Heading -->
        <h4 class="clinical-action-heading text-base font-medium text-blue-600 dark:text-blue-400">
          ${t("reconfirmTimeWindow")}
        </h4>

        <!-- Diagnosis List -->
        <ul class="diagnosis-list list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-2">
          <li><span data-i18n-key="unclearTimeWindow"></span></li>
          <li><span data-i18n-key="rareDiagnoses"></span></li>
        </ul>
      </div>
    </div>
  `;
}

function renderComaAlternativeDiagnoses(probability) {
  const percent = Math.round(probability * 100);
  const isDE = i18n.getCurrentLanguage() === "de";

  const isHigh = percent > 25;

  const title = isDE ? "Differentialdiagnosen" : "Differential Diagnoses";

  const highRiskList = [
    isDE
      ? "Alternative Diagnosen sind SAB, SDH, EDH (Subarachnoidalblutung, Subduralhämatom, Epiduralhämatom)"
      : "Alternative diagnoses include SAH, SDH, EDH (Subarachnoid Hemorrhage, Subdural Hematoma, Epidural Hematoma)",
    isDE
      ? "Bei unklarem Zeitfenster seit Symptombeginn oder im erweiterten Zeitfenster kommen auch ein demarkierter Infarkt oder hypoxischer Hirnschaden in Frage"
      : "In cases of unclear time window since symptom onset or extended time window, demarcated infarction or hypoxic brain injury should also be considered",
  ];

  const lowRiskList = [
    isDE
      ? "Alternative Diagnose von Vigilanzminderung wahrscheinlich"
      : "Alternative diagnosis for reduced consciousness likely",
    isDE
      ? "Ein Verschluss der Arteria Basilaris ist nicht ausgeschlossen"
      : "Basilar artery occlusion cannot be excluded",
  ];

  const listItems = (isHigh ? highRiskList : lowRiskList)
    .map(item => `<li class="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">${item}</li>`)
    .join("");

  return `
    <div class="alternative-diagnosis-card bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-lg">
      <!-- Header -->
      <div class="diagnosis-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <span class="text-3xl">⚡</span>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${title}</h3>
      </div>

      <!-- Content -->
      <div class="diagnosis-content">
        <ul class="diagnosis-list list-disc pl-5">
          ${listItems}
        </ul>
      </div>
    </div>
  `;
}

/**
 * Get current module name from results
 * @param {object} ich - ICH results containing module information
 * @returns {string} - Module name ('coma', 'limited', 'full')
 */
function getCurrentModuleName(ich) {
  if (!ich?.module) {
    return "unknown";
  }

  const module = ich.module.toLowerCase();
  if (module.includes("coma")) {
    return "coma";
  }
  if (module.includes("limited")) {
    return "limited";
  }
  if (module.includes("full")) {
    return "full";
  }

  return "unknown";
}

/**
 * Render volume as a standalone risk card (for horizontal layout)
 * @param {object} ichData - ICH data containing volume information
 * @returns {string} HTML for volume risk card
 */
function renderVolumeCard(ichData) {
  const gfapValue = getCurrentGfapValue();
  if (!gfapValue || gfapValue <= 0) return "";

  const estVolume = estimateVolumeFromGFAP(gfapValue);
  const mortality = estimateMortalityFromVolume(estVolume);
  const percent = Math.round((ichData?.probability || 0) * 100);

  return `
    <div class="enhanced-risk-card volume-card bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-lg my-2">
      <!-- Header -->
      <div class="risk-header flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <div class="risk-icon text-3xl">🧮</div>
        <div class="risk-title">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${t("ichVolumeLabel")}</h3>
        </div>
      </div>

      <!-- Body -->
      <div class="risk-body flex flex-col items-center">
        <!-- Volume Display -->
        <div class="circles-container flex flex-col items-center">
          <div class="rings-row flex justify-center">
            <div class="circle-item flex flex-col items-center">
              ${renderICHVolumeDisplay(ichData)}
              <div class="circle-label text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">${t("ichVolumeLabel")}</div>
            </div>
          </div>
        </div>

        <!-- Risk Details -->
        <div class="risk-details mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
          <div class="mortality-assessment bg-gray-100 dark:bg-gray-700/40 rounded-lg px-4 py-3 flex flex-col items-center">
            <span class="label font-medium text-gray-600 dark:text-gray-400">${t("predictedMortality")}</span>
            <span class="value text-lg font-semibold text-red-600 dark:text-red-400">${mortality}</span>
          </div>
          <div class="probability bg-gray-100 dark:bg-gray-700/40 rounded-lg px-4 py-3 flex flex-col items-center">
            <span class="label font-medium text-gray-600 dark:text-gray-400">${t("probability")}</span>
            <span class="value text-lg font-semibold text-blue-600 dark:text-blue-400">${percent}%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render tachometer gauge for treatment decision when high risk
 * @param {number} ichPercent - ICH probability percentage
 * @param {number} lvoPercent - LVO probability percentage
 * @returns {string} HTML for tachometer gauge
 */
function renderTachometerGauge(ichPercent, lvoPercent) {
  const ratio = lvoPercent / Math.max(ichPercent, 1);
  const lang = i18n.getCurrentLanguage();
  const title = lang === "de" ? "Entscheidungshilfe – LVO/ICH" : "Decision Support – LVO/ICH";
  const uncertainLabel = lang === "de" ? "Unsicher" : "Uncertain";

  // Confidence calculation logic
  const diff = Math.abs(lvoPercent - ichPercent);
  const maxP = Math.max(lvoPercent, ichPercent);
  let confidence =
    diff < 10
      ? Math.round(30 + maxP * 0.3)
      : diff < 20
        ? Math.round(50 + maxP * 0.4)
        : Math.round(70 + maxP * 0.3);
  confidence = Math.max(0, Math.min(100, confidence));

  return `
    <div class="tachometer-section flex mt-6 w-full">
      <div class="tachometer-card w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-xl">
        
        <!-- Header -->
        <div class="tachometer-header flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            🎯 <span data-i18n-key="decisonSupportTitle"> </span>
          </h3>
          <div class="ratio-display text-sm text-gray-600 dark:text-gray-400">
            <span data-i18n-key="LVO_ICH"></span> Ratio: <span class="font-semibold text-blue-600 dark:text-blue-400">${ratio.toFixed(2)}</span>
          </div>
        </div>

        <!-- Gauge Canvas -->
        <div class="tachometer-gauge flex justify-center mb-6">
          <div data-react-tachometer 
               data-ich="${ichPercent}" 
               data-lvo="${lvoPercent}" 
               data-title="${title}" 
              ></div>
        </div>

        <!-- Legend -->
        <div class="tachometer-legend flex justify-center gap-4 mb-6 text-sm font-medium">
          <span class="legend-chip px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">ICH</span>
          <span class="legend-chip px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">${uncertainLabel}</span>
          <span class="legend-chip px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">LVO</span>
        </div>

        <!-- Metrics -->
        <div class="metrics-row grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="metric-card p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <div class="metric-label text-gray-500 dark:text-gray-400 text-sm uppercase">Ratio</div>
            <div class="metric-value text-2xl font-bold text-blue-600 dark:text-blue-400">${ratio.toFixed(2)}</div>
            <div class="metric-unit text-xs text-gray-500 dark:text-gray-400"><span data-i18n-key="LVO_ICH"></div>
          </div>

          <div class="metric-card p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800">
            <div class="metric-label text-gray-500 dark:text-gray-400 text-sm uppercase">Confidence</div>
            <div class="metric-value text-2xl font-bold text-green-600 dark:text-green-400">${confidence}%</div>
            <div class="metric-unit text-xs text-gray-500 dark:text-gray-400">percent</div>
          </div>

          <div class="metric-card p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800">
            <div class="metric-label text-gray-500 dark:text-gray-400 text-sm uppercase">Difference</div>
            <div class="metric-value text-2xl font-bold text-red-600 dark:text-red-400">${Math.abs(lvoPercent - ichPercent).toFixed(0)}%</div>
            <div class="metric-unit text-xs text-gray-500 dark:text-gray-400">|<span data-i18n-key="LVO_ICH"></span>|</div>
          </div>
        </div>

        <!-- Probability Summary -->
        <div class="probability-summary text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          <span class="font-semibold text-red-600 dark:text-red-400">ICH:</span> ${ichPercent}% 
          <span class="mx-2 text-gray-400">|</span> 
          <span class="font-semibold text-blue-600 dark:text-blue-400">LVO:</span> ${lvoPercent}%
        </div>
      </div>
    </div>
  `;
}
