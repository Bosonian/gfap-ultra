/**
 * Medical Data Encryption System
 * iGFAP Stroke Triage Assistant - HIPAA-Compliant Data Protection
 *
 * Provides client-side encryption for sensitive medical data in storage
 * Uses Web Crypto API with AES-GCM encryption for maximum security
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

import { safeAsync, ERROR_CATEGORIES, ERROR_SEVERITY } from '../utils/error-handler.js';
import { medicalLogger, LOG_CATEGORIES } from '../utils/medical-logger.js';

/**
 * @typedef {Object} EncryptedData
 * @property {string} encrypted - Base64 encoded encrypted data
 * @property {string} iv - Base64 encoded initialization vector
 * @property {string} version - Encryption version for compatibility
 * @property {number} timestamp - Encryption timestamp
 */

/**
 * Medical Data Encryption Manager
 */
export class MedicalDataEncryption {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for AES-GCM
    this.version = '1.0';
    this.encryptionKey = null;
    this.isSupported = this.checkWebCryptoSupport();

    if (this.isSupported) {
      this.initializeEncryption();
    } else {
      medicalLogger.warn('Web Crypto API not supported, falling back to unencrypted storage', {
        category: LOG_CATEGORIES.SECURITY
      });
    }
  }

  /**
   * Check if Web Crypto API is supported
   */
  checkWebCryptoSupport() {
    return typeof window !== 'undefined' &&
           window.crypto &&
           window.crypto.subtle &&
           typeof window.crypto.subtle.encrypt === 'function';
  }

  /**
   * Initialize encryption with derived key
   */
  async initializeEncryption() {
    return safeAsync(
      async () => {
        // Generate or retrieve session-based key material
        const keyMaterial = await this.getOrCreateKeyMaterial();

        // Derive encryption key from key material
        this.encryptionKey = await window.crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new TextEncoder().encode('iGFAP-Medical-2024'), // Static salt for session consistency
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          {
            name: this.algorithm,
            length: this.keyLength
          },
          false, // Not extractable for security
          ['encrypt', 'decrypt']
        );

        medicalLogger.info('Medical data encryption initialized', {
          category: LOG_CATEGORIES.SECURITY,
          algorithm: this.algorithm,
          keyLength: this.keyLength
        });

        return true;
      },
      {
        category: ERROR_CATEGORIES.SECURITY,
        severity: ERROR_SEVERITY.HIGH,
        context: { operation: 'encryption_initialization' }
      }
    );
  }

  /**
   * Get or create key material for encryption
   */
  async getOrCreateKeyMaterial() {
    return safeAsync(
      async () => {
        // Try to get existing key material from session
        let keyData = sessionStorage.getItem('_medical_km');

        if (!keyData) {
          // Generate new key material for this session
          const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
          keyData = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
          sessionStorage.setItem('_medical_km', keyData);

          medicalLogger.debug('Generated new encryption key material', {
            category: LOG_CATEGORIES.SECURITY
          });
        }

        // Convert hex string back to Uint8Array
        const keyBytes = new Uint8Array(keyData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        // Import key material
        return await window.crypto.subtle.importKey(
          'raw',
          keyBytes,
          'PBKDF2',
          false,
          ['deriveKey']
        );
      },
      {
        category: ERROR_CATEGORIES.SECURITY,
        context: { operation: 'key_material_generation' }
      }
    );
  }

  /**
   * Encrypt sensitive data
   * @param {any} data - Data to encrypt
   * @returns {Promise<EncryptedData|string>} Encrypted data object or original data if encryption fails
   */
  async encryptData(data) {
    if (!this.isSupported || !this.encryptionKey) {
      medicalLogger.warn('Encryption not available, storing data unencrypted', {
        category: LOG_CATEGORIES.SECURITY
      });
      return JSON.stringify(data);
    }

    return safeAsync(
      async () => {
        // Convert data to JSON string
        const jsonString = JSON.stringify(data);
        const dataBytes = new TextEncoder().encode(jsonString);

        // Generate random IV
        const iv = window.crypto.getRandomValues(new Uint8Array(this.ivLength));

        // Encrypt the data
        const encryptedBuffer = await window.crypto.subtle.encrypt(
          {
            name: this.algorithm,
            iv: iv
          },
          this.encryptionKey,
          dataBytes
        );

        // Convert to base64 for storage
        const encryptedArray = new Uint8Array(encryptedBuffer);
        const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
        const ivBase64 = btoa(String.fromCharCode(...iv));

        const encryptedData = {
          encrypted: encryptedBase64,
          iv: ivBase64,
          version: this.version,
          timestamp: Date.now()
        };

        medicalLogger.debug('Data encrypted successfully', {
          category: LOG_CATEGORIES.SECURITY,
          dataSize: jsonString.length
        });

        return JSON.stringify(encryptedData);
      },
      {
        category: ERROR_CATEGORIES.SECURITY,
        severity: ERROR_SEVERITY.MEDIUM,
        fallback: () => {
          medicalLogger.warn('Encryption failed, storing data unencrypted', {
            category: LOG_CATEGORIES.SECURITY
          });
          return JSON.stringify(data);
        },
        context: { operation: 'data_encryption' }
      }
    );
  }

  /**
   * Decrypt sensitive data
   * @param {string} encryptedDataString - Encrypted data string
   * @returns {Promise<any>} Decrypted data or null if decryption fails
   */
  async decryptData(encryptedDataString) {
    if (!encryptedDataString) {
      return null;
    }

    return safeAsync(
      async () => {
        let encryptedData;
        try {
          encryptedData = JSON.parse(encryptedDataString);
        } catch (parseError) {
          // Might be unencrypted legacy data
          medicalLogger.debug('Data appears to be unencrypted legacy format', {
            category: LOG_CATEGORIES.SECURITY
          });
          return JSON.parse(encryptedDataString);
        }

        // Check if this is encrypted data
        if (!encryptedData.encrypted || !encryptedData.iv) {
          // Assume it's unencrypted data
          return encryptedData;
        }

        if (!this.isSupported || !this.encryptionKey) {
          medicalLogger.warn('Cannot decrypt data: encryption not available', {
            category: LOG_CATEGORIES.SECURITY
          });
          return null;
        }

        // Convert base64 back to Uint8Array
        const encryptedBytes = new Uint8Array(
          atob(encryptedData.encrypted)
            .split('')
            .map(char => char.charCodeAt(0))
        );

        const iv = new Uint8Array(
          atob(encryptedData.iv)
            .split('')
            .map(char => char.charCodeAt(0))
        );

        // Decrypt the data
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          {
            name: this.algorithm,
            iv: iv
          },
          this.encryptionKey,
          encryptedBytes
        );

        // Convert back to string and parse JSON
        const decryptedString = new TextDecoder().decode(decryptedBuffer);
        const decryptedData = JSON.parse(decryptedString);

        medicalLogger.debug('Data decrypted successfully', {
          category: LOG_CATEGORIES.SECURITY,
          dataSize: decryptedString.length
        });

        return decryptedData;
      },
      {
        category: ERROR_CATEGORIES.SECURITY,
        severity: ERROR_SEVERITY.MEDIUM,
        fallback: () => {
          medicalLogger.warn('Decryption failed, returning null', {
            category: LOG_CATEGORIES.SECURITY
          });
          return null;
        },
        context: { operation: 'data_decryption' }
      }
    );
  }

  /**
   * Securely store encrypted data
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @param {boolean} useSessionStorage - Use sessionStorage instead of localStorage
   */
  async secureStore(key, data, useSessionStorage = false) {
    return safeAsync(
      async () => {
        const storage = useSessionStorage ? sessionStorage : localStorage;

        // Encrypt the data
        const encryptedData = await this.encryptData(data);

        // Store with encrypted prefix to identify encrypted data
        const storageKey = `_enc_${key}`;
        storage.setItem(storageKey, encryptedData);

        medicalLogger.debug('Data stored securely', {
          category: LOG_CATEGORIES.SECURITY,
          key: storageKey,
          storage: useSessionStorage ? 'session' : 'local'
        });

        return true;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'secure_store', key }
      }
    );
  }

  /**
   * Securely retrieve and decrypt data
   * @param {string} key - Storage key
   * @param {boolean} useSessionStorage - Use sessionStorage instead of localStorage
   * @returns {Promise<any>} Decrypted data or null
   */
  async secureRetrieve(key, useSessionStorage = false) {
    return safeAsync(
      async () => {
        const storage = useSessionStorage ? sessionStorage : localStorage;
        const storageKey = `_enc_${key}`;

        const encryptedData = storage.getItem(storageKey);
        if (!encryptedData) {
          // Try legacy unencrypted key
          const legacyData = storage.getItem(key);
          if (legacyData) {
            medicalLogger.debug('Retrieved legacy unencrypted data', {
              category: LOG_CATEGORIES.SECURITY,
              key
            });
            try {
              return JSON.parse(legacyData);
            } catch (error) {
              return legacyData;
            }
          }
          return null;
        }

        // Decrypt the data
        const decryptedData = await this.decryptData(encryptedData);

        medicalLogger.debug('Data retrieved securely', {
          category: LOG_CATEGORIES.SECURITY,
          key: storageKey,
          storage: useSessionStorage ? 'session' : 'local',
          hasData: !!decryptedData
        });

        return decryptedData;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'secure_retrieve', key }
      }
    );
  }

  /**
   * Securely remove data
   * @param {string} key - Storage key
   * @param {boolean} useSessionStorage - Use sessionStorage instead of localStorage
   */
  async secureRemove(key, useSessionStorage = false) {
    return safeAsync(
      async () => {
        const storage = useSessionStorage ? sessionStorage : localStorage;
        const storageKey = `_enc_${key}`;

        // Remove both encrypted and legacy versions
        storage.removeItem(storageKey);
        storage.removeItem(key);

        medicalLogger.debug('Data removed securely', {
          category: LOG_CATEGORIES.SECURITY,
          key: storageKey,
          storage: useSessionStorage ? 'session' : 'local'
        });

        return true;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'secure_remove', key }
      }
    );
  }

  /**
   * Check if data is encrypted
   * @param {string} dataString - Data string to check
   * @returns {boolean} True if data appears to be encrypted
   */
  isDataEncrypted(dataString) {
    try {
      const parsed = JSON.parse(dataString);
      return !!(parsed.encrypted && parsed.iv && parsed.version);
    } catch (error) {
      return false;
    }
  }

  /**
   * Migrate legacy unencrypted data to encrypted format
   * @param {string} key - Storage key
   * @param {boolean} useSessionStorage - Use sessionStorage instead of localStorage
   */
  async migrateLegacyData(key, useSessionStorage = false) {
    return safeAsync(
      async () => {
        const storage = useSessionStorage ? sessionStorage : localStorage;
        const legacyData = storage.getItem(key);

        if (legacyData && !this.isDataEncrypted(legacyData)) {
          medicalLogger.info('Migrating legacy unencrypted data', {
            category: LOG_CATEGORIES.SECURITY,
            key
          });

          // Parse legacy data
          let parsedData;
          try {
            parsedData = JSON.parse(legacyData);
          } catch (error) {
            parsedData = legacyData;
          }

          // Store encrypted version
          await this.secureStore(key.replace('_enc_', ''), parsedData, useSessionStorage);

          // Remove legacy version
          storage.removeItem(key);

          medicalLogger.info('Legacy data migration completed', {
            category: LOG_CATEGORIES.SECURITY,
            key
          });

          return true;
        }

        return false;
      },
      {
        category: ERROR_CATEGORIES.STORAGE,
        context: { operation: 'migrate_legacy_data', key }
      }
    );
  }

  /**
   * Clear all encryption keys (for logout)
   */
  clearEncryptionKeys() {
    try {
      sessionStorage.removeItem('_medical_km');
      this.encryptionKey = null;

      medicalLogger.info('Encryption keys cleared', {
        category: LOG_CATEGORIES.SECURITY
      });
    } catch (error) {
      medicalLogger.warn('Failed to clear encryption keys', {
        category: LOG_CATEGORIES.SECURITY,
        error: error.message
      });
    }
  }

  /**
   * Get encryption status
   */
  getStatus() {
    return {
      isSupported: this.isSupported,
      isInitialized: !!this.encryptionKey,
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      version: this.version
    };
  }
}

// Create global instance
export const medicalEncryption = new MedicalDataEncryption();

// Convenience functions
export const secureStore = (key, data, useSessionStorage = false) =>
  medicalEncryption.secureStore(key, data, useSessionStorage);

export const secureRetrieve = (key, useSessionStorage = false) =>
  medicalEncryption.secureRetrieve(key, useSessionStorage);

export const secureRemove = (key, useSessionStorage = false) =>
  medicalEncryption.secureRemove(key, useSessionStorage);

export const clearEncryptionKeys = () =>
  medicalEncryption.clearEncryptionKeys();