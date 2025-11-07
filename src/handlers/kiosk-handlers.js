/**
 * Kiosk Integration Handlers
 * Handles sending cases to hospital kiosk and GPS tracking
 */
import { hospitalSelector } from "../ui/components/hospital-selector.js";
import { caseTransmitter } from "../services/case-transmitter.js";
import { store } from "../state/store.js";
import { t } from "../localization/i18n.js";

/**
 * Initialize kiosk handlers
 */
export function initializeKioskHandlers() {
  // Listen for send to hospital button
  document.addEventListener("click", async e => {
    // Use closest() to handle clicks on button content (emoji, text)
    const kioskButton = e.target.closest("#shareToKiosk");
    if (kioskButton) {
      await handleSendToHospital(kioskButton);
    }

    // Stop tracking button
    const stopButton = e.target.closest("#stopTracking");
    if (stopButton) {
      handleStopTracking();
    }
  });

  console.log("[KioskHandlers] Kiosk handlers initialized");
}

/**
 * Handle send to hospital button click
 */
async function handleSendToHospital(button) {
  try {
    // Check if already tracking
    const status = caseTransmitter.getStatus();
    if (status.isTracking) {
      const confirmStop = confirm(
        "Ein Case wird bereits verfolgt. Möchten Sie diesen stoppen und einen neuen senden?\n\n" +
          "A case is already being tracked. Do you want to stop it and send a new one?"
      );

      if (!confirmStop) {
        return;
      }

      caseTransmitter.stopTracking();
      // Remove old tracking status if present
      document.getElementById("trackingStatus")?.remove();
    }

    // Disable button
    button.disabled = true;
    button.classList.add("sending");
    const originalText = button.textContent;
    button.textContent = `⏳ ${t("selectingHospital")}` + "...";

    // Show hospital selector
    hospitalSelector.show(async hospital => {
      try {
        button.textContent = "📡 Sende Case... / Sending Case...";

        const state = store.getState();
        const { results, formData } = state;

        // Validate results exist
        if (!results || !results.ich) {
          throw new Error("No assessment results available");
        }

        // Detect module type
        const moduleType = detectModuleType(results);

        console.log("[KioskHandlers] Sending case:", {
          moduleType,
          hospital: hospital.name,
          ichRisk: Math.round(results.ich.probability * 100),
        });

        // Send case
        const response = await caseTransmitter.sendCase(results, formData, moduleType, hospital);

        // Success - update button
        button.classList.remove("sending");
        button.classList.add("success");
        button.textContent = `✓ Gesendet an / Sent to ${hospital.name}`;
        button.disabled = false;

        // Show tracking status
        showTrackingStatus(response.caseId, hospital, response.eta);

        // Reset button after 5 seconds
        setTimeout(() => {
          button.classList.remove("success");
          button.textContent = originalText;
        }, 5000);
      } catch (error) {
        console.error("[KioskHandlers] Failed to send case:", error);
        handleSendError(button, originalText, error);
      }
    });
  } catch (error) {
    console.error("[KioskHandlers] Hospital selection error:", error);
    button.classList.remove("sending");
    button.textContent = "❌ Fehler / Error - Try Again";
    button.disabled = false;
  }
}

/**
 * Detect module type from results
 */
function detectModuleType(results) {
  if (!results.ich || !results.ich.module) {
    return "unknown";
  }

  const moduleName = results.ich.module.toLowerCase();

  if (moduleName.includes("coma")) {
    return "coma";
  }
  if (moduleName.includes("limited")) {
    return "limited";
  }
  if (moduleName.includes("full")) {
    return "full";
  }

  return "unknown";
}

/**
 * Show tracking status indicator
 */
function showTrackingStatus(caseId, hospital, eta) {
  // Remove old tracking status if exists
  const oldStatus = document.getElementById("trackingStatus");
  if (oldStatus) {
    oldStatus.remove();
  }

  const statusHTML = `
    <div class="tracking-status" id="trackingStatus">
      <div class="tracking-header">
        <div class="tracking-title">
          <strong>📡 Live-Tracking aktiv / Live Tracking Active</strong>
          <span class="tracking-badge">GPS aktiv / GPS Active</span>
        </div>
        <button class="stop-tracking" id="stopTracking">Stoppen / Stop</button>
      </div>

      <div class="tracking-info">
        <div class="tracking-detail">
          <span class="detail-label">Case ID:</span>
          <span class="detail-value">${caseId}</span>
        </div>
        <div class="tracking-detail">
          <span class="detail-label">Ziel / Destination:</span>
          <span class="detail-value">${hospital.name}</span>
        </div>
        <div class="tracking-detail">
          <span class="detail-label">Entfernung / Distance:</span>
          <span class="detail-value">${hospital.distance} km</span>
        </div>
        <div class="tracking-detail">
          <span class="detail-label">ETA:</span>
          <span class="detail-value">${eta} Minuten / Minutes</span>
        </div>
      </div>

      <div class="tracking-note">
        <p>📍 GPS-Position wird alle 30 Sekunden aktualisiert</p>
        <p>📍 GPS position updates every 30 seconds</p>
      </div>
    </div>
  `;

  // Insert after results actions
  const resultsActions = document.querySelector(".results-actions");
  if (resultsActions) {
    resultsActions.insertAdjacentHTML("afterend", statusHTML);

    // Scroll to tracking status
    setTimeout(() => {
      document
        .getElementById("trackingStatus")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }
}

/**
 * Handle stop tracking
 */
function handleStopTracking() {
  const confirmStop = confirm(
    "Möchten Sie das Live-Tracking beenden?\n\n" + "Do you want to stop live tracking?"
  );

  if (confirmStop) {
    caseTransmitter.stopTracking();

    const trackingStatus = document.getElementById("trackingStatus");
    if (trackingStatus) {
      trackingStatus.style.transition = "opacity 0.3s ease";
      trackingStatus.style.opacity = "0";

      setTimeout(() => {
        trackingStatus.remove();
      }, 300);
    }

    console.log("[KioskHandlers] Tracking stopped by user");
  }
}

/**
 * Handle send error
 */
function handleSendError(button, originalText, error) {
  button.classList.remove("sending");
  button.classList.add("error");

  // Specific error messages
  let errorMsg = "❌ Fehler / Error";

  if (error.message.includes("GPS") || error.message.includes("location")) {
    errorMsg = "❌ GPS-Fehler / GPS Error";
  } else if (error.message.includes("network") || error.message.includes("fetch")) {
    errorMsg = "❌ Netzwerkfehler / Network Error";
  }

  button.textContent = errorMsg;
  button.disabled = false;

  // Reset after 3 seconds
  setTimeout(() => {
    button.classList.remove("error");
    button.textContent = originalText;
  }, 3000);
}
