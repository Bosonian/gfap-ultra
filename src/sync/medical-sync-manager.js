/**
 * Medical Data Synchronization Manager
 * iGFAP Stroke Triage Assistant - Phase 3 Advanced Features
 *
 * Provides real-time data synchronization with conflict resolution
 */

import { medicalEventObserver, MEDICAL_EVENTS } from '../patterns/observer.js';
import { medicalPerformanceMonitor, PerformanceMetricType } from '../performance/medical-performance-monitor.js';
import { patientDataCache, MedicalCacheTTL, CachePriority } from '../performance/medical-cache.js';
import { store } from '../state/store.js';

// Bulletproof error handling utilities
import {
  safeAsync,
  MedicalError,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  MEDICAL_ERROR_CODES
} from '../utils/error-handler.js';

/**
 * Sync operation types
 */
export const SyncOperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  CONFLICT_RESOLVE: 'conflict_resolve',
};

/**
 * Sync status states
 */
export const SyncStatus = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  ERROR: 'error',
  CONFLICT: 'conflict',
  OFFLINE: 'offline',
};

/**
 * Data conflict resolution strategies
 */
export const ConflictResolution = {
  CLIENT_WINS: 'client_wins',
  SERVER_WINS: 'server_wins',
  MERGE: 'merge',
  MANUAL: 'manual',
};

/**
 * Medical sync operation wrapper
 */
