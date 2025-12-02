import { store } from "../state/store.js";
import {
  handleTriage1,
  handleTriage2,
  handleSubmit,
  reset,
  goBack,
  goHome,
} from "../logic/handlers.js";
import { initializeResearchMode } from "../research/comparison-ui.js";
import { authManager } from "../auth/authentication.js";
import { populateI18nPlaceholders, safeSetInnerHTML } from "../security/html-sanitizer.js";

import { renderComa } from "./screens/coma.js";
import { renderLimited } from "./screens/limited.js";
import { renderFull } from "./screens/full.js";
import { renderResults } from "./screens/results.js";
import { renderLoginScreen, initializeLoginScreen } from "./screens/login.js";
import { announceScreenChange, setPageTitle, focusMainHeading } from "./a11y.js";
import { initializeStrokeCenterMap } from "./components/stroke-center-map.js";
import { fastEdCalculator } from "./components/fastEdModal.js";
import renderTriage1 from "./screens/triage1.js";
import renderTriage2 from "./screens/triage2.js";
import { getKioskHomeUrl } from "../logic/kiosk-loader.js";

export function render(container) {
  const state = store.getState();
  const { currentScreen, results, startTime, screenHistory } = state;

  console.log("[Render] Rendering screen:", currentScreen, "Has results:", !!results);

  // Optimize DOM updates to prevent CLS
  const tempContainer = document.createElement("div");

  // Show/hide back button based on navigation history
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.style.display = screenHistory && screenHistory.length > 0 ? "flex" : "none";
  }

  // Render the appropriate screen
  let html = "";
  switch (currentScreen) {
    case "login":
      html = renderLoginScreen();
      break;
    case "triage1":
      // Verify authentication for all clinical screens
      if (!authManager.isValidSession()) {
        store.navigate("login");
        return;
      }
      html = renderTriage1();
      break;
    case "triage2":
      html = renderTriage2();
      break;
    case "coma":
      html = renderComa();
      break;
    case "limited":
      html = renderLimited();
      break;
    case "full":
      html = renderFull();
      break;
    case "results":
      html = renderResults(results, startTime);
      break;
    default:
      html = renderTriage1();
  }

  // Use secure DOM update to minimize reflows and prevent XSS
  try {
    safeSetInnerHTML(tempContainer, html);
    populateI18nPlaceholders(tempContainer);
    //  decodeSafeTextElements(tempContainer);
  } catch (error) {
    // Fallback to text content on sanitization error
    tempContainer.textContent = "Error loading content. Please refresh.";
  }

  // Single DOM replacement to minimize CLS
  // Clear container safely without using innerHTML
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  while (tempContainer.firstChild) {
    container.appendChild(tempContainer.firstChild);
  }

  // Restore form data if available
  const form = container.querySelector("form[data-module]");
  if (form) {
    const { module } = form.dataset;
    restoreFormData(form, module);
  }

  // Attach event listeners
  attachEvents(container);

  // Initialize login screen if needed
  if (currentScreen === "login") {
    setTimeout(() => {
      initializeLoginScreen();
    }, 100);
  }

  // Initialize stroke center map if on results screen
  if (currentScreen === "results" && results) {
    setTimeout(() => {
      try {
        console.log("[Render] Initializing stroke center map with results:", results);
        initializeStrokeCenterMap(results);
      } catch (error) {
        console.error("[Render] Stroke center map initialization failed:", error);
      }
    }, 100);
  }

  // Initialize research mode components
  setTimeout(() => {
    try {
      initializeResearchMode();
    } catch {}
  }, 150);

  // Accessibility updates
  announceScreenChange(currentScreen);
  setPageTitle(currentScreen);
  focusMainHeading();
}

function restoreFormData(form, module) {
  const formData = store.getFormData(module);
  if (!formData || Object.keys(formData).length === 0) {
    return;
  }

  Object.entries(formData).forEach(([key, value]) => {
    const input = form.elements[key];
    if (input) {
      if (input.type === "checkbox") {
        input.checked = value === true || value === "on" || value === "true";
      } else {
        input.value = value;
      }
    }
  });
}

function attachEvents(container) {
  // Clear validation errors when user starts typing in a field
  container.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("input", () => {
      // Only clear errors for the specific field being edited
      const group = input.closest(".input-group");
      if (group && group.classList.contains("error")) {
        group.classList.remove("error");
        group.querySelectorAll(".error-message").forEach(el => el.remove());
      }
    });
  });

  // Triage button handlers
  container.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", e => {
      const { action, value } = e.currentTarget.dataset;
      const boolVal = value === "true";

      switch (action) {
        case "triage1":
          handleTriage1(boolVal);
          break;
        case "triage2":
          handleTriage2(boolVal);
          break;
        case "reset":
          reset();
          break;
        case "goBack":
          goBack();
          break;
        case "goHome":
          goHome();
          break;
        case "kiosk-home":
          window.location.href = getKioskHomeUrl();
          break;
      }
    });
  });

  // Form submission handlers
  container.querySelectorAll("form[data-module]").forEach(form => {
    form.addEventListener("submit", e => {
      handleSubmit(e, container);
    });
  });

  // Print button handler
  const printButton = container.querySelector("#printResults");
  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }

  // FAST-ED calculator handler
  const fastEdInput = container.querySelector("#fast_ed_score");
  if (fastEdInput) {
    fastEdInput.addEventListener("click", e => {
      // Ignore clicks on tooltip or its children
      if (e.target.matches(".tooltip, .tooltip *")) {
        alert("sdfdsfsdf");
        return;
      }
      e.preventDefault();
      const currentValue = parseInt(fastEdInput.value) || 0;
      fastEdCalculator.show(currentValue, result => {
        // Update FAST-ED score
        fastEdInput.value = result.total;

        // Update hidden arm weakness field
        const armPareseField = container.querySelector("#armparese_hidden");
        if (armPareseField) {
          armPareseField.value = result.armWeaknessBoolean ? "true" : "false";
        }

        // Update eye deviation hidden field if exists
        const eyeDeviationField = container.querySelector("#eye_deviation_hidden");
        if (eyeDeviationField) {
          eyeDeviationField.value = result.eyeDeviationBoolean ? "true" : "false";
        }

        // Trigger change event to save form data
        fastEdInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    // Prevent manual typing
    fastEdInput.addEventListener("keydown", e => {
      e.preventDefault();
    });
  }

  // Collapsible info toggles handler
  const infoToggles = container.querySelectorAll(".info-toggle");

  // Ensure all collapsible contents start hidden
  container.querySelectorAll(".collapsible-content").forEach(content => {
    content.style.display = "none";
  });

  infoToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.target;
      const targetContent = container.querySelector(`#${targetId}`);
      const arrow = toggle.querySelector(".toggle-arrow");

      if (!targetContent) return;

      // Check if visible
      const isVisible = targetContent.style.display === "block";

      if (isVisible) {
        // Hide content
        targetContent.style.display = "none";
        targetContent.classList.remove("show");
        toggle.classList.remove("active");
        arrow.style.transform = "rotate(0deg)";
      } else {
        // Show content
        targetContent.style.display = "block";
        targetContent.classList.add("show");
        toggle.classList.add("active");
        arrow.style.transform = "rotate(180deg)";
      }
    });
  });
}
