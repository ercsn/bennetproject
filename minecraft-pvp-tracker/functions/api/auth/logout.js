// POST /api/auth/logout - Logout user
// Note: Since we use stateless JWT tokens, logout is handled client-side
// This endpoint exists for API completeness and future token blacklisting

export async function onRequestPost(context) {
    return new Response(JSON.stringify({
        success: true,
        message: 'Logged out successfully'
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}
