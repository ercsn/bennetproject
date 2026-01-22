// GET /api/auth/me - Get current user info (verify token)

import { requireAuth } from '../../lib/auth.js';

export async function onRequestGet(context) {
    const auth = await requireAuth(context);
    if (!auth.authenticated) {
        return auth.response;
    }

    return new Response(JSON.stringify({
        user: {
            id: auth.user.userId,
            email: auth.user.email
        }
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}
