// import { authStore, type User } from '$lib/stores/authStore';
// import { goto } from '$app/navigation';
// import { browser } from '$app/environment';

// // For a real implementation, these would be API calls to your backend
// // This is a simplified mock version for demonstration

// // Mock user database
// const MOCK_USERS = [
//     {
//         id: '1',
//         username: 'user1',
//         email: 'user1@example.com',
//         password: 'password123'
//     }
// ];

// // Register a new user
// export async function register(username: string, email: string, password: string): Promise<{ success: boolean, message?: string }> {
//     try {
//         // Check if user already exists
//         const existingUser = MOCK_USERS.find(u => u.email === email || u.username === username);
//         if (existingUser) {
//             return {
//                 success: false,
//                 message: 'Username or email already exists'
//             };
//         }

//         // Create new user
//         const newUser = {
//             id: (MOCK_USERS.length + 1).toString(),
//             username,
//             email,
//             password
//         };

//         MOCK_USERS.push(newUser);

//         // Create JWT token
//         const token = createJwtToken(newUser.id);

//         // Set the cookie FIRST
//         setAuthCookie(token);

//         // Then update the store
//         const userWithoutPassword: User = {
//             id: newUser.id,
//             username: newUser.username,
//             email: newUser.email
//         };

//         authStore.login(userWithoutPassword, token);

//         return {
//             success: true
//         };
//     } catch (error) {
//         console.error('Registration error:', error);
//         return {
//             success: false,
//             message: 'Registration failed'
//         };
//     }
// }

// // Login an existing user
// export async function login(username: string, password: string): Promise<{ success: boolean, message?: string }> {
//     try {
//         // Find user
//         const user = MOCK_USERS.find(u => u.username === username && u.password === password);

//         if (!user) {
//             return {
//                 success: false,
//                 message: 'Invalid username or password'
//             };
//         }

//         // Create JWT token (mock)
//         const token = createJwtToken(user.id);

//         // Store user in store
//         const userWithoutPassword: User = {
//             id: user.id,
//             username: user.username,
//             email: user.email
//         };

//         authStore.login(userWithoutPassword, token);

//         // Set the cookie
//         setAuthCookie(token);

//         return {
//             success: true
//         };
//     } catch (error) {
//         console.error('Login error:', error);
//         return {
//             success: false,
//             message: 'Login failed'
//         };
//     }
// }

// // Also update the logout function
// export function logout(): void {
//     // Clear token cookie
//     if (browser) {
//         document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
//     }

//     authStore.logout();
//     goto('/login');
// }

// // Verify token (would normally be done on the server)
// export function verifyToken(token: string): boolean {
//     // In a real app, you would verify the JWT signature and expiration
//     return !!token && token.startsWith('mock_jwt_token_');
// }

// export function setAuthCookie(token: string): void {
//     if (browser) {
//         // Use a secure, HTTP-only cookie with proper attributes
//         document.cookie = `token=${token}; path=/; max-age=86400; samesite=lax`;
//     }
// }

// function createJwtToken(userId: string): string {
//     return `mock_jwt_token_${userId}`;
// }

export async function login(email: string, password: string) {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || 'Login failed');
	}

	const { token } = await res.json();
	localStorage.setItem('token', token); // Tu peux aussi utiliser un store Svelte
	return token;
}

export async function register(email: string, password: string) {
	const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });    

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || 'Registration failed');
	}

	return await res.json();
}

export function logout() {
	localStorage.removeItem('token');
}

export function getToken(): string | null {
	return localStorage.getItem('token');
}

export function isLoggedIn(): boolean {
	return !!getToken();
}
