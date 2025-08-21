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
            <input type="text" id="locationInput" placeholder="${t('enterLocationPlaceholder')}" />
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
  
  // Simple geocoding using a free service (in a real app, you'd use a proper geocoding service)
  // For now, we'll show a placeholder and allow manual coordinate entry
  showLocationError(t('geocodingNotImplemented'), resultsContainer);
}

async function showNearestCenters(lat, lng, results, resultsContainer) {
  const conditionType = determineConditionType(results);
  
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
  
  // If LVO probability is high, recommend comprehensive centers with thrombectomy
  if (results.lvo && results.lvo.probability > 0.5) {
    return 'lvo';
  }
  
  // If ICH probability is high, recommend comprehensive centers with neurosurgery
  if (results.ich && results.ich.probability > 0.6) {
    return 'ich';
  }
  
  return 'stroke';
}

function showLocationError(message, container) {
  container.innerHTML = `
    <div class="location-error">
      <p>⚠️ ${message}</p>
      <p><small>${t('tryManualEntry')}</small></p>
    </div>
  `;
}