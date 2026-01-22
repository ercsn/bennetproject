// Frontend authentication utilities

const TOKEN_KEY = 'pvp_auth_token';
const USER_KEY = 'pvp_auth_user';

// Get the stored authentication token
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Get the stored user info
export function getUser() {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

// Check if user is authenticated
export function isAuthenticated() {
    return !!getToken();
}

// Store authentication data
export function setAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear authentication data (logout)
export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Logout and redirect to login page
export function logout() {
    clearAuth();
    window.location.href = '/login.html';
}

// Require authentication - redirects to login if not authenticated
// Returns true if authenticated, false if redirecting
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Fetch wrapper that includes the auth token
export async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (!token) {
        logout();
        throw new Error('Not authenticated');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    // If unauthorized, clear auth and redirect to login
    if (response.status === 401) {
        clearAuth();
        window.location.href = '/login.html';
        throw new Error('Session expired');
    }

    return response;
}

// Verify token is still valid by calling /api/auth/me
export async function verifyAuth() {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            clearAuth();
            return false;
        }

        return true;
    } catch (error) {
        clearAuth();
        return false;
    }
}

// Login user
export async function login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }

    setAuth(data.token, data.user);
    return data;
}

// Register user
export async function register(email, password) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }

    setAuth(data.token, data.user);
    return data;
}
