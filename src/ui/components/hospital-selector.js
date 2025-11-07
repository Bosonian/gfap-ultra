/**
 * Hospital Selector Component
 * Shows nearby hospitals for case transmission
 */
import { COMPREHENSIVE_HOSPITAL_DATABASE } from "../../data/comprehensive-stroke-centers.js";
import { t } from "../../localization/i18n.js";
import { gpsTracker } from "../../services/gps-tracker.js";

export class HospitalSelector {
  constructor() {
    this.currentLocation = null;
    this.hospitals = [];
    this.selectedHospital = null;
    this.onSelect = null;
  }

  /**
   * Show hospital selector modal
   * @param {Function} onSelectCallback - Callback when hospital is selected
   * @returns {Promise<void>}
   */
  async show(onSelectCallback) {
    this.onSelect = onSelectCallback;

    try {
      // Get current location
      this.currentLocation = await gpsTracker.getCurrentLocation();
      console.log("=============================", this.currentLocation);
      // Get nearby hospitals
      this.hospitals = this.getNearbyHospitals(this.currentLocation, 50); // 50km radius

      // Render modal
      this.render();

      // Add event listeners
      this.attachEventListeners();
    } catch (error) {
      console.error("[HospitalSelector] Error:", error);
      this.showError(error.message);
    }
  }

  /**
   * Get hospitals within radius
   */
  getNearbyHospitals(location, radiusKm) {
    const allHospitals = [];

    // Collect all hospitals from all states
    Object.values(COMPREHENSIVE_HOSPITAL_DATABASE).forEach(state => {
      if (state.neurosurgicalCenters) {
        allHospitals.push(...state.neurosurgicalCenters);
      }
      if (state.comprehensiveStrokeCenters) {
        allHospitals.push(...state.comprehensiveStrokeCenters);
      }
      if (state.regionalStrokeUnits) {
        allHospitals.push(...state.regionalStrokeUnits);
      }
    });

    // Calculate distance and filter
    const hospitalsWithDistance = allHospitals
      .map(hospital => ({
        ...hospital,
        distance: this.calculateDistance(
          location.latitude,
          location.longitude,
          hospital.coordinates.lat,
          hospital.coordinates.lng
        ),
      }))
      .filter(h => h.distance <= radiusKm)
      .sort((a, b) => {
        // Sort by capability first, then distance
        const capabilityScore = h => {
          let score = 0;
          if (h.neurosurgery) {
            score += 100;
          }
          if (h.thrombectomy) {
            score += 50;
          }
          if (h.thrombolysis) {
            score += 25;
          }
          return score;
        };

        const scoreDiff = capabilityScore(b) - capabilityScore(a);
        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        return a.distance - b.distance;
      });

    return hospitalsWithDistance.slice(0, 10); // Top 10
  }

  /**
   * Calculate distance (Haversine)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal
  }

  toRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Render the modal
   */

  render() {
    const modalHTML = `
     <div
  id="hospitalSelectorModal"
  class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
>
  <div
    class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden animate-fadeIn"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
    >
      <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        🏥 ${t("selectHospital")}
      </h2>
      <button
        id="closeHospitalSelector"
        class="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-xl font-semibold transition"
      >
        ✕
      </button>
    </div>

    <!-- Current Location -->
    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">
        📍 ${t("currentLocation")}:
      </p>
      <p class="text-sm font-mono text-gray-900 dark:text-gray-100 tracking-wide">
        ${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}
      </p>
    </div>

    <!-- Hospital List -->
    <div class="hospital-list max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
      ${
        this.hospitals.length > 0
          ? this.hospitals
              .map((hospital, index) => this.renderHospitalCard(hospital, index))
              .join("")
          : `
          <p class="text-center text-gray-600 dark:text-gray-400 italic">
          ${t("noHospitalsFound")}
          </p>`
      }
    </div>

    <!-- Footer -->
    <div
      class="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
    >
      <button
        id="cancelHospitalSelect"
        class="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
       ${t("cancel")} 
      </button>
    </div>
  </div>
</div>
    `;

    // Add to body
    const container = document.createElement("div");
    container.innerHTML = modalHTML;
    document.body.appendChild(container.firstElementChild);
  }

