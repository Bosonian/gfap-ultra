import { t } from "../../localization/i18n.js";

export class FastEdCalculator {
  constructor() {
    this.scores = {
      facial_palsy: 0,
      arm_weakness: 0,
      speech_changes: 0,
      eye_deviation: 0,
      denial_neglect: 0,
    };
    this.onApply = null;
    this.modal = null;
  }

  getTotal() {
    return Object.values(this.scores).reduce((sum, score) => sum + score, 0);
  }

  getRiskLevel() {
    const total = this.getTotal();
    return total >= 4 ? "high" : "low";
  }

  render() {
    const total = this.getTotal();
    const riskLevel = this.getRiskLevel();

    return `
      <div id="fastEdModal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transition-all duration-300">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">${t("fastEdCalculatorTitle")}</h2>
            <button class="modal-close text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            ${this.renderSection("facial_palsy", t("facialPalsyTitle"), [
              { label: t("facialPalsyNormal"), value: 0 },
              { label: t("facialPalsyMild"), value: 1 },
            ])}

            ${this.renderSection("arm_weakness", t("armWeaknessTitle"), [
              { label: t("armWeaknessNormal"), value: 0 },
              { label: t("armWeaknessMild"), value: 1 },
              { label: t("armWeaknessSevere"), value: 2 },
            ])}

            ${this.renderSection("speech_changes", t("speechChangesTitle"), [
              { label: t("speechChangesNormal"), value: 0 },
              { label: t("speechChangesMild"), value: 1 },
              { label: t("speechChangesSevere"), value: 2 },
            ])}

            ${this.renderSection("eye_deviation", t("eyeDeviationTitle"), [
              { label: t("eyeDeviationNormal"), value: 0 },
              { label: t("eyeDeviationPartial"), value: 1 },
              { label: t("eyeDeviationForced"), value: 2 },
            ])}

            ${this.renderSection("denial_neglect", t("denialNeglectTitle"), [
              { label: t("denialNeglectNormal"), value: 0 },
              { label: t("denialNeglectPartial"), value: 1 },
              { label: t("denialNeglectComplete"), value: 2 },
            ])}

            <!-- Total -->
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center text-center">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${t("totalScoreTitle")}: 
                <span class="text-blue-600 dark:text-blue-400 font-bold text-xl total-score">${total}/9</span>
              </h3>
              <div class="risk-indicator mt-2 px-4 py-2 rounded-full font-medium 
                ${
                  riskLevel === "high"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                }">
                ${t("riskLevel")}: ${riskLevel === "high" ? t("riskLevelHigh") : t("riskLevelLow")}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" data-action="cancel-fast-ed">${t("cancel")}</button>
            <button class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-action="apply-fast-ed">${t("applyScore")}</button>
          </div>
        </div>
      </div>
    `;
  }

  renderSection(name, title, options) {
    return `
      <div class="space-y-2">
        <h3 class="font-semibold text-gray-800 dark:text-gray-100">${title}</h3>
        <div class="flex flex-wrap gap-3">
          ${options
            .map(
              opt => `
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="radio" name="${name}" value="${opt.value}" 
                class="accent-blue-600 dark:accent-blue-500"
                ${this.scores[name] === opt.value ? "checked" : ""}>
              <span>${opt.label}</span>
            </label>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.modal = document.getElementById("fastEdModal");
    if (!this.modal) return;

    this.modal.addEventListener("change", e => {
      if (e.target.type === "radio") {
        this.scores[e.target.name] = parseInt(e.target.value);
        this.updateDisplay();
      }
    });

    this.modal.querySelector(".modal-close")?.addEventListener("click", () => this.close());
    this.modal
      .querySelector('[data-action="cancel-fast-ed"]')
      ?.addEventListener("click", () => this.close());
    this.modal
      .querySelector('[data-action="apply-fast-ed"]')
      ?.addEventListener("click", () => this.apply());

    this.modal.addEventListener("click", e => {
      if (e.target === this.modal) e.stopPropagation();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && this.modal?.classList.contains("flex")) this.close();
    });
  }

  updateDisplay() {
    const totalElement = this.modal?.querySelector(".total-score");
    const riskElement = this.modal?.querySelector(".risk-indicator");
    if (!totalElement || !riskElement) return;

    const total = this.getTotal();
    const riskLevel = this.getRiskLevel();

    totalElement.textContent = `${total}/9`;
    riskElement.className =
      "risk-indicator mt-2 px-4 py-2 rounded-full font-medium " +
      (riskLevel === "high"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
        : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300");
    riskElement.textContent = `${t("riskLevel")}: ${riskLevel === "high" ? t("riskLevelHigh") : t("riskLevelLow")}`;
  }

  show(currentScore = 0, onApplyCallback = null) {
    this.onApply = onApplyCallback;

    if (currentScore > 0 && currentScore <= 9) this.approximateFromTotal(currentScore);

    const existingModal = document.getElementById("fastEdModal");
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML("beforeend", this.render());
    this.modal = document.getElementById("fastEdModal");
    this.setupEventListeners();

    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove("flex");
    this.modal.classList.add("hidden");
  }

  apply() {
    const total = this.getTotal();
    const armWeaknessBoolean = this.scores.arm_weakness > 0;
    const eyeDeviationBoolean = this.scores.eye_deviation > 0;

    if (this.onApply) {
      this.onApply({
        total,
        components: { ...this.scores },
        armWeaknessBoolean,
        eyeDeviationBoolean,
      });
    }

    this.close();
  }

  approximateFromTotal(total) {
    this.scores = {
      facial_palsy: 0,
      arm_weakness: 0,
      speech_changes: 0,
      eye_deviation: 0,
      denial_neglect: 0,
    };

    let remaining = total;
    for (const component of Object.keys(this.scores)) {
      if (remaining <= 0) break;
      const max = component === "facial_palsy" ? 1 : 2;
      const assign = Math.min(remaining, max);
      this.scores[component] = assign;
      remaining -= assign;
    }
  }
}

export const fastEdCalculator = new FastEdCalculator();
