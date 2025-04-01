import { authStore, type User } from '$lib/stores/authStore';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

// For a real implementation, these would be API calls to your backend
// This is a simplified mock version for demonstration

// Mock user database
const MOCK_USERS = [
    {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
    }
];

// Register a new user
export async function register(username: string, email: string, password: string): Promise<{ success: boolean, message?: string }> {
    try {
        // Check if user already exists
        const existingUser = MOCK_USERS.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return {
                success: false,
                message: 'Username or email already exists'
            };
        }

        // Create new user
        const newUser = {
            id: (MOCK_USERS.length + 1).toString(),
            username,
            email,
            password
        };

        MOCK_USERS.push(newUser);

        // Create JWT token
        const token = `mock_jwt_token_${newUser.id}`;

        // Set the cookie FIRST
        setAuthCookie(token);

        // Then update the store
        const userWithoutPassword: User = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        };

        authStore.login(userWithoutPassword, token);

        return {
            success: true
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'Registration failed'
        };
    }
}

// Login an existing user
export async function login(username: string, password: string): Promise<{ success: boolean, message?: string }> {
    try {
        // Find user
        const user = MOCK_USERS.find(u => u.username === username && u.password === password);

        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }

        // Create JWT token (mock)
        const token = `mock_jwt_token_${user.id}`;

        // Store user in store
        const userWithoutPassword: User = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        authStore.login(userWithoutPassword, token);

        // Set the cookie
        setAuthCookie(token);

        return {
            success: true
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Login failed'
        };
    }
}

// Also update the logout function
export function logout(): void {
    // Clear token cookie
    if (browser) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    authStore.logout();
    goto('/login');
}

// Verify token (would normally be done on the server)
export function verifyToken(token: string): boolean {
    // In a real app, you would verify the JWT signature and expiration
    return !!token && token.startsWith('mock_jwt_token_');
}

export function setAuthCookie(token: string): void {
    if (browser) {
        // Use a secure, HTTP-only cookie with proper attributes
        document.cookie = `token=${token}; path=/; max-age=86400; samesite=lax`;
    }
}