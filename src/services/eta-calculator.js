/**
 * ETA Calculator Service
 * Uses Google Maps Directions API to calculate accurate ETA with traffic
 */
import { KIOSK_CONFIG } from '../config.js';

export class ETACalculator {
  constructor() {
    this.apiKey = KIOSK_CONFIG.googleMapsApiKey;
    this.directionsService = null;
    this.mapsLoaded = false;
  }

  /**
   * Load Google Maps API
   */
  async loadGoogleMaps() {
    if (this.mapsLoaded && window.google && window.google.maps) {
      return true;
    }

    if (this.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('[ETACalculator] Google Maps API key not configured, using fallback');
      return false;
    }

    return new Promise((resolve) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        this.mapsLoaded = true;
        this.directionsService = new google.maps.DirectionsService();
        resolve(true);
        return;
      }

      // Load script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.mapsLoaded = true;
        this.directionsService = new google.maps.DirectionsService();
        console.log('[ETACalculator] Google Maps loaded');
        resolve(true);
      };

      script.onerror = () => {
        console.error('[ETACalculator] Failed to load Google Maps');
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Calculate ETA using Google Maps Directions API
   * @param {Object} origin - {lat, lng}
   * @param {Object} destination - {lat, lng}
   * @returns {Promise<{duration, distance, arrivalTime, route}>}
   */
  async calculateETA(origin, destination) {
    // Try Google Maps first
    if (await this.loadGoogleMaps()) {
      try {
        return await this.calculateGoogleMapsETA(origin, destination);
      } catch (error) {
        console.warn('[ETACalculator] Google Maps failed, falling back:', error);
      }
    }

    // Fallback to simple calculation
    return this.calculateSimpleETA(origin, destination);
  }

  /**
   * Calculate ETA using Google Maps Directions API
   */
  async calculateGoogleMapsETA(origin, destination) {
    return new Promise((resolve, reject) => {
      this.directionsService.route(
        {
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.PESSIMISTIC, // Account for traffic
          },
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0];
            const leg = route.legs[0];

            // Base duration from Google Maps
            const baseDuration = leg.duration.value; // seconds

            // Emergency vehicles are typically 30% faster than normal traffic
            const emergencyMultiplier = 0.7;
            const emergencyDuration = Math.round(baseDuration * emergencyMultiplier);

            const eta = {
              duration: Math.round(emergencyDuration / 60), // minutes
              distance: Math.round(leg.distance.value / 1000), // km
              arrivalTime: new Date(Date.now() + emergencyDuration * 1000).toISOString(),
              route: this.encodeRoute(route),
              source: 'google_maps',
            };

            console.log('[ETACalculator] Google Maps ETA:', {
              duration: `${eta.duration} min`,
              distance: `${eta.distance} km`,
            });

            resolve(eta);
          } else {
            reject(new Error(`Google Maps Directions failed: ${status}`));
          }
        },
      );
    });
  }

  /**
   * Fallback: Simple distance-based ETA calculation
   */
  calculateSimpleETA(origin, destination) {
    const distance = this.calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);

    // Emergency vehicle average speed: 80 km/h in urban, 100 km/h highway
    // Use conservative 80 km/h
    const averageSpeed = 80; // km/h
    const duration = Math.round((distance / averageSpeed) * 60); // minutes

    const eta = {
      duration,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      arrivalTime: new Date(Date.now() + duration * 60 * 1000).toISOString(),
      route: null,
      source: 'estimated',
    };

    console.log('[ETACalculator] Simple ETA:', {
      duration: `${eta.duration} min`,
      distance: `${eta.distance} km`,
    });

    return eta;
  }

  /**
   * Calculate distance using Haversine formula
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  toRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Encode route for transmission (simplified polyline)
   */
  encodeRoute(route) {
    if (!route || !route.overview_path) {
      return null;
    }

    // Sample the route (every 10th point to keep payload small)
    const path = route.overview_path;
    const sampledPath = [];

    for (let i = 0; i < path.length; i += 10) {
      sampledPath.push({
        lat: path[i].lat(),
        lng: path[i].lng(),
      });
    }

    // Always include the last point
    if (path.length > 0) {
      const lastPoint = path[path.length - 1];
      sampledPath.push({
        lat: lastPoint.lat(),
        lng: lastPoint.lng(),
      });
    }

    return sampledPath;
  }

  /**
   * Update ETA based on new location
   * @param {Object} currentLocation - {lat, lng}
   * @param {Object} destination - {lat, lng}
   * @param {Object} previousETA - Previous ETA object
   * @returns {Promise<Object>} Updated ETA
   */
  async updateETA(currentLocation, destination, previousETA) {
    // Recalculate ETA
    const newETA = await this.calculateETA(currentLocation, destination);

    // Check if significantly different (>2 minutes)
    if (previousETA && Math.abs(newETA.duration - previousETA.duration) > 2) {
      console.log('[ETACalculator] ETA changed significantly:', {
        previous: `${previousETA.duration} min`,
        new: `${newETA.duration} min`,
      });
    }

    return newETA;
  }
}

// Export singleton instance
export const etaCalculator = new ETACalculator();
