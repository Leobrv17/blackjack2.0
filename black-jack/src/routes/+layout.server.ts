import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const token = cookies.get('token');
    const isProtectedRoute = ['/game', '/profile'].some(route =>
        url.pathname === route || url.pathname.startsWith(`${route}/`)
    );

    return {
        // Pass the auth state to the client
        authToken: token,
        isAuthenticated: !!token,
        isProtectedRoute
    };
};