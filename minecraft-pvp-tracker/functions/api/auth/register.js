// POST /api/auth/register - Register a new user

import { generateSalt, hashPassword } from '../../lib/crypto.js';
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: 'Invalid email format' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Validate password length
        if (password.length < 8) {
            return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Check if user already exists
        const existingUser = await DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email already registered' }), {
                status: 409,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Hash password
        const salt = await generateSalt();
        const passwordHash = await hashPassword(password, salt);

        // Insert user
        const result = await DB.prepare(
            'INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)'
        ).bind(email.toLowerCase(), passwordHash, salt).run();

        const userId = result.meta.last_row_id;

        // Create JWT token
        const token = await createToken(
            { userId, email: email.toLowerCase() },
            context.env.JWT_SECRET
        );

        return new Response(JSON.stringify({
            success: true,
            token,
            user: { id: userId, email: email.toLowerCase() }
        }), {
            status: 201,
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
