import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define user type
export type User = {
    id: string;
    username: string;
    email: string;
    // Add other user properties as needed
};

// Initial state
const storedUser = browser && localStorage.getItem('user');
const storedToken = browser && localStorage.getItem('token');

// Create store
const createAuthStore = () => {
    const { subscribe, set, update } = writable<{
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
    }>({
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        isAuthenticated: !!storedToken
    });

    return {
        subscribe,
        login: (user: User, token: string) => {
            // Store in localStorage
            if (browser) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
            }
            
            // Update store
            set({ user, token, isAuthenticated: true });
        },
        logout: () => {
            // Clear localStorage
            if (browser) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
            
            // Update store
            set({ user: null, token: null, isAuthenticated: false });
        },
        updateUser: (user: User) => {
            update(state => {
                if (browser) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
                return { ...state, user };
            });
        },
        updateToken: (token: string) => {
            update(state => {
                if (browser) {
                    localStorage.setItem('token', token);
                }
                return { ...state, token };
            });
        }
    };
};

export const authStore = createAuthStore();