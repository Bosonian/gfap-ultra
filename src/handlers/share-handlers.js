/**
 * Share Case Link Handlers
 * Handles share button clicks and acknowledgment submissions
 */
import {
  generateShareLink,
  copyToClipboard,
  submitAcknowledgment,
  detectSharedLink,
} from "../services/case-share-link.js";
import { t } from "../localization/i18n.js";

/**
 * Initialize share handlers
 */
export function initializeShareHandlers() {
  // Listen for share button click
  document.addEventListener("click", async e => {
    // Share case link button
    const shareButton = e.target.closest("#shareCaseLink");
    if (shareButton) {
      await handleShareCase(shareButton);
    }

    // Acknowledgment submit button
    const ackButton = e.target.closest("#submitAcknowledgment");
    if (ackButton) {
      await handleAcknowledgment(ackButton);
    }
  });

  // Listen for acknowledgment checkbox change
  document.addEventListener("change", e => {
    if (e.target.id === "avdAcknowledgment") {
      handleAcknowledgmentCheckbox(e.target);
    }
  });

  console.log("[ShareHandlers] Share handlers initialized");
}

/**
 * Handle share case button click
 */
async function handleShareCase(button) {
  try {
    // Disable button
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "⏳ Generiere Link... / Generating Link...";

    // Generate shareable link
    const shareUrl = await generateShareLink();

    // Copy to clipboard
    const copied = await copyToClipboard(shareUrl);

    if (copied) {
      // Success
      button.classList.add("success");
      button.textContent = `✓ ${t("shareCaseCopied")}`;

      // Show temporary success message
      showSuccessMessage(button, t("shareCaseCopied"));

      // Reset button after 5 seconds
      setTimeout(() => {
        button.classList.remove("success");
        button.textContent = originalText;
        button.disabled = false;
      }, 5000);
    } else {
      // Fallback: show link in alert
      alert(`Link generated:\n\n${shareUrl}\n\nPlease copy this link manually.`);
      button.textContent = originalText;
      button.disabled = false;
    }
  } catch (error) {
    console.error("[ShareHandlers] Failed to share case:", error);
    button.classList.add("error");
    button.textContent = "❌ Fehler / Error";
    button.disabled = false;

    setTimeout(() => {
      button.classList.remove("error");
      button.textContent = `📲 ${t("shareCase")}`;
    }, 3000);
  }
}

/**
 * Handle acknowledgment checkbox change
 */
function handleAcknowledgmentCheckbox(checkbox) {
  const submitButton = document.getElementById("submitAcknowledgment");
  if (submitButton) {
    submitButton.disabled = !checkbox.checked;
  }
}

/**
 * Handle acknowledgment submission
 */
async function handleAcknowledgment(button) {
  try {
    // Get case ID from shared link
    const sharedInfo = detectSharedLink();
    if (!sharedInfo.isShared || !sharedInfo.caseId) {
      console.error("[ShareHandlers] No case ID found");
      return;
    }

    // Disable button
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "⏳ Speichern... / Saving...";

    // Submit acknowledgment
    const success = await submitAcknowledgment(sharedInfo.caseId);

    if (success) {
      // Success
      button.classList.add("success");
      button.textContent = `✓ ${t("acknowledgmentSuccess")}`;

      // Show success status
      const statusElement = document.getElementById("acknowledgmentStatus");
      if (statusElement) {
        statusElement.innerHTML = `<span class="success-message">✓ ${t("acknowledgmentSuccess")}</span>`;
      }

      // Hide the entire acknowledgment section after 2 seconds and replace with confirmed status
      setTimeout(() => {
        const ackSection = document.querySelector(".acknowledgment-section");
        if (ackSection) {
          ackSection.innerHTML = `
            <div class="acknowledged-status">
              <span class="check-icon">✓</span>
              <span>${t("acknowledgmentSuccess")}</span>
            </div>
          `;
        }
      }, 2000);
    } else {
      // Error
      button.classList.add("error");
      button.textContent = "❌ Fehler / Error";
      button.disabled = false;

      setTimeout(() => {
        button.classList.remove("error");
        button.textContent = originalText;
      }, 3000);
    }
  } catch (error) {
    console.error("[ShareHandlers] Failed to submit acknowledgment:", error);
    button.classList.add("error");
    button.textContent = "❌ Fehler / Error";
    button.disabled = false;
  }
}

/**
 * Show temporary success message
 */
function showSuccessMessage(button, message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "share-success-toast";
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #00c853;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(messageDiv);

  // Remove after 4 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 4000);
}
