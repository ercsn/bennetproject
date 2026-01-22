// JWT utilities using HS256 (HMAC SHA-256)

const TOKEN_EXPIRY_DAYS = 7;

// Create a JWT token
export async function createToken(payload, secret) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60)
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = await sign(signatureInput, secret);

    return `${signatureInput}.${signature}`;
}

// Verify and decode a JWT token
export async function verifyToken(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { valid: false, error: 'Invalid token format' };
        }

        const [encodedHeader, encodedPayload, signature] = parts;
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        // Verify signature
        const expectedSignature = await sign(signatureInput, secret);
        if (signature !== expectedSignature) {
            return { valid: false, error: 'Invalid signature' };
        }

        // Decode payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload));

        // Check expiry
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return { valid: false, error: 'Token expired' };
        }

        return { valid: true, payload };
    } catch (error) {
        return { valid: false, error: 'Token verification failed' };
    }
}

// HMAC SHA-256 signature
async function sign(data, secret) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    return arrayBufferToBase64Url(signature);
}

// Base64 URL encoding (no padding, URL-safe characters)
function base64UrlEncode(str) {
    const base64 = btoa(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Base64 URL decoding
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padding = base64.length % 4;
    if (padding) {
        base64 += '='.repeat(4 - padding);
    }
    return atob(base64);
}

// Convert ArrayBuffer to base64url
function arrayBufferToBase64Url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
