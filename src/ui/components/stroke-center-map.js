// GPS-based stroke center map component
import { COMPREHENSIVE_HOSPITAL_DATABASE, ROUTING_ALGORITHM } from '../../data/comprehensive-stroke-centers.js';
import { calculateDistance, calculateTravelTime, calculateEmergencyTravelTime } from '../../data/stroke-centers.js';
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
            <input type="text" id="locationInput" placeholder="${t('enterLocationPlaceholder') || 'e.g. München, Köln, Stuttgart, or 48.1351, 11.5820'}" />
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
    
    // Validate coordinates are within supported German states (Bayern, BW, NRW)
    if (lat >= 47.2 && lat <= 52.5 && lng >= 5.9 && lng <= 15.0) {
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
    
    // If it doesn't already include country info, add it
    if (!searchLocation.toLowerCase().includes('deutschland') &&
        !searchLocation.toLowerCase().includes('germany') &&
        !searchLocation.toLowerCase().includes('bayern') &&
        !searchLocation.toLowerCase().includes('bavaria') &&
        !searchLocation.toLowerCase().includes('nordrhein') &&
        !searchLocation.toLowerCase().includes('baden')) {
      searchLocation = searchLocation + ', Deutschland';
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
      // Prefer results from supported states (Bayern, Baden-Württemberg, NRW)
      let location = data[0];
      const supportedStates = ['Bayern', 'Baden-Württemberg', 'Nordrhein-Westfalen'];
      
      for (const result of data) {
        if (result.address && supportedStates.includes(result.address.state)) {
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
          <li>City name: "München", "Köln", "Stuttgart"</li>
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
  const location = { lat, lng };
  
  // Use the enhanced routing algorithm
  const routing = ROUTING_ALGORITHM.routePatient({
    location,
    ichProbability: results?.ich?.probability || 0,
    timeFromOnset: results?.timeFromOnset || null,
    clinicalFactors: results?.clinicalFactors || {}
  });
  
  if (!routing || !routing.destination) {
    resultsContainer.innerHTML = `
      <div class="location-error">
        <p>⚠️ No suitable stroke centers found in this area.</p>
        <p><small>Please try a different location or contact emergency services directly.</small></p>
      </div>
    `;
    return;
  }

  // Generate routing explanation
  const routingExplanation = getEnhancedRoutingExplanation(routing, results);
  
  // Show loading state
  resultsContainer.innerHTML = `
    <div class="location-info">
      <p><strong>${t('yourLocation')}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
      <p><strong>Detected State:</strong> ${getStateName(routing.state)}</p>
    </div>
    <div class="loading">${t('calculatingTravelTimes')}...</div>
  `;
  
  try {
    // Get all relevant hospitals for this routing decision
    const database = COMPREHENSIVE_HOSPITAL_DATABASE[routing.state];
    const allHospitals = [
      ...database.neurosurgicalCenters,
      ...database.comprehensiveStrokeCenters,
      ...database.regionalStrokeUnits,
      ...(database.thrombolysisHospitals || [])
    ];

    // Add distance and travel time to primary destination
    const destination = routing.destination;
    destination.distance = calculateDistance(lat, lng, destination.coordinates.lat, destination.coordinates.lng);
    
    try {
      const travelInfo = await calculateEmergencyTravelTime(lat, lng, destination.coordinates.lat, destination.coordinates.lng);
      destination.travelTime = travelInfo.duration;
      destination.travelSource = travelInfo.source;
    } catch (error) {
      destination.travelTime = Math.round(destination.distance / 0.8); // Estimate
      destination.travelSource = 'estimated';
    }

    // Find 3-4 alternative hospitals nearby
    const alternatives = allHospitals
      .filter(h => h.id !== destination.id)
      .map(hospital => ({
        ...hospital,
        distance: calculateDistance(lat, lng, hospital.coordinates.lat, hospital.coordinates.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    // Add travel times to alternatives
    for (const alt of alternatives) {
      try {
        const travelInfo = await calculateEmergencyTravelTime(lat, lng, alt.coordinates.lat, alt.coordinates.lng);
        alt.travelTime = travelInfo.duration;
        alt.travelSource = travelInfo.source;
      } catch (error) {
        alt.travelTime = Math.round(alt.distance / 0.8);
        alt.travelSource = 'estimated';
      }
    }
    
    const html = `
      <div class="location-info">
        <p><strong>${t('yourLocation')}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        <p><strong>State:</strong> ${getStateName(routing.state)}</p>
        ${routingExplanation}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${routing.urgency === 'IMMEDIATE' ? 'Emergency' : 'Recommended'} Destination</h4>
        ${renderEnhancedStrokeCenterCard(destination, true, routing)}
      </div>
      
      ${alternatives.length > 0 ? `
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${alternatives.map(alt => renderEnhancedStrokeCenterCard(alt, false, routing)).join('')}
        </div>
      ` : ''}
      
      <div class="travel-time-note">
        <small>${t('travelTimeNote') || 'Travel times estimated for emergency vehicles'}</small>
      </div>
    `;
    
    resultsContainer.innerHTML = html;
    
  } catch (error) {
    console.warn('Enhanced routing failed, using basic display:', error);
    
    // Fallback to basic display
    resultsContainer.innerHTML = `
      <div class="location-info">
        <p><strong>${t('yourLocation')}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        ${routingExplanation}
      </div>
      
      <div class="recommended-centers">
        <h4>Recommended Center</h4>
        <div class="stroke-center-card recommended">
          <div class="center-header">
            <h5>${routing.destination.name}</h5>
            <span class="distance">${routing.destination.distance?.toFixed(1) || '?'} km</span>
          </div>
          <div class="center-details">
            <p class="address">📍 ${routing.destination.address}</p>
            <p class="phone">📞 ${routing.destination.emergency || routing.destination.phone}</p>
          </div>
        </div>
      </div>
      
      <div class="routing-reasoning">
        <p><strong>Routing Logic:</strong> ${routing.reasoning}</p>
      </div>
    `;
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

// Helper functions for enhanced routing system
function getStateName(stateCode) {
  const stateNames = {
    'bayern': 'Bayern (Bavaria)',
    'badenWuerttemberg': 'Baden-Württemberg',
    'nordrheinWestfalen': 'Nordrhein-Westfalen (NRW)'
  };
  return stateNames[stateCode] || stateCode;
}

function getEnhancedRoutingExplanation(routing, results) {
  const ichPercent = Math.round((results?.ich?.probability || 0) * 100);
  
  let urgencyIcon = '🏥';
  if (routing.urgency === 'IMMEDIATE') urgencyIcon = '🚨';
  else if (routing.urgency === 'TIME_CRITICAL') urgencyIcon = '⏰';
  else if (routing.urgency === 'URGENT') urgencyIcon = '⚠️';
  
  return `
    <div class="routing-explanation ${routing.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${urgencyIcon} ${routing.category.replace('_', ' ')} - ${routing.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${ichPercent}% ${routing.threshold ? `(${routing.threshold})` : ''}</p>
        ${routing.timeWindow ? `<p><strong>Time Window:</strong> ${routing.timeWindow}</p>` : ''}
        <p><strong>Routing Logic:</strong> ${routing.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${routing.preAlert}</p>
        ${routing.bypassLocal ? '<p class="bypass-warning">⚠️ Bypassing local hospitals</p>' : ''}
      </div>
    </div>
  `;
}

function renderEnhancedStrokeCenterCard(center, isRecommended, routing) {
  const capabilities = [];
  if (center.neurosurgery) capabilities.push('🧠 Neurosurgery');
  if (center.thrombectomy) capabilities.push('🩸 Thrombectomy');
  if (center.thrombolysis) capabilities.push('💉 Thrombolysis');
  
  const networkBadge = center.network ? `<span class="network-badge">${center.network}</span>` : '';
  
  return `
    <div class="stroke-center-card ${isRecommended ? 'recommended' : 'alternative'} enhanced">
      <div class="center-header">
        <h5>${center.name}</h5>
        <div class="center-badges">
          ${center.neurosurgery ? '<span class="capability-badge neurosurgery">NS</span>' : ''}
          ${center.thrombectomy ? '<span class="capability-badge thrombectomy">TE</span>' : ''}
          ${networkBadge}
        </div>
      </div>
      
      <div class="center-metrics">
        ${center.travelTime ? `
          <div class="travel-info">
            <span class="travel-time">${center.travelTime} min</span>
            <span class="distance">${center.distance.toFixed(1)} km</span>
          </div>
        ` : `
          <div class="distance-only">
            <span class="distance">${center.distance.toFixed(1)} km</span>
          </div>
        `}
        <div class="bed-info">
          <span class="beds">${center.beds} beds</span>
        </div>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${center.address}</p>
        <p class="phone">📞 ${center.emergency || center.phone}</p>
        
        ${capabilities.length > 0 ? `
          <div class="capabilities">
            ${capabilities.join(' • ')}
          </div>
        ` : ''}
      </div>
      
      <div class="center-actions">
        <button class="call-button" onclick="window.open('tel:${center.emergency || center.phone}')">
          📞 Call
        </button>
        <button class="directions-button" onclick="window.open('https://maps.google.com/maps?daddr=${center.coordinates.lat},${center.coordinates.lng}', '_blank')">
          🧭 Directions
        </button>
      </div>
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