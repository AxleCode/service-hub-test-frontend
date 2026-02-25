/**
 * Secure Storage Utility
 * Encrypts and decrypts credentials before storing in localStorage
 * Uses Web Crypto API for AES-GCM encryption
 */

const STORAGE_KEY = 'secure_credentials';
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

interface Credentials {
  username: string;
  password: string;
}

/**
 * Derives a cryptographic key from a passphrase using PBKDF2
 * This creates a unique key for each browser based on a combination of factors
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generates a unique device identifier based on browser characteristics
 * This is used as part of the encryption key
 */
function getDeviceId(): string {
  // Create a relatively stable device identifier
  // Note: This is obfuscation, not true security - the key is to make it harder for casual inspection
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const platform = navigator.platform;
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;
  
  return `${userAgent}-${language}-${platform}-${hardwareConcurrency}`;
}

/**
 * Encrypts credentials and stores them in localStorage
 */
export async function saveEncryptedCredentials(
  username: string,
  password: string
): Promise<void> {
  try {
    const credentials: Credentials = { username, password };
    const data = JSON.stringify(credentials);
    
    // Generate a salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive encryption key from device-specific data
    const deviceId = getDeviceId();
    const key = await deriveKey(deviceId, salt);
    
    // Generate IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encoder = new TextEncoder();
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      encoder.encode(data)
    );
    
    // Combine salt, IV, and encrypted data
    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encryptedArray, salt.length + iv.length);
    
    // Convert to base64 for storage
    const base64 = btoa(String.fromCharCode(...combined));
    
    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, base64);
  } catch (error) {
    console.error('Failed to encrypt and save credentials:', error);
    throw new Error('Failed to save credentials securely');
  }
}

/**
 * Retrieves and decrypts credentials from localStorage
 */
export async function getEncryptedCredentials(): Promise<Credentials | null> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return null;
    }
    
    // Decode from base64
    const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
    
    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encryptedData = combined.slice(28);
    
    // Derive the same key
    const deviceId = getDeviceId();
    const key = await deriveKey(deviceId, salt);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      encryptedData
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    
    // Parse and return credentials
    const credentials: Credentials = JSON.parse(jsonString);
    return credentials;
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return null;
  }
}

/**
 * Removes stored credentials from localStorage
 */
export function clearEncryptedCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Checks if encrypted credentials exist in storage
 */
export function hasStoredCredentials(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

