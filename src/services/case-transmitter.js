/**
 * Case Transmitter Service
 * Handles sending cases to hospital kiosk and continuous location updates
 */
import { KIOSK_CONFIG } from '../config.js';
import { gpsTracker } from './gps-tracker.js';
import { etaCalculator } from './eta-calculator.js';

export class CaseTransmitter {
  constructor() {
    this.baseUrl = KIOSK_CONFIG.caseSharingUrl;
    this.activeCase = null;
    this.updateInterval = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  /**
   * Create and send case to hospital
   * @param {Object} results - Assessment results
   * @param {Object} formData - Patient form data
   * @param {string} moduleType - Module type (coma, limited, full)
   * @param {Object} hospital - Selected hospital
   * @returns {Promise<{success, caseId}>}
   */
  async sendCase(results, formData, moduleType, hospital) {
    try {
      console.log('[CaseTransmitter] Sending case to hospital:', hospital.name);

      // Get current location
      const currentLocation = await gpsTracker.getCurrentLocation();

      // Calculate ETA to hospital
      const eta = await etaCalculator.calculateETA(
        { lat: currentLocation.latitude, lng: currentLocation.longitude },
        { lat: hospital.coordinates.lat, lng: hospital.coordinates.lng },
      );

      // Prepare case data
      const caseData = {
        results,
        formData: this.sanitizeFormData(formData),
        moduleType,
        location: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
          accuracy: currentLocation.accuracy,
          timestamp: currentLocation.timestamp,
        },
        destination: {
          lat: hospital.coordinates.lat,
          lng: hospital.coordinates.lng,
        },
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        estimatedArrival: eta.arrivalTime,
        distance: eta.distance,
        duration: eta.duration,
        ambulanceId: this.generateAmbulanceId(),
      };

      // Send to cloud function
      const response = await this.sendWithRetry(`${this.baseUrl}/store-case`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to store case');
      }

      console.log('[CaseTransmitter] Case created:', response.caseId);

      // Store active case ID
      this.activeCase = {
        caseId: response.caseId,
        hospital,
        startTime: Date.now(),
      };

      // Start GPS tracking
      this.startLocationTracking();

      return {
        success: true,
        caseId: response.caseId,
        eta: eta.duration,
      };
    } catch (error) {
      console.error('[CaseTransmitter] Failed to send case:', error);
      throw error;
    }
  }

  /**
   * Start continuous location tracking
   */
  startLocationTracking() {
    if (!this.activeCase) {
      return;
    }

    console.log('[CaseTransmitter] Starting location tracking for case:', this.activeCase.caseId);

    // Start GPS tracking with callback
    gpsTracker.start(
      async (location) => {
        await this.updateLocation(location);
      },
      (error) => {
        console.error('[CaseTransmitter] GPS error:', error);
        // Continue tracking even with errors (will use last known location)
      },
    );
  }

  /**
   * Update location to cloud
   */
  async updateLocation(location) {
    if (!this.activeCase) {
      return;
    }

    try {
      // Recalculate ETA
      const eta = await etaCalculator.calculateETA(
        { lat: location.latitude, lng: location.longitude },
        { lat: this.activeCase.hospital.coordinates.lat, lng: this.activeCase.hospital.coordinates.lng },
      );

      // Send update to cloud
      const updateData = {
        caseId: this.activeCase.caseId,
        location: {
          lat: location.latitude,
          lng: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp,
        },
        estimatedArrival: eta.arrivalTime,
        distance: eta.distance,
        duration: eta.duration,
      };

      const response = await this.sendWithRetry(`${this.baseUrl}/update-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        console.log('[CaseTransmitter] Location updated:', {
          eta: `${eta.duration} min`,
          distance: `${eta.distance} km`,
        });
        this.retryCount = 0; // Reset retry counter on success
      }
    } catch (error) {
      console.error('[CaseTransmitter] Failed to update location:', error);
      // Don't throw - continue tracking even if update fails
    }
  }

  /**
   * Stop tracking (when arrived)
   */
  stopTracking() {
    if (this.activeCase) {
      console.log('[CaseTransmitter] Stopping tracking for case:', this.activeCase.caseId);

      // Stop GPS
      gpsTracker.stop();

      // Mark as arrived
      this.markArrived(this.activeCase.caseId).catch((error) => {
        console.error('[CaseTransmitter] Failed to mark arrived:', error);
      });

      // Clear active case
      this.activeCase = null;
    }
  }

  /**
   * Mark case as arrived
   */
  async markArrived(caseId) {
    try {
      const response = await this.sendWithRetry(`${this.baseUrl}/mark-arrived`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId }),
      });

      console.log('[CaseTransmitter] Case marked as arrived');
      return response;
    } catch (error) {
      console.error('[CaseTransmitter] Failed to mark arrived:', error);
      throw error;
    }
  }

  /**
   * Send request with retry logic
   */
  async sendWithRetry(url, options, attempt = 1) {
    try {
      const response = await fetch(url, {
        ...options,
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.maxRetries) {
        console.warn(`[CaseTransmitter] Retry ${attempt}/${this.maxRetries}:`, error.message);

        // Exponential backoff: 1s, 2s, 4s
        await this.sleep(1000 * Math.pow(2, attempt - 1));

        return this.sendWithRetry(url, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Sanitize form data (remove any PII if present)
   */
  sanitizeFormData(formData) {
    // Create a copy
    const sanitized = { ...formData };

    // Remove any fields that might contain PII
    const piiFields = ['name', 'patientName', 'id', 'patientId', 'ssn', 'insurance'];

    piiFields.forEach((field) => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    return sanitized;
  }

  /**
   * Generate random ambulance ID
   */
  generateAmbulanceId() {
    const prefix = 'RTW';
    const region = ['M', 'K', 'S', 'B'][Math.floor(Math.random() * 4)]; // München, Köln, Stuttgart, Berlin
    const number = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${region}-${number}`;
  }

  /**
   * Get current tracking status
   */
  getStatus() {
    if (!this.activeCase) {
      return { isTracking: false };
    }

    const gpsStatus = gpsTracker.getStatus();

    return {
      isTracking: true,
      caseId: this.activeCase.caseId,
      hospital: this.activeCase.hospital.name,
      startTime: new Date(this.activeCase.startTime).toISOString(),
      duration: Math.floor((Date.now() - this.activeCase.startTime) / 1000 / 60), // minutes
      gpsActive: gpsStatus.isTracking,
      hasLocation: gpsStatus.hasLocation,
      lastUpdate: gpsStatus.lastUpdateTime,
    };
  }

  /**
   * Utility: sleep
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const caseTransmitter = new CaseTransmitter();
