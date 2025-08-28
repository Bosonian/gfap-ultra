// GPS-based stroke center map component
import { findNearestStrokeCenters, getRecommendedStrokeCenters, findNearestStrokeCentersWithTravelTime, getRecommendedStrokeCentersWithTravelTime } from '../../data/stroke-centers.js';
import { t } from '../../localization/i18n.js';

export function renderStrokeCenterMap(results) {
  return `
    <div class="stroke-center-section">
      <h3>🏥 ${t('nearestCentersTitle')}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${t('useCurrentLocation')}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${t('enterLocationPlaceholder') || 'e.g. München, Bad Tölz, or 48.1351, 11.5820'}" />
            <button type="button" id="searchLocationButton" class="secondary">${t('search')}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${t('enterManually')}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `;
}

export function initializeStrokeCenterMap(results) {
  const useGpsButton = document.getElementById('useGpsButton');
  const manualLocationButton = document.getElementById('manualLocationButton');
  const locationManual = document.querySelector('.location-manual');
  const locationInput = document.getElementById('locationInput');
  const searchLocationButton = document.getElementById('searchLocationButton');
  const resultsContainer = document.getElementById('strokeCenterResults');

  if (useGpsButton) {
    useGpsButton.addEventListener('click', () => {
      requestUserLocation(results, resultsContainer);
    });
  }

  if (manualLocationButton) {
    manualLocationButton.addEventListener('click', () => {
      locationManual.style.display = locationManual.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (searchLocationButton) {
    searchLocationButton.addEventListener('click', () => {
      const location = locationInput.value.trim();
      if (location) {
        geocodeLocation(location, results, resultsContainer);
      }
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
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
    showLocationError(t('geolocationNotSupported'), resultsContainer);
    return;
  }

  resultsContainer.innerHTML = `<div class="loading">${t('gettingLocation')}...</div>`;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      showNearestCenters(latitude, longitude, results, resultsContainer);
    },
    (error) => {
      let errorMessage = t('locationError');
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = t('locationPermissionDenied');
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = t('locationUnavailable');
          break;
        case error.TIMEOUT:
          errorMessage = t('locationTimeout');
          break;
      }
      showLocationError(errorMessage, resultsContainer);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  );
}

async function geocodeLocation(locationString, results, resultsContainer) {
  resultsContainer.innerHTML = `<div class="loading">${t('searchingLocation')}...</div>`;
  
  // Check if user entered coordinates (format: lat, lng or lat,lng)
  const coordPattern = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
  const coordMatch = locationString.trim().match(coordPattern);
  
  if (coordMatch) {
    // Direct coordinate input
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    
    // Validate coordinates are within Germany's approximate bounds
    if (lat >= 47.2 && lat <= 55.1 && lng >= 5.9 && lng <= 15.0) {
      resultsContainer.innerHTML = `
        <div class="location-success">
          <p>📍 Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        </div>
      `;
      setTimeout(() => {
        showNearestCenters(lat, lng, results, resultsContainer);
      }, 500);
      return;
    } else {
      showLocationError(`Coordinates appear to be outside Germany. Please check the values.`, resultsContainer);
      return;
    }
  }
  
  try {
    // Clean up the location string
    let searchLocation = locationString.trim();
    
    // If it doesn't already include country/state info, add it
    if (!searchLocation.toLowerCase().includes('bayern') && 
        !searchLocation.toLowerCase().includes('bavaria') && 
        !searchLocation.toLowerCase().includes('deutschland') &&
        !searchLocation.toLowerCase().includes('germany')) {
      searchLocation = searchLocation + ', Bayern, Deutschland';
    }
    
    // Use Nominatim (OpenStreetMap) geocoding service - free and reliable
    // Note: encodeURIComponent properly handles umlauts (ä, ö, ü, ß)
    const encodedLocation = encodeURIComponent(searchLocation);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&countrycodes=de&format=json&limit=3&addressdetails=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'iGFAP-StrokeTriage/2.1.0' // Required by Nominatim
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      // Prefer the first result that's actually in Bayern if multiple results
      let location = data[0];
      for (const result of data) {
        if (result.address && result.address.state === 'Bayern') {
          location = result;
          break;
        }
      }
      
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lon);
      const locationName = location.display_name || locationString;
      
      // Show success message and then proceed with location
      resultsContainer.innerHTML = `
        <div class="location-success">
          <p>📍 Found: ${locationName}</p>
          <small style="color: #666;">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small>
        </div>
      `;
      
      // Wait a moment to show the found location, then show centers
      setTimeout(() => {
        showNearestCenters(lat, lng, results, resultsContainer);
      }, 1000);
      
    } else {
      showLocationError(`
        <strong>Location "${locationString}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München" or "Augsburg"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `, resultsContainer);
    }
    
  } catch (error) {
    console.warn('Geocoding failed:', error);
    showLocationError(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `, resultsContainer);
  }
}

async function showNearestCenters(lat, lng, results, resultsContainer) {
  const conditionType = determineConditionType(results);
  
  // Generate routing explanation based on condition
  const routingExplanation = getRoutingExplanation(conditionType, results);
  
  // Show loading state
  resultsContainer.innerHTML = `
    <div class="location-info">
      <p><strong>${t('yourLocation')}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
    </div>
    <div class="loading">${t('calculatingTravelTimes')}...</div>
  `;
  
  try {
    // Try to get travel time recommendations
    const recommendations = await getRecommendedStrokeCentersWithTravelTime(lat, lng, conditionType);
    
    const html = `
      <div class="location-info">
        <p><strong>${t('yourLocation')}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        ${routingExplanation}
      </div>
      
      <div class="recommended-centers">
        <h4>${t('recommendedCenters')}</h4>
        ${renderStrokeCenterList(recommendations.recommended, true)}
      </div>
      
      ${recommendations.alternative.length > 0 ? `
        <div class="alternative-centers">
          <h4>${t('alternativeCenters')}</h4>
          ${renderStrokeCenterList(recommendations.alternative, false)}
        </div>
      ` : ''}
      
      <div class="travel-time-note">
        <small>${t('travelTimeNote')}</small>
        <br><small class="powered-by">${t('poweredByOrs')}</small>
      </div>
    `;
    
    resultsContainer.innerHTML = html;
    
  } catch (error) {
    console.warn('Travel time calculation failed, falling back to distance:', error);
    
    // Fallback to distance-based recommendations
    const recommendations = getRecommendedStrokeCenters(lat, lng, conditionType);
    
    const html = `
      <div class="location-info">
        <p><strong>${t('yourLocation')}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        ${routingExplanation}
      </div>
      
      <div class="recommended-centers">
        <h4>${t('recommendedCenters')}</h4>
        ${renderStrokeCenterList(recommendations.recommended, true)}
      </div>
      
      ${recommendations.alternative.length > 0 ? `
        <div class="alternative-centers">
          <h4>${t('alternativeCenters')}</h4>
          ${renderStrokeCenterList(recommendations.alternative, false)}
        </div>
      ` : ''}
      
      <div class="distance-note">
        <small>${t('distanceNote')}</small>
      </div>
    `;
    
    resultsContainer.innerHTML = html;
  }
}

function renderStrokeCenterList(centers, isRecommended = false) {
  if (!centers || centers.length === 0) {
    return `<p>${t('noCentersFound')}</p>`;
  }

  return centers.map(center => `
    <div class="stroke-center-card ${isRecommended ? 'recommended' : 'alternative'}">
      <div class="center-header">
        <h5>${center.name}</h5>
        <span class="center-type ${center.type}">${t(center.type + 'Center')}</span>
        ${center.travelTime ? `
          <span class="travel-time">
            <span class="time">${center.travelTime} ${t('minutes')}</span>
            <span class="distance">(${center.distance} km)</span>
          </span>
        ` : `
          <span class="distance">${center.distance.toFixed(1)} km</span>
        `}
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${center.address}</p>
        <p class="phone">📞 ${t('emergency')}: ${center.emergency}</p>
        
        <div class="services">
          ${center.services.map(service => `
            <span class="service-badge">${t(service)}</span>
          `).join('')}
        </div>
        
        ${center.certified ? `
          <div class="certification">
            ✅ ${t('certified')}: ${center.certification}
          </div>
        ` : ''}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${center.emergency}')">
          📞 ${t('call')}
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${center.coordinates.lat},${center.coordinates.lng}', '_blank')">
          🧭 ${t('directions')}
        </button>
      </div>
    </div>
  `).join('');
}

function determineConditionType(results) {
  if (!results) return 'stroke';
  
  // PRIORITIZE ICH - Check for ICH first as it requires neurosurgery
  // Set threshold to 0.5 (50%) for routing to neurosurgical centers
  if (results.ich && results.ich.probability > 0.5) {
    return 'ich';
  }
  
  // Only consider LVO if ICH is low (secondary consideration)
  if (results.lvo && results.lvo.probability > 0.5 && (!results.ich || results.ich.probability < 0.5)) {
    return 'lvo';
  }
  
  return 'stroke';
}

function getRoutingExplanation(conditionType, results) {
  if (conditionType === 'ich') {
    const ichPercent = Math.round((results?.ich?.probability || 0) * 100);
    return `
      <div class="routing-explanation ich-routing">
        <strong>⚠️ ${t('neurosurgeryRouting') || 'Neurosurgical Centers Recommended'}</strong>
        <p>${t('ichRoutingExplanation') || `ICH risk ${ichPercent}% - Routing to centers with neurosurgery capability`}</p>
      </div>
    `;
  } else if (conditionType === 'lvo') {
    return `
      <div class="routing-explanation lvo-routing">
        <strong>⚡ ${t('thrombectomyRouting') || 'Thrombectomy Centers Recommended'}</strong>
        <p>${t('lvoRoutingExplanation') || 'Possible LVO - Routing to centers with thrombectomy capability'}</p>
      </div>
    `;
  }
  
  return `
    <div class="routing-explanation general-routing">
      <p>${t('generalStrokeRouting') || 'Showing nearest stroke-capable centers'}</p>
    </div>
  `;
}

function showLocationError(message, container) {
  container.innerHTML = `
    <div class="location-error">
      <p>⚠️ ${message}</p>
      <p><small>${t('tryManualEntry')}</small></p>
    </div>
  `;
}