/**
 * GPS Tracking Service
 * Handles continuous location tracking for ambulance with robust error handling
 */
import { KIOSK_CONFIG } from '../config.js';

export class GPSTracker {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.lastLocation = null;
    this.onLocationUpdate = null;
    this.onError = null;
    this.updateInterval = KIOSK_CONFIG.gpsUpdateInterval;
    this.lastUpdateTime = null;
  }

  /**
   * Check if geolocation is available
   */
  isAvailable() {
    return 'geolocation' in navigator;
  }

  /**
   * Get current location once
   * @returns {Promise<{latitude, longitude, accuracy, timestamp}>}
   */
  async getCurrentLocation() {
    if (!this.isAvailable()) {
      throw new Error('Geolocation not available in this browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString(),
          };

          this.lastLocation = location;
          resolve(location);
        },
        (error) => {
          reject(this.handleGeolocationError(error));
        },
        {
          enableHighAccuracy: KIOSK_CONFIG.gpsHighAccuracy,
          timeout: KIOSK_CONFIG.gpsTimeout,
          maximumAge: KIOSK_CONFIG.gpsMaxAge,
        },
      );
    });
  }

  /**
   * Start continuous location tracking
   * @param {Function} onUpdate - Callback for location updates
   * @param {Function} onErrorCallback - Callback for errors
   */
  start(onUpdate, onErrorCallback) {
    if (!this.isAvailable()) {
      const error = new Error('Geolocation not available');
      if (onErrorCallback) {
        onErrorCallback(error);
      }
      return false;
    }

    if (this.isTracking) {
      console.warn('[GPSTracker] Already tracking');
      return true;
    }

    this.onLocationUpdate = onUpdate;
    this.onError = onErrorCallback;

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();

        // Throttle updates to configured interval
        if (this.lastUpdateTime && now - this.lastUpdateTime < this.updateInterval) {
          return;
        }

        this.lastUpdateTime = now;

        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString(),
        };

        this.lastLocation = location;

        console.log('[GPSTracker] Location update:', {
          lat: location.latitude.toFixed(6),
          lng: location.longitude.toFixed(6),
          accuracy: `${location.accuracy.toFixed(0)}m`,
        });

        if (this.onLocationUpdate) {
          this.onLocationUpdate(location);
        }
      },
      (error) => {
        const errorInfo = this.handleGeolocationError(error);
        console.error('[GPSTracker] Error:', errorInfo);

        if (this.onError) {
          this.onError(errorInfo);
        }
      },
      {
        enableHighAccuracy: KIOSK_CONFIG.gpsHighAccuracy,
        timeout: KIOSK_CONFIG.gpsTimeout,
        maximumAge: KIOSK_CONFIG.gpsMaxAge,
      },
    );

    this.isTracking = true;
    console.log('[GPSTracker] Started tracking');
    return true;
  }

  /**
   * Stop tracking
   */
  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      console.log('[GPSTracker] Stopped tracking');
    }
  }

  /**
   * Get tracking status
   */
  getStatus() {
    return {
      isTracking: this.isTracking,
      hasLocation: this.lastLocation !== null,
      lastLocation: this.lastLocation,
      lastUpdateTime: this.lastUpdateTime ? new Date(this.lastUpdateTime).toISOString() : null,
    };
  }

  /**
   * Handle geolocation errors
   */
  handleGeolocationError(error) {
    const errorMap = {
      [error.PERMISSION_DENIED]: {
        code: 'PERMISSION_DENIED',
        message: 'Location permission denied. Please enable location access.',
        userMessage: 'Bitte aktivieren Sie die Standortfreigabe / Please enable location access',
        recoverable: false,
      },
      [error.POSITION_UNAVAILABLE]: {
        code: 'POSITION_UNAVAILABLE',
        message: 'Location information unavailable.',
        userMessage: 'Standort nicht verfügbar / Location unavailable',
        recoverable: true,
      },
      [error.TIMEOUT]: {
        code: 'TIMEOUT',
        message: 'Location request timed out.',
        userMessage: 'Standortabfrage Zeitüberschreitung / Location timeout',
        recoverable: true,
      },
    };

    return (
      errorMap[error.code] || {
        code: 'UNKNOWN',
        message: error.message || 'Unknown GPS error',
        userMessage: 'GPS-Fehler / GPS error',
        recoverable: true,
      }
    );
  }

  /**
   * Request permission (modern browsers)
   */
  async requestPermission() {
    if (!('permissions' in navigator)) {
      // Fallback: try to get location (which triggers permission prompt)
      try {
        await this.getCurrentLocation();
        return 'granted';
      } catch (error) {
        return 'denied';
      }
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch (error) {
      console.warn('[GPSTracker] Permission query not supported');
      return 'prompt';
    }
  }
}

// Export singleton instance
export const gpsTracker = new GPSTracker();
