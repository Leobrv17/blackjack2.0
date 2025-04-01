import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { authStore } from '$lib/stores/authStore';
import { verifyToken } from '$lib/services/authService';

// This runs on both server and client sides
export const load = async ({ cookies }) => {
    // Only run this code in the browser
    if (browser) {
        // Get the token from cookies
        const tokenCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const currentAuthState = get(authStore);

        if (tokenCookie && verifyToken(tokenCookie)) {
            // If there's a valid token but the user isn't authenticated in the store,
            // we need to sync the authentication state
            if (!currentAuthState.isAuthenticated) {
                // In a real app, you'd make an API call to get the user info from the token
                // For demo purposes, we'll just set some basic info
                authStore.login(
                    {
                        id: '1',
                        username: 'user1',
                        email: 'user1@example.com'
                    },
                    tokenCookie
                );
            }
        } else if (currentAuthState.isAuthenticated) {
            // If there's no valid token but the user is authenticated in the store,
            // we need to log them out
            authStore.logout();
        }
    }

    return {
        // You can return data here that will be available in the layout component
    };
};