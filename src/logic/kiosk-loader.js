/**
 * Kiosk Mode Loader
 * Handles loading case data when PWA is opened in kiosk display mode
 */

import { KIOSK_CONFIG } from "../config.js";
import { store } from "../state/store.js";

/**
 * Check if app is in kiosk display mode
 * @returns {{isKioskMode: boolean, caseId: string|null}}
 */
export function detectKioskMode() {
  const hash = window.location.hash || "";
  const params = new URLSearchParams(hash.split("?")[1] || "");

  const display = params.get("display");
  const caseId = params.get("caseId");

  const isKioskMode = display === "kiosk" && Boolean(caseId);

  console.log("[KioskLoader] Kiosk mode detection:", {
    hash,
    display,
    caseId,
    isKioskMode,
  });

  return {
    isKioskMode,
    caseId,
  };
}

/**
 * Fetch case data from Cloud Run
 * @param {string} caseId - The case ID to fetch
 * @returns {Promise<Object>} Case data
 */
export async function fetchCaseData(caseId) {
  try {
    console.log("[KioskLoader] Fetching case data:", caseId);

    const response = await fetch(`${KIOSK_CONFIG.caseSharingUrl}/get-cases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cases: ${response.status}`);
    }

    const data = await response.json();

    // Find the specific case
    const caseData = data.cases.find(c => c.id === caseId);

    if (!caseData) {
      throw new Error(`Case not found: ${caseId}`);
    }

    console.log("[KioskLoader] Case data loaded:", caseData);

    return caseData;
  } catch (error) {
    console.error("[KioskLoader] Failed to fetch case data:", error);
    throw error;
  }
}

/**
 * Load case data into store for kiosk mode
 * @param {string} caseId - The case ID to load
 */
export async function loadKioskCase(caseId) {
  try {
    const caseData = await fetchCaseData(caseId);

    // Populate store with case data
    store.setState({
      results: caseData.results,
      formData: caseData.formData || {},
      currentScreen: "results",
    });

    console.log("[KioskLoader] Store populated with case data");

    return caseData;
  } catch (error) {
    console.error("[KioskLoader] Failed to load kiosk case:", error);
    throw error;
  }
}

/**
 * Get kiosk home URL
 * @returns {string} URL to kiosk home page
 */
export function getKioskHomeUrl() {
  return "https://igfap.eu/kiosk/";
}
