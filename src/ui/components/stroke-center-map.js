// GPS-based stroke center map component
import {
  COMPREHENSIVE_HOSPITAL_DATABASE,
  ROUTING_ALGORITHM,
} from "../../data/comprehensive-stroke-centers.js";
import {
  calculateDistance,
  calculateTravelTime,
  calculateEmergencyTravelTime,
} from "../../data/stroke-centers.js";
import { t } from "../../localization/i18n.js";
import { safeSetInnerHTML } from "../../security/html-sanitizer.js";

export function renderStrokeCenterMap(results) {
  return `
        <div id="locationContainer" >
          <!-- Location Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <button 
              type="button" 
              id="useGpsButton" 
              class="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition transform hover:scale-[1.02] shadow-sm"
            >
              📍 ${t("useCurrentLocation")}
            </button>

            <button 
              type="button" 
              id="manualLocationButton" 
              class="px-4 py-2 rounded-md font-medium text-white bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none transition transform hover:scale-[1.02] shadow-sm"
            >
              ✏️ ${t("enterManually")}
            </button>
          </div>

          <!-- Manual Location Input -->
          <div class="location-manual hidden flex gap-2">
            <input 
              type="text" 
              id="locationInput" 
              class="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition"
              placeholder="${t("enterLocationPlaceholder") || "e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}"
            />
            <button 
              type="button" 
              id="searchLocationButton" 
              class="px-4 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition transform hover:scale-[1.02] shadow-sm"
            >
              ${t("search")}
            </button>
          </div>

          <!-- Results -->
          <div 
            id="strokeCenterResults" 
            class="stroke-center-results space-y-3"
          ></div>
        </div>
  `;
}

export function initializeStrokeCenterMap(results) {
  console.log("[StrokeMap] Initializing stroke center map with results:", results);

  const useGpsButton = document.getElementById("useGpsButton");
  const manualLocationButton = document.getElementById("manualLocationButton");
  const locationManual = document.querySelector(".location-manual");
  const locationInput = document.getElementById("locationInput");
  const searchLocationButton = document.getElementById("searchLocationButton");
  const resultsContainer = document.getElementById("strokeCenterResults");
  resultsContainer.className = "mt-4";
  console.log("[StrokeMap] Found elements:", {
    useGpsButton: !!useGpsButton,
    manualLocationButton: !!manualLocationButton,
    locationManual: !!locationManual,
    locationInput: !!locationInput,
    searchLocationButton: !!searchLocationButton,
    resultsContainer: !!resultsContainer,
  });

  if (useGpsButton) {
    useGpsButton.addEventListener("click", () => {
      requestUserLocation(results, resultsContainer);
    });
  }

  if (manualLocationButton) {
    manualLocationButton.addEventListener("click", () => {
      const isHidden = getComputedStyle(locationManual).display === "none";
      locationManual.style.display = isHidden ? "block" : "none";
      locationManual.className = "mt-4";
    });
  }

  if (searchLocationButton) {
    searchLocationButton.addEventListener("click", () => {
      const location = locationInput.value.trim();
      if (location) {
        geocodeLocation(location, results, resultsContainer);
      }
    });
  }

  if (locationInput) {
    locationInput.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        const location = locationInput.value.trim();
        if (location) {
          geocodeLocation(location, results, resultsContainer);
        }
      }
    });
  }
}

function requestUserLocation(results, resultsContainer) {
  if (!navigator.geolocation) {
    showLocationError(t("geolocationNotSupported"), resultsContainer);
    return;
  }

  try {
    safeSetInnerHTML(resultsContainer, `<div class="loading">${t("gettingLocation")}...</div>`);
  } catch (error) {
    resultsContainer.textContent = "Getting location...";
    console.error("Sanitization failed:", error);
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      showNearestCenters(latitude, longitude, results, resultsContainer);
    },
    error => {
      let errorMessage = t("locationError");
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = t("locationPermissionDenied");
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = t("locationUnavailable");
          break;
        case error.TIMEOUT:
          errorMessage = t("locationTimeout");
          break;
      }
      showLocationError(errorMessage, resultsContainer);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    }
  );
}

