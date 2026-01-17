/**
 * Analysis Logger - Client-side utility for logging analysis data
 *
 * Sends analysis data to Cloud Function for debugging/audit purposes.
 * - Excludes age for privacy
 * - Logs are automatically deleted after 4 hours (via Firestore TTL)
 * - Non-blocking: failures don't affect the user experience
 */

import { LOGGER_CONFIG } from "../config.js";

// Generate a simple session ID for correlating logs
const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Remove age and other PII from inputs before logging
 */
function sanitizeInputs(inputs) {
  if (!inputs || typeof inputs !== "object") return {};

  const sanitized = { ...inputs };

  // Remove age for privacy (as requested)
  delete sanitized.age;
  delete sanitized.age_years;
  delete sanitized.patient_age;

  // Remove any other potential PII
  delete sanitized.name;
  delete sanitized.patient_name;
  delete sanitized.patient_id;
  delete sanitized.mrn;

  return sanitized;
}

/**
 * Log analysis data to the backend
 *
 * @param {string} module - The module type (coma, limited, full)
 * @param {Object} inputs - The input values (age will be removed)
 * @param {Object} results - The analysis results
 * @returns {Promise<void>}
 */
export async function logAnalysis(module, inputs, results) {
  // Skip logging if URL not configured
  if (!LOGGER_CONFIG.ANALYSIS_LOGGER_URL) {
    console.log("[AnalysisLogger] Logger URL not configured, skipping");
    return;
  }

  // Skip logging in development mode (optional - can be changed)
  if (LOGGER_CONFIG.DISABLE_IN_DEV && import.meta?.env?.DEV) {
    console.log("[AnalysisLogger] Skipping in development mode");
    return;
  }

  try {
    const payload = {
      module,
      inputs: sanitizeInputs(inputs),
      results: {
        ich: results?.ich
          ? {
              probability: results.ich.probability,
              riskCategory: results.ich.riskCategory,
              confidence: results.ich.confidence,
              module: results.ich.module,
            }
          : null,
        lvo: results?.lvo
          ? {
              probability: results.lvo.probability,
              riskCategory: results.lvo.riskCategory,
              confidence: results.lvo.confidence,
            }
          : null,
      },
      sessionId,
      userAgent: navigator.userAgent,
      appVersion: "2.1.0",
      timestamp: new Date().toISOString(),
    };

    console.log("[AnalysisLogger] Sending log:", {
      module,
      inputKeys: Object.keys(payload.inputs),
      hasIch: !!payload.results.ich,
      hasLvo: !!payload.results.lvo,
    });

    // Fire-and-forget with timeout (don't block the UI)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(LOGGER_CONFIG.ANALYSIS_LOGGER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      console.log("[AnalysisLogger] Logged successfully:", data.logId);
    } else {
      console.warn("[AnalysisLogger] Server returned error:", response.status);
    }
  } catch (error) {
    // Silently fail - logging should never break the app
    if (error.name === "AbortError") {
      console.warn("[AnalysisLogger] Request timed out");
    } else {
      console.warn("[AnalysisLogger] Failed to log:", error.message);
    }
  }
}

/**
 * Get the current session ID (for debugging)
 */
export function getSessionId() {
  return sessionId;
}
