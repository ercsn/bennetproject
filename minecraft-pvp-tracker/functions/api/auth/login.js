// POST /api/auth/login - Login user

import { verifyPassword } from '../../lib/crypto.js';
import { createToken } from '../../lib/jwt.js';

export async function onRequestPost(context) {
    try {
        const { DB } = context.env;
        const body = await context.request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Find user
        const user = await DB.prepare(
            'SELECT id, email, password_hash, salt FROM users WHERE email = ?'
        ).bind(email.toLowerCase()).first();

        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash, user.salt);

        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Create JWT token
        const token = await createToken(
            { userId: user.id, email: user.email },
            context.env.JWT_SECRET
        );

        return new Response(JSON.stringify({
            success: true,
            token,
            user: { id: user.id, email: user.email }
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