async function geocodeLocation(locationString, results, resultsContainer) {
  // ✅ Local cache to avoid repeated network calls
  if (!window.__geocodeCache) window.__geocodeCache = new Map();
  const cache = window.__geocodeCache;

  // 🧹 Early input validation
  if (!locationString || !locationString.trim()) {
    showLocationError("Please enter a location or coordinates.", resultsContainer);
    return;
  }

  // 🕓 Show loading message
  try {
    safeSetInnerHTML(resultsContainer, `<div class="loading">${t("searchingLocation")}...</div>`);
  } catch (error) {
    resultsContainer.textContent = "Searching location...";
    console.error("Sanitization failed:", error);
  }

  // 🧭 Check if input is coordinates (lat, lng)
  const coordPattern = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
  const coordMatch = locationString.trim().match(coordPattern);

  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);

    // ✅ Expanded range for Germany (with buffer)
    if (lat >= 46.5 && lat <= 55.1 && lng >= 5.5 && lng <= 15.5) {
      try {
        safeSetInnerHTML(
          resultsContainer,
          `
          <div class="location-success">
            <p>📍 Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          </div>
        `
        );
      } catch (error) {
        resultsContainer.textContent = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        console.error("Sanitization failed:", error);
      }

      setTimeout(() => showNearestCenters(lat, lng, results, resultsContainer), 500);
      return;
    }

    showLocationError(
      "Coordinates appear to be outside Germany. Please check the values.",
      resultsContainer
    );
    return;
  }

  // 🧹 Clean up input
  let searchLocation = locationString.trim();

  // Add ", Deutschland" if not included
  if (
    !/deutschland|germany|bayern|bavaria|baden|württemberg|nordrhein|westfalen/i.test(
      searchLocation
    )
  ) {
    searchLocation += ", Deutschland";
  }

  // 🧠 Cached result check
  if (cache.has(searchLocation)) {
    const cached = cache.get(searchLocation);
    displayLocationSuccess(cached, results, resultsContainer);
    return;
  }

  // 💤 Optional debounce to prevent API spam
  await new Promise(r => setTimeout(r, 300));

  // 🌍 Build Nominatim request
  const encodedLocation = encodeURIComponent(searchLocation);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&countrycodes=de&format=json&limit=3&addressdetails=1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "iGFAP-StrokeTriage/2.1.0 (contact: support@yourdomain.de)",
      },
    });

    if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`);

    const data = await response.json();

    if (data && data.length > 0) {
      const supportedStates = ["Bayern", "Baden-Württemberg", "Nordrhein-Westfalen"];
      let location =
        data.find(r => r.address && supportedStates.includes(r.address.state)) || data[0];

      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lon);
      const locationName = location.display_name || locationString;

      // ✅ Cache result
      cache.set(searchLocation, { lat, lng, locationName });

      displayLocationSuccess({ lat, lng, locationName }, results, resultsContainer);
    } else {
      showLocationError(
        `
        <strong>Location "${locationString}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,
        resultsContainer
      );
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    showLocationError(
      `
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,
      resultsContainer
    );
  }
}

async function showNearestCenters(lat, lng, results, resultsContainer) {
  const location = { lat, lng };

  const routing = ROUTING_ALGORITHM.routePatient({
    location,
    ichProbability: results?.ich?.probability || 0,
    timeFromOnset: results?.timeFromOnset || null,
    clinicalFactors: results?.clinicalFactors || {},
  });

  if (!routing || !routing.destination) {
    safeSetInnerHTML(
      resultsContainer,
      `
      <div class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <p class="font-semibold">⚠️ No suitable stroke centers found in this area.</p>
        <p class="text-sm mt-1 text-gray-600 dark:text-gray-400">
          Please try a different location or contact emergency services directly.
        </p>
      </div>
      `
    );
    return;
  }

  const routingExplanation = getEnhancedRoutingExplanation(routing, results);

  safeSetInnerHTML(
    resultsContainer,
    `
    <div class="bg-yellow-100 dark:bg-yellow-900/20 text-blue-900 dark:text-blue-200 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
      <p><strong>${t("yourLocation")}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
      <p><strong>${t("detectedState") || "Detected State"}:</strong> ${getStateName(routing.state)}</p>
      <div class="text-gray-700 dark:text-gray-300 text-sm italic mt-2">${t("calculatingTravelTimes")}...</div>
    </div>
    `
  );

  try {
    const database = COMPREHENSIVE_HOSPITAL_DATABASE[routing.state];
    const allHospitals = [
      ...database.neurosurgicalCenters,
      ...database.comprehensiveStrokeCenters,
      ...database.regionalStrokeUnits,
      ...(database.thrombolysisHospitals || []),
    ];

    const { destination } = routing;
    destination.distance = calculateDistance(
      lat,
      lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    );

    try {
      const travelInfo = await calculateEmergencyTravelTime(
        lat,
        lng,
        destination.coordinates.lat,
        destination.coordinates.lng
      );
      destination.travelTime = travelInfo.duration;
      destination.travelSource = travelInfo.source;
    } catch {
      destination.travelTime = Math.round(destination.distance / 0.8);
      destination.travelSource = "estimated";
    }

    const alternatives = allHospitals
      .filter(h => h.id !== destination.id)
      .map(h => ({
        ...h,
        distance: calculateDistance(lat, lng, h.coordinates.lat, h.coordinates.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    for (const alt of alternatives) {
      try {
        const travelInfo = await calculateEmergencyTravelTime(
          lat,
          lng,
          alt.coordinates.lat,
          alt.coordinates.lng
        );
        alt.travelTime = travelInfo.duration;
        alt.travelSource = travelInfo.source;
      } catch {
        alt.travelTime = Math.round(alt.distance / 0.8);
        alt.travelSource = "estimated";
      }
    }

    // --- 🧠 DOM Rendering ---
    resultsContainer.innerHTML = "";

    const mainDiv = document.createElement("div");
    mainDiv.className = "space-y-6 mt-4";

    // 🌍 Location + Routing Info
    const locationDiv = document.createElement("div");
    locationDiv.className =
      "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4";
    locationDiv.innerHTML = `
    <div class="p-4 bg-white rounded-lg shadow-md space-y-2">
      <p class="text-gray-700">
        <strong class="font-semibold text-gray-900">Your Location:</strong> 
        ${lat.toFixed(4)}, ${lng.toFixed(4)}
      </p>
      <p class="text-gray-700">
        <strong class="font-semibold text-gray-900">State:</strong> 
        ${getStateName(routing.state)}
      </p>
      <div class="text-sm text-gray-600">
        ${routingExplanation}
      </div>
    </div>
  `;
    mainDiv.appendChild(locationDiv);

    // 🏥 Recommended Center
    const primaryDiv = document.createElement("div");
    primaryDiv.className =
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm";
    primaryDiv.innerHTML = `
      <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
        🏥 ${routing.urgency === "IMMEDIATE" ? "Emergency" : "Recommended"} Destination
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      </div>
    `;
    const primaryGrid = primaryDiv.querySelector("div.grid");
    primaryGrid.appendChild(createStrokeCenterCard(destination, true, routing));
    mainDiv.appendChild(primaryDiv);

    // 🏥 Alternative Centers
    if (alternatives.length > 0) {
      const altDiv = document.createElement("div");
      altDiv.className =
        "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4";
      altDiv.innerHTML = `
        <h4 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Alternative Centers
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"></div>
      `;
      const altGrid = altDiv.querySelector("div.grid");
      alternatives.forEach(alt => altGrid.appendChild(createStrokeCenterCard(alt, false, routing)));
      mainDiv.appendChild(altDiv);
    }

    // ℹ️ Travel Note
    const noteDiv = document.createElement("div");
    noteDiv.className = "text-md text-gray-600 dark:text-gray-400 italic mt-4 text-center";
    noteDiv.innerHTML = "<small>Travel times estimated for emergency vehicles</small>";
    mainDiv.appendChild(noteDiv);

    resultsContainer.appendChild(mainDiv);
    addStrokeCenterEventListeners(resultsContainer);
  } catch (error) {
    console.error("🚨 Stroke Center Display Error:", error);

    resultsContainer.innerHTML = `
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 class="text-lg font-semibold mb-2">🏥 Recommended Center</h4>
        <p><strong>${routing?.destination?.name || "Unknown Hospital"}</strong></p>
        <p class="text-gray-600 dark:text-gray-400">📍 ${routing?.destination?.address || "Address not available"}</p>
        <p class="text-gray-600 dark:text-gray-400">📞 ${routing?.destination?.emergency || routing?.destination?.phone || "Phone not available"}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          📏 Distance: ${routing?.destination?.distance?.toFixed(1) || "?"} km
        </p>
        ${
          alternatives?.length > 0
            ? `<p class="mt-2 text-sm text-gray-600 dark:text-gray-400"><strong>+ ${alternatives.length} alternative centers nearby</strong></p>`
            : ""
        }
      </div>
    `;
  }
}

function renderStrokeCenterList(centers, isRecommended = false) {
  if (!centers || centers.length === 0) {
    return `<p>${t("noCentersFound")}</p>`;
  }

  return centers
    .map(
      center => `
    <div class="stroke-center-card ${isRecommended ? "recommended" : "alternative"}">
      <div class="center-header">
        <h5>${center.name}</h5>
        <span class="center-type ${center.type}">${t(`${center.type}Center`)}</span>
        ${
          center.travelTime
            ? `
          <span class="travel-time">
            <span class="time">${center.travelTime} ${t("minutes")}</span>
            <span class="distance">(${center.distance} km)</span>
          </span>
        `
            : `
          <span class="distance">${center.distance.toFixed(1)} km</span>
        `
        }
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${center.address}</p>
        <p class="phone">📞 ${t("emergency")}: ${center.emergency}</p>
        
        <div class="services">
          ${center.services
            .map(
              service => `
            <span class="service-badge">${t(service)}</span>
          `
            )
            .join("")}
        </div>
        
        ${
          center.certified
            ? `
          <div class="certification">
            ✅ ${t("certified")}: ${center.certification}
          </div>
        `
            : ""
        }
      </div>
      
      <div class="center-actions">
        <button class="call-button" data-phone="${center.emergency}">
          📞 ${t("call")}
        </button>
        <button class="directions-button" data-lat="${center.coordinates.lat}" data-lng="${center.coordinates.lng}">
          🧭 ${t("directions")}
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

// Helper functions for enhanced routing system
function getStateName(stateCode) {
  const stateNames = {
    bayern: "Bayern (Bavaria)",
    badenWuerttemberg: "Baden-Württemberg",
    nordrheinWestfalen: "Nordrhein-Westfalen (NRW)",
  };
  return stateNames[stateCode] || stateCode;
}

function getEnhancedRoutingExplanation(routing, results) {
  const ichPercent = Math.round((results?.ich?.probability || 0) * 100);

  let urgencyIcon = "🏥";
  let urgencyColor = "from-gray-500 to-gray-600";

  if (routing.urgency === "IMMEDIATE") {
    urgencyIcon = "🚨";
    urgencyColor = "from-red-500 to-red-700";
  } else if (routing.urgency === "TIME_CRITICAL") {
    urgencyIcon = "⏰";
    urgencyColor = "from-yellow-500 to-orange-600";
  } else if (routing.urgency === "URGENT") {
    urgencyIcon = "⚠️";
    urgencyColor = "from-amber-500 to-yellow-600";
  }

  return `
    <div class="routing-explanation ${routing.category.toLowerCase()} 
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
      rounded-lg shadow-md p-4 mt-4 transition-all duration-300 hover:shadow-xl">
      
      <div class="routing-header mb-3 flex items-center justify-between">
        <strong class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span class="text-xl">${urgencyIcon}</span> 
          ${routing.category.replace("_", " ")} - ${routing.urgency}
        </strong>
        <span class="text-xs px-2 py-1 rounded-md text-white bg-gradient-to-r ${urgencyColor} shadow-sm font-medium">
          ${routing.urgency}
        </span>
      </div>

      <div class="routing-details space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p><strong>🧠 ICH Risk:</strong> <span class="font-medium">${ichPercent}%</span> ${routing.threshold ? `(${routing.threshold})` : ""}</p>
        ${
          routing.timeWindow
            ? `<p><strong>⏳ Time Window:</strong> <span class="font-medium">${routing.timeWindow}</span></p>`
            : ""
        }
        <p><strong>🧭 Routing Logic:</strong> ${routing.reasoning}</p>
        <p><strong>📢 Pre-Alert:</strong> ${routing.preAlert}</p>
        ${
          routing.bypassLocal
            ? `<p class="bypass-warning text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                ⚠️ <span>Bypassing local hospitals</span>
              </p>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderEnhancedStrokeCenterCard(center, isRecommended, routing) {
  const capabilities = [];
  if (center.neurosurgery) {
    capabilities.push("🧠 Neurosurgery");
  }
  if (center.thrombectomy) {
    capabilities.push("🩸 Thrombectomy");
  }
  if (center.thrombolysis) {
    capabilities.push("💉 Thrombolysis");
  }

  const networkBadge = center.network ? `<span class="network-badge">${center.network}</span>` : "";

  return `
    <div class="stroke-center-card ${isRecommended ? "recommended" : "alternative"} enhanced">
      <div class="center-header">
        <h5>${center.name}</h5>
        <div class="center-badges">
          ${center.neurosurgery ? '<span class="capability-badge neurosurgery">NS</span>' : ""}
          ${center.thrombectomy ? '<span class="capability-badge thrombectomy">TE</span>' : ""}
          ${networkBadge}
        </div>
      </div>
      
      <div class="center-metrics">
        ${
          center.travelTime
            ? `
          <div class="travel-info">
            <span class="travel-time">${center.travelTime} min</span>
            <span class="distance">${center.distance.toFixed(1)} km</span>
          </div>
        `
            : `
          <div class="distance-only">
            <span class="distance">${center.distance.toFixed(1)} km</span>
          </div>
        `
        }
        <div class="bed-info">
          <span class="beds">${center.beds} beds</span>
        </div>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${center.address}</p>
        <p class="phone">📞 ${center.emergency || center.phone}</p>
        
        ${
          capabilities.length > 0
            ? `
          <div class="capabilities">
            ${capabilities.join(" • ")}
          </div>
        `
            : ""
        }
      </div>
      
      <div class="center-actions">
        <button class="call-button" data-phone="${center.emergency || center.phone}">
          📞 Call
        </button>
        <button class="directions-button" data-lat="${center.coordinates.lat}" data-lng="${center.coordinates.lng}">
          🧭 Directions
        </button>
      </div>
    </div>
  `;
}

function createStrokeCenterCard(center, isRecommended, routing) {
  const card = document.createElement("div");
  card.className = `stroke-center-card ${isRecommended ? "recommended" : "alternative"} enhanced 
    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
    rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
    p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`;

  const capabilities = [];
  if (center.neurosurgery) capabilities.push("🧠 Neurosurgery");
  if (center.thrombectomy) capabilities.push("🩸 Thrombectomy");
  if (center.thrombolysis) capabilities.push("💉 Thrombolysis");

  const networkBadge = center.network
    ? `<span class="network-badge inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">${center.network}</span>`
    : "";

  card.innerHTML = `
    <div class="center-header flex justify-between items-start mb-3">
      <h5 class="text-lg font-semibold leading-snug">${center.name}</h5>
      <div class="center-badges flex gap-1">
        ${
          center.neurosurgery
            ? '<span class="capability-badge neurosurgery bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-2 py-0.5 text-xs rounded-md font-medium">NS</span>'
            : ""
        }
        ${
          center.thrombectomy
            ? '<span class="capability-badge thrombectomy bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-2 py-0.5 text-xs rounded-md font-medium">TE</span>'
            : ""
        }
        ${networkBadge}
      </div>
    </div>

    <div class="center-metrics flex justify-between items-center mb-4">
      ${
        center.travelTime
          ? `
        <div class="travel-info flex flex-col text-sm text-gray-600 dark:text-gray-400">
          <span class="travel-time font-semibold text-base text-blue-600 dark:text-blue-400">${center.travelTime} min</span>
          <span class="distance">${center.distance.toFixed(1)} km</span>
        </div>
      `
          : `
        <div class="distance-only text-sm text-gray-600 dark:text-gray-400">
          <span class="distance font-medium">${center.distance.toFixed(1)} km</span>
        </div>
      `
      }
      <div class="bed-info text-sm text-gray-700 dark:text-gray-300">
        <span class="beds bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs">${center.beds} beds</span>
      </div>
    </div>

    <div class="center-details space-y-1 mb-4">
      <p class="address text-sm">📍 ${center.address}</p>
      <p class="phone text-sm">📞 ${center.emergency || center.phone}</p>
      ${
        capabilities.length > 0
          ? `<div class="capabilities text-xs text-gray-600 dark:text-gray-400 italic">${capabilities.join(" • ")}</div>`
          : ""
      }
    </div>

    <div class="center-actions flex gap-3">
      <button 
        class="call-button flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
        text-white text-sm font-semibold py-2 rounded-md shadow-md transition-transform transform hover:scale-[1.03]" 
        data-phone="${center.emergency || center.phone}">
        📞 Call
      </button>
      <button 
        class="directions-button flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
        text-white text-sm font-semibold py-2 rounded-md shadow-md transition-transform transform hover:scale-[1.03]" 
        data-lat="${center.coordinates.lat}" 
        data-lng="${center.coordinates.lng}">
        🧭 Directions
      </button>
    </div>
  `;

  return card;
}

function addStrokeCenterEventListeners(container) {
  const callButtons = container.querySelectorAll(".call-button");
  const directionsButtons = container.querySelectorAll(".directions-button");

  callButtons.forEach(button => {
    button.addEventListener("click", () => {
      const { phone } = button.dataset;
      if (phone) {
        window.open(`tel:${phone}`);
      }
    });
  });

  directionsButtons.forEach(button => {
    button.addEventListener("click", () => {
      const { lat } = button.dataset;
      const { lng } = button.dataset;
      if (lat && lng) {
        window.open(`https://maps.google.com/maps?daddr=${lat},${lng}`, "_blank");
      }
    });
  });
}

function showLocationError(message, container) {
  try {
    safeSetInnerHTML(
      container,
      `
      <div class="location-error">
        <p>⚠️ ${message}</p>
        <p><small>${t("tryManualEntry")}</small></p>
      </div>
    `
    );
  } catch (error) {
    container.textContent = `Error: ${message}. ${t("tryManualEntry") || "Try manual entry"}`;
    console.error("Sanitization failed:", error);
  }
}