  /**
   * Render individual hospital card
   */
  renderHospitalCard(hospital, index) {
    const capabilities = [];
    if (hospital.neurosurgery) {
      capabilities.push(
        `<span class="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">🧠 NS</span>`
      );
    }
    if (hospital.thrombectomy) {
      capabilities.push(
        `<span class="px-2 py-1 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">🩸 TE</span>`
      );
    }
    if (hospital.thrombolysis) {
      capabilities.push(
        `<span class="px-2 py-1 text-xs font-medium rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">💉 TL</span>`
      );
    }

    return `
    <div
      class="hospital-card relative p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        index === 0 ? "ring-2 ring-blue-500 border-blue-400" : ""
      }"
      data-hospital-index="${index}"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex flex-col">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
            ${hospital.name}
          </h3>
          ${
            index === 0
              ? `<span class="inline-block mt-1 text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                  ⭐ Empfohlen / Recommended
                </span>`
              : ""
          }
        </div>
        <div class="text-right">
          <span class="text-lg font-bold text-gray-900 dark:text-white">${hospital.distance}</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">km</span>
        </div>
      </div>

      <!-- Details -->
      <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
        <p>📍 ${hospital.address}</p>
        <p>📞 ${hospital.emergency || hospital.phone}</p>

        <!-- Capabilities -->
        <div class="flex flex-wrap gap-2 mt-2">
          ${capabilities.join("")}
          ${
            hospital.network
              ? `<span class="px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">${hospital.network}</span>`
              : ""
          }
        </div>

        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
          🛏️ ${hospital.beds} Betten / Beds
        </div>
      </div>

      <!-- Select Button -->
      <button
        class="select-hospital-button w-full py-2 mt-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-400 transition focus:ring-2 focus:ring-blue-400"
        data-hospital-index="${index}"
      >
       ${t("select")} →
      </button>
    </div>
  `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const modal = document.getElementById("hospitalSelectorModal");
    if (!modal) {
      return;
    }

    // Close button
    const closeButton = document.getElementById("closeHospitalSelector");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }

    // Cancel button
    const cancelButton = document.getElementById("cancelHospitalSelect");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => this.close());
      const kioskButton = document.getElementById("shareToKiosk");
      kioskButton.textContent = `${t("selectHospital")}`;
      kioskButton.disabled = false;
    }

    // Select hospital buttons
    const selectButtons = modal.querySelectorAll(".select-hospital-button");
    selectButtons.forEach(button => {
      button.addEventListener("click", e => {
        const index = parseInt(e.target.dataset.hospitalIndex);
        this.selectHospital(index);
      });
    });

    // Click outside to close
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        this.close();
      }
    });

    // ESC key to close
    document.addEventListener("keydown", this.handleEscKey);
  }

  /**
   * Handle ESC key
   */
  handleEscKey = e => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  /**
   * Select hospital
   */
  selectHospital(index) {
    this.selectedHospital = this.hospitals[index];

    console.log("[HospitalSelector] Hospital selected:", this.selectedHospital.name);

    // Call callback
    if (this.onSelect) {
      this.onSelect(this.selectedHospital);
    }

    // Close modal
    this.close();
  }

  /**
   * Show error
   */
  showError(message) {
    const errorHTML = `
      <div class="hospital-selector-overlay" id="hospitalSelectorModal">
        <div class="hospital-selector-modal error">
          <div class="modal-header">
            <h2>⚠️ Fehler / Error</h2>
            <button class="close-button" id="closeHospitalSelector">✕</button>
          </div>

          <div class="error-message">
            <p>${message}</p>
            <p class="error-hint">Bitte überprüfen Sie Ihre Standortfreigabe / Please check your location permissions</p>
          </div>

          <div class="modal-footer">
            <button class="secondary" id="closeHospitalSelector">Schließen / Close</button>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = errorHTML;
    document.body.appendChild(container.firstElementChild);

    // Attach close listener
    document.getElementById("closeHospitalSelector")?.addEventListener("click", () => this.close());
  }

  /**
   * Close modal
   */
  close() {
    const modal = document.getElementById("hospitalSelectorModal");
    if (modal) {
      modal.remove();
    }

    // Remove ESC listener
    document.removeEventListener("keydown", this.handleEscKey);
  }
}

// Export singleton
export const hospitalSelector = new HospitalSelector();
