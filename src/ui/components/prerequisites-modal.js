import { t } from "../../localization/i18n.js";
import { navigate } from "../../logic/handlers.js";
import { safeSetInnerHTML } from "../../security/html-sanitizer.js";

/**
 * Prerequisites checklist items
 */
const getPrerequisites = () => [
  { id: "acute_deficit", checked: false },
  { id: "symptom_onset", checked: false },
  { id: "no_preexisting", checked: false },
  { id: "no_trauma", checked: false },
];

/**
 * Render prerequisites modal
 * Tailwind redesigned version (light/dark theme compatible)
 */
export function renderPrerequisitesModal() {
  const prerequisites = getPrerequisites();

  return `
    <div id="prerequisitesModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${t("prerequisitesTitle")}</h2>
          <button id="closePrerequisites" class="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl leading-none">&times;</button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5">
          <p class="text-sm text-gray-700 dark:text-gray-300">${t("prerequisitesIntro")}</p>
          
          <div class="space-y-4">
            ${prerequisites
    .map(
      item => `
              <label class="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                <span class="text-gray-800 dark:text-gray-100 font-medium">${t(item.id)}</span>
                <input type="checkbox" id="${item.id}" class="toggle-input w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              </label>
            `
    )
    .join("")}
          </div>

          <div id="prerequisitesWarning" class="hidden items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm">
            <span>⚠️</span>
            <span>${t("prerequisitesWarning")}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button id="cancelPrerequisites" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            ${t("cancel")}
          </button>
          <button id="confirmPrerequisites" class="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition">
            ${t("continue")}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize prerequisites modal event handlers
 */
export function initPrerequisitesModal() {
  const modal = document.getElementById("prerequisitesModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closePrerequisites");
  const cancelBtn = document.getElementById("cancelPrerequisites");
  const confirmBtn = document.getElementById("confirmPrerequisites");

  const closeModal = () => {
    modal.remove();
    navigate("welcome");
  };

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  confirmBtn?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    const checkboxes = modal.querySelectorAll(".toggle-input");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    if (allChecked) {
      modal.remove();
      navigate("triage2");
    } else {
      const warning = document.getElementById("prerequisitesWarning");
      if (warning) {
        warning.classList.remove("hidden");
        warning.classList.add("animate-shake");
        setTimeout(() => warning.classList.remove("animate-shake"), 500);
      }
    }
  });

  const checkboxes = modal.querySelectorAll(".toggle-input");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      const warning = document.getElementById("prerequisitesWarning");
      if (allChecked && warning) warning.classList.add("hidden");
    });
  });
}

/**
 * Show prerequisites modal
 */
export function showPrerequisitesModal() {
  const existingModal = document.getElementById("prerequisitesModal");
  if (existingModal) existingModal.remove();

  const modalElement = document.createElement("div");
  try {
    safeSetInnerHTML(modalElement, renderPrerequisitesModal());
    const modal = modalElement.firstElementChild;
    if (!modal) throw new Error("Failed to create modal element");
    document.body.appendChild(modal);
  } catch (error) {
    console.error("Prerequisites modal sanitization failed:", error);
    const fallbackModal = document.createElement("div");
    fallbackModal.className =
      "fixed inset-0 flex items-center justify-center bg-black/50 text-white";
    fallbackModal.textContent = "Failed to load prerequisites modal. Please refresh.";
    document.body.appendChild(fallbackModal);
    return;
  }

  initPrerequisitesModal();
}
