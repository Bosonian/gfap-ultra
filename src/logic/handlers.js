import { store } from "../state/store.js";
import { predictComaIch, predictLimitedIch, predictFullStroke, APIError } from "../api/client.js";
import { t } from "../localization/i18n.js";
import { showPrerequisitesModal } from "../ui/components/prerequisites-modal.js";
import { safeSetInnerHTML } from "../security/html-sanitizer.js";
import { DEV_CONFIG } from "../config.js";
import { validateForm, showValidationErrors } from "./validate.js";

export function handleTriage1(isComatose) {
  store.logEvent("triage1_answer", { comatose: isComatose });

  if (isComatose) {
    navigate("coma");
  } else {
    // Show prerequisites modal for conscious patients
    showPrerequisitesModal();
  }
}

export function handleTriage2(isExaminable) {
  store.logEvent("triage2_answer", { examinable: isExaminable });
  const nextScreen = isExaminable ? "full" : "limited";
  navigate(nextScreen);
}

export function navigate(screen) {
  store.logEvent("navigate", {
    from: store.getState().currentScreen,
    to: screen,
  });
  store.navigate(screen);
  window.scrollTo(0, 0);
}

export function reset() {
  if (store.hasUnsavedData()) {
    if (!confirm("Are you sure you want to start over? All entered data will be lost.")) {
      return;
    }
  }
  store.logEvent("reset");
  store.reset();
}

export function goBack() {
  const success = store.goBack();

  if (success) {
    store.logEvent("navigate_back");
    window.scrollTo(0, 0);
  } else {
    goHome();
  }
}

export function goHome() {
  store.logEvent("navigate_home");
  store.goHome();
  window.scrollTo(0, 0);
}

