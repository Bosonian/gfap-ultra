/**
 * Research Data Logger
 * Safely stores model comparison data for research analysis
 * All data stays local - no external transmission
 */

import { LegacyICHModel } from './legacy-ich-model.js';

export class ResearchDataLogger {
  static STORAGE_KEY = 'igfap_research_data';
  static MAX_ENTRIES = 1000; // Prevent unlimited storage growth

  /**
   * Log comparison between main and legacy models
   * @param {object} comparisonData - Data from both models
   */
  static logComparison(comparisonData) {
    try {
      const entry = {
        id: this.generateEntryId(),
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        ...comparisonData
      };

      const stored = this.getStoredData();
      stored.entries.push(entry);
      
      // Limit storage size
      if (stored.entries.length > this.MAX_ENTRIES) {
        stored.entries = stored.entries.slice(-this.MAX_ENTRIES);
      }
      
      stored.lastUpdated = new Date().toISOString();
      stored.totalComparisons = stored.entries.length;
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
      
      console.log(`📊 Research data logged (${stored.totalComparisons} comparisons)`);
      return true;
    } catch (error) {
      console.warn('Research data logging failed (non-critical):', error);
      return false;
    }
  }

  /**
   * Get all stored research data
   * @returns {object} - Complete research dataset
   */
  static getStoredData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.createEmptyDataset();
      }
      
      const data = JSON.parse(stored);
      
      // Validate structure
      if (!data.entries || !Array.isArray(data.entries)) {
        console.warn('Invalid research data structure, resetting');
        return this.createEmptyDataset();
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to load research data, creating new:', error);
      return this.createEmptyDataset();
    }
  }

  /**
   * Create empty dataset structure
   * @returns {object} - Empty research dataset
   */
  static createEmptyDataset() {
    return {
      version: '1.0.0',
      created: new Date().toISOString(),
      lastUpdated: null,
      totalComparisons: 0,
      entries: [],
      metadata: {
        app: 'iGFAP Stroke Triage',
        purpose: 'Model comparison research',
        dataRetention: 'Local storage only'
      }
    };
  }

  /**
   * Export research data as CSV for analysis
   * @returns {string} - CSV formatted data
   */
  static exportAsCSV() {
    const data = this.getStoredData();
    
    if (!data.entries || data.entries.length === 0) {
      return 'No research data available for export';
    }

    // CSV headers
    const headers = [
      'timestamp',
      'session_id', 
      'age',
      'gfap_value',
      'main_model_probability',
      'main_model_module',
      'legacy_model_probability',
      'legacy_model_confidence',
      'absolute_difference',
      'relative_difference',
      'agreement_level',
      'higher_risk_model'
    ];

    // Convert entries to CSV rows
    const rows = data.entries.map(entry => {
      return [
        entry.timestamp,
        entry.sessionId,
        entry.inputs?.age || '',
        entry.inputs?.gfap || '',
        entry.main?.probability || '',
        entry.main?.module || '',
        entry.legacy?.probability || '',
        entry.legacy?.confidence || '',
        entry.comparison?.differences?.absolute || '',
        entry.comparison?.differences?.relative || '',
        entry.comparison?.agreement?.level || '',
        entry.comparison?.agreement?.higherRiskModel || ''
      ].join(',');
    });

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');
    return csv;
  }

  /**
   * Export research data as JSON for detailed analysis
   * @returns {string} - JSON formatted data
   */
  static exportAsJSON() {
    const data = this.getStoredData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Download research data as file
   * @param {string} format - 'csv' or 'json'
   */
  static downloadData(format = 'csv') {
    try {
      const data = format === 'csv' ? this.exportAsCSV() : this.exportAsJSON();
      const filename = `igfap-research-${Date.now()}.${format}`;
      
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`📥 Downloaded research data: ${filename}`);
      return true;
    } catch (error) {
      console.error('Failed to download research data:', error);
      return false;
    }
  }

  /**
   * Clear all stored research data
   */
  static clearData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Research data cleared');
      return true;
    } catch (error) {
      console.warn('Failed to clear research data:', error);
      return false;
    }
  }

  /**
   * Get summary statistics of stored data
   * @returns {object} - Summary statistics
   */
  static getDataSummary() {
    const data = this.getStoredData();
    
    if (!data.entries || data.entries.length === 0) {
      return {
        totalEntries: 0,
        dateRange: null,
        avgDifference: null
      };
    }

    const entries = data.entries;
    const differences = entries
      .map(e => e.comparison?.differences?.absolute)
      .filter(d => d !== undefined && d !== null);
    
    const avgDifference = differences.length > 0 ? 
      differences.reduce((sum, d) => sum + Math.abs(d), 0) / differences.length : 0;

    return {
      totalEntries: entries.length,
      dateRange: {
        first: entries[0]?.timestamp,
        last: entries[entries.length - 1]?.timestamp
      },
      avgAbsoluteDifference: Math.round(avgDifference * 10) / 10,
      storageSize: JSON.stringify(data).length
    };
  }

  // Utility functions
  static generateEntryId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getSessionId() {
    let sessionId = sessionStorage.getItem('research_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now().toString(36);
      sessionStorage.setItem('research_session_id', sessionId);
    }
    return sessionId;
  }
}

/**
 * Safe wrapper for logging research data in production
 * @param {object} mainResults - Main model results
 * @param {object} legacyResults - Legacy model results
 * @param {object} inputs - Patient input data
 */
export function safeLogResearchData(mainResults, legacyResults, inputs) {
  try {
    // Only log if research mode is enabled
    if (!isResearchModeEnabled()) {
      return;
    }

    const comparisonData = {
      inputs: {
        age: inputs.age_years || inputs.age,
        gfap: inputs.gfap_value || inputs.gfap,
        module: mainResults.module || 'unknown'
      },
      main: {
        probability: mainResults.probability,
        module: mainResults.module,
        confidence: mainResults.confidence
      },
      legacy: legacyResults,
      comparison: legacyResults ? 
        LegacyICHModel.compareModels(mainResults, legacyResults) : null
    };

    ResearchDataLogger.logComparison(comparisonData);
  } catch (error) {
    // Silently fail - never break main app functionality
    console.warn('Research logging failed (non-critical):', error);
  }
}

/**
 * Check if research mode is enabled
 * @returns {boolean} - True if research features should be active
 */
export function isResearchModeEnabled() {
  // Multiple activation methods
  const urlParams = new URLSearchParams(window.location.search);
  const urlEnabled = urlParams.get('research') === 'true';
  const storageEnabled = localStorage.getItem('research_mode') === 'true';
  
  return urlEnabled || storageEnabled;
}

/**
 * Enable/disable research mode
 * @param {boolean} enabled - Enable or disable research mode
 */
export function setResearchMode(enabled) {
  try {
    if (enabled) {
      localStorage.setItem('research_mode', 'true');
      console.log('🔬 Research mode enabled');
    } else {
      localStorage.removeItem('research_mode');
      console.log('🔬 Research mode disabled');
    }
    
    // Trigger page refresh to apply changes
    if (window.location.search.includes('research=')) {
      // Remove research param from URL if disabling
      if (!enabled) {
        const url = new URL(window.location);
        url.searchParams.delete('research');
        window.history.replaceState({}, '', url);
      }
    }
    
    return true;
  } catch (error) {
    console.warn('Failed to toggle research mode:', error);
    return false;
  }
}