class MedicalSyncOperation {
  constructor(type, entityType, entityId, data, timestamp = Date.now()) {
    this.id = `sync_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.entityType = entityType;
    this.entityId = entityId;
    this.data = data;
    this.timestamp = timestamp;
    this.attempts = 0;
    this.maxAttempts = 3;
    this.status = 'pending';
    this.error = null;
  }

  /**
   * Check if operation should be retried
   */
  canRetry() {
    return this.attempts < this.maxAttempts && this.status === 'error';
  }

  /**
   * Mark operation as failed
   */
  markFailed(error) {
    this.status = 'error';
    this.error = error;
    this.attempts += 1;
  }

  /**
   * Mark operation as completed
   */
  markCompleted() {
    this.status = 'completed';
    this.error = null;
  }
}

/**
 * Medical Data Synchronization Manager
 */
export class MedicalSyncManager {
  constructor() {
    this.status = SyncStatus.IDLE;
    this.pendingOperations = new Map();
    this.conflictQueue = new Map();
    this.syncInterval = null;
    this.isOnline = navigator.onLine;
    this.lastSyncTime = null;
    this.syncInProgress = false;

    // Configuration
    this.config = {
      syncIntervalMs: 30000, // 30 seconds
      conflictRetentionMs: 24 * 60 * 60 * 1000, // 24 hours
      maxPendingOperations: 100,
      enableRealTimeSync: true,
      enableConflictResolution: true,
    };

    this.setupEventListeners();
  }

  /**
   * Initialize synchronization manager with bulletproof error handling
   */
  async initialize() {
    return safeAsync(
      async () => {
        //('🔄 Initializing Medical Sync Manager...');

        // Load pending operations from storage with error handling
        await safeAsync(
          () => this.loadPendingOperations(),
          (error) => {
            console.warn('Failed to load pending operations, starting fresh:', error.message);
            this.pendingOperations.clear();
          },
          { operation: 'load_pending_operations' }
        );

        // Start periodic sync if online
        if (this.isOnline && this.config.enableRealTimeSync) {
          await safeAsync(
            () => this.startPeriodicSync(),
            null,
            { operation: 'start_periodic_sync' }
          );
        }

        // Perform initial sync with error handling
        await safeAsync(
          () => this.performSync(),
          (error) => {
            console.warn('Initial sync failed, will retry later:', error.message);
          },
          { operation: 'initial_sync' }
        );

        medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
          action: 'sync_manager_initialized',
          pendingOperations: this.pendingOperations.size,
        });

        //('✅ Medical Sync Manager initialized');
        return true;
      },
      (error) => {
        console.error('Sync Manager initialization failed:', error.message);

        medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
          action: 'sync_manager_initialization_failed',
          error: error.message
        });

        return false;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        severity: ERROR_SEVERITY.MEDIUM,
        timeout: 30000,
        context: {
          operation: 'sync_manager_initialization'
        }
      }
    );
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleConnectionChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleConnectionChange(false);
    });

    // Listen for data changes that need syncing
    medicalEventObserver.subscribe(MEDICAL_EVENTS.PATIENT_DATA_UPDATED, (event) => {
      this.queueDataSync('patient_data', event.fieldName, event);
    });

    medicalEventObserver.subscribe(MEDICAL_EVENTS.PREDICTION_COMPLETED, (event) => {
      this.queueDataSync('prediction_result', event.module, event);
    });

    // Page visibility for sync optimization
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.performSync();
      }
    });
  }

  /**
   * Handle connection status changes
   */
  async handleConnectionChange(isOnline) {
    //(`🌐 Connection status changed: ${isOnline ? 'Online' : 'Offline'}`);

    this.status = isOnline ? SyncStatus.IDLE : SyncStatus.OFFLINE;

    if (isOnline) {
      // Connection restored - start syncing
      this.startPeriodicSync();
      await this.performSync();

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: 'sync_connection_restored',
        pendingOperations: this.pendingOperations.size,
      });
    } else {
      // Connection lost - stop periodic sync
      this.stopPeriodicSync();

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: 'sync_connection_lost',
      });
    }
  }

  /**
   * Queue data for synchronization
   */
  queueDataSync(entityType, entityId, data) {
    if (!this.config.enableRealTimeSync) {
      return;
    }

    const operation = new MedicalSyncOperation(
      SyncOperationType.UPDATE,
      entityType,
      entityId,
      this.sanitizeDataForSync(data),
    );

    // Prevent queue overflow
    if (this.pendingOperations.size >= this.config.maxPendingOperations) {
      const oldestKey = this.pendingOperations.keys().next().value;
      this.pendingOperations.delete(oldestKey);
    }

    this.pendingOperations.set(operation.id, operation);

    // Save to persistent storage
    this.savePendingOperations();

    // Trigger immediate sync if online
    if (this.isOnline && !this.syncInProgress) {
      setTimeout(() => this.performSync(), 1000); // Small delay to batch operations
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'sync_operation_queued',
      entityType,
      entityId,
      operationId: operation.id,
    });
  }

  /**
   * Sanitize sensitive data before sync
   */
  sanitizeDataForSync(data) {
    const sanitized = { ...data };

    // Remove sensitive fields
    const sensitiveFields = ['ssn', 'mrn', 'patient_id', 'user_id', 'session_token'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    // Add sync metadata
    sanitized._syncTimestamp = Date.now();
    sanitized._syncId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return sanitized;
  }

  /**
   * Perform synchronization of pending operations with comprehensive error handling
   */
  async performSync() {
    return safeAsync(
      async () => {
        if (!this.isOnline || this.syncInProgress || this.pendingOperations.size === 0) {
          return {
            skipped: true,
            reason: !this.isOnline ? 'offline' : this.syncInProgress ? 'already_syncing' : 'no_operations'
          };
        }

        const metricId = medicalPerformanceMonitor.startMeasurement(
          PerformanceMetricType.NETWORK,
          'medical_data_sync',
        );

        this.syncInProgress = true;
        this.status = SyncStatus.SYNCING;

        //(`🔄 Starting sync of ${this.pendingOperations.size} operations...`);

        let completedCount = 0;
        let errorCount = 0;
        let conflictCount = 0;
        const startTime = Date.now();

        try {
          // Process operations in batches with timeout
          const operations = Array.from(this.pendingOperations.values());
          const batchSize = 5;
          const maxSyncTime = 120000; // 2 minutes max sync time

          for (let i = 0; i < operations.length; i += batchSize) {
            // Check timeout
            if (Date.now() - startTime > maxSyncTime) {
              throw new MedicalError(
                'Sync operation timeout',
                'SYNC_TIMEOUT',
                ERROR_CATEGORIES.NETWORK,
                ERROR_SEVERITY.MEDIUM
              ).withContext({ processedBatches: Math.floor(i / batchSize), totalBatches: Math.ceil(operations.length / batchSize) });
            }

            const batch = operations.slice(i, i + batchSize);
            const results = await safeAsync(
              () => this.processSyncBatch(batch),
              (error) => {
                console.warn(`Batch ${Math.floor(i / batchSize)} sync failed:`, error.message);
                return batch.map(op => ({
                  operationId: op.id,
                  status: 'error',
                  error: error.message
                }));
              },
              {
                operation: 'process_sync_batch',
                batchIndex: Math.floor(i / batchSize),
                timeout: 30000
              }
            );

            results.forEach((result) => {
              if (result.status === 'completed') {
                completedCount++;
                this.pendingOperations.delete(result.operationId);
              } else if (result.status === 'conflict') {
                conflictCount++;
                safeAsync(
                  () => this.handleSyncConflict(result),
                  null,
                  { operation: 'handle_sync_conflict' }
                );
              } else {
                errorCount++;
              }
            });
          }

          this.lastSyncTime = Date.now();

          // Save updated pending operations with error handling
          await safeAsync(
            () => this.savePendingOperations(),
            (error) => {
              console.warn('Failed to save pending operations after sync:', error.message);
            },
            { operation: 'save_pending_operations_after_sync' }
          );

          //(`✅ Sync completed: ${completedCount} success, ${errorCount} errors, ${conflictCount} conflicts`);

          medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
            action: 'sync_completed',
            completedCount,
            errorCount,
            conflictCount,
            duration: Date.now() - startTime,
          });

          medicalPerformanceMonitor.endMeasurement(metricId, {
            success: true,
            operationsProcessed: completedCount + errorCount + conflictCount,
          });

          return {
            success: true,
            completedCount,
            errorCount,
            conflictCount,
            duration: Date.now() - startTime
          };
        } catch (error) {
          medicalPerformanceMonitor.endMeasurement(metricId, {
            success: false,
            error: error.message,
          });

          this.status = SyncStatus.ERROR;
          throw error;
        } finally {
          this.syncInProgress = false;
          this.status = this.pendingOperations.size > 0 ? SyncStatus.IDLE : SyncStatus.IDLE;
        }
      },
      (error) => {
        console.error('Sync operation failed:', error.message);

        medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
          action: 'sync_failed',
          error: error.message,
          pendingOperations: this.pendingOperations.size
        });

        this.status = SyncStatus.ERROR;

        return {
          success: false,
          error: error.message
        };
      },
      {
        category: ERROR_CATEGORIES.NETWORK,
        severity: ERROR_SEVERITY.MEDIUM,
        timeout: 150000, // 2.5 minutes
        context: {
          operation: 'perform_sync',
          pendingOperations: this.pendingOperations.size
        }
      }
    );
  }

  /**
   * Process a batch of sync operations
   */
  async processSyncBatch(operations) {
    const results = [];

    // Simulate sync operations (in real implementation, these would be API calls)
    for (const operation of operations) {
      try {
        const result = await this.executeSyncOperation(operation);
        results.push({
          operationId: operation.id,
          status: 'completed',
          result,
        });

        operation.markCompleted();
      } catch (error) {
        if (error.name === 'ConflictError') {
          results.push({
            operationId: operation.id,
            status: 'conflict',
            conflict: error.conflict,
            operation,
          });
        } else {
          operation.markFailed(error.message);

          if (operation.canRetry()) {
            //(`⚠️ Operation ${operation.id} failed, will retry: ${error.message}`);
          } else {
            //(`❌ Operation ${operation.id} failed permanently: ${error.message}`);
            this.pendingOperations.delete(operation.id);
          }

          results.push({
            operationId: operation.id,
            status: 'error',
            error: error.message,
          });
        }
      }
    }

    return results;
  }

  /**
   * Execute a single sync operation
   */
  async executeSyncOperation(operation) {
    // Simulate API call with realistic delay and error handling
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    // Simulate conflict detection (5% chance)
    if (Math.random() < 0.05) {
      const conflict = {
        clientData: operation.data,
        serverData: { ...operation.data, _serverModified: true },
        conflictFields: ['timestamp', 'value'],
        resolution: ConflictResolution.MANUAL,
      };

      const error = new Error('Data conflict detected');
      error.name = 'ConflictError';
      error.conflict = conflict;
      throw error;
    }

    // Simulate network error (2% chance)
    if (Math.random() < 0.02) {
      throw new Error('Network request failed');
    }

    // Successful sync
    return {
      entityType: operation.entityType,
      entityId: operation.entityId,
      syncTimestamp: Date.now(),
      serverVersion: Date.now(),
    };
  }

  /**
   * Handle sync conflicts
   */
  handleSyncConflict(conflictResult) {
    const { operation, conflict } = conflictResult;

    // Store conflict for manual resolution
    this.conflictQueue.set(operation.id, {
      operation,
      conflict,
      timestamp: Date.now(),
    });

    this.status = SyncStatus.CONFLICT;

    // Apply automatic resolution if configured
    if (this.config.enableConflictResolution) {
      this.resolveConflictAutomatically(operation.id, conflict);
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'sync_conflict_detected',
      operationId: operation.id,
      entityType: operation.entityType,
      conflictFields: conflict.conflictFields,
    });
  }

  /**
   * Resolve conflicts automatically based on strategy
   */
  async resolveConflictAutomatically(conflictId, conflict) {
    let resolvedData;

    switch (conflict.resolution) {
      case ConflictResolution.CLIENT_WINS:
        resolvedData = conflict.clientData;
        break;

      case ConflictResolution.SERVER_WINS:
        resolvedData = conflict.serverData;
        break;

      case ConflictResolution.MERGE:
        resolvedData = this.mergeConflictData(conflict.clientData, conflict.serverData);
        break;

      default:
        // Manual resolution required
        return;
    }

    // Create resolution operation
    const resolutionOperation = new MedicalSyncOperation(
      SyncOperationType.CONFLICT_RESOLVE,
      'conflict_resolution',
      conflictId,
      resolvedData,
    );

    this.pendingOperations.set(resolutionOperation.id, resolutionOperation);
    this.conflictQueue.delete(conflictId);

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'sync_conflict_auto_resolved',
      conflictId,
      resolution: conflict.resolution,
    });
  }

  /**
   * Merge conflicting data intelligently
   */
  mergeConflictData(clientData, serverData) {
    const merged = { ...serverData };

    // Prefer client data for user-entered fields
    const clientPreferredFields = ['gfap_value', 'age_years', 'systolic_bp', 'diastolic_bp'];
    clientPreferredFields.forEach((field) => {
      if (clientData[field] !== undefined) {
        merged[field] = clientData[field];
      }
    });

    // Use latest timestamp
    merged._mergedAt = Date.now();
    merged._mergeStrategy = 'intelligent_merge';

    return merged;
  }

  /**
   * Start periodic synchronization
   */
  startPeriodicSync() {
    if (this.syncInterval) {
      return;
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.pendingOperations.size > 0) {
        this.performSync();
      }
    }, this.config.syncIntervalMs);

    //(`🔄 Periodic sync started (${this.config.syncIntervalMs}ms interval)`);
  }

  /**
   * Stop periodic synchronization
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      //('⏹️ Periodic sync stopped');
    }
  }

  /**
   * Force immediate synchronization
   */
  async forcSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    this.stopPeriodicSync();
    await this.performSync();
    this.startPeriodicSync();
  }

  /**
   * Get synchronization status
   */
  getSyncStatus() {
    return {
      status: this.status,
      isOnline: this.isOnline,
      pendingOperations: this.pendingOperations.size,
      conflicts: this.conflictQueue.size,
      lastSyncTime: this.lastSyncTime,
      syncInProgress: this.syncInProgress,
    };
  }

  /**
   * Load pending operations from storage with comprehensive error handling
   */
  async loadPendingOperations() {
    return safeAsync(
      async () => {
        if (typeof localStorage === 'undefined') {
          throw new MedicalError(
            'Local storage not available',
            'STORAGE_UNAVAILABLE',
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.MEDIUM
          );
        }

        const stored = localStorage.getItem('medical_sync_pending');
        if (!stored) {
          //('No pending sync operations found');
          return { loaded: 0 };
        }

        let operations;
        try {
          operations = JSON.parse(stored);
        } catch (parseError) {
          throw new MedicalError(
            'Failed to parse stored sync operations',
            'PARSE_ERROR',
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.MEDIUM
          ).withContext({ parseError: parseError.message });
        }

        if (!Array.isArray(operations)) {
          throw new MedicalError(
            'Invalid stored operations format',
            'INVALID_FORMAT',
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.MEDIUM
          ).withContext({ type: typeof operations });
        }

        let loadedCount = 0;
        let errorCount = 0;

        operations.forEach((op, index) => {
          try {
            // Validate operation structure
            if (!op || typeof op !== 'object' || !op.type || !op.entityType || !op.entityId) {
              throw new Error(`Invalid operation structure at index ${index}`);
            }

            const operation = new MedicalSyncOperation(op.type, op.entityType, op.entityId, op.data, op.timestamp);
            operation.attempts = Math.max(0, op.attempts || 0);
            operation.status = op.status || 'pending';

            // Skip operations that have exceeded max attempts
            if (operation.attempts >= operation.maxAttempts) {
              console.warn(`Skipping operation ${operation.id} - exceeded max attempts`);
              return;
            }

            this.pendingOperations.set(operation.id, operation);
            loadedCount++;
          } catch (opError) {
            console.warn(`Failed to load operation at index ${index}:`, opError.message);
            errorCount++;
          }
        });

        //(`📦 Loaded ${loadedCount} pending sync operations (${errorCount} errors)`);

        return { loaded: loadedCount, errors: errorCount };
      },
      (error) => {
        console.warn('Failed to load pending operations:', error.message);

        // Clear corrupted data
        try {
          localStorage.removeItem('medical_sync_pending');
        } catch (clearError) {
          console.error('Failed to clear corrupted sync data:', clearError.message);
        }

        return { loaded: 0, errors: 1, cleared: true };
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        severity: ERROR_SEVERITY.LOW,
        timeout: 5000,
        context: {
          operation: 'load_pending_operations'
        }
      }
    );
  }

  /**
   * Save pending operations to storage with comprehensive error handling
   */
  async savePendingOperations() {
    return safeAsync(
      async () => {
        if (typeof localStorage === 'undefined') {
          throw new MedicalError(
            'Local storage not available',
            'STORAGE_UNAVAILABLE',
            ERROR_CATEGORIES.STORAGE,
            ERROR_SEVERITY.MEDIUM
          );
        }

        const operations = Array.from(this.pendingOperations.values()).map((op) => {
          try {
            return {
              id: op.id,
              type: op.type,
              entityType: op.entityType,
              entityId: op.entityId,
              data: op.data,
              timestamp: op.timestamp,
              attempts: op.attempts,
              status: op.status,
            };
          } catch (serializeError) {
            console.warn(`Failed to serialize operation ${op.id}:`, serializeError.message);
            return null;
          }
        }).filter(op => op !== null);

        const serialized = JSON.stringify(operations);

        // Check storage quota
        if (serialized.length > 1024 * 1024) { // 1MB limit
          console.warn('Sync operations data is very large, may hit storage limits');
        }

        localStorage.setItem('medical_sync_pending', serialized);

        return { saved: operations.length };
      },
      (error) => {
        console.error('Failed to save pending operations:', error.message);

        // Try to clear space and retry once
        if (error.name === 'QuotaExceededError') {
          try {
            // Remove oldest operations to make space
            const operationsArray = Array.from(this.pendingOperations.entries());
            const halfPoint = Math.floor(operationsArray.length / 2);
            const toKeep = operationsArray.slice(-halfPoint);

            this.pendingOperations.clear();
            toKeep.forEach(([id, op]) => {
              this.pendingOperations.set(id, op);
            });

            console.info(`Reduced operations from ${operationsArray.length} to ${toKeep.length} due to storage quota`);

            // Retry save
            const reducedOperations = toKeep.map(([, op]) => ({
              id: op.id,
              type: op.type,
              entityType: op.entityType,
              entityId: op.entityId,
              data: op.data,
              timestamp: op.timestamp,
              attempts: op.attempts,
              status: op.status,
            }));

            localStorage.setItem('medical_sync_pending', JSON.stringify(reducedOperations));
            return { saved: reducedOperations.length, reduced: true };
          } catch (retryError) {
            console.error('Failed to save even after reducing operations:', retryError.message);
            return { saved: 0, error: retryError.message };
          }
        }

        return { saved: 0, error: error.message };
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        severity: ERROR_SEVERITY.LOW,
        timeout: 5000,
        context: {
          operation: 'save_pending_operations',
          operationCount: this.pendingOperations.size
        }
      }
    );
  }

  /**
   * Clear all pending operations
   */
  clearPendingOperations() {
    this.pendingOperations.clear();
    this.conflictQueue.clear();
    localStorage.removeItem('medical_sync_pending');

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'sync_operations_cleared',
    });
  }

  /**
   * Configure sync settings
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Restart periodic sync with new interval
    if (this.syncInterval && newConfig.syncIntervalMs) {
      this.stopPeriodicSync();
      this.startPeriodicSync();
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'sync_config_updated',
      config: this.config,
    });
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    this.stopPeriodicSync();
    this.savePendingOperations();

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: 'sync_manager_disposed',
    });
  }
}

// Export singleton instance
export const medicalSyncManager = new MedicalSyncManager();
