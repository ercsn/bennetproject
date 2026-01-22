// Password hashing utilities using PBKDF2 (Web Crypto API)

const ITERATIONS = 100000;
const KEY_LENGTH = 32; // 256 bits
const SALT_LENGTH = 16; // 128 bits

// Generate a random salt
export async function generateSalt() {
    const salt = new Uint8Array(SALT_LENGTH);
    crypto.getRandomValues(salt);
    return arrayBufferToBase64(salt);
}

// Hash a password with PBKDF2
export async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = base64ToArrayBuffer(salt);

    // Import password as a key
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    // Derive bits using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        KEY_LENGTH * 8
    );

    return arrayBufferToBase64(derivedBits);
}

// Verify a password against a stored hash
export async function verifyPassword(password, storedHash, salt) {
    const hash = await hashPassword(password, salt);
    return hash === storedHash;
}

// Helper: Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Helper: Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}
