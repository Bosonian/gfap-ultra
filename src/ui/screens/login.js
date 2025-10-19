/**
 * Login Screen for Research Preview Access
 * iGFAP Stroke Triage Assistant (Tailwind version)
 */

import { authManager } from "../../auth/authentication.js";
import { store } from "../../state/store.js";
import { t } from "../../localization/i18n.js";

export function renderLoginScreen() {
  return `
   <div class="">
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-full max-w-xl p-8">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="flex justify-center items-center space-x-2">
        <div class="text-3xl">🧠</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">iGFAP Stroke Triage</h1>
      </div>
      <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Research Preview v2.1</div>
    </div>
    <!-- Research Access Notice -->
    <div class="mb-6 p-4 bg-yellow-50 dark:bg-gray-700 border-l-4 border-yellow-400 rounded">
      <h2 class="font-semibold text-lg mb-1 text-gray-900 dark:text-yellow-300">🔬 ${t("researchAccessRequired")}
      <p class="text-gray-700 dark:text-gray-200 text-sm mb-2">
        ${t("researchrPreviewValidation")}
      </p>
      <div class="bg-yellow-100 dark:bg-gray-800 p-2 rounded border border-yellow-200 dark:border-yellow-600 text-sm text-gray-800 dark:text-gray-100">
        <h3 class="font-semibold mb-1 text-yellow-600 dark:text-yellow-400">⚠️ ${t("importantNotice")}</h3>
        <ul class="list-disc ml-5 space-y-1">
          <li><span class="font-semibold">${t("researchUseOnly")}</span> - ${t("noClinicalDecision")}</li>
          <li><span class="font-semibold">${t("noDataStorage")}</span> - ${t("dataProcessedLocally")}</li>
          <li><span class="font-semibold">${t("clinicalAdvisory")}</span> - ${t("supervision")}</li>
          <li><span class="font-semibold">${t("contact")}:</span> Deepak Bos (bosdeepak@gmail.com)</li>
        </ul>
      </div>
    </div>
    <!-- Login Form -->
    <form id="loginForm" class="space-y-4">
      <div>
        <label for="researchPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">${t("accessCode")}</label>
        <input
          type="password"
          id="researchPassword"
          name="password"
          required
          autocomplete="off"
          placeholder="${t("accessCodePlaceholder")}"
          class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
      </div>
      <div id="loginError" class="text-red-600 dark:text-red-400 text-sm hidden"></div>
      <button type="submit" class="w-full bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center disabled:opacity-50 login-button">
        <span class="button-text">${t("accessResearchBtn")}</span>
        <span class="loading-spinner ml-2 hidden">⏳</span>
      </button>
    </form>
    <!-- Footer -->
    <div class="mt-6 text-gray-500 dark:text-gray-400 text-xs space-y-1">
      <p><strong class="text-gray-700 dark:text-gray-200">${t("regulatoryStatus")}:</strong> ${t("protoTypeOnly")}</p>
      <p><strong class="text-gray-700 dark:text-gray-200">${t("dataProtection")}:</strong> ${t("gdprComplaint")}</p>
      <p><strong class="text-gray-700 dark:text-gray-200">${t("clinicalOversight")}:</strong> RKH Klinikum Ludwigsburg, Neurologie</p>
    </div>
  </div>
</div>
  `;
}

export function initializeLoginScreen() {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  const passwordInput = document.getElementById("researchPassword");
  const loginError = document.getElementById("loginError");
  const loginButton = loginForm.querySelector(".login-button");

  passwordInput.focus();

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const password = passwordInput.value.trim();

    if (!password) {
      showLoginError("Please enter the research access code");
      return;
    }

    setLoginLoading(true);
    hideLoginError();

    try {
      const authResult = await authManager.authenticate(password);
      if (authResult.success) {
        store.logEvent("auth_success", {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 100),
        });
        store.navigate("triage1");
      } else {
        showLoginError(authResult.message);
        passwordInput.value = "";
        passwordInput.focus();
        store.logEvent("auth_failed", {
          timestamp: new Date().toISOString(),
          errorCode: authResult.errorCode,
        });
      }
    } catch (error) {
      showLoginError("Authentication system error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  });

  passwordInput.addEventListener("input", hideLoginError);

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove("hidden");
    passwordInput.classList.add("border-red-500");
  }

  function hideLoginError() {
    loginError.classList.add("hidden");
    passwordInput.classList.remove("border-red-500");
  }

  function setLoginLoading(isLoading) {
    const buttonText = loginButton.querySelector(".button-text");
    const loadingSpinner = loginButton.querySelector(".loading-spinner");

    if (isLoading) {
      buttonText.classList.add("hidden");
      loadingSpinner.classList.remove("hidden");
      loginButton.disabled = true;
    } else {
      buttonText.classList.remove("hidden");
      loadingSpinner.classList.add("hidden");
      loginButton.disabled = false;
    }
  }
}