export async function handleSubmit(e, container) {
  e.preventDefault();
  const form = e.target;
  const { module } = form.dataset;

  // Validate form
  const validation = validateForm(form);
  if (!validation.isValid) {
    showValidationErrors(container, validation.validationErrors);
    try {
      // Focus first invalid field and announce summary for screen readers
      const firstErrorName = Object.keys(validation.validationErrors)[0];
      if (firstErrorName && form.elements[firstErrorName]) {
        const el = form.elements[firstErrorName];
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const sr = document.createElement("div");
      sr.className = "sr-only";
      sr.setAttribute("role", "status");
      sr.setAttribute("aria-live", "polite");
      const errorCount = Object.keys(validation.validationErrors).length;
      sr.textContent = `${errorCount} field${errorCount === 1 ? "" : "s"} need attention.`;
      document.body.appendChild(sr);
      setTimeout(() => sr.remove(), 1200);
    } catch {}
    return;
  }

  // Collect inputs - handle all form elements including unchecked checkboxes
  const inputs = {};

  // Process all form elements to ensure checkboxes are included
  Array.from(form.elements).forEach(element => {
    if (element.name) {
      if (element.type === "checkbox") {
        inputs[element.name] = element.checked;
      } else if (element.type === "number") {
        const n = parseFloat(element.value);
        inputs[element.name] = isNaN(n) ? 0 : n;
      } else if (element.type === "hidden") {
        // Handle hidden fields (like armparese from FAST-ED)
        if (element.name === "armparese") {
          inputs[element.name] = element.value === "true";
        } else {
          inputs[element.name] = element.value;
        }
      } else {
        inputs[element.name] = element.value;
      }
    }
  });

  // Harmonize GFAP from whole blood cartridge to legacy plasma cartridge scale
  // Using clinical cut-off ratio: k = 30 pg/mL (plasma) / 65 pg/mL (whole blood) = 0.46
  if ((module === "full" || module === "coma" || module === "limited") && inputs.gfap_value) {
    const cartridgeType = form.elements["gfap_cartridge_type"]?.value || "plasma";
    if (cartridgeType === "wholeblood") {
      // Harmonization factor: aligns whole blood cartridge scale (65 pg/mL cut-off)
      // to legacy plasma cartridge scale (30 pg/mL cut-off) that models were trained on
      const WHOLE_BLOOD_HARMONIZATION_FACTOR = 0.46;
      inputs.gfap_value = inputs.gfap_value * WHOLE_BLOOD_HARMONIZATION_FACTOR;
      console.log(`[Submit] GFAP harmonized from whole blood cartridge scale (${module} module): ${inputs.gfap_value.toFixed(2)} pg/mL`);
    }
  }

  // Store form data
  store.setFormData(module, inputs);

  // Show loading state
  const button = form.querySelector("button[type=submit]");
  const originalContent = button ? button.innerHTML : "";
  if (button) {
    button.disabled = true;
    try {
      safeSetInnerHTML(button, `<span class="loading-spinner"></span> ${t("analyzing")}`);
    } catch (error) {
      console.error("Button loading state sanitization failed:", error);
      button.textContent = t("analyzing") || "Analyzing...";
    }
  }

  try {
    document.getElementById("loadingScreen").classList.remove("hidden");
    console.log("[Submit] Module:", module);
    console.log("[Submit] Inputs:", inputs);
    // Run models based on module
    let results;

    switch (module) {
      case "coma":
        const comaResult = await predictComaIch(inputs);
        results = {
          ich: {
            ...comaResult,
            module: "Coma",
          },
          lvo: null,
        };
        break;

      case "limited":
        const limitedResult = await predictLimitedIch(inputs);
        results = {
          ich: {
            ...limitedResult,
            module: "Limited",
          },
          lvo: { notPossible: true },
        };
        break;

      case "full":
        results = await predictFullStroke(inputs);
        console.log("[Submit] Full results:", {
          ich: !!results?.ich,
          lvo: !!results?.lvo,
          ichP: results?.ich?.probability,
          lvoP: results?.lvo?.probability,
        });
        // Validate results structure
        if (!results || !results.ich) {
          throw new Error("Invalid response structure from Full Stroke API");
        }
        // Fix ICH probability mapping for Full Stroke
        if (results.ich && !results.ich.probability && results.ich.ich_probability !== undefined) {
          results.ich.probability = results.ich.ich_probability;
          console.log("[Submit] Fixed ICH probability for Full Stroke:", results.ich.probability);
        }
        // Ensure module property is set
        if (results.ich && !results.ich.module) {
          results.ich.module = "Full Stroke";
        }
        if (results.lvo && !results.lvo.module) {
          results.lvo.module = "Full Stroke";
        }
        break;

      default:
        throw new Error(`Unknown module: ${module}`);
    }

    console.log("[Submit] Setting results in store:", results);
    store.setResults(results);
    store.logEvent("models_complete", { module, results });

    // Verify results were stored
    const storedState = store.getState();
    console.log("[Submit] State after setResults:", {
      hasResults: !!storedState.results,
      currentScreen: storedState.currentScreen,
    });

    console.log("[Submit] Navigating to results...");
    document.getElementById("loadingScreen").classList.add("hidden");

    navigate("results");
    // Visual confirmation that results screen loaded
    showToast("✅ Results loaded", 2000);
    // Double-check navigation and force if needed
    setTimeout(() => {
      try {
        const cs = store.getState().currentScreen;
        console.log("[Submit] currentScreen after navigate:", cs);
        if (cs !== "results") {
          store.navigate("results");
          showToast("🔁 Forced results view", 1500);
        }
      } catch {}
    }, 0);
  } catch (error) {
    // Error running models - handle gracefully, with Full module fallback in preview
    const isLocalPreview =
      ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname) &&
      !(import.meta && import.meta.env && import.meta.env.DEV);
    if (module === "full" && isLocalPreview) {
      try {
        const m = DEV_CONFIG.mockApiResponses.full_stroke;
        const ich = m.ich_prediction || {};
        const lvo = m.lvo_prediction || {};
        const pIch = parseFloat(ich.probability) || 0;
        const pLvo = parseFloat(lvo.probability) || 0;
        const fallbackResults = {
          ich: {
            probability: pIch > 1 ? pIch / 100 : pIch,
            drivers: ich.drivers || null,
            confidence: parseFloat(ich.confidence) || 0.85,
            module: "Full Stroke",
          },
          lvo: {
            probability: pLvo > 1 ? pLvo / 100 : pLvo,
            drivers: lvo.drivers || null,
            confidence: parseFloat(lvo.confidence) || 0.85,
            module: "Full Stroke",
          },
        };
        store.setResults(fallbackResults);
        store.logEvent("models_complete_fallback", { module, reason: error.message });
        navigate("results");
        return;
      } catch (e) {
        // Continue to show error below
      }
    }

    let errorMessage = "An error occurred during analysis. Please try again.";
    if (error instanceof APIError) {
      errorMessage = error.message;
    }

    showError(container, errorMessage);

    if (button) {
      button.disabled = false;
      try {
        safeSetInnerHTML(button, originalContent);
      } catch (e2) {
        console.error("Button restore sanitization failed:", e2);
        button.textContent = "Submit";
      }
    }
  }
}

function showError(container, message) {
  // Remove existing error alerts
  container.querySelectorAll(".critical-alert").forEach(alert => {
    if (alert.querySelector("h4")?.textContent?.includes("Error")) {
      alert.remove();
    }
  });

  const alert = document.createElement("div");
  alert.className = "critical-alert";

  // Create safe DOM structure without innerHTML to prevent XSS
  const h4 = document.createElement("h4");
  const iconSpan = document.createElement("span");
  iconSpan.className = "alert-icon";
  iconSpan.textContent = "⚠️";
  h4.appendChild(iconSpan);
  h4.appendChild(document.createTextNode(" Error"));

  const p = document.createElement("p");
  p.textContent = message; // Safe text content only

  alert.appendChild(h4);
  alert.appendChild(p);

  const containerDiv = container.querySelector(".container");
  if (containerDiv) {
    containerDiv.prepend(alert);
  } else {
    container.prepend(alert);
  }

  setTimeout(() => alert.remove(), 10000);
}

// Lightweight toast helper (overlays at top center)
function showToast(message, duration = 2000) {
  try {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #0066CC;
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-size: 14px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 160ms ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 200);
    }, duration);
  } catch {}
}
