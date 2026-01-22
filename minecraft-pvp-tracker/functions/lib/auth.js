// Auth middleware for protected endpoints

import { verifyToken } from './jwt.js';

// Require authentication for a request
// Returns { authenticated: true, user: { userId, email } } or { authenticated: false, response: Response }
export async function requireAuth(context) {
    const authHeader = context.request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            authenticated: false,
            response: new Response(JSON.stringify({ error: 'Authentication required' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
        };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const secret = context.env.JWT_SECRET;

    if (!secret) {
        return {
            authenticated: false,
            response: new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
        };
    }

    const result = await verifyToken(token, secret);

    if (!result.valid) {
        return {
            authenticated: false,
            response: new Response(JSON.stringify({ error: result.error || 'Invalid token' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
        };
    }

    return {
        authenticated: true,
        user: {
            userId: result.payload.userId,
            email: result.payload.email
        }
    };
}
